"use strict";(globalThis.webpackChunksky_addons=globalThis.webpackChunksky_addons||[]).push([[421],{303:(e,t,n)=>{n.d(t,{A:()=>d});var o=n(609);function s(){return s=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},s.apply(this,arguments)}var i=o.createElement("svg",{viewBox:"-2 -5 14 20",height:"100%",width:"100%",style:{position:"absolute",top:0}},o.createElement("path",{d:"M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12",fill:"#fff",fillRule:"evenodd"})),a=o.createElement("svg",{height:"100%",width:"100%",viewBox:"-2 -5 17 21",style:{position:"absolute",top:0}},o.createElement("path",{d:"M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0",fill:"#fff",fillRule:"evenodd"}));function r(e){if(7===e.length)return e;for(var t="#",n=1;n<4;n+=1)t+=e[n]+e[n];return t}function l(e,t,n,o,s){return function(e,t,n,o,s){var i=(e-n)/(t-n);if(0===i)return o;if(1===i)return s;for(var a="#",r=1;r<6;r+=2){var l=parseInt(o.substr(r,2),16),d=parseInt(s.substr(r,2),16),c=Math.round((1-i)*l+i*d).toString(16);1===c.length&&(c="0"+c),a+=c}return a}(e,t,n,r(o),r(s))}var d=function(e){function t(t){e.call(this,t);var n=t.height,o=t.width,s=t.checked;this.t=t.handleDiameter||n-2,this.i=Math.max(o-n,o-(n+this.t)/2),this.o=Math.max(0,(n-this.t)/2),this.state={h:s?this.i:this.o},this.l=0,this.u=0,this.p=this.p.bind(this),this.v=this.v.bind(this),this.k=this.k.bind(this),this.m=this.m.bind(this),this.M=this.M.bind(this),this.T=this.T.bind(this),this.$=this.$.bind(this),this.C=this.C.bind(this),this.D=this.D.bind(this),this.O=this.O.bind(this),this.S=this.S.bind(this),this.W=this.W.bind(this)}return e&&(t.__proto__=e),(t.prototype=Object.create(e&&e.prototype)).constructor=t,t.prototype.componentDidMount=function(){this.I=!0},t.prototype.componentDidUpdate=function(e){e.checked!==this.props.checked&&this.setState({h:this.props.checked?this.i:this.o})},t.prototype.componentWillUnmount=function(){this.I=!1},t.prototype.H=function(e){this.R.focus(),this.setState({j:e,B:!0,L:Date.now()})},t.prototype.N=function(e){var t=this.state,n=t.j,o=t.h,s=(this.props.checked?this.i:this.o)+e-n;t.U||e===n||this.setState({U:!0});var i=Math.min(this.i,Math.max(this.o,s));i!==o&&this.setState({h:i})},t.prototype.A=function(e){var t=this.state,n=t.h,o=t.U,s=t.L,i=this.props.checked,a=(this.i+this.o)/2;this.setState({h:this.props.checked?this.i:this.o});var r=Date.now()-s;(!o||r<250||i&&n<=a||!i&&n>=a)&&this.X(e),this.I&&this.setState({U:!1,B:!1}),this.l=Date.now()},t.prototype.p=function(e){e.preventDefault(),"number"==typeof e.button&&0!==e.button||(this.H(e.clientX),window.addEventListener("mousemove",this.v),window.addEventListener("mouseup",this.k))},t.prototype.v=function(e){e.preventDefault(),this.N(e.clientX)},t.prototype.k=function(e){this.A(e),window.removeEventListener("mousemove",this.v),window.removeEventListener("mouseup",this.k)},t.prototype.m=function(e){this.F=null,this.H(e.touches[0].clientX)},t.prototype.M=function(e){this.N(e.touches[0].clientX)},t.prototype.T=function(e){e.preventDefault(),this.A(e)},t.prototype.C=function(e){Date.now()-this.l>50&&(this.X(e),Date.now()-this.u>50&&this.I&&this.setState({B:!1}))},t.prototype.D=function(){this.u=Date.now()},t.prototype.O=function(){this.setState({B:!0})},t.prototype.S=function(){this.setState({B:!1})},t.prototype.W=function(e){this.R=e},t.prototype.$=function(e){e.preventDefault(),this.R.focus(),this.X(e),this.I&&this.setState({B:!1})},t.prototype.X=function(e){var t=this.props;(0,t.onChange)(!t.checked,e,t.id)},t.prototype.render=function(){var e=this.props,t=e.checked,n=e.disabled,i=e.className,a=e.offColor,r=e.onColor,d=e.offHandleColor,c=e.onHandleColor,h=e.checkedIcon,u=e.uncheckedIcon,m=e.checkedHandleIcon,p=e.uncheckedHandleIcon,f=e.boxShadow,b=e.activeBoxShadow,y=e.height,g=e.width,k=e.borderRadius,w=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&-1===t.indexOf(o)&&(n[o]=e[o]);return n}(e,["checked","disabled","className","offColor","onColor","offHandleColor","onHandleColor","checkedIcon","uncheckedIcon","checkedHandleIcon","uncheckedHandleIcon","boxShadow","activeBoxShadow","height","width","borderRadius","handleDiameter"]),v=this.state,x=v.h,E=v.U,S=v.B,C={position:"relative",display:"inline-block",textAlign:"left",opacity:n?.5:1,direction:"ltr",borderRadius:y/2,WebkitTransition:"opacity 0.25s",MozTransition:"opacity 0.25s",transition:"opacity 0.25s",touchAction:"none",WebkitTapHighlightColor:"rgba(0, 0, 0, 0)",WebkitUserSelect:"none",MozUserSelect:"none",msUserSelect:"none",userSelect:"none"},N={height:y,width:g,margin:Math.max(0,(this.t-y)/2),position:"relative",background:l(x,this.i,this.o,a,r),borderRadius:"number"==typeof k?k:y/2,cursor:n?"default":"pointer",WebkitTransition:E?null:"background 0.25s",MozTransition:E?null:"background 0.25s",transition:E?null:"background 0.25s"},A={height:y,width:Math.min(1.5*y,g-(this.t+y)/2+1),position:"relative",opacity:(x-this.o)/(this.i-this.o),pointerEvents:"none",WebkitTransition:E?null:"opacity 0.25s",MozTransition:E?null:"opacity 0.25s",transition:E?null:"opacity 0.25s"},T={height:y,width:Math.min(1.5*y,g-(this.t+y)/2+1),position:"absolute",opacity:1-(x-this.o)/(this.i-this.o),right:0,top:0,pointerEvents:"none",WebkitTransition:E?null:"opacity 0.25s",MozTransition:E?null:"opacity 0.25s",transition:E?null:"opacity 0.25s"},_={height:this.t,width:this.t,background:l(x,this.i,this.o,d,c),display:"inline-block",cursor:n?"default":"pointer",borderRadius:"number"==typeof k?k-1:"50%",position:"absolute",transform:"translateX("+x+"px)",top:Math.max(0,(y-this.t)/2),outline:0,boxShadow:S?b:f,border:0,WebkitTransition:E?null:"background-color 0.25s, transform 0.25s, box-shadow 0.15s",MozTransition:E?null:"background-color 0.25s, transform 0.25s, box-shadow 0.15s",transition:E?null:"background-color 0.25s, transform 0.25s, box-shadow 0.15s"},M={height:this.t,width:this.t,opacity:Math.max(2*(1-(x-this.o)/(this.i-this.o)-.5),0),position:"absolute",left:0,top:0,pointerEvents:"none",WebkitTransition:E?null:"opacity 0.25s",MozTransition:E?null:"opacity 0.25s",transition:E?null:"opacity 0.25s"},D={height:this.t,width:this.t,opacity:Math.max(2*((x-this.o)/(this.i-this.o)-.5),0),position:"absolute",left:0,top:0,pointerEvents:"none",WebkitTransition:E?null:"opacity 0.25s",MozTransition:E?null:"opacity 0.25s",transition:E?null:"opacity 0.25s"};return o.createElement("div",{className:i,style:C},o.createElement("div",{className:"react-switch-bg",style:N,onClick:n?null:this.$,onMouseDown:function(e){return e.preventDefault()}},h&&o.createElement("div",{style:A},h),u&&o.createElement("div",{style:T},u)),o.createElement("div",{className:"react-switch-handle",style:_,onClick:function(e){return e.preventDefault()},onMouseDown:n?null:this.p,onTouchStart:n?null:this.m,onTouchMove:n?null:this.M,onTouchEnd:n?null:this.T,onTouchCancel:n?null:this.S},p&&o.createElement("div",{style:M},p),m&&o.createElement("div",{style:D},m)),o.createElement("input",s({},{type:"checkbox",role:"switch","aria-checked":t,checked:t,disabled:n,style:{border:0,clip:"rect(0 0 0 0)",height:1,margin:-1,overflow:"hidden",padding:0,position:"absolute",width:1}},w,{ref:this.W,onFocus:this.O,onBlur:this.S,onKeyUp:this.D,onChange:this.C})))},t}(o.Component);d.defaultProps={disabled:!1,offColor:"#888",onColor:"#080",offHandleColor:"#fff",onHandleColor:"#fff",uncheckedIcon:i,checkedIcon:a,boxShadow:null,activeBoxShadow:"0 0 2px 3px #3bf",height:28,width:56}},421:(e,t,n)=>{n.r(t),n.d(t,{default:()=>a});var o=n(609),s=(n(723),n(571)),i=n(806);const a=({isWizard:e=!1})=>{const[t,n]=(0,o.useState)(!0);return(0,o.createElement)("div",{className:"mt-10 pt-6"},(0,o.createElement)("div",{className:"mb-12 relative flex flex-col bg-clip-border rounded-xl bg-white dark:bg-gray-900 text-gray-700 shadow-sm"},(0,o.createElement)(s.A,{title:"Extensions List",desc:"It is important to be aware of your system settings and make sure that they are correctly configured for optimal performance."}),(0,o.createElement)("div",{className:"p-6"},(0,o.createElement)(i.A,{featuresType:"get_extensions"}))))}},571:(e,t,n)=>{n.d(t,{A:()=>i});var o=n(609),s=n(723);const i=({title:e,desc:t})=>(0,o.createElement)("div",{className:"relative bg-clip-border mx-4 rounded-xl overflow-hidden  bg-gradient-to-tr from-purple-800 to-purple-400  dark:from-gray dark:to-gray-800  text-white shadow-purple-500/40 dark:shadow-gray-900/40  shadow-lg -mt-12 mb-8 p-6"},(0,o.createElement)("div",{className:"flex w-full items-center justify-between"},(0,o.createElement)("div",null,(0,o.createElement)("h6",{className:"block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed  text-white mt-0 mb-1"},(0,s.__)(e,"sky-elementor-addons")),(0,o.createElement)("div",{className:"block antialiased font-sans text-md font-normal  dark:text-gray-300"},(0,s.__)(t,"sky-elementor-addons")))))},806:(e,t,n)=>{n.d(t,{A:()=>u});var o=n(609),s=n(723),i=n(83),a=n(465),r=n.n(a),l=n(303),d=n(737),c=n(982),h=n(188);const u=({featuresType:e})=>{const{refreshKey:t}=(0,o.useContext)(d.B),{triggerRefresh:n}=(0,o.useContext)(d.B),[a,u]=(0,o.useState)(0),[m,p]=(0,o.useState)(0),[f,b]=(0,o.useState)(!0),[y,g]=(0,o.useState)([]),k=(0,o.useRef)(e);if((0,o.useEffect)((()=>{(async()=>{try{b(!0);const t=await i.A.post(SkyAddonsConfig?.rest_url+"skyaddons/v1/widget-settings",{action:e},{headers:{"X-WP-Nonce":SkyAddonsConfig.nonce}}),n=Array.isArray(t?.data)?t.data:[];g(n);const{used:o,unused:s}=n.reduce(((e,t)=>(t.total_used>0?e.used+=1:e.unused+=1,e)),{used:0,unused:0});u(o),p(s)}catch(e){console.error("Error fetching settings:",e.message)}finally{b(!1)}})()}),[]),f)return(0,o.createElement)(o.Fragment,null,(0,o.createElement)("div",{className:"text-center"},(0,s.__)("Loading","sky-elementor-addons"),"..."),(0,o.createElement)("div",{className:"flex justify-center items-center h-40 mt-12"},(0,o.createElement)("div",{className:"animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"})));const w=({data:t})=>{const[n,s]=(0,o.useState)("on"===t.value);let i=!!t?.content_type?.includes("new")&&"New";const a="pro"!==t?.widget_type||SkyAddonsConfig?.pro_init?i:"Pro";return(0,o.createElement)("div",{className:"sky-widgets-items w-100 px-5 py-4 flex items-center gap-3 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 relative overflow-hidden","data-used-status":t?.total_used>0?"used":"unused","data-widget-type":t?.widget_type},a&&(0,o.createElement)("div",{className:"absolute left-0 top-0 h-16 w-16"},(0,o.createElement)("div",{className:"absolute transform -rotate-45 text-center text-white text-xs font-semibold py-1 left-[-64px] top-[8px] w-[170px] bg-gradient-to-r from-[#e052bd] via-[#8445a2] to-[#8441a4]"},a)),(0,o.createElement)("div",{className:"sa-icon-wrap text-5xl text-[#8441A4] bg-[#ebcff926] p-2.5 rounded-md dark:text-white"},(0,o.createElement)("i",{className:`sky-icon-${t.name}`})),(0,o.createElement)("div",{className:"flex flex-col"},(0,o.createElement)("h6",{className:"text-l font-medium text-gray-800 dark:text-white leading-[1.3] mb-1"},(0,o.createElement)("a",{href:t?.demo_url,target:"_blank",rel:"noreferrer",className:"hover:text-[#8441A4]",title:"Click to view demo"},t.label)),"get_extensions"!==e&&(0,o.createElement)("p",{className:"text-gray-500 dark:text-gray-300"},"Used - ",(0,o.createElement)("strong",null,t?.total_used<10&&t?.total_used>0?`0${t?.total_used}`:t?.total_used)," times")),(0,o.createElement)("div",{className:"flex items-center ml-auto mr-0"},(0,o.createElement)("label",{htmlFor:`switch-${t.name}`},(0,o.createElement)("input",{type:"hidden",value:"off",name:`${t.name}`}),(0,o.createElement)(l.A,{checked:("pro"!==t?.widget_type||!(!SkyAddonsConfig?.pro_init||!n))&&n,onChange:()=>{s(!n),setTimeout((()=>{({})[t.name]=n?"off":"on",g((e=>e.map((e=>e.name===t.name?{...e,value:n?"off":"on"}:e))))}),1e3),clearTimeout(window.widgetUpdateTimeout),window.widgetUpdateTimeout=setTimeout((()=>{k.current.dispatchEvent(new Event("submit",{cancelable:!0,bubbles:!0}))}),2e3)},onColor:"#b47fcc",onHandleColor:"#8441A4",handleDiameter:30,uncheckedIcon:!1,checkedIcon:!1,boxShadow:"0px 1px 5px rgba(0, 0, 0, 0.6)",height:18,width:48,className:"react-switch",id:`switch-${t.name}`,name:`${t.name}`}))))};return(0,o.createElement)("form",{method:"post",name:`sky-addons-${e}`,onSubmit:t=>{t.preventDefault();const o={},s=new FormData(t.target);for(const[e,t]of s.entries())o[e]=t;r().fire({title:"Loading...",allowOutsideClick:!1,didOpen:()=>{r().showLoading()}}),i.A.post(SkyAddonsConfig?.rest_url+"skyaddons/v1/widget-settings/update",{action:e,widgets:o},{headers:{"X-WP-Nonce":SkyAddonsConfig.nonce}}).then((e=>{n(),"success"===e?.data?.status?r().mixin({toast:!0,position:"bottom-end",showConfirmButton:!1,timer:2500,timerProgressBar:!0,didOpen:e=>{e.addEventListener("mouseenter",r().stopTimer),e.addEventListener("mouseleave",r().resumeTimer)}}).fire({icon:"success",title:e?.data?.title,text:e?.data?.msg}):r().fire({icon:"error",title:e?.data?.title,text:e?.data?.msg})})).catch((e=>{console.error("Error updating widget settings:",e),r().fire({icon:"error",title:"Error",text:"An error occurred while updating widget settings."})}))},ref:k},(0,o.createElement)("div",{className:"flex w-100 mb-5 justify-between"},(0,o.createElement)("div",null,(0,o.createElement)("button",{type:"button",className:"bg-blue-100 text-blue-800 text-sm font-medium me-2 px-3.5 py-1.5 rounded-md dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200",onClick:()=>{const e=document.querySelectorAll('.sky-widgets-items[data-used-status="used"]'),t=document.querySelectorAll('.sky-widgets-items[data-used-status="unused"]');e.forEach((e=>{e.style.display="flex"})),t.forEach((e=>{e.style.display="flex"}))}},(0,o.createElement)(c.g,{icon:h.e68,className:"me-1"}),"All",(0,o.createElement)("span",{className:"ms-1"},"(",a+m,")")),"get_extensions"!==e&&(0,o.createElement)(o.Fragment,null,(0,o.createElement)("button",{type:"button",className:"bg-green-100 text-green-800 text-sm font-medium me-2 px-3.5 py-1.5 rounded-md dark:bg-green-900 dark:text-green-300 hover:bg-green-200",onClick:()=>{const e=document.querySelectorAll('.sky-widgets-items[data-used-status="used"]'),t=document.querySelectorAll('.sky-widgets-items[data-used-status="unused"]');e.length>0&&(t.forEach((e=>{e.style.display="none"})),e.forEach((e=>{e.style.display="flex"})))}},(0,o.createElement)(c.g,{icon:h.a$,className:"me-1"}),"Used",(0,o.createElement)("span",{className:"ms-1"},"(",a,")")),(0,o.createElement)("button",{type:"button",className:"bg-red-100 text-red-800 text-sm font-medium me-2 px-3.5 py-1.5 rounded-md dark:bg-red-900 dark:text-red-300 hover:bg-red-200",onClick:()=>{const e=document.querySelectorAll('.sky-widgets-items[data-used-status="used"]'),t=document.querySelectorAll('.sky-widgets-items[data-used-status="unused"]');t.length>0&&(e.forEach((e=>{e.style.display="none"})),t.forEach((e=>{e.style.display="flex"})))}},(0,o.createElement)(c.g,{icon:h.jPR,className:"me-1"}),"Unused",(0,o.createElement)("span",{className:"ms-1"},"(",m,")")))),(0,o.createElement)("div",null,(0,o.createElement)("input",{type:"search",className:" w-[130px] border border-gray-200 text-sm font-medium px-3.5 py-1.5 rounded-md dark:border-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-300 dark:bg-gray-800 mr-2",placeholder:"Search ...",onChange:e=>{const t=e.target.value.toLowerCase(),n=document.querySelectorAll(".sky-widgets-items");n.forEach((e=>{e.querySelector("h6,p").textContent.toLowerCase().includes(t)?e.style.display="flex":e.style.display="none";const o=document.querySelector(".widget-not-found");if(o&&o.remove(),document.querySelectorAll('.sky-widgets-items[style*="display: none"]').length===n.length){const e=document.querySelector(".sky-widgets-items"),t=document.createElement("div");t.classList.add("widget-not-found","text-center","text-gray-500","dark:text-gray-300","mt-5"),t.textContent="Sorry, not found. Please contact support for more informations.",e.parentNode.appendChild(t)}}))}}),(0,o.createElement)("button",{className:"bg-blue-100 text-blue-800 text-sm font-medium me-2 px-3.5 py-1.5 rounded-md dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200",onClick:()=>{document.querySelectorAll('.react-switch input[type="checkbox"]').forEach((e=>{e.checked=!0,e.dispatchEvent(new Event("change",{cancelable:!0,bubbles:!0})),g((e=>e.map((e=>({...e,value:"on"})))))}))}},(0,o.createElement)(c.g,{icon:h.FK2,className:"me-1"}),"Enable All"),(0,o.createElement)("button",{className:"bg-red-100 text-red-800 text-sm font-medium me-2 px-3.5 py-1.5 rounded-md dark:bg-red-900 dark:text-red-300 hover:bg-red-200",onClick:()=>{document.querySelectorAll('.react-switch input[type="checkbox"]').forEach((e=>{e.checked=!1,e.dispatchEvent(new Event("change",{cancelable:!0,bubbles:!0})),g((e=>e.map((e=>({...e,value:"off"})))))}))}},(0,o.createElement)(c.g,{icon:h.yLS,className:"me-1"}),"Disable All"))),(0,o.createElement)("div",{className:"grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"},y.map(((e,t)=>(0,o.createElement)(w,{key:t,data:e})))),(0,o.createElement)("button",{type:"submit",className:"hidden"},"Submit"))}}}]);