import React, { useState, useEffect } from 'react';
import { useCase } from '../../context/CaseContext';
import { Download, X, Smartphone } from 'lucide-react';

export const PWAInstallBanner = () => {
  const { lang } = useCase();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('pwa-banner-dismissed')) return;
    
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    sessionStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!showBanner || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-fade-in">
      <div className="glass-card rounded-2xl p-4 border border-brand-teal/40 shadow-glow-teal flex items-start gap-3">
        <div className="p-2 rounded-xl bg-brand-teal/20 text-brand-tealLight flex-shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-white">
            {lang === 'hi' ? 'ऑफ़लाइन उपयोग के लिए इंस्टॉल करें' : 'Install for Offline Use'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {lang === 'hi'
              ? 'इंटरनेट के बिना भी साक्ष्य हैश करें और डॉसियर तैयार करें।'
              : 'Hash evidence and generate dossiers without internet connection.'}
          </p>
          <div className="flex gap-2 mt-2.5">
            <button
              onClick={handleInstall}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-teal text-slate-950 text-[11px] font-bold hover:bg-teal-500 transition-all"
            >
              <Download className="w-3 h-3" />
              <span>{lang === 'hi' ? 'इंस्टॉल करें' : 'Install App'}</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-medium hover:bg-slate-700 border border-slate-700"
            >
              {lang === 'hi' ? 'बाद में' : 'Later'}
            </button>
          </div>
        </div>
        <button onClick={handleDismiss} className="text-slate-500 hover:text-white mt-0.5">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
