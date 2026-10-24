import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { platformGuides, emergencyLockdownSteps } from '../../data/platformGuides';
import { 
  ShieldAlert, 
  ExternalLink, 
  Lock, 
  KeyRound, 
  UserCheck, 
  Send, 
  FileWarning, 
  Globe,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Copy
} from 'lucide-react';

export const PlatformTakedowns = () => {
  const { t, lang, showToast } = useCase();
  const [activePlatformId, setActivePlatformId] = useState('instagram');
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleStepDone = (key) => {
    setCompletedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const currentPlatform = platformGuides.find(p => p.id === activePlatformId) || platformGuides[0];

  return (
    <div className="space-y-6">
      {/* Emergency 3-Step Lockdown Card (Top priority) */}
      <div className="glass-card rounded-2xl p-6 border border-rose-500/30 bg-rose-950/10 shadow-xl">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-200">
              {t.takedowns.emergencyLockdownTitle}
            </h3>
            <p className="text-xs text-rose-300/80">
              {lang === 'hi' 
                ? 'हैक या जासूसी की संभावना समाप्त करने के लिए यह तीन कदम अभी उठाएं' 
                : 'Neutralize unauthorized session hijacking immediately before proceeding'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
          {emergencyLockdownSteps.map((step) => {
            const stepKey = `lockdown-${step.step}`;
            const isDone = !!completedSteps[stepKey];

            return (
              <div 
                key={step.step}
                onClick={() => toggleStepDone(stepKey)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isDone 
                    ? 'bg-emerald-950/30 border-emerald-500/40' 
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Step 0{step.step}
                  </span>
                  <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                    isDone ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600'
                  }`}>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <h4 className="text-xs font-semibold text-slate-100 mb-1">
                  {lang === 'hi' ? step.titleHi : step.titleEn}
                </h4>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {lang === 'hi' ? step.descHi : step.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Takedown Tabs */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
        <div className="pb-4 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-brand-tealLight" />
                <span>{t.takedowns.title}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {t.takedowns.subtitle}
              </p>
            </div>

            {/* Statutory 24-hr badge */}
            <div className="px-3 py-1.5 rounded-lg bg-brand-teal/10 border border-brand-teal/30 text-brand-tealLight text-xs font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-tealLight" />
              <span>{lang === 'hi' ? 'आईटी नियम 2021: 24 घंटे में अनिवार्य टेकडाउन' : 'IT Rules 2021: Mandatory 24-Hour Takedown'}</span>
            </div>
          </div>

          {/* Platform Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {platformGuides.map(p => {
              const isActive = activePlatformId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePlatformId(p.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                    isActive 
                      ? 'bg-slate-800 border-brand-teal text-white shadow-glow-teal' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{p.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-brand-teal/20 text-brand-tealLight' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {p.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Platform Content */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{currentPlatform.name}</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {lang === 'hi' ? 'आधिकारिक संज्ञान पोर्टल एवं शिकायत अधिकारी' : 'Official De-indexing Channel & Grievance Desk'}
              </p>
            </div>

            {currentPlatform.url && (
              <a
                href={currentPlatform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-tealLight border border-brand-teal/30 text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                <span>{lang === 'hi' ? 'आधिकारिक रिपोर्टिंग लिंक' : 'Open Official Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {lang === 'hi' ? 'सत्यापित प्रक्रिया (कदम-दर-कदम)' : 'Verified Removal Playbook (Step-by-Step)'}
            </h4>

            <div className="space-y-2">
              {(lang === 'hi' ? currentPlatform.stepsHi : currentPlatform.stepsEn).map((stepText, idx) => {
                const stepKey = `${currentPlatform.id}-step-${idx}`;
                const isChecked = !!completedSteps[stepKey];

                return (
                  <div
                    key={idx}
                    onClick={() => toggleStepDone(stepKey)}
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed cursor-pointer transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'bg-slate-900/40 border-emerald-500/40 text-slate-300'
                        : 'bg-slate-950/40 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 ${
                      isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>

                    <p className={`flex-1 ${isChecked ? 'line-through text-slate-500' : ''}`}>
                      {stepText}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* StopNCII Special Insight Box */}
          {activePlatformId === 'stop_ncii' && (
            <div className="p-4 rounded-xl bg-slate-950 border border-brand-teal/30 text-xs space-y-2">
              <div className="flex items-center gap-2 text-brand-tealLight font-bold">
                <Lock className="w-4 h-4" />
                <span>{lang === 'hi' ? 'तकनीकी व्याख्या: हैशिंग आपकी गोपनीयता की रक्षा कैसे करती है?' : 'Technical Explainer: How Device-Side Hashing Preserves Privacy'}</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {t.takedowns.stopNciiDesc}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
