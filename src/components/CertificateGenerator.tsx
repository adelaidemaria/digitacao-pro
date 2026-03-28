import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CertificateConfig, Profile } from '../types';

interface CertificateGeneratorProps {
  config: CertificateConfig;
  student: Profile;
  wpm: number;
  accuracy: number;
  date: string;
}

export interface CertificateGeneratorHandle {
  generatePDF: () => Promise<void>;
  isGenerating: boolean;
}

export const CertificateGenerator = forwardRef<CertificateGeneratorHandle, CertificateGeneratorProps>(({ config, student, wpm, accuracy, date }, ref) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useImperativeHandle(ref, () => ({
    generatePDF: async (): Promise<boolean> => {
      const el = certificateRef.current;
      if (!el) {
        console.error('CERT_REF_MISSING');
        return false;
      }
      
      try {
        setIsGenerating(true);
        console.log('Capture Start');

        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: true,
          width: 1123,
          height: 794
        });
        
        console.log('Canvas OK');

        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
        
        const sanitizedName = (student.full_name || 'certificado').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        pdf.save(`${sanitizedName}.pdf`);
        return true;
      } catch (error: any) {
        console.error('GEN_ERROR:', error);
        alert('Erro ao processar: ' + (error.message || 'Falha no motor gráfico'));
        return false;
      } finally {
        setIsGenerating(false);
      }
    },
    isGenerating
  }));

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div 
        className="relative bg-white shrink-0 font-serif"
        style={{ 
          width: '1123px', 
          height: '794px',
          backgroundColor: '#ffffff',
          color: '#000000',
          display: 'block'
        }}
      >
        {/* Luxury Border Frame */}
        <div className="absolute inset-0 border-[30px] border-[#1e3a8a]"></div>
        <div className="absolute inset-[30px] border-[2px] border-[#fbbf24]"></div>
        <div className="absolute inset-[45px] border-[1px] border-[#1e3a8a]"></div>

        {/* Decorative Corners */}
        <div className="absolute top-[30px] left-[30px] w-24 h-24 border-t-8 border-l-8 border-[#fbbf24] rounded-tl-lg"></div>
        <div className="absolute top-[30px] right-[30px] w-24 h-24 border-t-8 border-r-8 border-[#fbbf24] rounded-tr-lg"></div>
        <div className="absolute bottom-[30px] left-[30px] w-24 h-24 border-b-8 border-l-8 border-[#fbbf24] rounded-bl-lg"></div>
        <div className="absolute bottom-[30px] right-[30px] w-24 h-24 border-b-8 border-r-8 border-[#fbbf24] rounded-br-lg"></div>

        {/* Simplified Watermark for Compatibility */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #1e3a8a 25%, transparent 25%, transparent 50%, #1e3a8a 50%, #1e3a8a 75%, transparent 75%, transparent)', backgroundSize: '40px 40px' }}></div>


        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col items-center pt-24 pb-16 px-32 text-center">
          
          {/* Institution Header */}
          <div className="mb-8 flex flex-col items-center">
             <div className="w-16 h-1 bg-[#fbbf24] mb-3"></div>
             <span className="text-[#1e3a8a] font-black tracking-[0.4em] uppercase text-xs mb-1">Academia de Digitação Profissional</span>
             <h3 className="text-[#1e3a8a] font-bold text-lg tracking-tighter">DIGITAÇÃO SEM SEGREDO</h3>
          </div>

          {/* Main Title */}
          <div className="mb-10">
            <h1 className="text-[72px] font-black text-[#1e3a8a] uppercase leading-none tracking-tight">
              Certificado
            </h1>
            <h2 className="text-[28px] font-bold text-[#fbbf24] uppercase tracking-[0.3em] mt-2">
              DE CONCLUSÃO
            </h2>
          </div>

          {/* Body Text */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <p className="text-xl text-gray-500 font-medium italic underline underline-offset-8 decoration-[#fbbf24]/30">
              Certificamos solenemente que para os devidos fins de direito
            </p>

            <h4 className="text-[58px] font-black text-gray-900 border-b-4 border-gray-100 px-12 py-2">
              {student.full_name}
            </h4>

            <p className="text-xl text-gray-700 max-w-[800px] leading-relaxed">
              concluiu com aproveitamento superior o treinamento prático de <br/>
              <strong className="text-[#1e3a8a] text-2xl uppercase tracking-tight">{config.course_name}</strong>,<br/>
              totalizando uma carga horária acadêmica de <strong>{config.workload_hours} horas</strong>.
            </p>
            
            {config.description && (
               <p className="text-sm font-medium text-gray-400 max-w-[600px] leading-snug">
                 {config.description}
               </p>
            )}
          </div>

          {/* Stats Panel */}
          <div className="flex items-center gap-12 bg-gray-50/50 border border-gray-100 rounded-2xl px-12 py-6 mb-12 shadow-sm">
            <div className="text-center">
              <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Velocidade</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#1e3a8a]">{wpm}</span>
                <span className="text-xs font-bold text-[#1e3a8a]/60 tracking-widest uppercase">PPM</span>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Precisão</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#059669]">{Math.round(accuracy)}</span>
                <span className="text-xs font-bold text-[#059669]/60 tracking-widest uppercase">%</span>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</span>
              <span className="text-xs font-black text-[#1e3a8a] bg-[#1e3a8a]/5 px-3 py-1 rounded-full border border-[#1e3a8a]/10 uppercase tracking-tighter">APROVADO</span>
            </div>
          </div>

          {/* Footer Signatures */}
          <div className="w-full grid grid-cols-2 gap-32 px-12 items-end">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-gray-800 mb-1">{date}</span>
              <div className="w-full h-px bg-gray-300 mb-2"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Data de Emissão</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-gray-800 mb-2">
                {config.signed_by}
              </span>
              <div className="w-full h-px bg-gray-400 mb-2"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Diretor/Instrutor Responsável</span>
            </div>
          </div>
          
        </div>

        {/* Optical Security Strip */}
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#fbbf24]/20 to-transparent"></div>
      </div>
    </div>
  );
});


CertificateGenerator.displayName = 'CertificateGenerator';
