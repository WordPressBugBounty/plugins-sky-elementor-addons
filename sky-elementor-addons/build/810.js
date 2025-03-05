"use strict";(globalThis.webpackChunksky_addons=globalThis.webpackChunksky_addons||[]).push([[810],{2571:(e,t,a)=>{a.d(t,{A:()=>n});var r=a(1609),s=a(7723);const n=({title:e,desc:t})=>(0,r.createElement)("div",{className:"relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-purple-800 to-purple-400 text-white shadow-purple-500/40 shadow-lg -mt-12 mb-8 p-6"},(0,r.createElement)("div",{className:"flex w-full items-center justify-between"},(0,r.createElement)("div",null,(0,r.createElement)("h6",{className:"block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white mt-0 mb-1"},(0,s.__)(e,"sky-elementor-addons")),(0,r.createElement)("div",{className:"block antialiased font-sans text-md font-normal dark:text-gray-300"},(0,s.__)(t,"sky-elementor-addons")))))},4810:(e,t,a)=>{a.r(t),a.d(t,{default:()=>i});var r=a(1609),s=a(7723),n=a(1083),l=a(8465),o=a.n(l),d=(a(2571),a(982)),c=a(6188);const i=({isWizard:e=!1})=>{const[t,a]=(0,r.useState)(!1),[l,i]=(0,r.useState)(""),[m,g]=(0,r.useState)(""),[u,y]=(0,r.useState)(!0),[p,b]=(0,r.useState)(!0),[x,k]=(0,r.useState)({});(0,r.useEffect)((()=>{(async()=>{try{const e=await n.A.get(SkyAddonsConfig?.rest_url+"skyaddons/v1/manage-license",{params:{who:"license_tab"},headers:{"X-WP-Nonce":SkyAddonsConfig.nonce}});i(e?.data?.license_key||""),w(e?.data?.license_key||""),g(e?.data?.license_email||""),b(!!e?.data?.license_key),console.log(e?.data?.data),k(e?.data?.data||{}),y(!1)}catch(e){console.error("Error fetching settings:",e),y(!1),b(!1)}})()}),[]);const[h,w]=(0,r.useState)("");return u?(0,r.createElement)(r.Fragment,null,(0,r.createElement)("div",{className:"text-center"},(0,s.__)("Loading","sky-elementor-addons"),"..."),(0,r.createElement)("div",{className:"flex justify-center items-center h-40 mt-12"},(0,r.createElement)("div",{className:"animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"}))):(0,r.createElement)("div",{className:"mb-12 relative flex flex-col bg-clip-border rounded-xl bg-white dark:bg-gray-900 text-gray-700 shadow-sm"},(0,r.createElement)("div",{className:"p-6"},(0,r.createElement)("div",{className:"grid grid-cols-1 gap-10 sm:grid-cols-2"},(0,r.createElement)("div",null,!p&&(0,r.createElement)("form",{onSubmit:async t=>{if(t.preventDefault(),""!==h)if(""!==m)try{o().fire({title:"Loading...",allowOutsideClick:!1,didOpen:()=>{o().showLoading()}});const t=await n.A.post(SkyAddonsConfig?.rest_url+"skyaddons/v1/manage-license",null,{params:{sky_addons_pro_license_key:l,sky_addons_pro_license_email:m,who:"license_tab"},headers:{"X-WP-Nonce":SkyAddonsConfig.nonce}});localStorage.setItem("sky_addons_setup_wizard_step",1),o().fire({icon:"success",title:(0,s.__)("Success","sky-elementor-addons"),html:t?.data?.message,showConfirmButton:!1,timer:2500,willClose:()=>{window.location.reload()}}),e&&setTimeout((()=>{o().fire({title:"Loading...",allowOutsideClick:!1,didOpen:()=>{window.location.reload(),o().showLoading()}})}),2e3)}catch(e){o().fire({icon:"error",title:e?.response?.data?.data?.title||"An error occurred",showConfirmButton:!0,html:e?.response?.data?.message||"Please try again"})}else o().fire({icon:"error",title:"Email is required",showConfirmButton:!0});else o().fire({icon:"error",title:"License Key is required",showConfirmButton:!0})}},(0,r.createElement)("div",{className:"flex items-center gap-6"},(0,r.createElement)("div",{className:"w-[80%]"},(0,r.createElement)("h6",{className:"mb-2 text-slate-800 text-lg font-semibold dark:text-white"},(0,s.__)("Activate your Sky Addons Premium","sky-elementor-addons")),(0,r.createElement)("p",{className:"mb-4 text-sm text-gray-500 dark:text-gray-400"},(0,s.__)("Without a valid license key, you won't be able to access the premium features of Sky Addons.","sky - elementor - addons")))),(0,r.createElement)("div",{className:"relative"},(0,r.createElement)("label",{className:"block mb-2 text-sm font-medium text-gray-900 dark:text-white"},"API Key"),(0,r.createElement)("div",{className:"relative"},(0,r.createElement)("div",{className:"absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-gray-500 dark:text-gray-400"},(0,r.createElement)("svg",{fill:"currentColor",className:"w-4 h-4","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},(0,r.createElement)("path",{d:"M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z"}))),(0,r.createElement)("input",{value:l||"",type:t?"text":"password",onChange:e=>{w(e.target.value),i(e.target.value)},name:"sky_addons_pro_license_key",className:"blur-xs block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"}),(0,r.createElement)("div",{className:"text-white absolute end-2.5 bottom-2.5 bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-blue-800 cursor-pointer leading-none",onClick:()=>{a(!t)}},(0,r.createElement)(d.g,{icon:t?c.pS3:c.k6j,className:"h-4 w-4"})))),(0,r.createElement)("div",{className:"relative mt-6"},(0,r.createElement)("label",{className:"block mb-2 text-sm font-medium text-gray-900 dark:text-white"},"Email"),(0,r.createElement)("input",{value:m||"",type:"email",onChange:e=>g(e.target.value),name:"sky_addons_pro_license_email",className:"block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"})),(0,r.createElement)("button",{type:"submit",className:"mt-6 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-md w-full sm:w-auto px-6 py-3.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"},(0,s.__)("Activate","sky-elementor-addons"))),p&&(0,r.createElement)("div",{className:"relative"},(0,r.createElement)("table",{className:"w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"},(0,r.createElement)("caption",{className:"pb-5 text-lg font-semibold text-left rtl:text-right text-gray-900 dark:text-white"},(0,s.__)("License Information","sky-elementor-addons"),(0,r.createElement)("p",{className:"mt-1 text-sm font-normal text-gray-500 dark:text-gray-400"},(0,s.__)("This is your current license information.","sky-elementor-addons"))),(0,r.createElement)("tbody",null,(0,r.createElement)("tr",{className:"border-b border-t dark:border-gray-700 border-gray-200"},(0,r.createElement)("th",{scope:"row",className:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},"License Title"),(0,r.createElement)("td",{className:"px-6 py-4 text-gray-900 dark:text-white"},x?.license_title)),(0,r.createElement)("tr",{className:"border-b dark:border-gray-700 border-gray-200"},(0,r.createElement)("th",{scope:"row",className:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},"License Key"),(0,r.createElement)("td",{className:"px-6 py-4 text-gray-900 dark:text-white"},x?.license_key?.substr(0,9)+"XXXXXXXX-XXXXXXXX"+x?.license_key?.substr(-9))),(0,r.createElement)("tr",{className:"border-b dark:border-gray-700 border-gray-200"},(0,r.createElement)("th",{scope:"row",className:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},"Is Valid"),(0,r.createElement)("td",{className:"px-6 py-4 text-gray-900 dark:text-white"},x?.is_valid?(0,r.createElement)("span",{className:"text-white bg-green-600 px-2 py-1 rounded"},"Valid"):(0,r.createElement)("span",{className:"text-red-600 dark:text-red-400"},"Invalid"))),(0,r.createElement)("tr",{className:"border-b dark:border-gray-700 border-gray-200"},(0,r.createElement)("th",{scope:"row",className:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},"Expire Date"),(0,r.createElement)("td",{className:"px-6 py-4 text-gray-900 dark:text-white"},x?.expire_date)),(0,r.createElement)("tr",{className:"border-b dark:border-gray-700 border-gray-200"},(0,r.createElement)("th",{scope:"row",className:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},"Status"),(0,r.createElement)("td",{className:"px-6 py-4 text-gray-900 dark:text-white"},x?.msg)),(0,r.createElement)("tr",{className:"border-b dark:border-gray-700 border-gray-200"},(0,r.createElement)("th",{scope:"row",className:"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"},"Support End"),(0,r.createElement)("td",{className:"px-6 py-4 text-gray-900 dark:text-white"},x?.support_end)))),(0,r.createElement)("button",{type:"button",className:"mt-6 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-md w-full sm:w-auto px-6 py-3 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800",onClick:async()=>{try{o().fire({title:"Loading...",allowOutsideClick:!1,didOpen:()=>{o().showLoading()}});const e=await n.A.delete(SkyAddonsConfig?.rest_url+"skyaddons/v1/manage-license",{params:{who:"license_tab"},headers:{"X-WP-Nonce":SkyAddonsConfig.nonce}});o().fire({icon:"success",title:(0,s.__)("Success","sky-elementor-addons"),html:e?.data?.message,showConfirmButton:!1,timer:2500,willClose:()=>{window.location.reload()}})}catch(e){o().fire({icon:"error",title:e?.response?.data?.data?.title||"An error occurred",showConfirmButton:!0,html:e?.response?.data?.message||"Please try again"})}}},(0,s.__)("Deactivate","sky-elementor-addons")))),(0,r.createElement)("div",null,(0,r.createElement)("h3",{className:"text-lg font-semibold text-gray-900 dark:text-white mb-2"},(0,s.__)("How to get License Key","sky-elementor-addons")),(0,r.createElement)("p",{className:"mb-4 text-base font-normal text-gray-500 dark:text-gray-400"},"License Key is very important for you. Otherwise, you will not able to use premium features."),(0,r.createElement)("ul",{className:"list-disc pl-5"},(0,r.createElement)("li",{className:"mb-2 text-base font-normal text-gray-500 dark:text-gray-400"},(0,r.createElement)("strong",null,"Step 1:")," Go to your account on ",(0,r.createElement)("a",{href:"https://account.wowdevs.com/",target:"_blank",className:"text-blue-500"},"https://account.wowdevs.com/")),(0,r.createElement)("li",{className:"mb-2 text-base font-normal text-gray-500 dark:text-gray-400"},(0,r.createElement)("strong",null,"Step 2:")," You if you don't have an account, create an account with the same email you used to purchase the plugin."),(0,r.createElement)("li",{className:"mb-2 text-base font-normal text-gray-500 dark:text-gray-400"},(0,r.createElement)("strong",null,"Step 3:")," If you are facing any issue, please contact us on ",(0,r.createElement)("a",{href:"https://wowdevs.com/support",target:"_blank",className:"text-blue-500"},"https://wowdevs.com/support")))))))}}}]);