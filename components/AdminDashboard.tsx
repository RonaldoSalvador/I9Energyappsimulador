import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { DatabaseLead } from '../types';
import { FileText, Phone, Mail, Calendar, Search, LogOut, Download, Trash2, Filter, FileSpreadsheet, CheckCircle, XCircle, Clock, LayoutDashboard, Link, Copy, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { KanbanBoard, KanbanColumn } from './ui/trello-kanban-board';
import { calculateSavings } from '../services/energyCalculator';
import { PhaseType, Distribuidora } from '../types';

interface AdminDashboardProps {
    onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [leads, setLeads] = useState<DatabaseLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'contacted' | 'contract_signed' | 'lost'>('all');
    const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
    const [activeModule, setActiveModule] = useState<'leads' | 'candidates' | 'team' | 'partners'>('leads');
    const [candidates, setCandidates] = useState<any[]>([]);
    const [partnerLeads, setPartnerLeads] = useState<any[]>([]);

    // Mobile Check
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Pagination State
    const [page, setPage] = useState(0);
    const ROWS_PER_PAGE = 20;
    const [totalLeads, setTotalLeads] = useState(0);

    const [teamMembers, setTeamMembers] = useState<any[]>([]);

    // Modal State for adding new admins
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [newAdminName, setNewAdminName] = useState('');
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [adminToDelete, setAdminToDelete] = useState<string | null>(null);

    // Link Generator State
    const [showLinkGenerator, setShowLinkGenerator] = useState(false);
    const [partnerName, setPartnerName] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');

    const handleGenerateLink = () => {
        if (!partnerName) return;
        // Clean partner name for URL (remove spaces, special chars)
        const cleanName = partnerName.trim().replace(/\s+/g, '_').toLowerCase();
        const link = `${window.location.origin}/?parceiro=${encodeURIComponent(cleanName)}`;
        setGeneratedLink(link);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        alert('Link copiado!');
    };

    useEffect(() => {
        console.log("Admin Dashboard - Component Loaded (V2)");
        if (activeModule === 'leads') fetchLeads();
        if (activeModule === 'candidates') fetchCandidates();
        if (activeModule === 'team') fetchTeam();
        if (activeModule === 'partners') fetchPartnerLeads();
    }, [activeModule, page]);

    const fetchPartnerLeads = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('partnership_leads')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setPartnerLeads(data || []);
        } catch (error) {
            console.error('Error fetching partner leads:', error);
            setPartnerLeads([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePartnerStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('partnership_leads')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', id);
            if (error) throw error;
            setPartnerLeads(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
        } catch (error) {
            console.error('Error updating partner status:', error);
            alert('Erro ao atualizar status');
        }
    };

    const fetchTeam = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('admin_whitelist').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setTeamMembers(data || []);
        } catch (error) {
            console.error('Error fetching team:', error);
            setTeamMembers([]); // No fake data
        } finally {
            setLoading(false);
        }
    };

    const confirmAddAdmin = async (name: string, email: string) => {
        if (!email || !name) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            const { data, error } = await supabase.from('admin_whitelist').insert([{ email, name }]).select();
            if (error) throw error;
            if (data) setTeamMembers(prev => [data[0], ...prev]);
            setShowAddAdminModal(false);
            setNewAdminName('');
            setNewAdminEmail('');
        } catch (error: any) {
            console.error('Error adding admin:', error);
            alert(`Erro ao adicionar: ${error.message || 'Erro desconhecido'}`);
        }
    };

    const handleRemoveAdmin = async (id: string) => {
        try {
            const { error } = await supabase.from('admin_whitelist').delete().eq('id', id);
            if (error) throw error;
            setTeamMembers(prev => prev.filter(m => m.id !== id));
            setAdminToDelete(null); // Close modal
        } catch (error: any) {
            console.error('Error removing admin:', error);
            alert(`Erro ao remover: ${error.message}`);
        }
    };

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('candidates').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setCandidates(data || []);
        } catch (error) {
            console.error('Error fetching candidates:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const from = page * ROWS_PER_PAGE;
            const to = from + ROWS_PER_PAGE - 1;

            const { data, error, count } = await supabase
                .from('leads')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            setLeads(data || []);
            if (count !== null) setTotalLeads(count);

        } catch (error) {
            console.error('Error fetching leads:', error);
            alert('Erro ao carregar leads. Verifique se você está logado.');
        } finally {
            setLoading(false);
        }
    };

    const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setLeadToDelete(id);
    };

    const confirmDeleteLead = async () => {
        if (!leadToDelete) return;

        try {
            const { error } = await supabase.from('leads').delete().eq('id', leadToDelete);
            if (error) throw error;
            setLeads(prev => prev.filter(l => l.id !== leadToDelete));
            setLeadToDelete(null);
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Erro ao excluir');
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', id);
            if (error) throw error;
            setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erro ao atualizar status');
        }
    };

    const [isExporting, setIsExporting] = useState(false);

    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
    const [deleteAllVerification, setDeleteAllVerification] = useState('');

    const handleDeleteAllClick = () => {
        setShowDeleteAllModal(true);
        setDeleteAllVerification('');
    };

    const confirmDeleteAll = async () => {
        if (deleteAllVerification !== 'DELETAR') {
            alert('Por favor, digite "DELETAR" corretamente para confirmar.');
            return;
        }

        try {
            setLoading(true);
            const table = activeModule === 'leads' ? 'leads' : 'candidates';

            // Using a filter effectively "all" with a valid UUID neq check
            // Request count to verify if deletion actually happened
            const { error, count } = await supabase
                .from(table)
                .delete({ count: 'estimated' })
                .neq('id', '00000000-0000-0000-0000-000000000000');

            if (error) throw error;

            console.log(`Deleted ${count} rows from ${table}`);

            if (activeModule === 'leads') {
                setLeads([]);
                setTotalLeads(0);
            } else {
                setCandidates([]);
            }

            // Se count for 0, pode ser que não tinha nada OU que a permissão falhou silenciosamente
            if (count === 0) {
                alert('Nenhum registro foi apagado. O banco de dados já estava vazio ou você precisa atualizar as permissões (SQL).');
            } else {
                // alert(`${activeModule === 'leads' ? 'Leads' : 'Candidatos'} excluídos com sucesso!`);
            }
            setShowDeleteAllModal(false);

        } catch (error: any) {
            console.error('Error deleting all:', error);
            alert(`Erro ao excluir: ${error.message} - Verifique suas permissões.`);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            setIsExporting(true);
            // Fetch all leads without pagination
            const { data: allLeads, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!allLeads || allLeads.length === 0) {
                alert('Nenhum lead encontrado para exportar.');
                return;
            }

            const headers = ['Data', 'Nome', 'Email', 'WhatsApp', 'Distribuidora', 'Fase', 'Valor Conta', 'Status', 'Link Arquivo'];
            const csvContent = [
                headers.join(','),
                ...allLeads.map(lead => [
                    new Date(lead.created_at || '').toLocaleDateString('pt-BR'),
                    `"${lead.name}"`,
                    lead.email || '',
                    lead.whatsapp,
                    lead.distribuidora,
                    lead.phase,
                    lead.bill_value,
                    lead.status,
                    lead.bill_url || ''
                ].join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Optional: Confirm success
            // alert(`${allLeads.length} leads exportados com sucesso!`);

        } catch (error) {
            console.error('Error exporting:', error);
            alert('Erro ao exportar leads. Tente novamente.');
        } finally {
            setIsExporting(false);
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.whatsapp.includes(searchTerm);

        const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]';
            case 'contacted': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.3)]';
            case 'contract_signed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
            case 'lost': return 'bg-slate-700/50 text-slate-400 border-slate-700 shadow-none';
            default: return 'bg-slate-800 text-slate-400';
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] font-sans text-slate-100 overflow-x-hidden selection:bg-energisa-orange/30">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-energisa-orange/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
            </div>

            {/* Header */}
            <header className="relative z-50 bg-slate-900/50 backdrop-blur-md border-b border-white/5 sticky top-0">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-energisa-orange blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-1 rounded-xl shadow-xl transform group-hover:scale-105 transition-transform duration-300 border border-white/10">
                                <img
                                    src="https://lqwywrknndolrxvmyuna.supabase.co/storage/v1/object/sign/arquivos%20da%20empresa/logo%20natal%20para%20tira%20o%20fundo%20fera%20(2).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85Y2EzZmYzMC1jYjNlLTRjZGUtOGM2MC0yYzA2ZGNlODM0ZTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcnF1aXZvcyBkYSBlbXByZXNhL2xvZ28gbmF0YWwgcGFyYSB0aXJhIG8gZnVuZG8gZmVyYSAoMikucG5nIiwiaWF0IjoxNzY2MTgwMjgwLCJleHAiOjIwODE1NDAyODB9.kma_9qGrVRxfkY1Tgd_dLctoIldfjJeXuxuwC9y4VzQ"
                                    alt="Logo"
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Painel do Consultor</h1>
                            <div className="flex space-x-2 mt-1">
                                <button
                                    onClick={() => setActiveModule('leads')}
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${activeModule === 'leads' ? 'bg-energisa-orange text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    Leads
                                </button>
                                <button
                                    onClick={() => setActiveModule('candidates')}
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${activeModule === 'candidates' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    Candidatos
                                </button>
                                <button
                                    onClick={() => setActiveModule('team')}
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${activeModule === 'team' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    Equipe
                                </button>
                                <button
                                    onClick={() => setActiveModule('partners')}
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${activeModule === 'partners' ? 'bg-green-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    Parceiros
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {(activeModule === 'leads' || activeModule === 'candidates') && (
                            <Button
                                onClick={handleDeleteAllClick}
                                variant="outline"
                                className="hidden md:flex text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/50 shadow-lg shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1"
                                title="Apagar todos os registros"
                            >
                                <Trash2 size={18} className="mr-2" />
                                Limpar Tudo
                            </Button>
                        )}
                        <Button
                            onClick={handleExport}
                            disabled={isExporting}
                            variant="outline"
                            className="hidden md:flex text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/50 shadow-lg shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-wait"
                        >
                            <FileSpreadsheet size={18} className={`mr-2 ${isExporting ? 'animate-pulse' : ''}`} />
                            {isExporting ? 'Exportando...' : 'Exportar Excel'}
                        </Button>
                        <Button onClick={() => setShowLinkGenerator(true)} variant="outline" className="flex text-blue-400 border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/50 shadow-lg shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <Link size={18} className="md:mr-2" />
                            <span className="hidden md:inline">Gerar Link</span>
                        </Button>
                        <div className="h-8 w-px bg-white/10 mx-2 hidden md:block"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-white/10 flex items-center justify-center shadow-lg">
                                <span className="text-xs font-bold">AD</span>
                            </div>
                            <Button onClick={onLogout} variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5">
                                <LogOut size={16} className="mr-2" />
                                Sair
                            </Button>
                        </div>
                    </div>
                </div>
            </header >

            <main className="container mx-auto px-6 py-10 relative z-10">
                {/* 3D Stats Row (Visual Only for now) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {[
                        { label: 'Total de Leads', value: leads.length, color: 'from-blue-500 to-indigo-600', icon: Search },
                        { label: 'Novas Oportunidades', value: leads.filter(l => l.status === 'new').length, color: 'from-orange-500 to-red-500', icon: Clock },
                        { label: 'Em Negociação', value: leads.filter(l => l.status === 'contacted').length, color: 'from-yellow-400 to-orange-500', icon: Phone },
                        { label: 'Contratos Fechados', value: leads.filter(l => l.status === 'contract_signed').length, color: 'from-emerald-400 to-green-600', icon: CheckCircle }
                    ].map((stat, i) => (
                        <div key={i} className="relative group perspective">
                            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                            <div className="relative h-full bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-300 transform group-hover:-translate-y-2 group-hover:scale-[1.02] shadow-2xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 text-white shadow-lg`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/5 text-slate-300 border border-white/5">
                                        +5%
                                    </span>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters & Search Bar - Only show for Leads or basic search for candidates */}
                {activeModule === 'leads' && (
                    <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-2 border border-white/5 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                        <div className="flex bg-slate-900/50 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto border border-white/5">
                            {[
                                { id: 'all', label: 'Todos' },
                                { id: 'new', label: 'Novos' },
                                { id: 'contacted', label: 'Negociação' },
                                { id: 'contract_signed', label: 'Fechados' },
                                { id: 'lost', label: 'Perdidos' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setFilterStatus(tab.id as any)}
                                    className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative overflow-hidden ${filterStatus === tab.id
                                        ? 'text-white shadow-lg'
                                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                        }`}
                                >
                                    {filterStatus === tab.id && (
                                        <div className="absolute inset-0 bg-slate-700 rounded-lg shadow-inner border border-white/10"></div>
                                    )}
                                    <span className="relative z-10">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* View Toggle */}
                            <div className="flex bg-slate-900/50 p-1 rounded-lg border border-white/5">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
                                    title="Lista"
                                >
                                    <Filter size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('kanban')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
                                    title="Kanban"
                                >
                                    <LayoutDashboard size={18} />
                                </button>
                            </div>

                            <div className="relative w-full md:w-64 group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-energisa-orange to-emerald-500 rounded-xl blur opacity-25 group-focus-within:opacity-75 transition duration-500"></div>
                                <div className="relative flex items-center">
                                    <Search className="absolute left-4 text-slate-400 group-focus-within:text-white transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Buscar cliente..."
                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:bg-slate-800 transition-all placeholder:text-slate-600"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Content */}
                {
                    activeModule === 'leads' ? (
                        <div className="flex flex-col h-full gap-6">
                            {viewMode === 'kanban' ? (
                                <div className="overflow-x-auto min-h-[600px] animate-in fade-in zoom-in-95 duration-500">
                                    <KanbanBoard
                                        columns={[
                                            {
                                                id: 'new',
                                                title: 'Novos Leads',
                                                tasks: filteredLeads.filter(l => l.status === 'new' || !l.status).map(l => {
                                                    const savings = calculateSavings({ billValue: l.bill_value, phase: l.phase as PhaseType, distribuidora: l.distribuidora as Distribuidora, hasCompetitor: false }).monthlySavings;
                                                    return {
                                                        id: l.id!,
                                                        title: l.name,
                                                        description: `Conta: R$ ${l.bill_value} | Econ: R$ ${savings.toFixed(0)}`,
                                                        labels: [l.distribuidora.split(' ')[0]],
                                                        phone: l.whatsapp,
                                                        email: l.email
                                                    };
                                                })
                                            },
                                            {
                                                id: 'contacted',
                                                title: 'Em Negociação',
                                                tasks: filteredLeads.filter(l => l.status === 'contacted').map(l => {
                                                    const savings = calculateSavings({ billValue: l.bill_value, phase: l.phase as PhaseType, distribuidora: l.distribuidora as Distribuidora, hasCompetitor: false }).monthlySavings;
                                                    return {
                                                        id: l.id!,
                                                        title: l.name,
                                                        description: `Conta: R$ ${l.bill_value} | Econ: R$ ${savings.toFixed(0)}`,
                                                        labels: [l.distribuidora.split(' ')[0]],
                                                        phone: l.whatsapp,
                                                        email: l.email
                                                    };
                                                })
                                            },
                                            {
                                                id: 'contract_signed',
                                                title: 'Fechados',
                                                tasks: filteredLeads.filter(l => l.status === 'contract_signed').map(l => {
                                                    const savings = calculateSavings({ billValue: l.bill_value, phase: l.phase as PhaseType, distribuidora: l.distribuidora as Distribuidora, hasCompetitor: false }).monthlySavings;
                                                    return {
                                                        id: l.id!,
                                                        title: l.name,
                                                        description: `Conta: R$ ${l.bill_value} | Econ: R$ ${savings.toFixed(0)}`,
                                                        labels: [l.distribuidora.split(' ')[0]],
                                                        phone: l.whatsapp,
                                                        email: l.email
                                                    };
                                                })
                                            },
                                            {
                                                id: 'lost',
                                                title: 'Perdidos',
                                                tasks: filteredLeads.filter(l => l.status === 'lost').map(l => {
                                                    const savings = calculateSavings({ billValue: l.bill_value, phase: l.phase as PhaseType, distribuidora: l.distribuidora as Distribuidora, hasCompetitor: false }).monthlySavings;
                                                    return {
                                                        id: l.id!,
                                                        title: l.name,
                                                        description: `Conta: R$ ${l.bill_value} | Econ: R$ ${savings.toFixed(0)}`,
                                                        labels: [l.distribuidora.split(' ')[0]],
                                                        phone: l.whatsapp,
                                                        email: l.email
                                                    };
                                                })
                                            },
                                        ]}
                                        columnColors={{
                                            new: 'bg-blue-500/20',
                                            contacted: 'bg-yellow-500/20',
                                            contract_signed: 'bg-emerald-500/20',
                                            lost: 'bg-slate-700/50'
                                        }}
                                        onTaskMove={(taskId, from, to) => handleStatusUpdate(taskId, to)}
                                        allowAddTask={false}
                                        disableDrag={isMobile}
                                        className="h-full"
                                    />
                                </div>
                            ) : (
                                <div className="relative bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 min-h-[500px]">
                                    {/* Header Gradient Line */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-energisa-orange via-purple-500 to-emerald-500"></div>

                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center h-96 space-y-4">
                                            <div className="w-12 h-12 border-4 border-energisa-orange border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-slate-400 animate-pulse">Carregando oportunidades...</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-slate-500 font-semibold bg-white/[0.02]">
                                                        <th className="px-8 py-6">Cliente</th>
                                                        <th className="px-8 py-6">Contato</th>
                                                        <th className="px-8 py-6">Potencial</th>
                                                        <th className="px-8 py-6">Parceiro</th>
                                                        <th className="px-8 py-6">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {filteredLeads.map((lead, index) => (
                                                        <tr
                                                            key={lead.id}
                                                            className="group hover:bg-white/[0.02] transition-colors relative"
                                                            style={{ animationDelay: `${index * 50}ms` }}
                                                        >
                                                            {/* Name & Date */}
                                                            <td className="px-8 py-5">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-300 font-bold border border-white/5 shadow-inner group-hover:from-energisa-orange group-hover:to-red-500 group-hover:text-white transition-all duration-300">
                                                                        {lead.name.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold text-slate-200 text-base mb-1 group-hover:text-white transition-colors">{lead.name}</div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-white/5">
                                                                                {lead.distribuidora.split(' ')[0]}
                                                                            </span>
                                                                            <span className="text-xs text-slate-500 flex items-center">
                                                                                <Clock size={10} className="mr-1" />
                                                                                {new Date(lead.created_at || '').toLocaleDateString('pt-BR')}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* Contact */}
                                                            <td className="px-8 py-5">
                                                                <div className="space-y-1.5">
                                                                    <a href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center text-sm text-slate-300 hover:text-green-400 transition-colors w-fit group/link">
                                                                        <div className="p-1 rounded bg-green-500/10 mr-2 group-hover/link:bg-green-500/20">
                                                                            <Phone size={12} className="text-green-500" />
                                                                        </div>
                                                                        {lead.whatsapp}
                                                                    </a>
                                                                    {lead.email && (
                                                                        <div className="flex items-center text-sm text-slate-500">
                                                                            <div className="p-1 rounded bg-blue-500/10 mr-2">
                                                                                <Mail size={12} className="text-blue-500" />
                                                                            </div>
                                                                            {lead.email}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>

                                                            {/* Bill Info */}
                                                            <td className="px-8 py-5">
                                                                <div className="flex flex-col items-start gap-1">
                                                                    <span className="font-mono font-bold text-white text-lg tracking-tight">
                                                                        R$ {lead.bill_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                                    </span>

                                                                    {(() => {
                                                                        // Smart Calculation for Admin
                                                                        try {
                                                                            const result = calculateSavings({
                                                                                billValue: lead.bill_value,
                                                                                phase: lead.phase as PhaseType,
                                                                                distribuidora: lead.distribuidora as Distribuidora,
                                                                                hasCompetitor: false // Default for quick view
                                                                            });

                                                                            return (
                                                                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                                                    Econ: R$ {result.monthlySavings.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês
                                                                                </span>
                                                                            );
                                                                        } catch (e) {
                                                                            return null;
                                                                        }
                                                                    })()}

                                                                    {lead.bill_url ? (
                                                                        <a
                                                                            href={lead.bill_url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-xs font-semibold text-energisa-orange hover:text-orange-300 flex items-center transition-colors px-2 py-1 -ml-2 rounded hover:bg-orange-500/10 mt-1"
                                                                        >
                                                                            <Download size={12} className="mr-1.5" />
                                                                            Ver Fatura
                                                                        </a>
                                                                    ) : (
                                                                        <span className="text-slate-600 text-xs italic mt-1">Sem anexo</span>
                                                                    )}
                                                                </div>
                                                            </td>

                                                            {/* Referral Info */}
                                                            <td className="px-8 py-5">
                                                                {lead.referral_id ? (
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                                        {lead.referral_id}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-slate-600 text-xs">-</span>
                                                                )}
                                                            </td>

                                                            {/* Status & Actions */}
                                                            <td className="px-8 py-5">
                                                                <div className="flex items-center justify-between gap-4">
                                                                    <div className="relative group/select">
                                                                        <div className={`absolute inset-0 rounded-full blur opacity-20 group-hover/select:opacity-40 transition-opacity ${getStatusColor(lead.status || 'new').split(' ')[0].replace('/10', '/50')}`}></div>
                                                                        <select
                                                                            value={lead.status}
                                                                            onChange={(e) => handleStatusUpdate(lead.id!, e.target.value)}
                                                                            className={`relative z-10 text-[10px] font-bold uppercase py-1.5 px-4 rounded-full border bg-slate-900 cursor-pointer outline-none focus:ring-2 focus:ring-white/20 transition-all ${getStatusColor(lead.status || 'new')}`}
                                                                        >
                                                                            <option value="new">Novo Lead</option>
                                                                            <option value="contacted">Negociação</option>
                                                                            <option value="contract_signed">Vendido</option>
                                                                            <option value="lost">Perdido</option>
                                                                        </select>
                                                                    </div>

                                                                    <button
                                                                        onClick={() => handleDeleteClick(lead.id!)}
                                                                        className="text-slate-600 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100"
                                                                        title="Excluir"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}

                                                    {filteredLeads.length === 0 && (
                                                        <tr>
                                                            <td colSpan={4} className="py-24 text-center">
                                                                <div className="flex flex-col items-center justify-center opacity-50">
                                                                    <div className="bg-slate-800 p-4 rounded-full mb-4">
                                                                        <Search size={32} className="text-slate-400" />
                                                                    </div>
                                                                    <p className="text-slate-300 text-lg font-medium">Nenhum resultado encontrado</p>
                                                                    <p className="text-slate-500 text-sm">Tente ajustar seus filtros de busca</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )
                            }

                            {/* Pagination Controls */}
                            <div className="flex items-center justify-between px-2 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                <span className="text-sm text-slate-400 font-medium">
                                    Mostrando <span className="text-white">{Math.min(leads.length, 1) > 0 ? page * ROWS_PER_PAGE + 1 : 0}</span> até <span className="text-white">{Math.min((page + 1) * ROWS_PER_PAGE, totalLeads)}</span> de <span className="text-white">{totalLeads}</span> resultados
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(p => Math.max(0, p - 1))}
                                        disabled={page === 0}
                                        className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Anterior
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(p => p + 1)}
                                        disabled={(page + 1) * ROWS_PER_PAGE >= totalLeads}
                                        className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Próxima
                                    </Button>
                                </div>
                            </div>
                        </div >
                    ) : activeModule === 'candidates' ? (
                        // CANDIDATES VIEW
                        <div className="relative bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-white mb-4">Candidatos a Consultor</h2>
                                {loading ? (
                                    <div className="text-center py-12 text-slate-400">Carregando candidatos...</div>
                                ) : candidates.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500">Nenhum candidato encontrado.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-slate-500 font-semibold">
                                                    <th className="px-6 py-4">Data</th>
                                                    <th className="px-6 py-4">Nome</th>
                                                    <th className="px-6 py-4">Contato</th>
                                                    <th className="px-6 py-4">Experiência</th>
                                                    <th className="px-6 py-4">Status</th>
                                                    <th className="px-6 py-4">Currículo</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {candidates.map((candidate) => (
                                                    <tr key={candidate.id} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-6 py-4 text-sm text-slate-400">{new Date(candidate.created_at).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 font-medium text-white">{candidate.name}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-slate-300">{candidate.email}</div>
                                                            <div className="text-xs text-slate-500">{candidate.whatsapp}</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate" title={candidate.message}>
                                                            {candidate.message || '-'}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">No Aguardo</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {candidate.resume_url ? (
                                                                <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer" className="text-energisa-orange hover:underline text-sm flex items-center gap-1">
                                                                    <Download size={14} /> Baixar
                                                                </a>
                                                            ) : (
                                                                <span className="text-slate-600 text-xs">Sem anexo</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : activeModule === 'team' ? (
                        <div className="relative bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Gerenciar Equipe</h2>
                                        <p className="text-slate-400">Adicione pessoas que podem acessar este painel.</p>
                                    </div>
                                    <Button onClick={() => setShowAddAdminModal(true)} className="bg-purple-600 hover:bg-purple-700">
                                        + Novo Admin
                                    </Button>
                                </div>



                                <div className="grid gap-4">
                                    {teamMembers.map((member) => (
                                        <div key={member.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                                                    {(member.name || member.email).charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white">{member.name || 'Sem nome'}</h3>
                                                    <p className="text-sm text-slate-400">{member.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                                    Admin
                                                </span>
                                                <button
                                                    onClick={() => setAdminToDelete(member.id)}
                                                    className="text-slate-500 hover:text-red-400 transition-colors"
                                                    title="Remover Admin"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}



                                    {teamMembers.length === 0 && (
                                        <div className="text-center py-8 text-slate-500 italic">
                                            Nenhum administrador encontrado.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : activeModule === 'partners' ? (
                        <div className="relative bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Candidatos a Parceiro</h2>
                                        <p className="text-slate-400">Gerencie pessoas que querem indicar clientes para a i9.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                            {partnerLeads.filter(p => p.status === 'pending').length} Pendentes
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                            {partnerLeads.filter(p => p.status === 'approved').length} Aprovados
                                        </span>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="text-center py-12 text-slate-400">Carregando parceiros...</div>
                                ) : partnerLeads.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500">Nenhum candidato a parceiro ainda.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-slate-500 font-semibold">
                                                    <th className="px-6 py-4">Data</th>
                                                    <th className="px-6 py-4">Nome</th>
                                                    <th className="px-6 py-4">Contato</th>
                                                    <th className="px-6 py-4">Empresa</th>
                                                    <th className="px-6 py-4">Status</th>
                                                    <th className="px-6 py-4">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {partnerLeads.map((partner) => (
                                                    <tr key={partner.id} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="px-6 py-4 text-sm text-slate-400">
                                                            {new Date(partner.created_at).toLocaleDateString('pt-BR')}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-medium text-white">{partner.name}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-slate-300">{partner.email}</div>
                                                            <a
                                                                href={`https://wa.me/55${partner.phone?.replace(/\D/g, '')}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-xs text-green-400 hover:text-green-300"
                                                            >
                                                                {partner.phone}
                                                            </a>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-400">
                                                            {partner.company || '-'}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${partner.status === 'approved'
                                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                                    : partner.status === 'rejected'
                                                                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                                }`}>
                                                                {partner.status === 'approved' ? 'Aprovado' : partner.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {partner.status === 'pending' && (
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => handlePartnerStatusUpdate(partner.id, 'approved')}
                                                                        className="px-3 py-1 rounded text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                                                                    >
                                                                        Aprovar
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handlePartnerStatusUpdate(partner.id, 'rejected')}
                                                                        className="px-3 py-1 rounded text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                                                                    >
                                                                        Rejeitar
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null
                }
            </main >
            {/* Modals moved to root to avoid cut-off */}
            {
                showAddAdminModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                            <h3 className="text-xl font-bold text-white mb-4">Novo Administrador</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Nome</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Ex: João Silva"
                                        value={newAdminName}
                                        onChange={(e) => setNewAdminName(e.target.value)}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        placeholder="joao@exemplo.com"
                                        value={newAdminEmail}
                                        onChange={(e) => setNewAdminEmail(e.target.value)}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 justify-end">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowAddAdminModal(false);
                                        setNewAdminName('');
                                        setNewAdminEmail('');
                                    }}
                                    className="text-slate-400 hover:text-white"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={() => confirmAddAdmin(newAdminName, newAdminEmail)}
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    Adicionar
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                adminToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                    <Trash2 size={24} className="text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Remover Administrador?</h3>
                                <p className="text-slate-400 text-sm">
                                    Tem certeza que deseja remover este acesso? Essa ação não pode ser desfeita.
                                </p>
                            </div>

                            <div className="flex gap-3 justify-center">
                                <Button
                                    variant="ghost"
                                    onClick={() => setAdminToDelete(null)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={() => handleRemoveAdmin(adminToDelete)}
                                    className="bg-red-500 hover:bg-red-600 border-none text-white"
                                >
                                    Sim, Remover
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Link Generator Modal */}
            {
                showLinkGenerator && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                                    <Link size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Gerar Link de Parceiro</h3>
                                    <p className="text-slate-400 text-sm">Crie links exclusivos para rastrear indicações.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Nome do Parceiro / Escritório</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Ex: Contabilidade Silva"
                                        value={partnerName}
                                        onChange={(e) => {
                                            setPartnerName(e.target.value);
                                            setGeneratedLink(''); // Reset link on change
                                        }}
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-slate-500 mt-2">
                                        O sistema transformará espaços em "_" automaticamente.
                                    </p>
                                </div>

                                {generatedLink && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="block text-sm text-slate-400 mb-1">Link Gerado</label>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-slate-950/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-blue-400 font-mono break-all">
                                                {generatedLink}
                                            </div>
                                            <Button onClick={copyToClipboard} size="icon" className="shrink-0 bg-blue-600 hover:bg-blue-700">
                                                <Copy size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-8 justify-end">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowLinkGenerator(false);
                                        setPartnerName('');
                                        setGeneratedLink('');
                                    }}
                                    className="text-slate-400 hover:text-white"
                                >
                                    Fechar
                                </Button>
                                {!generatedLink && (
                                    <Button
                                        onClick={handleGenerateLink}
                                        disabled={!partnerName}
                                        className="bg-blue-600 hover:bg-blue-700 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                                    >
                                        Criar Link
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Delete Lead Modal */}
            {
                leadToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 animate-bounce-slow">
                                    <Trash2 size={32} className="text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Excluir Lead?</h3>
                                <p className="text-slate-400 text-sm">
                                    Esta ação removerá permanentemente este contato e todos os dados associados. Não pode ser desfeito.
                                </p>
                            </div>

                            <div className="flex gap-3 justify-center">
                                <Button
                                    variant="ghost"
                                    onClick={() => setLeadToDelete(null)}
                                    className="text-slate-400 hover:text-white hover:bg-white/5"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={confirmDeleteLead}
                                    className="bg-red-500 hover:bg-red-600 border-none text-white shadow-lg shadow-red-500/20"
                                >
                                    Sim, Excluir
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Delete All Modal */}
            {
                showDeleteAllModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 animate-bounce-slow">
                                    <AlertCircle size={32} className="text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">PERIGO: Apagar Tudo?</h3>
                                <p className="text-slate-400 text-sm mb-4">
                                    Esta ação apagará <strong>TODOS</strong> os {activeModule === 'leads' ? 'leads' : 'candidatos'} do banco de dados.
                                    <br />
                                    <span className="text-red-400 font-bold">Isso não pode ser desfeito.</span>
                                </p>

                                <div className="w-full mb-2">
                                    <label className="block text-xs text-slate-500 mb-1">Digite "DELETAR" para confirmar:</label>
                                    <input
                                        type="text"
                                        value={deleteAllVerification}
                                        onChange={(e) => setDeleteAllVerification(e.target.value)}
                                        className="w-full bg-slate-800 border-2 border-red-500/30 rounded-lg px-4 py-2 text-white text-center font-bold tracking-widest uppercase focus:outline-none focus:border-red-500 transition-colors"
                                        placeholder="DELETAR"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-center">
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowDeleteAllModal(false)}
                                    className="text-slate-400 hover:text-white hover:bg-white/5"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={confirmDeleteAll}
                                    disabled={deleteAllVerification !== 'DELETAR'}
                                    className="bg-red-600 hover:bg-red-700 border-none text-white shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Confirmar Exclusão
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
