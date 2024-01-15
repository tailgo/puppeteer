/*! For license information please see 1ec2b0e3.f86d7131.js.LICENSE.txt */
"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[97474],{92597:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>a,contentTitle:()=>o,default:()=>p,frontMatter:()=>l,metadata:()=>i,toc:()=>c});var s=n(85893),r=n(11151);const l={},o="Query Selectors (legacy)",i={id:"guides/query-selectors-legacy",title:"Query Selectors (legacy)",description:"Queries are the primary mechanism for interacting with the DOM on your site. For example, a typical workflow goes like:",source:"@site/versioned_docs/version-21.7.0/guides/query-selectors-legacy.md",sourceDirName:"guides",slug:"/guides/query-selectors-legacy",permalink:"/guides/query-selectors-legacy",draft:!1,unlisted:!1,tags:[],version:"21.7.0",frontMatter:{}},a={},c=[{value:"CSS",id:"css",level:2},{value:"Example",id:"example",level:3},{value:"Built-in selectors",id:"built-in-selectors",level:2},{value:"Text selectors (<code>text/</code>)",id:"text-selectors-text",level:3},{value:"Example",id:"example-1",level:4},{value:"XPath selectors (<code>xpath/</code>)",id:"xpath-selectors-xpath",level:3},{value:"Example",id:"example-2",level:4},{value:"ARIA selectors (<code>aria/</code>)",id:"aria-selectors-aria",level:3},{value:"Example",id:"example-3",level:4},{value:"Pierce selectors (<code>pierce/</code>)",id:"pierce-selectors-pierce",level:3},{value:"Example",id:"example-4",level:4},{value:"Custom selectors",id:"custom-selectors",level:2}];function d(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",p:"p",pre:"pre",strong:"strong",...(0,r.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"query-selectors-legacy",children:"Query Selectors (legacy)"}),"\n",(0,s.jsx)(t.p,{children:"Queries are the primary mechanism for interacting with the DOM on your site. For example, a typical workflow goes like:"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"// Import puppeteer\nimport puppeteer from 'puppeteer';\n\n(async () => {\n  // Launch the browser\n  const browser = await puppeteer.launch();\n\n  // Create a page\n  const page = await browser.newPage();\n\n  // Go to your site\n  await page.goto('YOUR_SITE');\n\n  // Query for an element handle.\n  const element = await page.waitForSelector('div > .class-name');\n\n  // Do something with element...\n  await element.click(); // Just an example.\n\n  // Dispose of handle\n  await element.dispose();\n\n  // Close browser.\n  await browser.close();\n})();\n"})}),"\n",(0,s.jsx)(t.h2,{id:"css",children:"CSS"}),"\n",(0,s.jsxs)(t.p,{children:["CSS selectors follow the CSS spec of the browser being automated. We provide some basic type deduction for CSS selectors (such as ",(0,s.jsx)(t.code,{children:"HTMLInputElement"})," for ",(0,s.jsx)(t.code,{children:"input"}),"), but any selector that contains no type information (such as ",(0,s.jsx)(t.code,{children:".class-name"}),") will need to be coerced manually using TypeScript's ",(0,s.jsx)(t.code,{children:"as"})," coercion mechanism."]}),"\n",(0,s.jsx)(t.h3,{id:"example",children:"Example"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"// Automatic\nconst element = await page.waitForSelector('div > input');\n// Manual\nconst element = (await page.waitForSelector(\n  'div > .class-name-for-input'\n)) as HTMLInputElement;\n"})}),"\n",(0,s.jsx)(t.h2,{id:"built-in-selectors",children:"Built-in selectors"}),"\n",(0,s.jsxs)(t.p,{children:["Built-in selectors are Puppeteer's own class of selectors for doing things CSS cannot. Every built-in selector starts with a prefix ",(0,s.jsx)(t.code,{children:".../"})," to assist Puppeteer in distinguishing between CSS selectors and a built-in."]}),"\n",(0,s.jsxs)(t.h3,{id:"text-selectors-text",children:["Text selectors (",(0,s.jsx)(t.code,{children:"text/"}),")"]}),"\n",(0,s.jsx)(t.p,{children:'Text selectors will select "minimal" elements containing the given text, even within (open) shadow roots. Here, "minimum" means the deepest elements that contain a given text, but not their parents (which technically will also contain the given text).'}),"\n",(0,s.jsx)(t.h4,{id:"example-1",children:"Example"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"// Note we usually need type coercion since the type cannot be deduced, but for text selectors, `instanceof` checks may be better for runtime validation.\nconst element = await page.waitForSelector('text/My name is Jun');\n"})}),"\n",(0,s.jsxs)(t.h3,{id:"xpath-selectors-xpath",children:["XPath selectors (",(0,s.jsx)(t.code,{children:"xpath/"}),")"]}),"\n",(0,s.jsxs)(t.p,{children:["XPath selectors will use the browser's native ",(0,s.jsx)(t.a,{href:"https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate",children:(0,s.jsx)(t.code,{children:"Document.evaluate"})})," to query for elements."]}),"\n",(0,s.jsx)(t.h4,{id:"example-2",children:"Example"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"// There is not type deduction for XPaths.\nconst node = await page.waitForSelector('xpath/h2');\n"})}),"\n",(0,s.jsxs)(t.h3,{id:"aria-selectors-aria",children:["ARIA selectors (",(0,s.jsx)(t.code,{children:"aria/"}),")"]}),"\n",(0,s.jsx)(t.p,{children:"ARIA selectors can be used to find elements with a given ARIA label. These labels are computed using Chrome's internal representation."}),"\n",(0,s.jsx)(t.h4,{id:"example-3",children:"Example"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"const node = await page.waitForSelector('aria/Button name');\n"})}),"\n",(0,s.jsxs)(t.h3,{id:"pierce-selectors-pierce",children:["Pierce selectors (",(0,s.jsx)(t.code,{children:"pierce/"}),")"]}),"\n",(0,s.jsxs)(t.p,{children:["Pierce selectors will run the ",(0,s.jsx)(t.code,{children:"querySelector*"})," API on the document and all shadow roots to find an element."]}),"\n",(0,s.jsx)(t.admonition,{type:"danger",children:(0,s.jsxs)(t.p,{children:["Selectors will ",(0,s.jsx)(t.strong,{children:"not"})," ",(0,s.jsx)(t.em,{children:"partially"})," pierce through shadow roots. See the examples below."]})}),"\n",(0,s.jsx)(t.h4,{id:"example-4",children:"Example"}),"\n",(0,s.jsx)(t.p,{children:"Suppose the HTML is"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-html",children:"<div>\n  <custom-element>\n    <div></div>\n  </custom-element>\n</div>\n"})}),"\n",(0,s.jsx)(t.p,{children:"Then"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:"// This will be two elements because of the outer and inner div.\nexpect((await page.$$('pierce/div')).length).toBe(2);\n\n// Partial piercing doesn't work.\nexpect((await page.$$('pierce/div div')).length).toBe(0);\n"})}),"\n",(0,s.jsx)(t.h2,{id:"custom-selectors",children:"Custom selectors"}),"\n",(0,s.jsxs)(t.p,{children:["Puppeteer provides users the ability to add their own query selectors to Puppeteer using ",(0,s.jsx)(t.a,{href:"/api/puppeteer.registercustomqueryhandler",children:"Puppeteer.registerCustomQueryHandler"}),". This is useful for creating custom selectors based on framework objects or other vendor-specific objects."]})]})}function p(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},75251:(e,t,n)=>{var s=n(67294),r=Symbol.for("react.element"),l=Symbol.for("react.fragment"),o=Object.prototype.hasOwnProperty,i=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,a={key:!0,ref:!0,__self:!0,__source:!0};function c(e,t,n){var s,l={},c=null,d=null;for(s in void 0!==n&&(c=""+n),void 0!==t.key&&(c=""+t.key),void 0!==t.ref&&(d=t.ref),t)o.call(t,s)&&!a.hasOwnProperty(s)&&(l[s]=t[s]);if(e&&e.defaultProps)for(s in t=e.defaultProps)void 0===l[s]&&(l[s]=t[s]);return{$$typeof:r,type:e,key:c,ref:d,props:l,_owner:i.current}}t.Fragment=l,t.jsx=c,t.jsxs=c},85893:(e,t,n)=>{e.exports=n(75251)},11151:(e,t,n)=>{n.d(t,{Z:()=>i,a:()=>o});var s=n(67294);const r={},l=s.createContext(r);function o(e){const t=s.useContext(l);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),s.createElement(l.Provider,{value:t},e.children)}}}]);