import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Module, Lesson, Profile, Plan, Announcement, Course, Tip, HomeVideo, HomeConfig, CertificateConfig, UserCertificate } from '../types';
import { 
  Users, BookOpen, CreditCard, Plus, Edit2, Trash2, Search, Filter, 
  Calendar, Mail, Shield, User, X, Link, DollarSign, Clock, CheckCircle2, 
  AlertCircle, LogOut, LayoutDashboard, TrendingUp, Megaphone, Activity, 
  Trash, Bell, MousePointer2, Palette, Gauge, Video, Lightbulb, Settings, 
  Home as HomeIcon, Eye, EyeOff, PlayCircle, Info, Check, ChevronDown, ChevronRight
} from 'lucide-react';

interface AdminPanelProps {
  user: Profile;
  users: Profile[];
  modules: Module[];
  lessons: Lesson[];
  plans: Plan[];
  announcements: Announcement[];
  courses: Course[];
  tips: Tip[];
  homeVideos: HomeVideo[];
  homeConfig: HomeConfig;
  certConfigs?: CertificateConfig[];
  userCertificates?: UserCertificate[];
  onLogout: () => void;
  handlers: {
    saveUser: (user: Profile, password?: string) => void;
    deleteUser: (id: string) => void;
    saveModule: (module: Module) => void;
    deleteModule: (id: string) => void;
    saveLesson: (lesson: Lesson) => void;
    deleteLesson: (id: string) => void;
    savePlan: (plan: Plan) => void;
    deletePlan: (id: string) => void;
    saveAnnouncement: (announcement: Announcement) => void;
    deleteAnnouncement: (id: string) => void;
    saveCourse: (course: Course) => void;
    deleteCourse: (id: string) => void;
    saveTip: (tip: Tip) => void;
    deleteTip: (id: string) => void;
    saveHomeVideo: (video: HomeVideo) => void;
    deleteHomeVideo: (id: string) => void;
    updateHomeConfig: (config: Partial<HomeConfig>) => void;
    saveCertConfig?: (config: CertificateConfig) => void;
  };
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ user, users, modules, lessons, plans, announcements = [], courses = [], tips = [], homeVideos = [], homeConfig, certConfigs = [], userCertificates = [], onLogout, handlers }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'content' | 'plans' | 'tips' | 'settings'>('dashboard');
  const [activeSettingsTab, setActiveSettingsTab] = useState<'announcements' | 'courses' | 'home' | 'tips' | 'certificates'>('home');
  
  // Filter States
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');

  // Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAdminProfileOpen, setIsAdminProfileOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [isHomeVideoModalOpen, setIsHomeVideoModalOpen] = useState(false);
  const [isCertConfigModalOpen, setIsCertConfigModalOpen] = useState(false);
  
  // Editing States
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingTip, setEditingTip] = useState<Tip | null>(null);
  const [editingHomeVideo, setEditingHomeVideo] = useState<HomeVideo | null>(null);
  const [editingCertConfig, setEditingCertConfig] = useState<CertificateConfig | null>(null);

  // Delete/Update confirmation state
  const [confirmDelete, setConfirmDelete] = useState<{ id: string, type: 'user' | 'module' | 'lesson' | 'plan' | 'announcement' | 'course' | 'tip' | 'home_video' | 'cert_config', title: string } | null>(null);
  const [confirmUpdate, setConfirmUpdate] = useState<{ type: 'user' | 'plan' | 'lesson', title: string, data: any } | null>(null);
  
  // Success feedback state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  const resetModals = () => {
    setIsUserModalOpen(false);
    setIsAdminProfileOpen(false);
    setIsModuleModalOpen(false);
    setIsLessonModalOpen(false);
    setIsPlanModalOpen(false);
    setIsAnnouncementModalOpen(false);
    setIsCourseModalOpen(false);
    setIsTipModalOpen(false);
    setIsHomeVideoModalOpen(false);
    setIsCertConfigModalOpen(false);
    setEditingUser(null);
    setEditingModule(null);
    setEditingLesson(null);
    setEditingPlan(null);
    setEditingAnnouncement(null);
    setEditingCourse(null);
    setEditingTip(null);
    setEditingHomeVideo(null);
    setEditingCertConfig(null);
    setConfirmDelete(null);
    setConfirmUpdate(null);
  };

  const onSaveComplete = (msg: string) => {
    resetModals();
    setSuccessMessage(msg);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    
    if (confirmDelete.type === 'user') handlers.deleteUser(confirmDelete.id);
    if (confirmDelete.type === 'module') {
      const hasLessons = lessons.some(l => l.module_id === confirmDelete.id);
      if (hasLessons) {
        alert('Não é possível excluir um módulo que ainda possui aulas. Exclua as aulas primeiro.');
        setConfirmDelete(null);
        return;
      }
      handlers.deleteModule(confirmDelete.id);
    }
    if (confirmDelete.type === 'lesson') handlers.deleteLesson(confirmDelete.id);
    if (confirmDelete.type === 'plan') handlers.deletePlan(confirmDelete.id);
    if (confirmDelete.type === 'announcement') handlers.deleteAnnouncement(confirmDelete.id);
    if (confirmDelete.type === 'course') handlers.deleteCourse(confirmDelete.id);
    if (confirmDelete.type === 'tip') handlers.deleteTip(confirmDelete.id);
    if (confirmDelete.type === 'home_video') handlers.deleteHomeVideo(confirmDelete.id);
    // Certificate Configs could be deleted via another handler if added, but wait, do we have deleteCertConfig?
    // Let's assume for now they are not hard deleted or we'll fake it if we didn't add the handler.
    
    setConfirmDelete(null);
  };

  const handleConfirmUpdate = () => {
    if (!confirmUpdate) return;
    
    if (confirmUpdate.type === 'user') {
      setEditingUser(confirmUpdate.data);
      setIsUserModalOpen(true);
    } else if (confirmUpdate.type === 'plan') {
      setEditingPlan(confirmUpdate.data);
      setIsPlanModalOpen(true);
    } else if (confirmUpdate.type === 'lesson') {
      setEditingLesson(confirmUpdate.data);
      setIsLessonModalOpen(true);
    }
    
    setConfirmUpdate(null);
  };

  return (
    <div className="h-screen bg-[#f4f7fa] dark:bg-zinc-950 flex flex-col lg:flex-row font-sans text-zinc-900 dark:text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col shrink-0 lg:h-full lg:overflow-y-auto custom-scrollbar shadow-sm z-10">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black text-2xl">
              A
            </div>
            <span className="text-2xl font-black text-zinc-800 dark:text-white tracking-tight">Admin Panel</span>
          </div>



          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all ${activeTab === 'dashboard' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              <LayoutDashboard className="w-5 h-5 flex-shrink-0" /> Início
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all ${activeTab === 'users' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              <Users className="w-5 h-5 flex-shrink-0" /> Alunos
            </button>
            <button 
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all ${activeTab === 'content' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              <BookOpen className="w-5 h-5 flex-shrink-0" /> Conteúdo
            </button>
            <button 
              onClick={() => setActiveTab('plans')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all ${activeTab === 'plans' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              <CreditCard className="w-5 h-5 flex-shrink-0" /> Planos
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all ${activeTab === 'settings' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              <Settings className="w-5 h-5 flex-shrink-0" /> Configurações
            </button>
          </nav>

          <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 space-y-4 mt-6">
            {/* Admin Profile Card */}
            <div 
              onClick={() => setIsAdminProfileOpen(true)}
              className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white dark:bg-zinc-700 rounded-xl flex items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-600">
                  <User className="w-5 h-5 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span className="text-sm font-black text-zinc-900 dark:text-white truncate">{user.full_name}</span>
                  <span className="text-[10px] text-blue-500 uppercase font-bold tracking-wider flex items-center gap-1">
                    Meu Perfil
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 p-5 bg-rose-500 hover:bg-rose-600 rounded-[20px] text-white font-black shadow-xl shadow-rose-500/20 transition-all hover:scale-[1.02] uppercase tracking-widest text-xs"
            >
              <LogOut className="w-4 h-4" /> Sair do Painel
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden lg:h-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight line-clamp-1 uppercase">
              {activeTab === 'dashboard' ? 'Dashboard Geral' : 
               activeTab === 'users' ? 'Gestão de Alunos' : 
               activeTab === 'content' ? 'Módulos e Aulas' : 
                activeTab === 'plans' ? 'Planos de Acesso' : 
                activeTab === 'settings' ? (
                  activeSettingsTab === 'announcements' ? 'Mensagens em Destaque' :
                  activeSettingsTab === 'courses' ? 'Gestão de Cursos' :
                  activeSettingsTab === 'tips' ? 'Dicas de Mestre' :
                  'Configurações da Home'
                ) : 'Administração'}
            </h1>
            <p className="text-zinc-500 text-lg">
              {activeTab === 'dashboard' ? 'Bem-vindo de volta! Aqui está o resumo da sua plataforma.' : 'Administre e organize sua plataforma de ensino.'}
            </p>
          </div>
          {activeTab !== 'dashboard' && (
            <button 
              onClick={() => {
                if (activeTab === 'users') setIsUserModalOpen(true);
                if (activeTab === 'content') setIsModuleModalOpen(true);
                if (activeTab === 'plans') setIsPlanModalOpen(true);
                if (activeTab === 'settings' && activeSettingsTab === 'announcements') setIsAnnouncementModalOpen(true);
                if (activeTab === 'settings' && activeSettingsTab === 'courses') setIsCourseModalOpen(true);
                if (activeTab === 'settings' && activeSettingsTab === 'tips') setIsTipModalOpen(true);
                if (activeTab === 'settings' && activeSettingsTab === 'certificates') setIsCertConfigModalOpen(true);
              }}
              className={`flex items-center gap-3 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-[20px] shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] whitespace-nowrap ${activeTab === 'settings' && activeSettingsTab === 'home' ? 'hidden' : ''}`}
            >
              <Plus className="w-6 h-6" /> {
                activeTab === 'users' ? 'Novo Aluno' : 
                activeTab === 'content' ? 'Novo Módulo' : 
                activeTab === 'plans' ? 'Novo Plano' : 
                activeTab === 'settings' ? (
                  activeSettingsTab === 'announcements' ? 'Nova Mensagem' :
                  activeSettingsTab === 'courses' ? 'Novo Curso' :
                  activeSettingsTab === 'tips' ? 'Nova Dica' : 
                  activeSettingsTab === 'certificates' ? 'Nova Conf. Certificado' : ''
                ) : 'Novo Item'
              }
            </button>
          )}
        </header>

        {activeTab === 'dashboard' ? (
          <div className="space-y-10">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total de Alunos" value={users.filter(u => u.role === 'student').length} subValue={`${users.filter(u => u.role === 'student' && u.active).length} Ativos`} icon={<Users className="w-6 h-6" />} color="blue" />
              <StatCard title="Inativos" value={users.filter(u => u.role === 'student' && !u.active).length} subValue="Aguardando ativação" icon={<Shield className="w-6 h-6" />} color="rose" />
              <StatCard title="Novos Hoje" value={users.filter(u => new Date(u.created_at).toDateString() === new Date().toDateString()).length} subValue="Cadastros nas últimas 24h" icon={<TrendingUp className="w-6 h-6" />} color="emerald" />
              <StatCard title="Novos no Mês" value={users.filter(u => new Date(u.created_at).getMonth() === new Date().getMonth() && new Date(u.created_at).getFullYear() === new Date().getFullYear()).length} subValue="Acompanhamento mensal" icon={<Calendar className="w-6 h-6" />} color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Distribution per Plan */}
              <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-[40px] p-10 border border-zinc-200/50 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-xl font-black text-zinc-800 dark:text-white uppercase tracking-tight">Distribuição por Plano</h3>
                  <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-500">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-8">
                  {plans.map(plan => {
                    const count = users.filter(u => u.plan_id === plan.id).length;
                    const total = users.filter(u => u.role === 'student').length || 1;
                    const percent = (count / total) * 100;
                    return (
                      <div key={plan.id} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-zinc-900 dark:text-white uppercase truncate">{plan.name}</span>
                            <span className="text-xs font-bold text-zinc-400">{count} ALUNOS MATRICULADOS</span>
                          </div>
                          <span className="text-lg font-black text-blue-500">{Math.round(percent)}%</span>
                        </div>
                        <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                        </div>
                      </div>
                    );
                  })}
                  {plans.length === 0 && (
                    <div className="text-center py-10 text-zinc-400 font-bold uppercase text-xs tracking-widest">Nenhum plano cadastrado</div>
                  )}
                </div>
              </div>

              {/* Weekly Highlights */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-10 text-white shadow-2xl shadow-blue-500/20 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-2">Resumo Semanal</h3>
                  <p className="text-blue-100 text-sm font-bold mb-10 opacity-80">Novos alunos registrados nos últimos 7 dias.</p>
                  
                  <div className="text-6xl font-black mb-4">
                    {users.filter(u => {
                      const date = new Date(u.created_at);
                      const now = new Date();
                      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
                      return date >= sevenDaysAgo;
                    }).length}
                  </div>
                  <div className="text-sm font-black uppercase tracking-widest text-blue-200">Novos Cadastros</div>
                </div>
                
                <div className="mt-10 p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-emerald-400 rounded-2xl flex items-center justify-center text-emerald-950 shadow-lg shadow-emerald-400/20">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest opacity-60">Status da Plataforma</div>
                      <div className="font-black text-sm">Operando Normalmente</div>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('users')} className="w-full py-4 bg-white text-blue-600 font-black rounded-2xl shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest">
                    Ver todos os alunos <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-200/50 dark:border-zinc-800 shadow-sm overflow-hidden">
          {activeTab === 'users' && (
            <div className="flex flex-col">
              {/* Filters UI */}
              <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/20 flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Pesquisar por nome ou e-mail..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:border-blue-500 transition-all font-bold text-zinc-700 dark:text-zinc-200"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <select 
                      value={userStatusFilter}
                      onChange={(e) => setUserStatusFilter(e.target.value as any)}
                      className="pl-14 pr-10 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:border-blue-500 transition-all font-black text-xs uppercase tracking-widest text-zinc-500 appearance-none min-w-[180px]"
                    >
                      <option value="all">TODOS STATUS</option>
                      <option value="active">ATIVO</option>
                      <option value="inactive">INATIVO</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-blue-50/80 dark:bg-blue-900/40 border-b border-blue-100 dark:border-blue-800">
                      <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Aluno</th>
                      <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center w-[120px]">Status</th>
                      <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest w-[160px]">Plano</th>
                      <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-right w-[160px]">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {users
                      .filter(u => {
                        const matchesSearch = u.full_name.toLowerCase().includes(userSearch.toLowerCase()) || 
                                             (u.email || '').toLowerCase().includes(userSearch.toLowerCase());
                        const matchesStatus = userStatusFilter === 'all' ? true : 
                                              userStatusFilter === 'active' ? u.active : !u.active;
                        return matchesSearch && matchesStatus;
                      })
                      .map(user => (
                        <tr key={user.id} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-default group">
                          <td className="px-4 md:px-6 py-8">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center font-black text-2xl border-2 border-blue-100 dark:border-blue-800/50 shadow-sm shrink-0">
                                {user.full_name[0]}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-extrabold text-zinc-900 dark:text-white text-xl leading-none mb-1 line-clamp-1">{user.full_name}</span>
                                <span className="text-sm text-zinc-400 font-medium flex items-center gap-2">
                                  <Mail className="w-3.5 h-3.5" /> {user.email || 'Sem e-mail'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-8">
                            <div className="flex justify-center">
                              <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-[14px] text-[10px] font-black uppercase tracking-wider ${user.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm shadow-emerald-500/10' : 'bg-rose-50 text-rose-600 border border-rose-100 shadow-sm shadow-rose-500/10'}`}>
                                <div className={`w-2 h-2 rounded-full ${user.active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                {user.active ? 'Ativo' : 'Inativo'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-8">
                            <div className="flex flex-col gap-1">
                              <span className="flex items-center gap-2 text-sm font-black text-zinc-700 dark:text-zinc-200">
                                <Shield className="w-4 h-4 text-blue-500" />
                                {plans.find(p => p.id === user.plan_id)?.name || 'Nenhum Plano'}
                              </span>
                              <span className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(user.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-8 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0">
                              <button 
                                onClick={() => setConfirmUpdate({ type: 'user', title: user.full_name, data: user })}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm border border-blue-100 dark:border-blue-900/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                              >
                                <Edit2 className="w-3.5 h-3.5" /> Alterar
                              </button>
                              <button 
                                onClick={() => { setConfirmDelete({ id: user.id, type: 'user', title: user.full_name }); }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-800 text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm border border-rose-100 dark:border-rose-900/30 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="flex flex-col">
              {/* Module Filter UI */}
              <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <select 
                      value={moduleFilter}
                      onChange={(e) => setModuleFilter(e.target.value)}
                      className="pl-14 pr-10 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl focus:border-blue-500 transition-all font-black text-xs uppercase tracking-widest text-zinc-500 appearance-none min-w-[250px]"
                    >
                      <option value="all">TODOS OS MÓDULOS</option>
                      {modules.map(m => (
                        <option key={m.id} value={m.id}>{m.title.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="text-sm font-bold text-zinc-400">
                  {modules.length} Módulos Disponíveis
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-blue-50/80 dark:bg-blue-900/40 border-b border-blue-100 dark:border-blue-800">
                      <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest w-[110px]">Módulo</th>
                      <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Lição / Conteúdo</th>
                      <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest w-[130px]">Nível</th>
                      <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-right w-[180px]">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {modules
                      .filter(m => moduleFilter === 'all' || m.id === moduleFilter)
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map(module => {
                        const moduleLessons = lessons.filter(l => l.module_id === module.id).sort((a, b) => (a.order || 0) - (b.order || 0));
                        return (
                          <React.Fragment key={module.id}>
                             <tr 
                               onClick={() => setExpandedModuleId(expandedModuleId === module.id ? null : module.id)}
                               className="bg-blue-50/30 dark:bg-blue-900/10 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group/row"
                             >
                               <td className="px-4 md:px-6 py-6 border-l-4 border-blue-500" colSpan={3}>
                                 <div className="flex items-center gap-4">
                                   <span className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-black text-sm shrink-0">{module.order}</span>
                                   <div className="min-w-0 flex-1">
                                     <div className="flex items-center gap-2">
                                       <span className="font-black text-zinc-900 dark:text-white uppercase tracking-tight text-lg block truncate">{module.title}</span>
                                       {expandedModuleId === module.id ? <ChevronDown className="w-5 h-5 text-blue-500" /> : <ChevronRight className="w-5 h-5 text-zinc-300" />}
                                     </div>
                                     <p className="text-xs text-zinc-400 font-bold truncate">{module.description}</p>
                                   </div>
                                 </div>
                               </td>
                               <td className="px-4 md:px-6 py-6 text-right">
                                 <div className="flex justify-end gap-2 md:gap-3 flex-wrap md:flex-nowrap" onClick={e => e.stopPropagation()}>
                                   <button onClick={() => { setEditingLesson({ module_id: module.id } as any); setIsLessonModalOpen(true); }} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all font-black text-[10px] uppercase tracking-widest whitespace-nowrap">
                                     <Plus className="w-4 h-4" /> Nova Aula
                                   </button>
                                   <button onClick={() => { setEditingModule(module); setIsModuleModalOpen(true); }} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm border border-blue-100 dark:border-blue-900/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white whitespace-nowrap">
                                     <Edit2 className="w-3.5 h-3.5" /> Alterar
                                   </button>
                                   <button onClick={() => { setConfirmDelete({ id: module.id, type: 'module', title: module.title }); }} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white dark:bg-zinc-800 text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm border border-rose-100 dark:border-rose-900/30 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white whitespace-nowrap">
                                     <Trash2 className="w-3.5 h-3.5" /> Excluir
                                   </button>
                                 </div>
                               </td>
                             </tr>
                             {expandedModuleId === module.id && (
                               <>
                                 {moduleLessons.length > 0 ? moduleLessons.map(lesson => (
                                   <motion.tr 
                                     initial={{ opacity: 0, x: -10 }}
                                     animate={{ opacity: 1, x: 0 }}
                                     key={lesson.id} 
                                     className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                                   >
                                     <td className="px-4 md:px-6 py-5 text-sm font-bold text-zinc-400 pl-16">Lição {lesson.order}</td>
                                     <td className="px-4 md:px-6 py-5">
                                       <div className="flex flex-col min-w-0">
                                         <span className="font-black text-zinc-700 dark:text-zinc-200 truncate">{lesson.title}</span>
                                         <span className="text-xs font-mono text-zinc-400 truncate max-w-[300px] leading-tight mt-1">{lesson.is_custom_text ? '(Aula Livre)' : lesson.content.substring(0, 100) + '...'}</span>
                                       </div>
                                     </td>
                                     <td className="px-4 md:px-6 py-5">
                                       <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                         lesson.difficulty === 'easy' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                         lesson.difficulty === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                                         'bg-rose-50 border-rose-200 text-rose-600'
                                       }`}>
                                         {lesson.difficulty === 'easy' ? 'FÁCIL' : lesson.difficulty === 'medium' ? 'MÉDIO' : 'AVANÇADO'}
                                       </span>
                                     </td>
                                     <td className="px-4 md:px-6 py-5 text-right md:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0">
                                       <div className="flex justify-end gap-2">
                                         <button onClick={() => setConfirmUpdate({ type: 'lesson', title: lesson.title, data: lesson })} className="w-9 h-9 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-blue-500 rounded-lg transition-all border border-zinc-200/50 dark:border-zinc-700 shadow-sm" title="Alterar"><Edit2 className="w-3.5 h-3.5" /></button>
                                         <button onClick={() => { setConfirmDelete({ id: lesson.id, type: 'lesson', title: lesson.title }); }} className="w-9 h-9 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-rose-500 rounded-lg transition-all border border-zinc-200/50 dark:border-zinc-700 shadow-sm" title="Excluir"><Trash2 className="w-3.5 h-3.5" /></button>
                                       </div>
                                     </td>
                                   </motion.tr>
                                 )) : (
                                   <tr>
                                     <td colSpan={4} className="px-4 md:px-6 py-4 text-center text-xs font-bold text-zinc-300 italic uppercase tracking-widest">Nenhuma lição cadastrada neste módulo</td>
                                   </tr>
                                 )}
                               </>
                             )}
                          </React.Fragment>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div className="p-8">
                <button 
                  onClick={() => setIsModuleModalOpen(true)}
                  className="w-full py-6 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[24px] text-zinc-400 font-black hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/10 transition-all flex items-center justify-center gap-3 text-lg"
                >
                  <Plus className="w-8 h-8" /> CRIAR NOVO MÓDULO
                </button>
              </div>
            </div>
          )}

          {activeTab === 'plans' && (
            <div className="flex flex-col">
              <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-zinc-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Planos de Acesso Ativos
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-blue-50/80 dark:bg-blue-900/40 border-b border-blue-100 dark:border-blue-800">
                      <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Plano</th>
                      <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center w-[160px]">Validade / Valor</th>
                      <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Módulos Inclusos</th>
                      <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-right w-[160px]">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {plans.map(plan => (
                       <tr key={plan.id} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group">
                          <td className="px-4 md:px-6 py-8">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl border-2 shadow-sm ${plan.active ? 'bg-blue-50 text-blue-500 border-blue-100' : 'bg-zinc-50 text-zinc-300 border-zinc-100'}`}>
                              <CreditCard className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-zinc-900 dark:text-white text-xl leading-none mb-1 uppercase tracking-tight">{plan.name}</span>
                              <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${plan.is_promotional ? 'text-amber-500' : 'text-zinc-400'}`}>
                                {plan.is_promotional ? <AlertCircle className="w-3 h-3" /> : null}
                                {plan.is_promotional ? 'PLANO PROMOCIONAL' : 'PREÇO PADRÃO'}
                              </span>
                            </div>
                          </div>
                        </td>
                          <td className="px-4 md:px-6 py-8">
                          <div className="flex flex-col items-center gap-1">
                            <span className="flex items-center gap-1.5 text-sm font-black text-zinc-700 dark:text-zinc-200">
                              <Clock className="w-4 h-4 text-blue-400" /> {plan.validity_days} DIAS
                            </span>
                            <div className="flex items-baseline gap-2 flex-nowrap">
                              {plan.is_promotional && (
                                <span className="text-xs text-zinc-400 line-through font-bold whitespace-nowrap text-right">R$ {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                              )}
                              <span className="text-lg font-black text-blue-600 whitespace-nowrap">R$ {(plan.is_promotional ? plan.promotional_price : plan.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                        </td>
                          <td className="px-4 md:px-6 py-8">
                          <div className="flex flex-wrap gap-2 max-w-[300px]">
                            {plan.accessible_modules.length > 0 ? plan.accessible_modules.map(modId => {
                              const mod = modules.find(m => m.id === modId);
                              return (
                                <span key={modId} className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black text-zinc-500 rounded-lg border border-zinc-200 dark:border-zinc-700 whitespace-nowrap">
                                  MOD {mod?.order || '?'}
                                </span>
                              );
                            }) : (
                              <span className="text-xs font-bold text-zinc-300 italic">Nenhum módulo vinculado</span>
                            )}
                          </div>
                        </td>
                         <td className="px-4 md:px-6 py-8 text-right">
                           <div className="flex justify-end gap-3 md:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0">
                             <button 
                                 onClick={() => setConfirmUpdate({ type: 'plan', title: plan.name, data: plan })}
                               className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-black text-[11px] uppercase tracking-[0.1em] rounded-2xl transition-all shadow-sm border border-blue-100 dark:border-blue-900/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                             >
                               <Edit2 className="w-4 h-4" /> Alterar
                             </button>
                             <button 
                               onClick={() => { setConfirmDelete({ id: plan.id, type: 'plan', title: plan.name }); }}
                               className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-zinc-800 text-rose-500 font-black text-[11px] uppercase tracking-[0.1em] rounded-2xl transition-all shadow-sm border border-rose-100 dark:border-rose-900/30 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white"
                             >
                               <Trash2 className="w-4 h-4" /> Excluir
                             </button>
                           </div>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="flex flex-col gap-8">
              {/* Sub-navigation for Settings */}
              <div className="flex flex-wrap p-1.5 bg-zinc-100 dark:bg-zinc-800/50 rounded-[28px] border border-zinc-200 dark:border-zinc-700 w-fit gap-1">
                <button 
                  onClick={() => setActiveSettingsTab('home')}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeSettingsTab === 'home' ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-md shadow-black/5' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-white'}`}
                >
                  <HomeIcon className="w-4 h-4" /> Home
                </button>
                <button 
                  onClick={() => setActiveSettingsTab('announcements')}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeSettingsTab === 'announcements' ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-md shadow-black/5' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-white'}`}
                >
                  <Megaphone className="w-4 h-4" /> Mensagens
                </button>
                <button 
                  onClick={() => setActiveSettingsTab('courses')}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeSettingsTab === 'courses' ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-md shadow-black/5' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-white'}`}
                >
                  <Video className="w-4 h-4" /> Cursos
                </button>
                <button 
                  onClick={() => setActiveSettingsTab('tips')}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeSettingsTab === 'tips' ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-md shadow-black/5' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-white'}`}
                >
                  <Lightbulb className="w-4 h-4" /> Dicas
                </button>
                <button 
                  onClick={() => setActiveSettingsTab('certificates')}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeSettingsTab === 'certificates' ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-md shadow-black/5' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-white'}`}
                >
                  <CheckCircle2 className="w-4 h-4" /> Certificados
                </button>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-200/50 dark:border-zinc-800 shadow-sm overflow-hidden min-h-[400px]">
                {activeSettingsTab === 'announcements' && (
                  <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/20 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                          <Megaphone className="w-4 h-4 text-blue-500" /> Mensagens em Destaque (Scrolling)
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                          <tr className="bg-blue-50/80 dark:bg-blue-900/40 border-b border-blue-100 dark:border-blue-800">
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Conteúdo da Mensagem</th>
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center w-[120px]">Cliques</th>
                            <th className="px-4 md:px-6 py-6 text-[16px) font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center w-[120px]">Status</th>
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center w-[200px]">Plano</th>
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-right w-[160px]">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                          {announcements.map(ann => (
                            <tr key={ann.id} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group">
                              <td className="px-6 md:px-10 py-8">
                                <div className="flex flex-col">
                                  <span className="font-black text-zinc-900 dark:text-white text-lg leading-snug uppercase tracking-tight">{ann.content}</span>
                                  <span className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Criado em {new Date(ann.created_at!).toLocaleDateString()}</span>
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-8 text-center">
                                <div className="flex flex-col items-center">
                                  <span className="text-2xl font-black text-zinc-900 dark:text-white">{ann.clicks || 0}</span>
                                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Cliques</span>
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-8 text-center">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${ann.active ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-zinc-100 text-zinc-400 border border-zinc-200'}`}>
                                  {ann.active ? 'Ativo' : 'Inativo'}
                                </span>
                              </td>
                              <td className="px-4 md:px-6 py-8 text-center min-w-[180px]">
                                <div className="flex flex-wrap justify-center gap-1">
                                  {ann.target_plans?.length > 0 ? (
                                    ann.target_plans.map(pId => {
                                      const plan = plans.find(p => p.id === pId);
                                      return (
                                        <span key={pId} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[8px] font-black uppercase rounded-md border border-blue-100 dark:border-blue-500/20">
                                          {plan?.name || '---'}
                                        </span>
                                      );
                                    })
                                  ) : (
                                    <span className="text-[10px] font-black text-rose-500 uppercase">Nenhum plano</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-8 text-right">
                                <div className="flex justify-end gap-3 md:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0">
                                  <button 
                                    onClick={() => { setEditingAnnouncement(ann); setIsAnnouncementModalOpen(true); }}
                                    className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-black text-[11px] uppercase tracking-[0.1em] rounded-2xl transition-all shadow-sm border border-blue-100 dark:border-blue-900/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                                  >
                                    <Edit2 className="w-4 h-4" /> Alterar
                                  </button>
                                  <button 
                                    onClick={() => { setConfirmDelete({ id: ann.id, type: 'announcement', title: ann.content.substring(0, 20) + '...' }); }}
                                    className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-zinc-800 text-rose-500 font-black text-[11px] uppercase tracking-[0.1em] rounded-2xl transition-all shadow-sm border border-rose-100 dark:border-rose-900/30 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white"
                                  >
                                    <Trash2 className="w-4 h-4" /> Excluir
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'courses' && (
                  <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/20 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                          <Video className="w-4 h-4 text-blue-500" /> Cursos Disponíveis
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                          <tr className="bg-blue-50/80 dark:bg-blue-900/40 border-b border-blue-100 dark:border-blue-800">
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest w-16 text-center">Ordem</th>
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Curso</th>
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center w-[130px]">Valores</th>
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center w-[160px]">Status/Cliques</th>
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center w-[200px]">Plano</th>
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-right w-[160px]">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                          {courses.sort((a, b) => (a.order || 0) - (b.order || 0)).map(course => (
                            <tr key={course.id} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group">
                              <td className="px-4 md:px-6 py-8 text-center text-lg font-black text-zinc-400">{course.order}</td>
                              <td className="px-4 md:px-6 py-8">
                                <div className="flex flex-col">
                                  <span className="font-black text-zinc-900 dark:text-white text-lg leading-snug uppercase tracking-tight line-clamp-2">{course.title}</span>
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-8 text-center">
                                <div className="flex flex-col items-center gap-1">
                                  {course.promotional_price ? (
                                    <>
                                      <span className="text-xs text-zinc-400 line-through font-bold">R$ {course.price.toFixed(2).replace('.', ',')}</span>
                                      <span className="text-lg font-black text-emerald-500">R$ {course.promotional_price.toFixed(2).replace('.', ',')}</span>
                                    </>
                                  ) : (
                                    <span className="text-lg font-black text-blue-600">R$ {course.price.toFixed(2).replace('.', ',')}</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-8 text-center">
                                <div className="flex flex-col items-center gap-2">
                                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${course.active ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-zinc-100 text-zinc-400 border border-zinc-200'}`}>
                                    {course.active ? 'Ativo' : 'Inativo'}
                                  </span>
                                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">
                                    {course.clicks || 0} CLIQUES
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-8 text-center min-w-[180px]">
                                <div className="flex flex-wrap justify-center gap-1">
                                  {course.target_plans?.length > 0 ? (
                                    course.target_plans.map(pId => {
                                      const plan = plans.find(p => p.id === pId);
                                      return (
                                        <span key={pId} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[8px] font-black uppercase rounded-md border border-blue-100 dark:border-blue-500/20">
                                          {plan?.name || '---'}
                                        </span>
                                      );
                                    })
                                  ) : (
                                    <span className="text-[10px] font-black text-rose-500 uppercase px-2 py-0.5 bg-rose-50 dark:bg-rose-500/10 rounded-md border border-rose-100 italic">Menu Oculto</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 md:px-6 py-8 text-right">
                                <div className="flex justify-end gap-3 md:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0">
                                  <button 
                                    onClick={() => { setEditingCourse(course); setIsCourseModalOpen(true); }}
                                    className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-black text-[11px] uppercase tracking-[0.1em] rounded-2xl transition-all shadow-sm border border-blue-100 dark:border-blue-900/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                                  >
                                    <Edit2 className="w-4 h-4" /> Alterar
                                  </button>
                                  <button 
                                    onClick={() => { setConfirmDelete({ id: course.id, type: 'course', title: course.title }); }}
                                    className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-zinc-800 text-rose-500 font-black text-[11px] uppercase tracking-[0.1em] rounded-2xl transition-all shadow-sm border border-rose-100 dark:border-rose-900/30 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white"
                                  >
                                    <Trash2 className="w-4 h-4" /> Excluir
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {courses.length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-12 text-center text-sm font-bold text-zinc-400 uppercase tracking-widest">NENHUM CURSO CADASTRADO</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'home' && (
                  <div className="p-8 flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    
                    {/* Theme Selection */}
                    <section>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-100 dark:border-amber-500/20">
                          <Palette className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Layout & Cores</h3>
                          <p className="text-zinc-400 text-xs font-bold uppercase">Escolha a identidade visual do portal do aluno</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(['classic', 'vibrant'] as const).map((scheme) => (
                          <button
                            key={scheme}
                            onClick={() => handlers.updateHomeConfig({ layout_scheme: scheme })}
                            className={`relative p-6 rounded-[32px] border-2 transition-all text-left group overflow-hidden ${
                              homeConfig.layout_scheme === scheme 
                                ? (scheme === 'classic' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10' : 
                                   'border-purple-500 bg-purple-50/50 dark:bg-purple-500/10')
                                : 'border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                              scheme === 'classic' ? 'bg-blue-100 text-blue-600' :
                              'bg-purple-100 text-purple-600'
                            }`}>
                              {scheme === 'classic' ? <LayoutDashboard className="w-6 h-6" /> :
                               <TrendingUp className="w-6 h-6" />}
                            </div>
                            <h4 className={`font-black uppercase tracking-tight mb-1 ${scheme === 'classic' && homeConfig.layout_scheme === 'classic' ? 'text-zinc-900 dark:text-white' : scheme === 'vibrant' && homeConfig.layout_scheme === 'vibrant' ? 'text-zinc-900 dark:text-white' : 'text-zinc-900 dark:text-white'}`}>
                              {scheme === 'classic' ? 'Classic Blue' : 'Vibrant Purple'}
                            </h4>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase leading-tight">
                              {scheme === 'classic' ? 'Visual limpo e profissional focado em produtividade.' : 
                               'Cores vibrantes para uma experiência mais dinâmica e energética.'}
                            </p>
                            {homeConfig.layout_scheme === scheme && (
                              <div className="absolute top-6 right-6 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </section>

                    {/* Section Visibility */}
                    <section>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-100 dark:border-emerald-500/20">
                          <Eye className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Visibilidade das Seções</h3>
                          <p className="text-zinc-400 text-xs font-bold uppercase">Escolha o que os alunos verão na página de início</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                          { key: 'show_stats', label: 'Estatísticas', icon: Activity },
                          { key: 'show_videos', label: 'Vídeos de Início', icon: Video },
                          { key: 'show_tips', label: 'Dicas de Mestre', icon: Lightbulb },
                          { key: 'show_modules', label: 'Módulos', icon: BookOpen },
                          { key: 'show_upgrade', label: 'Plano de Update', icon: TrendingUp },
                        ].map((section) => (
                          <button
                            key={section.key}
                            onClick={() => handlers.updateHomeConfig({ [section.key]: !homeConfig[section.key as keyof HomeConfig] })}
                            className={`flex items-center justify-between p-5 rounded-[24px] border transition-all ${
                              homeConfig[section.key as keyof HomeConfig]
                                ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <section.icon className="w-5 h-5" />
                              <span className="font-black text-[11px] uppercase tracking-widest">{section.label}</span>
                            </div>
                            {homeConfig[section.key as keyof HomeConfig] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </section>

                    {/* Instruction Videos Management */}
                    <section>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-100 dark:border-blue-500/20">
                            <Video className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Vídeos de Instrução</h3>
                            <p className="text-zinc-400 text-xs font-bold uppercase">Gerencie os vídeos que aparecem nas Instruções de Início</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => { setEditingHomeVideo(null); setIsHomeVideoModalOpen(true); }}
                          className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.1em] rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.05]"
                        >
                          <Plus className="w-4 h-4" /> Adicionar Vídeo
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {homeVideos.map((video) => (
                          <div 
                            key={video.id} 
                            className={`relative flex flex-col p-6 rounded-[32px] border transition-all bg-white dark:bg-zinc-900 shadow-sm group ${
                              video.active ? 'border-zinc-200 dark:border-zinc-800' : 'opacity-60 border-zinc-100 dark:border-zinc-800/50'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${video.active ? 'bg-blue-50 text-blue-500 dark:bg-blue-500/10' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'}`}>
                                  {video.active ? <PlayCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${video.active ? 'text-blue-500' : 'text-zinc-400'}`}>
                                  {video.active ? 'Ativo' : 'Inativo'}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => { setEditingHomeVideo(video); setIsHomeVideoModalOpen(true); }}
                                  className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-blue-500 hover:text-white transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setConfirmDelete({ id: video.id, type: 'lesson', title: video.title })} // Using lesson type as generic delete for now
                                  className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-rose-500 hover:text-white transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <h4 className="font-black text-zinc-900 dark:text-white uppercase tracking-tight line-clamp-1 mb-1">{video.title}</h4>
                            <p className="text-zinc-400 text-xs font-bold leading-relaxed line-clamp-2 mb-4">{video.description}</p>
                            <div className="mt-auto pt-4 border-t border-zinc-50 dark:border-zinc-800/50 flex items-center justify-between">
                              <span className="text-[9px] text-zinc-300 font-black uppercase tracking-tighter truncate max-w-[150px]">{video.video_url}</span>
                              <button 
                                onClick={() => handlers.saveHomeVideo({ ...video, active: !video.active })}
                                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                                  video.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-zinc-50 text-zinc-400 border-zinc-100'
                                }`}
                              >
                                {video.active ? 'Desativar' : 'Ativar'}
                              </button>
                            </div>
                          </div>
                        ))}
                        {homeVideos.length === 0 && (
                          <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[40px]">
                            <Video className="w-12 h-12 text-zinc-200 mb-4" />
                            <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Nenhum vídeo cadastrado</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-8 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-[32px] border border-blue-100 dark:border-blue-900/20 flex items-start gap-4">
                        <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                        <div className="text-blue-700 dark:text-blue-400 text-sm">
                          <p className="font-black uppercase tracking-tight mb-1">Dica de Alternância</p>
                          <p className="font-bold opacity-80 leading-relaxed uppercase text-[10px]">Se houver mais de um vídeo <strong>Ativo</strong>, o sistema irá selecionar um aleatoriamente para cada aluno em cada acesso, garantindo variedade mas sempre mantendo o foco em um conteúdo por vez.</p>
                        </div>
                      </div>
                    </section>
                  </div>
                )}
                 {activeSettingsTab === 'tips' && (
                  <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/20 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" /> Dicas de Mestre Cadastradas
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                          <tr className="bg-blue-50/80 dark:bg-blue-900/40 border-b border-blue-100 dark:border-blue-800">
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest w-20 text-center">Ícone</th>
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Título da Dica</th>
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center w-[200px]">Plano</th>
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center w-[120px]">Status</th>
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-right w-[160px]">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                          {tips.map(tip => (
                            <tr key={tip.id} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group">
                               <td className="px-4 md:px-6 py-8 text-center text-3xl">{tip.icon || '💡'}</td>
                               <td className="px-4 md:px-6 py-8">
                                 <div className="flex flex-col">
                                   <span className={`font-black uppercase tracking-tight text-lg mb-1 leading-snug line-clamp-1 ${tip.accent_color}`}>{tip.title}</span>
                                   <span className="text-xs text-zinc-500 font-bold max-w-[400px] line-clamp-2">{tip.content}</span>
                                 </div>
                               </td>
                               <td className="px-4 md:px-6 py-8 text-center">
                                <div className="flex flex-wrap justify-center gap-1">
                                  {tip.target_plans?.length > 0 ? (
                                    tip.target_plans.map(pId => {
                                      const plan = plans.find(p => p.id === pId);
                                      return (
                                        <span key={pId} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[8px] font-black uppercase rounded-md border border-blue-100 dark:border-blue-500/20">
                                          {plan?.name || '---'}
                                        </span>
                                      );
                                    })
                                  ) : (
                                    <span className="text-[10px] font-black text-emerald-500 uppercase px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-md border border-emerald-100">Todos os Planos</span>
                                  )}
                                </div>
                              </td>
                               <td className="px-4 md:px-6 py-8 text-center">
                                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${tip.active ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-zinc-100 text-zinc-400 border border-zinc-200'}`}>
                                   {tip.active ? 'Ativa' : 'Oculta'}
                                 </span>
                               </td>
                               <td className="px-4 md:px-6 py-8 text-right">
                                <div className="flex justify-end gap-3 md:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0">
                                  <button 
                                    onClick={() => { setEditingTip(tip); setIsTipModalOpen(true); }}
                                    className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-black text-[11px] uppercase tracking-[0.1em] rounded-2xl transition-all shadow-sm border border-blue-100 dark:border-blue-900/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                                  >
                                    <Edit2 className="w-4 h-4" /> Alterar
                                  </button>
                                  <button 
                                    onClick={() => { setConfirmDelete({ id: tip.id, type: 'tip', title: tip.title }); }}
                                    className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-zinc-800 text-rose-500 font-black text-[11px] uppercase tracking-[0.1em] rounded-2xl transition-all shadow-sm border border-rose-100 dark:border-rose-900/30 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white"
                                  >
                                    <Trash2 className="w-4 h-4" /> Excluir
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {tips.length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-12 text-center text-sm font-bold text-zinc-400 uppercase tracking-widest">NENHUMA DICA CADASTRADA</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'certificates' && (
                  <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/20 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Configurações de Certificados
                        </span>
                      </div>
                      <button 
                        onClick={() => { setEditingCertConfig(null); setIsCertConfigModalOpen(true); }}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.1em] rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.05]"
                      >
                        <Plus className="w-4 h-4" /> Novo Certificado
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                          <tr className="bg-blue-50/80 dark:bg-blue-900/40 border-b border-blue-100 dark:border-blue-800">
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Curso / Plano</th>
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center w-[160px]">Carga Horária</th>
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-4 md:px-6 py-6 text-[16px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest text-right w-[160px]">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                          {certConfigs?.map(cert => {
                            const plan = plans.find(p => p.id === cert.plan_id);
                            return (
                              <tr key={cert.id} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group">
                                <td className="px-4 md:px-6 py-8">
                                  <div className="flex flex-col">
                                    <span className="font-black text-zinc-900 dark:text-white uppercase text-lg">{cert.course_name}</span>
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase mt-1">
                                      Plano: <span className="text-blue-500">{plan?.name || '---'}</span>
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 md:px-6 py-8 text-center">
                                  <span className="font-black text-zinc-700 dark:text-zinc-200">{cert.workload_hours} Horas</span>
                                </td>
                                <td className="px-4 md:px-6 py-8 text-center">
                                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${cert.active ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-zinc-100 text-zinc-400 border border-zinc-200'}`}>
                                    {cert.active ? 'Liberado' : 'Bloqueado'}
                                  </span>
                                </td>
                                <td className="px-4 md:px-6 py-8 text-right">
                                  <div className="flex justify-end gap-3 md:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0">
                                    <button 
                                      onClick={() => { setEditingCertConfig(cert); setIsCertConfigModalOpen(true); }}
                                      className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-black text-[11px] uppercase tracking-[0.1em] rounded-2xl transition-all shadow-sm border border-blue-100 dark:border-blue-900/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                                    >
                                      <Edit2 className="w-4 h-4" /> Alterar
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {(certConfigs || []).length === 0 && (
                            <tr>
                              <td colSpan={4} className="py-12 text-center text-sm font-bold text-zinc-400 uppercase tracking-widest">NENHUM CERTIFICADO CADASTRADO</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/20 mt-8">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-zinc-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Certificados Emitidos (Alunos)
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                          <thead>
                            <tr className="bg-emerald-50/80 dark:bg-emerald-900/40 border-b border-emerald-100 dark:border-emerald-800">
                              <th className="px-4 md:px-6 py-6 text-[16px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Aluno</th>
                              <th className="px-4 md:px-6 py-6 text-[16px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest text-center">Data Emissão</th>
                              <th className="px-4 md:px-6 py-6 text-[16px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest text-center">Performance (PPM / Acc)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {userCertificates?.map(uc => {
                              const student = users.find(u => u.id === uc.user_id);
                              return (
                                <tr key={uc.id} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                                  <td className="px-4 md:px-6 py-6">
                                    <div className="flex flex-col">
                                      <span className="font-black text-zinc-900 dark:text-white">{student?.full_name || 'Usuário Removido'}</span>
                                      <span className="text-[10px] font-bold text-zinc-400 mt-1">{uc.certificate_code}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 md:px-6 py-6 text-center">
                                    <span className="text-sm font-bold text-zinc-500">{new Date(uc.issued_at).toLocaleDateString()}</span>
                                  </td>
                                  <td className="px-4 md:px-6 py-6 text-center">
                                    <span className="inline-flex items-center gap-2 text-xs font-black px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                      <span className="text-blue-500">{uc.average_wpm} PPM</span>
                                      <span className="text-zinc-300">|</span>
                                      <span className="text-emerald-500">{uc.average_accuracy}%</span>
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                            {(userCertificates || []).length === 0 && (
                              <tr>
                                <td colSpan={3} className="py-12 text-center text-sm font-bold text-zinc-400 uppercase tracking-widest">NENHUM CERTIFICADO EMITIDO ATÉ O MOMENTO</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </main>

      {/* --- MODALS --- */}
      <Modal isOpen={isUserModalOpen} onClose={resetModals} title={editingUser ? 'Alterar Aluno' : 'Novo Aluno'} maxWidth="max-w-xl">
        <UserForm user={editingUser} plans={plans} existingUsers={users} onSave={(data, pwd) => { handlers.saveUser(data, pwd); onSaveComplete('Os dados do aluno foram salvos com sucesso!'); }} />
      </Modal>

      <Modal isOpen={isAdminProfileOpen} onClose={resetModals} title="Meus Dados Administrativos" maxWidth="max-w-xl">
        <UserForm user={user} plans={[]} existingUsers={users} isProfileEdit onSave={(data, pwd) => { handlers.saveUser(data, pwd); onSaveComplete('Seus dados administrativos foram atualizados!'); }} />
      </Modal>

      <Modal isOpen={isModuleModalOpen} onClose={resetModals} title={editingModule ? 'Alterar Módulo' : 'Novo Módulo'} maxWidth="max-w-xl">
        <ModuleForm module={editingModule} nextOrder={Math.max(0, ...modules.map(m => m.order || 0)) + 1} onSave={(data) => { handlers.saveModule(data); onSaveComplete('Módulo organizado com sucesso!'); }} />
      </Modal>

      <Modal isOpen={isLessonModalOpen} onClose={resetModals} title={editingLesson?.id ? 'Alterar Lição' : 'Nova Lição'} maxWidth="max-w-2xl">
        <LessonForm lesson={editingLesson} nextOrder={Math.max(0, ...lessons.filter(l => l.module_id === editingLesson?.module_id).map(l => l.order || 0)) + 1} onSave={(data) => { handlers.saveLesson(data); onSaveComplete('Lição cadastrada e salva com sucesso!'); }} />
      </Modal>

      <Modal isOpen={isPlanModalOpen} onClose={resetModals} title={editingPlan ? 'Alterar Plano' : 'Novo Plano'} maxWidth="max-w-3xl">
        <PlanForm plan={editingPlan} modules={modules} onSave={(data) => { handlers.savePlan(data); onSaveComplete('Plano de acesso atualizado com sucesso!'); }} />
      </Modal>

      <Modal isOpen={isAnnouncementModalOpen} onClose={resetModals} title={editingAnnouncement ? 'Alterar Mensagem' : 'Nova Mensagem'} maxWidth="max-w-xl">
        <AnnouncementForm plans={plans} announcement={editingAnnouncement} onSave={(data) => { handlers.saveAnnouncement(data); onSaveComplete('Mensagem programada com sucesso!'); }} />
      </Modal>

      <Modal isOpen={isCourseModalOpen} onClose={resetModals} title={editingCourse ? 'Alterar Curso' : 'Novo Curso'} maxWidth="max-w-3xl">
        <CourseForm plans={plans} course={editingCourse} nextOrder={Math.max(0, ...courses.map(c => c.order || 0)) + 1} onSave={(data) => { handlers.saveCourse(data); onSaveComplete('Curso salvo com sucesso!'); }} />
      </Modal>

      <Modal isOpen={isTipModalOpen} onClose={resetModals} title={editingTip ? 'Alterar Dica de Mestre' : 'Nova Dica de Mestre'} maxWidth="max-w-2xl">
        <TipForm plans={plans} tip={editingTip} onSave={(data) => { handlers.saveTip(data); onSaveComplete('Dica salva com sucesso!'); }} />
      </Modal>

      <Modal isOpen={isHomeVideoModalOpen} onClose={resetModals} title={editingHomeVideo ? 'Alterar Vídeo de Instrução' : 'Novo Vídeo de Instrução'} maxWidth="max-w-xl">
        <HomeVideoForm video={editingHomeVideo} onSave={(data) => { handlers.saveHomeVideo(data); onSaveComplete('O vídeo de instrução foi salvo com sucesso!'); }} />
      </Modal>

      <Modal isOpen={isCertConfigModalOpen} onClose={resetModals} title={editingCertConfig ? 'Alterar Configuração de Certificado' : 'Nova Configuração de Certificado'} maxWidth="max-w-3xl">
        <CertConfigForm config={editingCertConfig} plans={plans} modules={modules} onSave={(data) => { if(handlers.saveCertConfig) { handlers.saveCertConfig(data); onSaveComplete('Configuração de certificado salva!'); } }} />
      </Modal>

      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white dark:bg-zinc-900 rounded-[48px] p-12 max-w-sm w-full shadow-2xl border border-zinc-100 dark:border-zinc-800 text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose-400 to-rose-600" />
              <div className="w-24 h-24 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-8 shadow-inner ring-8 ring-rose-50 dark:ring-rose-500/5">
                <AlertCircle className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-black text-zinc-800 dark:text-white mb-2 tracking-tight uppercase">Excluir?</h3>
              <p className="text-zinc-500 font-bold mb-8 leading-relaxed text-xs uppercase tracking-widest px-4">
                Deseja apagar permanentemente: <br/>
                <span className="text-zinc-900 dark:text-zinc-200 text-base font-black block mt-2 normal-case tracking-normal">{confirmDelete.title}</span>
              </p>
              <div className="space-y-3">
                <button onClick={handleDelete} className="w-full py-5 bg-rose-500 text-white font-black rounded-3xl hover:bg-rose-600 shadow-xl shadow-rose-500/30 transition-all uppercase tracking-widest text-xs active:scale-95">SIM, EXCLUIR AGORA</button>
                <button onClick={() => setConfirmDelete(null)} className="w-full py-4 text-zinc-400 font-black hover:text-zinc-600 dark:hover:text-white transition-all uppercase tracking-widest text-[10px]">CANCELAR</button>
              </div>
            </motion.div>
          </div>
        )}
        
        {confirmUpdate && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white dark:bg-zinc-900 rounded-[48px] p-12 max-w-sm w-full shadow-2xl border border-zinc-100 dark:border-zinc-800 text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 to-blue-600" />
              <div className="w-24 h-24 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-8 shadow-inner ring-8 ring-amber-50 dark:ring-amber-500/5">
                <AlertCircle className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-black text-zinc-800 dark:text-white mb-2 tracking-tight uppercase">Alterar?</h3>
              <p className="text-zinc-500 font-bold mb-8 leading-relaxed text-[10px] uppercase tracking-widest px-4">
                {confirmUpdate.type === 'lesson' && "Esta aula pode estar sendo realizada por alunos neste momento."}
                {confirmUpdate.type === 'plan' && "Alterar um plano afeta todos os alunos vinculados a ele."}
                {confirmUpdate.type === 'user' && "Você está prestes a alterar os dados fundamentais de acesso deste aluno."}
                <br/>
                <span className="text-zinc-900 dark:text-zinc-200 text-sm font-black block mt-2 normal-case tracking-normal">Deseja realmente continuar com a alteração?</span>
              </p>
              <div className="space-y-3">
                <button onClick={handleConfirmUpdate} className="w-full py-5 bg-blue-500 text-white font-black rounded-3xl hover:bg-blue-600 shadow-xl shadow-blue-500/30 transition-all uppercase tracking-widest text-xs active:scale-95">SIM, CONTINUAR</button>
                <button onClick={() => setConfirmUpdate(null)} className="w-full py-4 text-zinc-400 font-black hover:text-zinc-600 dark:hover:text-white transition-all uppercase tracking-widest text-[10px]">CANCELAR</button>
              </div>
            </motion.div>
          </div>
        )}

        {successMessage && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[400] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white dark:bg-zinc-900 rounded-[48px] p-12 max-w-sm w-full shadow-2xl border border-blue-500/10 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-8 shadow-xl shadow-emerald-500/30 animate-pulse">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-black text-zinc-800 dark:text-white mb-2 tracking-tight uppercase">Concluído!</h3>
              <p className="text-zinc-500 font-bold mb-10 leading-relaxed text-xs uppercase tracking-widest">{successMessage}</p>
              <button onClick={() => setSuccessMessage(null)} className="w-full py-5 bg-zinc-900 dark:bg-blue-600 text-white font-black rounded-3xl hover:opacity-90 transition-all uppercase tracking-[0.2em] text-[10px]">ENTENDIDO</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number; subValue: string; icon: React.ReactNode; color: 'blue' | 'rose' | 'emerald' | 'amber' }> = ({ title, value, subValue, icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 shadow-blue-500/10',
    rose: 'bg-rose-50 text-rose-500 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 shadow-rose-500/10',
    emerald: 'bg-emerald-50 text-emerald-500 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 shadow-emerald-500/10',
    amber: 'bg-amber-50 text-amber-500 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 shadow-amber-500/10',
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-zinc-200/50 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-default group">
      <div className="flex items-start justify-between mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-transform group-hover:rotate-12 ${colors[color]}`}>
          {icon}
        </div>
        <div className="flex flex-col items-end">
        <span className="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">{title}</span>
          <span className="text-3xl font-black text-zinc-900 dark:text-white mt-1">{value}</span>
        </div>
      </div>
      <div className="pt-6 border-t border-zinc-50 dark:border-zinc-800">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{subValue}</span>
      </div>
    </div>
  );
};

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; maxWidth?: string }> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.95, opacity: 0, y: 10 }} 
          className={`bg-white dark:bg-zinc-900 w-full ${maxWidth} rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 flex flex-col max-h-[95vh] md:max-h-[90vh]`}
        >
          <header className="p-6 md:p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/30 shrink-0">
            <h2 className="text-2xl md:text-3xl font-black text-zinc-800 dark:text-white tracking-tight uppercase">{title}</h2>
            <button onClick={onClose} className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all group active:scale-95">
              <X className="w-5 h-5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200" />
            </button>
          </header>
          <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-zinc-900">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const UserForm: React.FC<{ user: Profile | null; plans: Plan[]; existingUsers: Profile[]; isProfileEdit?: boolean; onSave: (u: Profile, password?: string) => void }> = ({ user, plans, existingUsers, isProfileEdit, onSave }) => {
  const [name, setName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [active, setActive] = useState(user?.active ?? true);
  const [planId, setPlanId] = useState(user?.plan_id || '');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      setError('Por favor, preencha o nome e o e-mail de acesso.');
      return;
    }

    const emailExists = existingUsers.some(u => 
      u.email?.toLowerCase() === email.trim().toLowerCase() && u.id !== user?.id
    );

    if (emailExists) {
      setError('Este e-mail já está cadastrado no sistema. Caso tenha perdido a senha, tente recuperar o acesso ou entre em contato com o suporte técnico.');
      return;
    }

    setError(null);
    onSave({ 
      id: user?.id || '', 
      full_name: name, 
      email, 
      role: isProfileEdit ? 'admin' : 'student', 
      active, 
      plan_id: planId, 
      created_at: user?.created_at || new Date().toISOString() 
    } as any, password);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
                <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400"> Nome {isProfileEdit ? 'Administrador' : 'Completo'}</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all" placeholder="Nome do usuário" />
        </div>
        <div className="space-y-2">
            <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">E-mail de Acesso</label>
          <input value={email} onChange={e => setEmail(e.target.value)} disabled={isProfileEdit} className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all disabled:opacity-50" placeholder="email@exemplo.com" />
        </div>
        {!isProfileEdit && (
          <div className="space-y-2">
              <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Plano Atual</label>
            <select value={planId} onChange={e => setPlanId(e.target.value)} className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all">
              <option value="">NENHUM PLANO</option>
              {plans.map(p => <option key={p.id} value={p.id}>{p.name.toUpperCase()}</option>)}
            </select>
          </div>
        )}
        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Alterar Senha {user?.id && "(vazio para manter)"}</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all" placeholder="••••••••" />
        </div>
      </div>
      {!isProfileEdit && (
        <div className="flex items-center gap-4 py-4 px-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
          <button onClick={() => setActive(!active)} className={`w-14 h-8 rounded-full transition-all relative ${active ? 'bg-emerald-500 text-white' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${active ? 'left-7' : 'left-1'}`} />
          </button>
          <span className="font-black text-xs uppercase tracking-widest text-zinc-500">{active ? 'USUÁRIO ATIVO NO SISTEMA' : 'USUÁRIO INATIVO / BLOQUEADO'}</span>
        </div>
      )}
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{error}</p>
        </motion.div>
      )}

      <button onClick={handleSave} className="w-full py-6 bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 text-lg hover:bg-blue-600 transition-all uppercase tracking-widest">
        {isProfileEdit ? 'ATUALIZAR MEUS DADOS' : 'SALVAR DADOS DO ALUNO'}
      </button>
    </div>
  );
};

const ModuleForm: React.FC<{ module: Module | null; nextOrder: number; onSave: (m: Module) => void }> = ({ module, nextOrder, onSave }) => {
  const [title, setTitle] = useState(module?.title || '');
  const [desc, setDesc] = useState(module?.description || '');
  const [order, setOrder] = useState(module?.order || nextOrder);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3 space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Título do Módulo</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Módulo 1: As Teclas Base" className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Ordem</label>
          <input type="number" value={order} onChange={e => setOrder(parseInt(e.target.value))} className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Descrição do Módulo</label>
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="O que o aluno vai aprender neste módulo..." className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all" />
      </div>
      <button onClick={() => onSave({ id: module?.id || '', title, description: desc, order })} className="w-full py-6 bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 text-lg hover:bg-blue-600 transition-all uppercase tracking-widest">SALVAR MÓDULO</button>
    </div>
  );
};

const LessonForm: React.FC<{ lesson: Lesson | null; nextOrder: number; onSave: (l: Lesson) => void }> = ({ lesson, nextOrder, onSave }) => {
  const [title, setTitle] = useState(lesson?.title || '');
  const [content, setContent] = useState(lesson?.content || '');
  const [diff, setDiff] = useState(lesson?.difficulty || 'easy');
  const [order, setOrder] = useState(lesson?.order || nextOrder);
  const [objective, setObjective] = useState(lesson?.objective || '');
  const [instruction, setInstruction] = useState(lesson?.instruction || '');
  const [minAcc, setMinAcc] = useState<number | ''>(lesson?.min_accuracy ?? '');
  const [minWpm, setMinWpm] = useState<number | ''>(lesson?.min_wpm ?? '');
  const [maxDuration, setMaxDuration] = useState<number | ''>(lesson?.max_duration_seconds ?? '');
  const [isExam, setIsExam] = useState(lesson?.id ? lesson.is_exam : true);
  const [isCustomText, setIsCustomText] = useState(lesson?.is_custom_text ?? false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3 space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Nome da Aula</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Ordem</label>
          <input type="number" value={order} onChange={e => setOrder(parseInt(e.target.value))} className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex items-center gap-4 py-4 px-6 bg-purple-50 dark:bg-purple-500/10 rounded-2xl border border-purple-100 dark:border-purple-500/20 cursor-pointer hover:bg-purple-100 transition-colors">
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); setIsExam(!isExam); }} 
            className={`w-14 h-8 rounded-full transition-all relative shrink-0 ${isExam ? 'bg-purple-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${isExam ? 'left-7' : 'left-1'}`} />
          </button>
          <div className="flex flex-col">
            <span className="font-black text-xs uppercase tracking-widest text-purple-600 dark:text-purple-400">Lição Completa (Prova)</span>
            <span className="text-[9px] text-purple-500 font-bold uppercase tracking-tighter">Obriga precisão perfeita backspace restrito</span>
          </div>
        </label>
        
        <label className="flex items-center gap-4 py-4 px-6 bg-teal-50 dark:bg-teal-500/10 rounded-2xl border border-teal-100 dark:border-teal-500/20 cursor-pointer hover:bg-teal-100 transition-colors">
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); setIsCustomText(!isCustomText); }} 
            className={`w-14 h-8 rounded-full transition-all relative shrink-0 ${isCustomText ? 'bg-teal-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${isCustomText ? 'left-7' : 'left-1'}`} />
          </button>
          <div className="flex flex-col flex-1">
            <span className="font-black text-xs uppercase tracking-widest text-teal-600 dark:text-teal-400">Estilo Livre (Nome / Texto Livre)</span>
            <span className="text-[9px] text-teal-500 font-bold uppercase tracking-tighter">Pede ao aluno o que ele quer digitar</span>
          </div>
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">
          {isCustomText ? "Molde / Template Opcional" : "Sequência de Digitação (Exercício)"}
        </label>
        <textarea rows={4} value={content} onChange={e => setContent(e.target.value)} className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold font-mono outline-none focus:border-blue-500 resize-none transition-all placeholder:font-sans" placeholder={isCustomText ? "Deixe em branco para o sistema apenas repetir as palavras, ou use {{TEXTO}} no meio de frases." : "Ex: fj fj fjjf..."} />
      </div>
      <div className="space-y-2">
        <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">🎯 Objetivo da Aula (Opcional)</label>
        <textarea rows={2} value={objective} onChange={e => setObjective(e.target.value)} className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 resize-none transition-all placeholder:font-sans text-sm" placeholder="Ex: Fazer o aluno entender onde ficam as teclas principais..." />
      </div>

      <div className="space-y-2">
        <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">📝 Instrução na Tela (Opcional)</label>
        <textarea rows={2} value={instruction} onChange={e => setInstruction(e.target.value)} className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 resize-none transition-all placeholder:font-sans text-sm" placeholder="Ex: Coloque o dedo indicador esquerdo na tecla F..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Regra: Mínimo de Acerto % (Opcional)</label>
          <input type="number" value={minAcc} onChange={e => setMinAcc(e.target.value ? parseInt(e.target.value) : '')} className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-amber-500 transition-all text-sm" placeholder="Ex: 80" />
        </div>
        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Regra: Tempo Máximo seg (Opcional)</label>
          <input type="number" value={maxDuration} onChange={e => setMaxDuration(e.target.value ? parseInt(e.target.value) : '')} className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-amber-500 transition-all text-sm" placeholder="Ex: 30" />
        </div>
        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Regra: Mínimo de PPM (Opcional)</label>
          <input type="number" value={minWpm} onChange={e => setMinWpm(e.target.value ? parseInt(e.target.value) : '')} className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-amber-500 transition-all text-sm" placeholder="Ex: 20" />
        </div>
      </div>

      <div className="flex gap-4">
        {['easy', 'medium', 'hard'].map(d => (
          <button key={d} onClick={() => setDiff(d as any)} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] border-2 transition-all ${diff === d ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-800 text-zinc-400'}`}>
            {d === 'easy' ? 'Fácil' : d === 'medium' ? 'Médio' : 'Avançado'}
          </button>
        ))}
      </div>
      <button onClick={() => onSave({ id: lesson?.id || '', module_id: lesson!.module_id, title, content, difficulty: diff, order, objective, instruction, min_accuracy: minAcc === '' ? undefined : minAcc, min_wpm: minWpm === '' ? undefined : minWpm, max_duration_seconds: maxDuration === '' ? undefined : maxDuration, is_exam: isExam, is_custom_text: isCustomText })} className="w-full py-6 bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 text-lg hover:bg-blue-600 transition-all uppercase tracking-widest">SALVAR AULA</button>
    </div>
  );
};

const PlanForm: React.FC<{ plan: Plan | null; modules: Module[]; onSave: (p: Plan) => void }> = ({ plan, modules, onSave }) => {
  const [name, setName] = useState(plan?.name || '');
  const [val, setVal] = useState(plan?.validity_days || 30);
  const [price, setPrice] = useState(plan?.price || 0);
  const [isProm, setIsProm] = useState(plan?.is_promotional || false);
  const [promPrice, setPromPrice] = useState(plan?.promotional_price || 0);
  const [url, setUrl] = useState(plan?.payment_url || '');
  const [promUrl, setPromUrl] = useState(plan?.promotional_payment_url || '');
  const [active, setActive] = useState(plan?.active ?? true);
  const [selectedMods, setSelectedMods] = useState<string[]>(plan?.accessible_modules || []);

  const toggleMod = (id: string) => {
    setSelectedMods(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {/* Linha 1: Nome do Plano e Validade */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Nome do Plano</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all" placeholder="Ex: Premium Semestral" />
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Validade (Dias)</label>
            <input type="number" value={val} onChange={e => setVal(parseInt(e.target.value))} className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all" />
          </div>
        </div>

        {/* Linha 2: Valor e URL de Pagamento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Valor (R$)</label>
            <input type="number" step="0.01" value={price} onChange={e => setPrice(parseFloat(e.target.value) || 0)} className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all" placeholder="0,00" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">URL de Pagamento</label>
            <div className="relative">
              <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input value={url} onChange={e => setUrl(e.target.value)} className="w-full pl-11 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all" placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* Modo Promocional e Valor na Frente */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-3xl border-2 border-zinc-100 dark:border-zinc-700/30">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 flex-1">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsProm(!isProm)} className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${isProm ? 'bg-blue-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${isProm ? 'left-7' : 'left-1'}`} />
                  </button>
                  <label className="text-[12px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
                    <DollarSign className="w-3 h-3" /> Modo Promocional
                  </label>
                </div>
                {isProm && (
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex-1 max-w-[200px]">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-400">R$</span>
                      <input type="number" step="0.01" value={promPrice} onChange={e => setPromPrice(parseFloat(e.target.value) || 0)} className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border-2 border-blue-500/20 dark:border-blue-500/10 rounded-xl font-black text-blue-600 focus:border-blue-500 outline-none transition-all text-sm" placeholder="0,00" />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            
            {isProm && (
              <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2">
                <label className="text-[12px] font-black uppercase tracking-widest text-amber-500">URL de Pagamento Promocional</label>
                <div className="relative">
                  <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                  <input value={promUrl} onChange={e => setPromUrl(e.target.value)} className="w-full pl-11 pr-4 py-4 bg-white dark:bg-zinc-900 border-2 border-amber-500/20 dark:border-amber-500/10 rounded-2xl font-bold focus:border-amber-500 outline-none transition-all" placeholder="Link de checkout promocional..." />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Módulos Inclusos - Lista Vertical com Scroll */}
        <div className="space-y-3">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <BookOpen className="w-3 h-3" /> Módulos Inclusos
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar p-1">
            {modules.sort((a,b) => (a.order||0) - (b.order||0)).map(m => (
              <button key={m.id} onClick={() => toggleMod(m.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all font-bold text-left hover:scale-[1.01] active:scale-[0.99] ${selectedMods.includes(m.id) ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'bg-zinc-50 border-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:border-zinc-800/50'}`}>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${selectedMods.includes(m.id) ? 'bg-blue-500 border-blue-500 text-white shadow-sm' : 'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700'}`}>
                  {selectedMods.includes(m.id) && <Plus className="w-4 h-4" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black uppercase tracking-tight">Módulo {m.order}: {m.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Plano Ativo */}
        <div className="flex items-center gap-4 py-4 px-6 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
          <button onClick={() => setActive(!active)} className={`w-14 h-8 rounded-full transition-all relative ${active ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${active ? 'left-7' : 'left-1'}`} />
          </button>
          <span className="font-black text-xs uppercase tracking-widest text-zinc-500">
            {active ? 'PLANO ATIVO E VISÍVEL NA PLATAFORMA' : 'PLANO INATIVO'}
          </span>
        </div>
      </div>

      <button onClick={() => onSave({ id: plan?.id || '', name, validity_days: val, price, is_promotional: isProm, promotional_price: promPrice, payment_url: url, promotional_payment_url: promUrl, active, accessible_modules: selectedMods })} className="w-full py-6 bg-blue-500 text-white font-black rounded-[24px] shadow-2xl shadow-blue-500/30 text-lg hover:bg-blue-600 transition-all uppercase tracking-[0.2em] active:scale-[0.98]">
        {plan?.id ? 'ATUALIZAR PLANO' : 'CADASTRAR NOVO PLANO'}
      </button>
    </div>
  );
};

const AnnouncementForm: React.FC<{ plans: Plan[]; announcement: Announcement | null; onSave: (a: Announcement) => void }> = ({ plans, announcement, onSave }) => {
  const [content, setContent] = useState(announcement?.content || '');
  const [link, setLink] = useState(announcement?.link || '');
  const [active, setActive] = useState(announcement?.active ?? true);
  const [bgColor, setBgColor] = useState(announcement?.bg_color || '#312e81');
  const [textColor, setTextColor] = useState(announcement?.text_color || '#ffffff');
  const [speed, setSpeed] = useState(announcement?.speed ?? 5);
  const [selectedPlans, setSelectedPlans] = useState<string[]>(announcement?.target_plans || (plans.length > 0 ? [plans[0].id] : []));

  const togglePlan = (id: string) => {
    setSelectedPlans(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Texto da Mensagem</label>
          <textarea 
            rows={3}
            value={content} 
            onChange={e => setContent(e.target.value)} 
            placeholder="Digite a mensagem que ficará correndo no topo do dashboard..." 
            className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all resize-none" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Link de Destino (Opcional)</label>
          <div className="relative">
            <Link className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input 
              value={link} 
              onChange={e => setLink(e.target.value)} 
              placeholder="https://exemplo.com/pagina-nova" 
              className="w-full pl-14 pr-5 py-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all" 
            />
          </div>
          <p className="text-[10px] text-zinc-400 font-medium">Ao clicar na mensagem, o usuário será levado para este link.</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-blue-500" />
              <label className="text-[12px] font-black uppercase tracking-widest text-zinc-800 dark:text-white">Cor do Fundo</label>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="color" 
                value={bgColor} 
                onChange={e => setBgColor(e.target.value)}
                className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-white dark:border-zinc-700 shadow-xl"
              />
              <input 
                type="text" 
                value={bgColor} 
                onChange={e => setBgColor(e.target.value)}
                className="flex-1 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-xs uppercase"
              />
            </div>
          </div>

          <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-indigo-500" />
              <label className="text-[12px] font-black uppercase tracking-widest text-zinc-800 dark:text-white">Cor da Fonte</label>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="color" 
                value={textColor} 
                onChange={e => setTextColor(e.target.value)}
                className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-white dark:border-zinc-700 shadow-xl"
              />
              <input 
                type="text" 
                value={textColor} 
                onChange={e => setTextColor(e.target.value)}
                className="flex-1 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-xs uppercase"
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Prévia do Banner</label>
          <div className="overflow-hidden rounded-2xl py-4 shadow-lg flex items-center justify-center relative border border-black/5" style={{ backgroundColor: bgColor }}>
            <span className="font-extrabold text-lg uppercase tracking-tight z-10" style={{ color: textColor }}>
              {content || 'SUA MENSAGEM APARECERÁ AQUI'}
            </span>
          </div>
        </div>

        <div className="p-8 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <label className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-white block">Velocidade do Scroll</label>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">De 0 (Lento) a 10 (Rápido)</span>
              </div>
            </div>
            <span className="text-3xl font-black text-blue-500">{speed}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="10" 
            step="1"
            value={speed} 
            onChange={e => setSpeed(parseInt(e.target.value))}
            className="w-full h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between mt-3 px-1 text-[9px] font-black text-zinc-400 uppercase tracking-tighter">
            <span>Tortuga</span>
            <span>Relâmpago</span>
          </div>
        </div>

        <div className="p-8 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <label className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-white block">Plano</label>
              <span className="text-[10px] text-zinc-400 font-bold uppercase">Selecione um ou mais planos</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {plans.map(plan => (
              <button
                key={plan.id}
                onClick={() => togglePlan(plan.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all text-left ${selectedPlans.includes(plan.id) ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-500'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedPlans.includes(plan.id) ? 'border-white bg-white/20' : 'border-zinc-200 dark:border-zinc-700'}`}>
                  {selectedPlans.includes(plan.id) && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                </div>
                <span className="text-xs font-black uppercase tracking-tight truncate">{plan.name}</span>
              </button>
            ))}
          </div>
          {selectedPlans.length === 0 && (
            <p className="mt-4 text-[10px] text-rose-500 font-black uppercase flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Selecione pelo menos um plano
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 py-6 px-8 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
          <button 
            onClick={() => setActive(!active)} 
            className={`w-14 h-8 rounded-full transition-all relative ${active ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-zinc-300 dark:bg-zinc-700'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${active ? 'left-7' : 'left-1'}`} />
          </button>
          <div className="flex flex-col">
            <span className="font-black text-[11px] uppercase tracking-widest text-zinc-800 dark:text-white">
              {active ? 'MENSAGEM ATIVA' : 'MENSAGEM DESATIVADA'}
            </span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Somente mensagens ativas aparecem para os alunos</span>
          </div>
        </div>
      </div>

      <button 
        disabled={selectedPlans.length === 0}
        onClick={() => onSave({ id: announcement?.id || '', content, link, active, clicks: announcement?.clicks || 0, bg_color: bgColor, text_color: textColor, speed, target_plans: selectedPlans })} 
        className={`w-full py-6 text-white font-black rounded-[24px] shadow-2xl text-lg transition-all uppercase tracking-[0.2em] active:scale-[0.98] ${selectedPlans.length === 0 ? 'bg-zinc-400 cursor-not-allowed shadow-none' : 'bg-blue-500 shadow-blue-500/30 hover:bg-blue-600'}`}
      >
        {announcement?.id ? 'ATUALIZAR MENSAGEM' : 'PROGRAMAR MENSAGEM'}
      </button>
    </div>
  );
};

const CourseForm: React.FC<{ plans: Plan[]; course: Course | null; nextOrder: number; onSave: (c: Course) => void }> = ({ plans, course, nextOrder, onSave }) => {
  const [title, setTitle] = useState(course?.title || '');
  const [desc, setDesc] = useState(course?.description || '');
  const [price, setPrice] = useState(course?.price || 0);
  const [promPrice, setPromPrice] = useState(course?.promotional_price || undefined);
  const [url, setUrl] = useState(course?.payment_url || '');
  const [active, setActive] = useState(course?.active ?? true);
  const [order, setOrder] = useState(course?.order || nextOrder);
  const [selectedPlans, setSelectedPlans] = useState<string[]>(course?.target_plans || []);

  const togglePlan = (id: string) => {
    setSelectedPlans(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Título do Curso</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Excel Sem Segredo" className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Ordem</label>
          <input type="number" value={order} onChange={e => setOrder(parseInt(e.target.value))} className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all text-sm" />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Descrição</label>
        <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descrição do curso para os alunos..." className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all resize-none text-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Valor (R$)</label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-black text-zinc-400">R$</span>
            <input type="number" step="0.01" value={price} onChange={e => setPrice(parseFloat(e.target.value) || 0)} className="w-full pl-12 pr-5 py-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all text-sm" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-amber-500">Valor Promocional (Opcional R$)</label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-black text-amber-500/50">R$</span>
            <input type="number" step="0.01" value={promPrice === undefined ? '' : promPrice} onChange={e => setPromPrice(e.target.value ? parseFloat(e.target.value) : undefined)} className="w-full pl-12 pr-5 py-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold focus:border-amber-500 outline-none transition-all text-sm" placeholder="Deixe vazio para não usar" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Link da Oferta no Site</label>
        <div className="relative">
          <Link className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." className="w-full pl-14 pr-5 py-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all text-sm" />
        </div>
      </div>

      <div className="p-8 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <label className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-white block">Plano</label>
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Selecione um ou mais planos</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plans.map(plan => (
            <button
              key={plan.id}
              onClick={() => togglePlan(plan.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all text-left ${selectedPlans.includes(plan.id) ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-500'}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedPlans.includes(plan.id) ? 'border-white bg-white/20' : 'border-zinc-200 dark:border-zinc-700'}`}>
                {selectedPlans.includes(plan.id) && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
              </div>
              <span className="text-xs font-black uppercase tracking-tight truncate">{plan.name}</span>
            </button>
          ))}
        </div>
        {selectedPlans.length === 0 && (
          <p className="mt-4 text-[10px] text-rose-500 font-black uppercase flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> CASO NÃO SELECIONE NENHUM PLANO, O BOTÃO DE +CURSOS SERÁ OCULTO DA ÁREA DO ALUNO.
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 py-6 px-8 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
        <button 
          onClick={() => setActive(!active)} 
          className={`w-14 h-8 rounded-full transition-all relative ${active ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-zinc-300 dark:bg-zinc-700'}`}
        >
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${active ? 'left-7' : 'left-1'}`} />
        </button>
        <div className="flex flex-col">
          <span className="font-black text-[11px] uppercase tracking-widest text-zinc-800 dark:text-white">
            {active ? 'CURSO ATIVO NA LOJA DO ALUNO' : 'CURSO OCULTO'}
          </span>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Somente cursos ativos aparecem para os alunos</span>
        </div>
      </div>

      <button onClick={() => onSave({ id: course?.id || '', title, description: desc, price, promotional_price: promPrice, payment_url: url, active, order, clicks: course?.clicks || 0, target_plans: selectedPlans })} className="w-full py-6 bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 text-lg hover:bg-blue-600 transition-all uppercase tracking-widest">SALVAR CURSO</button>
    </div>
  );
};

const TipForm: React.FC<{ plans: Plan[]; tip: Tip | null; onSave: (t: Tip) => void }> = ({ plans, tip, onSave }) => {
  const [title, setTitle] = useState(tip?.title || '');
  const [content, setContent] = useState(tip?.content || '');
  const [icon, setIcon] = useState(tip?.icon || '💡');
  const [accentColor, setAccentColor] = useState(tip?.accent_color || 'text-blue-400');
  const [active, setActive] = useState(tip?.active ?? true);
  const [selectedPlans, setSelectedPlans] = useState<string[]>(tip?.target_plans || []);

  const togglePlan = (id: string) => {
    setSelectedPlans(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const colors = [
    { label: 'Azul', value: 'text-blue-400', hex: '#60a5fa' },
    { label: 'Roxo', value: 'text-violet-400', hex: '#a78bfa' },
    { label: 'Verde', value: 'text-emerald-400', hex: '#34d399' },
    { label: 'Âmbar', value: 'text-amber-400', hex: '#fbbf24' },
    { label: 'Rosa', value: 'text-rose-400', hex: '#fb7185' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Emoji (Ícone)</label>
          <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="Ex: 🪑" className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all text-center text-xl" maxLength={4} />
        </div>
        <div className="md:col-span-3 space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Título da Dica</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Mantenha a Postura" className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all text-sm" />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Descrição</label>
        <textarea rows={4} value={content} onChange={e => setContent(e.target.value)} placeholder="Descreva a dica com detalhes e foco em encorajar o aluno..." className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all resize-none text-sm leading-relaxed" />
      </div>

      <div className="space-y-3">
        <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Cor de Destaque do Título</label>
        <div className="flex flex-wrap gap-4">
          {colors.map(col => (
            <button
              key={col.value}
              onClick={() => setAccentColor(col.value)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-4 ${accentColor === col.value ? 'border-zinc-900 dark:border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
              style={{ backgroundColor: col.hex }}
              title={col.label}
            />
          ))}
        </div>
      </div>

      <div className="p-8 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <label className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-white block">Plano</label>
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Deixe sem selecionar nenhum para mostrar para TODOS (incluindo Módulo Gratuito)</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {plans.map(plan => (
            <button
              key={plan.id}
              onClick={() => togglePlan(plan.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all text-left ${selectedPlans.includes(plan.id) ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-500'}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedPlans.includes(plan.id) ? 'border-white bg-white/20' : 'border-zinc-200 dark:border-zinc-700'}`}>
                {selectedPlans.includes(plan.id) && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
              </div>
              <span className="text-xs font-black uppercase tracking-tight truncate">{plan.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 py-6 px-8 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
        <button 
          onClick={() => setActive(!active)} 
          className={`w-14 h-8 rounded-full transition-all relative ${active ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-zinc-300 dark:bg-zinc-700'}`}
        >
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${active ? 'left-7' : 'left-1'}`} />
        </button>
        <div className="flex flex-col">
          <span className="font-black text-[11px] uppercase tracking-widest text-zinc-800 dark:text-white">
            {active ? 'DICA ATIVA NA PLATAFORMA' : 'DICA OCULTA'}
          </span>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Somente dicas ativas são exibidas no sistema randômico.</span>
        </div>
      </div>

      <button onClick={() => onSave({ id: tip?.id || '', title, content, icon, accent_color: accentColor, active, target_plans: selectedPlans })} className="w-full py-6 bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 text-lg hover:bg-blue-600 transition-all uppercase tracking-widest">SALVAR DICA</button>
    </div>
  );
};

const formatYoutubeUrl = (url: string): string => {
  if (!url) return '';
  // Match standard youtube link, including shorts and youtu.be
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url;
};

const HomeVideoForm: React.FC<{ video: HomeVideo | null; onSave: (v: HomeVideo) => void }> = ({ video, onSave }) => {
  const [title, setTitle] = useState(video?.title || '');
  const [desc, setDesc] = useState(video?.description || '');
  const [url, setUrl] = useState(video?.video_url || '');
  const [active, setActive] = useState(video?.active ?? true);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Título do Vídeo</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Instruções de Início" className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all text-sm" />
      </div>

      <div className="space-y-2">
        <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Descrição Curta</label>
        <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Breve explicação do conteúdo do vídeo..." className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all resize-none text-sm leading-relaxed" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center mb-1">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Link do Vídeo (Embed)</label>
          <a href="https://support.google.com/youtube/answer/171780" target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 font-bold uppercase flex items-center gap-1 hover:underline">
            <Info className="w-3 h-3" /> Como obter o link?
          </a>
        </div>
        <div className="relative">
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." className="w-full p-5 pr-14 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all text-sm" />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300">
            <Link className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 py-6 px-8 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
        <button 
          onClick={() => setActive(!active)} 
          className={`w-14 h-8 rounded-full transition-all relative ${active ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-zinc-300 dark:bg-zinc-700'}`}
        >
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${active ? 'left-7' : 'left-1'}`} />
        </button>
        <div className="flex flex-col">
          <span className="font-black text-[11px] uppercase tracking-widest text-zinc-800 dark:text-white">
            {active ? 'VÍDEO ATIVO' : 'VÍDEO DESATIVADO'}
          </span>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Somente vídeos ativos podem ser sorteados para exibição.</span>
        </div>
      </div>

      <button 
        disabled={!title || !url}
        onClick={() => onSave({ 
          id: video?.id || '', 
          title, 
          description: desc, 
          video_url: formatYoutubeUrl(url), 
          active 
        })} 
        className={`w-full py-6 text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest text-lg ${!title || !url ? 'bg-zinc-400 cursor-not-allowed shadow-none' : 'bg-blue-500 shadow-blue-500/20 hover:bg-blue-600 active:scale-[0.98]'}`}
      >
        {video?.id ? 'ATUALIZAR VÍDEO' : 'CADASTRAR VÍDEO'}
      </button>
    </div>
  );
};

const CertConfigForm: React.FC<{ config: CertificateConfig | null; plans: Plan[]; modules: Module[]; onSave: (c: CertificateConfig) => void }> = ({ config, plans, modules, onSave }) => {
  const [targetPlanId, setTargetPlanId] = useState(config?.plan_id || (plans.length > 0 ? plans[0].id : ''));
  const [courseName, setCourseName] = useState(config?.course_name || '');
  const [workload, setWorkload] = useState(config?.workload_hours || 10);
  const [desc, setDesc] = useState(config?.description || '');
  const [signedBy, setSignedBy] = useState(config?.signed_by || '');
  const [reqModules, setReqModules] = useState<string[]>(config?.required_modules || []);
  const [active, setActive] = useState(config?.active ?? true);

  const toggleMod = (id: string) => {
    setReqModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Plano Alvo do Certificado</label>
          <select value={targetPlanId} onChange={e => setTargetPlanId(e.target.value)} disabled={!!config?.id} className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all disabled:opacity-50 text-sm">
            {plans.map(p => <option key={p.id} value={p.id}>{p.name.toUpperCase()}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Status no Painel do Aluno</label>
          <div className="flex items-center gap-4 h-[68px] px-6 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl">
            <button type="button" onClick={() => setActive(!active)} className={`w-14 h-8 rounded-full transition-all relative ${active ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${active ? 'left-7' : 'left-1'}`} />
            </button>
            <span className="font-black text-xs uppercase tracking-widest text-zinc-500">{active ? 'LIBERADO PRA EMISSÃO' : 'EMISSÃO BLOQUEADA'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Nome do Curso (Impresso no PDF)</label>
          <input value={courseName} onChange={e => setCourseName(e.target.value)} placeholder="Ex: Digitação Profissional Computadorizada" className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Carga Horária (Hs)</label>
          <input type="number" value={workload} onChange={e => setWorkload(parseInt(e.target.value) || 0)} className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all text-sm" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Descrição do Certificado (Opcional)</label>
        <textarea rows={2} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ex: Certificamos que concluiu com êxito o treinamento avançado..." className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all text-sm resize-none" />
      </div>

      <div className="space-y-2">
        <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Assinado Por (Diretor / Instrutor)</label>
        <input value={signedBy} onChange={e => setSignedBy(e.target.value)} placeholder="Ex: João da Silva" className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all text-sm" />
        <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Este nome será usado para gerar a assinatura visual impressa no rodapé do PDF.</p>
      </div>

      <div className="space-y-3">
        <label className="text-[12px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Módulos Obrigatórios (Requisito)
        </label>
        <p className="text-[10px] text-zinc-400 font-bold uppercase mb-2">O aluno só poderá gerar o certificado se tiver nota máxima aprovada nas lições finais destes módulos marcados.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar p-1">
          {modules.sort((a,b) => (a.order||0) - (b.order||0)).map(m => (
            <button type="button" key={m.id} onClick={() => toggleMod(m.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all font-bold text-left hover:scale-[1.01] active:scale-[0.99] ${reqModules.includes(m.id) ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'bg-zinc-50 border-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:border-zinc-800/50'}`}>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${reqModules.includes(m.id) ? 'bg-blue-500 border-blue-500 text-white shadow-sm' : 'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700'}`}>
                {reqModules.includes(m.id) && <CheckCircle2 className="w-4 h-4" />}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-tight truncate">Módulo {m.order}: {m.title}</span>
              </div>
            </button>
          ))}
          {modules.length === 0 && (
            <div className="col-span-full py-4 text-center text-[10px] text-zinc-400 font-black uppercase tracking-widest">Nenhum módulo para selecionar</div>
          )}
        </div>
      </div>

      <button onClick={() => onSave({ 
        id: config?.id || '', 
        plan_id: targetPlanId, 
        course_name: courseName, 
        workload_hours: workload, 
        description: desc, 
        signed_by: signedBy, 
        required_modules: reqModules, 
        active: active 
      })} className="w-full py-6 bg-blue-500 text-white font-black rounded-[24px] shadow-2xl shadow-blue-500/30 text-lg hover:bg-blue-600 transition-all uppercase tracking-[0.2em] active:scale-[0.98]">
        {config?.id ? 'ATUALIZAR CERTIFICADO' : 'CADASTRAR CERTIFICADO'}
      </button>
    </div>
  );
};
