import React from 'react';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import { LegalContentType } from './LegalModal';

interface FooterProps {
  onOpenLegal: (type: LegalContentType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {

  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Column */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-white rounded-xl p-4 inline-block">
                <img
                  src="/i9-logo.png"
                  alt="i9 Energy Logo"
                  className="h-20 w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Democratizando o acesso à energia renovável no Brasil. Economia para você, sustentabilidade para o planeta.
            </p>

          </div>

          {/* Links Column */}
          <div>
            <h5 className="text-white font-bold mb-6">Institucional</h5>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Imprensa</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Investidores</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h5 className="text-white font-bold mb-6">Legal</h5>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-white transition-colors text-left">
                  Termos de Uso
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-white transition-colors text-left">
                  Política de Privacidade
                </button>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">Regulamentação ANEEL 14.300</a></li>

            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h5 className="text-white font-bold mb-6">Atendimento</h5>
            <ul className="space-y-3 text-sm">

              <li className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase">Suporte ao Cliente</span>
                <span className="text-white font-medium hover:text-energisa-orange transition-colors cursor-pointer">(31) 99398-8889</span>
                <span className="text-sm text-slate-400 mt-1">suporte@i9energy.com.br</span>
              </li>
              <li className="mt-4">
                <span className="block text-xs text-slate-500 mb-1">Horário de Atendimento</span>
                Seg à Sex, das 08h às 18h
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} i9 Energy Soluções S.A.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="flex items-center"><div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div> Sistema Operacional</span>
          </div>
        </div>
      </div>
    </footer>
  );
};