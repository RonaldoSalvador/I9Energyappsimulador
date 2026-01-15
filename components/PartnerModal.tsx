import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { supabase } from '../services/supabase';

interface PartnerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PartnerModal: React.FC<PartnerModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const { error: dbError } = await supabase
                .from('partnership_leads')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.company || null,
                    status: 'pending'
                }]);

            if (dbError) {
                console.error('Error saving partner lead:', dbError);
                setError('Não foi possível salvar. Tente novamente.');
                setIsSubmitting(false);
                return;
            }

            setIsSubmitting(false);
            setSubmitted(true);
        } catch (err) {
            console.error('Error:', err);
            setError('Erro de conexão. Tente novamente.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Seja um Parceiro i9</h2>
                        <p className="text-slate-400">
                            Indique clientes, acompanhe o status e ganhe bônus por cada contrato fechado.
                        </p>
                    </div>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg text-sm">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-energisa-orange/50"
                                    placeholder="Ex: João Silva"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Nome da Empresa (Opcional)</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-energisa-orange/50"
                                    placeholder="Ex: JS Contabilidade"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Email Profissional</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-energisa-orange/50"
                                    placeholder="seu@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">WhatsApp</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-energisa-orange/50"
                                    placeholder="(00) 00000-0000"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                className="mt-6 font-bold text-lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Enviando...' : 'Quero me Cadastrar'}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send className="text-green-500" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Recebemos seu interesse!</h3>
                            <p className="text-slate-300 mb-6">
                                Nosso time de parcerias entrará em contato em breve pelo WhatsApp para explicar os next steps.
                            </p>
                            <Button onClick={onClose} variant="ghost">
                                Fechar
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
