import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Info, LayoutGrid, Monitor, Armchair, Hand, Keyboard, X } from 'lucide-react';
import posturaCorreta from '../assets/postura/postura_correta.png';
import posicaoMaos from '../assets/postura/posicao_maos.png';
import alinhamentoPulsos from '../assets/postura/alinhamento_pulsos.png';

interface PostureViewProps {
  onBack: () => void;
}

export const PostureView: React.FC<PostureViewProps> = ({ onBack }) => {
  const steps = [
    {
      title: "Como Sentar",
      icon: <Armchair className="w-6 h-6" />,
      image: posturaCorreta,
      description: "A base de uma boa digitação começa na coluna. Mantenha as costas retas, apoiadas no encosto da cadeira, e os pés retos no chão.",
      tips: [
        "Joelhos em um ângulo de 90 graus",
        "Pés totalmente apoiados no chão",
        "Olhos nivelados com o topo do monitor",
        "Ombros relaxados, sem tensão"
      ],
      color: "blue"
    },
    {
      title: "Braços e Pulsos",
      icon: <Monitor className="w-6 h-6" />,
      image: alinhamentoPulsos,
      description: "Posicione seus braços de forma que formem um ângulo reto (90°) em relação ao corpo. Os pulsos devem estar retos, nunca dobrados.",
      tips: [
        "Pulsos nivelados com o teclado",
        "Não apoie os pulsos na mesa enquanto digita",
        "Braços próximos ao corpo",
        "Cotovelos relaxados"
      ],
      color: "emerald"
    },
    {
      title: "Posição das Mãos",
      icon: <Hand className="w-6 h-6" />,
      image: posicaoMaos,
      description: "Seus dedos devem ficar levemente curvados sobre as teclas, como se estivesse segurando uma pequena bola.",
      tips: [
        "Dedos indicadores nas teclas F e J",
        "Mãos em formato de concha ou garra",
        "Toques leves, sem força excessiva",
        "Cada dedo tem sua 'casa' fixa"
      ],
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <ArrowLeft className="w-6 h-6 text-zinc-400 group-hover:text-blue-500 transition-colors" />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Lição de Postura</h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-bold tracking-tight">O segredo dos profissionais começa com a técnica correta.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-6 py-4 bg-blue-500/10 border border-blue-500/20 rounded-3xl">
            <Info className="w-6 h-6 text-blue-500" />
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-none">Essencial para <br/> evitar lesões</span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-zinc-900 rounded-[40px] shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col lg:flex-row items-stretch min-h-[400px]"
            >
              <div className="lg:w-1/2 relative bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center p-8 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/5 to-transparent pointer-events-none" />
                <motion.img 
                  src={step.image} 
                  alt={step.title}
                  className="w-full h-full object-contain max-h-[400px] z-10"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </div>

              <div className="lg:w-1/2 p-10 flex flex-col justify-center">
                <div className={`p-3 w-fit rounded-2xl mb-6 shadow-sm ${
                  step.color === 'blue' ? 'bg-blue-500 text-white shadow-blue-500/20' :
                  step.color === 'emerald' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                  'bg-purple-500 text-white shadow-purple-500/20'
                }`}>
                  {step.icon}
                </div>
                
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-4">
                  {idx + 1}. {step.title}
                </h2>
                
                <p className="text-zinc-500 dark:text-zinc-300 font-bold mb-8 leading-relaxed max-w-lg">
                  {step.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {step.tips.map((tip, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 group hover:border-zinc-200 transition-colors">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${
                        step.color === 'blue' ? 'text-blue-500' :
                        step.color === 'emerald' ? 'text-emerald-500' :
                        'text-purple-500'
                      }`} />
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <footer className="mt-16 text-center">
          <button 
            onClick={onBack}
            className="px-12 py-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black rounded-3xl hover:scale-105 transition-all shadow-xl uppercase tracking-widest text-sm"
          >
            Entendido, quero começar as aulas!
          </button>
        </footer>
      </div>
    </div>
  );
};
