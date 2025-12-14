import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('i9-cookie-consent');
    if (!consent) {
      // Small delay to not overwhelm user immediately
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('i9-cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 p-4 md:p-6 animate-in slide-in-from-bottom-full duration-500">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 pr-8">
          <p className="text-sm text-slate-600">
            Nós utilizamos cookies para melhorar sua experiência de navegação e analisar o tráfego do site. 
            Ao continuar navegando, você concorda com nossa <span className="font-semibold text-slate-900">Política de Privacidade</span>.
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button onClick={handleAccept} className="whitespace-nowrap w-full md:w-auto text-sm py-2">
            Aceitar e Fechar
          </Button>
          <button 
            onClick={() => setIsVisible(false)} 
            className="md:hidden text-slate-400 p-2"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};