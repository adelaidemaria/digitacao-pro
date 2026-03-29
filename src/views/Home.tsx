import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home as HomeIcon,
  BookOpen,
  Video,
  Award,
  Settings as SettingsIcon,
  LogOut,
  Play,
  CheckCircle,
  Activity,
  ArrowRight,
  MousePointer2,
  ChevronRight,
  Crown,
  Clock,
  TrendingUp,
  ExternalLink,
  Lightbulb,
  X,
  Megaphone,
  Lock,
  Monitor,
} from 'lucide-react';
import { Module, Lesson, Plan, Announcement, Course, Tip, HomeVideo, HomeConfig } from '../types';

interface HomeViewProps {
  user: any;
  modules: Module[];
  lessons: Lesson[];
  plans: Plan[];
  progress: any[];
  tips?: Tip[];
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenCourses: () => void;
  onGoToLessons: () => void;
  onOpenPosture: () => void;
  onOpenTutorial: () => void;
  announcement?: Announcement;
  onAnnouncementClick?: (id: string) => void;
  homeVideos: HomeVideo[];
  homeConfig: HomeConfig;
  courses: Course[];
}

const FALLBACK_TIPS = [
  {
    title: 'Mantenha a Postura',
    accentClass: 'text-blue-400',
    dotClass: 'bg-blue-400',
    icon: '🪑',
    text: 'A digitação correta depende muito de como você senta e posiciona seus pulsos. Lembre-se de manter as costas retas e os pulsos levemente elevados para evitar cansaço e lesões. Pratique um pouco todos os dias!',
  },
  {
    title: 'Posição dos Dedos',
    accentClass: 'text-violet-400',
    dotClass: 'bg-violet-400',
    icon: '✋',
    text: 'Para iniciar, mantenha os dedos na "linha base" (ASDF para a mão esquerda, JKLÇ para a direita). Esses são os pontos de partida para todos os movimentos.',
  },
  {
    title: 'Pratique Todo Dia',
    accentClass: 'text-emerald-400',
    dotClass: 'bg-emerald-400',
    icon: '⏱️',
    text: 'Pratique cerca de 15 minutos por dia e logo vai começar a digitar rápido. No começo é difícil, mas com consistência a velocidade vem naturalmente!',
  },
  {
    title: 'Não Olhe para o Teclado',
    accentClass: 'text-amber-400',
    dotClass: 'bg-amber-400',
    icon: '👁️',
    text: 'O objetivo é memorizar a posição das teclas (digitação tátil). Tente digitar sem olhar para o teclado — pode parecer difícil no começo, mas é essencial para ganhar velocidade!',
  },
];

const formatYoutubeUrl = (url: string): string => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url;
};

export const Home: React.FC<HomeViewProps> = ({
  user, modules, lessons, plans, progress, tips = [], onLogout, onOpenSettings, onOpenProfile, onOpenCourses, onGoToLessons, onOpenPosture, onOpenTutorial, announcement, onAnnouncementClick, homeVideos = [], homeConfig, courses = []
}) => {
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isPlanDetailsOpen, setIsPlanDetailsOpen] = useState(false);

  // Filter courses based on student plan
  const filteredCourses = useMemo(() => {
    return courses.filter(c => 
      c.active && c.target_plans && c.target_plans.includes(user.plan_id || '')
    );
  }, [courses, user.plan_id]);
  const hasCoursesForPlan = filteredCourses.length > 0;

  // Select a random active video once per mount
  const activeVideo = useMemo(() => {
    const actives = homeVideos.filter(v => v.active);
    if (actives.length === 0) return null;
    return actives[Math.floor(Math.random() * actives.length)];
  }, [homeVideos]);

  const userPlan = plans.find(p => p.id === user.plan_id);
  const accessibleModuleIds = userPlan?.accessible_modules || [];

  const sortedModules = [...modules].sort((a, b) => (a.order || 0) - (b.order || 0));

  const uniqueCompletedLessonIds = new Set(progress.map(p => p.lesson_id));

  const getModuleStatus = (modId: string): 'concluido' | 'progresso' | 'iniciar' => {
    const moduleLessons = lessons.filter(l => l.module_id === modId);
    if (moduleLessons.length === 0) return 'iniciar';
    const completedCount = moduleLessons.filter(l => uniqueCompletedLessonIds.has(l.id)).length;
    if (completedCount === moduleLessons.length) return 'concluido';
    if (completedCount > 0) return 'progresso';
    return 'iniciar';
  };

  const completedModulesCount = modules.filter(m => getModuleStatus(m.id) === 'concluido').length;
  const progressPercent = lessons.length > 0 ? (uniqueCompletedLessonIds.size / lessons.length) * 100 : 0;
  const avgWpm = progress.length > 0
    ? Math.round(progress.reduce((acc, curr) => acc + (curr.wpm || 0), 0) / progress.length)
    : 0;
  const avgAccuracy = progress.length > 0
    ? Math.round(progress.reduce((acc, curr) => acc + (curr.accuracy || 0), 0) / progress.length)
    : 0;

  const isFirstAccess = progress.length === 0;

  // Next upgrade plan
  const nextPlan = plans.find(p => p.active && p.id !== user.plan_id && !p.name.toLowerCase().includes('gratuito'));
  const isFreePlan = userPlan?.name?.toLowerCase().includes('gratuito') || !userPlan;

  // Transform tips
  const availableTips = tips.filter(t => t.active && (!t.target_plans || t.target_plans.length === 0 || t.target_plans.includes(user.plan_id)));
  const displayTips = availableTips.length > 0 ? availableTips : FALLBACK_TIPS;

  // Random tip per visit
  const tipIndex = useMemo(() => Math.floor(Math.random() * displayTips.length), [displayTips.length]);
  const currentTip = displayTips[tipIndex];

  // Achievements (same as Dashboard)
  const achievements = [
    { id: 'first-lesson', title: 'Primeiro Passo', desc: 'Concluiu sua primeira lição', icon: <CheckCircle className="w-5 h-5" />, completed: progress.length > 0 },
    { id: 'fast-typer', title: 'Veloz', desc: 'Alcançou mais de 40 PPM', icon: <TrendingUp className="w-5 h-5" />, completed: progress.some(p => (p.wpm || 0) >= 40) },
    { id: 'accurate', title: 'Perfeccionista', desc: 'Lição com 100% de precisão', icon: <Award className="w-5 h-5" />, completed: progress.some(p => (p.accuracy || 0) === 100) },
    { id: 'module-master', title: 'Mestre de Módulo', desc: 'Concluiu um módulo inteiro', icon: <Crown className="w-5 h-5" />, completed: modules.some(m => getModuleStatus(m.id) === 'concluido') },
  ];

  // Theme configuration based on layout_scheme
  const themeClasses = useMemo(() => {
    switch (homeConfig.layout_scheme) {
      case 'vibrant':
        return {
          primary: 'bg-purple-600',
          primaryText: 'text-purple-600',
          primaryBg: 'bg-purple-600/5',
          primaryBorder: 'border-purple-600/10',
          primaryShadow: 'shadow-purple-500/20',
          gradient: 'from-purple-600 to-indigo-700',
          accent: 'pink-400',
          bg: 'bg-white',
          card: 'bg-white border-zinc-100 shadow-xl shadow-purple-500/5',
          text: 'text-zinc-900',
          accentText: 'text-pink-400'
        };
      default: // classic
        return {
          primary: 'bg-blue-500',
          primaryText: 'text-blue-500',
          primaryBg: 'bg-blue-500/5',
          primaryBorder: 'border-blue-500/10',
          primaryShadow: 'shadow-blue-500/20',
          gradient: 'from-blue-600 to-blue-800',
          accent: 'blue-400',
          bg: 'bg-zinc-50/50',
          card: 'bg-white border-zinc-100 shadow-xl shadow-zinc-200/20',
          text: 'text-zinc-900',
          accentText: 'text-blue-400'
        };
    }
  }, [homeConfig.layout_scheme]);

  return (
    <div className={`h-screen bg-[#f4f7fa] dark:bg-zinc-950 flex flex-col lg:flex-row font-sans text-zinc-900 dark:text-zinc-100 overflow-hidden`}>

      {/* ─── SIDEBAR (igual ao Dashboard) ─── */}
      <aside className="w-full lg:w-[280px] bg-white dark:bg-zinc-900 border-r border-zinc-200/50 dark:border-zinc-800 flex flex-col shrink-0 lg:h-full overflow-hidden shadow-sm z-10">
        <div className="p-5 flex flex-col h-full overflow-y-auto scrollbar-hide">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
              <div className={`w-9 h-9 bg-gradient-to-br ${themeClasses.gradient} rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg ${themeClasses.primaryShadow}`}>
              D
            </div>
            <div>
              <span className="block font-black text-lg text-zinc-900 dark:text-white tracking-tight leading-none">Digitação Sem Segredo</span>
              <span className="text-[9px] font-bold text-blue-500 tracking-widest uppercase">{userPlan?.name || 'Iniciante'}</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-1 mb-6">
            {/* INÍCIO - ativo */}
            <button className={`w-full flex items-center gap-3 px-4 py-3 ${themeClasses.primaryBg} dark:${themeClasses.primaryBg} ${themeClasses.primaryText} dark:${themeClasses.accentText} rounded-xl font-bold transition-all border ${themeClasses.primaryBorder} dark:${themeClasses.primaryBorder.replace('primary', 'accent')} shadow-sm`}>
              <HomeIcon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm tracking-tight">Início</span>
            </button>

            <button
              onClick={onOpenPosture}
              className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-700 dark:hover:text-zinc-300 rounded-xl font-medium transition-all text-sm group"
            >
              <Monitor className="w-4 h-4 flex-shrink-0 group-hover:text-emerald-500 transition-colors" />
              <span className="text-sm font-bold tracking-tight">Postura</span>
            </button>

            <button
              onClick={onOpenTutorial}
              className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-700 dark:hover:text-zinc-300 rounded-xl font-medium transition-all text-sm group"
            >
              <MousePointer2 className="w-4 h-4 flex-shrink-0 group-hover:text-amber-500 transition-colors" />
              <span className="text-sm font-bold tracking-tight">Aula Teste</span>
            </button>

            <button
              onClick={onGoToLessons}
              className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-700 dark:hover:text-zinc-300 rounded-xl font-medium transition-all text-sm group"
            >
              <BookOpen className="w-4 h-4 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-bold tracking-tight">Curso Digitação</span>
            </button>

            {hasCoursesForPlan && (
              <button
                onClick={onOpenCourses}
                className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-700 dark:hover:text-zinc-300 rounded-xl font-medium transition-all text-sm group"
              >
                <Video className="w-4 h-4 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
                <span className="text-sm font-bold tracking-tight">+ Cursos</span>
              </button>
            )}

            <button
              onClick={() => setIsAchievementsOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-700 dark:hover:text-zinc-300 rounded-xl font-medium transition-all group text-sm"
            >
              <Award className="w-4 h-4 flex-shrink-0 group-hover:text-amber-500 transition-colors" />
              <span className="text-sm">Conquistas</span>
              {achievements.filter(a => a.completed).length > 0 && (
                <span className="ml-auto bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  {achievements.filter(a => a.completed).length}
                </span>
              )}
            </button>

            <button
              onClick={onOpenSettings}
              className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-700 dark:hover:text-zinc-300 rounded-xl font-medium transition-all group text-sm"
            >
              <SettingsIcon className="w-4 h-4 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm">Configurações</span>
            </button>
          </nav>

          {/* Progress */}
          <div className="space-y-4">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-[28px] border border-zinc-100 dark:border-zinc-800 shadow-inner">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 bg-white dark:bg-zinc-700 rounded-lg text-blue-500 shadow-sm">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-black text-zinc-800 dark:text-white uppercase tracking-wider">Meu Progresso</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[9px] font-black mb-1.5">
                    <span className="text-zinc-400 uppercase tracking-widest">Concluído</span>
                    <span className="text-blue-500 font-black">{completedModulesCount} / {modules.length}</span>
                  </div>
                  <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white dark:bg-zinc-700 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-600 shadow-sm text-center">
                    <span className="block text-[7px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Média PPM</span>
                    <span className="text-lg font-black text-zinc-900 dark:text-white">{avgWpm}</span>
                  </div>
                  <div className="bg-white dark:bg-zinc-700 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-600 shadow-sm text-center">
                    <span className="block text-[7px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Lições</span>
                    <span className="text-lg font-black text-zinc-900 dark:text-white">{uniqueCompletedLessonIds.size}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Plano Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-950 p-4 rounded-[28px] text-white shadow-xl border border-zinc-700/50">
              <div className="absolute -top-4 -right-4 opacity-10">
                <Award className="w-16 h-16" />
              </div>
              <h3 className="text-sm font-black mb-1 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" /> Plano {userPlan?.name || 'Gratuito'}
              </h3>
              <p className="text-zinc-400 text-[9px] mb-4 font-bold uppercase tracking-wider">
                {userPlan?.validity_days ? `${userPlan.validity_days} DIAS DE ACESSO` : 'ACESSO LIMITADO'}
              </p>
              <button 
                onClick={() => setIsPlanDetailsOpen(true)}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-black text-[9px] transition-all uppercase tracking-widest border border-white/10"
              >
                Ver detalhes
              </button>
            </div>

            <div className="pt-2 space-y-3">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center p-3 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl text-rose-500 font-black transition-all gap-2 text-[10px] uppercase tracking-widest border border-rose-100/50 dark:border-rose-500/20"
              >
                <LogOut className="w-3.5 h-3.5" /> Sair do Sistema
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto bg-white/30 dark:bg-transparent">
        <div className="max-w-[1000px] mx-auto pb-12">

          {/* Announcement Bar */}
          {announcement && (
            <div
              className={`mb-10 overflow-hidden rounded-[24px] py-4 shadow-xl shadow-black/5 border border-black/5 relative group transition-all ${announcement.link ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''}`}
              style={{ backgroundColor: announcement.bg_color }}
              onClick={() => {
                if (announcement.link) {
                  const url = announcement.link.startsWith('http') ? announcement.link : `https://${announcement.link}`;
                  window.open(url, '_blank');
                  onAnnouncementClick?.(announcement.id);
                }
              }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/20 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/20 to-transparent z-10 pointer-events-none" />
              <div className="flex items-center">
                <div className="px-5 shrink-0 z-20 flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg" style={{ color: announcement.text_color }}>
                    <Megaphone className="w-4 h-4 animate-bounce" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70" style={{ color: announcement.text_color }}>Aviso:</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <motion.div
                    animate={{ x: ['50%', '-100%'] }}
                    transition={{ duration: 60 - ((announcement.speed ?? 5) * 5), repeat: Infinity, ease: 'linear' }}
                    className="whitespace-nowrap inline-block"
                  >
                    <span className="font-extrabold text-lg uppercase tracking-tight px-4 flex items-center gap-3" style={{ color: announcement.text_color }}>
                      {announcement.content}
                      {announcement.link && <ArrowRight className="w-5 h-5 inline opacity-50 group-hover:translate-x-1 transition-transform" />}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          )}

          {/* Greeting */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-2 tracking-tighter">
              Olá, {user.full_name.split(' ')[0]}! 👋
            </h1>
            <p className="text-xl text-zinc-500 font-medium italic">Bem-vindo ao seu portal de aprendizado.</p>
          </header>

          {/* Dashboard Dynamic Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* 1. Realtime Stats */}
            {homeConfig.show_stats && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                <div className={`${themeClasses.card} p-8 rounded-[36px] flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300`}>
                  <div className={`p-5 ${themeClasses.primaryBg} dark:${themeClasses.primaryBg} ${themeClasses.primaryText} rounded-3xl transition-transform group-hover:scale-110 duration-500`}>
                    <Activity className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter mb-0.5">{avgWpm} <span className="text-sm text-zinc-400 font-bold uppercase tracking-widest ml-1">PPM</span></span>
                    <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Velocidade Média</span>
                  </div>
                </div>

                <div className={`${themeClasses.card} p-8 rounded-[36px] flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300`}>
                  <div className="p-5 bg-emerald-100 dark:bg-emerald-500/5 text-emerald-500 rounded-3xl transition-transform group-hover:scale-110 duration-500">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter mb-0.5">{avgAccuracy}%</span>
                    <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Precisão Média</span>
                  </div>
                </div>

                {/* Progress Card */}
                <div className={`${themeClasses.card} p-8 rounded-[40px] sm:col-span-2 relative overflow-hidden group border-0`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-${themeClasses.primary}/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-${themeClasses.primary}/10 transition-colors`} />
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex flex-col">
                      <h4 className="font-black text-zinc-900 dark:text-white tracking-tight uppercase text-sm mb-1">Seu Progresso Total</h4>
                      <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">{uniqueCompletedLessonIds.size} de {lessons.length} lições concluídas</p>
                    </div>
                    <span className={`text-2xl font-black ${themeClasses.primaryText} dark:${themeClasses.accentText} tracking-tighter`}>{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="h-4 w-full bg-zinc-50 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-100 dark:border-zinc-800/50 p-1 relative z-10 mb-6">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${themeClasses.gradient} rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]`} 
                    />
                  </div>

                  <button
                    onClick={onGoToLessons}
                    className={`w-full py-4 ${themeClasses.primary} hover:opacity-90 text-white rounded-[20px] font-black text-xs uppercase tracking-[0.15em] transition-all shadow-lg ${themeClasses.primaryShadow} flex items-center justify-center gap-3 group relative z-10 active:scale-95`}
                  >
                    <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Continuar os Estudos
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. Instruction Video Box */}
            {homeConfig.show_videos && activeVideo && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`bg-gradient-to-br ${themeClasses.gradient} p-8 rounded-[40px] text-white shadow-2xl shadow-blue-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl" />
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{activeVideo.title}</h3>
                <p className="text-white/80 font-bold text-sm max-w-[280px] mb-6 leading-relaxed">
                  {activeVideo.description}
                </p>
                <div className="w-full aspect-video bg-black/20 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                  <iframe 
                    className="w-full h-full"
                    src={formatYoutubeUrl(activeVideo.video_url)} 
                    title={activeVideo.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  ></iframe>
                </div>
              </motion.div>
            )}
          </div>

          {/* 3. Master Tips Section */}
          {homeConfig.show_tips && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${themeClasses.card} mb-12 p-10 rounded-[48px] flex flex-col md:flex-row items-center gap-12 group border-0`}
            >
              <div className="relative shrink-0">
                <div className={`absolute -inset-6 bg-gradient-to-r ${themeClasses.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                <div className="relative w-28 h-28 bg-zinc-50 dark:bg-zinc-800 rounded-[36px] flex items-center justify-center text-5xl shadow-inner border border-zinc-100 dark:border-zinc-700 animate-bounce duration-[3000ms]">
                  {currentTip.icon}
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <span className={`w-10 h-1.5 bg-${themeClasses.primary} rounded-full`} />
                  <h3 className={`text-sm font-black uppercase tracking-[0.3em] text-${themeClasses.primary} dark:text-${themeClasses.accent}`}>Dica do Mestre</h3>
                </div>
                <h2 className={`text-4xl font-black tracking-tighter mb-4 uppercase ${(currentTip as any).accent_color || currentTip.accentClass || 'text-zinc-900 dark:text-white'}`}>{currentTip.title}</h2>
                <p className="text-zinc-500 dark:text-zinc-400 font-bold leading-relaxed text-lg max-w-2xl italic">
                  "{currentTip.text || (currentTip as any).content}"
                </p>
              </div>
              <div className="shrink-0 flex flex-col gap-3">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Referência para milhares de alunos</span>
              </div>
            </motion.div>
          )}

          {/* 4. First Access Guidance */}
          {isFirstAccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12 bg-amber-50 dark:bg-amber-500/5 border-2 border-amber-200 dark:border-amber-500/20 p-8 rounded-[40px] flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-amber-500/5"
            >
              <div className="shrink-0 p-6 bg-amber-500 text-white rounded-3xl shadow-xl shadow-amber-500/20">
                <MousePointer2 className="w-10 h-10" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-black text-amber-600 dark:text-amber-400 uppercase tracking-tight mb-1">Sua Primeira Aula!</h2>
                <p className="text-amber-700/70 dark:text-amber-400/60 font-bold italic leading-relaxed">
                  Para começar seus estudos, clique em{' '}
                  <span className="text-amber-600 dark:text-amber-400 px-2.5 py-1 bg-amber-200/50 dark:bg-amber-400/10 rounded-xl mx-1 inline-flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> CURSO DIGITAÇÃO
                  </span>{' '}
                  no menu à esquerda e escolha a primeira lição do Módulo 1.
                </p>
              </div>
              <button
                onClick={onOpenPosture}
                className="shrink-0 px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-xs flex items-center gap-3 active:scale-95"
              >
                LIÇÃO DE POSTURA <Monitor className="w-5 h-5" />
              </button>
              <button
                onClick={onGoToLessons}
                className="shrink-0 px-10 py-5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-amber-500/20 uppercase tracking-widest text-xs flex items-center gap-3 active:scale-95"
              >
                COMEÇAR AGORA <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* 5. Modules Grid Section */}
          {homeConfig.show_modules && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-4">
                  <div className={`p-2.5 bg-${themeClasses.primary}/10 rounded-xl`}>
                    <BookOpen className={`w-6 h-6 text-${themeClasses.primary}`} />
                  </div>
                  Seus Módulos de Estudo
                </h3>
                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full">{accessibleModuleIds.length} Módulos Disponíveis</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedModules.map((module, idx) => {
                  const isLocked = !accessibleModuleIds.includes(module.id);
                  const status = getModuleStatus(module.id);

                  return (
                    <motion.div
                      key={module.id}
                      whileHover={!isLocked ? { y: -8, scale: 1.02 } : {}}
                      className={`p-8 rounded-[40px] border-2 transition-all relative overflow-hidden group ${
                        isLocked
                          ? 'bg-zinc-100 dark:bg-zinc-800/20 border-zinc-200 dark:border-zinc-800 opacity-60'
                          : status === 'concluido'
                          ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/20 shadow-xl shadow-emerald-500/5'
                          : status === 'progresso'
                          ? `bg-${themeClasses.primary}/5 dark:bg-${themeClasses.primary}/5 border-${themeClasses.primary}/20 shadow-xl shadow-${themeClasses.primary}/5`
                          : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-xl shadow-black/5'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${
                          status === 'concluido' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' :
                          status === 'progresso' ? `bg-${themeClasses.primary} text-white shadow-lg shadow-${themeClasses.primary}/20` :
                          isLocked ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400' :
                          `bg-${themeClasses.primary}/10 dark:bg-${themeClasses.primary}/5 text-${themeClasses.primary} border border-${themeClasses.primary}/10`
                        }`}>
                          {idx + 1}
                        </div>

                        {!isLocked && (
                          <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                            status === 'concluido' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                            status === 'progresso' ? `bg-${themeClasses.primary}/10 dark:bg-${themeClasses.primary}/10 text-${themeClasses.primary} dark:text-${themeClasses.accent}` :
                            'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                          }`}>
                            {status === 'concluido' ? '✓ Concluído' : status === 'progresso' ? '▶ Em Progresso' : 'Iniciar'}
                          </div>
                        )}
                      </div>

                      <h4 className={`font-black text-lg text-zinc-900 dark:text-white uppercase tracking-tight mb-4 transition-colors ${!isLocked ? `group-hover:text-${themeClasses.primary}` : ''}`}>
                        {module.title}
                      </h4>

                      {isLocked ? (
                        <div className="flex items-center gap-2 text-zinc-400 font-bold text-[10px] uppercase tracking-widest bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl">
                          <Lock className="w-4 h-4" /> Bloqueado no seu plano
                        </div>
                      ) : (
                        <button
                          onClick={onGoToLessons}
                          className={`flex items-center gap-2 text-${themeClasses.primary} font-black text-[11px] uppercase tracking-widest group-hover:gap-4 transition-all`}
                        >
                          Acessar Lições <ArrowRight className="w-5 h-5" />
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 6. Upgrade Banner (só para plano gratuito) */}
          {isFreePlan && nextPlan && homeConfig.show_upgrade && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 p-10 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-[48px] shadow-2xl shadow-amber-500/20 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/30 transition-all duration-700" />
              <div className="p-7 bg-white/20 backdrop-blur-md rounded-[32px] shrink-0 border border-white/20">
                <Crown className="w-12 h-12 text-white shadow-sm" />
              </div>
              <div className="flex-1 text-center md:text-left relative z-10">
                <h4 className="font-black text-3xl uppercase tracking-tighter mb-2">Evolua Sua Jornada</h4>
                <p className="text-amber-50 font-bold text-lg leading-relaxed opacity-90">
                  Libere módulos avançados, ganhe <span className="bg-white/20 px-2 py-0.5 rounded-lg">certificado exclusivo</span> e remova propagandas.
                </p>
              </div>
              {nextPlan.payment_url ? (
                <a
                  href={nextPlan.payment_url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 px-12 py-6 bg-white text-amber-600 hover:scale-105 active:scale-95 font-black rounded-2xl transition-all shadow-2xl uppercase tracking-widest text-sm flex items-center gap-4 relative z-10"
                >
                  FAZER UPGRADE AGORA <ArrowRight className="w-5 h-5" />
                </a>
              ) : (
                <button 
                  onClick={onOpenSettings}
                  className="shrink-0 px-12 py-6 bg-white text-amber-600 hover:scale-105 active:scale-95 font-black rounded-2xl transition-all shadow-2xl uppercase tracking-widest text-sm relative z-10"
                >
                  CONHECER PLANOS
                </button>
              )}
            </motion.div>
          )}

        </div>
      </main>

      {/* Achievements Modal */}
      <AnimatePresence>
        {isAchievementsOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[48px] shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50 shrink-0">
                <div>
                  <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none mb-1">Conquistas</h2>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Seu legado na plataforma</p>
                </div>
                <button onClick={() => setIsAchievementsOpen(false)} className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all text-zinc-400 hover:text-zinc-900">
                  <X className="w-7 h-7" />
                </button>
              </div>
              <div className="p-8 space-y-5 overflow-y-auto scrollbar-hide">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-6 p-6 rounded-[32px] border-2 transition-all ${
                      achievement.completed
                        ? 'bg-amber-50/50 dark:bg-amber-500/5 border-amber-100 dark:border-amber-900/30'
                        : 'bg-zinc-50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800 opacity-60'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border-2 ${
                      achievement.completed
                        ? 'bg-amber-500 text-white border-amber-400 shadow-xl shadow-amber-500/20'
                        : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-400 border-zinc-200 dark:border-zinc-600'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-lg font-black uppercase tracking-tight ${achievement.completed ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-500'}`}>
                        {achievement.title}
                      </h4>
                      <p className="text-xs font-bold text-zinc-400 lowercase">{achievement.desc}</p>
                    </div>
                    {achievement.completed && <CheckCircle className="w-7 h-7 text-emerald-500 shrink-0 animate-bounce" />}
                  </div>
                ))}
              </div>
              <div className="p-8 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 shrink-0 text-center">
                <button
                  onClick={() => setIsAchievementsOpen(false)}
                  className="w-full py-5 bg-zinc-900 dark:bg-blue-600 text-white font-black rounded-[24px] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs shadow-xl"
                >
                  CONTINUAR JORNADA
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Plan Details Modal */}
      <AnimatePresence>
        {isPlanDetailsOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[85vh] md:max-h-[90vh]"
            >
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-800 dark:bg-zinc-800 text-white shrink-0">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Detalhes do Plano</h2>
                  <p className="text-zinc-300 text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Configurações da sua conta</p>
                </div>
                <button onClick={() => setIsPlanDetailsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto scrollbar-hide">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                    <Crown className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] block mb-1">Seu Plano Atual</span>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">{userPlan?.name || 'Gratuito'}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-[28px] border border-zinc-100 dark:border-zinc-800">
                    <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Validade</span>
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-black">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {userPlan?.validity_days ? `${userPlan.validity_days} Dias` : 'Ilimitado'}
                    </div>
                  </div>
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-[28px] border border-zinc-100 dark:border-zinc-800">
                    <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Módulos</span>
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-black">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      {accessibleModuleIds.length} Liberados
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Módulos Acessíveis</span>
                  <div className="flex flex-wrap gap-2">
                    {accessibleModuleIds.map((mId, idx) => {
                      const mod = modules.find(m => m.id === mId);
                      return (
                        <div key={mId} className="px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black rounded-xl border border-blue-100 dark:border-blue-500/20">
                          {mod?.title || `Módulo ${idx + 1}`}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {!userPlan?.name.toLowerCase().includes('premium') && (
                  <div className="p-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[32px] text-white shadow-lg shadow-amber-500/20">
                    <h4 className="font-black text-lg mb-1 uppercase tracking-tight">Evolua seu Plano</h4>
                    <p className="text-xs font-bold opacity-90 mb-4 leading-relaxed">Libere módulos avançados e ganhe certificado de conclusão exclusivo.</p>
                    {nextPlan ? (
                      <a 
                        href={nextPlan.payment_url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full py-3 bg-white text-amber-600 font-black rounded-xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-all text-center"
                      >
                        Fazer Upgrade Agora
                      </a>
                    ) : (
                      <button 
                        onClick={onOpenSettings}
                        className="w-full py-3 bg-white text-amber-600 font-black rounded-xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-all"
                      >
                        Conhecer Planos
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 shrink-0 flex justify-center">
                <button onClick={() => setIsPlanDetailsOpen(false)} className="text-zinc-400 font-black text-xs uppercase tracking-[0.2em] hover:text-zinc-600 transition-colors">Fechar Detalhes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
