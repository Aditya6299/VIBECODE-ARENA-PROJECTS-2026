import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  CreditCard, 
  PhoneCall, 
  AlertOctagon, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  Building2, 
  Clock, 
  ShieldAlert, 
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const UpiExtortionAnalyzer = () => {
  const { lang, t, showToast } = useCase();

  const [threatText, setThreatText] = useState('');
  const [analysis, setAnalysis] = useState(null);

  // Bank handles lookup dictionary
  const bankHandles = {
    'ybl': { name: 'Yes Bank', nodalEmail: 'nodal.officer@yesbank.in' },
    'ibl': { name: 'IndusInd Bank', nodalEmail: 'nodal.officer@indusind.com' },
    'oksbi': { name: 'State Bank of India', nodalEmail: 'nodal.officer@sbi.co.in' },
    'sbi': { name: 'State Bank of India', nodalEmail: 'nodal.officer@sbi.co.in' },
    'okhdfcbank': { name: 'HDFC Bank', nodalEmail: 'nodal.officer@hdfcbank.com' },
    'hdfc': { name: 'HDFC Bank', nodalEmail: 'nodal.officer@hdfcbank.com' },
    'okicici': { name: 'ICICI Bank', nodalEmail: 'nodal.officer@icicibank.com' },
    'icici': { name: 'ICICI Bank', nodalEmail: 'nodal.officer@icicibank.com' },
    'okaxis': { name: 'Axis Bank', nodalEmail: 'nodal.officer@axisbank.com' },
    'axl': { name: 'Axis Bank', nodalEmail: 'nodal.officer@axisbank.com' },
    'paytm': { name: 'Paytm Payments Bank', nodalEmail: 'nodal.officer@paytmbank.com' },
    'barodampay': { name: 'Bank of Baroda', nodalEmail: 'nodal.officer@bankofbaroda.com' },
    'pnb': { name: 'Punjab National Bank', nodalEmail: 'nodal.officer@pnb.co.in' }
  };

  // Load simulated threat message for judging / testing
  const loadDemoThreat = () => {
    const demo = `You have 2 hours to send ₹25,000 to extortion_handler99@ybl or your morphed private photos will be posted on Instagram and sent to your college group. Don't block this number +91 98765 43210. Deadline 6:00 PM today!`;
    setThreatText(demo);
    analyzeText(demo);
  };

  // Real-time forensic parser
  const analyzeText = (text) => {
    if (!text.trim()) {
      setAnalysis(null);
      return;
    }

    // 1. UPI ID Regex
    const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/g;
    const upiMatches = text.match(upiRegex) || [];

    // 2. Amount Regex (₹ or Rs or INR followed by numbers)
    const amountRegex = /(?:₹|rs\.?|inr|\$)\s*([\d,]+(?:\.\d{2})?)/gi;
    const amountMatches = [];
    let match;
    while ((match = amountRegex.exec(text)) !== null) {
      amountMatches.push(match[0]);
    }

    // 3. Indian Phone numbers (+91 or 10-digit mobile)
    const phoneRegex = /(?:\+91[\s-]?)?[6789]\d{9}/g;
    const phoneMatches = text.match(phoneRegex) || [];

    // 4. IFSC code Regex
    const ifscRegex = /[A-Z]{4}0[A-Z0-9]{6}/g;
    const ifscMatches = text.match(ifscRegex) || [];

    // 5. Urgency / Deadline Keywords
    const hasDeadline = /hour|minute|today|deadline|urgently|घंटे|समय|तुरंत/i.test(text);

    // Map UPI handles to banks
    const parsedUpis = upiMatches.map(vpa => {
      const parts = vpa.split('@');
      const suffix = parts[1]?.toLowerCase();
      const bankInfo = bankHandles[suffix] || { name: 'Unknown / Multi-bank PSP', nodalEmail: 'contact cybercell 1930' };
      return {
        vpa,
        bankName: bankInfo.name,
        nodalEmail: bankInfo.nodalEmail
      };
    });

    setAnalysis({
      upis: parsedUpis,
      amounts: amountMatches,
      phones: phoneMatches,
      ifscs: ifscMatches,
      hasDeadline,
      rawText: text
    });
  };

  // Generate 1930 Account Freezing Request Script
  const generate1930Script = () => {
    if (!analysis) return '';

    const upiList = analysis.upis.map(u => `${u.vpa} (${u.bankName})`).join(', ') || 'Mentioned in statement';
    const amountList = analysis.amounts.join(', ') || 'Demanded without fixed quote';
    const phoneList = analysis.phones.join(', ') || 'Not explicitly provided';

    return `EMERGENCY 1930 ACCOUNT FREEZING SCRIPT:
"Hello Officer, I am reporting an active cyber extortion and deepfake abuse case under Section 67A IT Act.
The perpetrator is blackmailing me for ransom: ${amountList}.
Beneficiary UPI Handle to freeze: ${upiList}
Perpetrator Contact: ${phoneList}
I have already generated a cryptographically hashed Section 65B Evidence Dossier on NariSuraksha AI.
Please immediately coordinate with the beneficiary bank's nodal officer to freeze incoming credits to this UPI handle under the National Cybercrime Portal MHA protocol."`;
  };

  const copyScript = () => {
    navigator.clipboard.writeText(generate1930Script());
    showToast('1930 Emergency Script copied to clipboard.');
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-teal-400 p-0.5 flex items-center justify-center shadow-glow-teal">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{lang === 'hi' ? 'फिरौती वित्तीय विश्लेषण एवं बैंक फ्रीज़ टूल' : 'Extortion Financial Intelligence & Bank Freeze Parser'}</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono">
                Helpline 1930 Protocol
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'hi'
                ? 'ब्लैकमेल मैसेज से तुरंत UPI ID, बैंक और फिरौती राशि निकालें तथा 1930 फ्रीज़ अनुरोध तैयार करें।'
                : 'Extract suspect UPI handles, beneficiary banks, and extortion amounts to freeze accounts via helpline 1930.'}
            </p>
          </div>
        </div>

        <button
          onClick={loadDemoThreat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{lang === 'hi' ? 'डेमो फिरौती मैसेज लोड करें' : 'Load Demo Extortion Threat'}</span>
        </button>
      </div>

      {/* Input Textarea */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>{lang === 'hi' ? 'धमकी भरा मैसेज या चैट यहाँ पेस्ट करें:' : 'Paste Extortion Message / Threat Chat Here:'}</span>
          <span className="text-[10px] text-slate-500 font-mono">Auto-extracts UPI, IFSC, Phone & Amounts</span>
        </label>
        <textarea
          rows={3}
          value={threatText}
          onChange={(e) => {
            setThreatText(e.target.value);
            analyzeText(e.target.value);
          }}
          placeholder={lang === 'hi' ? 'उदाहरण: "2 घंटे में ₹25,000 fraudster@ybl पर भेजो वरना तस्वीरें वायरल कर देंगे..."' : 'e.g., "Send ₹25,000 to fraudster@ybl in 2 hours or your pictures will be posted..."'}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal transition-colors"
        />
      </div>

      {/* Analysis Output */}
      {analysis && (
        <div className="space-y-4 animate-fade-in">
          {/* Extracted Intelligence Chips Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {/* 1. UPI Handles */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Extracted UPI / VPA</span>
              {analysis.upis.length > 0 ? (
                analysis.upis.map((u, i) => (
                  <div key={i} className="font-mono font-bold text-amber-300 truncate" title={u.vpa}>
                    {u.vpa}
                  </div>
                ))
              ) : (
                <span className="text-slate-500 italic">None detected</span>
              )}
            </div>

            {/* 2. Beneficiary Bank */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Beneficiary Bank</span>
              {analysis.upis.length > 0 ? (
                analysis.upis.map((u, i) => (
                  <div key={i} className="font-semibold text-emerald-300 truncate">
                    {u.bankName}
                  </div>
                ))
              ) : (
                <span className="text-slate-500 italic">Bank unknown</span>
              )}
            </div>

            {/* 3. Ransom Demand */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Demanded Ransom</span>
              {analysis.amounts.length > 0 ? (
                <span className="font-mono font-bold text-rose-400">
                  {analysis.amounts.join(', ')}
                </span>
              ) : (
                <span className="text-slate-500 italic">No amount tagged</span>
              )}
            </div>

            {/* 4. Phone Number */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Suspect Contact</span>
              {analysis.phones.length > 0 ? (
                <span className="font-mono font-semibold text-slate-200">
                  {analysis.phones.join(', ')}
                </span>
              ) : (
                <span className="text-slate-500 italic">None tagged</span>
              )}
            </div>
          </div>

          {/* Golden Rule Banner */}
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs flex items-center gap-2 text-rose-300">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span><strong>Strict Rule:</strong> Never send any funds. Paying will guarantee follow-up extortion demands. Report this UPI immediately to 1930.</span>
          </div>

          {/* Helpline 1930 Call Script Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'hi' ? '1930 साइबर हेल्पलाइन पर बोलने हेतु तैयार स्क्रिप्ट:' : 'Prepared Script for Calling National Cyber Helpline 1930:'}</span>
              </span>
              <button
                onClick={copyScript}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-tealLight text-[11px] font-semibold border border-slate-700 flex items-center gap-1 transition-all"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Script</span>
              </button>
            </div>

            <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
              {generate1930Script()}
            </pre>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-400">
                Cyber cells coordinate directly with bank nodal officers to freeze suspect bank accounts.
              </span>
              <a
                href="tel:1930"
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-glow-teal"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Helpline 1930 Now</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
