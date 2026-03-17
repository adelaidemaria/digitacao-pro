import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { useSettings } from '../contexts/SettingsContext';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { useSound } from '../hooks/useSound';
import { Trophy, RotateCcw, ArrowRight, LayoutGrid, Award, Play, Video, ExternalLink, X } from 'lucide-react';
import { Lesson } from '../types';
import confetti from 'canvas-confetti';

interface TypingViewProps {
  lesson: Lesson;
  lessons: Lesson[];
  onComplete: (stats: any, navigateTo?: 'next' | 'dashboard' | 'none') => void;
  onBack: () => void;
  hasNextLesson?: boolean;
  onOpenCourses: () => void;
}

export const TypingView: React.FC<TypingViewProps> = ({ lesson, lessons, onComplete, onBack, hasNextLesson, onOpenCourses }) => {
  const { settings } = useSettings();
  const [isStarted, setIsStarted] = useState(false);
  const { input, stats, reset } = useTypingEngine(lesson.content, settings, !isStarted);
  const { playSuccess, playError } = useSound();
  const [showResults, setShowResults] = useState(false);
  
  const [prevInputLength, setPrevInputLength] = useState(0);
  const [prevErrors, setPrevErrors] = useState(0);

  const hasNumbers = /\d/.test(lesson.content);
  const showNumeric = settings.showNumeric || hasNumbers;

  // Find next lessons
  const currentIndex = lessons.findIndex(l => l.id === lesson.id);
  const nextLessons = lessons.slice(currentIndex + 1, currentIndex + 4);

  useEffect(() => {
    if (!settings.soundEnabled) return;
    if (input.length > prevInputLength) {
      if (!settings.soundOnErrorOnly) playSuccess();
      setPrevInputLength(input.length);
    }
    if (stats.errors > prevErrors) {
      playError();
      setPrevErrors(stats.errors);
    }
  }, [input.length, stats.errors, settings.soundEnabled, settings.soundOnErrorOnly, playSuccess, playError, prevInputLength, prevErrors]);

  useEffect(() => {
    if (stats.endTime && !showResults) {
      setShowResults(true);
      // Auto-save results immediately without navigating
      onComplete(stats, 'none');
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b']
      });
    }
  }, [stats.endTime, showResults, stats, onComplete]);

  const handleReset = () => {
    setPrevInputLength(0);
    setPrevErrors(0);
    setShowResults(false);
    setIsStarted(false);
    reset();
  };

  const handleBack = () => {
    // If finished, just go back. If not, cancel (delete progress)
    if (showResults) {
      onComplete(stats, 'dashboard');
    } else {
      onBack();
    }
  };

  useEffect(() => {
    handleReset();
  }, [lesson.id]);

  const targetChar = lesson.content[input.length] || '';

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1400px] mx-auto p-4 md:p-8 min-h-[calc(100vh-80px)]">
      
      {/* Side Menu */}
      <aside className="w-full lg:w-80 flex flex-col gap-6 order-2 lg:order-1">
        <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 flex-1 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-120px)]">
          
          <button 
            onClick={handleBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-300 font-black text-lg transition-all shadow-sm border-2 border-transparent"
          >
            <RotateCcw className="w-5 h-5 -scale-x-100" /> 
            <span>VOLTAR</span>
          </button>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-zinc-900 dark:text-white text-lg leading-tight">{lesson.title}</h3>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Módulo Atual</span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Próximas Lições</h4>
              {nextLessons.length > 0 ? nextLessons.map((l, i) => (
                <div key={l.id} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 opacity-60">
                  <div className="w-6 h-6 rounded bg-white dark:bg-zinc-700 flex items-center justify-center text-[10px] font-black text-zinc-400">
                    {currentIndex + i + 2}
                  </div>
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 truncate">{l.title}</span>
                </div>
              )) : (
                <p className="text-[10px] font-bold text-zinc-400 italic">Módulo finalizado!</p>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Suas Conquistas</h4>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`aspect-square rounded-lg flex items-center justify-center border-2 ${i <= 2 ? 'bg-amber-50 border-amber-200 text-amber-500' : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-800 text-zinc-300'}`}>
                    <Award className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
            <button 
              onClick={onOpenCourses}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-black text-sm rounded-xl transition-all border-2 border-blue-200/50 dark:border-blue-500/30 group"
            >
              <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>+ CURSOS</span>
            </button>
          </div>

          <div className="mt-auto pt-2">
            <button 
              onClick={handleReset}
              className="w-full py-3.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-base rounded-xl transition-all flex items-center justify-center gap-3 border-2 border-emerald-200/50 dark:border-emerald-500/30"
            >
              <RotateCcw className="w-4 h-4" /> REINICIAR LIÇÃO
            </button>
          </div>
        </div>
      </aside>

      {/* Main Typing Area */}
      <main className="flex-1 flex flex-col gap-6 order-1 lg:order-2 justify-center max-w-full">
        <div 
          className="relative w-full bg-white dark:bg-zinc-900 p-8 md:p-10 rounded-[32px] shadow-sm border border-zinc-200 dark:border-zinc-800 min-h-[220px] flex items-center justify-center overflow-hidden"
          style={{ fontSize: `${settings.fontSize * 1.4}px` }}
        >
          <AnimatePresence mode="wait">
            {!isStarted ? (
              <motion.button 
                key="start-btn"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                autoFocus
                onClick={() => setIsStarted(true)}
                className="px-10 py-5 bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-500/50 outline-none text-white font-black text-xl rounded-[24px] shadow-xl shadow-emerald-500/30 transition-all flex items-center gap-4 z-10"
              >
                <div className="p-2 bg-white/20 rounded-xl shadow-inner">
                  <Play className="w-6 h-6 fill-white" />
                </div>
                INICIAR LIÇÃO
              </motion.button>
            ) : (
              <motion.div 
                key="typing-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-[0.1em] font-mono leading-relaxed tracking-wide justify-center max-w-5xl w-full"
              >
                {lesson.content.split('').map((char, i) => {
                  let color = 'text-zinc-200 dark:text-zinc-800';
                  let extraClasses = '';
                  if (i < input.length) color = 'text-zinc-800 dark:text-white opacity-20';
                  if (i === input.length) {
                    color = 'text-emerald-500 dark:text-emerald-400 font-black';
                    extraClasses = 'bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-2 scale-110 shadow-sm relative before:absolute before:-bottom-2 before:left-0 before:w-full before:h-2 before:bg-emerald-500 before:rounded-full before:animate-pulse';
                  }
                  return (
                    <span key={i} className={`transition-all duration-200 ${color} ${extraClasses}`}>
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {settings.showKeyboard && (
          <div className="w-full mt-auto">
            <VirtualKeyboard activeKey={targetChar} showNumeric={showNumeric} />
          </div>
        )}
      </main>

      {/* Results Modal - Compact Version */}
      <AnimatePresence>
        {showResults && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 p-10 rounded-[40px] shadow-2xl max-w-md w-full text-center border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-blue-500 to-emerald-400" />
              
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-emerald-500" />
              </div>

              <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight">Parabéns! 🎊</h2>
              <p className="text-zinc-500 mb-8 font-bold">Excelente desempenho!</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                  <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Precisão</span>
                  <span className="text-3xl font-black text-emerald-500">{stats.accuracy}%</span>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                  <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Velocidade</span>
                  <span className="text-3xl font-black text-blue-500">{stats.wpm} <span className="text-sm">PPM</span></span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  autoFocus
                  onClick={() => onComplete(stats, 'next')}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-500/50 outline-none text-white font-black py-5 rounded-[20px] transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 text-xl"
                >
                  PRÓXIMA AULA <ArrowRight className="w-6 h-6" />
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleReset}
                    className="py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-extrabold rounded-2xl transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> REFAZER
                  </button>
                  <button 
                    onClick={handleBack}
                    className="py-4 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold rounded-2xl transition-all text-sm"
                  >
                    SAIR
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
