import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { Users, Plus, Trash2, UserCheck, Calendar, MessageSquare, ShieldCheck } from 'lucide-react';

export const WitnessStatements = () => {
  const { lang, showToast } = useCase();
  const [statements, setStatements] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ nameAlias: '', relationship: '', dateWitnessed: '', platform: '', narrative: '', consent: false });

  const handleAdd = () => {
    if (!form.nameAlias || !form.narrative || !form.consent) {
      showToast(lang === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें और सहमति दें।' : 'Please fill all required fields and confirm consent.');
      return;
    }
    setStatements(prev => [...prev, { ...form, id: `ws-${Date.now()}`, addedAt: new Date().toISOString() }]);
    setForm({ nameAlias: '', relationship: '', dateWitnessed: '', platform: '', narrative: '', consent: false });
    setIsAdding(false);
    showToast(lang === 'hi' ? 'गवाह बयान जोड़ा गया!' : 'Witness statement recorded!');
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-tealLight" />
            <span>{lang === 'hi' ? 'गवाह बयान संग्रहकर्ता' : 'Witness Statement Collector'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'hi'
              ? 'मित्र, परिवार या सहकर्मी जिन्होंने उत्पीड़न देखा, उनके बयान PDF में "अनुलग्नक B" के रूप में शामिल होंगे।'
              : 'Corroborating accounts from friends, family or colleagues who witnessed the abuse. Included as Annexure B in the PDF dossier.'}
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-teal hover:bg-teal-500 text-slate-950 font-bold text-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'बयान जोड़ें' : 'Add Statement'}</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-700 space-y-3 animate-fade-in">
          <h4 className="text-xs font-semibold text-brand-tealLight uppercase tracking-wider mb-2">
            {lang === 'hi' ? 'नया गवाह बयान दर्ज करें' : 'Record New Witness Statement'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                {lang === 'hi' ? 'नाम / छद्म नाम *' : 'Name / Alias *'}
              </label>
              <input value={form.nameAlias} onChange={e => setForm({ ...form, nameAlias: e.target.value })}
                placeholder={lang === 'hi' ? 'जैसे: Witness A (गवाह ए)' : 'e.g. Witness A or Ritu M.'}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                {lang === 'hi' ? 'संबंध' : 'Relationship'}
              </label>
              <input value={form.relationship} onChange={e => setForm({ ...form, relationship: e.target.value })}
                placeholder={lang === 'hi' ? 'जैसे: सहेली, सहकर्मी' : 'e.g. College friend, Co-worker'}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                {lang === 'hi' ? 'देखे जाने की तारीख' : 'Date Witnessed'}
              </label>
              <input value={form.dateWitnessed} onChange={e => setForm({ ...form, dateWitnessed: e.target.value })}
                placeholder="e.g. 20 Oct 2026"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                {lang === 'hi' ? 'किस प्लेटफ़ॉर्म पर देखा' : 'Platform Where Witnessed'}
              </label>
              <input value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}
                placeholder="e.g. Instagram, WhatsApp Group"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              {lang === 'hi' ? 'बयान / आपने क्या देखा *' : 'Statement / What They Witnessed *'}
            </label>
            <textarea rows={3} value={form.narrative} onChange={e => setForm({ ...form, narrative: e.target.value })}
              placeholder={lang === 'hi' ? 'गवाह ने क्या देखा, कब देखा और किस प्लेटफ़ॉर्म पर देखा...' : 'Describe what the witness saw, when, on which platform, and what actions they took...'}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal resize-none" />
          </div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })}
              className="mt-0.5 accent-brand-teal" />
            <span className="text-[11px] text-slate-300">
              {lang === 'hi'
                ? 'मैं पुष्टि करता/करती हूँ कि इस गवाह ने अपना बयान देने की सहमति दी है और इस जानकारी को शामिल करने की अनुमति है।'
                : 'I confirm that this witness has consented to providing this statement and its inclusion in the formal evidence dossier.'}
            </span>
          </label>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setIsAdding(false)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs">{lang === 'hi' ? 'रद्द' : 'Cancel'}</button>
            <button onClick={handleAdd} className="px-4 py-1.5 rounded-lg bg-brand-teal text-slate-950 font-bold text-xs">{lang === 'hi' ? 'बयान दर्ज करें' : 'Record Statement'}</button>
          </div>
        </div>
      )}

      {statements.length === 0 ? (
        <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-500">
          {lang === 'hi' ? 'अभी तक कोई गवाह बयान नहीं जोड़ा गया।' : 'No witness statements added yet. Corroborating accounts strengthen court filings.'}
        </div>
      ) : (
        <div className="space-y-3">
          {statements.map((s, idx) => (
            <div key={s.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300">
                    W{idx + 1}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">{s.nameAlias}</span>
                    <span className="text-[11px] text-slate-400 block">{s.relationship} {s.platform && `• ${s.platform}`} {s.dateWitnessed && `• ${s.dateWitnessed}`}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {lang === 'hi' ? 'सहमत' : 'Consented'}
                  </span>
                  <button onClick={() => setStatements(prev => prev.filter(ws => ws.id !== s.id))}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed pl-10 border-l border-slate-800 ml-4">{s.narrative}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
