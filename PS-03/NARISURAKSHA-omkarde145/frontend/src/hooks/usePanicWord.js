import { useEffect } from 'react';
import { useCase } from '../context/CaseContext';

const PANIC_WORDS = [
  'he is here', 'she is here', 'coming now', 'abort', 'emergency exit',
  'वह आ रहा है', 'वह आ रही है', 'खतरा', 'मदद', 'भागो',
  'delete everything', 'danger now', 'run'
];

export const usePanicWord = () => {
  const { executeQuickExit } = useCase();

  useEffect(() => {
    let buffer = '';
    let bufferTimer = null;

    const handleKeyDown = (e) => {
      // Only track printable characters, not modifier keys
      if (e.key.length === 1) {
        buffer += e.key.toLowerCase();
        // Keep only the last 30 characters in buffer
        if (buffer.length > 30) {
          buffer = buffer.slice(-30);
        }
        // Reset buffer after 3 seconds of no typing
        clearTimeout(bufferTimer);
        bufferTimer = setTimeout(() => { buffer = ''; }, 3000);

        // Check if any panic phrase is in the buffer
        const matched = PANIC_WORDS.some((word) => buffer.includes(word.toLowerCase()));
        if (matched) {
          executeQuickExit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(bufferTimer);
    };
  }, [executeQuickExit]);
};
