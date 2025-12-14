import React from 'react';
import { Star, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: "Carlos Mendes",
      role: "Comerciante em Ubá/MG",
      text: "Eu não acreditava que fosse tão simples. Fiz o cadastro pelo celular e na conta seguinte já veio o desconto de R$ 180,00. Para quem tem comércio, faz muita diferença no final do ano.",
      rating: 5
    },
    {
      name: "Fernanda Oliveira",
      role: "Residencial em João Pessoa/PB",
      text: "O atendimento da i9 foi excelente. Tiraram todas as minhas dúvidas sobre a lei da energia solar e me senti segura. Economizo cerca de 15% todo mês sem ter gastado nada.",
      rating: 5
    },
    {
      name: "Ricardo Santos",
      role: "Pequena Indústria em Cuiabá/MT",
      text: "Já tentei instalar painéis, mas o investimento era muito alto. Com a assinatura, consegui o benefício da energia limpa imediatamente. Recomendo demais!",
      rating: 5
    }
  ];

  return (
    <section id="depoimentos" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Quem assina, recomenda</h2>
          <p className="text-xl text-slate-600 font-light">Junte-se a milhares de brasileiros que já economizam com a i9 Energy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-8 right-8 text-orange-100">
                <Quote size={64} fill="currentColor" />
              </div>
              
              <div className="flex space-x-1 text-yellow-400 mb-6 relative z-10">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" className="drop-shadow-sm" />
                ))}
              </div>
              
              <p className="text-slate-700 leading-relaxed mb-8 relative z-10 font-medium">"{review.text}"</p>
              
              <div className="flex items-center pt-6 border-t border-slate-100">
                 <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 mr-4">
                    {review.name.charAt(0)}
                 </div>
                 <div>
                    <p className="font-bold text-slate-900">{review.name}</p>
                    <p className="text-xs text-energisa-orange font-semibold uppercase tracking-wide">{review.role}</p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};