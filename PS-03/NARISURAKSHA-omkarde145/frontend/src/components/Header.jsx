import React, { useState } from 'react';
import { useCase } from '../context/CaseContext';
import { TrustedContactAlert } from './common/TrustedContactAlert';
import { StealthCalculator } from './common/StealthCalculator';
import { 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Globe, 
  Lock, 
  ClipboardList, 
  Database, 
  Clock, 
  ShieldAlert, 
  MessageSquare,
  Award,
  Activity,
  Users,
  BookOpen,
  Heart,
  Split,
  FileSearch,
  CreditCard,
  Calculator
} from 'lucide-react';

export const Header = () => {
  const { 
    lang, 
    setLang, 
    t, 
    activeTab, 
    setActiveTab, 
    loadDemoCase, 
    setIsDossierModalOpen,
    evidenceFiles 
  } = useCase();

  const [isStealthOpen, setIsStealthOpen] = useState(false);

  const navItems = [
    { key: 'intake', label: t.tabs.intake, icon: ClipboardList },
    { key: 'checklist', label: t.tabs.checklist, icon: ShieldCheck },
    { key: 'vault', label: t.tabs.vault, icon: Database, badge: evidenceFiles.length > 0 ? evidenceFiles.length : null },
    { key: 'juxtaposition', label: t.tabs.juxtaposition, icon: Split, highlight: true },
    { key: 'exif', label: t.tabs.exif, icon: FileSearch },
    { key: 'extortion', label: t.tabs.extortion, icon: CreditCard },
    { key: 'timeline', label: t.tabs.timeline, icon: Clock },
    { key: 'takedown', label: t.tabs.takedown, icon: ShieldAlert },
    { key: 'sakhi', label: t.tabs.sakhi, icon: Heart, highlight: true },
    { key: 'progress', label: t.tabs.progress, icon: Award },
    { key: 'response', label: t.tabs.response, icon: Activity },
    { key: 'witnesses', label: t.tabs.witnesses, icon: Users },
    { key: 'resources', label: t.tabs.resources, icon: BookOpen }
  ];

  return (
    <>
      <header className="border-b border-slate-800/80 bg-background-secondary/95 backdrop-blur-xl sticky top-[33px] z-40">
        {/* Top Banner Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-teal to-emerald-400 p-0.5 flex items-center justify-center shadow-glow-teal">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-brand-tealLight" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>{t.appTitle}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-brand-teal/20 text-brand-tealLight border border-brand-teal/40">
                    v2.5 Sovereign
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Global Action Badges & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Zero-Knowledge Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-300 text-xs shadow-sm">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.zeroKnowledgeBadge}</span>
            </div>

            {/* Stealth Calculator Decoy Trigger */}
            <button
              onClick={() => setIsStealthOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-amber-300 text-xs font-medium transition-all"
              title="Disguise screen as Calculator (Shortcut: F2)"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Decoy (F2)</span>
            </button>

            {/* Trusted Contact Alert */}
            <TrustedContactAlert />

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 text-xs font-medium transition-all"
              title="Toggle Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-brand-tealLight" />
              <span>{lang === 'en' ? 'हिंदी (Devanagari)' : 'English'}</span>
            </button>

            {/* Load Demo Case Button */}
            <button
              onClick={loadDemoCase}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Preload simulated fictional cyber extortion records for judging"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{t.loadDemoButton}</span>
            </button>

            {/* Export PDF Dossier CTA */}
            <button
              onClick={() => setIsDossierModalOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-brand-teal to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-semibold transition-all shadow-glow-teal hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileText className="w-4 h-4" />
              <span>{t.exportDossierButton}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/60">
          <nav className="flex space-x-1 overflow-x-auto py-2 no-scrollbar" aria-label="Tabs">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? item.highlight
                        ? 'bg-gradient-to-r from-rose-950/70 to-slate-900 text-rose-300 border border-rose-500/50 shadow-glow-rose'
                        : 'bg-slate-800 text-brand-tealLight border border-brand-teal/40 shadow-sm'
                      : item.highlight
                        ? 'text-rose-300/90 hover:text-rose-200 bg-rose-950/20 border border-rose-500/20 hover:bg-rose-950/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${
                    isActive 
                      ? item.highlight ? 'text-rose-400 animate-pulse' : 'text-brand-tealLight' 
                      : item.highlight ? 'text-rose-400' : 'text-slate-400'
                  }`} />
                  <span>{item.label}</span>
                  {item.highlight && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  )}
                  {item.badge !== null && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-brand-teal text-slate-950 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Stealth Decoy Calculator (covers entire view when active) */}
      <StealthCalculator isOpen={isStealthOpen} onClose={() => setIsStealthOpen(false)} />
    </>
  );
};
