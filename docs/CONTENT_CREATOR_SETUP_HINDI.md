# AI Content Creator — Netlify Setup (Hindi)

यह सुविधा `content/मुख्य_सिलेबस/index.html` पर AI Content Creator बटन जोड़ती है। Google Gemini कंटेंट बनाता है; आप HTML एडिटर में बदलाव करके GitHub में सेव कर सकते हैं।

## Netlify में तीन Environment Variables जोड़ें

Netlify Dashboard → CTETStudy site → Site configuration → Environment variables → Add a variable:

1. `GEMINI_API_KEY` — Google AI Studio से बनाई गई Gemini API Key
2. `GITHUB_CONTENT_TOKEN` — GitHub Fine-grained Personal Access Token
3. `CONTENT_CREATOR_PASSWORD` — Creator Popup खोलने/चलाने के लिए अपना अलग मजबूत पासवर्ड
4. (वैकल्पिक) `GEMINI_MODEL` — डिफॉल्ट `gemini-3.6-flash`; केवल तभी बदलें जब आपके API प्रोजेक्ट में दूसरा मॉडल उपलब्ध हो।

Gemini API Key: https://aistudio.google.com/apikey

## GitHub Token permissions

GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.

- Resource owner: `aaryanchiram`
- Repository access: Only select repositories → `STUDY`
- Repository permissions: Contents = Read and write
- बाकी permissions आवश्यक नहीं हैं।

Token को Netlify के `GITHUB_CONTENT_TOKEN` variable में रखें। Gemini API Key और GitHub Token को वेबसाइट, GitHub की HTML/JS फाइल या ChatGPT चैट में कभी न डालें।

## Deploy और जाँच

1. ऊपर के Environment Variables सेव करें।
2. Netlify में नया Production deploy चलाएँ (variables जोड़ने/बदलने के बाद redeploy जरूरी है)।
3. वेबसाइट खोलें → मुख्य सिलेबस → AI कंटेंट क्रिएटर।
4. विषय और टॉपिक चुनें, Creator Password डालें, कंटेंट बनायें।
5. HTML एडिटर में संशोधन करें, प्रीव्यू देखें और GitHub में सेव करें।
6. सेव होने पर GitHub Actions का `Auto update content library` workflow `assets/data/content-index.json` फिर से बनाएगा। उसके पूरा होने और Netlify deploy के बाद सामग्री मुख्य लाइब्रेरी में दिखेगी।

## जरूरी सीमाएँ

- Gemini API के Free Tier में कुछ मॉडल के लिए मुफ्त input/output उपलब्ध है, लेकिन मॉडल-उपलब्धता, RPM/TPM/RPD quota और उपयोग की सीमा लागू होती है। सीमा पार होने पर अनुरोध असफल हो सकता है या paid tier की आवश्यकता पड़ सकती है।
- Free Tier पर भेजा गया डेटा Google के उत्पादों को बेहतर बनाने के लिए उपयोग किया जा सकता है; संवेदनशील/निजी जानकारी prompt में न डालें।
- समान नाम की मौजूदा HTML फाइल को overwrite नहीं किया जाता; नया टॉपिक/फाइल नाम चुनें।
- Creator Password निजी रखें। यह प्रारंभिक सरल access gate है; इसे केवल अपने भरोसेमंद उपयोग के लिए रखें।
