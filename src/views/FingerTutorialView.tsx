import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, Keyboard, MousePointer2 } from 'lucide-react';
import { VirtualKeyboard } from '../components/VirtualKeyboard';

interface GhostHandsProps {
  activeKey: string;
}

const GhostHands: React.FC<GhostHandsProps> = ({ activeKey }) => {
  // Finger mapping based on ABNT2/QWERTY standard
  const getFinger = (key: string): string | null => {
    const k = key.toUpperCase();
    if (['A', 'Q', 'Z', '1'].includes(k)) return 'L_PINKY';
    if (['S', 'W', 'X', '2'].includes(k)) return 'L_RING';
    if (['D', 'E', 'C', '3'].includes(k)) return 'L_MIDDLE';
    if (['F', 'R', 'V', '4', 'G', 'T', 'B', '5'].includes(k)) return 'L_INDEX';
    if (['J', 'U', 'M', '7', 'H', 'Y', 'N', '6'].includes(k)) return 'R_INDEX';
    if (['K', 'I', ',', '8'].includes(k)) return 'R_MIDDLE';
    if (['L', 'O', '.', '9'].includes(k)) return 'R_RING';
    if (['Ç', 'P', ';', '0'].includes(k)) return 'R_PINKY';
    if (k === ' ' || k === 'ESPAÇO') return 'THUMBS';
    return null;
  };

  const activeFinger = getFinger(activeKey);

  // SVG for hands - Grounded below the Space bar and fingertips on the bottom row
  return (
    <div className="relative w-full max-w-4xl mx-auto h-[320px] mt-3 cursor-none pointer-events-none z-30">
      <svg viewBox="0 0 800 300" className="w-full h-full drop-shadow-2xl overflow-visible">
        {/* Left Hand - Lowered even more to align fingertips with bottom row */}
        <g transform="translate(100, 295)" className="text-zinc-500 dark:text-zinc-500">
          {/* Palm */}
          <path d="M40,180 Q20,160 20,120 Q20,80 50,60 Q80,40 120,60 Q150,80 150,120 Q150,160 130,180 Z" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-40" />
          
          {/* Fingers - Reverted to original sizes */}
          {/* Pinky */}
          <rect x="15" y="60" width="24" height="70" rx="12" 
            className={`transition-all duration-300 ${activeFinger === 'L_PINKY' ? 'text-emerald-500 fill-emerald-500 opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'fill-currentColor opacity-30'}`} />
          {/* Ring */}
          <rect x="45" y="20" width="26" height="95" rx="13" 
            className={`transition-all duration-300 ${activeFinger === 'L_RING' ? 'text-emerald-500 fill-emerald-500 opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'fill-currentColor opacity-30'}`} />
          {/* Middle */}
          <rect x="78" y="0" width="28" height="105" rx="14" 
            className={`transition-all duration-300 ${activeFinger === 'L_MIDDLE' ? 'text-emerald-500 fill-emerald-500 opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'fill-currentColor opacity-30'}`} />
          {/* Index */}
          <rect x="115" y="25" width="26" height="95" rx="13" 
            className={`transition-all duration-300 ${activeFinger === 'L_INDEX' ? 'text-emerald-500 fill-emerald-500 opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'fill-currentColor opacity-30'}`} />
          {/* Thumb */}
          <rect x="150" y="110" width="45" height="24" rx="12" transform="rotate(-30 150 110)"
            className={`transition-all duration-300 ${activeFinger === 'THUMBS' ? 'text-emerald-500 fill-emerald-500 opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'fill-currentColor opacity-30'}`} />
        </g>

        {/* Right Hand - Lowered even more to align fingertips with bottom row */}
        <g transform="translate(500, 295)" className="text-zinc-500 dark:text-zinc-500">
          {/* Palm */}
          <path d="M40,180 Q20,160 20,120 Q20,80 50,60 Q80,40 120,60 Q150,80 150,120 Q150,160 130,180 Z" transform="scale(-1, 1) translate(-150, 0)" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-40" />
          
          {/* Fingers - Reversed order for right hand, reverted sizes */}
          {/* Thumb */}
          <rect x="-40" y="110" width="45" height="24" rx="12" transform="rotate(30 -40 110)"
            className={`transition-all duration-300 ${activeFinger === 'THUMBS' ? 'text-emerald-500 fill-emerald-500 opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'fill-currentColor opacity-30'}`} />
          {/* Index */}
          <rect x="15" y="25" width="26" height="95" rx="13" 
            className={`transition-all duration-300 ${activeFinger === 'R_INDEX' ? 'text-emerald-500 fill-emerald-500 opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'fill-currentColor opacity-30'}`} />
          {/* Middle */}
          <rect x="52" y="0" width="28" height="105" rx="14" 
            className={`transition-all duration-300 ${activeFinger === 'R_MIDDLE' ? 'text-emerald-500 fill-emerald-500 opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'fill-currentColor opacity-30'}`} />
          {/* Ring */}
          <rect x="90" y="20" width="26" height="95" rx="13" 
            className={`transition-all duration-300 ${activeFinger === 'R_RING' ? 'text-emerald-500 fill-emerald-500 opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'fill-currentColor opacity-30'}`} />
          {/* Pinky */}
          <rect x="120" y="60" width="24" height="70" rx="12" 
            className={`transition-all duration-300 ${activeFinger === 'R_PINKY' ? 'text-emerald-500 fill-emerald-500 opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'fill-currentColor opacity-30'}`} />
        </g>
      </svg>
    </div>
  );
};

export const FingerTutorialView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const steps = [
    { key: 'A', hand: 'Esquerda', finger: 'Mínimo' },
    { key: 'S', hand: 'Esquerda', finger: 'Anelar' },
    { key: 'D', hand: 'Esquerda', finger: 'Médio' },
    { key: 'F', hand: 'Esquerda', finger: 'Indicador' },
    { key: 'G', hand: 'Esquerda', finger: 'Indicador (Estendido)' },
    { key: 'Ç', hand: 'Direita', finger: 'Mínimo' },
    { key: 'L', hand: 'Direita', finger: 'Anelar' },
    { key: 'K', hand: 'Direita', finger: 'Médio' },
    { key: 'J', hand: 'Direita', finger: 'Indicador' },
    { key: 'H', hand: 'Direita', finger: 'Indicador (Estendido)' },
    { key: ' ', hand: 'Ambas', finger: 'Polegar' },
  ];

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const currentStep = steps[currentStepIdx];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return;
      
      const pressedKey = e.key.toUpperCase();
      const targetKey = currentStep.key === ' ' ? ' ' : currentStep.key;

      // Special case for Ç
      if (pressedKey === targetKey || (targetKey === 'Ç' && (e.key === 'ç' || e.key === 'Ç'))) {
        if (currentStepIdx < steps.length - 1) {
          setCurrentStepIdx(prev => prev + 1);
        } else {
          setIsCompleted(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIdx, isCompleted, currentStep.key, steps.length]);

  return (
    <div className="min-h-screen bg-[#f4f7fa] dark:bg-zinc-950 p-4 md:p-8 font-sans overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800 group"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <MousePointer2 className="w-4 h-4 text-amber-500" />
                <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">Aula Teste</h1>
              </div>
              <p className="text-zinc-400 dark:text-zinc-500 font-bold uppercase text-[9px] tracking-[0.2em]">Posicionamento dos dedos na fileira central</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest">Passo</span>
              <span className="text-sm font-black text-blue-500">{currentStepIdx + 1} / {steps.length}</span>
            </div>
            <div className="w-24 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${((currentStepIdx + (isCompleted ? 1 : 0)) / steps.length) * 100}%` }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key="tutorial"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-4"
            >
              {/* Instruction Area - Further Reduced White Space */}
              <div className="bg-white dark:bg-zinc-900 p-4 md:p-5 rounded-[40px] border border-zinc-200/50 dark:border-zinc-800 shadow-xl shadow-black/5 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-black rounded-lg border border-blue-100 dark:border-blue-500/20 mb-2 uppercase tracking-widest mt-[-4px]">
                  PASSO {currentStepIdx + 1} DE {steps.length}
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight">
                  Pressione a tecla <span className="text-blue-500 bg-blue-500/5 px-8 py-1 rounded-3xl border-2 border-blue-500/10 inline-block min-w-[100px]">
                    {currentStep.key === ' ' ? 'ESPAÇO' : currentStep.key}
                  </span>
                </h2>

                <div className="flex items-center justify-center gap-8 bg-zinc-50 dark:bg-zinc-800/50 px-8 py-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 min-w-[320px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">Mão:</span>
                    <span className="text-lg font-black text-zinc-800 dark:text-zinc-200 uppercase">{currentStep.hand}</span>
                  </div>
                  <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">Dedo:</span>
                    <span className="text-lg font-black text-emerald-500 uppercase">{currentStep.finger}</span>
                  </div>
                </div>
              </div>

              {/* Keyboard Area - Reduced Top Spacing by ~30% */}
              <div className="relative pt-6">
                <VirtualKeyboard activeKey={currentStep.key === ' ' ? ' ' : currentStep.key} />
                <div className="absolute inset-0 top-0 left-0 right-0 -mt-26 z-20 pointer-events-none">
                  <GhostHands activeKey={currentStep.key} />
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20 p-5 rounded-[28px] flex items-center gap-5 max-w-xl mx-auto">
                <div className="shrink-0 w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-md animate-pulse">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <p className="text-amber-800 dark:text-amber-400 font-bold text-xs leading-relaxed italic">
                  Utilize o dedo destacado acima para digitar sem olhar!
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto bg-white dark:bg-zinc-900 p-8 rounded-[48px] border border-zinc-200 dark:border-zinc-800 shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-emerald-500 text-white rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30 transform rotate-[-5deg]">
                <CheckCircle className="w-10 h-10" />
              </div>
              
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-3 tracking-tighter uppercase">Aula Concluída!</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-bold mb-8 leading-relaxed">
                As posições básicas foram aprendidas. Agora você pode prosseguir para o curso.
              </p>

              <div className="space-y-3">
                <button 
                  onClick={onBack}
                  className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                >
                  Ir para o Curso <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    setCurrentStepIdx(0);
                    setIsCompleted(false);
                  }}
                  className="w-full py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-black rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all uppercase tracking-widest text-xs"
                >
                  Repetir Tutorial
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Lightbulb = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);
