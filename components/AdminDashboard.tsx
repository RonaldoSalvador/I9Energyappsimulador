import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { DatabaseLead } from '../types';
import { FileText, Phone, Mail, Calendar, Search, LogOut, Download, Trash2, Filter, FileSpreadsheet, CheckCircle, XCircle, Clock, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/Button';
import { KanbanBoard, KanbanColumn } from './ui/trello-kanban-board';

interface AdminDashboardProps {
    onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [leads, setLeads] = useState<DatabaseLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'contacted' | 'contract_signed' | 'lost'>('all');
    const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
    const [activeModule, setActiveModule] = useState<'leads' | 'candidates'>('leads');
    const [candidates, setCandidates] = useState<any[]>([]);

    // Pagination State
    const [page, setPage] = useState(0);
    const ROWS_PER_PAGE = 20;
    const [totalLeads, setTotalLeads] = useState(0);

    useEffect(() => {
        if (activeModule === 'leads') fetchLeads();
        if (activeModule === 'candidates') fetchCandidates();
    }, [activeModule, page]); // Refetch when page changes

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

    const handleDelete = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja EXCLUIR este lead para sempre?')) return;

        try {
            const { error } = await supabase.from('leads').delete().eq('id', id);
            if (error) throw error;
            setLeads(prev => prev.filter(l => l.id !== id));
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

    const handleExport = () => {
        const headers = ['Data', 'Nome', 'Email', 'WhatsApp', 'Distribuidora', 'Fase', 'Valor Conta', 'Status', 'Link Arquivo'];
        const csvContent = [
            headers.join(','),
            ...leads.map(lead => [
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
                                    src="https://lqwywrknndolrxvmyuna.supabase.co/storage/v1/object/sign/arquivos%20da%20empresa/logofinal%20i9%20energy%20(1)semfundo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85Y2EzZmYzMC1jYjNlLTRjZGUtOGM2MC0yYzA2ZGNlODM0ZTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcnF1aXZvcyBkYSBlbXByZXNhL2xvZ29maW5hbCBpOSBlbmVyZ3kgKDEpc2VtZnVuZG8ucG5nIiwiaWF0IjoxNzY1NzQwMjc2LCJleHAiOjE3OTcyNzYyNzZ9.ZyqR9bI3C33z6Zpx_Y3NEcklQd8Hi2Q2F7WdYtdK3so"
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
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button onClick={handleExport} variant="outline" className="hidden md:flex text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/50 shadow-lg shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1">
                            <FileSpreadsheet size={18} className="mr-2" />
                            Exportar Excel
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
            </header>

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
                                            { id: 'new', title: 'Novos Leads', tasks: filteredLeads.filter(l => l.status === 'new' || !l.status).map(l => ({ id: l.id!, title: l.name, description: `R$ ${l.bill_value.toLocaleString('pt-BR')} - ${l.phase}`, labels: [l.distribuidora.split(' ')[0]] })) },
                                            { id: 'contacted', title: 'Em Negociação', tasks: filteredLeads.filter(l => l.status === 'contacted').map(l => ({ id: l.id!, title: l.name, description: `R$ ${l.bill_value.toLocaleString('pt-BR')} - ${l.phase}`, labels: [l.distribuidora.split(' ')[0]], assignee: l.whatsapp ? 'Zap' : undefined })) },
                                            { id: 'contract_signed', title: 'Fechados', tasks: filteredLeads.filter(l => l.status === 'contract_signed').map(l => ({ id: l.id!, title: l.name, description: `R$ ${l.bill_value.toLocaleString('pt-BR')} - ${l.phase}`, labels: [l.distribuidora.split(' ')[0]] })) },
                                            { id: 'lost', title: 'Perdidos', tasks: filteredLeads.filter(l => l.status === 'lost').map(l => ({ id: l.id!, title: l.name, description: `R$ ${l.bill_value.toLocaleString('pt-BR')} - ${l.phase}`, labels: [l.distribuidora.split(' ')[0]] })) },
                                        ]}
                                        columnColors={{
                                            new: 'bg-blue-500/20',
                                            contacted: 'bg-yellow-500/20',
                                            contract_signed: 'bg-emerald-500/20',
                                            lost: 'bg-slate-700/50'
                                        }}
                                        onTaskMove={(taskId, from, to) => handleStatusUpdate(taskId, to)}
                                        allowAddTask={false}
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

                                                                    {lead.bill_url ? (
                                                                        <a
                                                                            href={lead.bill_url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-xs font-semibold text-energisa-orange hover:text-orange-300 flex items-center transition-colors px-2 py-1 -ml-2 rounded hover:bg-orange-500/10"
                                                                        >
                                                                            <Download size={12} className="mr-1.5" />
                                                                            Ver Fatura
                                                                        </a>
                                                                    ) : (
                                                                        <span className="text-slate-600 text-xs italic">Sem anexo</span>
                                                                    )}
                                                                </div>
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
                                                                        onClick={() => handleDelete(lead.id!)}
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
                            )}

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
                        </div>
                    ) : (
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
                    )
                }
            </main >
        </div >
    );
};
