import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { ngoDirectory, stateCyberCells } from '../../data/resourceDirectory';
import {
  BookOpen, Phone, Mail, ExternalLink, ShieldCheck,
  MapPin, Filter, Heart, Scale, Search
} from 'lucide-react';

export const ResourceDirectory = () => {
  const { lang } = useCase();
  const [activeSection, setActiveSection] = useState('ngo');
  const [stateFilter, setStateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNGOs = ngoDirectory.filter(n => {
    const q = searchQuery.toLowerCase();
    return (
      n.name.toLowerCase().includes(q) ||
      n.specialization.toLowerCase().includes(q) ||
      n.states.some(s => s.toLowerCase().includes(q))
    );
  });

  const filteredCells = stateCyberCells.filter(c =>
    c.state.toLowerCase().includes(stateFilter.toLowerCase()) ||
    c.unit.toLowerCase().includes(stateFilter.toLowerCase())
  );

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800/80">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-tealLight" />
          <span>{lang === 'hi' ? 'सहायता एवं संसाधन निर्देशिका' : 'Support & Resource Directory'}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'hi'
            ? 'सत्यापित NGO, कानूनी सहायता और राज्य-वार साइबर सेल संपर्क निर्देशिका'
            : 'Verified NGOs, pro-bono legal aid organisations, and all state cyber crime cell contacts'}
        </p>
      </div>

      {/* Section Toggle */}
      <div className="flex gap-2">
        {[
          { key: 'ngo', label: lang === 'hi' ? 'NGO और कानूनी सहायता' : 'NGOs & Legal Aid', icon: Heart },
          { key: 'cells', label: lang === 'hi' ? 'राज्य साइबर सेल' : 'State Cyber Cells', icon: Scale }
        ].map(s => {
          const Icon = s.icon;
          return (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                activeSection === s.key
                  ? 'bg-slate-800 border-brand-teal text-white shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search/Filter */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          value={activeSection === 'ngo' ? searchQuery : stateFilter}
          onChange={e => activeSection === 'ngo' ? setSearchQuery(e.target.value) : setStateFilter(e.target.value)}
          placeholder={
            activeSection === 'ngo'
              ? (lang === 'hi' ? 'NGO, विशेषज्ञता या राज्य खोजें...' : 'Search by NGO name, specialization or state...')
              : (lang === 'hi' ? 'राज्य या शहर खोजें...' : 'Search by state or city...')
          }
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal transition-colors"
        />
      </div>

      {/* NGO Directory */}
      {activeSection === 'ngo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredNGOs.map(ngo => (
            <div key={ngo.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-slate-700 transition-all space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs font-bold text-white">{lang === 'hi' ? ngo.nameHi : ngo.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                      ngo.type === 'Government Initiative'
                        ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                        : ngo.type === 'Mental Health Support'
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                          : 'bg-brand-teal/10 text-brand-tealLight border-brand-teal/30'
                    }`}>
                      {ngo.type}
                    </span>
                    {ngo.proBono && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-medium">
                        {lang === 'hi' ? 'निःशुल्क' : 'Pro Bono'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {lang === 'hi' ? ngo.specializationHi : ngo.specialization}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span className="text-[11px] text-slate-500">{ngo.states.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={`tel:${ngo.contact}`}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] font-medium transition-all"
                >
                  <Phone className="w-3 h-3" />
                  <span>{ngo.contact}</span>
                </a>
                {ngo.email && (
                  <a
                    href={`mailto:${ngo.email}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-tealLight text-[11px] font-medium transition-all"
                  >
                    <Mail className="w-3 h-3" />
                    <span className="hidden sm:inline">{ngo.email}</span>
                    <span className="sm:hidden">Email</span>
                  </a>
                )}
                <a
                  href={ngo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-all"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{lang === 'hi' ? 'वेबसाइट' : 'Website'}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* State Cyber Cells */}
      {activeSection === 'cells' && (
        <div className="space-y-2">
          {filteredCells.map((cell, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-slate-700 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{cell.state}</span>
                    <span className="text-[11px] text-slate-400">{cell.unit}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href={`tel:${cell.phone}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950/50 text-emerald-300 text-[11px] font-medium transition-all border border-slate-700 hover:border-emerald-500/30">
                    <Phone className="w-3 h-3" />
                    <span>{cell.phone}</span>
                  </a>
                  {cell.email && (
                    <a href={`mailto:${cell.email}`}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-tealLight text-[11px] font-medium transition-all border border-slate-700">
                      <Mail className="w-3 h-3" />
                      <span className="hidden md:inline">{cell.email}</span>
                      <span className="md:hidden">Email</span>
                    </a>
                  )}
                  <a href={cell.portal} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-all border border-slate-700">
                    <ExternalLink className="w-3 h-3" />
                    <span>{lang === 'hi' ? 'पोर्टल' : 'Portal'}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
