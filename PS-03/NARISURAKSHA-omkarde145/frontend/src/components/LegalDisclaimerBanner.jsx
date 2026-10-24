import React, { useState } from 'react';
import { useCase } from '../context/CaseContext';
import { ShieldAlert, AlertTriangle, Info, ChevronDown, ChevronUp, Lock } from 'lucide-react';

export const LegalDisclaimerBanner = () => {
  const { t, lang } = useCase();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-3.5 mb-6 shadow-md backdrop-blur-md">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-200">
            {t.disclaimers.heading}
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            • {lang === 'hi' ? 'महत्वपूर्ण कानूनी एवं परिचालन सीमाएं' : 'Zero-Knowledge • Non-Verifying Forensic Packaging • Not Auto-FIR'}
          </span>
        </div>

        <button 
          type="button"
          className="text-xs text-brand-tealLight hover:text-teal-300 flex items-center gap-1 font-medium transition-colors"
        >
          <span>{isExpanded ? (lang === 'hi' ? 'संक्षिप्त करें' : 'Collapse Details') : (lang === 'hi' ? 'विस्तार देखें' : 'View Constraints')}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Brief Summary always visible */}
      {!isExpanded && (
        <div className="mt-2 text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            {lang === 'hi' ? 'शून्य-ज्ञान: कोई फ़ोटो सर्वर पर नहीं जाती' : 'Zero-Knowledge Client Hashing'}
          </span>
          <span className="flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            {lang === 'hi' ? 'डीपफ़ेक सत्यता प्रतिशत दावा नहीं करता' : 'No Authenticity Claims'}
          </span>
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-brand-tealLight" />
            {lang === 'hi' ? 'cybercrime.gov.in हेतु साक्ष्य संकलन' : 'Prepares Dossier for cybercrime.gov.in'}
          </span>
        </div>
      )}

      {/* Expanded Explanations */}
      {isExpanded && (
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? '1. शून्य-ज्ञान वास्तुकला' : '1. Zero-Knowledge Architecture'}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {t.disclaimers.zeroKnowledge}
            </p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-amber-400 font-medium mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? '2. छवि प्रामाणिकता सीमा' : '2. No Authenticity Verification'}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {t.disclaimers.noAuthenticityClaim}
            </p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-brand-tealLight font-medium mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? '3. आधिकारिक शिकायत दर्ज करना' : '3. Standalone Evidence Dossier'}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {t.disclaimers.noAutoFir}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
