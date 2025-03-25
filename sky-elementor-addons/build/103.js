"use strict";(globalThis.webpackChunksky_addons=globalThis.webpackChunksky_addons||[]).push([[103],{103:(e,t,o)=>{o.r(t),o.d(t,{default:()=>p});var i=o(609),n=o(723),r=o(83),a=o(465),s=o.n(a),l=o(982),c=o(188),d=o(455),h=o.n(d),u=o(303);const p=()=>{const[e,t]=(0,i.useState)(!0),[o,a]=(0,i.useState)([]),[d,p]=(0,i.useState)(!1);(0,i.useEffect)((()=>{r.A.get(SkyAddonsConfig?.rest_url+"wp/v2/wowdevs-hooks").then((e=>{a(e.data),t(!1)})).catch((e=>{console.error("Error fetching data:",e),t(!1)}))}),[]);const m=(e,t,i)=>{const n=o.find((e=>e.id===i));n.meta.wowdevs_theme_builder_status=e?"enabled":"disabled",h()({path:`/wp/v2/wowdevs-hooks/${i}`,method:"POST",data:n}).then((e=>{a(o.map((t=>t.id===i?e:t)))})).catch((e=>{console.error("Error updating layout:",e)}))};return e?(0,i.createElement)(i.Fragment,null,(0,i.createElement)("div",{className:"text-center"},(0,n.__)("Loading","sky-elementor-addons"),"..."),(0,i.createElement)("div",{className:"flex justify-center items-center h-40 mt-12"},(0,i.createElement)("div",{className:"animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"}))):(0,i.createElement)("div",{className:"mb-12 relative flex flex-col bg-clip-border rounded-xl bg-white dark:bg-gray-900 shadow-sm p-6"},(0,i.createElement)("div",{className:"relative bg-white shadow-md dark:bg-gray-800 sm:rounded-lg mb-6"},(0,i.createElement)("div",{className:"flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4"},(0,i.createElement)("div",{className:"w-full md:w-1/2 dark:text-white font-bold"},d?(0,n.__)("Select Your Layout"):(0,n.__)("Your Layouts")),(0,i.createElement)("div",{className:"flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3"},(0,i.createElement)("button",{type:"button",onClick:()=>{p(!d)},className:"flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg md:w-auto focus:outline-none hover:bg-purple-700 focus:z-10 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-600 dark:bg-purple-700 dark:border-purple-600 dark:hover:bg-purple-800"},(0,i.createElement)(l.g,{icon:d?c.Jyw:c.QLR,className:"h-4 w-4 mr-2"}),d?"Close":"Add New")))),d&&(0,i.createElement)("div",{className:"mb-6"},(0,i.createElement)("div",{className:"mt-4 mb-8 grid grid-cols-2 gap-4 md:grid-cols-5"},[{name:"Header",slug:"header",img:"header-footer.png",availity:"free"},{name:"Footer",slug:"footer",img:"header-footer.png",availity:"free"},{name:"Archive",slug:"archive",img:"archive.png",availity:"free"},{name:"Single (Pro)",slug:"single",img:"content-writing.png",availity:"pro"},{name:"404",slug:"404",img:"404.png",availity:"pro"},{name:"Custom Hooks (Pro)",slug:"custom_hooks",img:"custom-hooks.png",availity:"pro"}].map((e=>(0,i.createElement)("a",{key:e.name,href:SkyAddonsConfig?.pro_init||"free"===e.availity?SkyAddonsConfig?.web_url+`/wp-admin/post-new.php?post_type=wowdevs-hooks&type=${e.slug}`:"#",onClick:t=>{SkyAddonsConfig?.pro_init||"pro"!==e.availity||(t.preventDefault(),s().fire("Pro Feature","This feature is available in the Pro version.","info"))},className:"hover:shadow"},(0,i.createElement)("div",{key:e.id,className:"bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"},(0,i.createElement)("div",{className:"rounded-t-lg overflow-hidden p-3 max-h-[180px]"},(0,i.createElement)("img",{src:SkyAddonsConfig?.assets_url+"/images/"+e.img,alt:"Layout Preview",className:"w-full h-full object-cover"})),(0,i.createElement)("div",{className:"py-3 px-4"},(0,i.createElement)("h4",{className:"text-md font-semibold text-gray-900 dark:text-white",title:e.name},SkyAddonsConfig?.pro_init&&"pro"===e.availity?e.name.replace(" (Pro)",""):e.name)))))))),(0,i.createElement)("div",{className:"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"},o&&o.map((e=>(0,i.createElement)("div",{key:e.id,className:"bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"},(0,i.createElement)("div",{className:"rounded-t-lg overflow-hidden px-3"},(0,i.createElement)("img",{src:SkyAddonsConfig?.assets_url+"/images/wireframe.png",alt:"Layout Preview",className:"w-full object-cover -mb-3"})),(0,i.createElement)("div",{className:"py-4 px-4"},(0,i.createElement)("div",null,(0,i.createElement)("h4",{className:"text-md font-medium text-gray-900 dark:text-white"},e.title.rendered)),(0,i.createElement)("div",{className:"flex items-center justify-between"},(0,i.createElement)("div",{className:"flex items-center space-x-2"},(0,i.createElement)(l.g,{icon:c.dmS,className:"h-4 w-4 text-gray-500"}),(0,i.createElement)("span",{className:"text-md text-gray-500 dark:text-white"},e.meta.wowdevs_theme_builder_type.replace(/_/g," ").replace(/\b\w/g,(e=>e.toUpperCase())))),(0,i.createElement)("div",{className:"flex items-center space-x-2"},(0,i.createElement)("label",{className:"flex items-center space-x-2"},(0,i.createElement)(u.A,{checked:"enabled"===e.meta.wowdevs_theme_builder_status,onChange:m&&((t,o)=>m(t,0,e.id)),onColor:"#b47fcc",onHandleColor:"#8441A4",handleDiameter:24,uncheckedIcon:!1,checkedIcon:!1,boxShadow:"0px 1px 5px rgba(0, 0, 0, 0.6)",height:12,width:36,className:"react-switch"})),(0,i.createElement)("button",{onClick:()=>{return t=e.id,void window.open(SkyAddonsConfig?.web_url+`/wp-admin/post.php?post=${t}&action=edit`,"_blank");var t},className:"text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-2.5 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"},(0,i.createElement)(l.g,{icon:c.MT7,className:"h-4 w-4 text-gray-500"})),(0,i.createElement)("button",{onClick:()=>{return t=e.id,void s().fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete it!"}).then((e=>{e.isConfirmed&&h()({path:`/wp/v2/wowdevs-hooks/${t}`,method:"DELETE"}).then((e=>{a(o.filter((e=>e.id!==t))),s().fire("Deleted!","Your layout has been deleted.","success")})).catch((e=>{console.error("Error deleting layout:",e),s().fire("Error!","There was an error deleting the layout.","error")}))}));var t},className:"text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-2.5 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"},(0,i.createElement)(l.g,{icon:c.yLS,className:"h-4 w-4 text-gray-500"})))))))),0===o.length&&(0,i.createElement)("div",{className:"text-center col-span-3 min-h-[400px] flex items-center justify-center"},(0,i.createElement)("p",{className:"text-gray-500 dark:text-white my-8 text-lg font-medium"},(0,n.__)('No layouts found. Click on "Add New" to create a new layout.',"sky-elementor-addons")))))}},303:(e,t,o)=>{o.d(t,{A:()=>c});var i=o(609);function n(){return n=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(e[i]=o[i])}return e},n.apply(this,arguments)}var r=i.createElement("svg",{viewBox:"-2 -5 14 20",height:"100%",width:"100%",style:{position:"absolute",top:0}},i.createElement("path",{d:"M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12",fill:"#fff",fillRule:"evenodd"})),a=i.createElement("svg",{height:"100%",width:"100%",viewBox:"-2 -5 17 21",style:{position:"absolute",top:0}},i.createElement("path",{d:"M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0",fill:"#fff",fillRule:"evenodd"}));function s(e){if(7===e.length)return e;for(var t="#",o=1;o<4;o+=1)t+=e[o]+e[o];return t}function l(e,t,o,i,n){return function(e,t,o,i,n){var r=(e-o)/(t-o);if(0===r)return i;if(1===r)return n;for(var a="#",s=1;s<6;s+=2){var l=parseInt(i.substr(s,2),16),c=parseInt(n.substr(s,2),16),d=Math.round((1-r)*l+r*c).toString(16);1===d.length&&(d="0"+d),a+=d}return a}(e,t,o,s(i),s(n))}var c=function(e){function t(t){e.call(this,t);var o=t.height,i=t.width,n=t.checked;this.t=t.handleDiameter||o-2,this.i=Math.max(i-o,i-(o+this.t)/2),this.o=Math.max(0,(o-this.t)/2),this.state={h:n?this.i:this.o},this.l=0,this.u=0,this.p=this.p.bind(this),this.v=this.v.bind(this),this.k=this.k.bind(this),this.m=this.m.bind(this),this.M=this.M.bind(this),this.T=this.T.bind(this),this.$=this.$.bind(this),this.C=this.C.bind(this),this.D=this.D.bind(this),this.O=this.O.bind(this),this.S=this.S.bind(this),this.W=this.W.bind(this)}return e&&(t.__proto__=e),(t.prototype=Object.create(e&&e.prototype)).constructor=t,t.prototype.componentDidMount=function(){this.I=!0},t.prototype.componentDidUpdate=function(e){e.checked!==this.props.checked&&this.setState({h:this.props.checked?this.i:this.o})},t.prototype.componentWillUnmount=function(){this.I=!1},t.prototype.H=function(e){this.R.focus(),this.setState({j:e,B:!0,L:Date.now()})},t.prototype.N=function(e){var t=this.state,o=t.j,i=t.h,n=(this.props.checked?this.i:this.o)+e-o;t.U||e===o||this.setState({U:!0});var r=Math.min(this.i,Math.max(this.o,n));r!==i&&this.setState({h:r})},t.prototype.A=function(e){var t=this.state,o=t.h,i=t.U,n=t.L,r=this.props.checked,a=(this.i+this.o)/2;this.setState({h:this.props.checked?this.i:this.o});var s=Date.now()-n;(!i||s<250||r&&o<=a||!r&&o>=a)&&this.X(e),this.I&&this.setState({U:!1,B:!1}),this.l=Date.now()},t.prototype.p=function(e){e.preventDefault(),"number"==typeof e.button&&0!==e.button||(this.H(e.clientX),window.addEventListener("mousemove",this.v),window.addEventListener("mouseup",this.k))},t.prototype.v=function(e){e.preventDefault(),this.N(e.clientX)},t.prototype.k=function(e){this.A(e),window.removeEventListener("mousemove",this.v),window.removeEventListener("mouseup",this.k)},t.prototype.m=function(e){this.F=null,this.H(e.touches[0].clientX)},t.prototype.M=function(e){this.N(e.touches[0].clientX)},t.prototype.T=function(e){e.preventDefault(),this.A(e)},t.prototype.C=function(e){Date.now()-this.l>50&&(this.X(e),Date.now()-this.u>50&&this.I&&this.setState({B:!1}))},t.prototype.D=function(){this.u=Date.now()},t.prototype.O=function(){this.setState({B:!0})},t.prototype.S=function(){this.setState({B:!1})},t.prototype.W=function(e){this.R=e},t.prototype.$=function(e){e.preventDefault(),this.R.focus(),this.X(e),this.I&&this.setState({B:!1})},t.prototype.X=function(e){var t=this.props;(0,t.onChange)(!t.checked,e,t.id)},t.prototype.render=function(){var e=this.props,t=e.checked,o=e.disabled,r=e.className,a=e.offColor,s=e.onColor,c=e.offHandleColor,d=e.onHandleColor,h=e.checkedIcon,u=e.uncheckedIcon,p=e.checkedHandleIcon,m=e.uncheckedHandleIcon,g=e.boxShadow,f=e.activeBoxShadow,b=e.height,y=e.width,v=e.borderRadius,w=function(e,t){var o={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&-1===t.indexOf(i)&&(o[i]=e[i]);return o}(e,["checked","disabled","className","offColor","onColor","offHandleColor","onHandleColor","checkedIcon","uncheckedIcon","checkedHandleIcon","uncheckedHandleIcon","boxShadow","activeBoxShadow","height","width","borderRadius","handleDiameter"]),k=this.state,x=k.h,E=k.U,C=k.B,N={position:"relative",display:"inline-block",textAlign:"left",opacity:o?.5:1,direction:"ltr",borderRadius:b/2,WebkitTransition:"opacity 0.25s",MozTransition:"opacity 0.25s",transition:"opacity 0.25s",touchAction:"none",WebkitTapHighlightColor:"rgba(0, 0, 0, 0)",WebkitUserSelect:"none",MozUserSelect:"none",msUserSelect:"none",userSelect:"none"},S={height:b,width:y,margin:Math.max(0,(this.t-b)/2),position:"relative",background:l(x,this.i,this.o,a,s),borderRadius:"number"==typeof v?v:b/2,cursor:o?"default":"pointer",WebkitTransition:E?null:"background 0.25s",MozTransition:E?null:"background 0.25s",transition:E?null:"background 0.25s"},_={height:b,width:Math.min(1.5*b,y-(this.t+b)/2+1),position:"relative",opacity:(x-this.o)/(this.i-this.o),pointerEvents:"none",WebkitTransition:E?null:"opacity 0.25s",MozTransition:E?null:"opacity 0.25s",transition:E?null:"opacity 0.25s"},T={height:b,width:Math.min(1.5*b,y-(this.t+b)/2+1),position:"absolute",opacity:1-(x-this.o)/(this.i-this.o),right:0,top:0,pointerEvents:"none",WebkitTransition:E?null:"opacity 0.25s",MozTransition:E?null:"opacity 0.25s",transition:E?null:"opacity 0.25s"},M={height:this.t,width:this.t,background:l(x,this.i,this.o,c,d),display:"inline-block",cursor:o?"default":"pointer",borderRadius:"number"==typeof v?v-1:"50%",position:"absolute",transform:"translateX("+x+"px)",top:Math.max(0,(b-this.t)/2),outline:0,boxShadow:C?f:g,border:0,WebkitTransition:E?null:"background-color 0.25s, transform 0.25s, box-shadow 0.15s",MozTransition:E?null:"background-color 0.25s, transform 0.25s, box-shadow 0.15s",transition:E?null:"background-color 0.25s, transform 0.25s, box-shadow 0.15s"},D={height:this.t,width:this.t,opacity:Math.max(2*(1-(x-this.o)/(this.i-this.o)-.5),0),position:"absolute",left:0,top:0,pointerEvents:"none",WebkitTransition:E?null:"opacity 0.25s",MozTransition:E?null:"opacity 0.25s",transition:E?null:"opacity 0.25s"},A={height:this.t,width:this.t,opacity:Math.max(2*((x-this.o)/(this.i-this.o)-.5),0),position:"absolute",left:0,top:0,pointerEvents:"none",WebkitTransition:E?null:"opacity 0.25s",MozTransition:E?null:"opacity 0.25s",transition:E?null:"opacity 0.25s"};return i.createElement("div",{className:r,style:N},i.createElement("div",{className:"react-switch-bg",style:S,onClick:o?null:this.$,onMouseDown:function(e){return e.preventDefault()}},h&&i.createElement("div",{style:_},h),u&&i.createElement("div",{style:T},u)),i.createElement("div",{className:"react-switch-handle",style:M,onClick:function(e){return e.preventDefault()},onMouseDown:o?null:this.p,onTouchStart:o?null:this.m,onTouchMove:o?null:this.M,onTouchEnd:o?null:this.T,onTouchCancel:o?null:this.S},m&&i.createElement("div",{style:D},m),p&&i.createElement("div",{style:A},p)),i.createElement("input",n({},{type:"checkbox",role:"switch","aria-checked":t,checked:t,disabled:o,style:{border:0,clip:"rect(0 0 0 0)",height:1,margin:-1,overflow:"hidden",padding:0,position:"absolute",width:1}},w,{ref:this.W,onFocus:this.O,onBlur:this.S,onKeyUp:this.D,onChange:this.C})))},t}(i.Component);c.defaultProps={disabled:!1,offColor:"#888",onColor:"#080",offHandleColor:"#fff",onHandleColor:"#fff",uncheckedIcon:r,checkedIcon:a,boxShadow:null,activeBoxShadow:"0 0 2px 3px #3bf",height:28,width:56}}}]);