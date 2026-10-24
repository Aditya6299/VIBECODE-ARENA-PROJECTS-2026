# NariSuraksha AI (नारीसुरक्षा AI)
### Morphed Image Abuse Reporting & Forensic Evidence Dossier Assistant
**Designed for Problem Statement 3: Morphed Image Abuse Reporting Assistant**

[![Architecture: Zero-Knowledge](https://img.shields.io/badge/Architecture-Zero--Knowledge%20Evidence-0D9488?style=flat-square)](https://github.com)
[![Legal Standard: Section 65B](https://img.shields.io/badge/Legal%20Standard-IEA%20Sec%2065B%20%2F%20BSA%20Sec%2063-6366F1?style=flat-square)](https://cybercrime.gov.in)
[![Bilingual: English & Hindi](https://img.shields.io/badge/Languages-English%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%82%E0%A4%A6%E0%A4%BE%20(Devanagari)-10B981?style=flat-square)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](LICENSE)

---

## 🌟 Executive Summary

**NariSuraksha AI** is a production-grade, privacy-first sovereign web application specifically engineered to assist victims of non-consensual altered/morphed imagery, deepfake extortion, and malicious online harassment. 

By unifying client-side cryptographic hashing, procedural evidence checklists, platform-specific de-indexing playbooks, and an empathetic bilingual AI triage engine, NariSuraksha AI bridges the critical gap between digital victimization and formal prosecution on the **National Cyber Crime Reporting Portal (cybercrime.gov.in)**.

---

## ⚖️ Strict Domain & Legal Constraints (Mandatory Compliance)

1. **Zero-Knowledge Evidence Architecture**: 
   The platform **never** transmits, uploads, or stores photos, videos, or screenshots on any remote server or backend. All cryptographic checksums (SHA-256) and metadata extractions are computed exclusively inside the client browser sandbox via the native `window.crypto.subtle.digest('SHA-256', buffer)` Web Crypto API.
2. **No Image Authenticity Claims**:
   The platform explicitly disclaims that it does **not** verify whether an image is authentic or generate deepfake certainty scores. Its sole mandate is objective, chronological evidence cataloging and legal dossier packaging for forensic analysis by accredited cyber investigators.
3. **No Autonomous FIR Filing**:
   The platform does **not** automatically file an official First Information Report (FIR) or police complaint. Instead, it generates a court-admissible Section 65B-compliant Evidence Dossier for the victim to submit directly to `https://cybercrime.gov.in` or local cyber crime cells.
4. **Bilingual Support (English & Hindi)**:
   Full dynamic language support across all interfaces, intake forms, checklists, guides, chat triage, and export notices in both English and Hindi (Devanagari script).
5. **Fictional Case Simulator**:
   Includes a persistent **"Load Simulated Demo Case"** button that instantly preloads realistic, sanitized fictional records for seamless judging, review, and demonstration.
6. **Emergency Quick Exit**:
   A high-visibility "Quick Exit" pill and global listener for the `Escape` key that instantly purges all session storage, revokes object URLs, and immediately redirects the browser to `https://news.google.com`.

---

## 🏛️ System Architecture

The application is engineered with a clean, decoupled two-tier architecture:

```
vibecode/
├── backend/                  # Lightweight Node.js / Express microservice
│   ├── package.json          # express, cors, dotenv
│   ├── server.js             # Health checks & simulated reporting endpoint
│   └── .env.example
├── frontend/                 # React 18 + Vite SPA
│   ├── index.html            # Dark-mode HTML with Inter & JetBrains fonts
│   ├── package.json          # React, Framer Motion, Tailwind, Lucide, jsPDF
│   ├── vite.config.js        # Port 5173 with /api proxy to 5000
│   ├── tailwind.config.js    # Obsidian & Emerald high-trust color scheme
│   └── src/
│       ├── main.jsx          # React DOM entrypoint
│       ├── App.jsx           # App layout & module switcher
│       ├── index.css         # Glassmorphism & custom glow scrollbars
│       ├── context/
│       │   └── CaseContext.jsx  # Sovereign state management & ESC listener
│       ├── data/
│       │   ├── demoCaseData.js     # Fictional case simulator records
│       │   ├── statutoryClauses.js # IT Act 66E, 67, 67A; BNS 78, 79
│       │   ├── platformGuides.js   # Instagram, Telegram, X, StopNCII.org
│       │   └── translations.js     # Full English & Hindi dictionaries
│       ├── components/
│       │   ├── Header.jsx          # Navigation, trust badge, language switcher
│       │   ├── PanicBar.jsx        # Sticky panic strip & ESC shortcut
│       │   ├── LegalDisclaimerBanner.jsx # Prominent legal constraints banner
│       │   ├── IntakeWizard/       # 4-step structured intake & validation
│       │   ├── EvidenceChecklist/  # 5-point court integrity checklist
│       │   ├── EvidenceVault/      # Zero-knowledge client-side SHA-256 hasher
│       │   ├── Timeline/           # Interactive vertical event sequence
│       │   ├── TakedownGuides/     # Verified takedown steps & 3-step lockdown
│       │   ├── SahayakChat/        # Bilingual conversational triage engine
│       │   └── DossierExport/      # Section 65B Court-Ready PDF Generator
│       └── utils/
│           ├── cryptoUtils.js      # Web Crypto API SHA-256 & byte formatters
│           └── formatters.js
├── launch.command            # Native macOS executable auto-launcher
└── README.md
```

---

## 🚀 Instant Launch (macOS Native Launcher)

To launch the complete application with zero configuration:

### Method 1: Double-Click from Finder
Simply double-click the `launch.command` file in Finder.

### Method 2: From Terminal
```bash
cd /Users/omkarde/Desktop/vibecode
./launch.command
```

The script will automatically:
1. Verify Node.js and npm installations.
2. Install dependencies for backend and frontend if not present.
3. Concurrently spawn the Express backend on port `5000` and Vite frontend on port `5173`.
4. Poll `http://localhost:5173` until active.
5. Automatically open the application in your default web browser (`open http://localhost:5173`).
6. Cleanly intercept `Ctrl+C` to terminate both background subshells on exit.

---

## 🛠️ Manual Execution (Optional)

If running in separate terminal windows:

### 1. Backend Service
```bash
cd backend
npm install
# Optional: add your free Google Gemini API key or Groq API key to .env
# GEMINI_API_KEY=AIzaSy... (Free from https://aistudio.google.com)
# GROQ_API_KEY=gsk_... (Free from https://console.groq.com/keys)
npm start
# Runs on http://localhost:5001 (or 5000)
# Health check: http://localhost:5001/api/health
```

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🤖 Dual-Tier AI Assistant (Free Gemini / Groq + Sovereign Fallback)

The AI Assistant (**Sakhi & Sahayak**) features an enterprise dual-tier architecture:

1. **Free Generative LLM Integration (Google Gemini 1.5 Flash / Groq Llama 3.3)**:
   - Connect any 100% Free API key directly via the in-app **"Free AI Key"** modal or in `backend/.env`.
   - **Google Gemini Free Tier**: Obtainable in 30 seconds at [Google AI Studio](https://aistudio.google.com/app/apikey) (15 requests/minute, zero cost, no credit card required).
   - **Groq Cloud Free Tier**: Obtainable at [Groq Console](https://console.groq.com/keys) (500 tokens/sec, zero cost).
   - In-app **"Verify & Save Key"** button tests authentication live and confirms active status.

2. **Zero-Latency Sovereign Local Engine**:
   - If no API key is provided, or if the external API is ever rate-limited, Sakhi seamlessly falls back to our embedded sovereign intelligence engine without dropping messages.
   - Fully covers acute panic, 0-rupee extortion rules, StopNCII.org hashing, Rule 3(2)(b) 24-hour removals, Section 65B phone seizure facts, and Section 67A non-bailable legal clauses in both English and Hindi.


---

## 📋 Comprehensive Feature Modules

| Module | Purpose | Legal & Technical Backing |
| :--- | :--- | :--- |
| **Global Safety Bar** | Immediate session wipe and emergency redirect to news.google.com | Global `Escape` key listener & RAM wipe |
| **Silent Panic Word Hook** | Detects emergency typed phrases ("danger now", "खतरा", "मदद") and triggers Quick Exit | In-memory keystroke buffer watcher |
| **Inactivity Auto-Wipe** | 5-minute inactivity countdown with 30-sec animated ring warning | Automatic RAM & session purge for physical safety |
| **AES-256 Encrypted Vault** | Zero-server case persistence across page refreshes via on-device IndexedDB | Web Crypto PBKDF2 (100k iter) + AES-256-GCM |
| **1. Intake Wizard & Voice** | 4-step guided classification, Web Speech API voice dictation (EN & HI) | National Cyber Crime Reporting Standards |
| **2. Evidence Checklist** | 5-point pre-filing technical audit (system clock, URLs, baselines, chat logs, no payment) | Section 65B Indian Evidence Act / Section 63 BSA |
| **3. Zero-Knowledge Vault** | Drag-and-drop file hasher generating SHA-256 digests locally + live re-verification | Web Crypto API `crypto.subtle.digest('SHA-256')` |
| **4. Event Timeline** | Visual chronological vertical sequence with glowing node indicators and hash connections | Indisputable timeline reconstruction for forensic teams |
| **5. Platform Takedowns** | Verified removal guides for Instagram, Telegram, X, StopNCII.org & 3-Step Account Lockdown | Rule 3(2)(b) IT Rules 2021 (24-hour mandatory takedown) |
| **6. Sakhi AI Voice Companion** | Real-time two-way voice dialogue, animated speech orb, audio TTS, & calming breathing pacer | Web Speech API (Voice Recognition & Synthesis) |
| **7. AI Sahayak Assistant** | Compassionate conversational helper with preset chips & streaming legal answers | Grounded in IT Act Sec 66E/67/67A & BNS Sec 78/79 |
| **7. Case Progress Tracker** | 6-milestone completion tracker with dynamic SVG ring & status indicators | Systematic victim documentation roadmap |
| **8. Takedown Tracker** | Platform compliance logs & one-click IT Rules 2021 Rule 3(2)(b) Non-Compliance notices | Loss of Section 79 Intermediary Safe Harbor |
| **9. Witness Statements** | Structured, consent-gated third-party witness accounts for court annexures | Corroborating judicial testimonies |
| **10. Support Directory** | Verified pro-bono NGOs (Cyber Peace, Majlis, iCall) & 16+ State Cyber Crime Police Cells | Nationwide legal and psychological support network |
| **11. Trusted Contact Alert** | Pre-composed confidential alert email with tracking ID & helpline numbers | Zero-media privacy-safe notification |
| **12. Offline-First PWA** | Service worker caching & web app manifest for complete zero-internet offline usage | Local sovereign execution without network tracking |
| **13. Section 65B Dossier** | Compiles formal court-admissible PDF with disclaimers, evidence tables, hashes, and signature block | jsPDF + autoTable court annexure |

---

## 📞 Emergency Cyber & Distress Helplines

- **National Cyber Crime Helpline**: `1930` (Available 24/7 across all states)
- **National Women Helpline**: `1091` / `181`
- **Unified Emergency Response**: `112`
- **National Commission for Women (NCW) WhatsApp**: `+91 72177 35372`
- **Official Reporting Portal**: `https://cybercrime.gov.in`

---

*Designed and engineered with utmost empathy, technical rigor, and zero-knowledge privacy for the safety of all citizens.*
