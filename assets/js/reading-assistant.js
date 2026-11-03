(function(){"use strict";function init(){if(document.getElementById("studyAudioDock"))return;
const currentScript=document.currentScript||document.querySelector('script[src*="reading-assistant.js"]');
const homeUrl=currentScript?new URL("../../index.html",currentScript.src).href:"../../index.html";
const pagePath=location.pathname.replace(/\/+$/,"");
const isHomePage=pagePath===""||/\/index\.html$/i.test(pagePath)&&!pagePath.includes("/content/");
if(!isHomePage&&!document.getElementById("studyPageActions")){
const actions=document.createElement("div");actions.id="studyPageActions";
actions.innerHTML='<a class="study-page-action study-home-action" href="'+homeUrl+'">🏠 होम</a><button class="study-page-action study-back-action" type="button">← Back</button>';
const style=document.createElement("style");style.textContent='#studyPageActions{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:28px auto 20px;padding:0 16px;max-width:1100px;position:static;clear:both}#studyPageActions .study-page-action{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-height:44px;padding:12px 20px;border:0;border-radius:7px;background:#123f68;color:#fff;text-decoration:none;font:700 14px/1.4 system-ui,-apple-system,"Noto Sans Devanagari",sans-serif;cursor:pointer}#studyPageActions .study-page-action:hover{background:#1769aa}#studyPageActions .study-back-action{font-family:inherit}';
document.head.appendChild(style);
const hero=document.querySelector("main .hero,body > header.hero,header.hero,section.hero,.hero");
const heading=document.querySelector("main h1,body h1");
const headingBlock=heading?heading.closest("header,section,.hero")||heading:null;
const anchor=hero||headingBlock;
if(anchor){anchor.insertAdjacentElement("afterend",actions)}
else{const main=document.querySelector("main");if(main)main.insertAdjacentElement("afterbegin",actions);else document.body.insertBefore(actions,document.body.firstChild)}
actions.querySelector(".study-back-action").addEventListener("click",()=>{if(history.length>1)history.back();else location.href=homeUrl});
}

const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
const dock=document.createElement("div");dock.id="studyAudioDock";dock.classList.add("is-hidden");dock.innerHTML='<button class="speaker" type="button" aria-label="पढ़ना शुरू करें" aria-pressed="false" title="स्पीच चालू / बंद">🔊</button>';document.body.appendChild(dock);
const synth=window.speechSynthesis,btn=dock.querySelector("button");let selected=null,active=null,reading=false,hideTimer=null;function showDock(){if(hideTimer){clearTimeout(hideTimer);hideTimer=null}dock.classList.remove("is-hidden")}function hideDockLater(){if(hideTimer)clearTimeout(hideTimer);hideTimer=setTimeout(()=>{if(!reading)dock.classList.add("is-hidden")},2500)}
function clean(el){const c=el.cloneNode(true);c.querySelectorAll("button,script,style,nav,audio,video,input,select,textarea").forEach(n=>n.remove());return(c.innerText||c.textContent||"").replace(/\s+/g," ").trim()}
function unmark(){if(active)active.classList.remove("study-reading");active=null}
function stop(){if(synth)synth.cancel();reading=false;btn.textContent="🔊";btn.setAttribute("aria-pressed","false");btn.setAttribute("aria-label","पढ़ना शुरू करें");unmark();hideDockLater()}
function start(el){if(!synth||!window.SpeechSynthesisUtterance)return;const target=el||selected||document.querySelector("main")||document.body;const t=clean(target);if(t.length<10)return;showDock();synth.cancel();unmark();active=target;active.classList.add("study-reading");const u=new SpeechSynthesisUtterance(t);u.lang="hi-IN";u.rate=1;const voices=synth.getVoices(),hi=voices.filter(v=>/^hi([-_]|$)/i.test(v.lang)||/hindi|हिन्दी/i.test(v.name));const v=hi.find(x=>/female|woman|zira|heera|kalpana|lekha/i.test(x.name))||hi[0];if(v)u.voice=v;u.onend=()=>stop();u.onerror=()=>stop();reading=true;btn.textContent="⏹";btn.setAttribute("aria-pressed","true");btn.setAttribute("aria-label","पढ़ना बंद करें");synth.speak(u)}
btn.addEventListener("click",()=>{if(reading)stop()});
function getContent(e){if(e.target.closest("#studyAudioDock,button,a,input,select,textarea,summary"))return null;return e.target.closest("article,.battle,.panel,.note,.callout,.trick,section,li,tr,figure,p,h1,h2,h3,h4,.event,.card")}
// Single tap chooses a passage; while reading, a tap anywhere in lesson stops.
document.addEventListener("click",e=>{const el=getContent(e);if(!el)return;if(reading){stop();return}selected=el;});
document.addEventListener("dblclick",e=>{const el=getContent(e);if(!el)return;e.preventDefault();selected=el;if(reading)stop();else start(el)});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&reading)stop()});
}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init()})();