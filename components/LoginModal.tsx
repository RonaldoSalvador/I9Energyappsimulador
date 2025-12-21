import React, { useState } from 'react';
import { X, Loader2, ArrowRight, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { supabase } from '../services/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user?: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [view, setView] = useState<'login' | 'recruitment'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Recruitment State
  const [recruitmentData, setRecruitmentData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    message: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        onLoginSuccess(data.user);
        onClose();
        return;
      }

      if (error) {
        if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('@i9energy')) {
          alert(`Erro ao entrar: ${error.message}`);
          setIsLoading(false);
          return;
        }

        if (error.message.includes('Invalid login credentials')) {
          console.warn("Invalid credentials");
          alert("Email ou senha incorretos.");
          setIsLoading(false);
          return;
        }

        throw error;
      }

    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro ao tentar entrar.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecruitmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let resumeUrl = null;

      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        // Upload to 'resumes' bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, resumeFile);

        if (uploadError) {
          console.error("Upload Error:", uploadError);
          // Proceeding without resume URL if upload fails, or we could block.
          // For now, let's alert but proceed if possible, or just log.
          // alert(`Erro ao enviar arquivo: ${uploadError.message}`);
        } else if (uploadData) {
          const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(fileName);
          resumeUrl = publicUrl;
        }
      }

      const { error } = await supabase
        .from('candidates')
        .insert([{
          name: recruitmentData.name,
          email: recruitmentData.email,
          whatsapp: recruitmentData.whatsapp,
          message: recruitmentData.message,
          resume_url: resumeUrl
        }]);

      if (error) throw error;

      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
        setView('login');
        setRecruitmentData({ name: '', email: '', whatsapp: '', message: '' });
        setResumeFile(null);
      }, 3000);

    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Erro ao enviar candidatura. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            {view === 'recruitment' && (
              <button onClick={() => setView('login')} className="p-1 rounded-full hover:bg-slate-200 transition-colors mr-1">
                <ArrowRight className="rotate-180 text-slate-500" size={16} />
              </button>
            )}
            <h3 className="font-bold text-lg text-slate-900">
              {view === 'login' ? 'Área do Consultor' : 'Seja um Consultor'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {view === 'login' ? (
            // LOGIN FORM
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail ou CPF</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border-slate-600 bg-slate-800 text-white placeholder:text-slate-400 border p-3 focus:ring-2 focus:ring-energisa-orange focus:border-transparent outline-none"
                  placeholder="Digite seu acesso"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700">Senha</label>
                  <a href="#" className="text-xs text-energisa-orange hover:underline">Esqueceu a senha?</a>
                </div>
                <input
                  type="password"
                  required
                  className="w-full rounded-lg border-slate-600 bg-slate-800 text-white placeholder:text-slate-400 border p-3 focus:ring-2 focus:ring-energisa-orange focus:border-transparent outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" fullWidth disabled={isLoading || !email || !password}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Acessando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            // RECRUITMENT FORM
            successMessage ? (
              <div className="text-center py-8 animate-in fade-in zoom-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="text-green-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Candidatura Enviada!</h3>
                <p className="text-slate-600 text-sm">
                  Um administrador irá analisar seus dados e entrar em contato em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRecruitmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 border p-3 focus:ring-2 focus:ring-energisa-orange focus:border-transparent outline-none"
                    placeholder="Seu nome"
                    value={recruitmentData.name}
                    onChange={(e) => setRecruitmentData({ ...recruitmentData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    required
                    className="w-full rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 border p-3 focus:ring-2 focus:ring-energisa-orange focus:border-transparent outline-none"
                    placeholder="seu@email.com"
                    value={recruitmentData.email}
                    onChange={(e) => setRecruitmentData({ ...recruitmentData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    required
                    className="w-full rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 border p-3 focus:ring-2 focus:ring-energisa-orange focus:border-transparent outline-none"
                    placeholder="(00) 00000-0000"
                    value={recruitmentData.whatsapp}
                    onChange={(e) => setRecruitmentData({ ...recruitmentData, whatsapp: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Currículo (PDF/Doc)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="w-full rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 border p-3 focus:ring-2 focus:ring-energisa-orange focus:border-transparent outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-energisa-orange hover:file:bg-orange-100"
                    onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Resumo de Experiência</label>
                  <textarea
                    className="w-full rounded-lg border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 border p-3 focus:ring-2 focus:ring-energisa-orange focus:border-transparent outline-none resize-none h-24"
                    placeholder="Conte um pouco sobre você..."
                    value={recruitmentData.message}
                    onChange={(e) => setRecruitmentData({ ...recruitmentData, message: e.target.value })}
                  ></textarea>
                </div>
                <Button type="submit" fullWidth disabled={isLoading}>
                  {isLoading ? 'Enviando...' : 'Enviar Candidatura'}
                </Button>
              </form>
            )
          )}

          {view === 'login' && (
            <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-slate-400">
              <Lock size={12} />
              <span>Ambiente seguro e criptografado</span>
            </div>
          )}
        </div>

        {/* Footer Toggle */}
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100 flex flex-col gap-2">
          {view === 'login' ? (
            <>
              <p className="text-sm text-slate-600">
                Ainda não é um parceiro?
              </p>
              <button
                onClick={() => setView('recruitment')}
                className="text-energisa-orange font-bold hover:underline text-sm block w-full"
              >
                Torne-se um consultor e ganhe até 25% de comissão
              </button>
              <p className="text-xs text-slate-400">Preencha sua ficha agora</p>
            </>
          ) : (
            <p className="text-sm text-slate-600">
              Já tem cadastro? <button onClick={() => setView('login')} className="text-energisa-orange font-bold hover:underline">Fazer Login</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};