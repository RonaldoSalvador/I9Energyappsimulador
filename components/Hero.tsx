import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, DollarSign, LayoutDashboard, Ban } from 'lucide-react';
import { Button } from './ui/Button';
import { BUSINESS_CONFIG } from '../constants/businessConfig';

interface HeroProps {
  onStart: () => void;
  onPartnerClick?: () => void;
}

const ICONS = {
  CheckCircle2: CheckCircle2,
  DollarSign: DollarSign,
  LayoutDashboard: LayoutDashboard,
  Ban: Ban
};

export const Hero: React.FC<HeroProps> = ({ onStart, onPartnerClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ['clientOffer', 'partnerOffer'] as const;
  const currentConfig = BUSINESS_CONFIG[slides[currentSlide]];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(timer);
  }, []);

  const handleAction = () => {
    if (slides[currentSlide] === 'clientOffer') {
      onStart();
    } else {
      if (onPartnerClick) {
        onPartnerClick();
      } else {
        onStart();
      }
    }
  };

  return (
    <div className="relative overflow-hidden pt-16 pb-20 lg:pt-32 lg:pb-40">

      {/* Background Gradients (Blue/Dark Theme) */}
      <div className="absolute top-0 inset-x-0 h-full w-full -z-20 bg-[#0f172a]">
        {/* Subtle grid pattern or gradient if needed */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#0f172a] to-slate-900 opacity-80"></div>
      </div>

      <div className="absolute -top-20 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] -z-10 animate-float opacity-50"></div>
      <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10 opacity-30" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 relative z-10 transition-all duration-700 ease-in-out">

        <div className="max-w-4xl mx-auto text-center key={currentSlide}">
          {/* Badge Animation */}
          <div className="inline-flex items-center rounded-full bg-slate-800/50 backdrop-blur-md px-4 py-1.5 text-sm font-semibold text-slate-200 shadow-lg border border-white/10 mb-8 hover:border-orange-500/50 hover:text-white transition-all cursor-default animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-energisa-orange mr-2 animate-pulse"></span>
            A revolução da energia solar chegou
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            <span className="relative inline-block group cursor-default">
              {currentConfig.titlePrefix}
            </span>
            {' '}
            <span className="relative inline-block text-energisa-orange group cursor-default">
              {currentConfig.highlight}
            </span>
            {' '}
            <span className="relative inline-block group cursor-default">
              {currentConfig.titleSuffix}
            </span>
          </h1>

          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            {currentConfig.descriptionPrefix} <span className="font-bold text-energisa-orange">{currentConfig.descriptionHighlight}</span> {currentConfig.description.replace(currentConfig.descriptionHighlight || '', '')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
            <Button onClick={handleAction} className="text-lg px-10 py-5 min-w-[240px] shadow-2xl shadow-orange-500/20 transition-all hover:scale-105">
              {currentConfig.buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-700">
            <p className="text-sm text-slate-400 font-medium mb-4">
              <span className="text-energisa-orange font-bold">Gratuito</span> e leva menos de 1 minuto
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-energisa-orange' : 'w-2 bg-slate-600 hover:bg-slate-500'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-12 border-t border-white/5 pt-10 animate-in fade-in zoom-in duration-700 delay-700">
            {currentConfig.badges.map((badge, index) => {
              const Icon = ICONS[badge.iconName] || CheckCircle2;
              return (
                <div key={index} className="flex items-center text-slate-300 font-semibold bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="p-1 bg-green-500/20 rounded-full mr-2">
                    <Icon className="h-4 w-4 text-i9-green" />
                  </div>
                  {badge.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};