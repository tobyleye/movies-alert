(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[372],{6637:function(e,n,t){Promise.resolve().then(t.bind(t,7969))},2797:function(e,n,t){"use strict";t.d(n,{Bp:function(){return c},Ld:function(){return r},qr:function(){return a}});var s=t(9222);let l="/api";console.log({baseURL:l});let i=s.Z.create({baseURL:l}),r=e=>{let{movieTitle:n,email:t}=e;return i.post("/subscribe",{movieTitle:n,email:t})},c=()=>i.get("/recent-movies").then(e=>{let{data:n}=e;return n}),a=e=>i.post("/generateDownloadLink",{url:e}).then(e=>e.data.data)},7969:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return g}});var s=t(7437),l=t(428),i=t.n(l),r=t(2265),c=t(6835),a=t(290),d=t(9670),o=t(3709),h=t(8930),x=t(9561),u=t(6103),j=t(6066),f=t(2797);let m=e=>{let{movie:n}=e,[t,l]=(0,r.useState)([]),[h,x]=(0,r.useState)(!1),u=async()=>{try{x(!0);let e=await f.qr(n.link);l(e)}catch(e){}finally{x(!1)}},j=!1===h&&t.length>0;return(0,s.jsx)("div",{children:(0,s.jsxs)(c.Z,{shadow:"sm",padding:"xl",children:[(0,s.jsx)(c.Z.Section,{children:(0,s.jsx)(a.E,{src:n.poster,height:160,alt:"No way!",withPlaceholder:!0,placeholder:(0,s.jsx)(d.x,{align:"center",children:"cannot load image"})})}),(0,s.jsx)(d.x,{weight:500,size:"lg",mt:"md",children:n.title}),(0,s.jsx)(d.x,{mt:"xs",color:"dimmed",size:"sm",style:{marginBottom:25},children:n.synopsis}),j?(0,s.jsxs)("ul",{className:"jsx-f89a79c20ee68d0d",children:[t.map((e,n)=>(0,s.jsx)("li",{className:"jsx-f89a79c20ee68d0d",children:(0,s.jsx)("a",{href:e,target:"_blank",className:"jsx-f89a79c20ee68d0d",children:e})},"download-link-".concat(n))),(0,s.jsx)(i(),{id:"f89a79c20ee68d0d",children:"ul.jsx-f89a79c20ee68d0d{list-style:none}"})]}):(0,s.jsxs)("div",{children:[(0,s.jsx)("div",{style:{display:"flex",justifyContent:"center"},children:(0,s.jsx)(o.z,{loading:!0===h,onClick:u,children:"generate download link"})}),!0===h&&(0,s.jsx)("div",{style:{marginTop:8,textAlign:"center",fontSize:14,color:"gray"},children:"Please exercise some patience, this would take a while"})]})]})},n.link)};function g(){let[e,n]=(0,r.useState)([]),[t,l]=(0,r.useState)(!1),[i,c]=(0,r.useState)(!1);return(0,r.useEffect)(()=>{c(!0),f.Bp().then(e=>{let{data:t}=e;n(t)}).catch(e=>{console.log("error --",e),l(!0)}).finally(()=>{c(!1)})},[]),(0,s.jsx)("div",{children:(0,s.jsx)(h.r,{justify:"center",children:(0,s.jsxs)(h.r.Col,{sm:6,children:[(0,s.jsx)("h1",{className:"text-center mb-0",children:"Recent movies"}),(0,s.jsx)(d.x,{align:"center",size:"sm",className:"mb-8",children:"Source: tfpdl"}),i?(0,s.jsx)("div",{style:{padding:"50px 0",display:"flex",justifyContent:"center"},children:(0,s.jsx)(x.a,{})}):t?(0,s.jsx)(u.b,{style:{textAlign:"center"},children:"Ahh sorry, ann error occured loading movies"}):(0,s.jsx)(j.M,{spacing:"xl",children:e&&e.length>0?e.map(e=>(0,s.jsx)(m,{movie:e},e.link)):null})]})})})}}},function(e){e.O(0,[680,709,837,94,971,596,744],function(){return e(e.s=6637)}),_N_E=e.O()}]);