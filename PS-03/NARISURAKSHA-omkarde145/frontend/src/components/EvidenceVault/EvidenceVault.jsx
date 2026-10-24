import React, { useState, useRef } from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  Database, 
  UploadCloud, 
  FileCheck, 
  Copy, 
  Check, 
  Trash2, 
  Eye, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  X,
  FileCode,
  Tag,
  RefreshCcw,
  CheckCheck,
  AlertOctagon,
  Split,
  FileSearch
} from 'lucide-react';
import { formatBytes, formatTimestamp, truncateHash, copyToClipboard } from '../../utils/cryptoUtils';

export const EvidenceVault = () => {
  const { 
    t, 
    lang, 
    evidenceFiles, 
    addEvidenceFile, 
    removeEvidenceFile, 
    intakeData,
    showToast,
    setActiveTab 
  } = useCase();

  const [isDragging, setIsDragging] = useState(false);
  const [copiedHashId, setCopiedHashId] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [selectedTag, setSelectedTag] = useState('morphedTag');
  const [verificationResults, setVerificationResults] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      await addEvidenceFile(file, {
        tag: selectedTag,
        platform: intakeData.platforms[0] || 'Unknown Platform'
      });
    }
  };

  const handleFileInputChange = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      await addEvidenceFile(file, {
        tag: selectedTag,
        platform: intakeData.platforms[0] || 'Unknown Platform'
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyHash = async (id, hash) => {
    await copyToClipboard(hash);
    setCopiedHashId(id);
    showToast(t.vault.hashCopied);
    setTimeout(() => {
      setCopiedHashId(null);
    }, 2000);
  };

  const addSimulatedSampleItem = async () => {
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const sampleItem = {
      name: `screenshot_evidence_threat_${Math.floor(100 + Math.random() * 900)}.png`,
      size: Math.floor(800000 + Math.random() * 1200000),
      type: 'image/png'
    };

    // Create a dummy File object in memory
    const dummyBlob = new Blob(['Simulated Zero-Knowledge Evidence Record for Testing'], { type: 'text/plain' });
    const dummyFile = new File([dummyBlob], sampleItem.name, { type: sampleItem.type });

    await addEvidenceFile(dummyFile, {
      tag: selectedTag,
      platform: intakeData.platforms[0] || 'Instagram'
    });
  };

  const handleReVerifyAll = async () => {
    setIsVerifying(true);
    const results = {};
    for (const file of evidenceFiles) {
      if (!file.isSimulated && file.previewUrl) {
        try {
          // Re-fetch the object URL blob and re-hash it
          const response = await fetch(file.previewUrl);
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const reHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          results[file.id] = { status: reHash === file.hash ? 'intact' : 'tampered', reHash };
        } catch {
          results[file.id] = { status: 'simulated' };
        }
      } else {
        results[file.id] = { status: 'simulated' };
      }
    }
    setVerificationResults(results);
    setIsVerifying(false);
    showToast(lang === 'hi' ? 'सभी साक्ष्य हैश पुनः सत्यापित किए गए!' : 'All evidence hashes re-verified!');
  };

  const tagLabels = {
    morphedTag: { label: t.vault.morphedTag, color: 'bg-rose-500/10 text-rose-300 border-rose-500/30' },
    baselineTag: { label: t.vault.baselineTag, color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
    extortionTag: { label: t.vault.extortionTag, color: 'bg-amber-500/10 text-amber-300 border-amber-500/30' }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-tealLight" />
              <span>{t.vault.title}</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono flex items-center gap-1">
              <Lock className="w-3 h-3" />
              {lang === 'hi' ? 'क्लाइंट-साइड हैशिंग' : 'Client-Side SHA-256'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {t.vault.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('juxtaposition')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-all"
            title="Open Deepfake Comparison Slider"
          >
            <Split className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'hi' ? 'विज़ुअल तुलना' : 'Visual Juxtaposition'}</span>
          </button>

          <button
            onClick={() => setActiveTab('exif')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all"
            title="Inspect Software & Scrub Home GPS Location"
          >
            <FileSearch className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'hi' ? 'EXIF व GPS स्क्रबर' : 'EXIF & GPS Scrubber'}</span>
          </button>

          <button
            onClick={addSimulatedSampleItem}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-brand-tealLight text-xs font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.vault.addSampleBtn}</span>
          </button>
        </div>
      </div>

      {/* Zero-Knowledge Privacy Ribbon */}
      <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{t.vault.privacyNotice}</span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400/80 hidden sm:inline">
          WebCryptoAPI.subtle.digest('SHA-256')
        </span>
      </div>

      {/* Tag Selector */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          {lang === 'hi' ? 'अगली फ़ाइल का वर्गीकरण टैग:' : 'Classification Tag for New Uploads:'}
        </span>
        {Object.entries(tagLabels).map(([key, config]) => {
          const isSel = selectedTag === key;
          return (
            <button
              type="button"
              key={key}
              onClick={() => setSelectedTag(key)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                isSel
                  ? `${config.color} ring-1 ring-white/20 shadow-sm font-semibold`
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
              }`}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-brand-teal bg-brand-teal/10 scale-[1.01]'
            : 'border-slate-700/80 hover:border-slate-600 bg-slate-950/40 hover:bg-slate-900/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          accept="image/*,video/*,application/pdf,text/plain"
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mb-3 shadow-inner">
            <UploadCloud className="w-6 h-6 text-brand-tealLight" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">
            {t.vault.dropTitle}
          </h3>
          <p className="text-xs text-slate-400 max-w-md">
            {t.vault.dropHint}
          </p>
        </div>
      </div>

      {/* Cryptographic Manifest Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-brand-tealLight" />
            <span>{t.vault.tableTitle} ({evidenceFiles.length})</span>
          </h3>

          <span className="text-[11px] text-slate-400">
            {lang === 'hi' ? 'धारा 65B साक्ष्य अनुसूची' : 'Section 65B Admissibility Schedule'}
          </span>
        </div>

        {evidenceFiles.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-500">
            {t.vault.noFiles}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                <tr>
                  <th className="py-3 px-4">{t.vault.thName}</th>
                  <th className="py-3 px-4">{t.vault.thPlatform}</th>
                  <th className="py-3 px-4">{t.vault.thSize}</th>
                  <th className="py-3 px-4">{t.vault.thHash}</th>
                  <th className="py-3 px-4 text-right">{t.vault.thActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {evidenceFiles.map((file) => {
                  const tagConfig = tagLabels[file.tag] || tagLabels.morphedTag;
                  const isCopied = copiedHashId === file.id;

                  return (
                    <tr key={file.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-slate-200 block truncate max-w-[200px] sm:max-w-[280px]">
                              {file.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono block">
                              {formatTimestamp(file.timestamp)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="text-slate-300 font-medium">{file.platform}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] border font-medium ${tagConfig.color}`}>
                            {tagConfig.label}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {formatBytes(file.size)}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <code className="bg-slate-900 px-2 py-1 rounded text-[11px] font-mono text-brand-tealLight border border-slate-800" title={file.hash}>
                            {truncateHash(file.hash, 8)}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopyHash(file.id, file.hash)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            title={t.vault.copyHash}
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {file.previewUrl && (
                            <button
                              type="button"
                              onClick={() => setPreviewItem(file)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                              title={t.vault.previewBtn}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeEvidenceFile(file.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                            title={t.vault.removeBtn}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Local In-Memory Image Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white truncate max-w-md">
                  {previewItem.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  SHA-256: {previewItem.hash}
                </p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 max-h-[60vh] flex items-center justify-center overflow-hidden rounded-xl bg-slate-950 p-2 border border-slate-800">
              <img
                src={previewItem.previewUrl}
                alt="Local evidence preview"
                className="max-h-[55vh] object-contain rounded-lg"
              />
            </div>

            <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'यह पूर्वावलोकन केवल आपकी डिवाइस मेमोरी में है (URL.createObjectURL)।' : 'Strictly local memory preview. This media has never been uploaded.'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
