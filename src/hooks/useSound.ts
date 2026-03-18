import { useCallback, useRef } from 'react';

export const useSound = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Browser policy requires user gesture to start AudioContext
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playTone = useCallback((frequency: number, type: OscillatorType, duration: number, volumeLevel: number = 0.1) => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
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

      // Disconnect after finished to avoid leaks
      setTimeout(() => {
        oscillator.disconnect();
        gainNode.disconnect();
      }, (duration * 1000) + 100);
    } catch (e) {
      console.error('Audio play error:', e);
    }
  }, []);

  const playSuccess = useCallback(() => {
    playTone(600, 'sine', 0.1, 0.05);
  }, [playTone]);

  const playError = useCallback(() => {
    playTone(150, 'sawtooth', 0.2, 0.1);
  }, [playTone]);

  return { playSuccess, playError };
};
