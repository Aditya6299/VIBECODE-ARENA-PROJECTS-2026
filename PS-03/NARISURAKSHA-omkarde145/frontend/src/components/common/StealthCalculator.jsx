import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

export const StealthCalculator = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Global F2 toggle & ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPrevVal(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handleOperator = (nextOp) => {
    const inputValue = parseFloat(display);

    if (prevVal === null) {
      setPrevVal(inputValue);
    } else if (operation) {
      const currentVal = prevVal || 0;
      const newVal = calculate(currentVal, inputValue, operation);
      setPrevVal(newVal);
      setDisplay(String(newVal));
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
  };

  const calculate = (first, second, op) => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '×': return first * second;
      case '÷': return second !== 0 ? first / second : 0;
      default: return second;
    }
  };

  const handleEquals = () => {
    // Secret Unlocking Code: "1930" unlocks the decoy
    if (display.trim() === '1930') {
      onClose();
      return;
    }

    const inputValue = parseFloat(display);
    if (prevVal !== null && operation) {
      const result = calculate(prevVal, inputValue, operation);
      setDisplay(String(result));
      setPrevVal(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-4 select-none font-sans">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Top Disguise Header */}
        <div className="flex items-center justify-between text-slate-500 text-xs pb-2 border-b border-slate-800/80">
          <span className="font-mono text-[11px] uppercase tracking-wider">Scientific Calculator v3.1</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-slate-500 hover:text-slate-400 p-1"
              title="Stealth Decoy Info"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 p-1"
              title="Exit Decoy Mode"
            >
              <Unlock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Secret PIN Hint Banner */}
        {showHint && (
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-brand-tealLight block">Decoy Shield Active</span>
            <p>Type <code className="text-white font-mono bg-slate-800 px-1 py-0.5 rounded">1930</code> and press <code className="text-white font-mono bg-slate-800 px-1 py-0.5 rounded">=</code> to unlock your case immediately, or press <code className="text-white font-mono bg-slate-800 px-1 py-0.5 rounded">F2</code>.</p>
          </div>
        )}

        {/* Digital LCD Screen */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/80 text-right space-y-1">
          <div className="text-[11px] font-mono text-slate-500 h-4">
            {prevVal !== null && `${prevVal} ${operation || ''}`}
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-wider overflow-x-auto no-scrollbar">
            {display}
          </div>
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-4 gap-2.5 text-sm font-semibold">
          <button onClick={clearAll} className="p-3.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-900/30 active:scale-95 transition-all">AC</button>
          <button onClick={() => setDisplay(String(-parseFloat(display)))} className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition-all">±</button>
          <button onClick={() => setDisplay(String(parseFloat(display) / 100))} className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition-all">%</button>
          <button onClick={() => handleOperator('÷')} className="p-3.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 active:scale-95 transition-all">÷</button>

          <button onClick={() => handleDigit(7)} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/80 active:scale-95 transition-all">7</button>
          <button onClick={() => handleDigit(8)} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/80 active:scale-95 transition-all">8</button>
          <button onClick={() => handleDigit(9)} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/80 active:scale-95 transition-all">9</button>
          <button onClick={() => handleOperator('×')} className="p-3.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 active:scale-95 transition-all">×</button>

          <button onClick={() => handleDigit(4)} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/80 active:scale-95 transition-all">4</button>
          <button onClick={() => handleDigit(5)} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/80 active:scale-95 transition-all">5</button>
          <button onClick={() => handleDigit(6)} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/80 active:scale-95 transition-all">6</button>
          <button onClick={() => handleOperator('-')} className="p-3.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 active:scale-95 transition-all">−</button>

          <button onClick={() => handleDigit(1)} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/80 active:scale-95 transition-all">1</button>
          <button onClick={() => handleDigit(2)} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/80 active:scale-95 transition-all">2</button>
          <button onClick={() => handleDigit(3)} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/80 active:scale-95 transition-all">3</button>
          <button onClick={() => handleOperator('+')} className="p-3.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 active:scale-95 transition-all">+</button>

          <button onClick={() => handleDigit(0)} className="col-span-2 p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/80 text-left pl-6 active:scale-95 transition-all">0</button>
          <button onClick={handleDecimal} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/80 active:scale-95 transition-all">.</button>
          <button onClick={handleEquals} className="p-3.5 rounded-xl bg-brand-teal hover:bg-teal-500 text-slate-950 font-bold border border-teal-400 active:scale-95 transition-all shadow-glow-teal">=</button>
        </div>

        <div className="pt-2 text-center text-[10px] text-slate-600">
          Press <kbd className="font-mono text-slate-400">F2</kbd> or enter PIN <kbd className="font-mono text-slate-400">1930 =</kbd> to unlock
        </div>
      </div>
    </div>
  );
};
