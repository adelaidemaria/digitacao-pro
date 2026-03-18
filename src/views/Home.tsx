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
} from 'lucide-react';
import { Module, Lesson, Plan, Announcement, Course, Tip } from '../types';

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
  announcement?: Announcement;
  onAnnouncementClick?: (id: string) => void;
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

export const Home: React.FC<HomeViewProps> = ({
  user, modules, lessons, plans, progress, tips = [], onLogout, onOpenSettings, onOpenProfile, onOpenCourses, onGoToLessons, announcement, onAnnouncementClick
}) => {
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 flex flex-col lg:flex-row font-sans text-zinc-900 dark:text-zinc-100">

      {/* ─── SIDEBAR (igual ao Dashboard) ─── */}
      <aside className="w-full lg:w-[280px] bg-white dark:bg-zinc-900 border-r border-zinc-200/50 dark:border-zinc-800 flex flex-col shrink-0 lg:h-screen overflow-hidden">
        <div className="p-5 flex flex-col h-full overflow-y-auto scrollbar-hide">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/30">
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
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl font-bold transition-all border border-blue-100 dark:border-blue-500/20 shadow-sm">
              <HomeIcon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm uppercase tracking-tight">INÍCIO</span>
            </button>

            <button
              onClick={onGoToLessons}
              className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-700 dark:hover:text-zinc-300 rounded-xl font-medium transition-all text-sm group"
            >
              <BookOpen className="w-4 h-4 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-bold uppercase tracking-tight">AULAS</span>
            </button>

            <button
              onClick={onOpenCourses}
              className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-700 dark:hover:text-zinc-300 rounded-xl font-medium transition-all text-sm group"
            >
              <Video className="w-4 h-4 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-bold uppercase tracking-tight">+ CURSOS</span>
            </button>

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
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-black text-[9px] transition-all uppercase tracking-widest border border-white/10">
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
        <div className="max-w-[1000px] mx-auto">

          {/* Announcement Bar */}
          {announcement && (
            <div
              className="mb-8 overflow-hidden rounded-[24px] py-3.5 shadow-xl shadow-black/5 border border-black/5 relative"
              style={{ backgroundColor: announcement.bg_color }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/20 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/20 to-transparent z-10 pointer-events-none" />
              <div className="flex items-center">
                <div className="px-5 shrink-0 z-20 flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg" style={{ color: announcement.text_color }}>
                    <Megaphone className="w-3.5 h-3.5 animate-bounce" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70" style={{ color: announcement.text_color }}>Aviso:</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <motion.div
                    animate={{ x: ['50%', '-100%'] }}
                    transition={{ duration: 60 - ((announcement.speed ?? 5) * 5), repeat: Infinity, ease: 'linear' }}
                    className="whitespace-nowrap inline-block"
                  >
                    <span className="font-extrabold text-base uppercase tracking-tight px-4" style={{ color: announcement.text_color }}>
                      {announcement.content}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          )}

          {/* Greeting */}
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight">
              Olá, {user.full_name.split(' ')[0]}! 👋
            </h1>
            <p className="text-lg text-zinc-500 font-medium italic">Bem-vindo ao seu portal de aprendizado.</p>
          </header>

          {/* Stats + Video Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-zinc-200/50 dark:border-zinc-800 shadow-xl shadow-black/5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-500" /> Resumo de Estudo
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Média PPM</span>
                    <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{avgWpm}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Lições</span>
                    <span className="text-3xl font-black text-zinc-900 dark:text-white">{uniqueCompletedLessonIds.size}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Precisão</span>
                    <span className="text-3xl font-black text-emerald-500">{avgAccuracy}%</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Módulos</span>
                    <span className="text-3xl font-black text-zinc-900 dark:text-white">{completedModulesCount}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onGoToLessons}
                className="mt-8 w-full py-4 bg-zinc-900 dark:bg-zinc-800 text-white font-black rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-all shadow-lg active:scale-95"
              >
                Continuar Aulas <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Video Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[40px] text-white shadow-2xl shadow-blue-500/20 flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl" />
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Instruções de Início</h3>
              <p className="text-blue-100 font-bold text-sm max-w-[280px] mb-5 leading-relaxed">
                Assista ao vídeo e aprenda como utilizar a plataforma da melhor maneira.
              </p>
              <div className="w-full aspect-video bg-black/20 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/TLNKMuyYJRY" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </div>

          {/* First Access Guidance */}
          {isFirstAccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12 bg-amber-50 dark:bg-amber-500/5 border-2 border-amber-200 dark:border-amber-500/20 p-8 rounded-[40px] flex flex-col md:flex-row items-center gap-8"
            >
              <div className="shrink-0 p-5 bg-amber-500 text-white rounded-3xl shadow-xl shadow-amber-500/20">
                <MousePointer2 className="w-10 h-10" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-black text-amber-600 dark:text-amber-400 uppercase tracking-tight mb-1">Sua Primeira Aula!</h2>
                <p className="text-amber-700/70 dark:text-amber-400/60 font-bold italic leading-relaxed">
                  Para começar seus estudos, clique em{' '}
                  <span className="text-amber-600 dark:text-amber-400 px-2 py-0.5 bg-amber-200/50 dark:bg-amber-400/10 rounded-lg mx-1 inline-flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" /> AULAS
                  </span>{' '}
                  no menu à esquerda e escolha a primeira lição do Módulo 1.
                </p>
              </div>
              <button
                onClick={onGoToLessons}
                className="shrink-0 px-8 py-5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-amber-500/20 uppercase tracking-widest text-xs flex items-center gap-3 active:scale-95"
              >
                COMEÇAR AGORA <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Modules Grid */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-500" /> Seus Módulos
              </h3>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{accessibleModuleIds.length} Módulos Disponíveis</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedModules.map((module, idx) => {
                const isLocked = !accessibleModuleIds.includes(module.id);
                const status = getModuleStatus(module.id);

                return (
                  <motion.div
                    key={module.id}
                    whileHover={!isLocked ? { y: -4 } : {}}
                    className={`p-6 rounded-[28px] border-2 transition-all relative overflow-hidden group ${
                      isLocked
                        ? 'bg-zinc-100 dark:bg-zinc-800/20 border-zinc-200 dark:border-zinc-800 opacity-60'
                        : status === 'concluido'
                        ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/20 shadow-lg'
                        : status === 'progresso'
                        ? 'bg-blue-50/50 dark:bg-blue-500/5 border-blue-100 dark:border-blue-500/20 shadow-lg'
                        : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-black ${
                        status === 'concluido' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' :
                        status === 'progresso' ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' :
                        isLocked ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400' :
                        'bg-blue-50 dark:bg-blue-500/10 text-blue-600 border border-blue-100'
                      }`}>
                        {idx + 1}
                      </div>

                      {!isLocked && (
                        <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                          status === 'concluido' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                          status === 'progresso' ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                          'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                        }`}>
                          {status === 'concluido' ? '✓ Concluído' : status === 'progresso' ? '▶ Em Progresso' : 'Iniciar'}
                        </div>
                      )}
                    </div>

                    <h4 className={`font-black text-sm text-zinc-900 dark:text-white uppercase tracking-tight mb-3 transition-colors ${!isLocked ? 'group-hover:text-blue-500' : ''}`}>
                      {module.title}
                    </h4>

                    {isLocked ? (
                      <div className="flex items-center gap-2 text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
                        <Activity className="w-3.5 h-3.5" /> Bloqueado no seu plano
                      </div>
                    ) : (
                      <button
                        onClick={onGoToLessons}
                        className="flex items-center gap-1.5 text-blue-500 font-black text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all"
                      >
                        Ver lições <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Upgrade Banner (só para plano gratuito) */}
          {isFreePlan && nextPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 p-8 bg-white dark:bg-zinc-900 border-2 border-amber-200 dark:border-amber-500/20 rounded-[40px] shadow-xl shadow-black/5 flex flex-col md:flex-row items-center gap-8"
            >
              <div className="p-5 bg-amber-50 dark:bg-amber-500/10 rounded-3xl shrink-0">
                <Crown className="w-10 h-10 text-amber-500" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-black text-xl text-zinc-900 dark:text-white uppercase tracking-tight mb-1">Evolua Seu Plano</h4>
                <p className="text-zinc-500 dark:text-zinc-400 font-bold text-sm leading-relaxed">
                  Libere módulos avançados e ganhe <span className="text-amber-500 font-black">certificado de conclusão exclusivo</span>.
                </p>
              </div>
              {nextPlan.payment_url ? (
                <a
                  href={nextPlan.payment_url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-amber-500/20 uppercase tracking-widest text-xs flex items-center gap-3 active:scale-95"
                >
                  Fazer Upgrade <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <button className="shrink-0 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-amber-500/20 uppercase tracking-widest text-xs active:scale-95">
                  Fazer Upgrade
                </button>
              )}
            </motion.div>
          )}

          {/* Rotating Tip */}
          <div className="p-8 bg-zinc-900 dark:bg-zinc-800 rounded-[40px] shadow-xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/[0.02] rounded-full -mr-8 -mb-8 pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] mb-5">
                <Lightbulb className="w-3.5 h-3.5" /> Dica de Mestre
              </span>
              <h3 className={`text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-3 ${(currentTip as any).accent_color || (currentTip as any).accentClass || 'text-amber-400'}`}>
                <span className="text-white">{currentTip.icon}</span> {currentTip.title}
              </h3>
              <p className="text-sm font-bold text-zinc-400 max-w-2xl leading-relaxed">
                {(currentTip as any).content || (currentTip as any).text}
              </p>
            </div>

            {/* Tip indicator dots */}
            <div className="relative z-10 flex items-center gap-2 mt-8">
              {displayTips.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all ${i === tipIndex ? 'w-6 bg-white/40 shadow shadow-white/10' : 'w-1.5 bg-zinc-700/50'}`}
                />
              ))}
              <span className="ml-auto text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                {tipIndex + 1} / {displayTips.length}
              </span>
            </div>
          </div>

        </div>
      </main>

      {/* Achievements Modal */}
      <AnimatePresence>
        {isAchievementsOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50 shrink-0">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Minhas Conquistas</h2>
                <button onClick={() => setIsAchievementsOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-5 p-5 rounded-3xl border-2 transition-all ${
                      achievement.completed
                        ? 'bg-amber-50/50 dark:bg-amber-500/5 border-amber-100 dark:border-amber-800/50'
                        : 'bg-zinc-50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800 opacity-60'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${
                      achievement.completed
                        ? 'bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/20'
                        : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-400 border-zinc-200 dark:border-zinc-600'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-base font-black uppercase tracking-tight ${achievement.completed ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-500'}`}>
                        {achievement.title}
                      </h4>
                      <p className="text-xs font-bold text-zinc-400 lowercase">{achievement.desc}</p>
                    </div>
                    {achievement.completed && <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />}
                  </div>
                ))}
              </div>
              <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
                <button
                  onClick={() => setIsAchievementsOpen(false)}
                  className="w-full py-4 bg-zinc-900 dark:bg-zinc-700 text-white font-black rounded-2xl hover:opacity-90 transition-all uppercase tracking-widest text-xs"
                >
                  Continuar Praticando
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
