import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Preciso instalar painéis solares no meu telhado?",
      answer: "Não! Essa é a grande vantagem da assinatura. A energia é gerada em nossas fazendas solares e injetada na rede da distribuidora, que abate o valor na sua conta através de créditos."
    },
    {
      question: "Existe custo de adesão ou fidelidade?",
      answer: "Zero custo de adesão. A fidelidade varia conforme o plano promocional, mas em geral trabalhamos com contratos flexíveis onde você só precisa avisar com antecedência caso queira cancelar."
    },
    {
      question: "Vou continuar recebendo conta da Energisa?",
      answer: "Sim. A conta da Energisa continuará chegando com as taxas mínimas obrigatórias (iluminação pública e custo de disponibilidade). O consumo de energia será abatido pelos créditos da i9, e você pagará a assinatura da i9 separadamente, resultando em um total menor."
    },
    {
      question: "E se a energia acabar? De quem é a responsabilidade?",
      answer: "A entrega física da energia continua sendo responsabilidade da Energisa. Nós apenas injetamos os créditos financeiros. Se faltar luz na sua rua, o procedimento é o mesmo: ligar para a Energisa."
    },
    {
      question: "O desconto é garantido?",
      answer: "Sim. O desconto é aplicado sobre a tarifa da energia compensada. Se a tarifa da Energisa subir, o valor do seu crédito sobe junto, mantendo sua economia proporcional."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="ajuda" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Dúvidas Frequentes</h2>
          <p className="text-slate-600">Tudo o que você precisa saber antes de assinar.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-200"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold text-slate-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="text-energisa-orange" size={20} />
                ) : (
                  <ChevronDown className="text-slate-400" size={20} />
                )}
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-slate-600 leading-relaxed text-sm border-t border-slate-100 pt-4">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};