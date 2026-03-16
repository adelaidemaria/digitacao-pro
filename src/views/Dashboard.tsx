import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle, Lock, Play, MessageSquare, Award, User, LogOut, Settings as SettingsIcon, Crown, Activity, Percent, ArrowRight, ExternalLink } from 'lucide-react';
import { Module, Lesson, Plan } from '../types';

interface DashboardProps {
  user: any;
  modules: Module[];
  lessons: Lesson[];
  plans: Plan[];
  progress: any[];
  onStartLesson: (lesson: Lesson) => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, modules, lessons, plans, progress, onStartLesson, onLogout, onOpenSettings, onOpenProfile 
}) => {
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

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 flex flex-col lg:flex-row font-sans text-zinc-900 dark:text-zinc-100">
      {/* Sidebar */}
      <aside className="w-full lg:w-[360px] bg-white dark:bg-zinc-900 border-r border-zinc-200/50 dark:border-zinc-800 flex flex-col shrink-0 overflow-y-auto max-h-screen">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30">
              D
            </div>
            <div>
              <span className="block font-black text-xl text-zinc-900 dark:text-white tracking-tight leading-none">Digitador Pro</span>
              <span className="text-[10px] font-bold text-blue-500 tracking-widest uppercase">{userPlan?.name || 'Iniciante'}</span>
            </div>
          </div>

          {/* User Profile */}
          <div 
            onClick={onOpenProfile}
            className="group relative mb-8 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white dark:bg-zinc-700 rounded-full flex items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-600">
                <User className="w-6 h-6 text-zinc-400" />
              </div>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-base font-bold text-zinc-900 dark:text-white truncate">{user.full_name}</span>
                <span className="text-[10px] text-blue-500 uppercase font-bold tracking-wider flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Ver Perfil
                </span>
              </div>
              <SettingsIcon className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>

          <nav className="space-y-1 mb-10">
            <button className="w-full flex items-center gap-3 px-5 py-3.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl font-bold transition-all border border-blue-100 dark:border-blue-500/20 shadow-sm">
              <BookOpen className="w-5 h-5 flex-shrink-0" /> <span className="text-base">Módulos</span>
            </button>
            <button className="w-full flex items-center gap-3 px-5 py-3.5 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-700 dark:hover:text-zinc-300 rounded-xl font-medium transition-all">
              <MessageSquare className="w-5 h-5 flex-shrink-0" /> <span className="text-base">Comunidade</span>
            </button>
            <button className="w-full flex items-center gap-3 px-5 py-3.5 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-700 dark:hover:text-zinc-300 rounded-xl font-medium transition-all">
              <Award className="w-5 h-5 flex-shrink-0" /> <span className="text-base">Conquistas</span>
            </button>
          </nav>

          {/* Stats Sections */}
          <div className="space-y-6">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-inner">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white dark:bg-zinc-700 rounded-lg text-blue-500 shadow-sm">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-zinc-800 dark:text-white uppercase tracking-wider">Meu Progresso</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black mb-2">
                    <span className="text-zinc-400 uppercase tracking-widest">Módulos Concluídos</span>
                    <span className="text-blue-500 font-black">{completedModulesCount} / {modules.length}</span>
                  </div>
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${progressPercent}%` }} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-zinc-700 p-4 rounded-xl border border-zinc-100 dark:border-zinc-600 shadow-sm text-center">
                    <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Média PPM</span>
                    <span className="text-2xl font-black text-zinc-900 dark:text-white">{avgWpm}</span>
                  </div>
                  <div className="bg-white dark:bg-zinc-700 p-4 rounded-xl border border-zinc-100 dark:border-zinc-600 shadow-sm text-center">
                    <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Lições</span>
                    <span className="text-2xl font-black text-zinc-900 dark:text-white">{uniqueCompletedLessonIds.size}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-950 p-6 rounded-3xl text-white shadow-xl border border-zinc-700/50">
              <div className="absolute -top-6 -right-6 opacity-10">
                <Award className="w-24 h-24" />
              </div>
              <h3 className="text-lg font-black mb-2 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" /> Plano {userPlan?.name || 'Gratuito'}
              </h3>
              <p className="text-zinc-400 text-xs mb-6 leading-relaxed font-bold uppercase tracking-wider">
                {userPlan?.validity_days ? `${userPlan.validity_days} DIAS DE ACESSO` : 'ACESSO LIMITADO'}
              </p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black text-xs transition-all uppercase tracking-widest border border-white/10">
                Ver detalhes
              </button>
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-zinc-100 dark:border-zinc-800/50">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center p-3.5 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl text-rose-500 font-black transition-all gap-2 text-sm uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-y-auto bg-white/30 dark:bg-transparent">
        <div className="max-w-[1200px] mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight">
              Olá, {user.full_name.split(' ')[0]}! 👋
            </h1>
            <p className="text-lg text-zinc-500 font-medium tracking-tight">Excelente dia para praticar sua digitação.</p>
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
                  <section key={module.id} className={`space-y-8 ${isLocked ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                    <div className="flex items-center justify-between border-b-2 border-zinc-100 dark:border-zinc-800 pb-6">
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black border-2 transition-all ${isCompleted ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-white dark:bg-zinc-800 text-blue-500 border-zinc-100 dark:border-zinc-700'}`}>
                          {idx + 1}
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">{module.title}</h2>
                          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{module.description}</p>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-2">
                        {isLocked ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-400 text-[10px] font-black uppercase tracking-widest border border-zinc-200 dark:border-zinc-700">
                            <Lock className="w-3.5 h-3.5" /> Módulo Bloqueado
                          </div>
                        ) : isCompleted ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
                            <CheckCircle className="w-3.5 h-3.5" /> Concluído
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-500/20">
                            <Activity className="w-3.5 h-3.5" /> Em Progresso
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {lessons.filter(l => l.module_id === module.id).sort((a,b) => (a.order||0) - (b.order||0)).map(lesson => {
                        const status = getLessonStatus(lesson.id);

                        return (
                          <motion.button
                            key={lesson.id}
                            whileHover={!isLocked ? { y: -8, scale: 1.02 } : {}}
                            whileTap={!isLocked ? { scale: 0.98 } : {}}
                            onClick={() => !isLocked && onStartLesson(lesson)}
                            className={`p-8 rounded-[32px] border-2 text-left transition-all flex flex-col gap-8 shadow-sm ${
                              status 
                                ? 'bg-emerald-50/20 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-800 shadow-emerald-500/5' 
                                : isLocked 
                                  ? 'bg-zinc-100/30 dark:bg-zinc-900/10 border-zinc-100 dark:border-zinc-800' 
                                  : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-blue-400 hover:shadow-xl shadow-blue-500/5'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className={`p-4 rounded-2xl shadow-sm ${status ? 'bg-emerald-500 text-white' : isLocked ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 border border-blue-100 dark:border-blue-800'}`}>
                                {status ? <CheckCircle className="w-6 h-6" /> : isLocked ? <Lock className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border-2 ${
                                lesson.difficulty === 'easy' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                lesson.difficulty === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                                'bg-rose-50 border-rose-200 text-rose-600'
                              }`}>
                                {lesson.difficulty === 'easy' ? 'FÁCIL' : lesson.difficulty === 'medium' ? 'MÉDIO' : 'AVANÇADO'}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">AULA {lesson.order}</span>
                                {status && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                              </div>
                              <h3 className="font-black text-xl text-zinc-900 dark:text-white leading-tight">{lesson.title}</h3>
                            </div>
                            
                            {status && (
                              <div className="mt-auto pt-6 border-t border-emerald-100 dark:border-emerald-800/50 flex flex-col gap-2">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-tighter">
                                  <span className="flex items-center gap-2 text-emerald-600"><Activity className="w-4 h-4" /> {status.wpm} PPM</span>
                                  <span className="flex items-center gap-2 text-emerald-600"><Percent className="w-4 h-4" /> {status.accuracy}% Precisão</span>
                                </div>
                              </div>
                            )}
                            
                            {isLocked && !status && (
                              <div className="mt-auto pt-4 flex items-center gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                                <Lock className="w-3.5 h-3.5" /> Requer Plano Premium
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
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
    </div>
  );
};
