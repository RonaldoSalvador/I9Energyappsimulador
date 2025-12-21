import React, { useEffect } from 'react';
import { Button } from './ui/Button';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, FileText, Clock, UserCheck, AlertCircle, Share2 } from 'lucide-react';
import { SimulationResult } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SuccessStepProps {
  leadName: string;
  whatsapp: string;
  hasUploadedBill?: boolean;
  result?: SimulationResult;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ leadName, whatsapp, hasUploadedBill, result }) => {
  // Mock protocol number
  const protocol = `I9-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${new Date().getFullYear()}`;

  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FF6B00', '#00FF00', '#ffffff'] // Brand colors
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FF6B00', '#00FF00', '#ffffff'] // Brand colors
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleWhatsAppClick = () => {
    // Consultant's Number
    const phone = "553173431848";
    const text = encodeURIComponent(`Olá! Fiz a simulação no site e quero garantir meu desconto de Natal de 60% na Energia. Meu protocolo é ${protocol}`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleShare = () => {
    const link = window.location.origin;
    const text = `Acabei de garantir um desconto vitalício na minha conta de luz com a i9 Energy! 🌿\n\nSem investimento e sem obras. Faz uma simulação aí pra ver quanto você consegue economizar também:\n${link}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleDownloadPDF = () => {
    if (!result) return;

    // Create new PDF document
    const doc = new jsPDF();

    // Green Background Header
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Proposta de Economia", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("i9 Energy - Soluções em Energia", 105, 28, { align: "center" });

    // -- CONTENT --
    let yPos = 50;

    // Summary Card
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 250, 248);
    doc.roundedRect(14, yPos, 182, 35, 3, 3, 'FD');

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.text("RESULTADO DA SIMULAÇÃO", 20, yPos + 10);

    doc.setFontSize(16);
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.setFont("helvetica", "bold");
    doc.text(`Economia Anual Estimada: R$ ${result.annualSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPos + 22);

    yPos += 50;

    // Detailed Table using autoTable
    autoTable(doc, {
      startY: yPos,
      head: [['Descrição', 'Valor Atual', 'Com i9 Energy']],
      body: [
        ['Mensalidade / Custo', `R$ ${result.originalBillValue.toFixed(2)}`, `R$ ${result.newTotalValue.toFixed(2)}`],
        ['Consumo (kWh)', `${result.estimatedConsumptionKwh.toFixed(0)} kWh`, `${result.estimatedConsumptionKwh.toFixed(0)} kWh`],
        ['Custo Energia', '-', `R$ ${result.subscriptionCost.toFixed(2)}`],
        ['Taxa Distribuidora', '-', `R$ ${result.residualBill.toFixed(2)}`],
      ],
      headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold' },
      bodyStyles: { textColor: 50 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      theme: 'grid',
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Impact Section
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text("Impacto Ambiental Positivo:", 14, yPos);

    const co2AvoidedKg = (result.estimatedConsumptionKwh * 12) * 0.1;
    const treesSaved = Math.max(1, Math.round(co2AvoidedKg / 20));

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`• ${treesSaved} Árvores preservadas por ano (estimativa)`, 14, yPos + 8);
    doc.text(`• Energia Limpa e Sustentável Garantida`, 14, yPos + 14);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Gerado em ${new Date().toLocaleDateString()} via Simulador i9 Energy.`, 105, 280, { align: "center" });

    doc.save('Proposta-i9Energy.pdf');
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle2 size={40} className="text-i9-green" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Solicitação Recebida!</h2>
        <p className="text-slate-600 max-w-sm mx-auto">
          Obrigado, <span className="font-semibold text-slate-900">{leadName}</span>. Já reservamos sua pré-análise de economia.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-i9-green to-energisa-orange"></div>
        <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">Seu Protocolo</p>
        <p className="text-2xl font-mono font-bold text-slate-900 tracking-wider">{protocol}</p>
      </div>

      <div className="space-y-6 mb-8">
        <h3 className="text-sm font-semibold text-slate-900 text-center uppercase tracking-wider">Próximos Passos</h3>

        <div className="relative pl-8 border-l-2 border-slate-200 space-y-8 text-left ml-4">
          <div className="relative">
            <span className="absolute -left-[41px] bg-i9-green border-4 border-white rounded-full w-6 h-6 flex items-center justify-center">
              <CheckCircle2 size={12} className="text-white" />
            </span>
            <h4 className="font-semibold text-slate-900">Análise de Perfil</h4>
            <p className="text-sm text-slate-500">Nosso sistema validou seus dados básicos.</p>
          </div>

          <div className="relative">
            <span className="absolute -left-[41px] bg-energisa-orange border-4 border-white rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
              <Clock size={12} className="text-white" />
            </span>
            <h4 className="font-semibold text-slate-900">Contato do Consultor</h4>
            <p className="text-sm text-slate-500">Um especialista entrará em contato via WhatsApp em instantes.</p>
          </div>

          <div className="relative opacity-50">
            <span className="absolute -left-[41px] bg-slate-300 border-4 border-white rounded-full w-6 h-6 flex items-center justify-center">
              <UserCheck size={12} className="text-white" />
            </span>
            <h4 className="font-semibold text-slate-900">Ativação</h4>
            <p className="text-sm text-slate-500">Assinatura digital do termo e início do desconto.</p>
          </div>
        </div>
      </div>

      {/* Reminder to send bill if not uploaded */}
      {!hasUploadedBill && (
        <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-6 flex items-start text-left">
          <AlertCircle className="text-energisa-orange shrink-0 mr-3 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-semibold text-slate-900">Acelere sua aprovação</p>
            <p className="text-sm text-slate-600">Como você não anexou a conta, envie uma foto dela para o consultor assim que chamar no WhatsApp.</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Button onClick={handleWhatsAppClick} fullWidth className="bg-[#25D366] hover:bg-[#128C7E] text-white shadow-[#25D366]/30">
          <MessageCircle className="mr-2 h-5 w-5" />
          Falar com Consultor Agora
        </Button>

        <div className="flex gap-3">
          <Button onClick={handleShare} variant="outline" className="flex-1 border-slate-300 text-slate-600 hover:bg-slate-50">
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>

          <Button onClick={handleDownloadPDF} variant="outline" disabled={!result} className="flex-1 border-slate-300 text-slate-600 hover:bg-slate-50">
            <FileText className="mr-2 h-4 w-4" />
            Baixar PDF
          </Button>
        </div>
      </div>
    </div>
  );
};