import React, { useState, useEffect } from 'react';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { Login } from './views/Login';
import { Dashboard } from './views/Dashboard';
import { Home } from './views/Home';

import { AdminPanel } from './views/AdminPanel';
import { TypingView } from './views/TypingView';
import { Module, Lesson, Profile, Plan, Course, Tip, HomeVideo, HomeConfig } from './types';
import { X, Volume2, Type, Keyboard, Monitor, User, Activity, Video, ExternalLink, Settings, Check, Play, Clock, Lightbulb, Palette, LayoutDashboard, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Profile;
  onUpdate: (newName: string) => void;
  initialTab?: 'profile' | 'settings';
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onUpdate, initialTab = 'profile' }) => {
  const [name, setName] = useState(user.full_name);
  const { settings, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>(initialTab);

  useEffect(() => {
    setName(user.full_name);
  }, [user.full_name]);

  useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-white/10"
          >
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
              <div className="flex justify-between items-center mb-4 px-4 pt-4">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Preferências</h2>
                <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all text-zinc-400 hover:text-zinc-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl mx-4 mb-2">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'profile' ? 'bg-white dark:bg-zinc-700 text-blue-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  <User className="w-4 h-4" /> Perfil
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-white dark:bg-zinc-700 text-blue-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  <Settings className="w-4 h-4" /> Ajustes
                </button>
              </div>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {activeTab === 'profile' ? (
                <div className="space-y-8">
                  <div className="flex flex-col items-center gap-4 mb-2">
                    <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center border-4 border-blue-500 shadow-xl shadow-blue-500/10">
                      <User className="w-12 h-12 text-zinc-400" />
                    </div>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-2">{user.role === 'admin' ? 'Administrador' : 'Acesso Aluno'}</span>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-2">Nome Completo</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-lg text-zinc-900 dark:text-white shadow-inner"
                      placeholder="Seu nome"
                    />
                  </div>

                  <button 
                    onClick={() => { onUpdate(name); onClose(); }}
                    className="w-full py-5 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 text-lg uppercase tracking-tight flex items-center justify-center gap-3 active:scale-95"
                  >
                    Salvar Alterações
                  </button>
                </div>
              ) : (
                <div className="space-y-6">

                  {/* Font Size */}
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm text-zinc-400">
                        <Type className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-zinc-900 dark:text-white leading-tight">Tamanho da Letra</p>
                        <p className="text-[10px] text-zinc-400">Para facilitar sua leitura</p>
                      </div>
                    </div>
                    <div className="px-2">
                       <input 
                        type="range" min="16" max="42" 
                        value={settings.fontSize}
                        onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                        className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="flex justify-between mt-2 px-1">
                        <span className="text-[9px] font-black text-zinc-400">A</span>
                        <span className="text-[14px] font-black text-zinc-400">A</span>
                      </div>
                    </div>
                  </div>

                  {/* Sound Toggle */}
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm text-zinc-400">
                            <Volume2 className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-zinc-900 dark:text-white leading-tight">Sons de Digitação</p>
                            <p className="text-[10px] text-zinc-400">Ouvir o clique das teclas</p>
                          </div>
                        </div>
                        <button 
                        onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                        className={`w-12 h-6 rounded-full transition-all relative ${settings.soundEnabled ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md ${settings.soundEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                      {settings.soundEnabled && (
                        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-700">
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${settings.soundOnErrorOnly ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-300 dark:border-zinc-600 group-hover:border-emerald-400'}`}>
                              {settings.soundOnErrorOnly && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <input 
                              type="checkbox" className="hidden" 
                              checked={settings.soundOnErrorOnly}
                              onChange={(e) => updateSettings({ soundOnErrorOnly: e.target.checked })}
                            />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tocar som apenas ao errar</span>
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm text-zinc-400">
                          <Keyboard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-zinc-900 dark:text-white leading-tight">Teclado Numérico</p>
                          <p className="text-[10px] text-zinc-400">Mostrar teclado lateral</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => updateSettings({ showNumeric: !settings.showNumeric })}
                        className={`w-12 h-6 rounded-full transition-all relative ${settings.showNumeric ? 'bg-blue-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md ${settings.showNumeric ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm text-zinc-400">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-zinc-900 dark:text-white leading-tight">Mostrar Tempo de Prova</p>
                          <p className="text-[10px] text-zinc-400">Exibir cronômetro durante a lição</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => updateSettings({ showTimer: !settings.showTimer })}
                        className={`w-12 h-6 rounded-full transition-all relative ${settings.showTimer ? 'bg-blue-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md ${settings.showTimer ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm text-zinc-400">
                          <Monitor className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-zinc-900 dark:text-white leading-tight">Dicas e Instruções</p>
                          <p className="text-[10px] text-zinc-400">Mostrar janela antes da lição</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => updateSettings({ showInstructions: !settings.showInstructions })}
                        className={`w-12 h-6 rounded-full transition-all relative ${settings.showInstructions ? 'bg-blue-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md ${settings.showInstructions ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AppContent: React.FC = () => {
  const [view, setView] = useState<'login' | 'dashboard' | 'admin' | 'typing' | 'home'>('login');

  const [user, setUser] = useState<Profile | null>(null);
  
  // Dynamic State for Content, Users and Plans
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [homeVideos, setHomeVideos] = useState<HomeVideo[]>([]);
  const [homeConfig, setHomeConfig] = useState<HomeConfig>({
    id: 1,
    layout_scheme: 'classic',
    show_stats: true,
    show_videos: true,
    show_tips: true,
    show_modules: true,
    show_upgrade: true
  });
  
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorNotification, setErrorNotification] = useState<{ message: string; submessage?: string } | null>(null);

  // Helper function to fetch plans with their linked modules
  const fetchPlans = async () => {
    try {
      const { data: plansData, error: plansError } = await supabase.from('plans').select('*').order('created_at');
      if (plansError) throw plansError;

      const { data: joinData, error: joinError } = await supabase.from('plan_modules').select('plan_id, module_id');
      if (joinError) throw joinError;

      const fullPlans: Plan[] = (plansData || []).map(p => ({
        ...p,
        accessible_modules: (joinData || [])
          .filter(j => j.plan_id === p.id)
          .map(j => j.module_id)
      }));

      setPlans(fullPlans);
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [modulesRes, lessonsRes, announcementsRes, coursesRes, tipsRes, homeVideosRes, homeConfigRes] = await Promise.all([
          supabase.from('modules').select('*').order('order'),
          supabase.from('lessons').select('*').order('order'),
          supabase.from('announcements').select('*').order('created_at', { ascending: false }),
          supabase.from('courses').select('*').order('order'),
          supabase.from('tips').select('*').order('created_at', { ascending: false }),
          supabase.from('home_videos').select('*').order('created_at', { ascending: false }),
          supabase.from('home_config').select('*').maybeSingle()
        ]);

        if (modulesRes.data) setModules(modulesRes.data);
        if (lessonsRes.data) setLessons(lessonsRes.data);
        if (announcementsRes.data) setAnnouncements(announcementsRes.data);
        if (coursesRes.data) setCourses(coursesRes.data);
        if (tipsRes.data) setTips(tipsRes.data as Tip[]);
        if (homeVideosRes.data) setHomeVideos(homeVideosRes.data as HomeVideo[]);
        if (homeConfigRes.data) setHomeConfig(homeConfigRes.data as HomeConfig);
        
        await fetchPlans();
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch users if admin
  useEffect(() => {
    if (user?.role === 'admin') {
      supabase.from('profiles').select('*').then(({ data }) => {
        if (data) setUsers(data);
      });
    }
    
    if (user?.id) {
      supabase.from('progress').select('*').eq('user_id', user.id).then(({ data }) => {
        if (data) setProgress(data);
      });
    }
  }, [user]);

  const handleUpdateProfile = async (newName: string) => {
    if (user) {
      const { error } = await supabase.from('profiles').update({ full_name: newName }).eq('id', user.id);
      if (!error) setUser({ ...user, full_name: newName });
    }
  };

  const handleLogin = async (role: 'admin' | 'student', profile?: Profile) => {
    if (profile) {
      setUser(profile);
    } else {
      const mockId = role === 'admin' ? '00000000-0000-0000-0000-000000000000' : '00000000-0000-0000-0000-000000000001';
      const { data } = await supabase.from('profiles').select('*').eq('id', mockId).maybeSingle();
      setUser(data || { id: mockId, full_name: 'Usuário', role, active: true, created_at: new Date().toISOString() });
    }
    
    if (role === 'admin') {
      setView('admin');
    } else {
      setView('home');
    }
  };


  const handleStartLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setView('typing');
  };

  const handleCompleteLesson = async (stats: any, navigateTo: 'next' | 'dashboard' | 'none' = 'dashboard') => {
    if (currentLesson && user) {
      const newProgress = { 
        user_id: user.id, 
        lesson_id: currentLesson.id, 
        wpm: stats.wpm, 
        accuracy: stats.accuracy,
        duration_seconds: stats.duration_seconds,
        completed_at: new Date().toISOString()
      };
      
      const { error } = await supabase.from('progress').upsert([newProgress], { onConflict: 'user_id,lesson_id' });
      if (error) {
        console.error('Erro ao salvar progresso:', error);
        setErrorNotification({ 
          message: 'Erro ao Salvar Progresso', 
          submessage: 'Não foi possível salvar seus dados no banco de dados. Verifique sua conexão com a internet.' 
        });
      } else {
        setProgress(prev => {
          const filtered = prev.filter(p => p.lesson_id !== currentLesson.id);
          return [...filtered, newProgress];
        });
      }
    }
    
    if (navigateTo === 'none') return;

    if (navigateTo === 'next' && currentLesson) {
      const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
      const nextLesson = lessons[currentIndex + 1];
      if (nextLesson) {
        setCurrentLesson(nextLesson);
        setView('typing');
        return;
      }
    }
    
    setView('dashboard');
    setCurrentLesson(null);
  };

  const handleCancelLesson = async () => {
    if (currentLesson && user) {
      const { error } = await supabase.from('progress').delete().eq('user_id', user.id).eq('lesson_id', currentLesson.id);
      if (error) {
        console.error('Erro ao remover progresso:', error);
      } else {
        setProgress(prev => prev.filter(p => p.lesson_id !== currentLesson.id));
      }
    }
    
    setView('dashboard');
    setCurrentLesson(null);
  };

  // CRUD Handlers for Admin
  const adminHandlers = {
    // Users
    saveUser: async (userData: Profile, password?: string) => {
      // Ensure specific fields are mapped correctly for DB if needed
      const dbUser = { ...userData };
      delete (dbUser as any).accessible_modules; // Not a column in profiles

      const { error: profileError } = await supabase.from('profiles').upsert(dbUser);
      
      if (profileError) {
        console.error('Erro ao atualizar perfil:', profileError);
        return;
      }

      const { data } = await supabase.from('profiles').select('*');
      if (data) setUsers(data);
    },
    deleteUser: async (id: string) => {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (!error) setUsers(prev => prev.filter(u => u.id !== id));
    },

    // Modules
    saveModule: async (moduleData: Module) => {
      const payload = { ...moduleData };
      if (!payload.id) delete (payload as any).id;

      const { error } = await supabase.from('modules').upsert(payload);
      if (!error) {
        const { data } = await supabase.from('modules').select('*').order('order');
        if (data) setModules(data);
      }
    },
    deleteModule: async (id: string) => {
      const { error } = await supabase.from('modules').delete().eq('id', id);
      if (!error) {
        setModules(prev => prev.filter(m => m.id !== id));
        setLessons(prev => prev.filter(l => l.module_id !== id));
      }
    },

    // Lessons
    saveLesson: async (lessonData: Lesson) => {
      const payload = { ...lessonData };
      if (!payload.id) delete (payload as any).id;

      const { error } = await supabase.from('lessons').upsert(payload);
      if (!error) {
        const { data } = await supabase.from('lessons').select('*').order('order');
        if (data) setLessons(data);
      }
    },
    deleteLesson: async (id: string) => {
      const { error } = await supabase.from('lessons').delete().eq('id', id);
      if (!error) setLessons(prev => prev.filter(l => l.id !== id));
    },

    // Plans
    savePlan: async (planData: Plan) => {
      try {
        const payload = { ...planData };
        const moduleIds = payload.accessible_modules || [];
        delete (payload as any).accessible_modules;
        
        if (!payload.id) delete (payload as any).id;

        const { data: savedPlan, error: planError } = await supabase
          .from('plans')
          .upsert(payload)
          .select()
          .single();

        if (planError) throw planError;

        // Update module links
        await supabase.from('plan_modules').delete().eq('plan_id', savedPlan.id);
        
        if (moduleIds.length > 0) {
          const links = moduleIds.map(mId => ({ plan_id: savedPlan.id, module_id: mId }));
          await supabase.from('plan_modules').insert(links);
        }

        await fetchPlans();
      } catch (err) {
        console.error('Error saving plan:', err);
      }
    },
    deletePlan: async (id: string) => {
      const { error } = await supabase.from('plans').delete().eq('id', id);
      if (!error) {
        setPlans(prev => prev.filter(p => p.id !== id));
      }
    },

    // Announcements
    saveAnnouncement: async (announcementData: any) => {
      const payload = { ...announcementData };
      if (!payload.id) delete payload.id;

      const { error } = await supabase.from('announcements').upsert(payload);
      if (!error) {
        const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
        if (data) setAnnouncements(data);
      }
    },
    deleteAnnouncement: async (id: string) => {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (!error) setAnnouncements(prev => prev.filter(a => a.id !== id));
    },
    incrementAnnouncementClick: async (id: string) => {
      const { data: current } = await supabase.from('announcements').select('clicks').eq('id', id).single();
      const newClicks = (current?.clicks || 0) + 1;
      const { error } = await supabase.from('announcements').update({ clicks: newClicks }).eq('id', id);
      if (!error) {
        setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, clicks: newClicks } : a));
      }
    },

    // Courses
    saveCourse: async (courseData: Course) => {
      const payload = { ...courseData };
      if (!payload.id) delete (payload as any).id;

      const { error } = await supabase.from('courses').upsert(payload);
      if (!error) {
        const { data } = await supabase.from('courses').select('*').order('order');
        if (data) setCourses(data);
      }
    },
    deleteCourse: async (id: string) => {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (!error) setCourses(prev => prev.filter(c => c.id !== id));
    },
    incrementCourseClick: async (id: string) => {
      const { data: current } = await supabase.from('courses').select('clicks').eq('id', id).single();
      const newClicks = (current?.clicks || 0) + 1;
      const { error } = await supabase.from('courses').update({ clicks: newClicks }).eq('id', id);
      if (!error) {
        setCourses(prev => prev.map(c => c.id === id ? { ...c, clicks: newClicks } : c));
      }
    },

    // Tips
    saveTip: async (tipData: Tip) => {
      const payload = { ...tipData };
      if (!payload.id) delete (payload as any).id;

      const { error } = await supabase.from('tips').upsert(payload);
      if (!error) {
        const { data } = await supabase.from('tips').select('*').order('created_at', { ascending: false });
        if (data) setTips(data as Tip[]);
      }
    },
    deleteTip: async (id: string) => {
      const { error } = await supabase.from('tips').delete().eq('id', id);
      if (!error) setTips(prev => prev.filter(t => t.id !== id));
    },

    // Home Configuration
    saveHomeVideo: async (videoData: HomeVideo) => {
      const payload = { ...videoData };
      if (!payload.id) delete (payload as any).id;

      const { error } = await supabase.from('home_videos').upsert(payload);
      if (error) {
        console.error('Error saving video:', error);
        return;
      }

      const { data } = await supabase.from('home_videos').select('*').order('created_at', { ascending: false });
      if (data) setHomeVideos(data as HomeVideo[]);
    },
    deleteHomeVideo: async (id: string) => {
      const { error } = await supabase.from('home_videos').delete().eq('id', id);
      if (error) {
        console.error('Error deleting video:', error);
        return;
      }
      setHomeVideos(prev => prev.filter(v => v.id !== id));
    },
    updateHomeConfig: async (config: Partial<HomeConfig>) => {
      try {
        // Fetch existing configurations to find the first one or determine if a new one is needed
        const { data: existingConfigs, error: fetchError } = await supabase
          .from('home_config')
          .select('*')
          .order('id', { ascending: true }); // Order by ID to get the "first" one if multiple exist

        if (fetchError) {
          console.error('Error fetching existing home config:', fetchError);
          setErrorNotification({
            message: 'Erro ao buscar configuração',
            submessage: 'Não foi possível carregar a configuração da página inicial.'
          });
          return;
        }

        let payload: HomeConfig;
        if (existingConfigs && existingConfigs.length > 0) {
          // Update the first existing configuration
          const current = existingConfigs[0];
          payload = {
            ...current,
            ...config,
            id: current.id // Ensure the ID is preserved for upsert
          };
        } else {
          // Create a new configuration if none exist
          payload = {
            id: 1, // Default ID for a new entry, assuming it's a singleton table
            layout_scheme: 'classic', // Default values
            show_stats: true,
            show_videos: true,
            show_tips: true,
            show_modules: true,
            show_upgrade: true,
            ...config
          };
        }

        console.log('Syncing Home Config:', payload);
        const { error: upsertError } = await supabase.from('home_config').upsert(payload, { onConflict: 'id' });

        if (upsertError) {
          console.error('Error updating config in Supabase:', upsertError);
          setErrorNotification({
            message: 'Erro ao salvar configuração',
            submessage: 'Não foi possível salvar as alterações na configuração da página inicial.'
          });
          return;
        }

        setHomeConfig(payload as HomeConfig);
      } catch (err: any) {
        console.error('Crash in updateHomeConfig:', err);
        setErrorNotification({
          message: 'Erro inesperado',
          submessage: 'Ocorreu um erro ao tentar atualizar a configuração da página inicial.'
        });
      }
    }
  };

  if (loading && view !== 'login') {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-zinc-500 font-black animate-pulse uppercase tracking-[0.2em] text-[10px]">Carregando ambiente...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {view === 'login' && <Login onLogin={handleLogin} />}
      
      {view === 'dashboard' && user && (
        <Dashboard 
          user={user}
          modules={modules}
          lessons={lessons}
          plans={plans}
          courses={courses}
          progress={progress}
          onStartLesson={handleStartLesson}
          onLogout={() => setView('login')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          announcement={announcements.find(a => a.active && a.target_plans?.includes(user!.plan_id || ''))}
          onAnnouncementClick={adminHandlers.incrementAnnouncementClick}
          onCourseClick={adminHandlers.incrementCourseClick}
          onOpenCourses={() => setIsCoursesOpen(true)}
          onGoToHome={() => setView('home')}
        />
      )}

      {view === 'home' && user && (
        <Home 
          user={user}
          modules={modules}
          lessons={lessons}
          plans={plans}
          progress={progress}
          tips={tips}
          onLogout={() => setView('login')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenCourses={() => setIsCoursesOpen(true)}
          onGoToLessons={() => setView('dashboard')}
          announcement={announcements.find(a => a.active && a.target_plans?.includes(user!.plan_id || ''))}
          onAnnouncementClick={adminHandlers.incrementAnnouncementClick}
          homeVideos={homeVideos}
          homeConfig={homeConfig}
          courses={courses}
        />
      )}


      {view === 'admin' && user && (
        <AdminPanel 
          user={user}
          users={users}
          modules={modules}
          lessons={lessons}
          plans={plans}
          announcements={announcements}
          courses={courses}
          tips={tips}
          homeVideos={homeVideos}
          homeConfig={homeConfig}
          onLogout={() => setView('login')}
          handlers={adminHandlers as any}
        />
      )}

      {view === 'typing' && currentLesson && (
        <TypingView 
          lesson={currentLesson}
          lessons={lessons}
          onComplete={handleCompleteLesson}
          onBack={handleCancelLesson}
          onOpenCourses={() => setIsCoursesOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          hasNextLesson={lessons.findIndex(l => l.id === currentLesson.id) < lessons.length - 1}
          progress={progress}
          onExit={() => { setView('dashboard'); setCurrentLesson(null); }}
        />
      )}

      {user && (
        <ProfileModal 
          isOpen={isProfileOpen || isSettingsOpen} 
          onClose={() => { setIsProfileOpen(false); setIsSettingsOpen(false); }} 
          user={user} 
          onUpdate={handleUpdateProfile}
          initialTab={isSettingsOpen ? 'settings' : 'profile'}
        />
      )}

      {/* Global Courses Modal */}
      <AnimatePresence>
        {isCoursesOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden border border-white/10 flex flex-col"
            >
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50 shrink-0">
                <div>
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                    <Video className="w-6 h-6 text-blue-500" /> Nossos Cursos
                  </h2>
                  <p className="text-zinc-500 text-sm font-bold mt-1">Avance seus conhecimentos com nossos cursos especializados com certificado.</p>
                </div>
                <button onClick={() => setIsCoursesOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                {courses.filter(c => c.active && c.target_plans?.includes(user?.plan_id || '')).length === 0 ? (
                  <div className="text-center py-12">
                     <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Nenhum curso disponível para o seu plano no momento.</p>
                  </div>
                ) : (
                  courses.filter(c => c.active && c.target_plans?.includes(user?.plan_id || '')).sort((a,b) => (a.order||0)-(b.order||0)).map((course) => (
                    <div key={course.id} className="group flex flex-col md:flex-row bg-white dark:bg-zinc-800/50 border-2 border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden transition-all hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5">
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight uppercase tracking-tight">{course.title}</h3>
                          {course.promotional_price && (
                            <span className="shrink-0 px-3 py-1 bg-rose-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest animate-pulse">
                              Oferta Especial
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-6 leading-relaxed">
                          {course.description}
                        </p>
                        
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                          <div>
                            {course.promotional_price ? (
                              <div className="flex flex-col">
                                <span className="text-xs text-emerald-500 font-black uppercase tracking-widest mb-1">
                                  Valor Promocional
                                </span>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-sm text-zinc-400 font-bold line-through">
                                    de R$ {course.price.toFixed(2).replace('.', ',')}
                                  </span>
                                  <span className="text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                    por R$ {course.promotional_price.toFixed(2).replace('.', ',')}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">
                                  Investimento
                                </span>
                                <span className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">
                                  R$ {course.price.toFixed(2).replace('.', ',')}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <a 
                            href={course.payment_url} 
                            target="_blank" 
                            rel="noreferrer"
                            onClick={() => adminHandlers.incrementCourseClick(course.id)}
                            className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 uppercase tracking-widest text-xs"
                          >
                            Veja a Oferta no Site <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Error Notification Modal */}
      <AnimatePresence>
        {errorNotification && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden border border-rose-100 dark:border-rose-900/30"
            >
              <div className="p-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mb-6 shadow-lg shadow-rose-500/10">
                  <Activity className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">
                  {errorNotification.message}
                </h3>
                <p className="text-sm font-bold text-zinc-400 mb-8 leading-relaxed lowercase">
                  {errorNotification.submessage}
                </p>
                <button 
                  onClick={() => setErrorNotification(null)}
                  className="w-full py-5 bg-zinc-900 dark:bg-zinc-800 text-white font-black rounded-2xl hover:opacity-90 transition-all uppercase tracking-[0.2em] text-xs"
                >
                  Entendi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
