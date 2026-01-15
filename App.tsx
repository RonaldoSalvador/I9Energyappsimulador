import React, { useRef, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Simulator } from './components/Simulator';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { CookieConsent } from './components/CookieConsent';
import { LegalModal, LegalContentType } from './components/LegalModal';
import { Dashboard } from './components/Dashboard'; // Import Dashboard
import { AdminDashboard } from './components/AdminDashboard';
import { ShieldCheck, Zap, LineChart } from 'lucide-react';
import { supabase } from './services/supabase';
import { Preloader } from './components/Preloader';
import { PartnerModal } from './components/PartnerModal';

import { ASSETS } from './constants/assets';

function App() {
   const [isLoading, setIsLoading] = useState(true);
   const simulatorRef = useRef<HTMLDivElement>(null);
   const howItWorksRef = useRef<HTMLElement>(null);
   const testimonialsRef = useRef<HTMLElement>(null);
   const faqRef = useRef<HTMLElement>(null);
   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
   const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
   const [isLoggedIn, setIsLoggedIn] = useState(false); // Auth State
   const [isAdmin, setIsAdmin] = useState(false);
   const [legalModalType, setLegalModalType] = useState<LegalContentType>(null);

   const scrollToSection = (sectionId: string) => {
      const refs: Record<string, React.RefObject<HTMLElement | null>> = {
         'simulator': simulatorRef,
         'como-funciona': howItWorksRef,
         'depoimentos': testimonialsRef,
         'ajuda': faqRef
      };

      const ref = refs[sectionId];
      if (ref && ref.current) {
         ref.current.scrollIntoView({ behavior: 'smooth' });
      }
   };
   // ... (omitted methods checkIsAdmin, handleUserAuth, useEffect)

   // ... (render logic) ...

   // Modals
   /* ... LoginModal Logic ... */

   // If Logged In, Render Dashboard
   if (isLoggedIn) {
      // ... existing dashboard logic
   }

   return (
      <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-50 relative overflow-x-hidden">
         {isLoading && <Preloader onFinish={() => setIsLoading(false)} />}

         {/* Global Ambient Background Effects */}
         <div className="fixed inset-0 z-0 pointer-events-none hidden md:block">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-energisa-orange/10 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
         </div>

         <div className="relative z-10 flex flex-col min-h-screen">
            <Header
               onNavigate={scrollToSection}
               onLoginClick={() => setIsLoginModalOpen(true)}
            />

            <main className="flex-grow">
               <Hero
                  onStart={() => scrollToSection('simulator')}
                  onPartnerClick={() => setIsPartnerModalOpen(true)}
               />

               {/* Simulator Section */}
               {/* ... */}
            </main>

            {/* Modals */}
            <LoginModal
               isOpen={isLoginModalOpen}
               onClose={() => setIsLoginModalOpen(false)}
               onLoginSuccess={(user) => {
                  /* ... existing login success logic ... */
               }}
            />

            <PartnerModal
               isOpen={isPartnerModalOpen}
               onClose={() => setIsPartnerModalOpen(false)}
            />

            <LegalModal
               type={legalModalType}
               onClose={() => setLegalModalType(null)}
            />

            {/* Compliance */}
            <CookieConsent />
         </div>
      </div>
   );
}

export default App;