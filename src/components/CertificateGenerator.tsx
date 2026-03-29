import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
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
  generatePDF: () => Promise<boolean>;
  isGenerating: boolean;
}

export const CertificateGenerator = forwardRef<CertificateGeneratorHandle, CertificateGeneratorProps>(({ config, student, wpm, accuracy, date }, ref) => {
  const [isGenerating, setIsGenerating] = useState(false);

  useImperativeHandle(ref, () => ({
    generatePDF: async (): Promise<boolean> => {
      try {
        setIsGenerating(true);
        console.log('Iniciando geração nativa do certificado vetorial...');
        
        // Formato A4 Paisagem (297x210 mm)
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
        
        // Variáveis de Estilo
        const azulMarinho = '#1e3a8a';
        const azulMarinhoRGB: [number, number, number] = [30, 58, 138];
        const douradoRGB: [number, number, number] = [251, 191, 36];

        // 1. FUNDO E BORDAS - VETORIZADAS
        // Fundo Branco
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, 297, 210, 'F');

        // Borda Externa (Azul)
        pdf.setDrawColor(...azulMarinhoRGB);
        pdf.setLineWidth(10);
        pdf.rect(10, 10, 277, 190, 'S');

        // Borda Interna Dourada
        pdf.setDrawColor(...douradoRGB);
        pdf.setLineWidth(1);
        pdf.rect(15, 15, 267, 180, 'S');

        // Mais uma linha fina azul
        pdf.setDrawColor(...azulMarinhoRGB);
        pdf.setLineWidth(0.3);
        pdf.rect(17, 17, 263, 176, 'S');

        // Detalhes dos cantos (Dourado)
        pdf.setDrawColor(...douradoRGB);
        pdf.setLineWidth(3);
        
        const c = 10; // canto margin
        const w = 20; // tamanho do canto
        // Sup Esg
        pdf.line(c, c, c+w, c);
        pdf.line(c, c, c, c+w);
        // Sup Dir
        pdf.line(297-c, c, 297-c-w, c);
        pdf.line(297-c, c, 297-c, c+w);
        // Inf Esq
        pdf.line(c, 210-c, c+w, 210-c);
        pdf.line(c, 210-c, c, 210-c-w);
        // Inf Dir
        pdf.line(297-c, 210-c, 297-c-w, 210-c);
        pdf.line(297-c, 210-c, 297-c, 210-c-w);

        // Faixa de segurança lateral direita
        pdf.setFillColor(...douradoRGB);
        pdf.rect(295, 0, 2, 210, 'F');


        // TÍTULO: CERTIFICADO DE CONCLUSÃO
        pdf.setFont("times", "bold");
        pdf.setFontSize(40);
        pdf.setTextColor(...azulMarinhoRGB);
        pdf.text("CERTIFICADO", 148.5, 55, { align: 'center' });
        
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.setTextColor(...douradoRGB);
        pdf.text("DE CONCLUSÃO", 148.5, 65, { align: 'center' });

        // Corpo do texto - Declaração
        pdf.setFont("times", "italic");
        pdf.setFontSize(16);
        pdf.setTextColor(100, 100, 100);
        pdf.text("Certificamos solenemente que para os devidos fins de direito", 148.5, 87, { align: 'center' });

        // NOME DO ALUNO
        pdf.setFont("times", "bold");
        pdf.setFontSize(32);
        pdf.setTextColor(20, 20, 20);
        pdf.text((student.full_name || "Aluno").toUpperCase(), 148.5, 107, { align: 'center' });
        
        // Linha abaixo do nome
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(1);
        pdf.line(60, 110, 237, 110);

        // Concluído o curso...
        pdf.setFont("times", "normal");
        pdf.setFontSize(14);
        pdf.setTextColor(80, 80, 80);
        pdf.text(`concluiu com aproveitamento superior o treinamento prático de`, 148.5, 120, { align: 'center' });
        
        pdf.setFont("times", "bold");
        pdf.setFontSize(16);
        pdf.setTextColor(...azulMarinhoRGB);
        pdf.text(config.course_name.toUpperCase(), 148.5, 129, { align: 'center' });

        pdf.setFont("times", "normal");
        pdf.setFontSize(14);
        pdf.setTextColor(80, 80, 80);
        pdf.text(`totalizando uma carga horária acadêmica de ${config.workload_hours} horas.`, 148.5, 138, { align: 'center' });

        // CAIXA DE ESTATÍSTICAS
        pdf.setDrawColor(220, 220, 220);
        pdf.setFillColor(250, 250, 250);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(60, 145, 177, 15, 3, 3, 'FD');

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text("VELOCIDADE", 90, 150, { align: 'center' });
        pdf.setFontSize(12);
        pdf.setTextColor(...azulMarinhoRGB);
        pdf.text(`${wpm} PPM`, 90, 156, { align: 'center' });

        pdf.line(118.5, 145, 118.5, 160);

        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text("PRECISÃO", 148.5, 150, { align: 'center' });
        pdf.setFontSize(12);
        pdf.setTextColor(5, 150, 105);
        pdf.text(`${Math.round(accuracy)}%`, 148.5, 156, { align: 'center' });

        pdf.line(178.5, 145, 178.5, 160);

        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text("STATUS", 207, 150, { align: 'center' });
        pdf.setFontSize(10);
        pdf.setTextColor(...azulMarinhoRGB);
        pdf.text("APROVADO", 207, 156, { align: 'center' });


        // ASSINATURAS E DATAS (Fundo)
        pdf.setDrawColor(150, 150, 150);
        pdf.setLineWidth(0.5);

        // Data Esg
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(50, 50, 50);
        pdf.text(date, 80, 182, { align: 'center' });
        pdf.line(50, 184, 110, 184);
        pdf.setFontSize(7);
        pdf.setTextColor(150, 150, 150);
        pdf.text("DATA DE EMISSÃO", 80, 188, { align: 'center' });

        // Assinatura Dir
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(50, 50, 50);
        pdf.text(config.signed_by, 217, 182, { align: 'center' });
        pdf.line(180, 184, 254, 184);
        pdf.setFontSize(7);
        pdf.setTextColor(150, 150, 150);
        pdf.text("DIRETOR/INSTRUTOR RESPONSÁVEL", 217, 188, { align: 'center' });
        
        // Salvar e pronto
        const sanitizedName = (student.full_name || 'certificado').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        console.log('Salvando PDF:', sanitizedName + '.pdf');
        
        pdf.save(`${sanitizedName}.pdf`);
        return true;
      } catch (error: any) {
        console.error('ERRO NA GERAÇÃO DO PDF:', error);
        alert('Erro ao gerar PDF Nativo: ' + (error.message || 'Falha no motor de vetorização'));
        return false;
      } finally {
        setIsGenerating(false);
      }
    },
    isGenerating
  }));

  // Renderiza a versão visual exata do certificado recriada usando Tailwind para ser a miniatura.
  // Essa div só serve para a tela visual, não será capturada pelo html2canvas nunca mais.
  return (
    <div 
      className="relative bg-white font-serif"
      style={{ 
        width: '1123px', 
        height: '794px',
        backgroundColor: '#ffffff',
        color: '#000000',
        display: 'block'
      }}
    >
        {/* Luxury Border Frame */}
        <div className="absolute inset-0 border-[38px] border-transparent">
           <div className="absolute inset-[-38px] border-[38px] border-white z-0"></div>
           <div className="absolute inset-0 border-[10px] border-[#1e3a8a] box-content -m-[10px]"></div>
        </div>
        <div className="absolute inset-[30px] border-[2px] border-[#fbbf24]"></div>
        <div className="absolute inset-[40px] border-[1px] border-[#1e3a8a]"></div>

        {/* Decorative Corners */}
        <div className="absolute top-[30px] left-[30px] w-24 h-24 border-t-8 border-l-8 border-[#fbbf24] rounded-tl-lg"></div>
        <div className="absolute top-[30px] right-[30px] w-24 h-24 border-t-8 border-r-8 border-[#fbbf24] rounded-tr-lg"></div>
        <div className="absolute bottom-[30px] left-[30px] w-24 h-24 border-b-8 border-l-8 border-[#fbbf24] rounded-bl-lg"></div>
        <div className="absolute bottom-[30px] right-[30px] w-24 h-24 border-b-8 border-r-8 border-[#fbbf24] rounded-br-lg"></div>

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col items-center pt-10 pb-10 px-32 text-center justify-center">
          
          {/* Main Title */}
          <div className="mb-6 mt-2">
            <h1 className="text-[72px] font-black text-[#1e3a8a] uppercase leading-none tracking-tight">
              Certificado
            </h1>
            <h2 className="text-[28px] font-bold text-[#fbbf24] uppercase tracking-[0.3em] mt-2">
              DE CONCLUSÃO
            </h2>
          </div>

          {/* Body Text */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-xl text-gray-500 font-medium italic">
              Certificamos solenemente que para os devidos fins de direito
            </p>

            <h4 className="text-[58px] font-black text-gray-900 border-b-2 border-gray-200 px-12 py-2 uppercase mt-2">
              {student.full_name}
            </h4>

            <p className="text-xl text-gray-700 max-w-[800px] leading-relaxed mt-4">
              concluiu com aproveitamento superior o treinamento prático de <br/>
              <strong className="text-[#1e3a8a] text-2xl uppercase tracking-tight">{config.course_name}</strong>,<br/>
              totalizando uma carga horária acadêmica de <strong>{config.workload_hours} horas</strong>.
            </p>
          </div>

          {/* Stats Panel */}
          <div className="flex items-center gap-12 bg-gray-50/50 border border-gray-200 rounded-2xl px-12 py-6 mb-8 shadow-sm mt-6">
            <div className="text-center w-32">
              <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Velocidade</span>
              <div className="flex justify-center items-baseline gap-1">
                <span className="text-3xl font-black text-[#1e3a8a]">{wpm}</span>
                <span className="text-xs font-bold text-[#1e3a8a]/60 tracking-widest uppercase">PPM</span>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="text-center w-32">
              <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Precisão</span>
              <div className="flex justify-center items-baseline gap-1">
                <span className="text-3xl font-black text-[#059669]">{Math.round(accuracy)}</span>
                <span className="text-xs font-bold text-[#059669]/60 tracking-widest uppercase">%</span>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="text-center w-32">
              <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</span>
              <span className="text-xs font-black text-[#1e3a8a] bg-[#1e3a8a]/5 px-3 py-1 rounded-full border border-[#1e3a8a]/10 uppercase tracking-tighter">APROVADO</span>
            </div>
          </div>

          {/* Footer Signatures */}
          <div className="w-full grid grid-cols-2 gap-32 px-12 items-end mt-4">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-gray-800 mb-1">{date}</span>
              <div className="w-full h-px bg-gray-400 mb-2"></div>
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
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-[#fbbf24]"></div>
      </div>
  );
});

CertificateGenerator.displayName = 'CertificateGenerator';

