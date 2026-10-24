const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : (process.platform === 'darwin' ? 5001 : 5000);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));

// Strictly limit JSON body size to prevent any accidental media payload transmissions
app.use(express.json({ limit: '100kb' }));

// Guard against binary/media upload attempts (Zero-Knowledge Architecture Enforcement)
app.use((req, res, next) => {
  if (req.is('multipart/form-data')) {
    return res.status(400).json({
      error: 'ZERO_KNOWLEDGE_VIOLATION',
      message: 'Binary file uploads are strictly forbidden. All cryptographic hashes must be calculated client-side in the browser.'
    });
  }
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'NariSuraksha AI Backend Service',
    version: '2.5.0',
    zeroKnowledgeStatus: 'ENFORCED_CLIENT_SIDE',
    disclaimers: {
      firAutonomousFiling: false,
      authenticityAnalysis: false,
      zeroKnowledgeEvidence: true
    },
    documentation: 'Designed for Problem Statement 3 - Morphed Image Abuse Reporting Assistant'
  });
});

// Health check endpoint with legal & domain compliance metadata
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'NariSuraksha AI Backend',
    zeroKnowledgeEnforced: true,
    aiEngine: {
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      groqConfigured: !!process.env.GROQ_API_KEY,
      sovereignEngineActive: true
    },
    disclaimers: {
      firAutonomousFiling: false,
      authenticityAnalysis: false,
      zeroKnowledgeEvidence: true,
      legalDisclaimerEn: 'NariSuraksha AI does not verify image authenticity or compute deepfake certainty percentages. It does not automatically register an official FIR; it compiles standardized evidence dossiers for submission to cybercrime.gov.in.',
      legalDisclaimerHi: 'नारीसुरक्षा AI छवियों की प्रामाणिकता की पुष्टि या डीपफ़ेक प्रतिशत का दावा नहीं करता है। यह स्वतः आधिकारिक FIR दर्ज नहीं करता, बल्कि cybercrime.gov.in पर जमा करने हेतु साक्ष्य डॉसियर तैयार करता है।'
    },
    emergencyContacts: {
      nationalCyberCrimeHelpline: '1930',
      womenHelpline: '1091',
      emergencyResponseSupportSystem: '112',
      ncwHelpline: '7827170170',
      officialPortal: 'https://cybercrime.gov.in'
    },
    activeLegalFramework: [
      'Information Technology Act, 2000 (Section 66E - Privacy Violation)',
      'Information Technology Act, 2000 (Section 67 - Obscene Content)',
      'Information Technology Act, 2000 (Section 67A - Sexually Explicit Act / Morphed Deepfakes)',
      'Bharatiya Nyaya Sanhita, 2023 (Section 78 - Stalking)',
      'Bharatiya Nyaya Sanhita, 2023 (Section 79 - Insulting Modesty of a Woman)',
      'Indian Evidence Act / BSA (Section 65B Electronic Records Attestation)'
    ]
  });
});

// Simulated Reporting Endpoint
app.post('/api/simulated-report', (req, res) => {
  const { category, platforms, hashList, incidentSummary, jurisdiction } = req.body;

  const payloadStr = JSON.stringify(req.body || {});
  if (payloadStr.includes('data:image/') || payloadStr.length > 50000) {
    return res.status(400).json({
      error: 'PAYLOAD_REJECTED',
      message: 'Payload contains illegal media or exceeds metadata bounds. Zero-Knowledge constraint violated.'
    });
  }

  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const trackingId = `NCR-2026-${randomSuffix}`;

  const responsePayload = {
    success: true,
    simulated: true,
    trackingId,
    receivedAt: new Date().toISOString(),
    summary: {
      category: category || 'Morphed Media Harassment',
      platforms: platforms || ['Not Specified'],
      evidenceCount: Array.isArray(hashList) ? hashList.length : 0,
      hashesIndexed: Array.isArray(hashList) ? hashList.map(h => typeof h === 'string' ? h.substring(0, 16) + '...' : h.hash?.substring(0, 16) + '...') : []
    },
    nextSteps: [
      'Download your generated Section 65B-compliant Evidence Dossier (PDF).',
      'Visit the official National Cyber Crime Reporting Portal at https://cybercrime.gov.in.',
      'File under "Report Women / Children Related Cyber Crime" (Anonymous or Citizen login).',
      'Attach the downloaded PDF Dossier as the primary technical annexure.'
    ],
    helplineAlert: 'For immediate assistance, dial 1930 (National Cyber Crime Helpline) or 1091 (Women Helpline).'
  };

  res.status(200).json(responsePayload);
});

// Statutory Legal Clauses API Endpoint
app.get('/api/statutory-info', (req, res) => {
  res.json({
    provisions: [
      {
        section: 'Section 66E, Information Technology Act',
        title: 'Violation of Privacy',
        description: 'Penalizes capturing, publishing, or transmitting images of private area of any person without consent.',
        penalty: 'Imprisonment up to 3 years or fine up to ₹2 Lakhs, or both.'
      },
      {
        section: 'Section 67, Information Technology Act',
        title: 'Publishing Obscene Material in Electronic Form',
        description: 'Transmitting obscene or lascivious digital media.',
        penalty: 'First conviction: up to 3 years imprisonment + ₹5 Lakhs fine. Subsequent: up to 5 years + ₹10 Lakhs.'
      },
      {
        section: 'Section 67A, Information Technology Act',
        title: 'Sexually Explicit Act / Morphed Imagery',
        description: 'Publishing or transmitting material containing sexually explicit acts or morphed digital imagery depicting sexual content.',
        penalty: 'First conviction: up to 5 years imprisonment + ₹10 Lakhs fine. Subsequent: up to 7 years + ₹10 Lakhs. Non-bailable on repeat.'
      },
      {
        section: 'Section 78, Bharatiya Nyaya Sanhita (BNS)',
        title: 'Cyber Stalking & Harassment',
        description: 'Monitoring internet/electronic communications of a woman despite disinterest, creating harassment or fear.',
        penalty: 'First conviction: up to 3 years imprisonment. Subsequent: up to 5 years.'
      },
      {
        section: 'Section 79, Bharatiya Nyaya Sanhita (BNS)',
        title: 'Insulting Modesty of a Woman',
        description: 'Uttering words, making sounds, or exhibiting objects/media intending to insult the modesty of a woman.',
        penalty: 'Simple imprisonment up to 3 years and with fine.'
      }
    ]
  });
});

// Contextual action generator for LLM responses
function deriveActions(query, lang) {
  const q = query.toLowerCase();
  const isHindi = lang === 'hi';
  const actions = [];

  if (q.includes('panic') || q.includes('fear') || q.includes('scared') || q.includes('डर') || q.includes('घबराहट')) {
    actions.push({ label: isHindi ? '🧘 शांति व्यायाम शुरू करें' : '🧘 Start Calming Breath', action: 'breathe' });
    actions.push({ label: isHindi ? '📞 महिला हेल्पलाइन 1091' : '📞 Call Helpline 1091', url: 'tel:1091' });
  }

  if (q.includes('money') || q.includes('pay') || q.includes('पैसे') || q.includes('extortion') || q.includes('blackmail') || q.includes('ब्लैकमेल')) {
    actions.push({ label: isHindi ? '📞 हेल्पलाइन 1930 पर कॉल करें' : '📞 Call Cyber Helpline 1930', url: 'tel:1930' });
    actions.push({ label: isHindi ? '📂 वॉल्ट में हैश सुरक्षित करें' : '📂 Hash Evidence in Vault', tab: 'vault' });
  }

  if (q.includes('instagram') || q.includes('telegram') || q.includes('takedown') || q.includes('हटाएं') || q.includes('stopncii')) {
    actions.push({ label: isHindi ? '🚀 टेकडाउन गाइड खोलें' : '🚀 Open Takedown Guide', tab: 'takedown' });
    actions.push({ label: isHindi ? '🌐 StopNCII.org खोलें' : '🌐 Open StopNCII.org', url: 'https://stopncii.org' });
  }

  // Always offer evidence vault or dossier export
  if (!actions.some(a => a.tab === 'vault')) {
    actions.push({ label: isHindi ? '📂 साक्ष्य वॉल्ट में जाएं' : '📂 Go to Evidence Vault', tab: 'vault' });
  }
  if (!actions.some(a => a.action === 'dossier')) {
    actions.push({ label: isHindi ? '📄 कोर्ट डॉसियर PDF डाउनलोड' : '📄 Export Dossier PDF', action: 'dossier' });
  }

  return actions.slice(0, 3);
}

// Live External LLM Caller (Google Gemini or Groq)
async function callLiveLLM({ query, lang, apiKey, provider }) {
  const activeKey = apiKey || process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;
  if (!activeKey) return null;

  const isGroq = provider === 'groq' || activeKey.startsWith('gsk_');
  const isHindi = lang === 'hi';

  const systemPrompt = `You are Sakhi, an empathetic, trauma-informed AI legal and psychological triage companion designed specifically to assist Indian women and girls facing digital abuse, non-consensual morphed deepfake images, sextortion, and online harassment.

Core Rules:
1. Reassure the victim first with deep empathy: "You are safe. You did nothing wrong. Technology was abused by a perpetrator."
2. Never shame, judge, or blame the victim.
3. Strict Extortion Rule: Never pay extortion money. Paying guarantees escalation. Do not delete chats—they are evidence under Section 65B.
4. Platforms & Takedowns: Mention Rule 3(2)(b) of the Information Technology Rules 2021 (platforms must remove intimate/morphed media within 24 hours). Mention StopNCII.org for zero-upload perceptual hash blocking across Meta, TikTok, Reddit.
5. Police Procedures: Dispel phone seizure myths. Explain that NariSuraksha AI's Section 65B Evidence Dossier with SHA-256 hashes provides court-admissible forensic proof without device confiscation.
6. Filing: Advise filing on cybercrime.gov.in under 'Report Anonymously' or dial national helpline 1930 (Cyber Crime) and 1091 (Women in Distress).
7. Law: Reference Section 67A IT Act (5 years non-bailable jail), Section 66E, and BNS Section 78/79.
8. Language: ${isHindi ? 'Respond in warm, respectful, fluent Hindi (Devanagari script).' : 'Respond in clear, structured, supportive English.'}
Keep the response structured with bullet points or numbered steps so it is easy to read in a state of distress.`;

  try {
    if (isGroq) {
      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
          ],
          temperature: 0.6,
          max_tokens: 1024
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          const firstLine = text.split('\n').filter(Boolean)[0] || '';
          return {
            text,
            spoken: firstLine.replace(/[*#]/g, '').slice(0, 150),
            model: 'groq/llama-3.3-70b-versatile'
          };
        }
      }
    } else {
      // Google Gemini API (gemini-1.5-flash)
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }]
            }
          ],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 1024
          }
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const firstLine = text.split('\n').filter(Boolean)[0] || '';
          return {
            text,
            spoken: firstLine.replace(/[*#]/g, '').slice(0, 150),
            model: 'google/gemini-1.5-flash'
          };
        }
      }
    }
  } catch (err) {
    console.warn('[Live LLM Warning]', err.message);
  }

  return null;
}

// Endpoint to verify an API key
app.post('/api/verify-key', async (req, res) => {
  const { apiKey, provider = 'gemini' } = req.body;

  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 8) {
    return res.status(400).json({ success: false, error: 'Valid API key is required' });
  }

  const key = apiKey.trim();
  const isGroq = provider === 'groq' || key.startsWith('gsk_');

  try {
    if (isGroq) {
      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5
        })
      });

      if (resp.ok) {
        return res.json({ success: true, provider: 'groq', model: 'llama-3.1-8b-instant' });
      }
      return res.status(400).json({ success: false, error: 'Groq API returned an authentication error.' });
    } else {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'hi' }] }],
          generationConfig: { maxOutputTokens: 5 }
        })
      });

      if (resp.ok) {
        return res.json({ success: true, provider: 'gemini', model: 'gemini-1.5-flash' });
      }
      return res.status(400).json({ success: false, error: 'Google Gemini API returned an authentication error.' });
    }
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
});

// Comprehensive AI Assistant Conversational Guidance Engine
app.post('/api/ai-assistant', async (req, res) => {
  const { query = '', lang = 'en', apiKey, provider } = req.body;
  const q = query.toLowerCase().trim();
  const isHindi = lang === 'hi';

  if (!q) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // 1. First Attempt: Live Generative LLM if an API key is available
  const llmResult = await callLiveLLM({ query, lang, apiKey, provider });
  if (llmResult) {
    return res.status(200).json({
      success: true,
      llmPowered: true,
      model: llmResult.model,
      text: llmResult.text,
      spoken: llmResult.spoken,
      actions: deriveActions(query, lang)
    });
  }

  // 2. Second Layer: Sovereign Local Intelligence Engine (100% resilient fallback)
  let text = '';
  let spoken = '';
  let actions = [];

  // Distress / Panic / Fear / Suicidal Thoughts
  if (q.includes('scared') || q.includes('fear') || q.includes('shaking') || q.includes('panic') || q.includes('डर') || q.includes('घबराहट') || q.includes('रो') || q.includes('suicide') || q.includes('मर') || q.includes('ruined') || q.includes('बर्बाद') || q.includes('anxiety')) {
    if (isHindi) {
      text = `मेरी बात ध्यान से सुनें: **आप बिल्कुल सुरक्षित हैं, और आपका जीवन अनमोल है।**\n\n1. **यह आपकी गलती बिल्कुल नहीं है**: किसी अपराधी ने AI सॉफ्टवेयर से अवैध छेड़छाड़ की है। कानून, पुलिस और समाज स्पष्ट रूप से समझते हैं कि डीपफ़ेक तकनीक क्या होती है।\n2. **ब्लैकमेलर की धमकी केवल मानसिक दबाव है**: वे केवल आपको डराकर अपनी बात मनवाना चाहते हैं।\n3. **हम मिलकर इसे कानूनी रूप से रोकेंगे**: आईटी एक्ट की धारा 67A के तहत यह 5 वर्ष तक का गैर-जमानती अपराध है। पुलिस ऐसे मामलों में तुरंत कार्रवाई करती है।\n4. **एक गहरी सांस लें**: ऊपर दिए गए 'शांत होने का व्यायाम' से ब्रीदिंग करें या राष्ट्रीय महिला हेल्पलाइन **1091** या मानसिक स्वास्थ्य हेल्पलाइन **1800-599-0019 (Kiran)** पर तुरंत बात करें।`;
      spoken = `मेरी बात ध्यान से सुनिए। आप बिल्कुल सुरक्षित हैं। यह आपकी गलती नहीं है। ब्लैकमेलर केवल आपको डराने की कोशिश कर रहा है। गहरी सांस लीजिए, हम मिलकर इसका समाधान करेंगे।`;
    } else {
      text = `Please take a gentle breath right now: **You are safe, and your life and dignity are completely intact.**\n\n1. **You did nothing wrong**: Criminals use automated AI tools to transpose faces onto foreign media. The law, police, and courts fully recognize deepfake fabrication today.\n2. **Extortion relies purely on psychological shock**: The perpetrator's threats are manufactured to make you panic. Once we take structured legal steps, their leverage collapses.\n3. **We will handle this together**: Section 67A of the IT Act makes this punishable with up to 5 years of non-bailable imprisonment.\n4. **Ground yourself**: Take a slow breath. You can also reach the 24/7 National Women Helpline at **1091**, Kiran Mental Health Helpline at **1800-599-0019**, or iCall at **9152987821**.`;
      spoken = `Please take a gentle breath right now. You are safe, and you did nothing wrong. The law is firmly on your side. We will handle this step by step.`;
    }
    actions = [
      { label: isHindi ? '🧘 शांति व्यायाम शुरू करें' : '🧘 Start Calming Breath', action: 'breathe' },
      { label: isHindi ? '📞 महिला हेल्पलाइन 1091' : '📞 Call Helpline 1091', url: 'tel:1091' },
      { label: isHindi ? '📂 साक्ष्य वॉल्ट में जाएं' : '📂 Go to Evidence Vault', tab: 'vault' }
    ];
  }
  // Extortion, Money Demands, Deadlines
  else if (q.includes('money') || q.includes('pay') || q.includes('पैसे') || q.includes('deadline') || q.includes('demand') || q.includes('माग') || q.includes('extortion') || q.includes('blackmail') || q.includes('ब्लैकमेल') || q.includes('रुपए') || q.includes('rupees') || q.includes('cash')) {
    if (isHindi) {
      text = `**सखी की सबसे महत्वपूर्ण कानूनी सलाह: एक भी रुपया मत दीजिए!**\n\n• **पैसे देने से ब्लैकमेल कभी रुकता नहीं है**: यदि आप ₹10,000 देंगी, तो वे कुछ ही घंटों में ₹50,000 और मांगेंगे। पैसा देने से अपराधी को पता चल जाता है कि आप डर गई हैं।\n• **बातचीत डिलीट न करें**: चैट का हर एक संदेश, उनका UPI ID, बैंक खाता या फ़ोन नंबर हमारे लिए सबसे ठोस तकनीकी सबूत है।\n• **तुरंत यह 2 काम करें**:\n  1. उस चैट का पूरा स्क्रीनशॉट लेकर **'क्रिप्टोग्राफ़िक वॉल्ट'** में डालें ताकि उसका SHA-256 हैश सुरक्षित हो सके।\n  2. राष्ट्रीय साइबर हेल्पलाइन **1930** पर तुरंत कॉल करें — वे बैंकों के साथ समन्वय करके अपराधी के UPI ID और बैंक खातों को तुरंत फ्रीज करवाते हैं।`;
      spoken = `सखी की सबसे ज़रूरी सलाह: उन्हें एक भी रुपया मत दीजिए। पैसे देने से ब्लैकमेल कभी नहीं रुकता। चैट डिलीट मत कीजिए और तुरंत हेल्पलाइन 1930 पर कॉल कीजिए।`;
    } else {
      text = `**Critical Golden Rule: Do NOT pay any money to the extortionist.**\n\n• **Paying never stops extortion**: If you pay once, they will escalate their demands. Paying confirms to the criminal that their threats work.\n• **Preserve the technical audit trail**: Do NOT clear the chat or delete messages. The perpetrator's UPI ID, bank details, and direct messages are essential evidence under Section 65B.\n• **Immediate Actions Required**:\n  1. Drop the threat screenshots into our **Evidence Vault** to calculate client-side SHA-256 digests.\n  2. Dial the National Cyber Crime Helpline at **1930** immediately — cyber cells coordinate with banks to freeze recipient accounts in real time.`;
      spoken = `Do not pay any money. Paying an extortionist never stops them. Keep the chat intact as evidence, and let us report their UPI ID to helpline 1930 immediately.`;
    }
    actions = [
      { label: isHindi ? '📞 हेल्पलाइन 1930 पर कॉल करें' : '📞 Call Cyber Helpline 1930', url: 'tel:1930' },
      { label: isHindi ? '📂 वॉल्ट में हैश सुरक्षित करें' : '📂 Hash Evidence in Vault', tab: 'vault' },
      { label: isHindi ? '🛡️ अकाउंट लॉकडाउन करें' : '🛡️ Lock Down Account', tab: 'takedown' }
    ];
  }
  // StopNCII & Hash Prevention
  else if (q.includes('stopncii') || q.includes('stop ncii') || q.includes('hash') || q.includes('हैश') || q.includes('फैलने') || q.includes('viral') || q.includes('रोके')) {
    if (isHindi) {
      text = `**StopNCII.org द्वारा छवियों को इंटरनेट पर फैलने से रोकने की तकनीक:**\n\n1. **StopNCII.org क्या है?**: यह यूके 'Revenge Porn Helpline' और टेक कंपनियों का एक गैर-लाभकारी वैश्विक संगठन है।\n2. **तस्वीरें कभी अपलोड नहीं होतीं**: यह टूल आपके फ़ोन/लैपटॉप के अंदर ही आपकी अंतरंग या मॉर्फ्ड तस्वीरों का 'परसेप्चुअल हैश' (डिजिटल फिंगरप्रिंट) बनाता है।\n3. **स्वचालित ब्लॉक**: यह हैश Instagram, Facebook, Threads, TikTok और Reddit के डेटाबेस में जुड़ जाता है। यदि कोई भी व्यक्ति उस तस्वीर को अपलोड करने का प्रयास करेगा, तो सिस्टम उसे तुरंत ब्लॉक कर देगा।`;
      spoken = `StopNCII.org आपके डिवाइस में ही फ़ोटो का हैश बनाकर मेटा और इंस्टाग्राम पर अपलोड होने से रोकता है। कोई मूल फ़ोटो इंटरनेट पर नहीं जाती।`;
    } else {
      text = `**How StopNCII.org Prevents Non-Consensual Media from Spreading Globally:**\n\n1. **Zero-Upload Perceptual Hashing**: StopNCII.org runs entirely in your local browser to generate numerical hash digests of the media. The actual image or video is **never transmitted or stored** anywhere.\n2. **Industry-Wide Participation**: The cryptographic hash is shared across Meta (Instagram, Facebook, Threads), TikTok, Reddit, and OnlyFans.\n3. **Proactive Upload Filtering**: If the blackmailer tries to post the media on any participating platform, automated safety filters recognize the hash and immediately reject the upload.`;
      spoken = `StopNCII.org creates on-device perceptual hashes so that platforms like Instagram and Reddit automatically block uploads without ever seeing your actual photo.`;
    }
    actions = [
      { label: isHindi ? '🌐 StopNCII.org खोलें' : '🌐 Open StopNCII.org', url: 'https://stopncii.org' },
      { label: isHindi ? '📂 वॉल्ट में SHA-256 सुरक्षित करें' : '📂 Open Evidence Vault', tab: 'vault' },
      { label: isHindi ? '🚀 प्लेटफ़ॉर्म टेकडाउन गाइड' : '🚀 Platform Takedown Guides', tab: 'takedown' }
    ];
  }
  // Instagram / Telegram / Social Media Takedowns & Rule 3(2)(b)
  else if (q.includes('instagram') || q.includes('telegram') || q.includes('whatsapp') || q.includes('facebook') || q.includes('profile') || q.includes('fake') || q.includes('फ़ेक') || q.includes('इन्स्टाग्राम') || q.includes('इंस्टाग्राम') || q.includes('अकाउंट') || q.includes('हटाएं') || q.includes('remove') || q.includes('takedown') || q.includes('3(2)(b)') || q.includes('24 hour') || q.includes('24 घंटे')) {
    if (isHindi) {
      text = `**सोशल मीडिया से आपत्तिजनक सामग्री व फ़ेक प्रोफ़ाइल हटवाने के नियम:**\n\n1. **स्क्रीनशॉट लें**: सबसे पहले पूरा स्क्रीनशॉट लें जिसमें यूज़रनेम, प्रोफ़ाइल लिंक और सिस्टम घड़ी दिखे।\n2. **मेटा इम्पर्सनेशन फ़ॉर्म**: यदि आपके नाम से पूरा फ़ेक अकाउंट बनाया गया है, तो मेटा के समर्पित बाहरी फ़ॉर्म पर बिना लॉगिन के रिपोर्ट करें।\n3. **आईटी नियम 2021 (नियम 3(2)(b))**: भारत सरकार के सूचना प्रौद्योगिकी नियमों के अनुसार, महिलाओं की बिना-सहमति मॉर्फ्ड या अंतरंग तस्वीरों की रिपोर्ट मिलने के **24 घंटे के अंदर** सामग्री हटाना सोशल मीडिया कंपनियों के लिए कानूनी रूप से अनिवार्य है।\n4. **StopNCII.org**: यदि तस्वीरें फैलने का डर है, तो StopNCII.org पर ऑन-डिवाइस हैश पंजीकृत करें ताकि वे दोबारा अपलोड ही न हो सकें।`;
      spoken = `स्क्रीनशॉट सुरक्षित करने के बाद प्लेटफ़ॉर्म पर रिपोर्ट करें। भारतीय आईटी नियमों के तहत सोशल मीडिया कंपनियों को 24 घंटे में मॉर्फ्ड तस्वीरें हटाना कानूनी रूप से अनिवार्य है।`;
    } else {
      text = `**Step-by-Step Platform Takedown Protocol:**\n\n1. **Capture Full Evidence First**: Capture uncropped screenshots showing the exact profile URL bar and device timestamp before reporting.\n2. **In-App & Direct Web Forms**: Use Meta's dedicated Impersonation Form (help.instagram.com) which functions even if the account blocked you.\n3. **Mandatory 24-Hour Law (Rule 3(2)(b) IT Rules 2021)**: Under Indian law, platforms lose their Section 79 safe harbor liability protection if they fail to de-index non-consensual intimate or morphed imagery within **24 hours** of notice.\n4. **StopNCII.org Integration**: Generate an on-device perceptual hash at StopNCII.org to automatically prevent the media from being uploaded across Meta, TikTok, and Reddit.`;
      spoken = `Capture complete screenshots first. Under Rule 3(2)(b) of the Indian IT Rules, platforms must remove morphed imagery within 24 hours of notice.`;
    }
    actions = [
      { label: isHindi ? '🚀 टेकडाउन गाइड खोलें' : '🚀 Open Takedown Guide', tab: 'takedown' },
      { label: isHindi ? '⚖️ टेकडाउन ट्रैकर देखें' : '⚖️ Track Platform Response', tab: 'response' },
      { label: isHindi ? '🌐 StopNCII.org खोलें' : '🌐 Open StopNCII.org', url: 'https://stopncii.org' }
    ];
  }
  // Parents / Family / College / Reputation Fears
  else if (q.includes('parents') || q.includes('family') || q.includes('माता') || q.includes('पिता') || q.includes('परिवार') || q.includes('college') || q.includes('कॉलेज') || q.includes('दोस्त') || q.includes('friends') || q.includes('reputation') || q.includes('बदनामी') || q.includes('relatives') || q.includes('समाज')) {
    if (isHindi) {
      text = `**परिवार या कॉलेज को लेकर आपकी चिंता पूरी तरह स्वाभाविक है:**\n\n1. **अज्ञात शिकायत (Report Anonymously)**: राष्ट्रीय साइबर अपराध पोर्टल \`cybercrime.gov.in\` पर आप अपनी पहचान गोपनीय रखते हुए 'Report Anonymously' चुन सकती हैं।\n2. **मूल तस्वीर से तुलना**: आपकी मूल फ़ोटो (जैसे कॉलेज की सामान्य फ़ोटो) और मॉर्फ्ड फ़ोटो की तुलना से किसी को भी 5 सेकंड में साबित हो जाता है कि यह कंप्यूटर द्वारा बनाई गई नकली फ़ोटो है।\n3. **यदि परिवार को बताना पड़े**: शांत रहकर सीधे कहें: *"किसी साइबर अपराधी ने मेरे सोशल मीडिया से मेरी साधारण तस्वीर चुराकर AI से नकली फ़ोटो बनाई है और पैसे मांग रहा है। मैंने पुलिस साइबर हेल्पलाइन 1930 में शिकायत दर्ज कर दी है।"* परिवार आपके साथ खड़ा होगा।`;
      spoken = `परिवार की चिंता स्वाभाविक है। आप cybercrime.gov.in पर अज्ञात रूप से शिकायत दर्ज कर सकती हैं। मूल तस्वीर और मॉर्फ्ड तस्वीर देखकर साफ़ पता चल जाता है कि यह अपराध AI द्वारा किया गया है।`;
    } else {
      text = `**How to Protect Your Privacy from Family, College & Social Circles:**\n\n1. **Confidential Anonymous Reporting**: On \`cybercrime.gov.in\`, choose **'Report Anonymously'** under Women-Related Crimes to file without exposing your name on public dockets.\n2. **Juxtaposition Conclusively Proves Fabrication**: Keeping your unedited original baseline photograph allows immediate visual proof that facial features were digitally transposed onto an unrelated body.\n3. **If You Choose to Inform Trusted Contacts**: Frame the situation clearly: *"A cybercriminal took a public photo from my profile, generated an AI deepfake, and attempted extortion. I have preserved the technical evidence and filed a complaint with 1930."*`;
      spoken = `You can report completely anonymously on cybercrime.gov.in. Furthermore, your original baseline photograph proves to anyone within seconds that the media is an artificial deepfake.`;
    }
    actions = [
      { label: isHindi ? '👥 विश्वसनीय संपर्क को सतर्क करें' : '👥 Alert Trusted Contact', action: 'trustedContact' },
      { label: isHindi ? '📄 कोर्ट डॉसियर PDF देखें' : '📄 Preview Section 65B Dossier', action: 'dossier' },
      { label: isHindi ? '🏛️ NGO सहायता निर्देशिका' : '🏛️ Support Directory', tab: 'resources' }
    ];
  }
  // Police / Phone Seizure Fears & cybercrime.gov.in
  else if (q.includes('police') || q.includes('थाना') || q.includes('पुलिस') || q.includes('phone') || q.includes('फ़ोन') || q.includes('seize') || q.includes('जब्त') || q.includes('court') || q.includes('अदालत') || q.includes('fir') || q.includes('एफ़आईआर') || q.includes('cybercrime') || q.includes('portal') || q.includes('पोर्टल')) {
    if (isHindi) {
      text = `**पुलिस जांच, ऑनलाइन पोर्टल और फ़ोन ज़ब्ती से जुड़े तथ्यों की स्पष्टता:**\n\n• **क्या पुलिस आपका फ़ोन ज़ब्त करेगी?**: नहीं! नारीसुरक्षा AI का मुख्य उद्देश्य यही है कि हम भारतीय साक्ष्य अधिनियम/BSA की **धारा 65B** के तहत सभी स्क्रीनशॉट, टाइमस्टैम्प और SHA-256 हैश का औपचारिक डॉसियर तैयार करते हैं। यह डॉसियर कानूनी साक्ष्य माना जाता है, इसलिए आपका रोज़मर्रा का फ़ोन ज़ब्त करने की ज़रूरत नहीं पड़ती।\n• **क्या आपको थाने जाना पड़ेगा?**: प्रारंभिक शिकायत पूरी तरह \`cybercrime.gov.in\` पर ऑनलाइन दर्ज होती है। महिला सुरक्षा संबंधी मामलों में विशेष महिला उप-निरीक्षक द्वारा ही गोपनीय प्रक्रिया पूरी की जाती है।\n• **हेल्पलाइन**: त्वरित सहायता के लिए 1930 पर कॉल करें।`;
      spoken = `पुलिस आपका फ़ोन ज़ब्त नहीं करेगी। नारीसुरक्षा AI की धारा 65B डॉसियर तकनीकी साक्ष्य प्रदान करती है। पूरी प्रक्रिया ऑनलाइन पोर्टल पर सुरक्षित रूप से होती है।`;
    } else {
      text = `**Truth About Police Procedures, Online Portals & Device Seizure:**\n\n• **Will investigators seize your personal phone?**: No. This is precisely why NariSuraksha AI compiles a **Section 65B Evidence Dossier**. By attaching verified cryptographic SHA-256 checksums, the printed and digital PDF serves as formal secondary electronic evidence in court. Investigating officers do not need to confiscate your personal smartphone.\n• **Do you have to go to a police station?**: Initial complaints are processed entirely online via \`cybercrime.gov.in\`. Furthermore, statutory provisions require designated female officers to handle women-related cyber grievances with strict privacy safeguards.\n• **Immediate Filing**: Call **1930** or attach the downloaded PDF dossier to cybercrime.gov.in.`;
      spoken = `The police will not seize your personal phone. Our Section 65B Evidence Dossier serves as verified technical proof for court admissibility.`;
    }
    actions = [
      { label: isHindi ? '📄 धारा 65B डॉसियर डाउनलोड करें' : '📄 Download 65B Dossier PDF', action: 'dossier' },
      { label: isHindi ? '📝 शिकायत विवरण फ़ॉर्म' : '📝 Incident Intake Form', tab: 'intake' },
      { label: isHindi ? '🏛️ राज्य साइबर सेल संपर्क' : '🏛️ State Cyber Cells', tab: 'resources' }
    ];
  }
  // Legal Sections (67A, 66E, BNS 78/79, IPC, BSA, 65B)
  else if (q.includes('67a') || q.includes('66e') || q.includes('67') || q.includes('bns') || q.includes('ipc') || q.includes('act') || q.includes('law') || q.includes('धारा') || q.includes('कानून') || q.includes('सज़ा') || q.includes('सजा') || q.includes('65b') || q.includes('section')) {
    if (isHindi) {
      text = `**भारतीय कानून में मॉर्फ्ड तस्वीरों और साइबर उत्पीड़न के कठोर प्रावधान:**\n\n• **आईटी एक्ट धारा 67A**: बिना सहमति के मॉर्फ्ड/यौन सामग्री का प्रकाशन या प्रसारण।\n  - **सज़ा**: 5 वर्ष तक का कठोर कारावास एवं ₹10,00,000 तक का जुर्माना।\n  - **जमानत**: संज्ञेय (Cognizable) और **गैर-जमानती (Non-Bailable)**।\n• **आईटी एक्ट धारा 66E**: शारीरिक निजता का हनन (3 साल जेल + ₹2 लाख जुर्माना)।\n• **BNS धारा 78 (पूर्व IPC 354D)**: साइबर स्टॉकिंग (3 से 5 साल जेल)।\n• **BNS धारा 79 (पूर्व IPC 509)**: महिला की लज्जा का अनादर (3 साल तक की जेल)।\n• **धारा 65B (भारतीय साक्ष्य अधिनियम / BSA)**: डिजिटल साक्ष्यों की कोर्ट-मान्यता के लिए तकनीकी प्रमाण-पत्र।`;
      spoken = `आईटी एक्ट की धारा 67A के तहत मॉर्फ्ड अश्लील तस्वीरें बनाना या भेजना 5 साल की गैर-जमानती जेल और 10 लाख रुपये के जुर्माने का गंभीर अपराध है।`;
    } else {
      text = `**Applicable Indian Cyber Law Provisions:**\n\n• **Section 67A, IT Act 2000 (Primary Provision)**: Publishing or transmitting sexually explicit/morphed media depicting any person without consent.\n  - **Penalty**: Up to 5 years rigorous imprisonment AND up to ₹10,00,000 fine. Non-bailable on repeat.\n• **Section 66E, IT Act 2000**: Violation of bodily privacy (up to 3 years imprisonment or ₹2,00,000 fine).\n• **Section 78, Bharatiya Nyaya Sanhita (BNS)**: Cyber stalking and tracking of women (up to 3-5 years imprisonment).\n• **Section 79, Bharatiya Nyaya Sanhita (BNS)**: Insulting the modesty of a woman via digital media.\n• **Section 65B, Evidence Act / BSA**: Required legal attestation certificate verifying forensic electronic records.`;
      spoken = `Section 67A of the IT Act makes creating or transmitting morphed explicit imagery punishable by up to 5 years of non-bailable imprisonment and a 10 lakh rupee fine.`;
    }
    actions = [
      { label: isHindi ? '📄 कोर्ट डॉसियर में धाराएं जोड़ें' : '📄 Export Court Dossier', action: 'dossier' },
      { label: isHindi ? '🏛️ कानूनी सहायता NGO देखें' : '🏛️ View Legal Aid NGOs', tab: 'resources' }
    ];
  }
  // Morphed picture / Deepfake first 3 steps
  else if (q.includes('morphed') || q.includes('deepfake') || q.includes('मॉर्फ़') || q.includes('डीपफेक') || q.includes('photo') || q.includes('picture') || q.includes('तस्वीर') || q.includes('first 3') || q.includes('कदम')) {
    if (isHindi) {
      text = `**मॉर्फ्ड तस्वीर दिखने पर तुरंत किए जाने वाले 3 सबसे महत्वपूर्ण कदम:**\n\n1. **कदम 1 - साक्ष्य को सुरक्षित करें (Delete मत करें)**:\n   • उस चैट, धमकी भरे मैसेज और सोशल मीडिया प्रोफाइल का पूरा अनक्रॉप्ड स्क्रीनशॉट लें।\n   • हमारे **'क्रिप्टोग्राफ़िक वॉल्ट'** में डालें ताकि उसका SHA-256 हैश सुरक्षित हो जाए।\n\n2. **कदम 2 - अपराधी को एक भी रुपया न दें और ब्लॉक तुरंत न करें**:\n   • पैसे देने से ब्लैकमेल कभी बंद नहीं होता।\n   • सभी साक्ष्य और उनका UPI/फ़ोन नंबर नोट करने के बाद ही अकाउंट को प्राइवेसी लॉकडाउन में डालें।\n\n3. **कदम 3 - आधिकारिक डॉसियर डाउनलोड करके 1930 पर कॉल करें**:\n   • ऊपर 'आधिकारिक डॉसियर (PDF)' बटन दबाकर धारा 65B साक्ष्य प्रमाणपत्र डाउनलोड करें।\n   • हेल्पलाइन **1930** पर कॉल करें या \`cybercrime.gov.in\` पर अज्ञात शिकायत दर्ज करें।`;
      spoken = `मॉर्फ्ड तस्वीर दिखने पर सबसे पहले स्क्रीनशॉट लें और वॉल्ट में डालें, ब्लैकमेलर को कोई पैसा न दें, और डॉसियर डाउनलोड करके हेल्पलाइन 1930 पर कॉल करें।`;
    } else {
      text = `**The First 3 Crucial Steps When Facing Morphed Imagery:**\n\n1. **Step 1 - Preserve Uncropped Evidence Before Anything Else**:\n   • Take full, uncropped screenshots showing the profile handle, timestamp, and threat messages.\n   • Drop them into our **Cryptographic Vault** to calculate client-side SHA-256 hashes under Section 65B.\n\n2. **Step 2 - Absolute Financial Refusal (Zero-Payment Strategy)**:\n   • Never send a single rupee. Paying only fuels aggressive follow-up demands.\n   • Note down their UPI ID, phone number, and transaction requests as key criminal evidence.\n\n3. **Step 3 - Export Section 65B Dossier & Dial 1930**:\n   • Click **'Export Official Dossier (PDF)'** to bundle your evidence manifest.\n   • Report directly to \`cybercrime.gov.in\` (Anonymous option available) or call **1930**.`;
      spoken = `First, capture complete screenshots and hash them in the vault. Second, do not pay any money. Third, export your Section 65B dossier and call 1930.`;
    }
    actions = [
      { label: isHindi ? '📂 साक्ष्य वॉल्ट में जाएं' : '📂 Go to Evidence Vault', tab: 'vault' },
      { label: isHindi ? '📄 कोर्ट डॉसियर PDF डाउनलोड' : '📄 Export Dossier PDF', action: 'dossier' },
      { label: isHindi ? '📞 हेल्पलाइन 1930 पर कॉल' : '📞 Call Helpline 1930', url: 'tel:1930' }
    ];
  }
  // Greetings & Who are you
  else if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('नमस्ते') || q.includes('who are you') || q.includes('help') || q.includes('मदद') || q.includes('सखी') || q.includes('sakhi') || q.includes('sahayak') || q.includes('सहायक')) {
    if (isHindi) {
      text = `नमस्ते! मैं **सखी एवं सहायक** हूँ — आपकी सुरक्षित, गोपनीय AI मार्गदर्शक।\n\nमैं महिलाओं और बालिकाओं को मॉर्फ्ड तस्वीरों, डीपफ़ेक ब्लैकमेल और डिजिटल उत्पीड़न से सुरक्षित निकालने के लिए बनाई गई हूँ।\n\n**मैं आपकी क्या मदद कर सकती हूँ?**\n• साक्ष्य को कोर्ट-मान्य तरीके से सुरक्षित करना (धारा 65B)\n• इंस्टाग्राम, टेलीग्राम व अन्य ऐप्स से फ़ोटो 24 घंटे में हटवाना\n• ब्लैकमेल से बिना पैसे दिए सुरक्षित निपटना\n• माता-पिता या कॉलेज को बताए बिना अज्ञात रिपोर्ट दर्ज करना\n• राष्ट्रीय साइबर हेल्पलाइन 1930 और महिला हेल्पलाइन 1091 से जुड़ना\n\nआप मुझसे कुछ भी पूछ सकती हैं या ऊपर माइक दबाकर बोल सकती हैं।`;
      spoken = `नमस्ते! मैं सखी हूँ। आपकी सुरक्षित AI मार्गदर्शक। आप मुझसे बोलकर या लिखकर किसी भी सहायता के लिए पूछ सकती हैं।`;
    } else {
      text = `Hello! I am **Sakhi & Sahayak** — your safe, completely confidential AI triage companion.\n\nI am engineered specifically to support women and girls facing manipulated imagery, deepfake extortion, and digital harassment.\n\n**How I can help you right now:**\n• Preserve tamper-proof evidence hashes under Section 65B of the Indian Evidence Act\n• Guide you through emergency 24-hour takedowns on Instagram, Telegram & X\n• Help you defeat extortion threats without paying any ransom\n• File an anonymous complaint on cybercrime.gov.in\n• Connect you directly with 1930, 1091, and verified pro-bono cyber legal aid\n\nYou can type anything or tap the microphone to speak naturally.`;
      spoken = `Hello! I am Sakhi, your safe and confidential AI triage companion. How can I support you right now?`;
    }
    actions = [
      { label: isHindi ? '📝 शिकायत फ़ॉर्म शुरू करें' : '📝 Start Intake Form', tab: 'intake' },
      { label: isHindi ? '📂 साक्ष्य वॉल्ट खोलें' : '📂 Open Evidence Vault', tab: 'vault' },
      { label: isHindi ? '🧘 शांति व्यायाम' : '🧘 Calming Exercise', action: 'breathe' }
    ];
  }
  // General / Fallback
  else {
    if (isHindi) {
      text = `मैं आपकी स्थिति समझ रही हूँ। **हम मिलकर इसे चरणबद्ध तरीके से सुलझाएंगे:**\n\n1. **साक्ष्य को हैश करें**: सबसे पहले उस चैट या स्क्रीनशॉट को हमारे **'क्रिप्टोग्राफ़िक वॉल्ट'** में डालें ताकि उसका SHA-256 हैश सुरक्षित हो जाए।\n2. **ब्लैकमेलर को कभी कोई पैसा न दें**: पैसे देने से ब्लैकमेल कभी रुकता नहीं। बातचीत को कभी डिलीट न करें।\n3. **आधिकारिक डॉसियर जनरेट करें**: ऊपर 'आधिकारिक डॉसियर (PDF)' दबाएं। यह धारा 65B के तहत पुलिस के लिए अकाट्य दस्तावेज़ तैयार कर देगा।\n4. **1930 पर कॉल करें**: त्वरित कार्रवाई के लिए राष्ट्रीय साइबर हेल्पलाइन 1930 पर कॉल करें।\n\nयदि आपके मन में पुलिस, माता-पिता या प्लेटफ़ॉर्म को लेकर कोई विशिष्ट प्रश्न है, तो बेझिझक पूछें।`;
      spoken = `मैं आपकी स्थिति समझ रही हूँ। स्क्रीनशॉट को वॉल्ट में हैश कीजिए, कोई पैसा मत दीजिए, और हम मिलकर आपकी साक्ष्य डॉसियर तैयार करेंगे।`;
    } else {
      text = `I hear you, and I am standing firmly with you. **Here are your immediate 4-step action rules:**\n\n1. **Lock the Technical Evidence**: Drop all screenshots into our **Cryptographic Vault** to calculate their client-side SHA-256 digests.\n2. **Strict Non-Compliance**: Do NOT transfer any extortion money and do NOT clear your chat history.\n3. **Export Section 65B Dossier**: Click **'Export Official Dossier (PDF)'** to compile your court-compliant evidence manifest.\n4. **Direct Priority Filing**: Dial **1930** (National Cyber Crime Helpline) or submit directly to \`cybercrime.gov.in\`.\n\nAsk me anything about platform takedowns, police procedures, anonymous filing, or how to handle fear.`;
      spoken = `I hear you, and I am right here with you. Preserve your screenshots in the vault, do not pay any ransom, and we will compile your official Section 65B dossier.`;
    }
    actions = [
      { label: isHindi ? '📂 साक्ष्य वॉल्ट में जाएं' : '📂 Go to Evidence Vault', tab: 'vault' },
      { label: isHindi ? '📄 कोर्ट डॉसियर PDF' : '📄 Export Dossier PDF', action: 'dossier' },
      { label: isHindi ? '📞 हेल्पलाइन 1930' : '📞 Call 1930', url: 'tel:1930' }
    ];
  }

  res.status(200).json({
    success: true,
    llmPowered: false,
    query,
    text,
    spoken,
    actions
  });
});

// Start Server with graceful fallback if port 5000 is occupied by macOS ControlCenter / AirPlay
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`\n======================================================`);
    console.log(`  NariSuraksha AI Backend running on port ${port}`);
    console.log(`  Health Check: http://localhost:${port}/api/health`);
    console.log(`  Gemini API Configured: ${!!process.env.GEMINI_API_KEY}`);
    console.log(`  Groq API Configured: ${!!process.env.GROQ_API_KEY}`);
    console.log(`  Zero-Knowledge Policy: STRICTLY ENFORCED`);
    console.log(`======================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && port === 5000) {
      console.warn(`[!] Port 5000 is occupied (commonly macOS AirPlay Receiver).`);
      console.log(`[*] Automatically failing over to port 5001...`);
      startServer(5001);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(DEFAULT_PORT);
module.exports = app;
