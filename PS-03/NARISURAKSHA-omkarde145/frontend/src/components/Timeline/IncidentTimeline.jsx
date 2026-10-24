import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Calendar, 
  Hash, 
  CheckCircle, 
  Sparkles,
  Link,
  ChevronRight
} from 'lucide-react';

export const IncidentTimeline = () => {
  const { 
    t, 
    lang, 
    timelineEvents, 
    addTimelineEvent, 
    removeTimelineEvent, 
    evidenceFiles,
    showToast 
  } = useCase();

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    title: '',
    description: '',
    evidenceHash: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast(lang === 'hi' ? 'कृपया घटना का शीर्षक दर्ज करें।' : 'Please enter an event title.');
      return;
    }

    addTimelineEvent(formData);
    setFormData({
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      title: '',
      description: '',
      evidenceHash: ''
    });
    setIsAdding(false);
    showToast(lang === 'hi' ? 'कालक्रम घटना जोड़ी गई!' : 'Timeline event recorded.');
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-tealLight" />
            <span>{t.timeline.title}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {t.timeline.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-teal hover:bg-teal-500 text-slate-950 font-bold text-xs transition-all shadow-glow-teal hover:scale-[1.02]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? t.timeline.cancelBtn : t.timeline.addEventBtn}</span>
        </button>
      </div>

      {/* Add Event Form Modal / Inline */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-slate-950/70 p-4 rounded-xl border border-slate-700/80 space-y-3 animate-fade-in">
          <h3 className="text-xs font-semibold text-brand-tealLight uppercase tracking-wider">
            {lang === 'hi' ? 'नई कालक्रम घटना दर्ज करें' : 'Log New Chronological Event'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                {t.timeline.dateLabel} *
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="e.g. 2026-10-20 14:30 IST"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                {t.timeline.eventTitleLabel} *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Initial blackmail DM received with altered media"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              {t.timeline.eventDescLabel}
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide exact context, threats made, platforms involved, or actions taken..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal resize-none"
            />
          </div>

          {/* Evidence hash link selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              {t.timeline.linkedEvidenceLabel}
            </label>
            {evidenceFiles.length > 0 ? (
              <select
                value={formData.evidenceHash}
                onChange={(e) => setFormData({ ...formData, evidenceHash: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal font-mono"
              >
                <option value="">-- None / General Event --</option>
                {evidenceFiles.map(f => (
                  <option key={f.id} value={f.hash}>
                    [{f.name}] SHA-256: {f.hash.substring(0, 16)}...
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={formData.evidenceHash}
                onChange={(e) => setFormData({ ...formData, evidenceHash: e.target.value })}
                placeholder="Optional SHA-256 digest link"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono"
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              {t.timeline.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-brand-teal hover:bg-teal-500 text-slate-950 font-bold text-xs"
            >
              {t.timeline.saveBtn}
            </button>
          </div>
        </form>
      )}

      {/* Visual Timeline Stream */}
      {timelineEvents.length === 0 ? (
        <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-500">
          {t.timeline.noEvents}
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-brand-teal before:via-emerald-500 before:to-slate-800">
          {timelineEvents.map((event, index) => (
            <div key={event.id || index} className="relative group">
              {/* Glowing Node Icon */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-brand-tealLight flex items-center justify-center shadow-glow-teal group-hover:scale-110 transition-transform">
                <div className="w-2 h-2 rounded-full bg-brand-tealLight" />
              </div>

              {/* Event Card */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-brand-tealLight flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                      {event.date}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      #{index + 1}
                    </span>
                  </div>

                  <button
                    onClick={() => removeTimelineEvent(event.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                    title="Remove event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="text-sm font-semibold text-white mb-1">
                  {event.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {event.description}
                </p>

                {/* Linked Evidence Pill */}
                {event.evidenceHash && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1 font-mono">
                      <Link className="w-3 h-3 text-brand-tealLight" />
                      {lang === 'hi' ? 'संलग्न साक्ष्य हैश:' : 'Corroborating Hash:'}
                    </span>
                    <code className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-brand-tealLight font-mono">
                      {event.evidenceHash.substring(0, 16)}...
                    </code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
