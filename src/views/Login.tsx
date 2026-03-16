import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, Keyboard, User, ArrowLeft, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

interface LoginProps {
  onLogin: (role: 'admin' | 'student', profile?: Profile) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        onLogin(profile?.role || 'student', profile);
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });

        if (signUpError) throw signUpError;
        if (!data.user) throw new Error('Falha ao criar usuário.');

        // Busca um plano padrão (Gratuito) se existir
        const { data: defaultPlan } = await supabase
          .from('plans')
          .select('id')
          .ilike('name', '%gratuito%')
          .maybeSingle();

        const newProfile: Profile = {
          id: data.user.id,
          full_name: fullName,
          email: email,
          role: 'student',
          active: true,
          plan_id: defaultPlan?.id || undefined,
          created_at: new Date().toISOString()
        };

        const { error: insertError } = await supabase.from('profiles').insert([newProfile]);
        if (insertError) throw insertError;
        
        onLogin('student', newProfile);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 p-12 rounded-[48px] shadow-2xl max-w-md w-full border border-zinc-100 dark:border-zinc-800"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-500/20">
            <Keyboard className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-zinc-800 dark:text-white mb-2 tracking-tight">Digitador Pro</h1>
          <p className="text-zinc-500 text-center font-medium">
            {mode === 'login' 
              ? 'Acesse sua conta para continuar praticando.' 
              : 'Crie sua conta e comece sua jornada de digitação hoje.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-black text-center uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all dark:text-white font-bold"
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all dark:text-white font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all dark:text-white font-bold"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 group uppercase tracking-widest text-sm"
          >
            {loading ? 'Processando...' : mode === 'login' ? 'Entrar no Painel' : 'Começar Agora'} 
            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800 text-center">
          {mode === 'login' ? (
            <p className="text-zinc-500 text-sm font-medium">
              Ainda não tem acesso? 
              <button 
                onClick={() => { setMode('signup'); setError(null); }}
                className="text-blue-500 font-black hover:underline ml-1"
              >
                Cadastre-se agora
              </button>
            </p>
          ) : (
            <button 
              onClick={() => { setMode('login'); setError(null); }}
              className="flex items-center gap-2 text-zinc-500 hover:text-blue-500 font-black text-xs uppercase tracking-widest mx-auto transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para o Login
            </button>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">
          <ShieldCheck className="w-3 h-3" /> Conexão Segura
        </div>
      </motion.div>
    </div>
  );
};
