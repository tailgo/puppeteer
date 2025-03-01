/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import type FS from 'fs/promises';
import type {Readable} from 'stream';

import type {Protocol} from 'devtools-protocol';

import {
  filterAsync,
  firstValueFrom,
  from,
  map,
  NEVER,
  Observable,
  raceWith,
  timer,
} from '../../third_party/rxjs/rxjs.js';
import type {CDPSession} from '../api/CDPSession.js';
import {isNode} from '../environment.js';
import {assert} from '../util/assert.js';
import type {Deferred} from '../util/Deferred.js';
import {isErrorLike} from '../util/ErrorLike.js';

import {debug} from './Debug.js';
import {TimeoutError} from './Errors.js';
import type {EventEmitter, EventType} from './EventEmitter.js';
import type {NetworkManagerEvents} from './NetworkManagerEvents.js';
import type {
  LowerCasePaperFormat,
  ParsedPDFOptions,
  PDFOptions,
} from './PDFOptions.js';
import {paperFormats} from './PDFOptions.js';

/**
 * @internal
 */
export const debugError = debug('puppeteer:error');

/**
 * @internal
 */
export const DEFAULT_VIEWPORT = Object.freeze({width: 800, height: 600});

/**
 * @internal
 */
export function createEvaluationError(
  details: Protocol.Runtime.ExceptionDetails
): unknown {
  let name: string;
  let message: string;
  if (!details.exception) {
    name = 'Error';
    message = details.text;
  } else if (
    (details.exception.type !== 'object' ||
      details.exception.subtype !== 'error') &&
    !details.exception.objectId
  ) {
    return valueFromRemoteObject(details.exception);
  } else {
    const detail = getErrorDetails(details);
    name = detail.name;
    message = detail.message;
  }
  const messageHeight = message.split('\n').length;
  const error = new Error(message);
  error.name = name;
  const stackLines = error.stack!.split('\n');
  const messageLines = stackLines.splice(0, messageHeight);

  // The first line is this function which we ignore.
  stackLines.shift();
  if (details.stackTrace && stackLines.length < Error.stackTraceLimit) {
    for (const frame of details.stackTrace.callFrames.reverse()) {
      if (
        PuppeteerURL.isPuppeteerURL(frame.url) &&
        frame.url !== PuppeteerURL.INTERNAL_URL
      ) {
        const url = PuppeteerURL.parse(frame.url);
        stackLines.unshift(
          `    at ${frame.functionName || url.functionName} (${
            url.functionName
          } at ${url.siteString}, <anonymous>:${frame.lineNumber}:${
            frame.columnNumber
          })`
        );
      } else {
        stackLines.push(
          `    at ${frame.functionName || '<anonymous>'} (${frame.url}:${
            frame.lineNumber
          }:${frame.columnNumber})`
        );
      }
      if (stackLines.length >= Error.stackTraceLimit) {
        break;
      }
    }
  }

  error.stack = [...messageLines, ...stackLines].join('\n');
  return error;
}

/**
 * @internal
 */
export function createClientError(
  details: Protocol.Runtime.ExceptionDetails
): Error {
  let name: string;
  let message: string;
  if (!details.exception) {
    name = 'Error';
    message = details.text;
  } else if (
    (details.exception.type !== 'object' ||
      details.exception.subtype !== 'error') &&
    !details.exception.objectId
  ) {
    return valueFromRemoteObject(details.exception);
  } else {
    const detail = getErrorDetails(details);
    name = detail.name;
    message = detail.message;
  }
  const error = new Error(message);
  error.name = name;

  const messageHeight = error.message.split('\n').length;
  const messageLines = error.stack!.split('\n').splice(0, messageHeight);

  const stackLines = [];
  if (details.stackTrace) {
    for (const frame of details.stackTrace.callFrames) {
      // Note we need to add `1` because the values are 0-indexed.
      stackLines.push(
        `    at ${frame.functionName || '<anonymous>'} (${frame.url}:${
          frame.lineNumber + 1
        }:${frame.columnNumber + 1})`
      );
      if (stackLines.length >= Error.stackTraceLimit) {
        break;
      }
    }
  }

  error.stack = [...messageLines, ...stackLines].join('\n');
  return error;
}

const getErrorDetails = (details: Protocol.Runtime.ExceptionDetails) => {
  let name = '';
  let message: string;
  const lines = details.exception?.description?.split('\n    at ') ?? [];
  const size = Math.min(
    details.stackTrace?.callFrames.length ?? 0,
    lines.length - 1
  );
  lines.splice(-size, size);
  if (details.exception?.className) {
    name = details.exception.className;
  }
  message = lines.join('\n');
  if (name && message.startsWith(`${name}: `)) {
    message = message.slice(name.length + 2);
  }
  return {message, name};
};

/**
 * @internal
 */
const SOURCE_URL = Symbol('Source URL for Puppeteer evaluation scripts');

/**
 * @internal
 */
export class PuppeteerURL {
  static INTERNAL_URL = 'pptr:internal';

  static fromCallSite(
    functionName: string,
    site: NodeJS.CallSite
  ): PuppeteerURL {
    const url = new PuppeteerURL();
    url.#functionName = functionName;
    url.#siteString = site.toString();
    return url;
  }

  static parse = (url: string): PuppeteerURL => {
    url = url.slice('pptr:'.length);
    const [functionName = '', siteString = ''] = url.split(';');
    const puppeteerUrl = new PuppeteerURL();
    puppeteerUrl.#functionName = functionName;
    puppeteerUrl.#siteString = decodeURIComponent(siteString);
    return puppeteerUrl;
  };

  static isPuppeteerURL = (url: string): boolean => {
    return url.startsWith('pptr:');
  };

  #functionName!: string;
  #siteString!: string;

  get functionName(): string {
    return this.#functionName;
  }

  get siteString(): string {
    return this.#siteString;
  }

  toString(): string {
    return `pptr:${[
      this.#functionName,
      encodeURIComponent(this.#siteString),
    ].join(';')}`;
  }
}

/**
 * @internal
 */
export const withSourcePuppeteerURLIfNone = <T extends NonNullable<unknown>>(
  functionName: string,
  object: T
): T => {
  if (Object.prototype.hasOwnProperty.call(object, SOURCE_URL)) {
    return object;
  }
  const original = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => {
    // First element is the function.
    // Second element is the caller of this function.
    // Third element is the caller of the caller of this function
    // which is precisely what we want.
    return stack[2];
  };
  const site = new Error().stack as unknown as NodeJS.CallSite;
  Error.prepareStackTrace = original;
  return Object.assign(object, {
    [SOURCE_URL]: PuppeteerURL.fromCallSite(functionName, site),
  });
};

/**
 * @internal
 */
export const getSourcePuppeteerURLIfAvailable = <
  T extends NonNullable<unknown>,
>(
  object: T
): PuppeteerURL | undefined => {
  if (Object.prototype.hasOwnProperty.call(object, SOURCE_URL)) {
    return object[SOURCE_URL as keyof T] as PuppeteerURL;
  }
  return undefined;
};

/**
 * @internal
 */
export function valueFromRemoteObject(
  remoteObject: Protocol.Runtime.RemoteObject
): any {
  assert(!remoteObject.objectId, 'Cannot extract value when objectId is given');
  if (remoteObject.unserializableValue) {
    if (remoteObject.type === 'bigint') {
      return BigInt(remoteObject.unserializableValue.replace('n', ''));
    }
    switch (remoteObject.unserializableValue) {
      case '-0':
        return -0;
      case 'NaN':
        return NaN;
      case 'Infinity':
        return Infinity;
      case '-Infinity':
        return -Infinity;
      default:
        throw new Error(
          'Unsupported unserializable value: ' +
            remoteObject.unserializableValue
        );
    }
  }
  return remoteObject.value;
}

/**
 * @internal
 */
export const isString = (obj: unknown): obj is string => {
  return typeof obj === 'string' || obj instanceof String;
};

/**
 * @internal
 */
export const isNumber = (obj: unknown): obj is number => {
  return typeof obj === 'number' || obj instanceof Number;
};

/**
 * @internal
 */
export const isPlainObject = (obj: unknown): obj is Record<any, unknown> => {
  return typeof obj === 'object' && obj?.constructor === Object;
};

/**
 * @internal
 */
export const isRegExp = (obj: unknown): obj is RegExp => {
  return typeof obj === 'object' && obj?.constructor === RegExp;
};

/**
 * @internal
 */
export const isDate = (obj: unknown): obj is Date => {
  return typeof obj === 'object' && obj?.constructor === Date;
};

/**
 * @internal
 */
export function evaluationString(
  fun: Function | string,
  ...args: unknown[]
): string {
  if (isString(fun)) {
    assert(args.length === 0, 'Cannot evaluate a string with arguments');
    return fun;
  }

  function serializeArgument(arg: unknown): string {
    if (Object.is(arg, undefined)) {
      return 'undefined';
    }
    return JSON.stringify(arg);
  }

  return `(${fun})(${args.map(serializeArgument).join(',')})`;
}

/**
 * @internal
 */
export function addPageBinding(type: string, name: string): void {
  // This is the CDP binding.
  // @ts-expect-error: In a different context.
  const callCdp = globalThis[name];

  // Depending on the frame loading state either Runtime.evaluate or
  // Page.addScriptToEvaluateOnNewDocument might succeed. Let's check that we
  // don't re-wrap Puppeteer's binding.
  if (callCdp[Symbol.toStringTag] === 'PuppeteerBinding') {
    return;
  }

  // We replace the CDP binding with a Puppeteer binding.
  Object.assign(globalThis, {
    [name](...args: unknown[]): Promise<unknown> {
      // This is the Puppeteer binding.
      // @ts-expect-error: In a different context.
      const callPuppeteer = globalThis[name];
      callPuppeteer.args ??= new Map();
      callPuppeteer.callbacks ??= new Map();

      const seq = (callPuppeteer.lastSeq ?? 0) + 1;
      callPuppeteer.lastSeq = seq;
      callPuppeteer.args.set(seq, args);

      callCdp(
        JSON.stringify({
          type,
          name,
          seq,
          args,
          isTrivial: !args.some(value => {
            return value instanceof Node;
          }),
        })
      );

      return new Promise((resolve, reject) => {
        callPuppeteer.callbacks.set(seq, {
          resolve(value: unknown) {
            callPuppeteer.args.delete(seq);
            resolve(value);
          },
          reject(value?: unknown) {
            callPuppeteer.args.delete(seq);
            reject(value);
          },
        });
      });
    },
  });
  // @ts-expect-error: In a different context.
  globalThis[name][Symbol.toStringTag] = 'PuppeteerBinding';
}

/**
 * @internal
 */
export function pageBindingInitString(type: string, name: string): string {
  return evaluationString(addPageBinding, type, name);
}

/**
 * @internal
 */
let fs: typeof FS | null = null;
/**
 * @internal
 */
export async function importFSPromises(): Promise<typeof FS> {
  if (!fs) {
    try {
      fs = await import('fs/promises');
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(
          'Cannot write to a path outside of a Node-like environment.'
        );
      }
      throw error;
    }
  }
  return fs;
}

/**
 * @internal
 */
export async function getReadableAsBuffer(
  readable: Readable,
  path?: string
): Promise<Buffer | null> {
  const buffers = [];
  if (path) {
    const fs = await importFSPromises();
    const fileHandle = await fs.open(path, 'w+');
    try {
      for await (const chunk of readable) {
        buffers.push(chunk);
        await fileHandle.writeFile(chunk);
      }
    } finally {
      await fileHandle.close();
    }
  } else {
    for await (const chunk of readable) {
      buffers.push(chunk);
    }
  }
  try {
    return Buffer.concat(buffers);
  } catch (error) {
    return null;
  }
}

/**
 * @internal
 */
export async function getReadableFromProtocolStream(
  client: CDPSession,
  handle: string
): Promise<Readable> {
  // TODO: Once Node 18 becomes the lowest supported version, we can migrate to
  // ReadableStream.
  if (!isNode) {
    throw new Error('Cannot create a stream outside of Node.js environment.');
  }

  const {Readable} = await import('stream');

  let eof = false;
  return new Readable({
    async read(size: number) {
      if (eof) {
        return;
      }

      try {
        const response = await client.send('IO.read', {handle, size});
        this.push(response.data, response.base64Encoded ? 'base64' : undefined);
        if (response.eof) {
          eof = true;
          await client.send('IO.close', {handle});
          this.push(null);
        }
      } catch (error) {
        if (isErrorLike(error)) {
          this.destroy(error);
          return;
        }
        throw error;
      }
    },
  });
}

/**
 * @internal
 */
export function getPageContent(): string {
  let content = '';
  for (const node of document.childNodes) {
    switch (node) {
      case document.documentElement:
        content += document.documentElement.outerHTML;
        break;
      default:
        content += new XMLSerializer().serializeToString(node);
        break;
    }
  }

  return content;
}

/**
 * @internal
 */
export function validateDialogType(
  type: string
): 'alert' | 'confirm' | 'prompt' | 'beforeunload' {
  let dialogType = null;
  const validDialogTypes = new Set([
    'alert',
    'confirm',
    'prompt',
    'beforeunload',
  ]);

  if (validDialogTypes.has(type)) {
    dialogType = type;
  }
  assert(dialogType, `Unknown javascript dialog type: ${type}`);
  return dialogType as 'alert' | 'confirm' | 'prompt' | 'beforeunload';
}

/**
 * @internal
 */
export function timeout(ms: number): Observable<never> {
  return ms === 0
    ? NEVER
    : timer(ms).pipe(
        map(() => {
          throw new TimeoutError(`Timed out after waiting ${ms}ms`);
        })
      );
}

/**
 * @internal
 */
export const UTILITY_WORLD_NAME = '__puppeteer_utility_world__';

/**
 * @internal
 */
export const SOURCE_URL_REGEX = /^[\040\t]*\/\/[@#] sourceURL=\s*(\S*?)\s*$/m;
/**
 * @internal
 */
export function getSourceUrlComment(url: string): string {
  return `//# sourceURL=${url}`;
}

/**
 * @internal
 */
export async function waitForHTTP<T extends {url(): string}>(
  networkManager: EventEmitter<NetworkManagerEvents>,
  eventName: EventType,
  urlOrPredicate: string | ((res: T) => boolean | Promise<boolean>),
  /** Time after the function will timeout */
  ms: number,
  cancelation: Deferred<never>
): Promise<T> {
  return await firstValueFrom(
    (fromEmitterEvent(networkManager, eventName) as Observable<T>).pipe(
      filterAsync(async http => {
        if (isString(urlOrPredicate)) {
          return urlOrPredicate === http.url();
        }
        if (typeof urlOrPredicate === 'function') {
          return !!(await urlOrPredicate(http));
        }
        return false;
      }),
      raceWith(timeout(ms), from(cancelation.valueOrThrow()))
    )
  );
}

/**
 * @internal
 */
export const NETWORK_IDLE_TIME = 500;

/**
 * @internal
 */
export function parsePDFOptions(
  options: PDFOptions = {},
  lengthUnit: 'in' | 'cm' = 'in'
): ParsedPDFOptions {
  const defaults: Omit<ParsedPDFOptions, 'width' | 'height' | 'margin'> = {
    scale: 1,
    displayHeaderFooter: false,
    headerTemplate: '',
    footerTemplate: '',
    printBackground: false,
    landscape: false,
    pageRanges: '',
    preferCSSPageSize: false,
    omitBackground: false,
    tagged: false,
  };

  let width = 8.5;
  let height = 11;
  if (options.format) {
    const format =
      paperFormats[options.format.toLowerCase() as LowerCasePaperFormat];
    assert(format, 'Unknown paper format: ' + options.format);
    width = format.width;
    height = format.height;
  } else {
    width = convertPrintParameterToInches(options.width, lengthUnit) ?? width;
    height =
      convertPrintParameterToInches(options.height, lengthUnit) ?? height;
  }

  const margin = {
    top: convertPrintParameterToInches(options.margin?.top, lengthUnit) || 0,
    left: convertPrintParameterToInches(options.margin?.left, lengthUnit) || 0,
    bottom:
      convertPrintParameterToInches(options.margin?.bottom, lengthUnit) || 0,
    right:
      convertPrintParameterToInches(options.margin?.right, lengthUnit) || 0,
  };

  return {
    ...defaults,
    ...options,
    width,
    height,
    margin,
  };
}

/**
 * @internal
 */
export const unitToPixels = {
  px: 1,
  in: 96,
  cm: 37.8,
  mm: 3.78,
};

function convertPrintParameterToInches(
  parameter?: string | number,
  lengthUnit: 'in' | 'cm' = 'in'
): number | undefined {
  if (typeof parameter === 'undefined') {
    return undefined;
  }
  let pixels;
  if (isNumber(parameter)) {
    // Treat numbers as pixel values to be aligned with phantom's paperSize.
    pixels = parameter;
  } else if (isString(parameter)) {
    const text = parameter;
    let unit = text.substring(text.length - 2).toLowerCase();
    let valueText = '';
    if (unit in unitToPixels) {
      valueText = text.substring(0, text.length - 2);
    } else {
      // In case of unknown unit try to parse the whole parameter as number of pixels.
      // This is consistent with phantom's paperSize behavior.
      unit = 'px';
      valueText = text;
    }
    const value = Number(valueText);
    assert(!isNaN(value), 'Failed to parse parameter value: ' + text);
    pixels = value * unitToPixels[unit as keyof typeof unitToPixels];
  } else {
    throw new Error(
      'page.pdf() Cannot handle parameter type: ' + typeof parameter
    );
  }
  return pixels / unitToPixels[lengthUnit];
}

/**
 * @internal
 */
export function fromEmitterEvent<
  Events extends Record<EventType, unknown>,
  Event extends keyof Events,
>(emitter: EventEmitter<Events>, eventName: Event): Observable<Events[Event]> {
  return new Observable(subscriber => {
    const listener = (event: Events[Event]) => {
      subscriber.next(event);
    };
    emitter.on(eventName, listener);
    return () => {
      emitter.off(eventName, listener);
    };
  });
}
