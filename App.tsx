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

function App() {
   const simulatorRef = useRef<HTMLDivElement>(null);
   const howItWorksRef = useRef<HTMLElement>(null);
   const testimonialsRef = useRef<HTMLElement>(null);
   const faqRef = useRef<HTMLElement>(null);

   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
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

   // If Logged In, Render Dashboard instead of Landing Page
   if (isLoggedIn) {
      if (isAdmin) {
         return <AdminDashboard onLogout={() => { setIsLoggedIn(false); setIsAdmin(false); }} />;
      }
      return <Dashboard onLogout={() => setIsLoggedIn(false)} />;
   }

   return (
      <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-50 relative overflow-x-hidden">
         {/* Global Ambient Background Effects */}
         <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-energisa-orange/10 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
         </div>

         <div className="relative z-10 flex flex-col min-h-screen">
            <Header
               onNavigate={scrollToSection}
               onLoginClick={() => setIsLoginModalOpen(true)}
            />

            <main className="flex-grow">
               <Hero onStart={() => scrollToSection('simulator')} />

               {/* Simulator Section */}
               <section ref={simulatorRef} id="simulator" className="py-16 relative scroll-mt-20">
                  <div className="container mx-auto px-4">
                     <div className="flex flex-col lg:flex-row gap-12 items-start">

                        {/* Left Side: Value Props for Desktop */}
                        <div className="hidden lg:block lg:w-1/3 pt-8">
                           <h3 className="text-2xl font-bold mb-6">Por que escolher a i9 Energy?</h3>
                           <div className="space-y-8">
                              <div className="flex gap-4">
                                 <div className="bg-orange-100 p-3 rounded-xl h-fit">
                                    <ShieldCheck className="text-energisa-orange" size={24} />
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-lg text-white">Garantia de Grupo Forte</h4>
                                    <p className="text-slate-400 leading-relaxed">Parceiro oficial (re)energisa, trazendo segurança e solidez para o seu contrato.</p>
                                 </div>
                              </div>
                              <div className="flex gap-4">
                                 <div className="bg-orange-500/10 p-3 rounded-xl h-fit border border-orange-500/20">
                                    <Zap className="text-energisa-orange" size={24} />
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-lg text-white">Energia Limpa</h4>
                                    <p className="text-slate-400 leading-relaxed">Sua energia vem de fazendas solares auditadas. 100% renovável e sustentável.</p>
                                 </div>
                              </div>
                              <div className="flex gap-4">
                                 <div className="bg-orange-500/10 p-3 rounded-xl h-fit border border-orange-500/20">
                                    <LineChart className="text-energisa-orange" size={24} />
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-lg text-white">Economia Inteligente</h4>
                                    <p className="text-slate-400 leading-relaxed">Nosso algoritmo considera todas as variáveis da ANEEL para garantir que você pague menos.</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Right/Center: The Simulator */}
                        <div className="w-full lg:w-2/3">
                           <Simulator onOpenLegal={setLegalModalType} />
                        </div>
                     </div>
                  </div>
               </section>

               {/* Content Sections */}
               <div ref={howItWorksRef as React.RefObject<HTMLDivElement>}>
                  <HowItWorks />
               </div>

               <div ref={testimonialsRef as React.RefObject<HTMLDivElement>}>
                  <Testimonials />
               </div>

               <div ref={faqRef as React.RefObject<HTMLDivElement>}>
                  <FAQ />
               </div>

               <Footer onOpenLegal={setLegalModalType} />
            </main>

            {/* Modals */}
            <LoginModal
               isOpen={isLoginModalOpen}
               onClose={() => setIsLoginModalOpen(false)}
               onLoginSuccess={(user) => {
                  setIsLoggedIn(true);
                  // Check if user is admin (simple check effectively for now, better checks later)
                  // For MVP: if Supabase user exists (user object present), treat as Admin or check email
                  if (user && user.email) {
                     console.log("Logged in as:", user.email);
                     setIsAdmin(true); // Assuming any real logged in user is part of the "team" for now
                  }
               }}
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