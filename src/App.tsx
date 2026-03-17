import React, { useState, useEffect } from 'react';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { Login } from './views/Login';
import { Dashboard } from './views/Dashboard';
import { AdminPanel } from './views/AdminPanel';
import { TypingView } from './views/TypingView';
import { Module, Lesson, Profile, Plan } from './types';
import { X, Volume2, Type, Keyboard, Monitor, User, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';

const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-white/10"
          >
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-2xl font-black text-zinc-800 dark:text-white">Configurações</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                <X className="w-6 h-6 text-zinc-400" />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Theme */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-zinc-500"><Monitor className="w-5 h-5" /></div>
                  <div>
                    <span className="block font-bold text-zinc-800 dark:text-white">Tema</span>
                    <span className="text-xs text-zinc-400">Escolha o visual do app</span>
                  </div>
                </div>
                <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                  <button 
                    onClick={() => updateSettings({ theme: 'light' })}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${settings.theme === 'light' ? 'bg-white text-blue-500 shadow-sm' : 'text-zinc-500'}`}
                  >
                    Claro
                  </button>
                  <button 
                    onClick={() => updateSettings({ theme: 'dark' })}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${settings.theme === 'dark' ? 'bg-zinc-700 text-blue-400 shadow-sm' : 'text-zinc-500'}`}
                  >
                    Escuro
                  </button>
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-zinc-500"><Type className="w-5 h-5" /></div>
                  <div>
                    <span className="block font-bold text-zinc-800 dark:text-white">Tamanho da Fonte</span>
                    <span className="text-xs text-zinc-400">Ajuste para melhor leitura</span>
                  </div>
                </div>
                <input 
                  type="range" min="16" max="48" step="4"
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                  className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Sound */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-zinc-500"><Volume2 className="w-5 h-5" /></div>
                    <div>
                      <span className="block font-bold text-zinc-800 dark:text-white">Sons</span>
                      <span className="text-xs text-zinc-400">Feedback sonoro ao digitar</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.soundEnabled ? 'bg-blue-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.soundEnabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
                {settings.soundEnabled && (
                  <div className="flex items-center gap-2 ml-14">
                    <input 
                      type="checkbox" 
                      checked={settings.soundOnErrorOnly}
                      onChange={(e) => updateSettings({ soundOnErrorOnly: e.target.checked })}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span className="text-xs text-zinc-500">Tocar som apenas ao errar</span>
                  </div>
                )}
              </div>

              {/* Keyboard */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-zinc-500"><Keyboard className="w-5 h-5" /></div>
                  <div>
                    <span className="block font-bold text-zinc-800 dark:text-white">Teclado Numérico</span>
                    <span className="text-xs text-zinc-400">Mostrar teclado lateral</span>
                  </div>
                </div>
                <button 
                  onClick={() => updateSettings({ showNumeric: !settings.showNumeric })}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings.showNumeric ? 'bg-blue-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.showNumeric ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProfileModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  user: Profile; 
  onUpdate: (newName: string) => void 
}> = ({ isOpen, onClose, user, onUpdate }) => {
  const [name, setName] = useState(user.full_name);

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
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Meu Perfil</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                <X className="w-6 h-6 text-zinc-400" />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="flex flex-col items-center gap-4 mb-2">
                <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center border-4 border-blue-500 shadow-xl shadow-blue-500/10">
                  <User className="w-12 h-12 text-zinc-400" />
                </div>
                <span className="text-xs font-black text-blue-500 uppercase tracking-widest mt-2">{user.role === 'admin' ? 'Administrador' : 'Aluno'}</span>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-2">Nome Completo</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-lg text-zinc-900 dark:text-white"
                  placeholder="Seu nome"
                />
              </div>

              <div className="pt-4 space-y-4">
                <button 
                  onClick={() => { onUpdate(name); onClose(); }}
                  className="w-full py-5 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 text-lg"
                >
                  Salvar Alterações
                </button>
                <button 
                  onClick={onClose}
                  className="w-full py-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 font-bold transition-all text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AppContent: React.FC = () => {
  const [view, setView] = useState<'login' | 'dashboard' | 'admin' | 'typing'>('login');
  const [user, setUser] = useState<Profile | null>(null);
  
  // Dynamic State for Content, Users and Plans
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
        const [modulesRes, lessonsRes, announcementsRes] = await Promise.all([
          supabase.from('modules').select('*').order('order'),
          supabase.from('lessons').select('*').order('order'),
          supabase.from('announcements').select('*').order('created_at', { ascending: false })
        ]);

        if (modulesRes.data) setModules(modulesRes.data);
        if (lessonsRes.data) setLessons(lessonsRes.data);
        if (announcementsRes.data) setAnnouncements(announcementsRes.data);
        
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
    
    setView(role === 'admin' ? 'admin' : 'dashboard');
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
        accuracy: stats.accuracy 
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
          progress={progress}
          onStartLesson={handleStartLesson}
          onLogout={() => setView('login')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          announcement={announcements.find(a => a.active && a.target_plans?.includes(user!.plan_id || ''))}
          onAnnouncementClick={adminHandlers.incrementAnnouncementClick}
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
          hasNextLesson={lessons.findIndex(l => l.id === currentLesson.id) < lessons.length - 1}
        />
      )}

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      {user && (
        <ProfileModal 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          user={user} 
          onUpdate={handleUpdateProfile} 
        />
      )}

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
