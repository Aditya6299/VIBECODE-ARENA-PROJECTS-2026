import React, { useState, useRef, useEffect } from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  Send, 
  User, 
  ExternalLink,
  Lock,
  ArrowRight,
  Smile,
  AlertTriangle,
  Play,
  Pause,
  Compass,
  Bot,
  Key,
  CheckCircle2,
  XCircle,
  Settings,
  HelpCircle
} from 'lucide-react';

export const SakhiVoiceCompanion = () => {
  const { lang, t, setActiveTab, setIsDossierModalOpen, showToast } = useCase();

  // Mode: 'voice' (voice-first audio focus) or 'chat' (classic chat stream)
  const [activeMode, setActiveMode] = useState('chat');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(true);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale');
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // Free API Key Management
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('narisuraksha_ai_key') || '');
  const [apiProvider, setApiProvider] = useState(() => localStorage.getItem('narisuraksha_ai_provider') || 'gemini');
  const [inputKey, setInputKey] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('gemini');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(null); // { success: boolean, message: string }

  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const chatScrollRef = useRef(null);
  const breathTimerRef = useRef(null);

  // Sync modal state with active key
  useEffect(() => {
    if (showKeyModal) {
      setInputKey(apiKey);
      setSelectedProvider(apiProvider);
      setVerifyStatus(null);
    }
  }, [showKeyModal, apiKey, apiProvider]);

  // Setup Available Speech Synthesis Voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => 
        (lang === 'hi' ? v.lang.includes('hi') : v.lang.includes('en-IN')) ||
        v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Natural')
      ) || voices[0];
      setSelectedVoice(preferred);
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [lang]);

  // Initial welcome greeting
  useEffect(() => {
    const isHindi = lang === 'hi';
    const initialGreeting = isHindi ? {
      id: 'init-hi',
      sender: 'sakhi',
      text: `नमस्ते। मैं **सखी एवं सहायक AI** हूँ — आपकी सुरक्षित, पूरी तरह गोपनीय कानूनी एवं भावनात्मक साथी।\n\nसबसे पहले एक गहरी सांस लें। **यह आपकी गलती बिल्कुल नहीं है।** किसी साइबर अपराधी ने तकनीक का दुरुपयोग करके अपराध किया है, और भारतीय कानून पूरी तरह आपके पक्ष में है।\n\n**मैं आपकी कैसे सहायता कर सकती हूँ?**\n• **तत्काल साक्ष्य सुरक्षा**: धारा 65B के तहत स्क्रीनशॉट और SHA-256 हैश सुरक्षित करना\n• **ब्लैकमेल से बचाव**: पैसे दिए बिना और चैट डिलीट किए बिना मामले से सुरक्षित निकलना\n• **अज्ञात शिकायत**: \`cybercrime.gov.in\` पर बिना पहचान बताए रिपोर्ट दर्ज करना\n• **प्लेटफ़ॉर्म टेकडाउन**: इंस्टाग्राम, टेलीग्राम आदि से 24 घंटे में फ़ोटो हटवाना (IT नियम 3(2)(b))\n• **हेल्पलाइन**: 1930 (साइबर अपराध) और 1091 (महिला सुरक्षा) से संपर्क\n\nआप मुझसे माइक (**🎙️**) दबाकर बोल सकती हैं, टाइप कर सकती हैं, या ऊपर **'फ्री AI Key'** जोड़कर लाइव Google Gemini से बात कर सकती हैं।`,
      spoken: `नमस्ते। मैं सखी हूँ। आपकी सुरक्षित और गोपनीय साथी। सबसे पहले एक गहरी सांस लीजिए। यह आपकी गलती नहीं है। मैं आपकी पूरी सहायता करूँगी। बताएं क्या हुआ है?`,
      actions: [
        { label: '📝 शिकायत फ़ॉर्म भरें', tab: 'intake' },
        { label: '📂 साक्ष्य वॉल्ट में जाएं', tab: 'vault' },
        { label: '🧘 शांत होने का व्यायाम', action: 'breathe' },
        { label: '📞 हेल्पलाइन 1930', url: 'tel:1930' }
      ]
    } : {
      id: 'init-en',
      sender: 'sakhi',
      text: `Hello. I am **Sakhi & Sahayak AI** — your safe, completely confidential legal and emotional companion.\n\nTake a gentle breath first. **You have done nothing wrong.** A cybercriminal has abused technology to commit an offense, and Indian law stands firmly on your side.\n\n**How I can guide you right now:**\n• **Preserve Digital Evidence**: Client-side SHA-256 digests under Section 65B of the Indian Evidence Act / BSA\n• **Defeat Extortion**: Strict zero-payment strategy without losing vital conversation trails\n• **File Anonymously**: How to report on \`cybercrime.gov.in\` without disclosing your identity\n• **24-Hour Platform Takedowns**: Enforce Rule 3(2)(b) of the IT Rules 2021 for Instagram, Telegram & StopNCII.org\n• **Emergency Helplines**: Immediate connection to 1930 (Cyber Crime) and 1091 (Women in Distress)\n\nYou can speak aloud by tapping the microphone (**🎙️**), type freely in the box below, or connect a free Google Gemini key above for real-time generative intelligence.`,
      spoken: `Hello. I am Sakhi, your safe and confidential companion. Take a gentle breath. You have done nothing wrong, and the law is firmly on your side. How can I help you right now?`,
      actions: [
        { label: '📝 Start Intake Form', tab: 'intake' },
        { label: '📂 Open Evidence Vault', tab: 'vault' },
        { label: '🧘 Calming Breath', action: 'breathe' },
        { label: '📞 Call 1930 Helpline', url: 'tel:1930' }
      ]
    };

    setMessages([initialGreeting]);
  }, [lang]);

  // Auto-scroll chat
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Box Breathing cycle
  useEffect(() => {
    if (!showBreathingExercise) {
      clearInterval(breathTimerRef.current);
      return;
    }

    const phases = [
      { text: lang === 'hi' ? 'गहरी सांस अंदर लें (Inhale)...' : 'Breathe In slowly...', duration: 4000 },
      { text: lang === 'hi' ? 'सांस रोकें (Hold)...' : 'Hold gently...', duration: 4000 },
      { text: lang === 'hi' ? 'धीरे-धीरे सांस बाहर छोड़ें (Exhale)...' : 'Release and Breathe Out...', duration: 4000 },
      { text: lang === 'hi' ? 'विश्राम करें (Relax)...' : 'Rest and feel grounded...', duration: 4000 }
    ];

    let currentPhaseIdx = 0;
    setBreathPhase(phases[0].text);

    breathTimerRef.current = setInterval(() => {
      currentPhaseIdx = (currentPhaseIdx + 1) % phases.length;
      setBreathPhase(phases[currentPhaseIdx].text);
    }, 4000);

    return () => clearInterval(breathTimerRef.current);
  }, [showBreathingExercise, lang]);

  // Text to Speech
  const speakAloud = (text) => {
    if (!voiceSpeechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/http[s]?:\/\/\S+/g, 'link');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Two-Way Speech Recognition (STT)
  const toggleListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast(lang === 'hi' ? 'आपका ब्राउज़र वॉइस इनपुट का समर्थन नहीं करता। आप नीचे टाइप कर सकती हैं।' : 'Browser voice input not supported. Please type your message below.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    stopSpeaking();

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        showToast(lang === 'hi' ? '🎙️ सखी सुन रही है... बोलिए' : '🎙️ Sakhi is listening... speak naturally');
      };

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (transcript.trim()) {
          handleUserQuery(transcript);
        }
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      setIsListening(false);
      showToast(lang === 'hi' ? 'माइक्रोफ़ोन एक्सेस में समस्या। कृपया टाइप करके पूछें।' : 'Microphone access denied. You can type directly.');
    }
  };

  // Zero-Latency Local Fallback Intelligence Engine
  const getLocalIntelligenceResponse = (query, currentLang) => {
    const q = query.toLowerCase().trim();
    const isHindi = currentLang === 'hi';

    // 1. Distress / Panic / Fear / Suicidal Thoughts
    if (q.includes('scared') || q.includes('fear') || q.includes('shaking') || q.includes('panic') || q.includes('डर') || q.includes('घबराहट') || q.includes('रो') || q.includes('मर') || q.includes('suicide') || q.includes('ruined') || q.includes('बर्बाद') || q.includes('anxiety')) {
      return {
        text: isHindi
          ? `मेरी बात ध्यान से सुनें: **आप बिल्कुल सुरक्षित हैं, और आपका जीवन अनमोल है।**\n\n1. **यह आपकी गलती बिल्कुल नहीं है**: किसी अपराधी ने AI सॉफ़्टवेयर से छेड़छाड़ की है। समाज, पुलिस और कानून स्पष्ट रूप से जानते हैं कि डीपफ़ेक तकनीक क्या होती है।\n2. **ब्लैकमेलर की धमकी केवल मानसिक दबाव है**: वे केवल आपको डराकर अपनी बात मनवाना चाहते हैं।\n3. **हम मिलकर इसे कानूनी रूप से रोकेंगे**: आईटी एक्ट की धारा 67A के तहत यह 5 वर्ष तक का गैर-जमानती अपराध है। पुलिस ऐसे मामलों में त्वरित कार्रवाई करती है।\n4. **एक गहरी सांस लें**: ऊपर दिए गए 'शांत होने का व्यायाम' से ब्रीदिंग करें या राष्ट्रीय महिला हेल्पलाइन **1091** या मानसिक स्वास्थ्य हेल्पलाइन **1800-599-0019 (Kiran)** पर बात करें।`
          : `Please take a gentle breath right now: **You are safe, and your life and dignity are completely intact.**\n\n1. **You did nothing wrong**: Criminals use automated AI tools to transpose faces. The law, police, and courts fully recognize deepfake fabrication today.\n2. **Extortion relies purely on psychological shock**: The perpetrator's threats are manufactured to make you panic. Once we take structured legal steps, their leverage collapses.\n3. **We will handle this together**: Section 67A of the IT Act makes this punishable with up to 5 years of non-bailable imprisonment.\n4. **Ground yourself**: Take a slow breath. You can also reach the 24/7 National Women Helpline at **1091**, Kiran Mental Health Helpline at **1800-599-0019**, or iCall at **9152987821**.`,
        spoken: isHindi 
          ? `मेरी बात ध्यान से सुनिए। आप सुरक्षित हैं। यह आपकी गलती नहीं है। ब्लैकमेलर केवल आपको डराने की कोशिश कर रहा है। गहरी सांस लीजिए, हम मिलकर इसका समाधान करेंगे।` 
          : `Please take a gentle breath right now. You are safe, and you did nothing wrong. The law is firmly on your side. We will handle this step by step.`,
        actions: [
          { label: isHindi ? '🧘 शांति व्यायाम शुरू करें' : '🧘 Start Calming Breath', action: 'breathe' },
          { label: isHindi ? '📞 महिला हेल्पलाइन 1091' : '📞 Call Helpline 1091', url: 'tel:1091' },
          { label: isHindi ? '📂 साक्ष्य वॉल्ट में जाएं' : '📂 Go to Evidence Vault', tab: 'vault' }
        ]
      };
    }

    // 2. Extortion & Deadlines ("Pay money" / "1 hour left")
    if (q.includes('money') || q.includes('pay') || q.includes('पैसे') || q.includes('deadline') || q.includes('समय सीमा') || q.includes('demand') || q.includes('माग') || q.includes('extortion') || q.includes('blackmail') || q.includes('ब्लैकमेल') || q.includes('रुपए') || q.includes('rupees') || q.includes('cash')) {
      return {
        text: isHindi
          ? `**सखी की सबसे महत्वपूर्ण कानूनी सलाह: एक भी रुपया मत दीजिए!**\n\n• **पैसे देने से ब्लैकमेल कभी रुकता नहीं है**: यदि आप ₹10,000 देंगी, तो वे कुछ ही घंटों में ₹50,000 और मांगेंगे। पैसा देने से अपराधी को पता चल जाता है कि आप डर गई हैं।\n• **बातचीत डिलीट न करें**: चैट का हर एक संदेश, उनका UPI ID, बैंक खाता या फ़ोन नंबर हमारे लिए सबसे ठोस तकनीकी सबूत है।\n• **तुरंत यह 2 काम करें**:\n  1. उस चैट का पूरा स्क्रीनशॉट लेकर **'क्रिप्टोग्राफ़िक वॉल्ट'** में डालें ताकि उसका SHA-256 हैश सुरक्षित हो सके।\n  2. राष्ट्रीय साइबर हेल्पलाइन **1930** पर तुरंत कॉल करें — वे बैंकों के साथ समन्वय करके अपराधी के UPI ID और बैंक खातों को तुरंत फ्रीज करवाते हैं।`
          : `**Critical Golden Rule: Do NOT pay any money to the extortionist.**\n\n• **Paying never stops extortion**: If you pay once, they will escalate their demands. Paying confirms to the criminal that their threats work.\n• **Preserve the technical audit trail**: Do NOT clear the chat or delete messages. The perpetrator's UPI ID, bank details, and direct messages are essential evidence under Section 65B.\n• **Immediate Actions Required**:\n  1. Drop the threat screenshots into our **Evidence Vault** to calculate client-side SHA-256 digests.\n  2. Dial the National Cyber Crime Helpline at **1930** immediately — cyber cells coordinate with banks to freeze recipient accounts in real time.`,
        spoken: isHindi 
          ? `सखी की सबसे ज़रूरी सलाह: उन्हें एक भी रुपया मत दीजिए। पैसे देने से ब्लैकमेल कभी नहीं रुकता। चैट डिलीट मत कीजिए और तुरंत हेल्पलाइन 1930 पर कॉल कीजिए।` 
          : `Do not pay any money. Paying an extortionist never stops them. Keep the chat intact as evidence, and let us report their UPI ID to helpline 1930 immediately.`,
        actions: [
          { label: isHindi ? '📞 हेल्पलाइन 1930 पर कॉल करें' : '📞 Call Cyber Helpline 1930', url: 'tel:1930' },
          { label: isHindi ? '📂 वॉल्ट में हैश सुरक्षित करें' : '📂 Hash Evidence in Vault', tab: 'vault' },
          { label: isHindi ? '🛡️ अकाउंट लॉकडाउन करें' : '🛡️ Lock Down Account', tab: 'takedown' }
        ]
      };
    }

    // 3. StopNCII & Hash Prevention
    if (q.includes('stopncii') || q.includes('stop ncii') || q.includes('hash') || q.includes('हैश') || q.includes('फैलने') || q.includes('viral') || q.includes('रोके')) {
      return {
        text: isHindi
          ? `**StopNCII.org द्वारा छवियों को इंटरनेट पर फैलने से रोकने की तकनीक:**\n\n1. **StopNCII.org क्या है?**: यह यूके 'Revenge Porn Helpline' और टेक कंपनियों का एक गैर-लाभकारी वैश्विक संगठन है।\n2. **तस्वीरें कभी अपलोड नहीं होतीं**: यह टूल आपके फ़ोन/लैपटॉप के अंदर ही आपकी अंतरंग या मॉर्फ्ड तस्वीरों का 'परसेप्चुअल हैश' (डिजिटल फिंगरप्रिंट) बनाता है।\n3. **स्वचालित ब्लॉक**: यह हैश Instagram, Facebook, Threads, TikTok और Reddit के डेटाबेस में जुड़ जाता है। यदि कोई भी व्यक्ति उस तस्वीर को अपलोड करने का प्रयास करेगा, तो सिस्टम उसे तुरंत ब्लॉक कर देगा।`
          : `**How StopNCII.org Prevents Non-Consensual Media from Spreading Globally:**\n\n1. **Zero-Upload Perceptual Hashing**: StopNCII.org runs entirely in your local browser to generate numerical hash digests of the media. The actual image or video is **never transmitted or stored** anywhere.\n2. **Industry-Wide Participation**: The cryptographic hash is shared across Meta (Instagram, Facebook, Threads), TikTok, Reddit, and OnlyFans.\n3. **Proactive Upload Filtering**: If the blackmailer tries to post the media on any participating platform, automated safety filters recognize the hash and immediately reject the upload.`,
        spoken: isHindi 
          ? `StopNCII.org आपके डिवाइस में ही फ़ोटो का हैश बनाकर मेटा और इंस्टाग्राम पर अपलोड होने से रोकता है। कोई मूल फ़ोटो इंटरनेट पर नहीं जाती।` 
          : `StopNCII.org creates on-device perceptual hashes so that platforms like Instagram and Reddit automatically block uploads without ever seeing your actual photo.`,
        actions: [
          { label: isHindi ? '🌐 StopNCII.org खोलें' : '🌐 Open StopNCII.org', url: 'https://stopncii.org' },
          { label: isHindi ? '📂 वॉल्ट में SHA-256 सुरक्षित करें' : '📂 Open Evidence Vault', tab: 'vault' },
          { label: isHindi ? '🚀 प्लेटफ़ॉर्म टेकडाउन गाइड' : '🚀 Platform Takedown Guides', tab: 'takedown' }
        ]
      };
    }

    // 4. Instagram / Telegram / Social Media Takedowns & Rule 3(2)(b)
    if (q.includes('instagram') || q.includes('telegram') || q.includes('whatsapp') || q.includes('facebook') || q.includes('profile') || q.includes('fake') || q.includes('फ़ेक') || q.includes('इन्स्टाग्राम') || q.includes('इंस्टाग्राम') || q.includes('अकाउंट') || q.includes('हटाएं') || q.includes('remove') || q.includes('takedown') || q.includes('3(2)(b)') || q.includes('24 hour') || q.includes('24 घंटे')) {
      return {
        text: isHindi
          ? `**सोशल मीडिया से आपत्तिजनक सामग्री व फ़ेक प्रोफ़ाइल हटवाने के नियम:**\n\n1. **स्क्रीनशॉट लें**: सबसे पहले पूरा स्क्रीनशॉट लें जिसमें यूज़रनेम, प्रोफ़ाइल लिंक और सिस्टम घड़ी दिखे।\n2. **मेटा इम्पर्सनेशन फ़ॉर्म**: यदि आपके नाम से पूरा फ़ेक अकाउंट बनाया गया है, तो मेटा के समर्पित बाहरी फ़ॉर्म पर बिना लॉगिन के रिपोर्ट करें।\n3. **आईटी नियम 2021 (नियम 3(2)(b))**: भारत सरकार के सूचना प्रौद्योगिकी नियमों के अनुसार, महिलाओं की बिना-सहमति मॉर्फ्ड या अंतरंग तस्वीरों की रिपोर्ट मिलने के **24 घंटे के अंदर** सामग्री हटाना सोशल मीडिया कंपनियों के लिए कानूनी रूप से अनिवार्य है।\n4. **StopNCII.org**: यदि तस्वीरें फैलने का डर है, तो StopNCII.org पर ऑन-डिवाइस हैश पंजीकृत करें ताकि वे दोबारा अपलोड ही न हो सकें।`
          : `**Step-by-Step Platform Takedown Protocol:**\n\n1. **Capture Full Evidence First**: Capture uncropped screenshots showing the exact profile URL bar and device timestamp before reporting.\n2. **In-App & Direct Web Forms**: Use Meta's dedicated Impersonation Form (help.instagram.com) which functions even if the account blocked you.\n3. **Mandatory 24-Hour Law (Rule 3(2)(b) IT Rules 2021)**: Under Indian law, platforms lose their Section 79 safe harbor liability protection if they fail to de-index non-consensual intimate or morphed imagery within **24 hours** of notice.\n4. **StopNCII.org Integration**: Generate an on-device perceptual hash at StopNCII.org to automatically prevent the media from being uploaded across Meta, TikTok, and Reddit.`,
        spoken: isHindi 
          ? `स्क्रीनशॉट सुरक्षित करने के बाद प्लेटफ़ॉर्म पर रिपोर्ट करें। भारतीय आईटी नियमों के तहत सोशल मीडिया कंपनियों को 24 घंटे में मॉर्फ्ड तस्वीरें हटाना कानूनी रूप से अनिवार्य है।` 
          : `Capture complete screenshots first. Under Rule 3(2)(b) of the Indian IT Rules, platforms must remove morphed imagery within 24 hours of notice.`,
        actions: [
          { label: isHindi ? '🚀 टेकडाउन गाइड खोलें' : '🚀 Open Takedown Guide', tab: 'takedown' },
          { label: isHindi ? '⚖️ टेकडाउन ट्रैकर देखें' : '⚖️ Track Platform Response', tab: 'response' },
          { label: isHindi ? '🌐 StopNCII.org खोलें' : '🌐 Open StopNCII.org', url: 'https://stopncii.org' }
        ]
      };
    }

    // 5. Parents / Family / College / Reputation Fears
    if (q.includes('parents') || q.includes('family') || q.includes('माता') || q.includes('पिता') || q.includes('परिवार') || q.includes('college') || q.includes('कॉलेज') || q.includes('दोस्त') || q.includes('friends') || q.includes('reputation') || q.includes('बदनामी') || q.includes('relatives') || q.includes('समाज')) {
      return {
        text: isHindi
          ? `**परिवार या कॉलेज को लेकर आपकी चिंता पूरी तरह स्वाभाविक है:**\n\n1. **अज्ञात शिकायत (Report Anonymously)**: राष्ट्रीय साइबर अपराध पोर्टल \`cybercrime.gov.in\` पर आप अपनी पहचान गोपनीय रखते हुए 'Report Anonymously' चुन सकती हैं।\n2. **मूल तस्वीर से तुलना**: आपकी मूल फ़ोटो (जैसे कॉलेज की सामान्य फ़ोटो) और मॉर्फ्ड फ़ोटो की तुलना से किसी को भी 5 सेकंड में साबित हो जाता है कि यह कंप्यूटर द्वारा बनाई गई नकली फ़ोटो है।\n3. **यदि परिवार को बताना पड़े**: शांत रहकर सीधे कहें: *"किसी साइबर अपराधी ने मेरे सोशल मीडिया से मेरी साधारण तस्वीर चुराकर AI से नकली फ़ोटो बनाई है और पैसे मांग रहा है। मैंने पुलिस साइबर हेल्पलाइन 1930 में शिकायत दर्ज कर दी है।"* परिवार आपके साथ खड़ा होगा।`
          : `**How to Protect Your Privacy from Family, College & Social Circles:**\n\n1. **Confidential Anonymous Reporting**: On \`cybercrime.gov.in\`, choose **'Report Anonymously'** under Women-Related Crimes to file without exposing your name on public dockets.\n2. **Juxtaposition Conclusively Proves Fabrication**: Keeping your unedited original baseline photograph allows immediate visual proof that facial features were digitally transposed onto an unrelated body.\n3. **If You Choose to Inform Trusted Contacts**: Frame the situation clearly: *"A cybercriminal took a public photo from my profile, generated an AI deepfake, and attempted extortion. I have preserved the technical evidence and filed a complaint with 1930."*`,
        spoken: isHindi 
          ? `परिवार की चिंता स्वाभाविक है। आप cybercrime.gov.in पर अज्ञात रूप से शिकायत दर्ज कर सकती हैं। मूल तस्वीर और मॉर्फ्ड तस्वीर देखकर साफ़ पता चल जाता है कि यह अपराध AI द्वारा किया गया है।` 
          : `You can report completely anonymously on cybercrime.gov.in. Furthermore, your original baseline photograph proves to anyone within seconds that the media is an artificial deepfake.`,
        actions: [
          { label: isHindi ? '👥 विश्वसनीय संपर्क सतर्क करें' : '👥 Alert Trusted Contact', action: 'trustedContact' },
          { label: isHindi ? '📄 कोर्ट डॉसियर PDF देखें' : '📄 Preview Section 65B Dossier', action: 'dossier' },
          { label: isHindi ? '🏛️ NGO सहायता निर्देशिका' : '🏛️ Support Directory', tab: 'resources' }
        ]
      };
    }

    // 6. Police Procedures & Phone Seizure
    if (q.includes('police') || q.includes('थाना') || q.includes('पुलिस') || q.includes('phone') || q.includes('फ़ोन') || q.includes('seize') || q.includes('जब्त') || q.includes('court') || q.includes('अदालत') || q.includes('fir') || q.includes('एफ़आईआर') || q.includes('cybercrime') || q.includes('portal') || q.includes('पोर्टल')) {
      return {
        text: isHindi
          ? `**पुलिस जांच, ऑनलाइन पोर्टल और फ़ोन ज़ब्ती से जुड़े तथ्यों की स्पष्टता:**\n\n• **क्या पुलिस आपका फ़ोन ज़ब्त करेगी?**: नहीं! नारीसुरक्षा AI का मुख्य उद्देश्य यही है कि हम भारतीय साक्ष्य अधिनियम/BSA की **धारा 65B** के तहत सभी स्क्रीनशॉट, टाइमस्टैम्प और SHA-256 हैश का औपचारिक डॉसियर तैयार करते हैं। यह डॉसियर कानूनी साक्ष्य माना जाता है, इसलिए आपका रोज़मर्रा का फ़ोन ज़ब्त करने की ज़रूरत नहीं पड़ती।\n• **क्या आपको थाने जाना पड़ेगा?**: प्रारंभिक शिकायत पूरी तरह \`cybercrime.gov.in\` पर ऑनलाइन दर्ज होती है। महिला सुरक्षा संबंधी मामलों में विशेष महिला उप-निरीक्षक द्वारा ही गोपनीय प्रक्रिया पूरी की जाती है।\n• **हेल्पलाइन**: त्वरित सहायता के लिए 1930 पर कॉल करें।`
          : `**Truth About Police Procedures, Online Portals & Device Seizure:**\n\n• **Will investigators seize your personal phone?**: No. This is precisely why NariSuraksha AI compiles a **Section 65B Evidence Dossier**. By attaching verified cryptographic SHA-256 checksums, the printed and digital PDF serves as formal secondary electronic evidence in court. Investigating officers do not need to confiscate your personal smartphone.\n• **Do you have to go to a police station?**: Initial complaints are processed entirely online via \`cybercrime.gov.in\`. Furthermore, statutory provisions require designated female officers to handle women-related cyber grievances with strict privacy safeguards.\n• **Immediate Filing**: Call **1930** or attach the downloaded PDF dossier to cybercrime.gov.in.`,
        spoken: isHindi 
          ? `पुलिस आपका फ़ोन ज़ब्त नहीं करेगी। नारीसुरक्षा AI की धारा 65B डॉसियर तकनीकी साक्ष्य प्रदान करती है। पूरी प्रक्रिया ऑनलाइन पोर्टल पर सुरक्षित रूप से होती है।` 
          : `The police will not seize your personal phone. Our Section 65B Evidence Dossier serves as verified technical proof for court admissibility.`,
        actions: [
          { label: isHindi ? '📄 धारा 65B डॉसियर डाउनलोड करें' : '📄 Download 65B Dossier PDF', action: 'dossier' },
          { label: isHindi ? '📝 शिकायत विवरण फ़ॉर्म' : '📝 Incident Intake Form', tab: 'intake' },
          { label: isHindi ? '🏛️ राज्य साइबर सेल संपर्क' : '🏛️ State Cyber Cells', tab: 'resources' }
        ]
      };
    }

    // 7. Statutory Legal Sections (67A, 66E, BNS 78/79, 65B)
    if (q.includes('67a') || q.includes('66e') || q.includes('67') || q.includes('bns') || q.includes('ipc') || q.includes('act') || q.includes('law') || q.includes('धारा') || q.includes('कानून') || q.includes('सज़ा') || q.includes('सजा') || q.includes('65b') || q.includes('section')) {
      return {
        text: isHindi
          ? `**भारतीय कानून में मॉर्फ्ड तस्वीरों और साइबर उत्पीड़न के कठोर प्रावधान:**\n\n• **आईटी एक्ट धारा 67A**: बिना सहमति के मॉर्फ्ड/यौन सामग्री का प्रकाशन या प्रसारण।\n  - **सज़ा**: 5 वर्ष तक का कठोर कारावास एवं ₹10,00,000 तक का जुर्माना।\n  - **जमानत**: संज्ञेय (Cognizable) और **गैर-जमानती (Non-Bailable)**।\n• **आईटी एक्ट धारा 66E**: शारीरिक निजता का हनन (3 साल जेल + ₹2 लाख जुर्माना)।\n• **BNS धारा 78 (पूर्व IPC 354D)**: साइबर स्टॉकिंग (3 से 5 साल जेल)।\n• **BNS धारा 79 (पूर्व IPC 509)**: महिला की लज्जा का अनादर (3 साल तक की जेल)।\n• **धारा 65B (भारतीय साक्ष्य अधिनियम / BSA)**: डिजिटल साक्ष्यों की कोर्ट-मान्यता के लिए तकनीकी प्रमाण-पत्र।`
          : `**Applicable Indian Cyber Law Provisions:**\n\n• **Section 67A, IT Act 2000 (Primary Provision)**: Publishing or transmitting sexually explicit/morphed media depicting any person without consent.\n  - **Penalty**: Up to 5 years rigorous imprisonment AND up to ₹10,00,000 fine. Non-bailable on repeat.\n• **Section 66E, IT Act 2000**: Violation of bodily privacy (up to 3 years imprisonment or ₹2,00,000 fine).\n• **Section 78, Bharatiya Nyaya Sanhita (BNS)**: Cyber stalking and tracking of women (up to 3-5 years imprisonment).\n• **Section 79, Bharatiya Nyaya Sanhita (BNS)**: Insulting the modesty of a woman via digital media.\n• **Section 65B, Evidence Act / BSA**: Required legal attestation certificate verifying forensic electronic records.`,
        spoken: isHindi 
          ? `आईटी एक्ट की धारा 67A के तहत मॉर्फ्ड अश्लील तस्वीरें बनाना या भेजना 5 साल की गैर-जमानती जेल और 10 लाख रुपये के जुर्माने का गंभीर अपराध है।` 
          : `Section 67A of the IT Act makes creating or transmitting morphed explicit imagery punishable by up to 5 years of non-bailable imprisonment and a 10 lakh rupee fine.`,
        actions: [
          { label: isHindi ? '📄 कोर्ट डॉसियर में धाराएं जोड़ें' : '📄 Export Court Dossier', action: 'dossier' },
          { label: isHindi ? '🏛️ कानूनी सहायता NGO देखें' : '🏛️ View Legal Aid NGOs', tab: 'resources' }
        ]
      };
    }

    // 8. Morphed Picture First 3 Steps
    if (q.includes('morphed') || q.includes('deepfake') || q.includes('मॉर्फ़') || q.includes('डीपफेक') || q.includes('photo') || q.includes('picture') || q.includes('तस्वीर') || q.includes('first 3') || q.includes('कदम')) {
      return {
        text: isHindi
          ? `**मॉर्फ्ड तस्वीर दिखने पर तुरंत किए जाने वाले 3 सबसे महत्वपूर्ण कदम:**\n\n1. **कदम 1 - साक्ष्य को सुरक्षित करें (Delete मत करें)**:\n   • उस चैट, धमकी भरे मैसेज और सोशल मीडिया प्रोफाइल का पूरा अनक्रॉप्ड स्क्रीनशॉट लें।\n   • हमारे **'क्रिप्टोग्राफ़िक वॉल्ट'** में डालें ताकि उसका SHA-256 हैश सुरक्षित हो जाए।\n\n2. **कदम 2 - अपराधी को एक भी रुपया न दें और ब्लॉक तुरंत न करें**:\n   • पैसे देने से ब्लैकमेल कभी बंद नहीं होता।\n   • सभी साक्ष्य और उनका UPI/फ़ोन नंबर नोट करने के बाद ही अकाउंट को प्राइवेसी लॉकडाउन में डालें।\n\n3. **कदम 3 - आधिकारिक डॉसियर डाउनलोड करके 1930 पर कॉल करें**:\n   • ऊपर 'आधिकारिक डॉसियर (PDF)' बटन दबाकर धारा 65B साक्ष्य प्रमाणपत्र डाउनलोड करें।\n   • हेल्पलाइन **1930** पर कॉल करें या \`cybercrime.gov.in\` पर अज्ञात शिकायत दर्ज करें।`
          : `**The First 3 Crucial Steps When Facing Morphed Imagery:**\n\n1. **Step 1 - Preserve Uncropped Evidence Before Anything Else**:\n   • Take full, uncropped screenshots showing the profile handle, timestamp, and threat messages.\n   • Drop them into our **Cryptographic Vault** to calculate client-side SHA-256 hashes under Section 65B.\n\n2. **Step 2 - Absolute Financial Refusal (Zero-Payment Strategy)**:\n   • Never send a single rupee. Paying only fuels aggressive follow-up demands.\n   • Note down their UPI ID, phone number, and transaction requests as key criminal evidence.\n\n3. **Step 3 - Export Section 65B Dossier & Dial 1930**:\n   • Click **'Export Official Dossier (PDF)'** to bundle your evidence manifest.\n   • Report directly to \`cybercrime.gov.in\` (Anonymous option available) or call **1930**.`,
        spoken: isHindi 
          ? `मॉर्फ्ड तस्वीर दिखने पर सबसे पहले स्क्रीनशॉट लें और वॉल्ट में डालें, ब्लैकमेलर को कोई पैसा न दें, और डॉसियर डाउनलोड करके हेल्पलाइन 1930 पर कॉल करें।` 
          : `First, capture complete screenshots and hash them in the vault. Second, do not pay any money. Third, export your Section 65B dossier and call 1930.`,
        actions: [
          { label: isHindi ? '📂 साक्ष्य वॉल्ट में जाएं' : '📂 Go to Evidence Vault', tab: 'vault' },
          { label: isHindi ? '📄 कोर्ट डॉसियर PDF डाउनलोड' : '📄 Export Dossier PDF', action: 'dossier' },
          { label: isHindi ? '📞 हेल्पलाइन 1930 पर कॉल' : '📞 Call Helpline 1930', url: 'tel:1930' }
        ]
      };
    }

    // 9. Greetings & Who are you
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('नमस्ते') || q.includes('who are you') || q.includes('help') || q.includes('मदद') || q.includes('सखी') || q.includes('sakhi') || q.includes('sahayak') || q.includes('सहायक')) {
      return {
        text: isHindi
          ? `नमस्ते! मैं **सखी एवं सहायक** हूँ — आपकी सुरक्षित, गोपनीय AI मार्गदर्शक।\n\nमैं महिलाओं और बालिकाओं को मॉर्फ्ड तस्वीरों, डीपफ़ेक ब्लैकमेल और डिजिटल उत्पीड़न से सुरक्षित निकालने के लिए बनाई गई हूँ।\n\n**मैं आपकी क्या मदद कर सकती हूँ?**\n• साक्ष्य को कोर्ट-मान्य तरीके से सुरक्षित करना (धारा 65B)\n• इंस्टाग्राम, टेलीग्राम व अन्य ऐप्स से फ़ोटो 24 घंटे में हटवाना\n• ब्लैकमेल से बिना पैसे दिए सुरक्षित निपटना\n• माता-पिता या कॉलेज को बताए बिना अज्ञात रिपोर्ट दर्ज करना\n• राष्ट्रीय साइबर हेल्पलाइन 1930 और महिला हेल्पलाइन 1091 से जुड़ना\n\nआप मुझसे कुछ भी पूछ सकती हैं या ऊपर माइक दबाकर बोल सकती हैं।`
          : `Hello! I am **Sakhi & Sahayak** — your safe, completely confidential AI triage companion.\n\nI am engineered specifically to support women and girls facing manipulated imagery, deepfake extortion, and digital harassment.\n\n**How I can help you right now:**\n• Preserve tamper-proof evidence hashes under Section 65B of the Indian Evidence Act\n• Guide you through emergency 24-hour takedowns on Instagram, Telegram & X\n• Help you defeat extortion threats without paying any ransom\n• File an anonymous complaint on cybercrime.gov.in\n• Connect you directly with 1930, 1091, and verified pro-bono cyber legal aid\n\nYou can type anything or tap the microphone to speak naturally.`,
        spoken: isHindi 
          ? `नमस्ते! मैं सखी हूँ। आपकी सुरक्षित AI मार्गदर्शक। आप मुझसे बोलकर या लिखकर किसी भी सहायता के लिए पूछ सकती हैं।` 
          : `Hello! I am Sakhi, your safe and confidential AI triage companion. How can I support you right now?`,
        actions: [
          { label: isHindi ? '📝 शिकायत फ़ॉर्म शुरू करें' : '📝 Start Intake Form', tab: 'intake' },
          { label: isHindi ? '📂 साक्ष्य वॉल्ट खोलें' : '📂 Open Evidence Vault', tab: 'vault' },
          { label: isHindi ? '🧘 शांति व्यायाम' : '🧘 Calming Exercise', action: 'breathe' }
        ]
      };
    }

    // 10. General / Comprehensive Fallback
    return {
      text: isHindi
        ? `मैं आपकी स्थिति समझ रही हूँ। **हम मिलकर इसे चरणबद्ध तरीके से सुलझाएंगे:**\n\n1. **साक्ष्य को हैश करें**: सबसे पहले उस चैट या स्क्रीनशॉट को हमारे **'क्रिप्टोग्राफ़िक वॉल्ट'** में डालें ताकि उसका SHA-256 हैश सुरक्षित हो जाए।\n2. **ब्लैकमेलर को कभी कोई पैसा न दें**: पैसे देने से ब्लैकमेल कभी रुकता नहीं। बातचीत को कभी डिलीट न करें।\n3. **आधिकारिक डॉसियर जनरेट करें**: ऊपर 'आधिकारिक डॉसियर (PDF)' दबाएं। यह धारा 65B के तहत पुलिस के लिए अकाट्य दस्तावेज़ तैयार कर देगा।\n4. **1930 पर कॉल करें**: त्वरित कार्रवाई के लिए राष्ट्रीय साइबर हेल्पलाइन 1930 पर कॉल करें।\n\nयदि आपके मन में पुलिस, माता-पिता या प्लेटफ़ॉर्म को लेकर कोई विशिष्ट प्रश्न है, तो बेझिझक पूछें।`
        : `I hear you, and I am standing firmly with you. **Here are your immediate 4-step action rules:**\n\n1. **Lock the Technical Evidence**: Drop all screenshots into our **Cryptographic Vault** to calculate their client-side SHA-256 digests.\n2. **Strict Non-Compliance**: Do NOT transfer any extortion money and do NOT clear your chat history.\n3. **Export Section 65B Dossier**: Click **'Export Official Dossier (PDF)'** to compile your court-compliant evidence manifest.\n4. **Direct Priority Filing**: Dial **1930** (National Cyber Crime Helpline) or submit directly to \`cybercrime.gov.in\`.\n\nAsk me anything about platform takedowns, police procedures, anonymous filing, or how to handle fear.`,
      spoken: isHindi 
        ? `मैं आपकी स्थिति समझ रही हूँ। स्क्रीनशॉट को वॉल्ट में हैश कीजिए, कोई पैसा मत दीजिए, और हम मिलकर आपकी साक्ष्य डॉसियर तैयार करेंगे।` 
        : `I hear you, and I am right here with you. Preserve your screenshots in the vault, do not pay any ransom, and we will compile your official Section 65B dossier.`,
      actions: [
        { label: isHindi ? '📂 साक्ष्य वॉल्ट में जाएं' : '📂 Go to Evidence Vault', tab: 'vault' },
        { label: isHindi ? '📄 कोर्ट डॉसियर PDF' : '📄 Export Dossier PDF', action: 'dossier' },
        { label: isHindi ? '📞 हेल्पलाइन 1930' : '📞 Call 1930', url: 'tel:1930' }
      ]
    };
  };

  // Main Query Handler (Backend Live LLM / Sovereign Engine + Zero-Latency Fallback)
  const handleUserQuery = async (queryText) => {
    const query = (queryText || textInput).trim();
    if (!query) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setTextInput('');
    setIsTyping(true);

    try {
      // First attempt backend /api/ai-assistant with API key if available
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query, 
          lang,
          apiKey: apiKey.trim(),
          provider: apiProvider
        })
      });

      if (response.ok) {
        const data = await response.json();
        const sakhiMsg = {
          id: `s-${Date.now()}`,
          sender: 'sakhi',
          text: data.text,
          spoken: data.spoken,
          model: data.llmPowered ? data.model : null,
          actions: data.actions || []
        };
        setMessages(prev => [...prev, sakhiMsg]);
        if (voiceSpeechEnabled) speakAloud(data.spoken || data.text);
      } else {
        throw new Error('Backend responded with error');
      }
    } catch {
      // Client-side zero-latency intelligent fallback
      const localData = getLocalIntelligenceResponse(query, lang);
      const sakhiMsg = {
        id: `s-${Date.now()}`,
        sender: 'sakhi',
        text: localData.text,
        spoken: localData.spoken,
        model: null,
        actions: localData.actions || []
      };
      setMessages(prev => [...prev, sakhiMsg]);
      if (voiceSpeechEnabled) speakAloud(localData.spoken || localData.text);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (actionItem) => {
    if (actionItem.tab) {
      setActiveTab(actionItem.tab);
    } else if (actionItem.url) {
      if (actionItem.url.startsWith('tel:')) {
        window.location.href = actionItem.url;
      } else {
        window.open(actionItem.url, '_blank');
      }
    } else if (actionItem.action === 'breathe') {
      setShowBreathingExercise(true);
    } else if (actionItem.action === 'dossier') {
      setIsDossierModalOpen(true);
    }
  };

  // Save or Verify Free API Key
  const handleVerifyAndSaveKey = async () => {
    const cleanKey = inputKey.trim();
    if (!cleanKey) {
      // Clear key
      setApiKey('');
      localStorage.removeItem('narisuraksha_ai_key');
      setVerifyStatus({ success: true, message: 'Key removed. Switched back to Sovereign Engine.' });
      showToast('Switched to Sovereign Built-In AI Engine');
      setTimeout(() => setShowKeyModal(false), 900);
      return;
    }

    setIsVerifying(true);
    setVerifyStatus(null);

    try {
      const resp = await fetch('/api/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: cleanKey, provider: selectedProvider })
      });

      const data = await resp.json();
      if (resp.ok && data.success) {
        setApiKey(cleanKey);
        setApiProvider(selectedProvider);
        localStorage.setItem('narisuraksha_ai_key', cleanKey);
        localStorage.setItem('narisuraksha_ai_provider', selectedProvider);
        setVerifyStatus({ 
          success: true, 
          message: `Verified! Active on ${data.model}` 
        });
        showToast(`✨ Live ${selectedProvider === 'groq' ? 'Groq' : 'Google Gemini'} AI Connected!`);
        setTimeout(() => setShowKeyModal(false), 1200);
      } else {
        setVerifyStatus({ 
          success: false, 
          message: data.error || 'Failed to authenticate key. Please check and retry.' 
        });
      }
    } catch {
      // Offline or network error: save locally regardless
      setApiKey(cleanKey);
      setApiProvider(selectedProvider);
      localStorage.setItem('narisuraksha_ai_key', cleanKey);
      localStorage.setItem('narisuraksha_ai_provider', selectedProvider);
      setVerifyStatus({ 
        success: true, 
        message: 'Saved locally for direct requests.' 
      });
      setTimeout(() => setShowKeyModal(false), 1200);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5 flex flex-col min-h-[720px]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-teal-400 p-0.5 flex items-center justify-center shadow-glow-teal">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{lang === 'hi' ? 'सखी AI - वॉइस एवं चैट साथी' : 'Sakhi AI - Interactive Voice & Chat Companion'}</span>
              </h2>
              {apiKey ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
                  {apiProvider === 'groq' ? 'Groq Llama 3.3 Active' : 'Gemini 1.5 Flash Active'}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-brand-teal/20 text-brand-tealLight border border-brand-teal/40 text-[10px] font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-brand-tealLight" />
                  {lang === 'hi' ? 'सॉवरेन इंजन सक्रिय' : 'Sovereign Engine Active'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'hi'
                ? 'निःसंकोच बोलें या टाइप करें — सखी आपको भावनात्मक संबल, त्वरित कानूनी मार्गदर्शन और टेकडाउन प्रक्रिया समझाएगी।'
                : 'Speak aloud or type freely — trauma-informed emotional grounding, statutory triage, and 24-hr takedown guidance.'}
            </p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Free AI Key Trigger */}
          <button
            onClick={() => setShowKeyModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              apiKey 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30' 
                : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}
            title="Configure Free Google Gemini or Groq API Key"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>{apiKey ? (apiProvider === 'groq' ? 'Groq Live' : 'Gemini Live') : (lang === 'hi' ? 'फ्री AI Key' : 'Free AI Key')}</span>
          </button>

          {/* Calming Breath Trigger */}
          <button
            onClick={() => setShowBreathingExercise(!showBreathingExercise)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              showBreathingExercise 
                ? 'bg-rose-500/20 border-rose-500 text-rose-300' 
                : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
          >
            <Smile className="w-3.5 h-3.5 text-rose-400" />
            <span>{showBreathingExercise ? (lang === 'hi' ? 'व्यायाम बंद करें' : 'Close Breath') : (lang === 'hi' ? 'शांत होने का व्यायाम' : 'Calming Breath')}</span>
          </button>

          {/* Voice Output Mute/Unmute */}
          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setVoiceSpeechEnabled(!voiceSpeechEnabled);
            }}
            className={`p-2 rounded-xl border transition-all ${
              voiceSpeechEnabled 
                ? 'bg-brand-teal/20 border-brand-teal/40 text-brand-tealLight' 
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title={voiceSpeechEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
          >
            {voiceSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Mode Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveMode('chat')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeMode === 'chat' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              {lang === 'hi' ? 'चैट मोड' : 'Chat Stream'}
            </button>
            <button
              onClick={() => setActiveMode('voice')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeMode === 'voice' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              {lang === 'hi' ? 'वॉइस कॉल मोड' : 'Voice Call'}
            </button>
          </div>

          {/* Reset Conversation */}
          <button
            onClick={() => {
              stopSpeaking();
              setMessages([{
                id: 'reset',
                sender: 'sakhi',
                text: lang === 'hi' ? 'बातचीत रीसेट हो गई है। आप क्या पूछना चाहती हैं?' : 'Conversation reset. How can I guide you right now?'
              }]);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Free API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  {lang === 'hi' ? 'फ्री AI API Key कॉन्फ़िगरेशन' : 'Connect Free AI Key (Gemini / Groq)'}
                </h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'hi'
                ? 'सखी AI को Google Gemini 1.5 Flash या Groq से जोड़ने के लिए नीचे अपनी निःशुल्क API Key दर्ज करें। इसके लिए किसी क्रेडिट कार्ड की आवश्यकता नहीं होती है।'
                : 'Connect Sakhi directly to Google Gemini 1.5 Flash or Groq Llama 3.3 using a 100% Free API Key with zero costs and no credit card required.'}
            </p>

            {/* Provider Toggle */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedProvider('gemini')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedProvider === 'gemini'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Google Gemini 1.5</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">15 Requests / min Free (Google AI Studio)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedProvider('groq')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedProvider === 'groq'
                    ? 'bg-amber-600/20 border-amber-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                  <span>Groq (Llama 3.3)</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Ultra-fast 500 T/s Free (Groq Console)</span>
              </button>
            </div>

            {/* Direct Free Key Links */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 block">
                {lang === 'hi' ? 'निःशुल्क Key प्राप्त करने के लिंक:' : 'Where to get a free API Key in 30 seconds:'}
              </span>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px]"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Google AI Studio Key (Free)</span>
                </a>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px]"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Groq Console Key (Free)</span>
                </a>
              </div>
            </div>

            {/* Key Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium block">
                {selectedProvider === 'groq' ? 'Groq API Key (gsk_...)' : 'Gemini API Key (AIzaSy...)'}
              </label>
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder={selectedProvider === 'groq' ? 'gsk_...' : 'AIzaSy...'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-brand-teal"
              />
            </div>

            {/* Verification Status Message */}
            {verifyStatus && (
              <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                verifyStatus.success 
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
              }`}>
                {verifyStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                <span>{verifyStatus.message}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setInputKey('');
                  handleVerifyAndSaveKey();
                }}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                {lang === 'hi' ? 'Key हटाएं (सॉवरेन मोड)' : 'Clear Key (Sovereign Mode)'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleVerifyAndSaveKey}
                  disabled={isVerifying}
                  className="px-4 py-1.5 rounded-xl bg-brand-teal hover:bg-teal-500 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>{inputKey ? (lang === 'hi' ? 'सत्यापित करें और सहेजें' : 'Verify & Save Key') : (lang === 'hi' ? 'सहेजें' : 'Save')}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guided Calming / Box Breathing Widget */}
      {showBreathingExercise && (
        <div className="p-5 rounded-2xl bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/30 text-center space-y-3 animate-fade-in flex-shrink-0">
          <div className="flex items-center justify-center gap-2 text-rose-300 font-bold text-xs">
            <Heart className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>{lang === 'hi' ? 'सखी भावनात्मक शांति एवं ग्राउंडिंग अभ्यास' : 'Sakhi Emotional Grounding & Calming Breath'}</span>
          </div>

          <div className="relative w-28 h-28 mx-auto my-1 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-rose-500/10 animate-ping opacity-30" style={{ animationDuration: '4s' }} />
            <div className="w-24 h-24 rounded-full border-2 border-rose-500/50 bg-rose-950/50 flex items-center justify-center shadow-glow-rose">
              <span className="text-xs font-semibold text-rose-200 px-1 leading-tight">
                {breathPhase}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            {lang === 'hi'
              ? 'आप अकेली नहीं हैं। यह घटना आपके अस्तित्व या गरिमा को परिभाषित नहीं करती। हम सब मिलकर इसका कानूनी समाधान करेंगे।'
              : 'You are safe in this moment. This violation does not define your dignity or your worth. Take one slow breath at a time.'}
          </p>

          <div className="flex justify-center gap-2.5 pt-1">
            <a
              href="tel:1091"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 border border-rose-500/40 text-rose-300 text-xs font-semibold hover:bg-rose-600/30"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              <span>{lang === 'hi' ? 'महिला हेल्पलाइन (1091)' : 'Women Helpline (1091)'}</span>
            </a>
            <a
              href="tel:1930"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-teal/20 border border-brand-teal/40 text-brand-tealLight text-xs font-semibold hover:bg-brand-teal/30"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-tealLight" />
              <span>{lang === 'hi' ? 'साइबर हेल्पलाइन (1930)' : 'Cyber Helpline (1930)'}</span>
            </a>
          </div>
        </div>
      )}

      {/* Mode 1: Hands-Free Voice Call Visualizer */}
      {activeMode === 'voice' && (
        <div className="bg-slate-950/70 rounded-2xl p-6 border border-slate-800 text-center space-y-4">
          <div className="max-w-md mx-auto space-y-1">
            <span className="text-[11px] uppercase tracking-widest font-mono text-brand-tealLight">
              {lang === 'hi' ? 'सक्रिय टू-वे वॉइस संवाद' : 'Active Two-Way Voice Dialogue'}
            </span>
            <h3 className="text-base font-bold text-white">
              {lang === 'hi' ? 'सखी से सीधे बोलकर मार्गदर्शन प्राप्त करें' : 'Talk Directly with Sakhi'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'hi' 
                ? 'माइक दबाकर बोलें। सखी आपकी बात सुनकर सौम्य आवाज़ में मार्गदर्शन देगी।' 
                : 'Tap the orb and speak naturally. Sakhi will listen and respond aloud.'}
            </p>
          </div>

          {/* Central Pulsing Audio Orb */}
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center my-2">
            {(isListening || isSpeaking) && (
              <>
                <div className="absolute inset-0 rounded-full border border-brand-teal/30 animate-ping opacity-40" style={{ animationDuration: '2.5s' }} />
                <div className="absolute inset-2 rounded-full border border-rose-500/30 animate-pulse opacity-50" />
              </>
            )}

            <button
              onClick={toggleListening}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl relative z-10 ${
                isListening 
                  ? 'bg-gradient-to-tr from-rose-600 to-pink-500 text-white scale-105 shadow-glow-rose ring-4 ring-rose-500/30' 
                  : isSpeaking
                    ? 'bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 scale-105 shadow-glow-teal ring-4 ring-teal-500/30'
                    : 'bg-slate-900 border-2 border-slate-700 hover:border-brand-teal text-slate-300 hover:text-white'
              }`}
            >
              {isListening ? (
                <>
                  <Mic className="w-8 h-8 animate-bounce" />
                  <span className="text-[10px] font-bold mt-1 tracking-wide">
                    {lang === 'hi' ? 'सुन रही हूँ...' : 'Listening...'}
                  </span>
                </>
              ) : isSpeaking ? (
                <>
                  <Volume2 className="w-8 h-8 animate-pulse" />
                  <span className="text-[10px] font-bold mt-1 tracking-wide">
                    {lang === 'hi' ? 'बोल रही हूँ...' : 'Speaking...'}
                  </span>
                </>
              ) : (
                <>
                  <Mic className="w-8 h-8 text-brand-tealLight" />
                  <span className="text-[10px] font-bold mt-1 text-slate-300">
                    {lang === 'hi' ? 'बोलने के लिए छुएं' : 'Tap to Speak'}
                  </span>
                </>
              )}
            </button>
          </div>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] inline-flex items-center gap-1 border border-slate-700"
            >
              <Pause className="w-3 h-3" />
              <span>{lang === 'hi' ? 'आवाज़ रोकें' : 'Stop Speaking'}</span>
            </button>
          )}
        </div>
      )}

      {/* Suggested Quick Question Chips */}
      <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-800/60 flex-shrink-0">
        {[
          { en: "Someone morphed my picture. What are the first 3 things I must do right now?", hi: "मेरी तस्वीर मॉर्फ़ की गई है। अभी क्या 3 काम करने चाहिए?" },
          { en: "They gave me a 2-hour deadline to pay money. What if I pay?", hi: "पैसे देने के लिए 2 घंटे का समय दिया है। क्या पैसे दे दूँ?" },
          { en: "How can I report anonymously on cybercrime.gov.in?", hi: "cybercrime.gov.in पर अज्ञात शिकायत कैसे दर्ज करें?" },
          { en: "Will the police seize my personal phone if I report?", hi: "क्या पुलिस मेरा व्यक्तिगत फ़ोन ज़ब्त करेगी?" },
          { en: "What is Section 67A penalty in IT Act?", hi: "आईटी एक्ट धारा 67A में क्या सज़ा है?" },
          { en: "How does StopNCII.org protect my images?", hi: "StopNCII.org मेरी तस्वीरों को कैसे रोकता है?" },
          { en: "How to take down a fake Instagram profile?", hi: "फ़ेक इंस्टाग्राम प्रोफ़ाइल 24 घंटे में कैसे हटवाएं?" }
        ].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleUserQuery(lang === 'hi' ? chip.hi : chip.en)}
            className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-brand-teal/40 text-[11px] text-slate-300 hover:text-brand-tealLight transition-all flex items-center gap-1 text-left"
          >
            <Sparkles className="w-3 h-3 text-brand-tealLight flex-shrink-0" />
            <span>{lang === 'hi' ? chip.hi : chip.en}</span>
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[300px]">
        {messages.map((msg) => {
          const isSakhi = msg.sender === 'sakhi' || msg.sender === 'bot';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isSakhi ? '' : 'flex-row-reverse'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                isSakhi 
                  ? 'bg-gradient-to-tr from-rose-500 to-teal-400 text-slate-950 font-bold' 
                  : 'bg-brand-teal text-slate-950 font-bold'
              }`}>
                {isSakhi ? <Heart className="w-4 h-4 fill-slate-950" /> : <User className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                isSakhi 
                  ? 'bg-slate-900/90 border border-slate-800 text-slate-200' 
                  : 'bg-brand-teal/20 border border-brand-teal/40 text-white ml-auto'
              }`}>
                <div className="whitespace-pre-line space-y-2 font-sans">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => {
                    const formatted = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    return (
                      <p 
                        key={pIdx} 
                        dangerouslySetInnerHTML={{ __html: formatted }} 
                        className="leading-relaxed"
                      />
                    );
                  })}
                </div>

                {/* Model Attribution Badge */}
                {isSakhi && msg.model && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400/90 font-mono">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                    <span>Live AI: {msg.model}</span>
                  </div>
                )}

                {/* Interactive Action Shortcuts */}
                {isSakhi && msg.actions && msg.actions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {msg.actions.map((act, actIdx) => (
                      <button
                        key={actIdx}
                        onClick={() => handleActionClick(act)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-tealLight border border-brand-teal/30 text-[11px] font-semibold transition-all hover:scale-[1.02] flex items-center gap-1"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Speak Aloud Button */}
                {isSakhi && (
                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/50">
                    <button
                      onClick={() => speakAloud(msg.spoken || msg.text)}
                      className="text-brand-tealLight hover:underline flex items-center gap-1 font-mono"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{lang === 'hi' ? 'आवाज़ में सुनें' : 'Listen Aloud'}</span>
                    </button>
                    {isSpeaking && (
                      <button onClick={stopSpeaking} className="text-rose-400 hover:underline flex items-center gap-0.5">
                        <Pause className="w-2.5 h-2.5" />
                        <span>Stop</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-brand-tealLight border border-brand-teal/40 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-tealLight animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-brand-tealLight animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-brand-tealLight animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-slate-400 ml-1">
                {apiKey 
                  ? (lang === 'hi' ? 'लाइव AI से उत्तर प्राप्त हो रहा है...' : 'Generating trauma-informed response via live LLM...') 
                  : (lang === 'hi' ? 'सखी विश्लेषण कर रही है...' : 'Sakhi is preparing trauma-informed legal guidance...')}
              </span>
            </div>
          </div>
        )}
        <div ref={chatScrollRef} />
      </div>

      {/* Input Field with Mic & Send - ALWAYS PRESENT */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUserQuery();
        }}
        className="flex items-center gap-2 pt-3 border-t border-slate-800 flex-shrink-0"
      >
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={lang === 'hi' ? 'सखी से कुछ भी पूछें या माइक दबाकर बोलें...' : 'Ask Sakhi anything or tap microphone to speak...'}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal transition-colors"
        />

        {/* Microphone Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2.5 rounded-xl border transition-all ${
            isListening 
              ? 'bg-rose-600 border-rose-500 text-white animate-pulse shadow-glow-rose' 
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
          }`}
          title={isListening ? 'Stop Listening' : 'Speak with Microphone'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-brand-tealLight" />}
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!textInput.trim() || isTyping}
          className="px-4 py-2.5 rounded-xl bg-brand-teal hover:bg-teal-500 text-slate-950 font-bold text-xs transition-all shadow-glow-teal disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <span>{lang === 'hi' ? 'पूछें' : 'Send'}</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
