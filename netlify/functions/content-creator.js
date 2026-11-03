const REPO_OWNER = "aaryanchiram";
const REPO_NAME = "STUDY";
const SUBJECTS = {
  Hindi: { label: "हिंदी भाषा", folder: "Hindi" },
  Sanskrit: { label: "संस्कृत भाषा", folder: "Sanskrit" },
  CDP: { label: "बाल विकास एवं शिक्षाशास्त्र (CDP)", folder: "CDP" },
  Social_Science: { label: "सामाजिक विज्ञान", folder: "Social_Science" }
};

const headers = { "content-type": "application/json; charset=utf-8" };
const reply = (statusCode, payload) => ({ statusCode, headers, body: JSON.stringify(payload) });
const safeText = (v, max = 120) => String(v ?? "").trim().slice(0, max);
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const slugify = value => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70);

async function github(path, options = {}) {
  const response = await fetch("https://api.github.com/repos/" + REPO_OWNER + "/" + REPO_NAME + "/contents/" + path.split("/").map(encodeURIComponent).join("/"), {
    ...options,
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": "Bearer " + process.env.GITHUB_CONTENT_TOKEN,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

exports.handler = async event => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: { "Access-Control-Allow-Origin": process.env.URL || "*", "Access-Control-Allow-Headers": "Content-Type,X-Creator-Password", "Access-Control-Allow-Methods": "POST,OPTIONS" }, body: "" };
  if (event.httpMethod !== "POST") return reply(405, { error: "केवल POST अनुरोध स्वीकार है।" });

  const configuredPassword = process.env.CONTENT_CREATOR_PASSWORD;
  if (!configuredPassword || !process.env.GITHUB_CONTENT_TOKEN) return reply(503, { error: "Content Creator के लिए Netlify में आवश्यक environment variables सेट नहीं हैं।" });
  const suppliedPassword = event.headers["x-creator-password"] || event.headers["X-Creator-Password"] || "";
  const suppliedBytes = Buffer.from(suppliedPassword, "utf8");
  const configuredBytes = Buffer.from(configuredPassword, "utf8");
  if (suppliedBytes.length !== configuredBytes.length || !require("node:crypto").timingSafeEqual(suppliedBytes, configuredBytes)) {
    return reply(401, { error: "Creator Password गलत है।" });
  }

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch { return reply(400, { error: "अनुरोध का डेटा सही JSON नहीं है।" }); }
  const subjectId = safeText(body.subject, 30);
  const subject = SUBJECTS[subjectId];
  const topic = safeText(body.topic, 100);
  const slug = safeText(body.slug, 80);
  if (!subject || !topic || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return reply(400, { error: "विषय या टॉपिक का चयन सही नहीं है।" });

  if (body.action === "generate") {
    if (!process.env.GEMINI_API_KEY) return reply(503, { error: "Netlify में GEMINI_API_KEY सेट नहीं है।" });
    const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
    const prompt = `आप CTET Paper II के अनुभवी हिंदी माध्यम शिक्षक और अध्ययन-सामग्री लेखक हैं।
विषय: ${subject.label}
टॉपिक: ${topic}

इस विषय पर गहराई से, तथ्यात्मक और परीक्षा-उपयोगी अध्ययन सामग्री तैयार करें। सामग्री हिंदी में हो; संस्कृत विषय होने पर आवश्यक संस्कृत उदाहरण दें। HTML fragment ही लौटाएँ, पूरा HTML document नहीं। इसमें ये उपयुक्त भाग शामिल करें:
- स्पष्ट परिचय और सरल परिभाषा
- अवधारणाएँ/प्रकार/नियम (जहाँ लागू हों)
- क्रमबद्ध विस्तृत व्याख्या और तालिकाएँ
- सही उदाहरण और सामान्य भ्रम/गलतियाँ
- CTET परीक्षा के लिए महत्वपूर्ण बिंदु
- 10 बहुविकल्पीय प्रश्न, प्रत्येक के चार विकल्प, सही उत्तर और संक्षिप्त व्याख्या
- 5 त्वरित पुनरावृत्ति प्रश्न या सारांश

HTML को semantic रखें: h2, h3, p, ul, ol, table, blockquote, details/summary का उपयोग कर सकते हैं। Inline CSS, script, iframe, form, external links, markdown fences या बाहरी संसाधन न दें। किसी तथ्य/वर्ष/लेखक को लेकर अनिश्चित हों तो मनगढ़ंत दावा न करें; उसे स्पष्ट रूप से सावधानी सहित लिखें। जवाब केवल HTML fragment हो।`;
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent", {
        method: "POST",
        headers: { "x-goog-api-key": process.env.GEMINI_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 7000, temperature: 0.7, responseMimeType: "text/plain" }
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = data.error?.message || "Gemini से कंटेंट नहीं बन पाया।";
        return reply(response.status === 429 ? 429 : 502, { error: message });
      }
      const html = String((data.candidates || []).flatMap(c => c.content?.parts || []).map(p => p.text || "").join("\n")).trim()
        .replace(/^\`\`\`(?:html)?\s*/i, "").replace(/\s*\`\`\`$/, "");
      if (!html || html.length < 100) return reply(502, { error: "Gemini से उपयोगी HTML सामग्री प्राप्त नहीं हुई।" });
      if (/<\s*(script|iframe|form|object|embed)\b|\son[a-z]+\s*=|javascript\s*:/i.test(html)) return reply(502, { error: "सुरक्षा कारणों से AI आउटपुट अस्वीकार किया गया।" });
      return reply(200, { html, model });
    } catch (error) {
      return reply(502, { error: "Gemini अनुरोध विफल: " + safeText(error.message, 180) });
    }
  }

  if (body.action === "save") {
    const htmlFragment = String(body.html || "").trim();
    if (htmlFragment.length < 100 || htmlFragment.length > 180000) return reply(400, { error: "कंटेंट 100 से 180000 अक्षरों के बीच होना चाहिए।" });
    if (/<\s*(script|iframe|form|object|embed)\b|\son[a-z]+\s*=|javascript\s*:/i.test(htmlFragment)) return reply(400, { error: "कंटेंट में प्रतिबंधित HTML टैग मिला।" });
    if (!process.env.GITHUB_CONTENT_TOKEN) return reply(503, { error: "GitHub Token सेट नहीं है।" });

    const path = "content/" + subject.folder + "/" + slug + ".html";
    const check = await github(path);
    if (check.response.ok) return reply(409, { error: "इस नाम की फाइल पहले से मौजूद है। नया टॉपिक/फाइल नाम चुनें।", path });
    if (check.response.status !== 404) return reply(502, { error: check.data.message || "GitHub पर फाइल की जाँच नहीं हो सकी।" });

    const title = topic + " — " + subject.label + " | CTET अध्ययन सामग्री";
    const description = subject.label + " में " + topic + " की विस्तृत व्याख्या, उदाहरण और CTET अभ्यास प्रश्न।";
    const page = `<!doctype html>
<html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#123f68"><meta name="description" content="${escapeHtml(description)}"><title>${escapeHtml(title)}</title><link rel="stylesheet" href="../../assets/css/style.css"><style>
body{margin:0;background:#f4f7fb;color:#203044;font-family:system-ui,'Noto Sans Devanagari',sans-serif;line-height:1.8}.generated-wrap{width:min(100% - 28px,1000px);margin:24px auto 60px}.generated-hero{background:linear-gradient(125deg,#123f68,#087e78);color:#fff;padding:28px;border-radius:18px;margin-bottom:20px}.generated-hero h1{margin:6px 0;font-size:clamp(1.6rem,4vw,2.4rem);line-height:1.35}.generated-hero p{margin:0;color:#e5f3f5}.generated-content{background:#fff;border:1px solid #e1e8ef;border-radius:16px;padding:clamp(16px,3vw,30px);box-shadow:0 8px 25px #123f680b}.generated-content h2,.generated-content h3{color:#123f68;line-height:1.5}.generated-content table{width:100%;border-collapse:collapse;display:block;overflow-x:auto}.generated-content th,.generated-content td{border:1px solid #dbe4ec;padding:9px;text-align:left}.generated-content th{background:#edf5f8}.generated-content blockquote{border-left:4px solid #087e78;background:#edf7f5;padding:12px 16px;margin:16px 0}.generated-content img{max-width:100%;height:auto}.generated-nav{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 16px}.generated-nav a{display:inline-flex;padding:9px 14px;border-radius:9px;background:#123f68;color:#fff;text-decoration:none;font-weight:700}@media(max-width:600px){.generated-wrap{width:calc(100% - 20px);margin:12px auto 36px}.generated-hero{padding:20px}.generated-content{padding:15px}}
</style></head><body><main class="generated-wrap"><nav class="generated-nav"><a href="../../index.html">🏠 होम</a><a href="../मुख्य_सिलेबस/index.html">मुख्य सिलेबस</a></nav><header class="generated-hero"><span>CTET DIGITAL LIBRARY • ${escapeHtml(subject.label)}</span><h1>${escapeHtml(topic)}</h1><p>अध्ययन सामग्री • व्याख्या • उदाहरण • अभ्यास प्रश्न</p></header><article class="generated-content">${htmlFragment}</article></main><script src="../../assets/js/reading-assistant.js" defer></script></body></html>`;

    const created = await github(path, { method: "PUT", body: JSON.stringify({ message: "Add AI-generated " + topic + " study content", content: Buffer.from(page, "utf8").toString("base64") }) });
    if (!created.response.ok) return reply(created.response.status === 409 ? 409 : 502, { error: created.data.message || "GitHub में HTML फाइल सेव नहीं हुई।" });
    return reply(200, { ok: true, path, url: "/" + path, commit: created.data.commit?.html_url || "", message: "HTML फाइल GitHub में सेव हो गई। Auto Index workflow अब लाइब्रेरी सूची अपडेट करेगा।" });
  }

  return reply(400, { error: "अमान्य action है।" });
};
