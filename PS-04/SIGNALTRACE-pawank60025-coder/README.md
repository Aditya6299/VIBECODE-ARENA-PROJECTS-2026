# SIGNALTRACE

**See through the scam.** A client-only phishing and cyber-fraud forensics MVP for PS4 — Cybersecurity Verification and Awareness Tool.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local address Vite prints (usually `http://localhost:5173/`). On systems where `npm` runs normally, `npm install` and `npm run dev` are equivalent.

## Checks

```powershell
npm.cmd test
npm.cmd run build
```

### Verification (24 October 2026)

- Local `npm.cmd test` after the disclaimer-prefix fix: **17 passed, 0 failed**. This includes four new phishing-request regression tests.
- Local `npm.cmd run build`: **passed** with Vite's production build.
- Independent Antigravity QA before this targeted fix reported **16 browser E2E tests passed** and **19/19 PS4 requirements covered**. Those browser results are separate from the local unit tests and have not been rerun for this fix.

## Features

- Analyze email, SMS, URL strings, and screenshots. Screenshot OCR uses Tesseract.js in the browser. Text can always be pasted or corrected manually.
- Explore unique rule indicators, capped score contributions, highlighted evidence, recommendations, and Fraud DNA stages.
- Load three clearly fictional training cases using reserved domains.
- Create local mock incident reports, view details and status, and delete them. Report status can be changed only inside **Admin Demo**.
- Read micro-lessons and action plans, including India’s official [cybercrime reporting portal](https://cybercrime.gov.in/) and 1930 financial cyber fraud helpline.
- Load fictional local demo incidents to explore counts, distributions, and indicator frequencies.

## Detection model and limits

`src/lib/analyzer.js` exports pure `analyzeMessage(input)`. It parses addresses as inert text; it never fetches, navigates to, or checks a submitted URL. It checks exact approved fictional hostnames and their true subdomains. A string such as `bank.example.com.attacker.test` is not approved as `bank.example.com`. Its small fictional allowlist is illustrative, not a public suffix list or a comprehensive brand registry. Scores are the sum of unique indicator weights, capped at 100. HTTPS is not treated as proof of legitimacy, and short links alone are a review signal. There is no live reputation lookup, redirect inspection, sender authentication, or threat intelligence. False positives and missed threats are possible.

**Automated risk assessments are guidance, not proof that a message is safe or fraudulent.**

## Privacy and Admin Demo

All processing and storage are client-side. Raw analyzed messages, uploaded images, passwords, and OTPs are not automatically stored. Reports save category, a user-written description, score, indicator IDs, timestamp, and simulated status. Optional, separately entered redacted evidence is saved only after explicit consent. Avoid entering real secrets anywhere in a demo. Screenshot OCR may load its language data in the browser; if unavailable, manual text entry remains usable. Clearing browser storage removes local reports.

**Admin Demo is a client-only prototype with no authentication and no genuine administrator access control.** Its analytics use only local reports and optional fictional seed records. Status values are simulated and are not official case tracking. SIGNALTRACE does not file complaints, contact 1930, or send reports to any service. Users must make official complaints themselves.
