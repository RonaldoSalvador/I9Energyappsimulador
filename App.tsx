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
import { MusicPlayer } from './components/MusicPlayer';
import { supabase } from './services/supabase';
import { Preloader } from './components/Preloader';

import { ASSETS } from './constants/assets';

function App() {
   const [isLoading, setIsLoading] = useState(true);
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

   const checkIsAdmin = async (email: string) => {
      if (email.includes('@i9energy.com')) return true; // Legacy support + internal domain
      const { data } = await supabase.from('admin_whitelist').select('id').eq('email', email).single();
      return !!data;
   };

   const handleUserAuth = async (user: any) => {
      setIsLoggedIn(true);
      if (user.email) {
         const isAdminUser = await checkIsAdmin(user.email);
         setIsAdmin(isAdminUser);
      }
   };

   // SESSION RESTORATION & AUTH LISTENER
   React.useEffect(() => {
      // 1. Check active session on load
      supabase.auth.getSession().then(({ data: { session } }) => {
         if (session?.user) {
            handleUserAuth(session.user);
         }
      });

      // 2. Listen for auth changes (login, logout, refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
         if (session?.user) {
            handleUserAuth(session.user);
         } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
         }
      });

      return () => subscription.unsubscribe();
   }, []);

   // ... (render logic) ...

   // Modals
   <LoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setIsLoginModalOpen(false)}
      onLoginSuccess={async (user) => {
         setIsLoggedIn(true);
         if (user && user.email) {
            const isAdminUser = await checkIsAdmin(user.email);
            setIsAdmin(isAdminUser);
            if (isAdminUser) {
               console.log("Admin Access Granted for:", user.email);
            } else {
               console.warn("User logged in but is NOT an admin:", user.email);
               alert("Acesso restrito. Entre em contato com o suporte para solicitar acesso.");
            }
         }
      }}
   />

   // If Logged In, Render Dashboard
   // ONLY Admin Dashboard is enabled now.
   if (isLoggedIn) {
      if (isAdmin) {
         return <AdminDashboard onLogout={async () => {
            await supabase.auth.signOut();
            setIsLoggedIn(false);
            setIsAdmin(false);
         }} />;
      } else {
         // If logged in but not admin, force logout or show access denied.
         // For UX, we just logout and maybe alert (handled in LoginModal)
         setIsLoggedIn(false);
         return null; // Should trigger re-render
      }
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
               <Hero onStart={() => scrollToSection('simulator')} />

               {/* Simulator Section */}
               <section ref={simulatorRef} id="simulator" className="py-16 relative scroll-mt-20">
                  <div className="container mx-auto px-4">
                     <div className="flex flex-col lg:flex-row gap-12 items-start">

                        {/* Left Side: Value Props for Desktop */}
                        <div className="hidden lg:block lg:w-1/3 pt-8">
                           <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-green-400">
                              Por que escolher a i9 Energy?
                           </h3>
                           <div className="space-y-8">
                              {/* Item 1: Security (Gold/Red) */}
                              <div className="flex gap-4 group">
                                 <div className="bg-red-900/30 p-3 rounded-xl h-fit border border-red-500/30 group-hover:bg-red-900/50 transition-colors">
                                    <ShieldCheck className="text-red-400" size={24} />
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-lg text-white group-hover:text-red-300 transition-colors">Garantia Blindada</h4>
                                    <p className="text-slate-400 leading-relaxed text-sm">Parceiro oficial (re)energisa. Segurança total para seu contrato.</p>
                                 </div>
                              </div>

                              {/* Item 2: Clean Energy (Green/Trees) */}
                              <div className="flex gap-4 group">
                                 <div className="bg-green-900/30 p-3 rounded-xl h-fit border border-green-500/30 group-hover:bg-green-900/50 transition-colors">
                                    <Zap className="text-green-400" size={24} />
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-lg text-white group-hover:text-green-300 transition-colors">100% Renovável</h4>
                                    <p className="text-slate-400 leading-relaxed text-sm">Energia solar limpa. Ajude o planeta enquanto economiza.</p>
                                 </div>
                              </div>

                              {/* Item 3: Economy (Gold/Star) */}
                              <div className="flex gap-4 group">
                                 <div className="bg-amber-900/30 p-3 rounded-xl h-fit border border-amber-500/30 group-hover:bg-amber-900/50 transition-colors">
                                    <LineChart className="text-amber-400" size={24} />
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors">Economia Inteligente</h4>
                                    <p className="text-slate-400 leading-relaxed text-sm">Algoritmo otimizado pela ANEEL. Pague menos, ganhe mais.</p>
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
                     // SECURITY UPDATE:
                     // 1. Check if email is from the internal domain (@i9energy.com)
                     // 2. OR Check if email is in the 'admin_whitelist' table (handled by checkIsAdmin)

                     checkIsAdmin(user.email).then(isAdminUser => {
                        setIsAdmin(isAdminUser);
                        if (isAdminUser) {
                           console.log("Admin Access Granted");
                        } else {
                           console.warn("User logged in but is NOT an admin");
                        }
                     });
                  }
               }}
            />

            <LegalModal
               type={legalModalType}
               onClose={() => setLegalModalType(null)}
            />

            {/* Compliance */}
            <CookieConsent />

            {/* Christmas Music Player */}
            <MusicPlayer src={ASSETS.CHRISTMAS.MUSIC_THEME} />
         </div>
      </div>
   );
}

export default App;