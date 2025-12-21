import React from 'react';
import { ArrowRight, CheckCircle2, Sun, Zap } from 'lucide-react';
import { Button } from './ui/Button';

import { SnowEffect } from './SnowEffect';
import { Countdown } from './Countdown';

import { ASSETS } from '../constants/assets';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden pt-16 pb-20 lg:pt-32 lg:pb-40">

      {/* Snow Effect - Behind content but visible */}
      <SnowEffect />

      {/* User's Christmas Border (Top) - Restored & Fixed */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        <img
          src={ASSETS.CHRISTMAS.BORDER_TOP}
          alt="Borda de Natal"
          className="w-full h-full object-cover opacity-100 drop-shadow-2xl"
        />
      </div>



      {/* User's Red Background Image */}
      <div className="absolute top-0 inset-x-0 h-full w-full -z-20">
        <img
          src={ASSETS.CHRISTMAS.HERO_BG}
          alt="Christmas Background"
          className="w-full h-full object-cover opacity-100" // Opacity can be adjusted if too bright
        />
        {/* Optional Dark Overlay for Text Readability if needed */}
        <div className="absolute inset-x-0 top-0 h-full w-full bg-black/40"></div>
      </div>
      <div className="absolute -top-20 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] -z-10 animate-float opacity-50"></div>
      <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10 opacity-30" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 relative z-10">

        <div className="max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center rounded-full bg-slate-800/50 backdrop-blur-md px-4 py-1.5 text-sm font-semibold text-slate-200 shadow-lg border border-white/10 mb-8 hover:border-orange-500/50 hover:text-white transition-all cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-energisa-orange mr-2 animate-pulse"></span>
            A revolução da energia solar chegou
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            <span className="relative inline-block group cursor-default">
              Economize
              {/* Espaço para enfeite 1 */}
            </span>
            {' '}
            <span className="relative inline-block text-energisa-orange group cursor-default">
              60% neste Natal

            </span>
            {' '}
            <span className="relative inline-block group cursor-default">
              na sua conta de luz
            </span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Promoção exclusiva de Dezembro! Garanta <span className="font-bold text-energisa-orange">60% de desconto</span> na sua fatura agora. Nos outros meses, você continua economizando 30% garantidos. Sem obras, sem instalação e 100% digital.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Button onClick={onStart} className="text-lg px-10 py-5 min-w-[240px] shadow-2xl shadow-orange-500/20">
              Simular Economia
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="mb-12">
            <p className="text-sm text-slate-400 font-medium mb-4">
              <span className="text-energisa-orange font-bold">Gratuito</span> e leva menos de 1 minuto
            </p>
            <Countdown targetDate={`${new Date().getFullYear()}-12-31T23:59:59`} />
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