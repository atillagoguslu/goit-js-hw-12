import{S,i,a as O}from"./assets/vendor-BBSqv8W6.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const g of n.addedNodes)g.tagName==="LINK"&&g.rel==="modulepreload"&&s(g)}).observe(document,{childList:!0,subtree:!0});function r(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(o){if(o.ep)return;o.ep=!0;const n=r(o);fetch(o.href,n)}})();const p=document.querySelector(".search-form"),b=document.querySelector(".gallery-section"),a=document.querySelector(".load-more-btn"),f=document.querySelector(".loader"),q="49441477-341b75558156795e6f3713ba3",x="https://pixabay.com/api/",m=12,c={position:"topRight",timeout:3e3,progressBarColor:"rgb(0, 255, 184)",transitionIn:"fadeInLeft",transitionOut:"fadeOutRight"};let R=[],l=1,y="",d=0,u=!1,h=0;const w=2;a.style.display="none";f.style.display="none";const v=async(e,t=1)=>{f.style.display="flex";try{const r=await O.get(x,{params:{key:q,q:e,image_type:"photo",orientation:"horizontal",safesearch:!0,page:t,per_page:m}});return d=r.data.totalHits,r.data.hits}catch(r){return i.show({...c,title:"Error",message:`🟥 We cannot reach the server. Please try again later. Error: ${r.message} 🟥`,color:"red"}),[]}finally{f.style.display="none"}},$=async e=>{e.preventDefault();const t=p.querySelector("input[data-search-input]"),r=t.value.trim();if(!r){i.show({...c,title:"Info",message:"Please enter a search term.",color:"blue"});return}b.innerHTML="",l=1,y=r,d=0,u=!1,h=0,a.style.display="none",window.addEventListener("scroll",P);try{const s=await v(y,l);if(s.length===0){i.show({...c,title:"No Results",message:`Sorry, there are no images matching your search query "${r}". Please try again!`,color:"yellow"});return}R=s,E(s),I()}catch(s){console.error("Search handling error:",s),i.show({...c,title:"Error",message:"An unexpected error occurred during the search.",color:"red"})}finally{t.value=""}};p.addEventListener("submit",$);const L=async(e=!1)=>{if(u)return;const t=Math.ceil(d/m);if(l>=t){a.style.display="none",i.show({...c,title:"Info",message:"We're sorry, but you've reached the end of search results.",color:"blue"});return}if(!(e&&h>=w)){u=!0,a.disabled=!0,e&&h++,l++,f.style.display="flex";try{const r=await v(y,l);E(r);const{height:s}=document.querySelector(".gallery-item").getBoundingClientRect();window.scrollBy({top:s*2,behavior:"smooth"}),I()}catch(r){console.error("Load more error:",r),i.show({...c,title:"Error",message:"Failed to load more images.",color:"red"})}finally{u=!1,f.style.display="none",a.disabled=!1}}};a.addEventListener("click",()=>L(!1));let M=new S(".gallery-section a",{captionsData:"alt",captionDelay:250});const H=e=>{const t=document.createElement("div");return t.classList.add("gallery-item"),t.innerHTML=`
    <a href="${e.largeImageURL}">
      <img width="${e.webformatWidth}" height="${e.webformatHeight}" src="${e.webformatURL}" alt="${e.tags}" />
    </a>
    <div class="info">
      <div class="info-box">
        <b>Likes</b>
        ${e.likes}
      </div>
      <div class="info-box">
        <b>Views</b>
        ${e.views}
      </div>
      <div class="info-box">
        <b>Comments</b>
        ${e.comments}
      </div>
      <div class="info-box">
        <b>Downloads</b>
        ${e.downloads}
      </div>
    </div>
  `,t},E=e=>{const t=document.createDocumentFragment();e.forEach(r=>{const s=H(r);t.appendChild(s)}),b.appendChild(t),M.refresh()},I=()=>{const e=Math.ceil(d/m);l>=e?a.style.display="none":a.style.display="block"},P=()=>{if(u||!y||d===0||h>=w)return;const{scrollTop:e,scrollHeight:t,clientHeight:r}=document.documentElement,s=Math.ceil(d/m);e+r>=t-150&&l<s&&L(!0)};window.addEventListener("scroll",P);
//# sourceMappingURL=index.js.map
