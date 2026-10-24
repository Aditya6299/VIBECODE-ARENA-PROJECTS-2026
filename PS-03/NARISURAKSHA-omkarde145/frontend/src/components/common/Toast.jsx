import React from 'react';
import { useCase } from '../../context/CaseContext';
import { ShieldCheck, Info } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useCase();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="bg-slate-900/95 border border-brand-teal/50 text-white px-4 py-3 rounded-xl shadow-glow-teal flex items-center gap-3 backdrop-blur-xl text-xs max-w-md">
        <div className="p-1 rounded-md bg-brand-teal/20 text-brand-tealLight">
          <ShieldCheck className="w-4 h-4 text-brand-tealLight" />
        </div>
        <span className="font-medium">{toastMessage}</span>
      </div>
    </div>
  );
};
