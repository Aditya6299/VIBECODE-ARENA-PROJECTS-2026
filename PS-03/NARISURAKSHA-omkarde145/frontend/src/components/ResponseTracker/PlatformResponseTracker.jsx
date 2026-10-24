import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import {
  Globe, Plus, CheckCircle2, X, Clock, AlertTriangle,
  ExternalLink, FileWarning, Trash2, Calendar
} from 'lucide-react';

const STATUS = {
  pending: { label: 'Pending', labelHi: 'लंबित', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  responded: { label: 'Responded', labelHi: 'प्रतिक्रिया मिली', color: 'text-brand-tealLight bg-brand-teal/10 border-brand-teal/30' },
  removed: { label: 'Content Removed', labelHi: 'सामग्री हटाई गई', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  ignored: { label: 'Ignored / Non-Compliant', labelHi: 'अनदेखा / गैर-अनुपालन', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' }
};

export const PlatformResponseTracker = () => {
  const { lang, showToast, intakeData } = useCase();

  const [records, setRecords] = useState(() =>
    (intakeData.platforms || []).map((p, i) => ({
      id: `pr-${i}`,
      platform: p,
      reportedDate: '',
      status: 'pending',
      responseDate: '',
      notes: '',
      deadlineHours: 24,
    }))
  );

  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newRecord, setNewRecord] = useState({ platform: '', reportedDate: '', status: 'pending', responseDate: '', notes: '' });

  const updateRecord = (id, field, value) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addRecord = () => {
    if (!newRecord.platform) return;
    setRecords(prev => [...prev, { ...newRecord, id: `pr-${Date.now()}`, deadlineHours: 24 }]);
    setNewRecord({ platform: '', reportedDate: '', status: 'pending', responseDate: '', notes: '' });
    setIsAdding(false);
    showToast(lang === 'hi' ? 'प्लेटफ़ॉर्म ट्रैकिंग रिकॉर्ड जोड़ा गया!' : 'Platform tracking record added!');
  };

  const deleteRecord = (id) => setRecords(prev => prev.filter(r => r.id !== id));

  const generateNonComplianceNotice = (record) => {
    const subject = encodeURIComponent(`URGENT: IT Rules 2021 Rule 3(2)(b) Non-Compliance Notice - ${record.platform}`);
    const body = encodeURIComponent(
      `To the Grievance Officer / Legal Department,\n\n` +
      `SUBJECT: MANDATORY 24-HOUR TAKEDOWN NOTICE - NON-CONSENSUAL MORPHED INTIMATE IMAGERY\n\n` +
      `This is a formal legal notice under Rule 3(2)(b) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.\n\n` +
      `Non-consensual altered/morphed intimate imagery of the complainant was reported to ${record.platform} on ${record.reportedDate || '[DATE]'}. ` +
      `Your platform has failed to remove the reported content within the statutorily mandated 24-hour window, ` +
      `constituting a violation of Rule 3(2)(b) of the IT Rules 2021.\n\n` +
      `Non-compliance results in the loss of safe harbor protections under Section 79 of the IT Act, 2000, ` +
      `rendering the platform directly liable as a publisher.\n\n` +
      `This notice is being simultaneously forwarded to:\n` +
      `1. National Cyber Crime Reporting Portal (cybercrime.gov.in)\n` +
      `2. Ministry of Electronics and Information Technology (MEITY)\n` +
      `3. Jurisdictional Cyber Police Station\n\n` +
      `Immediate action is demanded within 6 hours of receipt of this notice.\n\n` +
      `Ref: NariSuraksha AI Dossier | National Helpline: 1930`
    );
    window.open(`mailto:grievance@${record.platform.toLowerCase().replace(/\s+/g, '')}.com?subject=${subject}&body=${body}`, '_blank');
  };

  const nonCompliantCount = records.filter(r => r.status === 'ignored').length;
  const removedCount = records.filter(r => r.status === 'removed').length;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-tealLight" />
            <span>{lang === 'hi' ? 'प्लेटफ़ॉर्म प्रतिक्रिया ट्रैकर' : 'Platform Response Tracker'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'hi'
              ? 'किस प्लेटफ़ॉर्म ने कब कार्रवाई की, यह रिकॉर्ड करें। 24 घंटे बाद गैर-अनुपालन नोटिस जारी करें।'
              : 'Track which platforms acted and when. Issue non-compliance notices for platforms ignoring the 24-hour mandate.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-lg font-bold text-emerald-400">{removedCount}</span>
            <span className="text-[11px] text-emerald-300/80 block">{lang === 'hi' ? 'हटाई गई' : 'Removed'}</span>
          </div>
          <div className="text-center px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30">
            <span className="text-lg font-bold text-rose-400">{nonCompliantCount}</span>
            <span className="text-[11px] text-rose-300/80 block">{lang === 'hi' ? 'गैर-अनुपालन' : 'Non-Compliant'}</span>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-teal hover:bg-teal-500 text-slate-950 font-bold text-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'जोड़ें' : 'Add'}</span>
          </button>
        </div>
      </div>

      {/* Add Record Form */}
      {isAdding && (
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-700 space-y-3 animate-fade-in">
          <h4 className="text-xs font-semibold text-brand-tealLight uppercase tracking-wider">
            {lang === 'hi' ? 'नया प्लेटफ़ॉर्म रिपोर्ट रिकॉर्ड' : 'New Platform Report Record'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={newRecord.platform}
              onChange={e => setNewRecord({ ...newRecord, platform: e.target.value })}
              placeholder={lang === 'hi' ? 'प्लेटफ़ॉर्म नाम (जैसे: Instagram)' : 'Platform name (e.g. Instagram)'}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal"
            />
            <input
              type="text"
              value={newRecord.reportedDate}
              onChange={e => setNewRecord({ ...newRecord, reportedDate: e.target.value })}
              placeholder={lang === 'hi' ? 'रिपोर्ट तारीख (DD/MM/YYYY)' : 'Date reported (DD/MM/YYYY)'}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal"
            />
            <select
              value={newRecord.status}
              onChange={e => setNewRecord({ ...newRecord, status: e.target.value })}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal"
            >
              {Object.entries(STATUS).map(([k, v]) => (
                <option key={k} value={k}>{lang === 'hi' ? v.labelHi : v.label}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={newRecord.notes}
            onChange={e => setNewRecord({ ...newRecord, notes: e.target.value })}
            placeholder={lang === 'hi' ? 'नोट (वैकल्पिक)' : 'Notes (optional)'}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setIsAdding(false)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs">
              {lang === 'hi' ? 'रद्द' : 'Cancel'}
            </button>
            <button onClick={addRecord} className="px-3 py-1.5 rounded-lg bg-brand-teal text-slate-950 font-bold text-xs">
              {lang === 'hi' ? 'सहेजें' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* Records Table */}
      {records.length === 0 ? (
        <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-500">
          {lang === 'hi' ? 'कोई प्लेटफ़ॉर्म ट्रैकिंग रिकॉर्ड नहीं। "जोड़ें" पर क्लिक करें।' : 'No platform tracking records. Click "Add" to start tracking.'}
        </div>
      ) : (
        <div className="space-y-3">
          {records.map(record => {
            const statusConfig = STATUS[record.status];
            const isIgnored = record.status === 'ignored';

            return (
              <div key={record.id} className={`p-4 rounded-xl border transition-all ${
                isIgnored ? 'border-rose-500/30 bg-rose-950/10' : 'border-slate-800 bg-slate-950/50'
              }`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-bold text-white">{record.platform}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusConfig.color}`}>
                          {lang === 'hi' ? statusConfig.labelHi : statusConfig.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
                        {record.reportedDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {lang === 'hi' ? 'रिपोर्ट:' : 'Reported:'} {record.reportedDate}
                          </span>
                        )}
                        {record.responseDate && (
                          <span className="flex items-center gap-1 text-brand-tealLight">
                            <Clock className="w-3 h-3" />
                            {lang === 'hi' ? 'प्रतिक्रिया:' : 'Response:'} {record.responseDate}
                          </span>
                        )}
                      </div>
                      {record.notes && <p className="text-[11px] text-slate-400 mt-1">{record.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Quick status update */}
                    <select
                      value={record.status}
                      onChange={e => updateRecord(record.id, 'status', e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                    >
                      {Object.entries(STATUS).map(([k, v]) => (
                        <option key={k} value={k}>{lang === 'hi' ? v.labelHi : v.label}</option>
                      ))}
                    </select>

                    {isIgnored && (
                      <button
                        onClick={() => generateNonComplianceNotice(record)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-[11px] font-semibold transition-all"
                        title="Generate Non-Compliance Legal Notice"
                      >
                        <FileWarning className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{lang === 'hi' ? 'नोटिस' : 'Notice'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 24-hour IT Rules notice */}
                {isIgnored && (
                  <div className="mt-2 pt-2 border-t border-rose-500/20 flex items-center gap-2 text-[11px] text-rose-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    <span>
                      {lang === 'hi'
                        ? 'आईटी नियम 2021 नियम 3(2)(b) के तहत इस प्लेटफ़ॉर्म ने अनिवार्य 24 घंटे की समय सीमा का उल्लंघन किया है।'
                        : 'This platform has violated the mandatory 24-hour takedown mandate under Rule 3(2)(b) IT Rules 2021, losing its Section 79 safe harbor.'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
