import React from 'react';
import { ArrowRight, CheckCircle2, Sun, Zap } from 'lucide-react';
import { Button } from './ui/Button';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden pt-16 pb-20 lg:pt-32 lg:pb-40">

      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-slate-900 via-slate-900 to-transparent -z-10"></div>
      <div className="absolute -top-20 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] -z-10 animate-float opacity-50"></div>
      <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10 opacity-30" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center rounded-full bg-slate-800/50 backdrop-blur-md px-4 py-1.5 text-sm font-semibold text-slate-200 shadow-lg border border-white/10 mb-8 hover:border-orange-500/50 hover:text-white transition-all cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-energisa-orange mr-2 animate-pulse"></span>
            A revolução da energia solar chegou
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.1] drop-shadow-xl">
            Economize até <span className="text-transparent bg-clip-text bg-gradient-to-r from-energisa-orange to-yellow-400">20% na sua conta</span> sem instalar nada.
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Assine energia solar digitalmente. Nós geramos a energia, injetamos na rede da Energisa e você recebe o crédito na fatura. Simples assim.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button onClick={onStart} className="text-lg px-10 py-5 min-w-[240px] shadow-2xl shadow-orange-500/20">
              Simular Economia
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-slate-400 font-medium">
              <span className="text-energisa-orange font-bold">Gratuito</span> e leva menos de 1 minuto
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-12 border-t border-white/5 pt-10">
            <div className="flex items-center text-slate-300 font-semibold bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <div className="p-1 bg-green-500/20 rounded-full mr-2">
                <CheckCircle2 className="h-4 w-4 text-i9-green" />
              </div>
              Sem fidelidade
            </div>
            <div className="flex items-center text-slate-300 font-semibold bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <div className="p-1 bg-green-500/20 rounded-full mr-2">
                <CheckCircle2 className="h-4 w-4 text-i9-green" />
              </div>
              Sem obras
            </div>
            <div className="flex items-center text-slate-300 font-semibold bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <div className="p-1 bg-green-500/20 rounded-full mr-2">
                <CheckCircle2 className="h-4 w-4 text-i9-green" />
              </div>
              100% Digital
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};