/*! For license information please see e0883aae.9c3bd8ff.js.LICENSE.txt */
"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[37278],{45971:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>o,contentTitle:()=>n,default:()=>d,frontMatter:()=>c,metadata:()=>a,toc:()=>l});var i=t(85893),r=t(11151);const c={sidebar_label:"Accessibility"},n="Accessibility class",a={id:"api/puppeteer.accessibility",title:"Accessibility class",description:"The Accessibility class provides methods for inspecting the browser's accessibility tree. The accessibility tree is used by assistive technology such as screen readers or switches.",source:"@site/versioned_docs/version-21.7.0/api/puppeteer.accessibility.md",sourceDirName:"api",slug:"/api/puppeteer.accessibility",permalink:"/api/puppeteer.accessibility",draft:!1,unlisted:!1,tags:[],version:"21.7.0",frontMatter:{sidebar_label:"Accessibility"},sidebar:"api",previous:{title:"WebWorker.url",permalink:"/api/puppeteer.webworker.url"},next:{title:"Accessibility.snapshot",permalink:"/api/puppeteer.accessibility.snapshot"}},o={},l=[{value:"Signature:",id:"signature",level:4},{value:"Remarks",id:"remarks",level:2},{value:"Methods",id:"methods",level:2}];function h(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",h4:"h4",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,r.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s.h1,{id:"accessibility-class",children:"Accessibility class"}),"\n",(0,i.jsxs)(s.p,{children:["The Accessibility class provides methods for inspecting the browser's accessibility tree. The accessibility tree is used by assistive technology such as ",(0,i.jsx)(s.a,{href:"https://en.wikipedia.org/wiki/Screen_reader",children:"screen readers"})," or ",(0,i.jsx)(s.a,{href:"https://en.wikipedia.org/wiki/Switch_access",children:"switches"}),"."]}),"\n",(0,i.jsx)(s.h4,{id:"signature",children:"Signature:"}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-typescript",children:"export declare class Accessibility\n"})}),"\n",(0,i.jsx)(s.h2,{id:"remarks",children:"Remarks"}),"\n",(0,i.jsx)(s.p,{children:"Accessibility is a very platform-specific thing. On different platforms, there are different screen readers that might have wildly different output."}),"\n",(0,i.jsx)(s.p,{children:'Blink - Chrome\'s rendering engine - has a concept of "accessibility tree", which is then translated into different platform-specific APIs. Accessibility namespace gives users access to the Blink Accessibility Tree.'}),"\n",(0,i.jsx)(s.p,{children:'Most of the accessibility tree gets filtered out when converting from Blink AX Tree to Platform-specific AX-Tree or by assistive technologies themselves. By default, Puppeteer tries to approximate this filtering, exposing only the "interesting" nodes of the tree.'}),"\n",(0,i.jsxs)(s.p,{children:["The constructor for this class is marked as internal. Third-party code should not call the constructor directly or create subclasses that extend the ",(0,i.jsx)(s.code,{children:"Accessibility"})," class."]}),"\n",(0,i.jsx)(s.h2,{id:"methods",children:"Methods"}),"\n",(0,i.jsxs)(s.table,{children:[(0,i.jsx)(s.thead,{children:(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.th,{children:"Method"}),(0,i.jsx)(s.th,{children:"Modifiers"}),(0,i.jsx)(s.th,{children:"Description"})]})}),(0,i.jsx)(s.tbody,{children:(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.td,{children:(0,i.jsx)(s.a,{href:"/api/puppeteer.accessibility.snapshot",children:"snapshot(options)"})}),(0,i.jsx)(s.td,{}),(0,i.jsx)(s.td,{children:"Captures the current state of the accessibility tree. The returned object represents the root accessible node of the page."})]})})]})]})}function d(e={}){const{wrapper:s}={...(0,r.a)(),...e.components};return s?(0,i.jsx)(s,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},75251:(e,s,t)=>{var i=t(67294),r=Symbol.for("react.element"),c=Symbol.for("react.fragment"),n=Object.prototype.hasOwnProperty,a=i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,o={key:!0,ref:!0,__self:!0,__source:!0};function l(e,s,t){var i,c={},l=null,h=null;for(i in void 0!==t&&(l=""+t),void 0!==s.key&&(l=""+s.key),void 0!==s.ref&&(h=s.ref),s)n.call(s,i)&&!o.hasOwnProperty(i)&&(c[i]=s[i]);if(e&&e.defaultProps)for(i in s=e.defaultProps)void 0===c[i]&&(c[i]=s[i]);return{$$typeof:r,type:e,key:l,ref:h,props:c,_owner:a.current}}s.Fragment=c,s.jsx=l,s.jsxs=l},85893:(e,s,t)=>{e.exports=t(75251)},11151:(e,s,t)=>{t.d(s,{Z:()=>a,a:()=>n});var i=t(67294);const r={},c=i.createContext(r);function n(e){const s=i.useContext(c);return i.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function a(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:n(e.components),i.createElement(c.Provider,{value:s},e.children)}}}]);