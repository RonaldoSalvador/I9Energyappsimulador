import React from 'react';
import { X } from 'lucide-react';

export type LegalContentType = 'privacy' | 'terms' | null;

interface LegalModalProps {
  type: LegalContentType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const content = {
    privacy: {
      title: "Política de Privacidade",
      text: (
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p><strong>1. Coleta de Dados:</strong> Coletamos informações como nome, telefone e e-mail apenas para fins de contato comercial e simulação de economia de energia, conforme solicitado pelo usuário.</p>
          <p><strong>2. Uso das Informações:</strong> Seus dados serão utilizados exclusivamente pela i9 Energy e seus parceiros diretos para processar sua adesão ao sistema de compensação de energia.</p>
          <p><strong>3. Segurança:</strong> Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou alteração.</p>
          <p><strong>4. Seus Direitos (LGPD):</strong> Você tem o direito de solicitar o acesso, correção ou exclusão de seus dados pessoais a qualquer momento através de nossos canais de atendimento.</p>
        </div>
      )
    },
    terms: {
      title: "Termos de Uso",
      text: (
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p><strong>1. Sobre o Serviço:</strong> A i9 Energy oferece um serviço de assinatura de energia solar (Geração Distribuída) que permite ao consumidor obter créditos em sua fatura de energia.</p>
          <p><strong>2. Simulação:</strong> Os valores apresentados no simulador são estimativas baseadas nas tarifas vigentes e na média de consumo informada. O desconto real pode variar conforme o perfil de consumo mensal.</p>
          <p><strong>3. Elegibilidade:</strong> O serviço está disponível apenas para unidades consumidoras atendidas pelas distribuidoras parceiras (ex: Energisa MG, MT, PB, MS) e que estejam em conformidade com as normas da ANEEL.</p>
          <p><strong>4. Fidelidade:</strong> Os planos podem possuir cláusulas de fidelidade ou aviso prévio para cancelamento, conforme detalhado no contrato final de adesão.</p>
        </div>
      )
    }
  };

  const currentContent = content[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-900">{currentContent.title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          {currentContent.text}
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium text-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};