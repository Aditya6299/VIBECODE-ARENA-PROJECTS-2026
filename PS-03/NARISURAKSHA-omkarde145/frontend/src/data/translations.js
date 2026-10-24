export const translations = {
  en: {
    appTitle: "NariSuraksha AI",
    appSubtitle: "Morphed Image Abuse Reporting & Evidence Dossier Assistant",
    tagline: "Empowering victims with cryptographic chain-of-custody evidence & legal guidance",
    panicButton: "Quick Exit",
    panicEscHint: "Press ESC anytime to instantly purge session & exit",
    zeroKnowledgeBadge: "Zero-Knowledge Vault: Media NEVER uploaded to any server",
    loadDemoButton: "Load Simulated Demo Case",
    exportDossierButton: "Export Official Dossier (PDF)",
    demoLoadedNotice: "Simulated demo case loaded successfully for judging/review.",
    
    // Navigation Tabs
    tabs: {
      intake: "1. Incident Intake",
      checklist: "2. Evidence Checklist",
      vault: "3. Cryptographic Vault",
      juxtaposition: "4. Visual Juxtaposition",
      exif: "5. EXIF & GPS Scrubber",
      extortion: "6. UPI Extortion / 1930",
      timeline: "7. Event Timeline",
      takedown: "8. Platform Takedowns",
      sakhi: "🎙️ 9. Sakhi AI Assistant",
      progress: "10. Case Progress",
      response: "11. Takedown Tracker",
      witnesses: "12. Witness Statements",
      resources: "13. Support Directory"
    },

    // Disclaimers Banner
    disclaimers: {
      heading: "Mandatory Legal & Operational Disclaimers",
      zeroKnowledge: "Zero-Knowledge Architecture: All SHA-256 checksums and metadata extractions are computed exclusively inside your local web browser. No photos, videos, or screenshots are ever transmitted to any external server.",
      noAuthenticityClaim: "No Image Authenticity Claims: NariSuraksha AI does not verify whether an image is authentic or generate deepfake certainty scores. It provides structured evidence packaging and chronological cataloging for official forensic review.",
      noAutoFir: "No Autonomous Police Filing: This platform does NOT automatically file an FIR or police complaint. It compiles a court-admissible Section 65B-compliant Evidence Dossier for the victim to submit directly to cybercrime.gov.in or their local cyber cell.",
      emergencyHelpline: "Emergency Helplines: National Cybercrime: 1930 | Women in Distress: 1091 | Emergency: 112"
    },

    // Module 1: Intake Wizard
    intake: {
      step1Title: "Abuse Classification",
      step1Desc: "Select the primary category of digital abuse you have experienced.",
      categoryLabel: "Primary Abuse Category",
      categories: {
        morphedNudity: "Morphed / Deepfake Explicit Imagery (Non-Consensual)",
        extortionBlackmail: "Sextortion & Monetary / Compliance Extortion",
        impersonationProfile: "Fake / Impersonation Account Creation & Slander",
        nonConsensualSharing: "Non-Consensual Distribution of Intimate Media (NCII)",
        doxxingHarassment: "Doxxing, Contact Leakage & Coordinated Harassment"
      },
      severityLabel: "Urgency / Threat Level",
      severityOptions: {
        critical: "Critical (Active blackmail / extortion deadline in progress)",
        high: "High (Media already published or broadcast in groups)",
        medium: "Medium (Private threats received; media not yet viral)"
      },
      
      step2Title: "Targeted Digital Platforms",
      step2Desc: "Specify all platforms where the abuse, publishing, or threats occurred.",
      platformsLabel: "Select Platforms (Multi-select)",
      platformOther: "Other Platform / Forum",

      step3Title: "Perpetrator Footprint & Handle Tracker",
      step3Desc: "Document all known digital handles, profile URLs, phone numbers, or payment requests.",
      perpetratorHandle: "Perpetrator Username / Handle",
      perpetratorHandlePlaceholder: "e.g., @darkshadow_anon or +91 98XXX XXXXX",
      profileUrl: "Perpetrator Profile URL or Channel Link",
      profileUrlPlaceholder: "e.g., https://instagram.com/fake_profile_id or https://t.me/channel_name",
      extortionDemand: "Extortion / Blackmail Demand (if applicable)",
      extortionDemandPlaceholder: "e.g., Demanding ₹25,000 via UPI or threatening to share to college group",
      contactMethod: "Initial Contact Medium",

      step4Title: "Incident Description & Narrative",
      step4Desc: "Provide an objective, chronological summary of what transpired. Avoid deleting chats.",
      narrativeLabel: "Detailed Narrative for Investigating Cyber Cell Officers",
      narrativePlaceholder: "Explain clearly: When did you first notice the abuse? How did the perpetrator reach out? What original photos were used? Did they threaten dissemination? State clearly that you did not consent.",
      generateAiSummary: "Generate Structured Police Narrative Template",
      wordCount: "Words",

      buttons: {
        next: "Next Step",
        back: "Previous Step",
        complete: "Complete Intake Form",
        completed: "Intake Form Completed"
      }
    },

    // Module 2: Checklist
    checklist: {
      title: "Evidence Integrity & Preservation Checklist",
      subtitle: "Critical technical rules required for court admissibility under Section 65B of the Indian Evidence Act / BSA",
      progressLabel: "Preservation Readiness Score",
      items: [
        {
          id: "clock",
          title: "System Clock & Calendar Visible",
          desc: "Full device screenshot showing device status bar / desktop clock, date, and battery percentage to verify timeline.",
          tip: "Do not crop the screenshot! Cropped screenshots are frequently contested in court."
        },
        {
          id: "url",
          title: "Full Profile URL & Account ID Captured",
          desc: "Captured the exact permanent URL or numerical User ID, not just the easily changeable display name.",
          tip: "Usernames can be changed in seconds; permanent URLs or user IDs preserve true identity."
        },
        {
          id: "baseline",
          title: "Original Unedited Baseline Image Retained",
          desc: "Preserved original harmless photograph (e.g. from social media or graduation) used by perpetrator to generate morphed media.",
          tip: "Juxtaposing the unedited baseline against the morphed image conclusively demonstrates fabrication."
        },
        {
          id: "dmThread",
          title: "Complete Uninterrupted Message Threads",
          desc: "Retained continuous conversation history. Did not delete messages or leave groups before capturing archives.",
          tip: "Export chat backup (`.txt`) and capture overlapping screenshots of the conversation."
        },
        {
          id: "noPayment",
          title: "Zero Extortion Payment Policy Maintained",
          desc: "Confirmed that NO money or compliance has been provided to the blackmailer.",
          tip: "Paying extortionists never stops them; it marks you as a recurring target and funds further abuse."
        }
      ]
    },

    // Module 3: Evidence Vault
    vault: {
      title: "Zero-Knowledge Cryptographic Evidence Vault",
      subtitle: "Calculate SHA-256 cryptographic digests locally in your browser. Media never leaves this device.",
      dropTitle: "Drag & drop evidence files here, or click to browse",
      dropHint: "Supports PNG, JPG, MP4, PDF, TXT (Up to 100MB per file). Hashes computed client-side via Web Crypto API.",
      privacyNotice: "🔒 Client-Side Only: Files remain in your device's memory. No uploads occur.",
      tableTitle: "Cryptographic Evidence Manifest",
      thName: "Evidence File",
      thHash: "SHA-256 Digest Checksum",
      thSize: "Size",
      thTime: "Timestamp",
      thPlatform: "Platform / Tag",
      thActions: "Actions",
      copyHash: "Copy SHA-256",
      hashCopied: "Copied!",
      previewBtn: "View Preview",
      removeBtn: "Remove",
      addSampleBtn: "Add Simulated Evidence Item",
      baselineTag: "Original Baseline",
      morphedTag: "Morphed Abuse",
      extortionTag: "Extortion Threat",
      noFiles: "No evidence files added yet. Drag and drop screenshots or click above to begin hashing."
    },

    // Module 4: Timeline
    timeline: {
      title: "Chronological Sequence of Events",
      subtitle: "Construct an indisputable timeline of perpetrator contact, escalation, and evidence collection.",
      addEventBtn: "Add Chronological Event",
      dateLabel: "Date & Time",
      eventTitleLabel: "Event Title",
      eventDescLabel: "Detailed Description",
      linkedEvidenceLabel: "Linked Evidence Hash / Item",
      saveBtn: "Save Event",
      cancelBtn: "Cancel",
      noEvents: "No timeline events added yet. Add key milestones like initial message, threats, and discovery."
    },

    // Module 5: Takedowns
    takedowns: {
      title: "Platform Takedown Playbooks & Account Lockdown",
      subtitle: "Step-by-step verified escalation paths to permanently de-index morphed media and harden your identity.",
      emergencyLockdownTitle: "🚨 Emergency 3-Step Identity Lockdown (Do This Immediately)",
      step1: "1. Terminate All Active Remote Sessions (Log Out Unknown Devices)",
      step1Desc: "Go to Settings > Security > Where You're Logged In > Revoke all sessions except current trusted device.",
      step2: "2. Enforce Hardware or App-Based Two-Factor Authentication (2FA)",
      step2Desc: "Never use SMS OTP (vulnerable to SIM swapping). Use Google Authenticator or Apple Keychain.",
      step3: "3. Flip Account to Private & Restrict Direct Message Requests",
      step3Desc: "Lock down profile visibility, restrict taggings/mentions to mutual followers, disable message requests from strangers.",
      stopNciiTitle: "StopNCII.org Global Hash Protection Guide",
      stopNciiDesc: "StopNCII.org creates unique digital fingerprints (hashes) on your device. Only the hash is shared with participating tech companies (Meta, TikTok, OnlyFans, etc.) to detect and block sharing—the photo never leaves your phone."
    },

    // Module 6: Sahayak AI Chat
    sahayak: {
      title: "Bilingual AI Sahayak (Triage & Legal Assistant)",
      subtitle: "Compassionate, immediate guidance grounded in Indian Cyber Law & Survivor Support Protocols.",
      inputPlaceholder: "Ask anything about cyber law, takedown processes, or reporting...",
      sendBtn: "Ask Sahayak",
      thinking: "Sahayak is analyzing legal precedents...",
      presetChips: [
        "How to take down a fake Instagram profile?",
        "What is the penalty under IT Act Section 67A?",
        "How do I file anonymously on cybercrime.gov.in?",
        "Perpetrator is blackmailing for money. What do I do?",
        "What is a Section 65B Certificate and do I need one?",
        "How does StopNCII.org protect my morphed pictures?"
      ]
    },

    // Module 7: PDF Dossier
    dossier: {
      modalTitle: "Court-Ready Evidence Dossier Preview",
      modalSubtitle: "Section 65B-compliant documentation ready for submission to cybercrime.gov.in",
      downloadPdf: "Download Official PDF Dossier",
      closeBtn: "Close Preview",
      filingReminderTitle: "Direct Filing Instructions for National Cyber Crime Portal",
      filingStep1: "1. Go to https://cybercrime.gov.in and click 'Report Women / Children Related Crime'.",
      filingStep2: "2. Choose 'Report Anonymously' if you wish to conceal your identity initially, or 'Report & Track' for full FIR tracking.",
      filingStep3: "3. Upload the generated PDF Dossier as the primary technical annexure in the complaint form.",
      filingStep4: "4. Call 1930 within 24 hours with your acknowledgment number for priority police routing."
    }
  },

  hi: {
    appTitle: "नारीसुरक्षा AI",
    appSubtitle: "मॉर्फ्ड (छेड़छाड़ की गई) छवि दुर्व्यवहार रिपोर्टिंग एवं साक्ष्य डॉसियर सहायक",
    tagline: "पीड़िताओं को क्रिप्टोग्राफ़िक साक्ष्य श्रृंखला और कानूनी मार्गदर्शन द्वारा सशक्त बनाना",
    panicButton: "त्वरित निकास (Quick Exit)",
    panicEscHint: "किसी भी समय सत्र समाप्त करने और बाहर निकलने के लिए ESC दबाएँ",
    zeroKnowledgeBadge: "शून्य-ज्ञान वॉल्ट: मीडिया कभी भी किसी सर्वर पर अपलोड नहीं होता",
    loadDemoButton: "डेमो केस लोड करें",
    exportDossierButton: "आधिकारिक डॉसियर डाउनलोड करें (PDF)",
    demoLoadedNotice: "समीक्षा और प्रदर्शन के लिए काल्पनिक डेमो केस सफलतापूर्वक लोड हो गया है।",

    // Navigation Tabs
    tabs: {
      intake: "1. शिकायत विवरण",
      checklist: "2. साक्ष्य चेकलिस्ट",
      vault: "3. क्रिप्टोग्राफ़िक वॉल्ट",
      juxtaposition: "4. विज़ुअल तुलना",
      exif: "5. EXIF एवं GPS स्क्रबर",
      extortion: "6. UPI फिरौती / 1930",
      timeline: "7. घटना क्रम",
      takedown: "8. प्लेटफ़ॉर्म टेकडाउन",
      sakhi: "🎙️ 9. सखी AI सहायक",
      progress: "10. केस प्रगति",
      response: "11. टेकडाउन ट्रैकर",
      witnesses: "12. गवाह बयान",
      resources: "13. सहायता निर्देशिका"
    },

    // Disclaimers Banner
    disclaimers: {
      heading: "अनिवार्य कानूनी एवं परिचालन अस्वीकरण",
      zeroKnowledge: "शून्य-ज्ञान वास्तुकला: सभी SHA-256 चेकसम और मेटाडेटा गणनाएँ केवल आपके स्थानीय वेब ब्राउज़र में की जाती हैं। कोई भी फ़ोटो, वीडियो या स्क्रीनशॉट किसी बाहरी सर्वर पर प्रेषित नहीं होता।",
      noAuthenticityClaim: "छवि प्रामाणिकता का कोई दावा नहीं: नारीसुरक्षा AI यह प्रमाणित नहीं करता कि कोई छवि वास्तविक है या डीपफ़ेक प्रतिशत का दावा नहीं करता। यह केवल आधिकारिक जांच हेतु साक्ष्यों का संरचित संकलन प्रदान करता है।",
      noAutoFir: "स्वतः पुलिस FIR दर्ज नहीं होती: यह प्लेटफ़ॉर्म स्वचालित रूप से FIR दर्ज नहीं करता। यह भारतीय साक्ष्य अधिनियम/BSA की धारा 65B के अनुरूप एक मानकीकृत साक्ष्य डॉसियर तैयार करता है जिसे cybercrime.gov.in पर जमा किया जा सकता है।",
      emergencyHelpline: "आपातकालीन हेल्पलाइन: राष्ट्रीय साइबर अपराध: 1930 | महिला हेल्पलाइन: 1091 | आपातकालीन: 112"
    },

    // Module 1: Intake Wizard
    intake: {
      step1Title: "दुर्व्यवहार का वर्गीकरण",
      step1Desc: "डिजिटल दुर्व्यवहार की मुख्य श्रेणी का चयन करें।",
      categoryLabel: "प्राथमिक दुर्व्यवहार श्रेणी",
      categories: {
        morphedNudity: "मॉर्फ्ड / डीपफ़ेक अश्लील तस्वीरें (बिना सहमति)",
        extortionBlackmail: "सेक्सटॉर्शन एवं धन उगाही / ब्लैकमेल",
        impersonationProfile: "फ़ेक / प्रतिरूपण प्रोफ़ाइल और बदनामी",
        nonConsensualSharing: "निजी तस्वीरों का अनधिकृत प्रसार (NCII)",
        doxxingHarassment: "डॉक्सिंग, व्यक्तिगत जानकारी लीक एवं उत्पीड़न"
      },
      severityLabel: "खतरे का स्तर",
      severityOptions: {
        critical: "अत्यंत गंभीर (सक्रिय ब्लैकमेल / समय सीमा चल रही है)",
        high: "गंभीर (तस्वीरें पहले ही पोस्ट या ग्रुप्स में भेजी जा चुकी हैं)",
        medium: "मध्यम (निजी धमकी मिली है; अभी सार्वजनिक नहीं हुई)"
      },

      step2Title: "लक्षित डिजिटल प्लेटफ़ॉर्म",
      step2Desc: "उन सभी प्लेटफ़ॉर्मों को चुनें जहाँ उत्पीड़न या धमकी दी गई।",
      platformsLabel: "प्लेटफ़ॉर्म चुनें (एकाधिक चयन संभव)",
      platformOther: "अन्य प्लेटफ़ॉर्म / फ़ोरम",

      step3Title: "अपराधी का डिजिटल पहचानकर्ता",
      step3Desc: "अपराधी के ज्ञात यूज़रनेम, प्रोफ़ाइल लिंक, फ़ोन नंबर या पैसे की मांग दर्ज करें।",
      perpetratorHandle: "अपराधी का यूज़रनेम / हैंडल",
      perpetratorHandlePlaceholder: "उदा. @darkshadow_anon या +91 98XXX XXXXX",
      profileUrl: "अपराधी का प्रोफ़ाइल URL या चैनल लिंक",
      profileUrlPlaceholder: "उदा. https://instagram.com/fake_id या https://t.me/channel_name",
      extortionDemand: "धन या अन्य मांग का विवरण (यदि लागू हो)",
      extortionDemandPlaceholder: "उदा. UPI द्वारा ₹25,000 की मांग या कॉलेज ग्रुप में भेजने की धमकी",
      contactMethod: "पहला संपर्क माध्यम",

      step4Title: "घटना का संपूर्ण विवरण",
      step4Desc: "घटनाओं का कालक्रमानुसार वस्तुनिष्ठ विवरण दें। चैट कभी न हटाएं।",
      narrativeLabel: "साइबर सेल अधिकारियों हेतु औपचारिक विवरण",
      narrativePlaceholder: "स्पष्ट रूप से बताएं: आपको पहली बार कब पता चला? अपराधी ने कैसे संपर्क किया? किन मूल तस्वीरों का उपयोग किया गया? क्या उन्होंने तस्वीरें फैलाने की धमकी दी?",
      generateAiSummary: "संरचित पुलिस विवरण का प्रारूप तैयार करें",
      wordCount: "शब्द",

      buttons: {
        next: "अगला चरण",
        back: "पिछला चरण",
        complete: "विवरण पूर्ण करें",
        completed: "शिकायत विवरण पूर्ण"
      }
    },

    // Module 2: Checklist
    checklist: {
      title: "साक्ष्य अखंडता एवं संरक्षण चेकलिस्ट",
      subtitle: "भारतीय साक्ष्य अधिनियम / BSA की धारा 65B के तहत अदालत में स्वीकार्यता हेतु आवश्यक तकनीकी नियम",
      progressLabel: "साक्ष्य तैयारी स्कोर",
      items: [
        {
          id: "clock",
          title: "सिस्टम घड़ी और तारीख दिखाई दे रही है",
          desc: "पूरा स्क्रीनशॉट जिसमें डिवाइस का स्टेटस बार/घड़ी, तारीख और बैटरी प्रतिशत स्पष्ट दिखे।",
          tip: "स्क्रीनशॉट को कभी क्रॉप न करें! क्रॉप किए गए स्क्रीनशॉट को अदालत में चुनौती दी जा सकती है।"
        },
        {
          id: "url",
          title: "पूरा प्रोफ़ाइल URL और यूज़र ID सुरक्षित है",
          desc: "केवल स्क्रीन नाम नहीं, बल्कि ब्राउज़र का पूरा स्थायी URL या संख्यात्मक यूज़र ID रिकॉर्ड किया गया है।",
          tip: "यूज़रनेम कभी भी बदला जा सकता है, स्थायी URL से वास्तविक पहचान सुनिश्चित होती है।"
        },
        {
          id: "baseline",
          title: "मूल बिना-छेड़छाड़ वाली तस्वीर सुरक्षित रखी है",
          desc: "जिस मूल तस्वीर से छेड़छाड़ कर मॉर्फ्ड मीडिया बनाया गया, उसकी मूल फ़ाइल तुलना हेतु सुरक्षित है।",
          tip: "मूल तस्वीर और मॉर्फ्ड तस्वीर की तुलना से धोखाधड़ी आसानी से सिद्ध हो जाती है।"
        },
        {
          id: "dmThread",
          title: "पूरी चैट हिस्ट्री सुरक्षित रखी गई है",
          desc: "बातचीत का कोई हिस्सा डिलीट नहीं किया गया और ग्रुप से एग्जिट करने से पहले बैकअप ले लिया गया है।",
          tip: "चैट को '.txt' में एक्सपोर्ट करें और ओवरलैपिंग स्क्रीनशॉट लें।"
        },
        {
          id: "noPayment",
          title: "ब्लैकमेलर को कभी कोई पैसा नहीं दिया",
          desc: "यह पुष्टि की जाती है कि ब्लैकमेलर को कोई पैसा नहीं भेजा गया है।",
          tip: "पैसा देने से ब्लैकमेल कभी बंद नहीं होता; वे बार-बार पैसे मांगते हैं।"
        }
      ]
    },

    // Module 3: Evidence Vault
    vault: {
      title: "शून्य-ज्ञान क्रिप्टोग्राफ़िक साक्ष्य वॉल्ट",
      subtitle: "अपने ब्राउज़र में सुरक्षित रूप से SHA-256 हैश निकालें। फ़ाइलें कभी भी इस डिवाइस से बाहर नहीं जातीं।",
      dropTitle: "साक्ष्य फ़ाइलें यहाँ खींचें और छोड़ें, या चुनने के लिए क्लिक करें",
      dropHint: "PNG, JPG, MP4, PDF समर्थित। Web Crypto API द्वारा क्लाइंट-साइड हैशिंग।",
      privacyNotice: "🔒 केवल क्लाइंट-साइड: फ़ाइलें आपकी मेमोरी में रहती हैं। कोई सर्वर अपलोड नहीं।",
      tableTitle: "क्रिप्टोग्राफ़िक साक्ष्य सूची (SHA-256 मेनिफ़ेस्ट)",
      thName: "साक्ष्य फ़ाइल",
      thHash: "SHA-256 चेकसम",
      thSize: "आकार",
      thTime: "समय",
      thPlatform: "प्लेटफ़ॉर्म / टैग",
      thActions: "क्रियाएँ",
      copyHash: "SHA-256 कॉपी करें",
      hashCopied: "कॉपी हो गया!",
      previewBtn: "पूर्वावलोकन देखें",
      removeBtn: "हटाएँ",
      addSampleBtn: "काल्पनिक साक्ष्य जोड़ें",
      baselineTag: "मूल फ़ोटो (Baseline)",
      morphedTag: "मॉर्फ्ड दुर्व्यवहार",
      extortionTag: "ब्लैकमेल धमकी",
      noFiles: "अभी तक कोई साक्ष्य फ़ाइल नहीं जोड़ी गई है।"
    },

    // Module 4: Timeline
    timeline: {
      title: "घटनाओं का कालक्रमानुसार क्रम (Timeline)",
      subtitle: "जांच अधिकारियों हेतु संपर्क, धमकी और साक्ष्य संकलन का अकाट्य कालक्रम तैयार करें।",
      addEventBtn: "नई घटना जोड़ें",
      dateLabel: "तारीख और समय",
      eventTitleLabel: "घटना का शीर्षक",
      eventDescLabel: "विस्तृत विवरण",
      linkedEvidenceLabel: "जुड़ा हुआ साक्ष्य हैश",
      saveBtn: "सुरक्षित करें",
      cancelBtn: "रद्द करें",
      noEvents: "अभी तक कोई घटना दर्ज नहीं है। संपर्क, धमकी और शिकायत के मुख्य पड़ाव जोड़ें।"
    },

    // Module 5: Takedowns
    takedowns: {
      title: "प्लेटफ़ॉर्म टेकडाउन और खाता सुरक्षा गाइड",
      subtitle: "मॉर्फ्ड तस्वीरों को इंटरनेट से हटवाने और अपने खातों को सुरक्षित करने के सत्यापित कदम।",
      emergencyLockdownTitle: "🚨 आपातकालीन 3-चरणीय सुरक्षा लॉकडाउन (तुरंत करें)",
      step1: "1. सभी सक्रिय सत्र समाप्त करें (अज्ञात डिवाइस से लॉग आउट करें)",
      step1Desc: "सेटिंग्स > सुरक्षा > जहाँ आप लॉग इन हैं > वर्तमान डिवाइस को छोड़कर बाकी सभी सत्र बंद करें।",
      step2: "2. टू-फ़ैक्टर ऑथेंटिकेशन (2FA) ऐप सक्षम करें",
      step2Desc: "SMS OTP की जगह Google Authenticator का उपयोग करें (ताकि सिम स्वैपिंग से बचा जा सके)।",
      step3: "3. अकाउंट को प्राइवेट करें और मैसेज रिक्वेस्ट सीमित करें",
      step3Desc: "प्रोफ़ाइल को प्राइवेट करें, टैग और मेंशन केवल अपने संपर्कों तक सीमित करें।",
      stopNciiTitle: "StopNCII.org वैश्विक हैश सुरक्षा गाइड",
      stopNciiDesc: "StopNCII.org आपकी डिवाइस पर ही आपकी तस्वीर का डिजिटल फ़िंगरप्रिंट (हैश) बनाता है। केवल हैश कोड प्रमुख प्लेटफ़ॉर्मों (Meta, TikTok आदि) से साझा होता है ताकि इसे दोबारा अपलोड होने से रोका जा सके—तस्वीर कभी आपका फ़ोन नहीं छोड़ती।"
    },

    // Module 6: Sahayak AI Chat
    sahayak: {
      title: "द्विभाषी AI सहायक (कानूनी एवं परामर्श साथी)",
      subtitle: "भारतीय साइबर कानून और पीड़ित सुरक्षा प्रोटोकॉल पर आधारित त्वरित, संवेदनशील सहायता।",
      inputPlaceholder: "साइबर कानून, टेकडाउन प्रक्रिया या रिपोर्टिंग के बारे में कुछ भी पूछें...",
      sendBtn: "सहायक से पूछें",
      thinking: "सहायक कानूनी प्रावधानों का विश्लेषण कर रहा है...",
      presetChips: [
        "फ़ेक इंस्टाग्राम प्रोफ़ाइल कैसे हटवाएं?",
        "आईटी एक्ट धारा 67A में क्या सजा का प्रावधान है?",
        "cybercrime.gov.in पर अज्ञात शिकायत कैसे दर्ज करें?",
        "ब्लैकमेलर पैसे मांग रहा है। मुझे क्या करना चाहिए?",
        "धारा 65B प्रमाण पत्र क्या होता है और इसकी क्या आवश्यकता है?",
        "StopNCII.org मेरी तस्वीरों की सुरक्षा कैसे करता है?"
      ]
    },

    // Module 7: PDF Dossier
    dossier: {
      modalTitle: "न्यायालय-अनुरूप साक्ष्य डॉसियर पूर्वावलोकन",
      modalSubtitle: "धारा 65B के अनुरूप cybercrime.gov.in पर औपचारिक जमा करने हेतु तैयार दस्तावेज़",
      downloadPdf: "आधिकारिक PDF डॉसियर डाउनलोड करें",
      closeBtn: "पूर्वावलोकन बंद करें",
      filingReminderTitle: "राष्ट्रीय साइबर अपराध पोर्टल पर शिकायत दर्ज करने के निर्देश",
      filingStep1: "1. https://cybercrime.gov.in पर जाएँ और 'Report Women / Children Related Crime' पर क्लिक करें।",
      filingStep2: "2. पहचान गोपनीय रखने के लिए 'Report Anonymously' या FIR ट्रैक करने के लिए 'Report & Track' चुनें।",
      filingStep3: "3. डाउनलोड की गई इस PDF डॉसियर को शिकायत फ़ॉर्म में मुख्य तकनीकी अनुलग्नक के रूप में संलग्न करें।",
      filingStep4: "4. त्वरित पुलिस कार्रवाई के लिए संदर्भ संख्या के साथ 1930 पर कॉल करें।"
    }
  }
};
