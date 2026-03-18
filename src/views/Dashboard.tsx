import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle, Lock, Play, MessageSquare, Award, User, LogOut, Settings as SettingsIcon, Crown, Activity, Percent, ArrowRight, ExternalLink, TrendingUp, X, Clock, RotateCcw, Megaphone, Video } from 'lucide-react';
import { Module, Lesson, Plan, Announcement, Course } from '../types';

interface DashboardProps {
  user: any;
  modules: Module[];
  lessons: Lesson[];
  plans: Plan[];
  courses: Course[];
  progress: any[];
  onStartLesson: (lesson: Lesson) => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  announcement?: Announcement;
  onAnnouncementClick?: (id: string) => void;
  onCourseClick?: (id: string) => void;
  onOpenCourses: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, modules, lessons, plans, courses, progress, onStartLesson, onLogout, onOpenSettings, onOpenProfile, announcement, onAnnouncementClick, onCourseClick, onOpenCourses 
}) => {
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isPlanDetailsOpen, setIsPlanDetailsOpen] = useState(false);
  const userPlan = plans.find(p => p.id === user.plan_id);
  const accessibleModuleIds = userPlan?.accessible_modules || [];
  
  // Sort modules by order
  const sortedModules = [...modules].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  const [activeModule, setActiveModule] = useState<string | null>(sortedModules[0]?.id || null);

  const getLessonStatus = (lessonId: string) => {
    return progress.find(p => p.lesson_id === lessonId);
  };

  const uniqueCompletedLessonIds = new Set(progress.map(p => p.lesson_id));
  
  const isModuleCompleted = (modId: string) => {
    const moduleLessons = lessons.filter(l => l.module_id === modId);
    return moduleLessons.length > 0 && moduleLessons.every(l => uniqueCompletedLessonIds.has(l.id));
  };

  // Check if all accessible modules are completed
  const allAccessibleCompleted = accessibleModuleIds.length > 0 && accessibleModuleIds.every(mId => isModuleCompleted(mId));

  // Find next plan for upgrade
  const nextPlan = plans.find(p => p.active && p.id !== user.plan_id && !p.name.toLowerCase().includes('gratuito'));

  const completedModulesCount = modules.filter(m => isModuleCompleted(m.id)).length;
  const progressPercent = lessons.length > 0 ? (uniqueCompletedLessonIds.size / lessons.length) * 100 : 0;
  
  const avgWpm = progress.length > 0 
    ? Math.round(progress.reduce((acc, curr) => acc + (curr.wpm || 0), 0) / progress.length)
    : 0;

  const achievements = [
    { 
      id: 'first-lesson', 
      title: 'Primeiro Passo', 
      desc: 'Concluiu sua primeira lição', 
      icon: <CheckCircle className="w-5 h-5" />,
      completed: progress.length > 0
    },
    { 
      id: 'fast-typer', 
      title: 'Veloz', 
      desc: 'Alcançou mais de 40 PPM', 
      icon: <TrendingUp className="w-5 h-5" />,
      completed: progress.some(p => (p.wpm || 0) >= 40)
    },
    { 
      id: 'accurate', 
      title: 'Perfeccionista', 
      desc: 'Lição com 100% de precisão', 
      icon: <Award className="w-5 h-5" />,
      completed: progress.some(p => (p.accuracy || 0) === 100)
    },
    { 
      id: 'module-master', 
      title: 'Mestre de Módulo', 
      desc: 'Concluiu um módulo inteiro', 
      icon: <Crown className="w-5 h-5" />,
      completed: modules.some(m => isModuleCompleted(m.id))
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 flex flex-col lg:flex-row font-sans text-zinc-900 dark:text-zinc-100">
      {/* Sidebar */}
      <aside className="w-full lg:w-[280px] bg-white dark:bg-zinc-900 border-r border-zinc-200/50 dark:border-zinc-800 flex flex-col shrink-0 lg:h-screen overflow-hidden">
        <div className="p-5 flex flex-col h-full overflow-y-auto scrollbar-hide">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/30">
              D
            </div>
            <div>
              <span className="block font-black text-lg text-zinc-900 dark:text-white tracking-tight leading-none">Digitação Sem Segredo</span>
              <span className="text-[9px] font-bold text-blue-500 tracking-widest uppercase">{userPlan?.name || 'Iniciante'}</span>
            </div>
          </div>

          <nav className="space-y-1 mb-6">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl font-bold transition-all border border-blue-100 dark:border-blue-500/20 shadow-sm">
              <BookOpen className="w-4 h-4 flex-shrink-0" /> <span className="text-sm">AULAS</span>
            </button>
            <button 
              onClick={onOpenCourses}
              className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-700 dark:hover:text-zinc-300 rounded-xl font-medium transition-all text-sm group"
            >
              <Video className="w-4 h-4 flex-shrink-0 group-hover:text-blue-500 transition-colors" /> <span className="text-sm font-bold uppercase tracking-tight">+ CURSOS</span>
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

          {/* Stats Sections */}
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
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${progressPercent}%` }} 
                    />
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

            <div className="relative overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-950 p-4.5 rounded-[28px] text-white shadow-xl border border-zinc-700/50">
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

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto bg-white/30 dark:bg-transparent">
        <div className="max-w-[1200px] mx-auto">
          {announcement && (
            <div 
              className="mb-8 overflow-hidden rounded-[24px] py-3.5 shadow-xl shadow-black/5 border border-black/5 relative group"
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
                    animate={{ x: ["50%", "-100%"] }}
                    transition={{ 
                      duration: 60 - ((announcement.speed ?? 5) * 5), 
                      repeat: Infinity, 
                      ease: "linear",
                    }}
                    className="whitespace-nowrap inline-block"
                  >
                    {announcement.link ? (
                      <a 
                        href={announcement.link} 
                        target="_blank" 
                        rel="noreferrer"
                        onClick={() => onAnnouncementClick?.(announcement.id)}
                        className="font-extrabold text-base uppercase tracking-tight hover:underline flex items-center gap-3 px-4"
                        style={{ color: announcement.text_color }}
                      >
                        {announcement.content} <ArrowRight className="w-4 h-4 inline opacity-50" />
                      </a>
                    ) : (
                      <span className="font-extrabold text-base uppercase tracking-tight px-4" style={{ color: announcement.text_color }}>
                        {announcement.content}
                      </span>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight">
              Olá, {user.full_name.split(' ')[0]}! 👋
            </h1>
            <p className="text-base text-zinc-500 font-medium tracking-tight">Excelente dia para praticar sua digitação.</p>
          </header>

          {/* Upgrade Prompt if finishes accessible modules */}
          {allAccessibleCompleted && nextPlan && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-12 bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-2xl shadow-blue-500/30 flex flex-col md:flex-row items-center gap-8 border border-white/10 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
              <div className="p-5 bg-white/10 rounded-[28px] shrink-0 border border-white/10">
                <Crown className="w-12 h-12 text-amber-300 shadow-glow" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-black mb-1 uppercase tracking-tight">Parabéns! Você concluiu seus módulos.</h2>
                <p className="text-blue-100 font-bold opacity-80 mb-0">Faça o upgrade para o <span className="text-amber-300">{nextPlan.name}</span> e libere os próximos níveis agora mesmo!</p>
              </div>
              <a 
                href={nextPlan.payment_url || '#'} 
                target="_blank" 
                rel="noreferrer"
                className="px-8 py-5 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-all flex items-center gap-3 shadow-lg shadow-black/10 group min-w-[240px] justify-center"
              >
                QUERO O ACESSO COMPLETO <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          )}

          <div className="grid grid-cols-1 gap-16">
            {/* Modules List */}
            <div className="space-y-16">
              {sortedModules.map((module, idx) => {
                const isLocked = !accessibleModuleIds.includes(module.id);
                const isCompleted = isModuleCompleted(module.id);

                return (
                  <section key={module.id} className={`space-y-12 ${isLocked ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                    <div className="flex items-center justify-between bg-zinc-100/50 dark:bg-zinc-800/30 p-8 rounded-[32px] border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm transition-all hover:shadow-md">
                      <div className="flex items-center gap-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black border-2 transition-all ${isCompleted ? 'bg-emerald-500 text-white border-emerald-500 shadow-xl shadow-emerald-500/30' : 'bg-white dark:bg-zinc-800 text-blue-600 border-zinc-200 dark:border-zinc-700 shadow-inner'}`}>
                          {idx + 1}
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-1">{module.title}</h2>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-[0.2em]">{module.description}</p>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-2">
                        {isLocked ? (
                          <div className="flex items-center gap-3 px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-zinc-400 text-[10px] font-black uppercase tracking-widest border border-zinc-200 dark:border-zinc-700">
                            <Lock className="w-3.5 h-3.5" /> Módulo Bloqueado
                          </div>
                        ) : isCompleted ? (
                          <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
                            <CheckCircle className="w-3.5 h-3.5" /> Concluído
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-500/20">
                            <Activity className="w-3.5 h-3.5" /> Em Progresso
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-full">
                      <table className="w-full border-separate border-spacing-y-3">
                        <thead>
                          <tr className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                            <th className="px-4 md:px-8 pb-2 text-left">Lição</th>
                            <th className="hidden lg:table-cell px-6 pb-2 text-center">Nível</th>
                            <th className="hidden lg:table-cell px-6 pb-2 text-center">Tempo</th>
                            <th className="hidden sm:table-cell px-6 pb-2 text-center">Velocidade</th>
                            <th className="hidden sm:table-cell px-6 pb-2 text-center">Precisão</th>
                            <th className="px-6 pb-2 text-right pr-4 md:pr-12">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lessons.filter(l => l.module_id === module.id).sort((a,b) => (a.order||0) - (b.order||0)).map(lesson => {
                            const status = getLessonStatus(lesson.id);

                            return (
                              <motion.tr
                                key={lesson.id}
                                whileHover={!isLocked ? { scale: 1.002, y: -1 } : {}}
                                onClick={() => !isLocked && onStartLesson(lesson)}
                                className={`group cursor-pointer transition-all ${
                                  isLocked ? 'opacity-50' : ''
                                }`}
                              >
                                {/* Lição Column */}
                                <td className={`pl-4 md:pl-8 pr-4 md:pr-6 py-5 rounded-l-[24px] border-y-2 border-l-2 transition-colors ${
                                  !isLocked ? 'group-hover:bg-zinc-100/80 dark:group-hover:bg-zinc-800/80' : ''
                                } ${
                                  status ? 'bg-emerald-50/10 border-emerald-100/50' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'
                                }`}>
                                  <div className="flex items-center gap-3 md:gap-5">
                                    <div className={`w-8 h-8 md:w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                                      status ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                                      isLocked ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400' : 
                                      'bg-blue-50 dark:bg-blue-900/20 text-blue-500 border border-blue-100'
                                    }`}>
                                      {status ? <CheckCircle className="w-4 h-4 md:w-5 h-5 font-black" /> : isLocked ? <Lock className="w-4 h-4 md:w-5 h-5" /> : <Play className="w-4 h-4 md:w-5 h-5 ml-0.5" />}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Aula {lesson.order}</span>
                                      <span className="font-bold text-sm md:text-base text-zinc-800 dark:text-white group-hover:text-blue-500 transition-colors uppercase tracking-tight truncate max-w-[120px] md:max-w-none">{lesson.title}</span>
                                      
                                      {/* Mobile-only stats */}
                                      <div className="flex sm:hidden items-center gap-3 mt-1.5">
                                        {status ? (
                                          <>
                                            <span className="text-[9px] font-black text-emerald-600 flex items-center gap-1"><Activity className="w-2.5 h-2.5" /> {status.wpm}</span>
                                            <span className="text-[9px] font-black text-blue-500 flex items-center gap-1"><Percent className="w-2.5 h-2.5" /> {status.accuracy}%</span>
                                            {status.duration_seconds && <span className="text-[9px] font-black text-zinc-500 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {status.duration_seconds} seg</span>}
                                          </>
                                        ) : (
                                           <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border ${
                                            lesson.difficulty === 'easy' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                            lesson.difficulty === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                                            'bg-rose-50 border-rose-200 text-rose-600'
                                          }`}>
                                            {lesson.difficulty === 'easy' ? 'Fácil' : lesson.difficulty === 'medium' ? 'Médio' : 'Avançado'}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Nível Column (Hidden on mobile/tablet) */}
                                <td className={`hidden lg:table-cell px-6 py-5 border-y-2 text-center transition-colors ${
                                  !isLocked ? 'group-hover:bg-zinc-100/80 dark:group-hover:bg-zinc-800/80' : ''
                                } ${
                                  status ? 'bg-emerald-50/10 border-emerald-100/50' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'
                                }`}>
                                  <span className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${
                                    lesson.difficulty === 'easy' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                    lesson.difficulty === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                                    'bg-rose-50 border-rose-200 text-rose-600'
                                  }`}>
                                    {lesson.difficulty === 'easy' ? 'Fácil' : lesson.difficulty === 'medium' ? 'Médio' : 'Avançado'}
                                  </span>
                                </td>

                                {/* Tempo Column (Hidden on mobile/tablet) */}
                                <td className={`hidden lg:table-cell px-6 py-5 border-y-2 text-center transition-colors ${
                                  !isLocked ? 'group-hover:bg-zinc-100/80 dark:group-hover:bg-zinc-800/80' : ''
                                } ${
                                  status ? 'bg-emerald-50/10 border-emerald-100/50' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'
                                }`}>
                                  <div className="flex flex-col items-center">
                                    {status?.duration_seconds ? (
                                      <span className="text-sm font-black text-zinc-800 dark:text-white flex items-center gap-1.5 uppercase tracking-tight">
                                        <Clock className="w-3.5 h-3.5 text-zinc-400" /> {status.duration_seconds} seg
                                      </span>
                                    ) : (
                                      <span className="text-sm font-bold text-zinc-300">--</span>
                                    )}
                                  </div>
                                </td>

                                {/* Velocidade Column (Hidden on mobile) */}
                                <td className={`hidden sm:table-cell px-6 py-5 border-y-2 text-center transition-colors ${
                                  !isLocked ? 'group-hover:bg-zinc-100/80 dark:group-hover:bg-zinc-800/80' : ''
                                } ${
                                  status ? 'bg-emerald-50/10 border-emerald-100/50' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'
                                }`}>
                                  <div className="flex flex-col items-center">
                                    {status ? (
                                      <span className="text-sm font-black text-zinc-800 dark:text-white flex items-center gap-1.5 uppercase tracking-tight">
                                        <Activity className="w-3.5 h-3.5 text-emerald-500" /> {status.wpm} PPM
                                      </span>
                                    ) : (
                                      <span className="text-sm font-bold text-zinc-300">--</span>
                                    )}
                                  </div>
                                </td>

                                {/* Precisão Column (Hidden on mobile) */}
                                <td className={`hidden sm:table-cell px-6 py-5 border-y-2 text-center transition-colors ${
                                  !isLocked ? 'group-hover:bg-zinc-100/80 dark:group-hover:bg-zinc-800/80' : ''
                                } ${
                                  status ? 'bg-emerald-50/10 border-emerald-100/50' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'
                                }`}>
                                  <div className="flex flex-col items-center">
                                    {status ? (
                                      <span className="text-sm font-black text-zinc-800 dark:text-white flex items-center gap-1.5 uppercase tracking-tight">
                                        <Percent className="w-3.5 h-3.5 text-blue-500" /> {status.accuracy}%
                                      </span>
                                    ) : (
                                      <span className="text-sm font-bold text-zinc-300">--</span>
                                    )}
                                  </div>
                                </td>

                                {/* Status Column */}
                                <td className={`pr-4 md:pr-12 pl-4 md:pl-6 py-5 rounded-r-[24px] border-y-2 border-r-2 text-right transition-colors ${
                                  !isLocked ? 'group-hover:bg-zinc-100/80 dark:group-hover:bg-zinc-800/80' : ''
                                } ${
                                  status ? 'bg-emerald-50/10 border-emerald-100/50' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'
                                }`}>
                                  <div className="flex items-center justify-end gap-3 md:gap-5">
                                    {status ? (
                                      <>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onStartLesson(lesson);
                                          }}
                                          className="hidden md:flex text-[10px] font-black text-blue-500 hover:text-blue-600 uppercase tracking-[0.2em] items-center gap-1.5 group/btn"
                                        >
                                          <RotateCcw className="w-3 h-3 transition-transform group-hover/btn:rotate-[-45deg]" /> Refazer
                                        </button>
                                        <span className="text-zinc-800 dark:text-white flex items-center gap-2 font-black text-[10px] md:text-[11px] uppercase tracking-widest">
                                          <span className="hidden xs:inline">Concluido</span> <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        </span>
                                      </>
                                    ) : isLocked ? (
                                      <span className="text-zinc-400 flex items-center gap-2 font-black text-[10px] md:text-[11px] uppercase tracking-widest">
                                        <span className="hidden xs:inline">Bloqueado</span> <Lock className="w-4 h-4" />
                                      </span>
                                    ) : (
                                      <span className="text-blue-500 group-hover:translate-x-1 transition-transform flex items-center gap-2 font-black text-[10px] md:text-[11px] uppercase tracking-widest">
                                        <span className="hidden xs:inline">Iniciar</span> <ArrowRight className="w-4 h-4" />
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {isLocked && (
                      <div className="p-10 bg-zinc-100/50 dark:bg-zinc-800/20 rounded-[40px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm mb-6">
                          <Lock className="w-8 h-8 text-zinc-300" />
                        </div>
                        <h3 className="text-xl font-black text-zinc-800 dark:text-white mb-2 uppercase tracking-tight">Módulo Bloqueado</h3>
                        <p className="text-sm text-zinc-400 font-bold max-w-sm mb-8 leading-relaxed">Você precisa de um Plano de Acesso superior para liberar estas lições e continuar sua evolução.</p>
                        {nextPlan && (
                          <a 
                            href={nextPlan.payment_url || '#'} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-3 px-8 py-4 bg-blue-500 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest text-xs"
                          >
                             Liberar com {nextPlan.name} <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </section>
                );
              })}
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
              className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[85vh] md:max-h-[90vh]"
            >
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50 shrink-0">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Minhas Conquistas</h2>
                <button onClick={() => setIsAchievementsOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>
              
              <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
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
                    {achievement.completed && (
                      <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                    )}
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
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em]">Configurações da sua conta</p>
                </div>
                <button onClick={() => setIsPlanDetailsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
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
                    <button className="w-full py-3 bg-white text-amber-600 font-black rounded-xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-all">
                      Fazer Upgrade Agora
                    </button>
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
