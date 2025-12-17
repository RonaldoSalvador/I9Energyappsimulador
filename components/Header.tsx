import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/Button';
import logo from '../assets/i9-logo.png';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onLoginClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-4 h-28 flex items-center justify-between relative z-50 bg-inherit">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer group py-2"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src={logo}
            alt="i9 Energy Logo"
            className="h-24 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-10">
          <button onClick={() => handleNavClick('como-funciona')} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Como funciona
          </button>
          <button onClick={() => handleNavClick('depoimentos')} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Depoimentos
          </button>
          <button onClick={() => handleNavClick('ajuda')} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Ajuda
          </button>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button variant="ghost" onClick={onLoginClick} className="text-energisa-orange hover:bg-orange-500/10 hover:text-orange-400 font-bold border border-transparent hover:border-orange-500/30">
            Sou Consultor
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown with Smooth Transitions */}
      <div
        className={`md:hidden absolute top-28 left-0 w-full bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300 ease-in-out origin-top ${isMobileMenuOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
      >
        <div className="flex flex-col p-6 space-y-4">
          <button
            onClick={() => handleNavClick('como-funciona')}
            className="text-left py-3 px-2 font-medium text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
          >
            Como funciona
          </button>
          <button
            onClick={() => handleNavClick('depoimentos')}
            className="text-left py-3 px-2 font-medium text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
          >
            Depoimentos
          </button>
          <button
            onClick={() => handleNavClick('ajuda')}
            className="text-left py-3 px-2 font-medium text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
          >
            Ajuda
          </button>
          <div className="pt-4 border-t border-white/10">
            <Button fullWidth variant="primary" onClick={() => { setIsMobileMenuOpen(false); onLoginClick(); }} className="justify-center font-bold shadow-lg shadow-orange-500/20">
              Sou Consultor
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};