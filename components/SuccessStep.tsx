import React from 'react';
import { Button } from './ui/Button';
import { CheckCircle2, MessageCircle, FileText, Clock, UserCheck, AlertCircle } from 'lucide-react';

interface SuccessStepProps {
  leadName: string;
  whatsapp: string;
  hasUploadedBill?: boolean;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ leadName, whatsapp, hasUploadedBill }) => {
  // Mock protocol number
  const protocol = `I9-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${new Date().getFullYear()}`;

  const handleWhatsAppClick = () => {
    // Consultant's Number
    const phone = "553173431848";
    const text = encodeURIComponent(`Boa tarde, enviei minha conta e estou aguardando análise do desconto.`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
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

        <Button variant="ghost" fullWidth disabled className="text-slate-400">
          <FileText className="mr-2 h-4 w-4" />
          Baixar Proposta em PDF (Gerando...)
        </Button>
      </div>
    </div>
  );
};