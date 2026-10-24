import React, { useState, useEffect } from 'react';
import { useCase } from '../../context/CaseContext';
import {
  saveEncryptedCase,
  loadEncryptedCase,
  hasSavedCase,
  deleteEncryptedCase
} from '../../utils/encryptedVault';
import {
  HardDrive, Lock, Unlock, KeyRound, Save, Trash2,
  ShieldCheck, AlertTriangle, Eye, EyeOff, CheckCircle2
} from 'lucide-react';

export const CaseVaultManager = () => {
  const {
    lang, intakeData, checklist, timelineEvents, evidenceFiles,
    updateIntakeData, setActiveTab, showToast
  } = useCase();

  const [hasSaved, setHasSaved] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [mode, setMode] = useState(null); // 'save' | 'load' | 'delete' | null
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    hasSavedCase().then(has => setHasSaved(has));
  }, []);

  const handleSave = async () => {
    if (!passphrase || passphrase.length < 8) {
      setError(lang === 'hi' ? 'पासफ़्रेज़ कम से कम 8 अक्षरों का होना चाहिए।' : 'Passphrase must be at least 8 characters.');
      return;
    }
    if (passphrase !== confirmPassphrase) {
      setError(lang === 'hi' ? 'पासफ़्रेज़ मेल नहीं खाते।' : 'Passphrases do not match.');
      return;
    }
    setIsProcessing(true);
    setError('');
    try {
      const caseData = {
        intakeData,
        checklist,
        timelineEvents,
        evidenceFiles: evidenceFiles.map(f => ({
          ...f,
          previewUrl: null // Never persist blob URLs
        }))
      };
      const result = await saveEncryptedCase(passphrase, caseData);
      setHasSaved(true);
      setSavedAt(result.savedAt);
      setSuccess(lang === 'hi' ? 'केस AES-256-GCM के साथ सफलतापूर्वक एन्क्रिप्ट और सहेजा गया!' : 'Case encrypted with AES-256-GCM and saved to local vault!');
      showToast(lang === 'hi' ? '🔒 केस एन्क्रिप्टेड वॉल्ट में सुरक्षित हो गया!' : '🔒 Case securely saved to encrypted local vault!');
      setMode(null);
      setPassphrase('');
      setConfirmPassphrase('');
    } catch (err) {
      setError(lang === 'hi' ? 'सहेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।' : 'Error saving case. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoad = async () => {
    if (!passphrase) {
      setError(lang === 'hi' ? 'कृपया पासफ़्रेज़ दर्ज करें।' : 'Please enter your passphrase.');
      return;
    }
    setIsProcessing(true);
    setError('');
    try {
      const result = await loadEncryptedCase(passphrase);
      if (!result) {
        setError(lang === 'hi' ? 'कोई सहेजा हुआ केस नहीं मिला।' : 'No saved case found in vault.');
        return;
      }
      if (result.error === 'WRONG_PASSPHRASE') {
        setError(lang === 'hi' ? 'गलत पासफ़्रेज़। कृपया पुनः प्रयास करें।' : 'Incorrect passphrase. Please try again.');
        return;
      }
      const { data } = result;
      if (data.intakeData) updateIntakeData(data.intakeData);
      setSavedAt(result.savedAt);
      setSuccess(lang === 'hi' ? `केस सफलतापूर्वक लोड किया गया! (सहेजा: ${new Date(result.savedAt).toLocaleString('en-IN')})` : `Case loaded successfully! (Saved: ${new Date(result.savedAt).toLocaleString('en-IN')})`);
      showToast(lang === 'hi' ? '🔓 एन्क्रिप्टेड केस सफलतापूर्वक पुनर्स्थापित हो गया!' : '🔓 Encrypted case successfully restored!');
      setMode(null);
      setPassphrase('');
    } catch (err) {
      setError(lang === 'hi' ? 'लोड करने में त्रुटि।' : 'Error loading case.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    await deleteEncryptedCase();
    setHasSaved(false);
    setSavedAt(null);
    setSuccess(lang === 'hi' ? 'एन्क्रिप्टेड वॉल्ट स्थायी रूप से हटा दिया गया।' : 'Encrypted vault permanently deleted.');
    showToast(lang === 'hi' ? 'वॉल्ट हटाया गया।' : 'Encrypted vault wiped.');
    setMode(null);
    setIsProcessing(false);
  };

  return (
    <div className="bg-slate-900/70 border border-brand-teal/20 rounded-2xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-brand-teal/10 border border-brand-teal/30">
            <HardDrive className="w-4 h-4 text-brand-tealLight" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">
              {lang === 'hi' ? 'AES-256 एन्क्रिप्टेड लोकल केस वॉल्ट' : 'AES-256-GCM Encrypted Local Case Vault'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {lang === 'hi'
                ? 'पृष्ठ ताज़ा होने पर भी केस सुरक्षित रहे — पासफ़्रेज़ से लॉक'
                : 'Persist your case across page refreshes — passphrase-locked on-device only'}
            </p>
          </div>
        </div>

        {hasSaved && savedAt && (
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {lang === 'hi' ? 'सुरक्षित सहेजा गया' : 'Encrypted Save Found'}
            </span>
            <span className="text-[10px] text-slate-500 block font-mono">
              {new Date(savedAt).toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!mode && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setMode('save'); setError(''); setSuccess(''); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-teal/20 hover:bg-brand-teal/30 border border-brand-teal/40 text-brand-tealLight text-xs font-semibold transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'केस सहेजें' : 'Save Case'}</span>
          </button>

          {hasSaved && (
            <button
              onClick={() => { setMode('load'); setError(''); setSuccess(''); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-all"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'केस लोड करें' : 'Load Saved Case'}</span>
            </button>
          )}

          {hasSaved && (
            <button
              onClick={() => { setMode('delete'); setError(''); setSuccess(''); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'वॉल्ट हटाएँ' : 'Wipe Vault'}</span>
            </button>
          )}
        </div>
      )}

      {/* Save Form */}
      {mode === 'save' && (
        <div className="space-y-3 animate-fade-in bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-tealLight">
              {lang === 'hi' ? 'पासफ़्रेज़ सेट करें (कम से कम 8 अक्षर)' : 'Set Encryption Passphrase (min 8 chars)'}
            </span>
            <button onClick={() => setMode(null)} className="text-slate-500 hover:text-white">✕</button>
          </div>

          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={passphrase}
              onChange={e => { setPassphrase(e.target.value); setError(''); }}
              placeholder={lang === 'hi' ? 'पासफ़्रेज़ दर्ज करें...' : 'Enter passphrase...'}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal pr-9"
            />
            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          <input
            type={showPass ? 'text' : 'password'}
            value={confirmPassphrase}
            onChange={e => { setConfirmPassphrase(e.target.value); setError(''); }}
            placeholder={lang === 'hi' ? 'पासफ़्रेज़ पुनः दर्ज करें...' : 'Confirm passphrase...'}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-teal"
          />

          {error && <p className="text-[11px] text-rose-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{error}</p>}

          <div className="text-[11px] text-slate-500 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
            ⚠️ {lang === 'hi'
              ? 'यह पासफ़्रेज़ कभी संग्रहीत नहीं होता। इसे भूलने पर केस पुनः प्राप्त नहीं किया जा सकता।'
              : 'This passphrase is NEVER stored. If you forget it, the case cannot be recovered.'}
          </div>

          <div className="flex gap-2">
            <button onClick={() => setMode(null)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs">
              {lang === 'hi' ? 'रद्द' : 'Cancel'}
            </button>
            <button onClick={handleSave} disabled={isProcessing} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-brand-teal text-slate-950 font-bold text-xs disabled:opacity-50">
              <Lock className="w-3 h-3" />
              <span>{isProcessing ? (lang === 'hi' ? 'एन्क्रिप्ट हो रहा है...' : 'Encrypting...') : (lang === 'hi' ? 'एन्क्रिप्ट करके सहेजें' : 'Encrypt & Save')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Load Form */}
      {mode === 'load' && (
        <div className="space-y-3 animate-fade-in bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300">
              {lang === 'hi' ? 'सहेजा हुआ केस लोड करें' : 'Decrypt & Load Saved Case'}
            </span>
            <button onClick={() => setMode(null)} className="text-slate-500 hover:text-white">✕</button>
          </div>

          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={passphrase}
              onChange={e => { setPassphrase(e.target.value); setError(''); }}
              placeholder={lang === 'hi' ? 'पासफ़्रेज़ दर्ज करें...' : 'Enter your passphrase...'}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 pr-9"
            />
            <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          {error && <p className="text-[11px] text-rose-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{error}</p>}

          <div className="flex gap-2">
            <button onClick={() => setMode(null)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs">
              {lang === 'hi' ? 'रद्द' : 'Cancel'}
            </button>
            <button onClick={handleLoad} disabled={isProcessing} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs disabled:opacity-50">
              <Unlock className="w-3 h-3" />
              <span>{isProcessing ? (lang === 'hi' ? 'डिक्रिप्ट हो रहा है...' : 'Decrypting...') : (lang === 'hi' ? 'डिक्रिप्ट करके लोड करें' : 'Decrypt & Load')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {mode === 'delete' && (
        <div className="space-y-3 animate-fade-in bg-rose-950/20 p-4 rounded-xl border border-rose-500/30">
          <p className="text-xs text-rose-300 font-semibold">
            {lang === 'hi' ? '⚠️ क्या आप वाकई एन्क्रिप्टेड वॉल्ट को स्थायी रूप से हटाना चाहते हैं?' : '⚠️ Permanently delete the encrypted vault? This cannot be undone.'}
          </p>
          <div className="flex gap-2">
            <button onClick={() => setMode(null)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs">
              {lang === 'hi' ? 'रद्द' : 'Cancel'}
            </button>
            <button onClick={handleDelete} disabled={isProcessing} className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs disabled:opacity-50">
              {isProcessing ? (lang === 'hi' ? 'हटाया जा रहा है...' : 'Deleting...') : (lang === 'hi' ? 'हाँ, स्थायी रूप से हटाएं' : 'Yes, Permanently Delete')}
            </button>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {success && !mode && (
        <div className="flex items-center gap-2 text-[11px] text-emerald-300 bg-emerald-950/30 px-3 py-2 rounded-lg border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
};
