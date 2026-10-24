import React from 'react';
import { CaseProvider, useCase } from './context/CaseContext';
import { PanicBar } from './components/PanicBar';
import { Header } from './components/Header';
import { LegalDisclaimerBanner } from './components/LegalDisclaimerBanner';
import { IntakeWizard } from './components/IntakeWizard/IntakeWizard';
import { EvidenceChecklist } from './components/EvidenceChecklist/EvidenceChecklist';
import { EvidenceVault } from './components/EvidenceVault/EvidenceVault';
import { VisualJuxtaposition } from './components/Juxtaposition/VisualJuxtaposition';
import { ExifInspector } from './components/Forensics/ExifInspector';
import { UpiExtortionAnalyzer } from './components/ExtortionAnalysis/UpiExtortionAnalyzer';
import { IncidentTimeline } from './components/Timeline/IncidentTimeline';
import { PlatformTakedowns } from './components/TakedownGuides/PlatformTakedowns';
import { SahayakChat } from './components/SahayakChat/SahayakChat';
import { SakhiVoiceCompanion } from './components/SakhiVoiceCompanion/SakhiVoiceCompanion';
import { DossierPreviewModal } from './components/DossierExport/DossierPreviewModal';
import { Toast } from './components/common/Toast';
import { InactivityWatcher } from './components/common/InactivityWatcher';
import { PWAInstallBanner } from './components/common/PWAInstallBanner';
import { TrustedContactAlert } from './components/common/TrustedContactAlert';
import { ProgressDashboard } from './components/ProgressDashboard/ProgressDashboard';
import { PlatformResponseTracker } from './components/ResponseTracker/PlatformResponseTracker';
import { WitnessStatements } from './components/WitnessStatements/WitnessStatements';
import { ResourceDirectory } from './components/ResourceDirectory/ResourceDirectory';
import { CaseVaultManager } from './components/CaseVault/CaseVaultManager';
import { usePanicWord } from './hooks/usePanicWord';
import {
  ShieldCheck,
  Database,
  Clock,
  PhoneCall,
  ExternalLink,
  Lock,
  Award,
  Globe,
  Users,
  BookOpen,
  Heart
} from 'lucide-react';

const MainContent = () => {
  const {
    activeTab,
    checklist,
    evidenceFiles,
    timelineEvents,
    lang,
    t,
    setIsDossierModalOpen
  } = useCase();

  // Panic word detector — silent keyboard buffer monitor
  usePanicWord();

  const totalChecklist = t.checklist.items.length;
  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const readinessPercent = Math.round((checkedCount / totalChecklist) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-100">
      {/* 1. Global Panic Bar */}
      <PanicBar />

      {/* 2. Global Header */}
      <Header />

      {/* 3. Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Legal & Zero-Knowledge Disclaimer Strip */}
        <LegalDisclaimerBanner />

        {/* AES-256 Encrypted Case Vault Manager (always visible) */}
        <CaseVaultManager />

        {/* Quick Investigative Status Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                {lang === 'hi' ? 'साक्ष्य तैयारी' : 'Readiness Score'}
              </span>
              <span className="text-sm font-bold text-white font-mono">
                {readinessPercent}% <span className="text-[11px] text-slate-400 font-sans font-normal">({checkedCount}/{totalChecklist})</span>
              </span>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-teal/10 text-brand-tealLight">
              <Database className="w-5 h-5 text-brand-tealLight" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                {lang === 'hi' ? 'हैश किए गए साक्ष्य' : 'Hashed Evidence'}
              </span>
              <span className="text-sm font-bold text-white font-mono">
                {evidenceFiles.length} <span className="text-[11px] text-slate-400 font-sans font-normal">{lang === 'hi' ? 'फ़ाइलें' : 'Files'}</span>
              </span>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                {lang === 'hi' ? 'कालक्रम पड़ाव' : 'Timeline Events'}
              </span>
              <span className="text-sm font-bold text-white font-mono">
                {timelineEvents.length} <span className="text-[11px] text-slate-400 font-sans font-normal">{lang === 'hi' ? 'घटनाएँ' : 'Events'}</span>
              </span>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <PhoneCall className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                {lang === 'hi' ? 'साइबर हेल्पलाइन' : 'Cyber Helpline'}
              </span>
              <span className="text-sm font-bold text-rose-400 font-mono">
                1930 <span className="text-[11px] text-slate-400 font-sans font-normal">| 1091</span>
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'intake' && <IntakeWizard />}
          {activeTab === 'checklist' && <EvidenceChecklist />}
          {activeTab === 'vault' && <EvidenceVault />}
          {activeTab === 'juxtaposition' && <VisualJuxtaposition />}
          {activeTab === 'exif' && <ExifInspector />}
          {activeTab === 'extortion' && <UpiExtortionAnalyzer />}
          {activeTab === 'timeline' && <IncidentTimeline />}
          {activeTab === 'takedown' && <PlatformTakedowns />}
          {(activeTab === 'sakhi' || activeTab === 'sahayak') && <SakhiVoiceCompanion />}
          {activeTab === 'progress' && <ProgressDashboard />}
          {activeTab === 'response' && <PlatformResponseTracker />}
          {activeTab === 'witnesses' && <WitnessStatements />}
          {activeTab === 'resources' && <ResourceDirectory />}
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 text-slate-400 text-xs py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-tealLight" />
            <span className="font-semibold text-slate-300">NariSuraksha AI</span>
            <span>•</span>
            <span className="text-slate-500">Morphed Image Abuse Reporting & Evidence Dossier Assistant</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-emerald-400">
              <Lock className="w-3 h-3" />
              AES-256-GCM Local Vault • Zero-Knowledge SHA-256
            </span>
            <span>•</span>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-tealLight hover:underline flex items-center gap-1"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span>•</span>
            <span>Helpline: <strong>1930</strong></span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <DossierPreviewModal />
      <InactivityWatcher />
      <PWAInstallBanner />

      {/* Floating Quick "Talk to Sakhi" Voice Button */}
      {activeTab !== 'sakhi' && (
        <button
          onClick={() => setActiveTab('sakhi')}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-glow-rose transition-all hover:scale-105 active:scale-95 shadow-2xl"
          title={lang === 'hi' ? 'सखी AI से बात करें (वॉइस साथी)' : 'Talk to Sakhi AI (Voice Companion)'}
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>{lang === 'hi' ? 'सखी से बात करें 🎙️' : 'Talk to Sakhi 🎙️'}</span>
        </button>
      )}

      {/* Floating Toast */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <CaseProvider>
      <MainContent />
    </CaseProvider>
  );
}
