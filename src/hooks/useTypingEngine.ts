import { useState, useEffect, useCallback } from 'react';
import { sounds } from '../services/soundService';

interface TypingStats {
  wpm: number;
  accuracy: number;
  errors: number;
  correct: number;
  startTime: number | null;
  endTime: number | null;
}

export const useTypingEngine = (text: string, settings: any, disabled: boolean = false) => {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    correct: 0,
    startTime: null,
    endTime: null,
  });

  const reset = useCallback(() => {
    setInput('');
    setStats({
      wpm: 0,
      accuracy: 100,
      errors: 0,
      correct: 0,
      startTime: null,
      endTime: null,
    });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (disabled || stats.endTime) return;
    if (e.key.length > 1 && e.key !== 'Backspace' && e.key !== ' ') return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    e.preventDefault();

    const targetChar = text[input.length];
    const typedChar = e.key;

    if (typedChar === 'Backspace') {
      // We don't allow backspace in beginner mode to force focus on next key
      // but we can enable it for advanced. For now, let's keep it simple.
      return;
    }

    if (!stats.startTime) {
      setStats(prev => ({ ...prev, startTime: Date.now() }));
    }

    if (typedChar === targetChar) {
      setInput(prev => prev + typedChar);
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setStats(prev => ({ ...prev, errors: prev.errors + 1 }));
    }
  }, [input, text, stats.startTime, stats.endTime, disabled]);

  useEffect(() => {
    if (input.length === text.length && text.length > 0 && !stats.endTime) {
      const endTime = Date.now();
      const durationInMinutes = (endTime - (stats.startTime || endTime)) / 60000;
      const wpm = Math.round((text.length / 5) / (durationInMinutes || 1));
      const accuracy = Math.round((stats.correct / (stats.correct + stats.errors)) * 100);
      
      setStats(prev => ({ ...prev, endTime, wpm, accuracy }));
    }
  }, [input, text, stats]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { input, stats, reset };
};
