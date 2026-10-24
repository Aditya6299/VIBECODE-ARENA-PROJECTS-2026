import React from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  Clock, 
  Link, 
  Image as ImageIcon, 
  MessageSquare, 
  Ban, 
  AlertTriangle,
  ArrowRight,
  Info
} from 'lucide-react';

export const EvidenceChecklist = () => {
  const { t, lang, checklist, toggleChecklistItem, setActiveTab } = useCase();

  const iconMap = {
    clock: Clock,
    url: Link,
    baseline: ImageIcon,
    dmThread: MessageSquare,
    noPayment: Ban
  };

  const totalItems = t.checklist.items.length;
  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const percentage = Math.round((checkedCount / totalItems) * 100);

  const getReadinessColor = (pct) => {
    if (pct === 100) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (pct >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      {/* Header & Readiness Gauge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-tealLight" />
            <span>{t.checklist.title}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {t.checklist.subtitle}
          </p>
        </div>

        {/* Readiness Meter */}
        <div className="flex items-center gap-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">
              {t.checklist.progressLabel}
            </span>
            <span className="text-lg font-bold font-mono text-white">
              {checkedCount} / {totalItems} <span className="text-xs text-slate-400 font-sans font-normal">({percentage}%)</span>
            </span>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${getReadinessColor(percentage)}`}>
            {percentage === 100 
              ? (lang === 'hi' ? 'कोर्ट-स्वीकार्य (उत्कृष्ट)' : 'Court Admissible') 
              : percentage >= 60 
                ? (lang === 'hi' ? 'मध्यम तैयारी' : 'Moderate Readiness') 
                : (lang === 'hi' ? 'अपूर्ण साक्ष्य' : 'Incomplete Evidence')}
          </div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-3.5">
        {t.checklist.items.map(item => {
          const isChecked = !!checklist[item.id];
          const Icon = iconMap[item.id] || CheckSquare;

          return (
            <div
              key={item.id}
              onClick={() => toggleChecklistItem(item.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isChecked
                  ? 'bg-slate-900/90 border-brand-teal/50 shadow-sm'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  type="button"
                  className="mt-0.5 text-brand-tealLight focus:outline-none"
                  aria-label="Toggle item"
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-brand-tealLight" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-xs font-semibold flex items-center gap-2 ${
                      isChecked ? 'text-white' : 'text-slate-300'
                    }`}>
                      <Icon className={`w-4 h-4 ${isChecked ? 'text-brand-tealLight' : 'text-slate-500'}`} />
                      {item.title}
                    </span>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isChecked 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isChecked ? (lang === 'hi' ? 'सत्यापित' : 'VERIFIED') : (lang === 'hi' ? 'लंबित' : 'PENDING')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Forensic tip */}
                  <div className="mt-2 text-[11px] text-amber-300/80 bg-amber-950/20 px-2.5 py-1 rounded-md border border-amber-500/20 flex items-center gap-1.5">
                    <Info className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    <span><strong>{lang === 'hi' ? 'जांच सलाह:' : 'Forensic Tip:'}</strong> {item.tip}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action banner */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-brand-tealLight" />
          <span>
            {lang === 'hi' 
              ? 'साक्ष्य फ़ाइलों को डिजिटल रूप से हैश करने हेतु क्रिप्टोग्राफ़िक वॉल्ट में जाएँ।' 
              : 'Proceed to the Zero-Knowledge Vault to compute client-side SHA-256 hashes.'}
          </span>
        </p>

        <button
          onClick={() => setActiveTab('vault')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-teal hover:bg-teal-500 text-slate-950 font-bold text-xs transition-all shadow-glow-teal hover:scale-[1.02]"
        >
          <span>{lang === 'hi' ? 'क्रिप्टोग्राफ़िक वॉल्ट खोलें' : 'Go to Evidence Vault'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
