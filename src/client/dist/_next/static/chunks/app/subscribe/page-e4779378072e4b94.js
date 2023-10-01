(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[731],{9124:function(e,r,t){"use strict";t.d(r,{W:function(){return O}});var a=t(2265),n=t(9183),l=t(529),o=t(9546),i=t(5533),s=(0,o.k)((e,{fluid:r,sizes:t},{size:a})=>({root:{paddingLeft:e.spacing.md,paddingRight:e.spacing.md,maxWidth:r?"100%":(0,i.a)({size:a,sizes:t}),marginLeft:"auto",marginRight:"auto"}})),c=t(4556),p=Object.defineProperty,d=Object.getOwnPropertySymbols,u=Object.prototype.hasOwnProperty,f=Object.prototype.propertyIsEnumerable,b=(e,r,t)=>r in e?p(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,m=(e,r)=>{for(var t in r||(r={}))u.call(r,t)&&b(e,t,r[t]);if(d)for(var t of d(r))f.call(r,t)&&b(e,t,r[t]);return e},y=(e,r)=>{var t={};for(var a in e)u.call(e,a)&&0>r.indexOf(a)&&(t[a]=e[a]);if(null!=e&&d)for(var a of d(e))0>r.indexOf(a)&&f.call(e,a)&&(t[a]=e[a]);return t};let v={sizes:{xs:(0,n.h)(540),sm:(0,n.h)(720),md:(0,n.h)(960),lg:(0,n.h)(1140),xl:(0,n.h)(1320)}},O=(0,a.forwardRef)((e,r)=>{let t=(0,l.N4)("Container",v,e),{className:n,fluid:o,size:i,unstyled:p,sizes:d,variant:u}=t,f=y(t,["className","fluid","size","unstyled","sizes","variant"]),{classes:b,cx:O}=s({fluid:o,sizes:d},{unstyled:p,name:"Container",variant:u,size:i});return a.createElement(c.x,m({className:O(b.root,n),ref:r},f))});O.displayName="@mantine/core/Container"},6650:function(e,r,t){Promise.resolve().then(t.bind(t,5903))},2797:function(e,r,t){"use strict";t.d(r,{Bp:function(){return i},Ld:function(){return o},qr:function(){return s}});var a=t(9222);let n="/api";console.log({baseURL:n});let l=a.Z.create({baseURL:n}),o=e=>{let{movieTitle:r,email:t}=e;return l.post("/subscribe",{movieTitle:r,email:t})},i=()=>l.get("/recent-movies").then(e=>{let{data:r}=e;return r}),s=e=>l.post("/generateDownloadLink",{url:e}).then(e=>e.data.data)},5903:function(e,r,t){"use strict";t.r(r),t.d(r,{default:function(){return e8}});var a=t(7437),n=t(9124),l=t(2265),o=t(529),i=t(1159),s=t(7872),c=Object.defineProperty,p=Object.defineProperties,d=Object.getOwnPropertyDescriptors,u=Object.getOwnPropertySymbols,f=Object.prototype.hasOwnProperty,b=Object.prototype.propertyIsEnumerable,m=(e,r,t)=>r in e?c(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,y=(e,r)=>{for(var t in r||(r={}))f.call(r,t)&&m(e,t,r[t]);if(u)for(var t of u(r))b.call(r,t)&&m(e,t,r[t]);return e},v=(e,r)=>p(e,d(r)),O=(e,r)=>{var t={};for(var a in e)f.call(e,a)&&0>r.indexOf(a)&&(t[a]=e[a]);if(null!=e&&u)for(var a of u(e))0>r.indexOf(a)&&b.call(e,a)&&(t[a]=e[a]);return t},h=t(9183),w=t(4930),g=t(9546),j=t(5533),P=(0,g.k)((e,r,{size:t})=>({label:{display:"inline-block",fontSize:(0,j.a)({size:t,sizes:e.fontSizes}),fontWeight:500,color:"dark"===e.colorScheme?e.colors.dark[0]:e.colors.gray[9],wordBreak:"break-word",cursor:"default",WebkitTapHighlightColor:"transparent"},required:{color:e.fn.variant({variant:"filled",color:"red"}).background}})),x=t(4556),N=Object.defineProperty,E=Object.getOwnPropertySymbols,S=Object.prototype.hasOwnProperty,k=Object.prototype.propertyIsEnumerable,z=(e,r,t)=>r in e?N(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,I=(e,r)=>{for(var t in r||(r={}))S.call(r,t)&&z(e,t,r[t]);if(E)for(var t of E(r))k.call(r,t)&&z(e,t,r[t]);return e},_=(e,r)=>{var t={};for(var a in e)S.call(e,a)&&0>r.indexOf(a)&&(t[a]=e[a]);if(null!=e&&E)for(var a of E(e))0>r.indexOf(a)&&k.call(e,a)&&(t[a]=e[a]);return t};let W={labelElement:"label",size:"sm"},C=(0,l.forwardRef)((e,r)=>{let t=(0,o.N4)("InputLabel",W,e),{labelElement:a,children:n,required:i,size:s,classNames:c,styles:p,unstyled:d,className:u,htmlFor:f,__staticSelector:b,variant:m,onMouseDown:y}=t,v=_(t,["labelElement","children","required","size","classNames","styles","unstyled","className","htmlFor","__staticSelector","variant","onMouseDown"]),{classes:O,cx:h}=P(null,{name:["InputWrapper",b],classNames:c,styles:p,unstyled:d,variant:m,size:s});return l.createElement(x.x,I({component:a,ref:r,className:h(O.label,u),htmlFor:"label"===a?f:void 0,onMouseDown:e=>{null==y||y(e),!e.defaultPrevented&&e.detail>1&&e.preventDefault()}},v),n,i&&l.createElement("span",{className:O.required,"aria-hidden":!0}," *"))});C.displayName="@mantine/core/InputLabel";var D=(0,g.k)((e,r,{size:t})=>({error:{wordBreak:"break-word",color:e.fn.variant({variant:"filled",color:"red"}).background,fontSize:`calc(${(0,j.a)({size:t,sizes:e.fontSizes})} - ${(0,h.h)(2)})`,lineHeight:1.2,display:"block"}})),R=t(9670),q=Object.defineProperty,L=Object.getOwnPropertySymbols,$=Object.prototype.hasOwnProperty,B=Object.prototype.propertyIsEnumerable,A=(e,r,t)=>r in e?q(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,T=(e,r)=>{for(var t in r||(r={}))$.call(r,t)&&A(e,t,r[t]);if(L)for(var t of L(r))B.call(r,t)&&A(e,t,r[t]);return e},F=(e,r)=>{var t={};for(var a in e)$.call(e,a)&&0>r.indexOf(a)&&(t[a]=e[a]);if(null!=e&&L)for(var a of L(e))0>r.indexOf(a)&&B.call(e,a)&&(t[a]=e[a]);return t};let H={size:"sm"},M=(0,l.forwardRef)((e,r)=>{let t=(0,o.N4)("InputError",H,e),{children:a,className:n,classNames:i,styles:s,unstyled:c,size:p,__staticSelector:d,variant:u}=t,f=F(t,["children","className","classNames","styles","unstyled","size","__staticSelector","variant"]),{classes:b,cx:m}=D(null,{name:["InputWrapper",d],classNames:i,styles:s,unstyled:c,variant:u,size:p});return l.createElement(R.x,T({className:m(b.error,n),ref:r},f),a)});M.displayName="@mantine/core/InputError";var Z=(0,g.k)((e,r,{size:t})=>({description:{wordBreak:"break-word",color:"dark"===e.colorScheme?e.colors.dark[2]:e.colors.gray[6],fontSize:`calc(${(0,j.a)({size:t,sizes:e.fontSizes})} - ${(0,h.h)(2)})`,lineHeight:1.2,display:"block"}})),U=Object.defineProperty,G=Object.getOwnPropertySymbols,J=Object.prototype.hasOwnProperty,K=Object.prototype.propertyIsEnumerable,Q=(e,r,t)=>r in e?U(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,V=(e,r)=>{for(var t in r||(r={}))J.call(r,t)&&Q(e,t,r[t]);if(G)for(var t of G(r))K.call(r,t)&&Q(e,t,r[t]);return e},X=(e,r)=>{var t={};for(var a in e)J.call(e,a)&&0>r.indexOf(a)&&(t[a]=e[a]);if(null!=e&&G)for(var a of G(e))0>r.indexOf(a)&&K.call(e,a)&&(t[a]=e[a]);return t};let Y={size:"sm"},ee=(0,l.forwardRef)((e,r)=>{let t=(0,o.N4)("InputDescription",Y,e),{children:a,className:n,classNames:i,styles:s,unstyled:c,size:p,__staticSelector:d,variant:u}=t,f=X(t,["children","className","classNames","styles","unstyled","size","__staticSelector","variant"]),{classes:b,cx:m}=Z(null,{name:["InputWrapper",d],classNames:i,styles:s,unstyled:c,variant:u,size:p});return l.createElement(R.x,V({color:"dimmed",className:m(b.description,n),ref:r,unstyled:c},f),a)});ee.displayName="@mantine/core/InputDescription";let er=(0,l.createContext)({offsetBottom:!1,offsetTop:!1,describedBy:void 0}),et=er.Provider,ea=()=>(0,l.useContext)(er);var en=Object.defineProperty,el=Object.defineProperties,eo=Object.getOwnPropertyDescriptors,ei=Object.getOwnPropertySymbols,es=Object.prototype.hasOwnProperty,ec=Object.prototype.propertyIsEnumerable,ep=(e,r,t)=>r in e?en(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,ed=(e,r)=>{for(var t in r||(r={}))es.call(r,t)&&ep(e,t,r[t]);if(ei)for(var t of ei(r))ec.call(r,t)&&ep(e,t,r[t]);return e},eu=(e,r)=>el(e,eo(r)),ef=(0,g.k)(e=>({root:eu(ed({},e.fn.fontStyles()),{lineHeight:e.lineHeight})})),eb=Object.defineProperty,em=Object.defineProperties,ey=Object.getOwnPropertyDescriptors,ev=Object.getOwnPropertySymbols,eO=Object.prototype.hasOwnProperty,eh=Object.prototype.propertyIsEnumerable,ew=(e,r,t)=>r in e?eb(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,eg=(e,r)=>{for(var t in r||(r={}))eO.call(r,t)&&ew(e,t,r[t]);if(ev)for(var t of ev(r))eh.call(r,t)&&ew(e,t,r[t]);return e},ej=(e,r)=>em(e,ey(r)),eP=(e,r)=>{var t={};for(var a in e)eO.call(e,a)&&0>r.indexOf(a)&&(t[a]=e[a]);if(null!=e&&ev)for(var a of ev(e))0>r.indexOf(a)&&eh.call(e,a)&&(t[a]=e[a]);return t};let ex={labelElement:"label",size:"sm",inputContainer:e=>e,inputWrapperOrder:["label","description","input","error"]},eN=(0,l.forwardRef)((e,r)=>{let t=(0,o.N4)("InputWrapper",ex,e),{className:a,label:n,children:i,required:s,id:c,error:p,description:d,labelElement:u,labelProps:f,descriptionProps:b,errorProps:m,classNames:y,styles:v,size:O,inputContainer:h,__staticSelector:w,unstyled:g,inputWrapperOrder:j,withAsterisk:P,variant:N}=t,E=eP(t,["className","label","children","required","id","error","description","labelElement","labelProps","descriptionProps","errorProps","classNames","styles","size","inputContainer","__staticSelector","unstyled","inputWrapperOrder","withAsterisk","variant"]),{classes:S,cx:k}=ef(null,{classNames:y,styles:v,name:["InputWrapper",w],unstyled:g,variant:N,size:O}),z={classNames:y,styles:v,unstyled:g,size:O,variant:N,__staticSelector:w},I=c?`${c}-error`:null==m?void 0:m.id,_=c?`${c}-description`:null==b?void 0:b.id,W=!!p&&"boolean"!=typeof p,D=`${W?I:""} ${d?_:""}`,R=D.trim().length>0?D.trim():void 0,q=n&&l.createElement(C,eg(eg({key:"label",labelElement:u,id:c?`${c}-label`:void 0,htmlFor:c,required:"boolean"==typeof P?P:s},z),f),n),L=d&&l.createElement(ee,ej(eg(eg({key:"description"},b),z),{size:(null==b?void 0:b.size)||z.size,id:(null==b?void 0:b.id)||_}),d),$=l.createElement(l.Fragment,{key:"input"},h(i)),B="boolean"!=typeof p&&p&&l.createElement(M,ej(eg(eg({},m),z),{size:(null==m?void 0:m.size)||z.size,key:"error",id:(null==m?void 0:m.id)||I}),p),A=j.map(e=>{switch(e){case"label":return q;case"input":return $;case"description":return L;case"error":return B;default:return null}});return l.createElement(et,{value:eg({describedBy:R},function(e,{hasDescription:r,hasError:t}){let a=e.findIndex(e=>"input"===e),n=e[a-1],l=e[a+1];return{offsetBottom:r&&"description"===l||t&&"error"===l,offsetTop:r&&"description"===n||t&&"error"===n}}(j,{hasDescription:!!L,hasError:!!B}))},l.createElement(x.x,eg({className:k(S.root,a),ref:r},E),A))});eN.displayName="@mantine/core/InputWrapper";var eE=Object.defineProperty,eS=Object.getOwnPropertySymbols,ek=Object.prototype.hasOwnProperty,ez=Object.prototype.propertyIsEnumerable,eI=(e,r,t)=>r in e?eE(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,e_=(e,r)=>{for(var t in r||(r={}))ek.call(r,t)&&eI(e,t,r[t]);if(eS)for(var t of eS(r))ez.call(r,t)&&eI(e,t,r[t]);return e},eW=(e,r)=>{var t={};for(var a in e)ek.call(e,a)&&0>r.indexOf(a)&&(t[a]=e[a]);if(null!=e&&eS)for(var a of eS(e))0>r.indexOf(a)&&ez.call(e,a)&&(t[a]=e[a]);return t};let eC={},eD=(0,l.forwardRef)((e,r)=>{let t=(0,o.N4)("InputPlaceholder",eC,e),{sx:a}=t,n=eW(t,["sx"]);return l.createElement(x.x,e_({component:"span",sx:[e=>e.fn.placeholderStyles(),...Array.isArray(a)?a:[a]],ref:r},n))});eD.displayName="@mantine/core/InputPlaceholder";var eR=t(4118),eq=Object.defineProperty,eL=Object.defineProperties,e$=Object.getOwnPropertyDescriptors,eB=Object.getOwnPropertySymbols,eA=Object.prototype.hasOwnProperty,eT=Object.prototype.propertyIsEnumerable,eF=(e,r,t)=>r in e?eq(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,eH=(e,r)=>{for(var t in r||(r={}))eA.call(r,t)&&eF(e,t,r[t]);if(eB)for(var t of eB(r))eT.call(r,t)&&eF(e,t,r[t]);return e},eM=(e,r)=>eL(e,e$(r)),eZ=(e,r)=>{var t={};for(var a in e)eA.call(e,a)&&0>r.indexOf(a)&&(t[a]=e[a]);if(null!=e&&eB)for(var a of eB(e))0>r.indexOf(a)&&eT.call(e,a)&&(t[a]=e[a]);return t};let eU={size:"sm",variant:"default"},eG=(0,l.forwardRef)((e,r)=>{let t=(0,o.N4)("Input",eU,e),{className:a,error:n,required:i,disabled:c,variant:p,icon:d,style:u,rightSectionWidth:f,iconWidth:b,rightSection:m,rightSectionProps:y,radius:v,size:O,wrapperProps:w,classNames:g,styles:j,__staticSelector:P,multiline:N,sx:E,unstyled:S,pointer:k}=t,z=eZ(t,["className","error","required","disabled","variant","icon","style","rightSectionWidth","iconWidth","rightSection","rightSectionProps","radius","size","wrapperProps","classNames","styles","__staticSelector","multiline","sx","unstyled","pointer"]),{offsetBottom:I,offsetTop:_,describedBy:W}=ea(),{classes:C,cx:D}=(0,eR.Z)({radius:v,multiline:N,invalid:!!n,rightSectionWidth:f?(0,h.h)(f):void 0,iconWidth:b,withRightSection:!!m,offsetBottom:I,offsetTop:_,pointer:k},{classNames:g,styles:j,name:["Input",P],unstyled:S,variant:p,size:O}),{systemStyles:R,rest:q}=(0,s.x)(z);return l.createElement(x.x,eH(eH({className:D(C.wrapper,a),sx:E,style:u},R),w),d&&l.createElement("div",{className:C.icon},d),l.createElement(x.x,eM(eH({component:"input"},q),{ref:r,required:i,"aria-invalid":!!n,"aria-describedby":W,disabled:c,"data-disabled":c||void 0,"data-with-icon":!!d||void 0,"data-invalid":!!n||void 0,className:C.input})),m&&l.createElement("div",eM(eH({},y),{className:C.rightSection}),m))});eG.displayName="@mantine/core/Input",eG.Wrapper=eN,eG.Label=C,eG.Description=ee,eG.Error=M,eG.Placeholder=eD;let eJ=(0,w.F)(eG);var eK=Object.defineProperty,eQ=Object.defineProperties,eV=Object.getOwnPropertyDescriptors,eX=Object.getOwnPropertySymbols,eY=Object.prototype.hasOwnProperty,e0=Object.prototype.propertyIsEnumerable,e2=(e,r,t)=>r in e?eK(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,e4=(e,r)=>{for(var t in r||(r={}))eY.call(r,t)&&e2(e,t,r[t]);if(eX)for(var t of eX(r))e0.call(r,t)&&e2(e,t,r[t]);return e},e5=(e,r)=>eQ(e,eV(r)),e9=(e,r)=>{var t={};for(var a in e)eY.call(e,a)&&0>r.indexOf(a)&&(t[a]=e[a]);if(null!=e&&eX)for(var a of eX(e))0>r.indexOf(a)&&e0.call(e,a)&&(t[a]=e[a]);return t};let e1={type:"text",size:"sm",__staticSelector:"TextInput"},e7=(0,l.forwardRef)((e,r)=>{let t=function(e,r,t){let a=(0,o.N4)(e,r,t),{label:n,description:l,error:c,required:p,classNames:d,styles:u,className:f,unstyled:b,__staticSelector:m,sx:h,errorProps:w,labelProps:g,descriptionProps:j,wrapperProps:P,id:x,size:N,style:E,inputContainer:S,inputWrapperOrder:k,withAsterisk:z,variant:I}=a,_=O(a,["label","description","error","required","classNames","styles","className","unstyled","__staticSelector","sx","errorProps","labelProps","descriptionProps","wrapperProps","id","size","style","inputContainer","inputWrapperOrder","withAsterisk","variant"]),W=(0,i.M)(x),{systemStyles:C,rest:D}=(0,s.x)(_),R=y({label:n,description:l,error:c,required:p,classNames:d,className:f,__staticSelector:m,sx:h,errorProps:w,labelProps:g,descriptionProps:j,unstyled:b,styles:u,id:W,size:N,style:E,inputContainer:S,inputWrapperOrder:k,withAsterisk:z,variant:I},P);return v(y({},D),{classNames:d,styles:u,unstyled:b,wrapperProps:y(y({},R),C),inputProps:{required:p,classNames:d,styles:u,unstyled:b,id:W,size:N,__staticSelector:m,error:c,variant:I}})}("TextInput",e1,e),{inputProps:a,wrapperProps:n}=t,c=e9(t,["inputProps","wrapperProps"]);return l.createElement(eJ.Wrapper,e4({},n),l.createElement(eJ,e5(e4(e4({},a),c),{ref:r})))});e7.displayName="@mantine/core/TextInput";var e3=t(3709),e6=t(2797);function e8(){let[e,r]=(0,l.useState)(""),[t,o]=(0,l.useState)(""),i=()=>{r(""),o("")},s=async()=>{console.log("form submitted!!");try{await (0,e6.Ld)({movieTitle:e,email:t}),i()}catch(e){}};return(0,a.jsx)(n.W,{children:(0,a.jsxs)("div",{className:"max-w-2xl mx-auto",children:[(0,a.jsx)("h3",{className:"text-2xl mb-4 font-semibold",children:"Subscription form"}),(0,a.jsx)("p",{children:"Enter the title of the movie you'd like to watch and we will handle\n          the rest"}),(0,a.jsx)("div",{children:(0,a.jsxs)("form",{onSubmit:e=>{e.preventDefault(),s()},children:[(0,a.jsxs)("div",{className:"mb-4 grid gap-2",children:[(0,a.jsx)(e7,{withAsterisk:!0,required:!0,value:e,onChange:e=>r(e.target.value),label:"Movie title"}),(0,a.jsx)(e7,{required:!0,withAsterisk:!0,value:t,onChange:e=>o(e.target.value),label:"Email",placeholder:"email you will like to receive alert"})]}),(0,a.jsx)(e3.z,{type:"submit",onClick:()=>{alert("Sorry, this is still a wip")},children:"Submit"})]})})]})})}}},function(e){e.O(0,[680,709,837,971,596,744],function(){return e(e.s=6650)}),_N_E=e.O()}]);