import React from 'react';
import { useCase } from '../../context/CaseContext';
import {
  ClipboardList, ShieldCheck, Database, Clock, Globe, MessageSquare,
  FileText, CheckCircle2, Circle, ChevronRight, Award, ArrowRight
} from 'lucide-react';

export const ProgressDashboard = () => {
  const { intakeData, checklist, evidenceFiles, timelineEvents, simulatedSubmission, t, lang, setActiveTab, setIsDossierModalOpen } = useCase();

  const totalChecklist = t.checklist.items.length;
  const checkedCount = Object.values(checklist).filter(Boolean).length;

  const milestones = [
    {
      id: 'intake',
      icon: ClipboardList,
      label: lang === 'hi' ? 'शिकायत विवरण पूर्ण' : 'Incident Intake Completed',
      done: !!intakeData.completed,
      detail: intakeData.completed
        ? (lang === 'hi' ? `श्रेणी: ${intakeData.category}` : `Category: ${intakeData.category}`)
        : (lang === 'hi' ? 'अभी पूर्ण नहीं हुआ' : 'Not yet completed'),
      action: () => setActiveTab('intake'),
      actionLabel: lang === 'hi' ? 'फ़ॉर्म खोलें' : 'Open Form'
    },
    {
      id: 'checklist',
      icon: ShieldCheck,
      label: lang === 'hi' ? 'साक्ष्य चेकलिस्ट सत्यापित' : 'Evidence Checklist Verified',
      done: checkedCount === totalChecklist,
      detail: `${checkedCount}/${totalChecklist} ${lang === 'hi' ? 'आइटम सत्यापित' : 'items verified'}`,
      action: () => setActiveTab('checklist'),
      actionLabel: lang === 'hi' ? 'चेकलिस्ट खोलें' : 'Open Checklist'
    },
    {
      id: 'vault',
      icon: Database,
      label: lang === 'hi' ? 'साक्ष्य फ़ाइलें हैश की गई' : 'Evidence Files Hashed',
      done: evidenceFiles.length >= 1,
      detail: `${evidenceFiles.length} ${lang === 'hi' ? 'SHA-256 हैश तैयार' : 'SHA-256 digests computed'}`,
      action: () => setActiveTab('vault'),
      actionLabel: lang === 'hi' ? 'वॉल्ट खोलें' : 'Open Vault'
    },
    {
      id: 'timeline',
      icon: Clock,
      label: lang === 'hi' ? 'कालक्रम तैयार' : 'Event Timeline Built',
      done: timelineEvents.length >= 1,
      detail: `${timelineEvents.length} ${lang === 'hi' ? 'घटनाएँ दर्ज' : 'events recorded'}`,
      action: () => setActiveTab('timeline'),
      actionLabel: lang === 'hi' ? 'टाइमलाइन खोलें' : 'Open Timeline'
    },
    {
      id: 'takedown',
      icon: Globe,
      label: lang === 'hi' ? 'प्लेटफ़ॉर्म टेकडाउन दायर' : 'Platform Takedown Filed',
      done: false, // Manual tracking - user marks this
      detail: lang === 'hi' ? 'मैनुअल चरण' : 'Manual step required',
      action: () => setActiveTab('takedown'),
      actionLabel: lang === 'hi' ? 'गाइड खोलें' : 'Open Guide'
    },
    {
      id: 'dossier',
      icon: FileText,
      label: lang === 'hi' ? 'धारा 65B डॉसियर जनरेट की गई' : 'Section 65B Dossier Generated',
      done: !!simulatedSubmission,
      detail: simulatedSubmission
        ? `Ref: ${simulatedSubmission.trackingId}`
        : (lang === 'hi' ? 'अभी तैयार नहीं' : 'Not yet generated'),
      action: () => setIsDossierModalOpen(true),
      actionLabel: lang === 'hi' ? 'डॉसियर खोलें' : 'Open Dossier'
    }
  ];

  const completedCount = milestones.filter(m => m.done).length;
  const overallPct = Math.round((completedCount / milestones.length) * 100);

  const getStatusColor = (pct) => {
    if (pct >= 100) return 'text-emerald-400';
    if (pct >= 60) return 'text-brand-tealLight';
    if (pct >= 30) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-tealLight" />
            <span>{lang === 'hi' ? 'केस प्रगति ट्रैकर' : 'Case Progress Tracker'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'hi'
              ? 'रिपोर्टिंग यात्रा के प्रत्येक चरण की प्रगति देखें'
              : 'Track your complete evidence documentation journey step by step'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className={`text-3xl font-bold font-mono ${getStatusColor(overallPct)}`}>{overallPct}%</span>
            <span className="text-xs text-slate-400 block">{lang === 'hi' ? 'पूर्ण' : 'Complete'}</span>
          </div>
          <div className="w-16 h-16 relative">
            <svg viewBox="0 0 64 64" className="-rotate-90 w-16 h-16">
              <circle cx="32" cy="32" r="26" fill="none" stroke="#1E293B" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="26" fill="none"
                stroke={overallPct >= 60 ? '#14B8A6' : overallPct >= 30 ? '#F59E0B' : '#F43F5E'}
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - overallPct / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white">{completedCount}/{milestones.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-teal to-emerald-400 transition-all duration-700"
          style={{ width: `${overallPct}%` }}
        />
      </div>

      {/* Milestone Steps */}
      <div className="relative space-y-3 pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-brand-teal before:via-slate-700 before:to-slate-800">
        {milestones.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={m.id} className="relative">
              {/* Node */}
              <div className={`absolute -left-8 top-3 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                m.done
                  ? 'bg-brand-teal border-brand-teal shadow-glow-teal'
                  : 'bg-slate-950 border-slate-700'
              }`}>
                {m.done
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                  : <span className="text-[10px] font-bold font-mono text-slate-500">{idx + 1}</span>
                }
              </div>

              <div className={`p-3.5 rounded-xl border transition-all ${
                m.done
                  ? 'bg-slate-900/60 border-brand-teal/30'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
              }`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${m.done ? 'text-brand-tealLight' : 'text-slate-500'}`} />
                    <div className="min-w-0">
                      <span className={`text-xs font-semibold block ${m.done ? 'text-white' : 'text-slate-400'}`}>
                        {m.label}
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate">{m.detail}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {m.done && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                        {lang === 'hi' ? 'पूर्ण' : 'DONE'}
                      </span>
                    )}
                    <button
                      onClick={m.action}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-tealLight text-[11px] font-medium transition-all hover:scale-[1.02]"
                    >
                      <span>{m.actionLabel}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {overallPct === 100 && (
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center gap-3">
          <Award className="w-8 h-8 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-300">
              {lang === 'hi' ? '🎉 साक्ष्य डॉसियर जमा करने के लिए तैयार!' : '🎉 Evidence Dossier Ready for Submission!'}
            </p>
            <p className="text-[11px] text-emerald-400/80">
              {lang === 'hi'
                ? 'cybercrime.gov.in पर जाएं और डॉसियर PDF संलग्न करें।'
                : 'Visit cybercrime.gov.in and attach the downloaded PDF dossier.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
