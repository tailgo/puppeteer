/*! For license information please see 94eb569f.e79d3270.js.LICENSE.txt */
"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[12598],{30861:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>i,default:()=>h,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var r=n(85893),s=n(11151);const o={sidebar_label:"Page.setContent"},i="Page.setContent() method",a={id:"api/puppeteer.page.setcontent",title:"Page.setContent() method",description:"Set the content of the page.",source:"@site/../docs/api/puppeteer.page.setcontent.md",sourceDirName:"api",slug:"/api/puppeteer.page.setcontent",permalink:"/next/api/puppeteer.page.setcontent",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{sidebar_label:"Page.setContent"},sidebar:"api",previous:{title:"Page.setCacheEnabled",permalink:"/next/api/puppeteer.page.setcacheenabled"},next:{title:"Page.setCookie",permalink:"/next/api/puppeteer.page.setcookie"}},d={},c=[{value:"Signature:",id:"signature",level:4},{value:"Parameters",id:"parameters",level:2},{value:"Remarks",id:"remarks",level:2}];function l(e){const t={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,s.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h1,{id:"pagesetcontent-method",children:"Page.setContent() method"}),"\n",(0,r.jsx)(t.p,{children:"Set the content of the page."}),"\n",(0,r.jsx)(t.h4,{id:"signature",children:"Signature:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-typescript",children:"class Page {\n  setContent(html: string, options?: WaitForOptions): Promise<void>;\n}\n"})}),"\n",(0,r.jsx)(t.h2,{id:"parameters",children:"Parameters"}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{children:"Parameter"}),(0,r.jsx)(t.th,{children:"Type"}),(0,r.jsx)(t.th,{children:"Description"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"html"}),(0,r.jsx)(t.td,{children:"string"}),(0,r.jsx)(t.td,{children:"HTML markup to assign to the page."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"options"}),(0,r.jsx)(t.td,{children:(0,r.jsx)(t.a,{href:"/next/api/puppeteer.waitforoptions",children:"WaitForOptions"})}),(0,r.jsxs)(t.td,{children:[(0,r.jsx)(t.em,{children:"(Optional)"})," Parameters that has some properties."]})]})]})]}),"\n",(0,r.jsx)(t.p,{children:(0,r.jsx)(t.strong,{children:"Returns:"})}),"\n",(0,r.jsx)(t.p,{children:"Promise<void>"}),"\n",(0,r.jsx)(t.h2,{id:"remarks",children:"Remarks"}),"\n",(0,r.jsxs)(t.p,{children:["The parameter ",(0,r.jsx)(t.code,{children:"options"})," might have the following options."]}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:["\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.code,{children:"timeout"})," : Maximum time in milliseconds for resources to load, defaults to 30 seconds, pass ",(0,r.jsx)(t.code,{children:"0"})," to disable timeout. The default value can be changed by using the ",(0,r.jsx)(t.a,{href:"/next/api/puppeteer.page.setdefaultnavigationtimeout",children:"Page.setDefaultNavigationTimeout()"})," or ",(0,r.jsx)(t.a,{href:"/next/api/puppeteer.page.setdefaulttimeout",children:"Page.setDefaultTimeout()"})," methods."]}),"\n"]}),"\n",(0,r.jsxs)(t.li,{children:["\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.code,{children:"waitUntil"}),": When to consider setting markup succeeded, defaults to ",(0,r.jsx)(t.code,{children:"load"}),". Given an array of event strings, setting content is considered to be successful after all events have been fired. Events can be either:",(0,r.jsx)("br",{})," - ",(0,r.jsx)(t.code,{children:"load"})," : consider setting content to be finished when the ",(0,r.jsx)(t.code,{children:"load"})," event is fired.",(0,r.jsx)("br",{})," - ",(0,r.jsx)(t.code,{children:"domcontentloaded"})," : consider setting content to be finished when the ",(0,r.jsx)(t.code,{children:"DOMContentLoaded"})," event is fired.",(0,r.jsx)("br",{})," - ",(0,r.jsx)(t.code,{children:"networkidle0"})," : consider setting content to be finished when there are no more than 0 network connections for at least ",(0,r.jsx)(t.code,{children:"500"})," ms.",(0,r.jsx)("br",{})," - ",(0,r.jsx)(t.code,{children:"networkidle2"})," : consider setting content to be finished when there are no more than 2 network connections for at least ",(0,r.jsx)(t.code,{children:"500"})," ms."]}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}},75251:(e,t,n)=>{var r=n(67294),s=Symbol.for("react.element"),o=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,a=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,d={key:!0,ref:!0,__self:!0,__source:!0};function c(e,t,n){var r,o={},c=null,l=null;for(r in void 0!==n&&(c=""+n),void 0!==t.key&&(c=""+t.key),void 0!==t.ref&&(l=t.ref),t)i.call(t,r)&&!d.hasOwnProperty(r)&&(o[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps)void 0===o[r]&&(o[r]=t[r]);return{$$typeof:s,type:e,key:c,ref:l,props:o,_owner:a.current}}t.Fragment=o,t.jsx=c,t.jsxs=c},85893:(e,t,n)=>{e.exports=n(75251)},11151:(e,t,n)=>{n.d(t,{Z:()=>a,a:()=>i});var r=n(67294);const s={},o=r.createContext(s);function i(e){const t=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),r.createElement(o.Provider,{value:t},e.children)}}}]);