import { useState, useEffect, useCallback, useRef } from 'react';

interface TypingStats {
  wpm: number;
  accuracy: number;
  errors: number;
  correct: number;
  startTime: number | null;
  endTime: number | null;
  duration_seconds: number;
}

export const useTypingEngine = (text: string, settings: any, disabled: boolean = false) => {
  const [input, setInput] = useState('');
  const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set());
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    correct: 0,
    startTime: null,
    endTime: null,
    duration_seconds: 0,
  });

  // Use refs to keep track of current state inside the event listener without dependencies
  const inputRef = useRef('');
  const errorIndicesRef = useRef<Set<number>>(new Set());
  const consecutiveErrorsRef = useRef(0);
  const statsRef = useRef<TypingStats>({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    correct: 0,
    startTime: null,
    endTime: null,
    duration_seconds: 0,
  });

  const reset = useCallback(() => {
    setInput('');
    inputRef.current = '';
    setErrorIndices(new Set());
    errorIndicesRef.current = new Set();
    setConsecutiveErrors(0);
    consecutiveErrorsRef.current = 0;
    const initialStats = {
      wpm: 0,
      accuracy: 100,
      errors: 0,
      correct: 0,
      startTime: null,
      endTime: null,
      duration_seconds: 0,
    };
    setStats(initialStats);
    statsRef.current = initialStats;
  }, []);

  const startTimer = useCallback(() => {
    if (!statsRef.current.startTime) {
      setStats(prev => ({ ...prev, startTime: Date.now() }));
    }
  }, []);

  // Sync state to refs whenever they change (for resetting etc)
  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    errorIndicesRef.current = errorIndices;
  }, [errorIndices]);

  useEffect(() => {
    consecutiveErrorsRef.current = consecutiveErrors;
  }, [consecutiveErrors]);

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (disabled || statsRef.current.endTime) return;
    
    // Ignore control keys, but allow Space (single char)
    if (e.key.length > 1 && e.key !== 'Backspace' && e.key !== 'Enter' && e.key !== 'Tab') return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    e.preventDefault();

    const currentInput = inputRef.current;
    if (currentInput.length >= text.length) return;

    const targetChar = text[currentInput.length];
    const typedChar = e.key;

    if (typedChar === 'Backspace') {
      // Logic for backspace if needed, but for now we keep the original logic
      return;
    }

    if (!statsRef.current.startTime) {
      setStats(prev => ({ ...prev, startTime: Date.now() }));
    }

    if (typedChar === targetChar) {
      const newInput = currentInput + typedChar;
      setInput(newInput);
      setConsecutiveErrors(0);
      consecutiveErrorsRef.current = 0;
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      
      // Finished the lesson?
      if (newInput.length === text.length) {
        const endTime = Date.now();
        setStats(prev => {
          const startTime = prev.startTime || endTime;
          const duration_seconds = Math.round((endTime - startTime) / 1000);
          const durationInMinutes = Math.max(duration_seconds / 60, 0.01);
          const wpm = Math.round((text.length / 5) / durationInMinutes);
          const totalAttempts = prev.correct + 1 + prev.errors;
          const accuracy = totalAttempts > 0 ? Math.round(((prev.correct + 1) / totalAttempts) * 100) : 100;
          return { ...prev, endTime, wpm, accuracy, correct: prev.correct + 1, duration_seconds };
        });
      }
    } else {
      // Increment consecutive errors
      const newConsecutive = consecutiveErrorsRef.current + 1;
      setConsecutiveErrors(newConsecutive);
      consecutiveErrorsRef.current = newConsecutive;

      // Mark this index as an error if it hasn't been already
      if (!errorIndicesRef.current.has(currentInput.length)) {
        const newErrorIndices = new Set(errorIndicesRef.current);
        newErrorIndices.add(currentInput.length);
        setErrorIndices(newErrorIndices);
        errorIndicesRef.current = newErrorIndices;
      }

      setStats(prev => {
        const totalAttempts = prev.correct + prev.errors + 1;
        const accuracy = totalAttempts > 0 ? Math.round((prev.correct / totalAttempts) * 100) : 100;
        return { ...prev, errors: prev.errors + 1, accuracy };
      });
    }
  }, [text, disabled]);

  // Update duration every second if started and not finished
  useEffect(() => {
    let interval: any;
    if (stats.startTime && !stats.endTime) {
      interval = setInterval(() => {
        setStats(prev => {
          if (prev.endTime) return prev;
          const now = Date.now();
          const duration_seconds = Math.round((now - (prev.startTime || now)) / 1000);
          return { ...prev, duration_seconds };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stats.startTime, stats.endTime]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { input, errorIndices, consecutiveErrors, stats, reset, startTimer };
};
