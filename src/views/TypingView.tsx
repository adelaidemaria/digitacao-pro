import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { useSettings } from '../contexts/SettingsContext';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { useSound } from '../hooks/useSound';
import { Trophy, RotateCcw, ArrowRight, LayoutGrid, Award, Play, Video, ExternalLink, X, Info, Target, AlertCircle, Settings, Clock } from 'lucide-react';
import { Lesson } from '../types';
import confetti from 'canvas-confetti';

interface TypingViewProps {
  lesson: Lesson;
  lessons: Lesson[];
  onComplete: (stats: any, navigateTo?: 'next' | 'dashboard' | 'none') => void;
  onBack: () => void;
  hasNextLesson?: boolean;
  onOpenCourses: () => void;
  onOpenSettings: () => void;
  progress: any[];
  onExit: () => void;
}

export const TypingView: React.FC<TypingViewProps> = ({ lesson, lessons, onComplete, onBack, hasNextLesson, onOpenCourses, onOpenSettings, progress, onExit }) => {
  const { settings } = useSettings();
  const [isStarted, setIsStarted] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isCompletedHandled, setIsCompletedHandled] = useState(false);
  
  const [prevInputLength, setPrevInputLength] = useState(0);
  const [prevErrors, setPrevErrors] = useState(0);
  const [confirmRedoNext, setConfirmRedoNext] = useState<Lesson | null>(null);
  
  const [showCustomPrompt, setShowCustomPrompt] = useState(lesson.is_custom_text || false);
  const [customWord, setCustomWord] = useState('');
  const [finalContent, setFinalContent] = useState(lesson.content);

  const { input, errorIndices, consecutiveErrors, stats, reset, startTimer } = useTypingEngine(finalContent, settings, !isStarted);
  const [showCapsLockAlert, setShowCapsLockAlert] = useState(false);

  useEffect(() => {
    if (consecutiveErrors === 5) {
      setShowCapsLockAlert(true);
    }
  }, [consecutiveErrors]);

  useEffect(() => {
    setFinalContent(lesson.content);
    setShowCustomPrompt(!!lesson.is_custom_text);
    setCustomWord('');
  }, [lesson]);

  const handleCustomSubmit = () => {
    if (!customWord.trim()) return;
    const word = customWord.trim();
    let newContent = '';
    if (lesson.content && lesson.content.includes('{{TEXTO}}')) {
      newContent = lesson.content.replace(/\{\{TEXTO\}\}/g, word);
    } else if (lesson.content && lesson.content.trim().length > 0) {
      newContent = lesson.content + ' ' + word;
    } else {
      newContent = Array(10).fill(word).join(' ');
    }
    setFinalContent(newContent);
    setShowCustomPrompt(false);
  };

  const { playSuccess, playError } = useSound();
  const hasNumbers = /\d/.test(finalContent);
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
    if (stats.endTime && !showResults && !isCompletedHandled) {
      setShowResults(true);
      setIsCompletedHandled(true);
      // Auto-save results immediately without navigating
      const passedAccuracy = lesson.min_accuracy ? stats.accuracy >= lesson.min_accuracy : true;
      const passedWpm = lesson.min_wpm ? stats.wpm >= lesson.min_wpm : true;
      const passedDuration = lesson.max_duration_seconds ? stats.duration_seconds <= lesson.max_duration_seconds : true;
      
      if (passedAccuracy && passedWpm && passedDuration) {
        onComplete(stats, 'none');
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b']
        });
      }
    }
  }, [stats.endTime, showResults, stats, onComplete, lesson.min_accuracy, lesson.min_wpm, isCompletedHandled]);

  const handleReset = () => {
    setPrevInputLength(0);
    setPrevErrors(0);
    setShowResults(false);
    setIsCompletedHandled(false);
    setIsStarted(false);
    if (lesson.is_custom_text) {
      setShowCustomPrompt(true);
      setCustomWord('');
    }
    reset();
  };

  const handleBack = () => {
    if (showResults) {
      onExit();
    } else {
      onBack();
    }
  };

  useEffect(() => {
    handleReset();
    if (settings.showInstructions && (lesson.objective?.trim() || lesson.instruction?.trim())) {
      setShowIntro(true);
    } else {
      setShowIntro(false);
    }
  }, [lesson.id, lesson.objective, lesson.instruction, settings.showInstructions]);

  const targetChar = finalContent[input.length] || '';
  
  const passedAccuracy = lesson.min_accuracy ? stats.accuracy >= lesson.min_accuracy : true;
  const passedWpm = lesson.min_wpm ? stats.wpm >= lesson.min_wpm : true;
  const passedDuration = lesson.max_duration_seconds ? stats.duration_seconds <= lesson.max_duration_seconds : true;
  const hasPassed = passedAccuracy && passedWpm && passedDuration;
  const isFreeExercise = !lesson.min_accuracy && !lesson.min_wpm && !lesson.max_duration_seconds;

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    const paddedSec = sec.toString().padStart(2, '0');
    if (min === 0) return `${paddedSec} segundos`;
    return `${min} ${min === 1 ? 'minuto' : 'minutos'} e ${paddedSec} segundos`;
  };

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
                <h3 className="font-black text-emerald-500 uppercase text-lg leading-tight tracking-tight">{lesson.title}</h3>
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

          <div className="mt-auto pt-2 space-y-3">
            {settings.showTimer && (
              <div className="px-4 py-4 bg-rose-50/30 dark:bg-rose-500/5 rounded-2xl border-2 border-rose-100/50 dark:border-rose-900/20 flex flex-col items-center justify-center shadow-inner">
                <span className="text-sm font-extrabold text-rose-500 uppercase tracking-tight mb-1">Tempo de Prova</span>
                <div className="flex items-center gap-3">
                  <Clock className={`w-5 h-5 ${isStarted && stats.startTime && !stats.endTime ? 'text-rose-500 animate-pulse' : 'text-zinc-300'}`} />
                  <span className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
                    {formatTime(stats.duration_seconds)}
                  </span>
                </div>
              </div>
            )}

            <button 
              onClick={handleReset}
              className="w-full py-3.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-base rounded-xl transition-all flex items-center justify-center gap-3 border-2 border-emerald-200/50 dark:border-emerald-500/30"
            >
              <RotateCcw className="w-4 h-4" /> REINICIAR LIÇÃO
            </button>

            <button 
              onClick={onOpenSettings}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-700/50 text-zinc-500 dark:text-zinc-400 font-black text-sm rounded-xl transition-all border-2 border-zinc-200/50 dark:border-zinc-800/30 group"
            >
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span>AJUSTES</span>
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
                onClick={() => {
                   setIsStarted(true);
                   startTimer();
                 }}
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
                {finalContent.split('').map((char, i) => {
                  let color = 'text-zinc-200 dark:text-zinc-800';
                  let extraClasses = '';
                  
                  if (i < input.length) {
                    // Character already typed
                    if (errorIndices.has(i)) {
                      color = 'text-rose-500 dark:text-rose-400 font-bold';
                    } else {
                      color = 'text-emerald-500 dark:text-emerald-400 font-bold';
                    }
                  } else if (i === input.length) {
                    // Current character to type
                    color = 'text-zinc-800 dark:text-white font-black';
                    extraClasses = 'bg-zinc-100 dark:bg-zinc-800 rounded-xl px-2 scale-110 shadow-sm relative before:absolute before:-bottom-2 before:left-0 before:w-full before:h-2 before:bg-blue-500 before:rounded-full before:animate-pulse';
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

      {/* Modals */}
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
                {hasPassed ? (
                  <Trophy className="w-10 h-10 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-10 h-10 text-amber-500" />
                )}
              </div>

              {hasPassed ? (
                <>
                  <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight">Parabéns! 🎊</h2>
                  <p className="text-zinc-500 mb-8 font-bold">Excelente desempenho!</p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight">Quase lá! 💪</h2>
                  <p className="text-zinc-500 mb-8 font-bold">Você não atingiu a meta da lição. Tente novamente.</p>
                </>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className={`bg-zinc-50 dark:bg-zinc-800/50 p-4 md:p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 ${!passedAccuracy && lesson.min_accuracy ? 'ring-2 ring-rose-500/50 shadow-lg shadow-rose-500/10' : ''}`}>
                  <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Precisão</span>
                  <span className={`text-2xl md:text-3xl font-black ${!passedAccuracy && lesson.min_accuracy ? 'text-rose-500' : 'text-emerald-500'}`}>{stats.accuracy}%</span>
                  {lesson.min_accuracy && <span className="block text-[8px] md:text-[9px] font-bold text-zinc-400 mt-1 uppercase">Meta: {lesson.min_accuracy}%</span>}
                </div>
                <div className={`bg-zinc-50 dark:bg-zinc-800/50 p-4 md:p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 ${!passedDuration && lesson.max_duration_seconds ? 'ring-2 ring-rose-500/50 shadow-lg shadow-rose-500/10' : ''}`}>
                  <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 text-center">Tempo</span>
                  <span className={`text-2xl md:text-3xl font-black ${!passedDuration && lesson.max_duration_seconds ? 'text-rose-500' : 'text-zinc-600 dark:text-zinc-300'}`}>{stats.duration_seconds} <span className="text-xs md:text-sm">seg</span></span>
                  {lesson.max_duration_seconds ? (
                    <span className="block text-[8px] md:text-[9px] font-bold text-zinc-400 mt-1 uppercase">Meta: Max {lesson.max_duration_seconds}s</span>
                  ) : (
                    <span className="block text-[8px] md:text-[9px] font-bold text-zinc-400 mt-1 uppercase">Geral</span>
                  )}
                </div>
                <div className={`bg-zinc-50 dark:bg-zinc-800/50 p-4 md:p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 ${!passedWpm && lesson.min_wpm ? 'ring-2 ring-rose-500/50 shadow-lg shadow-rose-500/10' : ''}`}>
                  <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Velocidade</span>
                  <span className={`text-2xl md:text-3xl font-black ${!passedWpm && lesson.min_wpm ? 'text-rose-500' : 'text-blue-500'}`}>{stats.wpm} <span className="text-xs md:text-sm">PPM</span></span>
                  {lesson.min_wpm && <span className="block text-[8px] md:text-[9px] font-bold text-zinc-400 mt-1 uppercase">Meta: {lesson.min_wpm} PPM</span>}
                </div>
              </div>

              <div className="space-y-3">
                {hasPassed && (
                  <button 
                    autoFocus
                    onClick={() => {
                      const nextL = lessons[currentIndex + 1];
                      if (nextL && progress.some(p => p.lesson_id === nextL.id)) {
                        setConfirmRedoNext(nextL);
                      } else {
                        onComplete(stats, 'next');
                      }
                    }}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-500/50 outline-none text-white font-black py-5 rounded-[20px] transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 text-xl"
                  >
                    PRÓXIMA AULA <ArrowRight className="w-6 h-6" />
                  </button>
                )}
                
                <div className={`grid ${hasPassed ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                  <button 
                    onClick={handleReset}
                    className={`py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-extrabold rounded-2xl transition-all text-sm flex items-center justify-center gap-2 ${!hasPassed ? 'py-5 text-lg w-full bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-600' : ''}`}
                  >
                    <RotateCcw className="w-4 h-4" /> REFAZER
                  </button>
                  {hasPassed && (
                    <button 
                      onClick={handleBack}
                      className="py-4 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold rounded-2xl transition-all text-sm"
                    >
                      SAIR
                    </button>
                  )}
                </div>
                {!hasPassed && (
                  <div className="pt-2">
                    <button onClick={handleBack} className="text-[10px] text-zinc-400 hover:text-zinc-600 tracking-widest font-black uppercase">Voltar ao Início</button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {showIntro && !showCustomPrompt && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 p-6 md:p-10 rounded-[40px] shadow-2xl max-w-lg w-full text-center border border-white/10 relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-400" />
              
              <button 
                onClick={() => setShowIntro(false)}
                className="absolute top-6 right-6 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all text-zinc-400 hover:text-zinc-600 z-10"
              >
                <X className="w-6 h-6" />
              </button>
              

              <h2 className="text-lg font-black text-zinc-900 dark:text-white mb-1 tracking-tight uppercase mt-1">Instruções</h2>
              
              <div className="mb-4 p-2 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl inline-block px-5 border border-blue-100 dark:border-blue-500/20">
                <p className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-tight">
                  Lição {currentIndex + 1}: <span className="text-zinc-900 dark:text-white font-bold">{lesson.title}</span>
                </p>
              </div>
              
              <div className="space-y-4 mb-6 text-left">
                {lesson.objective && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-500/5 rounded-[24px] border border-amber-100/50 dark:border-amber-500/10 flex gap-4 shadow-sm group hover:border-amber-200 transition-colors">
                    <div className="shrink-0 p-2.5 bg-white dark:bg-amber-500/20 rounded-xl shadow-sm transform group-hover:rotate-12 transition-transform"><Target className="w-5 h-5 text-amber-500" /></div>
                    <div>
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-0.5">Objetivo da Aula</h4>
                      <p className="text-sm font-bold text-amber-900 dark:text-amber-300 leading-snug">{lesson.objective}</p>
                    </div>
                  </div>
                )}
                {lesson.instruction && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-500/5 rounded-[24px] border border-blue-100/50 dark:border-blue-500/10 flex gap-4 shadow-sm group hover:border-blue-200 transition-colors">
                    <div className="shrink-0 p-2.5 bg-white dark:bg-blue-500/20 rounded-xl shadow-sm transform group-hover:-rotate-12 transition-transform"><Info className="w-5 h-5 text-blue-500" /></div>
                    <div>
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 mb-0.5">Como Fazer</h4>
                      <p className="text-sm font-bold text-blue-800 dark:text-blue-300 leading-snug">{lesson.instruction}</p>
                    </div>
                  </div>
                )}
                {(lesson.min_accuracy || lesson.min_wpm || lesson.max_duration_seconds) ? (
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/80 rounded-[24px] border border-zinc-200 dark:border-zinc-700 flex items-center gap-4 shadow-sm">
                    <div className="shrink-0 p-2.5 bg-white dark:bg-zinc-700 rounded-xl shadow-sm"><Trophy className="w-5 h-5 text-emerald-500" /></div>
                    <div>
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Meta para passar</h4>
                      <div className="text-sm font-black text-zinc-900 dark:text-white flex flex-wrap items-center gap-2">
                        {lesson.min_accuracy && <span className="whitespace-nowrap"><span className="text-emerald-500">{lesson.min_accuracy}%</span> acerto</span>}
                        {lesson.min_accuracy && (lesson.min_wpm || lesson.max_duration_seconds) && <span className="opacity-20">|</span>}
                        {lesson.max_duration_seconds && <span className="whitespace-nowrap">Máx <span className="text-amber-500">{lesson.max_duration_seconds}s</span></span>}
                        {lesson.max_duration_seconds && lesson.min_wpm && <span className="opacity-20">|</span>}
                        {lesson.min_wpm && <span className="whitespace-nowrap"><span className="text-blue-500">{lesson.min_wpm}</span> PPM</span>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-500/5 rounded-[24px] border border-emerald-500/20 flex items-center gap-4 shadow-sm">
                    <div className="shrink-0 p-2.5 bg-white dark:bg-emerald-500/20 rounded-xl shadow-sm"><Play className="w-5 h-5 text-emerald-500" /></div>
                    <div>
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">Exercício Livre</h4>
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Nenhuma meta obrigatória. Pratique à vontade!</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <button 
                  autoFocus
                  onClick={() => setShowIntro(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-8 focus:ring-blue-500/20 shadow-blue-500/40 outline-none text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl text-sm uppercase tracking-widest active:scale-95 group"
                >
                  VAMOS COMEÇAR! <Play className="w-4 h-4 fill-white group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showCustomPrompt && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-[48px] shadow-2xl max-w-xl w-full text-center border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-emerald-500" />
              
              <div className="w-20 h-20 bg-teal-50 dark:bg-teal-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-teal-50 dark:ring-teal-500/5">
                <Target className="w-10 h-10 text-teal-500" />
              </div>

              <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight uppercase">Treino Flexível</h2>
              <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto">
                Esta é uma lição de estilo livre. Escolha uma palavra, nome ou frase curta que você quer treinar agora:
              </p>

              <form onSubmit={(e) => { e.preventDefault(); handleCustomSubmit(); }} className="space-y-6">
                <input
                  type="text"
                  autoFocus
                  required
                  value={customWord}
                  onChange={(e) => setCustomWord(e.target.value)}
                  placeholder="EX: NOME OU EMPRESA"
                  className="w-full p-6 text-center text-xl font-black bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 focus:border-teal-500 rounded-[24px] outline-none transition-all uppercase placeholder:text-zinc-300 dark:placeholder:text-zinc-600 shadow-inner text-zinc-800 dark:text-white"
                />
                
                <button 
                  type="submit"
                  disabled={!customWord.trim()}
                  className="w-full py-6 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 text-white font-black rounded-3xl transition-all flex items-center justify-center gap-3 shadow-xl tracking-[0.2em] uppercase text-sm"
                >
                  GERAR TREINO <Play className="w-4 h-4 fill-white" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {confirmRedoNext && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[500] flex items-center justify-center p-4 text-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden border border-white/10 flex flex-col p-8"
            >
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-emerald-50 dark:ring-emerald-500/5">
                <RotateCcw className="w-10 h-10 text-emerald-500" />
              </div>
              
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2 uppercase tracking-tight">Próxima Aula Concluída!</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-bold mb-8 leading-relaxed lowercase">
                A próxima aula <span className="text-emerald-500 uppercase">"{confirmRedoNext.title}"</span> já foi concluída com sucesso. Deseja praticá-la novamente mesmo assim?
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    onComplete(stats, 'next');
                    setConfirmRedoNext(null);
                  }}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-xs"
                >
                  Sim, Praticar de Novo
                </button>
                <button 
                  onClick={() => {
                    setConfirmRedoNext(null);
                    onExit();
                  }}
                  className="w-full py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-black rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all uppercase tracking-widest text-xs"
                >
                  Não, Voltar
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {showCapsLockAlert && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[600] flex items-center justify-center p-4 text-center"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden border border-rose-500/20 flex flex-col p-8 relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 via-rose-500 to-rose-400" />
              
              <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-rose-50 dark:ring-rose-500/5">
                <AlertCircle className="w-10 h-10 text-rose-500" />
              </div>
              
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-3 uppercase tracking-tight">Opa! Algo está errado?</h3>
              <p className="text-base text-zinc-500 dark:text-zinc-400 font-bold mb-8 leading-relaxed">
                Parece que esta tecla está difícil! <br/>
                <span className="text-rose-500">Confira se o CapsLock está ligado</span> ou se está <span className="text-rose-500">DIGITANDO</span> a tecla certa.
              </p>

              <button 
                onClick={() => setShowCapsLockAlert(false)}
                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-rose-500/30 uppercase tracking-[0.2em] text-sm active:scale-95"
              >
                ENTENDI, VOU CONFERIR!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
