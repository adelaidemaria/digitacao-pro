import { useCallback, useRef } from 'react';

export const useSound = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playTone = useCallback((frequency: number, type: OscillatorType, duration: number, volumeLevel: number = 0.1) => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volumeLevel, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  }, []);

  const playSuccess = useCallback(() => {
    // A pleasant soft "pop" or high pitched short beep
    playTone(600, 'sine', 0.1, 0.05);
  }, [playTone]);

  const playError = useCallback(() => {
    // A low pitched harsh beep
    playTone(150, 'sawtooth', 0.2, 0.1);
  }, [playTone]);

  return { playSuccess, playError };
};
