import React from 'react';
import { useCase } from '../../context/CaseContext';
import { generateDossierPdf } from './generateDossierPdf';
import { 
  FileText, 
  Download, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  PhoneCall, 
  CheckCircle2,
  Lock,
  Layers,
  Clock,
  Hash
} from 'lucide-react';
import { formatBytes, formatTimestamp } from '../../utils/cryptoUtils';

export const DossierPreviewModal = () => {
  const { 
    isDossierModalOpen, 
    setIsDossierModalOpen, 
    intakeData, 
    checklist, 
    evidenceFiles, 
    timelineEvents, 
    simulatedSubmission, 
    lang, 
    t,
    showToast 
  } = useCase();

  if (!isDossierModalOpen) return null;

  const trackingId = simulatedSubmission?.trackingId || `NCR-2026-SIM-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleDownload = async () => {
    await generateDossierPdf({
      intakeData,
      checklist,
      evidenceFiles,
      timelineEvents,
      simulatedSubmission,
      lang
    });
    showToast(lang === 'hi' ? 'साक्ष्य डॉसियर PDF डाउनलोड हो गई है!' : 'Evidence Dossier PDF successfully generated & downloaded!');
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative my-auto space-y-5">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-teal to-emerald-400 text-slate-950 font-bold">
              <FileText className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{t.dossier.modalTitle}</span>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {trackingId}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {t.dossier.modalSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDossierModalOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step-by-Step Filing Instruction Ribbon */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-brand-teal/30 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-brand-tealLight flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 text-brand-tealLight" />
              {t.dossier.filingReminderTitle}
            </span>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>https://cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-300">
            <p className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              {t.dossier.filingStep1}
            </p>
            <p className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              {t.dossier.filingStep2}
            </p>
            <p className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              {t.dossier.filingStep3}
            </p>
            <p className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              {t.dossier.filingStep4}
            </p>
          </div>
        </div>

        {/* Dossier Document Live Preview Paper */}
        <div className="bg-slate-950/90 rounded-xl p-5 border border-slate-800 space-y-4 max-h-[45vh] overflow-y-auto text-xs text-slate-300">
          {/* Header Preview */}
          <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                Official Police Annexure • Section 65B Evidence Act
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">
                CYBER CRIME INCIDENT REPORT & CRYPTOGRAPHIC EVIDENCE DOSSIER
              </h3>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-400">
              <div>Ref: <strong className="text-white">{trackingId}</strong></div>
              <div>{new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          {/* Section: Synopsis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
            <div>
              <span className="text-slate-400 block">Abuse Category:</span>
              <span className="text-white font-medium">{t.intake.categories[intakeData.category] || intakeData.category || 'Morphed Deepfake Imagery'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Targeted Platforms:</span>
              <span className="text-white font-medium">{intakeData.platforms.join(', ') || 'Instagram, Telegram'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Perpetrator ID/Handle:</span>
              <span className="text-white font-medium font-mono">{intakeData.perpetratorHandle || '@darkshadow_anon'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Extortion Demand:</span>
              <span className="text-white font-medium">{intakeData.extortionDemand || 'None recorded'}</span>
            </div>
          </div>

          {/* Section: Narrative */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 mb-1">
              Statement of Non-Consent & Factual Narrative:
            </h4>
            <p className="text-[11px] text-slate-300 bg-slate-900/40 p-3 rounded-lg border border-slate-800/60 leading-relaxed whitespace-pre-line">
              {intakeData.narrative || 'No detailed narrative entered yet.'}
            </p>
          </div>

          {/* Section: Cryptographic Hashes Count */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-[11px]">
            <div className="flex items-center gap-2 text-emerald-300">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span><strong>{evidenceFiles.length}</strong> Evidence captures verified with client-side SHA-256 digests</span>
            </div>
            <div className="flex items-center gap-2 text-brand-tealLight">
              <Clock className="w-4 h-4" />
              <span><strong>{timelineEvents.length}</strong> Chronological sequence milestones recorded</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'hi' ? 'PDF आपके डिवाइस पर स्थानीय रूप से तैयार की जाएगी।' : 'Compiled locally in browser with jsPDF & AutoTable.'}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsDossierModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              {t.dossier.closeBtn}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-brand-teal to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-slate-950 font-bold text-xs transition-all shadow-glow-teal hover:scale-[1.02]"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>{t.dossier.downloadPdf}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
