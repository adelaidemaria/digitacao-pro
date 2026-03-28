import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Award, Lock, ExternalLink, Download, CheckCircle } from 'lucide-react';
import { Profile, Plan, Module, Lesson, CertificateConfig, UserCertificate } from '../types';
import { CertificateGenerator, CertificateGeneratorHandle } from '../components/CertificateGenerator';
import { supabase } from '../lib/supabase';

interface StudentCertificateViewProps {
  user: Profile;
  plan?: Plan;
  config?: CertificateConfig;
  userCertificate?: UserCertificate;
  modules: Module[];
  lessons: Lesson[];
  progress: any[];
  onBack: () => void;
  onCertificateGenerated: (cert: UserCertificate) => void;
}

export const StudentCertificateView: React.FC<StudentCertificateViewProps> = ({
  user, plan, config, userCertificate, modules, lessons, progress, onBack, onCertificateGenerated
}) => {
  const generatorRef = useRef<CertificateGeneratorHandle>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [showFinishedCert, setShowFinishedCert] = useState(!!userCertificate);

  // 1. Is it available in the current plan?
  if (!config || !config.active) {
    return (
      <div className="min-h-screen bg-[#f4f7fa] dark:bg-zinc-950 p-4 md:p-8 font-sans overflow-y-auto flex flex-col">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800">
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </button>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">Certificado</h1>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 text-center shadow-xl">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-rose-500">
              <Lock className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase mb-4">Emissão Indisponível</h2>
            <p className="text-zinc-500 font-bold text-sm mb-8 leading-relaxed">
              Seu plano atual não oferece a emissão de certificado automático. Faça um upgrade de plano para desbloquear este recurso incrível!
            </p>
            <button onClick={onBack} className="w-full py-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 font-black rounded-2xl uppercase tracking-widest text-xs transition-all">
              Voltar ao Painel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Are requirements met?
  const requiredModules = config.required_modules || [];
  const modulesToComplete = modules.filter(m => requiredModules.includes(m.id));
  
  let allRequirementsMet = true;
  const missingModules: string[] = [];
  
  // Calculate average stats over all completed lessons required
  let totalWpm = 0;
  let totalAcc = 0;
  let lessonCount = 0;

  for (const requiredId of requiredModules) {
    const modLessons = lessons.filter(l => l.module_id === requiredId);
    let modCompleted = true;
    
    for (const lesson of modLessons) {
      const p = progress.find(pr => pr.lesson_id === lesson.id);
      if (!p) {
        modCompleted = false;
        allRequirementsMet = false;
      } else {
        totalWpm += p.wpm;
        totalAcc += p.accuracy;
        lessonCount++;
      }
    }
    
    if (!modCompleted) {
      const mName = modules.find(m => m.id === requiredId)?.title || 'Módulo Desconhecido';
      missingModules.push(mName);
    }
  }

  const avgWpm = lessonCount > 0 ? Math.round(totalWpm / lessonCount) : 0;
  const avgAcc = lessonCount > 0 ? Math.round(totalAcc / lessonCount) : 0;

  const handleGenerate = async () => {
    if (!generatorRef.current) return;

    setIsGenerating(true);
    
    try {
      // Pequeno timeout para o navegador renderizar a tela de "Gerando..."
      await new Promise(r => setTimeout(r, 600));
      
      const success = await generatorRef.current.generatePDF();
      
      if (success) {
        if (!userCertificate && plan && user) {
          try {
            const { data, error } = await supabase.from('user_certificates').insert({
              user_id: user.id,
              plan_id: plan.id,
              stats_wpm: avgWpm,
              stats_accuracy: avgAcc
            }).select().single();
            
            if (!error && data) {
              onCertificateGenerated(data as UserCertificate);
            }
          } catch (dbErr) {
            console.error('Erro banco', dbErr);
          }
        }
        
        // MOSTRA O CERTIFICADO NA TELA
        setShowFinishedCert(true);
      }
    } catch (err: any) {
      console.error('Erro geração:', err);
      alert('Erro: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fa] dark:bg-zinc-950 p-4 md:p-8 font-sans overflow-x-hidden relative z-0">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800">
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </button>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">Seu Certificado</h1>
          </div>
        </header>

        {!allRequirementsMet ? (
          <div className="bg-white dark:bg-zinc-900 rounded-[40px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl max-w-2xl mx-auto text-center mt-12">
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-amber-500 shadow-inner">
              <Lock className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-4">Etapas Pendentes</h2>
            <p className="text-zinc-500 font-black text-sm mb-8 leading-relaxed">
              Você precisa concluir os seguintes módulos para liberar a emissão do seu certificado:
            </p>
            
            <div className="space-y-3 max-w-sm mx-auto mb-10 text-left">
              {missingModules.map((m, i) => (
                <div key={i} className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-bold text-sm text-zinc-700 dark:text-zinc-300">{m}</span>
                </div>
              ))}
            </div>
            
            <button onClick={onBack} className="w-full max-w-sm py-4 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs transition-all shadow-xl shadow-blue-500/20">
              Continuar Aprendendo
            </button>
          </div>
        ) : isGenerating ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-10 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-2xl text-center space-y-8 animate-in fade-in zoom-in duration-500">
               <div className="relative w-24 h-24 mx-auto">
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
                  />
                  <div className="absolute inset-4 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                    <Award className="w-8 h-8" />
                  </div>
               </div>
               <div>
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Gerando Documento</h3>
                  <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">Montando certificado em alta qualidade...</p>
               </div>
            </div>
          </div>
        ) : !showFinishedCert ? (
          <div className="flex-1 flex flex-col items-center justify-center py-10">
            <div className="max-w-2xl w-full bg-white dark:bg-zinc-900 p-12 rounded-[50px] border border-zinc-200 dark:border-zinc-800 text-center shadow-2xl space-y-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[32px] flex items-center justify-center mx-auto text-white shadow-xl shadow-blue-500/40 transform -rotate-6">
                <Award className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-3">Tudo Pronto!</h2>
                <p className="text-zinc-500 font-bold text-base max-w-sm mx-auto">
                  Você concluiu todos os requisitos necessários para este curso. Deseja emitir seu certificado oficial agora?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-700">
                  <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Média PPM</span>
                  <span className="text-2xl font-black text-blue-600">{avgWpm}</span>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-700">
                  <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Precisão</span>
                  <span className="text-2xl font-black text-emerald-500">{avgAcc}%</span>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-3xl uppercase tracking-[0.2em] text-sm shadow-2xl shadow-blue-500/40 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
              >
                <Award className="w-5 h-5 pointer-events-none" /> Emitir Certificado Agora
              </button>
            </div>
          </div>
        ) : (
          /* Case: Certificate Generated & Ready */
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Download Action Area */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Parabéns pela Conclusão!</h2>
                <p className="text-zinc-500 font-bold text-sm">Seu certificado oficial foi gerado e está disponível para download.</p>
                <p className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 rounded-full uppercase tracking-widest font-black inline-block mt-3 border border-emerald-100 dark:border-emerald-500/20">
                  <CheckCircle className="w-3 h-3 inline mr-1" /> Documento Autêntico e Registrado
                </p>
              </div>
              
              <button 
                onClick={() => generatorRef.current?.generatePDF()}
                className="w-full md:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-5 h-5" /> Baixar PDF Original
              </button>
            </div>
            
            {/* Preview (Scaled down visually) */}
            <div className="w-full overflow-hidden rounded-[40px] shadow-2xl bg-zinc-100 dark:bg-zinc-800 p-8 border border-zinc-200 dark:border-zinc-700 flex justify-center">
              <div className="w-full max-w-[1123px] transform-gpu scale-[0.3] h-[240px] xs:scale-[0.4] xs:h-[320px] sm:scale-[0.6] sm:h-[480px] md:scale-[0.7] md:h-[560px] lg:scale-100 lg:h-auto origin-top transition-transform duration-500">
                <CertificateGenerator 
                  config={config}
                  student={user}
                  wpm={avgWpm}
                  accuracy={avgAcc}
                  date={userCertificate?.generated_at ? new Date(userCertificate.generated_at).toLocaleDateString() : new Date().toLocaleDateString()}
                />
              </div>
            </div>
          </div>
        )}


        {/* 1. HIDDEN GENERATOR (OFF-SCREEN) */}
        {/* We keep it OPAQUE and VISIBLE but at -10000px so html2canvas can capture it perfectly */}
        <div 
          id="generator-capture-zone"
          style={{ 
            position: 'fixed', 
            left: '-10000px', 
            top: '0', 
            width: '1123px', 
            height: '794px', 
            zIndex: -100,
            overflow: 'hidden'
          }}
        >
          <CertificateGenerator 
            ref={generatorRef}
            config={config}
            student={user}
            wpm={avgWpm}
            accuracy={avgAcc}
            date={new Date().toLocaleDateString()}
          />
        </div>

      </div>
    </div>
  );
};


