import React from 'react';
import { MousePointerClick, FileSearch, PenTool, PiggyBank } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <MousePointerClick size={28} />,
      title: "1. Simulação Rápida",
      description: "Informe o valor da sua conta e descubra seu potencial de economia em segundos."
    },
    {
      icon: <FileSearch size={28} />,
      title: "2. Análise Gratuita",
      description: "Nossa tecnologia valida seu perfil junto à distribuidora automaticamente."
    },
    {
      icon: <PenTool size={28} />,
      title: "3. Ativação Digital",
      description: "Assine o termo de adesão pelo WhatsApp. Sem burocracia, sem cartório."
    },
    {
      icon: <PiggyBank size={28} />,
      title: "4. Economia Garantida",
      description: "Receba o crédito na sua fatura da Energisa e pague menos todo mês."
    }
  ];

  return (
    <section id="como-funciona" className="py-24 bg-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-energisa-orange font-bold tracking-wider uppercase text-sm mb-2 block">Processo Simplificado</span>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Como funciona a Energia por Assinatura?</h2>
          <p className="text-xl text-slate-600 font-light">
            É como um streaming. Nós produzimos a energia limpa e enviamos para sua casa pela rede da concessionária.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-slate-200 to-transparent -z-10"></div>
              )}
              
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 h-full flex flex-col items-center text-center hover:-translate-y-2 group-hover:border-orange-100">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-50 group-hover:scale-110 transition-transform duration-300 text-energisa-orange">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 text-base leading-relaxed font-medium text-opacity-80">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};