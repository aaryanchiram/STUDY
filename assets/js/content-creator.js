(()=>{"use strict";
const topics={
 Hindi:[
 ["sangya","संज्ञा"],["sarvanam","सर्वनाम"],["visheshan","विशेषण"],["kriya","क्रिया"],["kriya-visheshan","क्रिया विशेषण"],["ling","लिंग"],["vachan","वचन"],["karak","कारक"],["kaal","काल"],["vachya","वाच्य"],["sandhi","संधि"],["samas","समास"],["upsarg-pratyay","उपसर्ग एवं प्रत्यय"],["paryayvachi","पर्यायवाची शब्द"],["vilom","विलोम शब्द"],["anekarthi","अनेकार्थी शब्द"],["muhavare","मुहावरे एवं लोकोक्तियाँ"],["vakya-vichar","वाक्य विचार"],["vakya-shuddhi","वाक्य शुद्धि"],["ras","रस"],["alankar","अलंकार"],["chhand","छंद"],["apathit-gadyansh","अपठित गद्यांश"],["bhasha-adhigam","भाषा अधिगम एवं अर्जन"],["bhasha-shikshan","हिंदी भाषा शिक्षणशास्त्र"]],
 Sanskrit:[
 ["varna-vichar","वर्ण विचार"],["sangya","संज्ञा एवं शब्द-भेद"],["shabda-rup","शब्दरूप"],["dhatu-rup","धातुरूप"],["karak-vibhakti","कारक एवं विभक्ति"],["sandhi","संधि"],["samas","समास"],["upsarg","उपसर्ग"],["pratyay","प्रत्यय"],["lakaar","लकार"],["purush-vachan","पुरुष एवं वचन"],["ling","लिंग"],["avyaya","अव्यय"],["pratyahara","प्रत्याहार"],["sanskrit-gadyansh","अपठित गद्यांश"],["shlok-arth","श्लोक एवं भावार्थ"],["anvay","अन्वय एवं पदच्छेद"],["patra-lekhan","पत्र लेखन"],["anuvad","अनुवाद"],["sanskrit-shikshan","संस्कृत भाषा शिक्षणशास्त्र"]],
 CDP:[
 ["bal-vikas","बाल विकास की अवधारणा एवं सिद्धांत"],["vanshanukram-vatavaran","वंशानुक्रम एवं वातावरण"],["piaget","पियाजे का संज्ञानात्मक विकास सिद्धांत"],["vygotsky","वाइगोत्स्की का सामाजिक-सांस्कृतिक सिद्धांत"],["kohlberg","कोहलबर्ग का नैतिक विकास सिद्धांत"],["gardner","गार्डनर का बहु-बुद्धि सिद्धांत"],["bruner","ब्रूनर का अधिगम सिद्धांत"],["samajikaran","समाजीकरण"],["kishoravastha","किशोरावस्था"],["vyaktigat-bhinnata","व्यक्तिगत भिन्नताएँ"],["buddhi","बुद्धि एवं बुद्धि के सिद्धांत"],["adhigam","अधिगम की अवधारणा एवं प्रक्रिया"],["abh prerana","अभिप्रेरणा"],["smriti-vismriti","स्मृति एवं विस्मृति"],["samaveshi-shiksha","समावेशी शिक्षा"],["vishesh-aavashyakta","विशेष आवश्यकता वाले बच्चे"],["adhigam-akshamata","अधिगम अक्षमता"],["bal-kendrit-shiksha","बाल-केंद्रित शिक्षा"],["nirmaanvad","निर्माणवाद"],["mulyankan","आकलन एवं मूल्यांकन"],["CCE","सतत एवं व्यापक मूल्यांकन"],["upcharatmak-shikshan","निदानात्मक एवं उपचारात्मक शिक्षण"],["bhasha-aur-chintan","भाषा एवं चिंतन"],["srijanatmakta","सृजनात्मकता"]],
 Social_Science:[
 ["itihas-srot","इतिहास के स्रोत"],["sindhu-sabhyata","सिंधु घाटी सभ्यता"],["vaidik-kal","वैदिक काल"],["mahajanpad","महाजनपद एवं मगध"],["bauddh-jain","बौद्ध एवं जैन धर्म"],["maurya-samrajya","मौर्य साम्राज्य एवं अशोक"],["gupta-kal","गुप्त काल"],["delhi-saltanat","दिल्ली सल्तनत"],["mughal-samrajya","मुगल साम्राज्य"],["bhakti-sufi","भक्ति एवं सूफी आंदोलन"],["1857-vidroh","1857 का विद्रोह"],["rashtriya-andolan","भारतीय राष्ट्रीय आंदोलन"],["samvidhan","भारतीय संविधान"],["maulik-adhikar","मौलिक अधिकार एवं कर्तव्य"],["loktantra","लोकतंत्र एवं सरकार"],["sansad","संसद एवं कानून निर्माण"],["nyaypalika","न्यायपालिका"],["panchayati-raj","पंचायती राज"],["prithvi","पृथ्वी एवं सौरमंडल"],["akshansh-deshantar","अक्षांश एवं देशांतर"],["bharat-bhugol","भारत का भौतिक भूगोल"],["jalvayu","जलवायु एवं मानसून"],["nadi-jal-sansadhan","नदियाँ एवं जल संसाधन"],["prakritik-sansadhan","प्राकृतिक संसाधन"],["krishi-udyog","कृषि एवं उद्योग"],["manchitra","मानचित्र अध्ययन"],["samajik-vigyan-shikshan","सामाजिक विज्ञान शिक्षणशास्त्र"]]
};
const subjectNames={Hindi:"हिंदी भाषा",Sanskrit:"संस्कृत भाषा",CDP:"बाल विकास एवं शिक्षाशास्त्र (CDP)",Social_Science:"सामाजिक विज्ञान"};
const $=s=>document.querySelector(s);
let selectedSubject="",selectedTopic=null,password="";
function el(tag,attrs={},html=""){const n=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));n.innerHTML=html;return n}
function init(){
 const hero=document.querySelector("main .hero");if(!hero)return;
 let open=$("#contentCreatorOpen");if(!open){open=el("button",{id:"contentCreatorOpen",type:"button",class:"creator-open"},"✦ AI कंटेंट क्रिएटर");hero.insertAdjacentElement("afterend",open);}
 const modal=el("div",{id:"contentCreatorModal","aria-hidden":"true"});
 modal.innerHTML=`<div class="creator-backdrop" data-close="1"></div><section class="creator-dialog" role="dialog" aria-modal="true" aria-labelledby="creatorTitle"><header class="creator-head"><div><span>CTET DIGITAL LIBRARY</span><h2 id="creatorTitle">✦ AI कंटेंट क्रिएटर</h2><p>विषय चुनें, टॉपिक चुनें और अध्ययन सामग्री तैयार करें।</p></div><button type="button" class="creator-close" aria-label="बंद करें">×</button></header><div class="creator-body"><label class="creator-label" for="creatorSubject">1. मुख्य विषय चुनें</label><select id="creatorSubject"><option value="">— विषय चुनें —</option><option value="Hindi">हिंदी</option><option value="Sanskrit">संस्कृत</option><option value="CDP">CDP</option><option value="Social_Science">सामाजिक विज्ञान</option></select><label class="creator-label" for="creatorSearch">2. टॉपिक खोजें / चुनें</label><input id="creatorSearch" type="search" placeholder="टॉपिक का नाम लिखकर खोजें…" disabled><div id="creatorTopicList" class="creator-topic-list"><p class="creator-muted">पहले मुख्य विषय चुनें।</p></div><div class="creator-selected" id="creatorSelected">अभी कोई टॉपिक नहीं चुना गया।</div><label class="creator-label" for="creatorPassword">3. Creator Password</label><input id="creatorPassword" type="password" autocomplete="current-password" placeholder="Netlify में सेट किया गया पासवर्ड"><div class="creator-actions"><button type="button" id="creatorGenerate" disabled>✦ कंटेंट बनायें</button></div><p id="creatorStatus" class="creator-status" role="status"></p><section id="creatorEditor" hidden><label class="creator-label" for="creatorHtml">4. तैयार कंटेंट एडिट करें (HTML)</label><textarea id="creatorHtml" spellcheck="false"></textarea><div class="creator-preview-head"><strong>प्रीव्यू</strong><button type="button" id="creatorPreview">प्रीव्यू अपडेट करें</button></div><iframe id="creatorPreviewFrame" title="कंटेंट प्रीव्यू" sandbox=""></iframe><div class="creator-actions"><button type="button" id="creatorSave">✓ GitHub में HTML सेव करें</button></div></section></div></section>`;
 document.body.appendChild(modal);
 const close=()=>{modal.classList.remove("is-open");modal.setAttribute("aria-hidden","true")};
 open.addEventListener("click",()=>{modal.classList.add("is-open");modal.setAttribute("aria-hidden","false");$("#creatorSubject").focus()});
 modal.querySelectorAll("[data-close],.creator-close").forEach(n=>n.addEventListener("click",close));
 document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
 $("#creatorSubject").addEventListener("change",e=>{selectedSubject=e.target.value;selectedTopic=null;$("#creatorSearch").disabled=!selectedSubject;$("#creatorSearch").value="";$("#creatorGenerate").disabled=true;$("#creatorSelected").textContent="अभी कोई टॉपिक नहीं चुना गया।";$("#creatorEditor").hidden=true;renderTopics()});
 $("#creatorSearch").addEventListener("input",renderTopics);
 $("#creatorGenerate").addEventListener("click",generate);
 $("#creatorPreview").addEventListener("click",updatePreview);
 $("#creatorSave").addEventListener("click",save);
}
function renderTopics(){
 const list=$("#creatorTopicList"),q=$("#creatorSearch").value.trim().toLocaleLowerCase("hi"),all=topics[selectedSubject]||[];
 const matches=all.filter(t=>t[1].toLocaleLowerCase("hi").includes(q));
 list.innerHTML=matches.length?"":'<p class="creator-muted">कोई टॉपिक नहीं मिला।</p>';
 matches.forEach(t=>{const b=el("button",{type:"button",class:"creator-topic"+(selectedTopic?.[0]===t[0]?" selected":"")},t[1]);b.addEventListener("click",()=>{selectedTopic=t;$("#creatorSelected").textContent="चयनित टॉपिक: "+t[1];$("#creatorGenerate").disabled=false;renderTopics()});list.appendChild(b)});
}
async function callApi(payload){
 const response=await fetch("/.netlify/functions/content-creator",{method:"POST",headers:{"Content-Type":"application/json","X-Creator-Password":$("#creatorPassword").value},body:JSON.stringify(payload)});
 const data=await response.json().catch(()=>({error:"सर्वर से सही जवाब नहीं मिला।"}));
 if(!response.ok)throw new Error(data.error||"अनुरोध विफल हुआ।");
 return data;
}
async function generate(){
 if(!selectedSubject||!selectedTopic)return;
 const btn=$("#creatorGenerate");btn.disabled=true;status("OpenAI से कंटेंट तैयार हो रहा है… इसमें कुछ समय लग सकता है।");
 try{const data=await callApi({action:"generate",subject:selectedSubject,topic:selectedTopic[1],slug:selectedTopic[0]});$("#creatorHtml").value=data.html;$("#creatorEditor").hidden=false;updatePreview();status("कंटेंट तैयार है। अब नीचे एडिट करें और सेव करने से पहले प्रीव्यू देखें।","success");$("#creatorEditor").scrollIntoView({behavior:"smooth",block:"start"})}
 catch(e){status(e.message,"error")}finally{btn.disabled=false}
}
function updatePreview(){
 const fragment=$("#creatorHtml").value;
 const doc='<!doctype html><html lang="hi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font:16px/1.8 system-ui,"Noto Sans Devanagari",sans-serif;color:#203044;padding:18px}h2,h3{color:#123f68}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px}th{background:#edf5f8}blockquote{border-left:4px solid #087e78;padding:8px 14px;background:#edf7f5}</style><body>'+fragment+'</body></html>';
 $("#creatorPreviewFrame").srcdoc=doc;
}
async function save(){
 const btn=$("#creatorSave");btn.disabled=true;status("GitHub में फाइल सेव की जा रही है…");
 try{const data=await callApi({action:"save",subject:selectedSubject,topic:selectedTopic[1],slug:selectedTopic[0],html:$("#creatorHtml").value});status("सफलता! "+data.path+" सेव हो गई। GitHub Actions इंडेक्स अपडेट करेगा।","success");btn.textContent="सेव हो गया ✓"}
 catch(e){status(e.message,"error");btn.disabled=false}
}
function status(message,type=""){const n=$("#creatorStatus");n.textContent=message;n.className="creator-status "+type}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();