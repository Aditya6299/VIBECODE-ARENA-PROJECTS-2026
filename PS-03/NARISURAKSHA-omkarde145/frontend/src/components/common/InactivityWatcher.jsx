import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCase } from '../../context/CaseContext';
import { ShieldAlert, X } from 'lucide-react';

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const WARNING_BEFORE_MS = 30 * 1000; // 30-second warning countdown

export const InactivityWatcher = () => {
  const { executeQuickExit, lang } = useCase();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inactivityTimer = useRef(null);
  const countdownTimer = useRef(null);

  const resetTimer = useCallback(() => {
    if (showWarning) return; // Don't reset if warning is active
    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(30);
    }, INACTIVITY_TIMEOUT_MS - WARNING_BEFORE_MS);
  }, [showWarning]);

  const stayActive = () => {
    setShowWarning(false);
    setCountdown(30);
    clearInterval(countdownTimer.current);
    resetTimer();
  };

  // Start inactivity detection
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearTimeout(inactivityTimer.current);
    };
  }, [resetTimer]);

  // Countdown when warning is active
  useEffect(() => {
    if (!showWarning) return;
    countdownTimer.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer.current);
          executeQuickExit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdownTimer.current);
  }, [showWarning, executeQuickExit]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
      <div className="bg-slate-900 border border-rose-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-rose-950/60 border-2 border-rose-500/60 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-10 h-10 text-rose-400" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-2">
            {lang === 'hi' ? 'निष्क्रियता चेतावनी' : 'Inactivity Warning'}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {lang === 'hi'
              ? 'आपकी सुरक्षा के लिए, निष्क्रियता के कारण सत्र स्वचालित रूप से समाप्त हो जाएगा।'
              : 'For your safety, this session will automatically wipe and exit due to inactivity.'}
          </p>
        </div>

        {/* Countdown Ring */}
        <div className="relative w-24 h-24 mx-auto">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="40" fill="none" stroke="#1E293B" strokeWidth="8" />
            <circle
              cx="48" cy="48" r="40" fill="none"
              stroke="#F43F5E" strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - countdown / 30)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold font-mono text-rose-400">{countdown}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={executeQuickExit}
            className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-all"
          >
            {lang === 'hi' ? 'अभी बाहर निकलें' : 'Exit Now'}
          </button>
          <button
            onClick={stayActive}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all"
          >
            {lang === 'hi' ? 'सत्र जारी रखें' : 'Stay Active'}
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          {lang === 'hi'
            ? 'सत्र डेटा और साक्ष्य स्मृति से पूरी तरह हटा दिए जाएंगे।'
            : 'All session data and evidence hashes will be purged from memory.'}
        </p>
      </div>
    </div>
  );
};
