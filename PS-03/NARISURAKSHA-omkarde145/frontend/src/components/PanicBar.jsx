import React from 'react';
import { useCase } from '../context/CaseContext';
import { ShieldAlert, LogOut, PhoneCall } from 'lucide-react';

export const PanicBar = () => {
  const { t, lang, executeQuickExit } = useCase();

  return (
    <div className="bg-rose-950/80 border-b border-rose-500/30 text-rose-100 px-4 py-2 text-xs flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-semibold text-rose-300">
          <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
          {lang === 'hi' ? 'आपातकालीन सुरक्षा एवं सहायता' : 'Emergency Safety & Rapid Exit'}
        </span>
        <span className="hidden md:inline-block text-rose-200/70">|</span>
        <span className="hidden md:flex items-center gap-2 text-rose-200/90">
          <PhoneCall className="w-3.5 h-3.5 text-rose-300" />
          <span>{lang === 'hi' ? 'साइबर हेल्पलाइन:' : 'Cyber Helpline:'} <strong>1930</strong></span>
          <span>•</span>
          <span>{lang === 'hi' ? 'महिला हेल्पलाइन:' : 'Women Helpline:'} <strong>1091</strong></span>
          <span>•</span>
          <span>{lang === 'hi' ? 'आपातकालीन:' : 'Emergency:'} <strong>112</strong></span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-block text-[11px] text-rose-300/80">
          {lang === 'hi' ? 'त्वरित निकास हेतु किसी भी समय ' : 'Press '}
          <kbd className="px-1.5 py-0.5 rounded bg-rose-900 border border-rose-700/60 font-mono text-[10px] text-rose-200">ESC</kbd>
          {lang === 'hi' ? ' दबाएँ' : ' anytime to purge session & exit'}
        </span>

        <button
          onClick={executeQuickExit}
          className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-full transition-all shadow-glow-rose hover:scale-[1.02] active:scale-[0.98]"
          title="Instantly wipes memory & redirects to Google News"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t.panicButton}</span>
        </button>
      </div>
    </div>
  );
};
