import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Link, Copy, CheckCircle, Clock, XCircle, LogOut, DollarSign, Users, TrendingUp } from 'lucide-react';
import { Button } from './ui/Button';

interface PartnerDashboardProps {
    partnerEmail: string;
    onLogout: () => void;
}

interface PartnerData {
    id: string;
    name: string;
    email: string;
    referral_code: string;
    total_referrals: number;
    total_bonus: number;
}

interface LeadReferral {
    id: string;
    name: string;
    created_at: string;
    status: string;
    bill_value: number;
}

export const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ partnerEmail, onLogout }) => {
    const [partner, setPartner] = useState<PartnerData | null>(null);
    const [referrals, setReferrals] = useState<LeadReferral[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchPartnerData();
    }, [partnerEmail]);

    const fetchPartnerData = async () => {
        setLoading(true);
        try {
            // Fetch partner info
            const { data: partnerData, error: partnerError } = await supabase
                .from('partners')
                .select('*')
                .eq('email', partnerEmail)
                .single();

            if (partnerError) throw partnerError;
            setPartner(partnerData);

            // Fetch referrals for this partner
            if (partnerData?.referral_code) {
                const { data: leadsData, error: leadsError } = await supabase
                    .from('leads')
                    .select('id, name, created_at, status, bill_value')
                    .eq('referral_id', partnerData.referral_code)
                    .order('created_at', { ascending: false });

                if (!leadsError) {
                    setReferrals(leadsData || []);
                }
            }
        } catch (error) {
            console.error('Error fetching partner data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getReferralLink = () => {
        if (!partner?.referral_code) return '';
        return `${window.location.origin}/?parceiro=${partner.referral_code}`;
    };

    const copyLink = () => {
        navigator.clipboard.writeText(getReferralLink());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'contract_signed':
                return <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">Fechado</span>;
            case 'contacted':
                return <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Em Negociação</span>;
            case 'lost':
                return <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">Perdido</span>;
            default:
                return <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Novo</span>;
        }
    };

    const closedDeals = referrals.filter(r => r.status === 'contract_signed').length;
    const bonusPerDeal = 50; // R$ 50 por contrato fechado
    const estimatedBonus = closedDeals * bonusPerDeal;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Carregando seu painel...</p>
                </div>
            </div>
        );
    }

    if (!partner) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Acesso Não Autorizado</h2>
                    <p className="text-slate-400 mb-6">Você ainda não foi aprovado como parceiro.</p>
                    <Button onClick={onLogout}>Voltar ao Início</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] font-sans text-slate-100">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
            </div>

            {/* Header */}
            <header className="relative z-50 bg-slate-900/50 backdrop-blur-md border-b border-white/5 sticky top-0">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl">
                            <Users className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Painel do Parceiro</h1>
                            <p className="text-sm text-slate-400">Olá, {partner.name}!</p>
                        </div>
                    </div>
                    <Button onClick={onLogout} variant="ghost" className="text-slate-400 hover:text-white">
                        <LogOut size={16} className="mr-2" />
                        Sair
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-6 py-10 relative z-10">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                <Users size={24} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white">{referrals.length}</h3>
                        <p className="text-slate-400">Total de Indicações</p>
                    </div>

                    <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                                <CheckCircle size={24} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white">{closedDeals}</h3>
                        <p className="text-slate-400">Contratos Fechados</p>
                    </div>

                    <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                                <DollarSign size={24} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white">R$ {estimatedBonus.toFixed(2)}</h3>
                        <p className="text-slate-400">Bônus Acumulado</p>
                    </div>
                </div>

                {/* Referral Link */}
                <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-2xl p-6 mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Link className="text-green-400" size={24} />
                        <h2 className="text-xl font-bold text-white">Seu Link de Indicação</h2>
                    </div>
                    <p className="text-slate-300 mb-4">Compartilhe este link com seus contatos. Quando eles simularem a economia, você receberá o crédito!</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            readOnly
                            value={getReferralLink()}
                            className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm"
                        />
                        <Button onClick={copyLink} className={copied ? 'bg-green-600' : ''}>
                            {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                            <span className="ml-2">{copied ? 'Copiado!' : 'Copiar'}</span>
                        </Button>
                    </div>
                </div>

                {/* Referrals List */}
                <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5">
                        <h2 className="text-xl font-bold text-white">Suas Indicações</h2>
                        <p className="text-slate-400 text-sm">Acompanhe o status de cada cliente que você indicou</p>
                    </div>

                    {referrals.length === 0 ? (
                        <div className="text-center py-16">
                            <TrendingUp className="mx-auto text-slate-600 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-slate-300 mb-2">Nenhuma indicação ainda</h3>
                            <p className="text-slate-500">Compartilhe seu link e comece a ganhar!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-slate-500 font-semibold">
                                        <th className="px-6 py-4">Data</th>
                                        <th className="px-6 py-4">Cliente</th>
                                        <th className="px-6 py-4">Valor Conta</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Bônus</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {referrals.map((ref) => (
                                        <tr key={ref.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-400">
                                                {new Date(ref.created_at).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-white">{ref.name}</td>
                                            <td className="px-6 py-4 text-slate-300">
                                                R$ {ref.bill_value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                                            </td>
                                            <td className="px-6 py-4">{getStatusBadge(ref.status)}</td>
                                            <td className="px-6 py-4">
                                                {ref.status === 'contract_signed' ? (
                                                    <span className="text-green-400 font-bold">R$ {bonusPerDeal.toFixed(2)}</span>
                                                ) : (
                                                    <span className="text-slate-500">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
