import React from 'react';
import { 
  LogOut, 
  Home, 
  FileText, 
  PieChart, 
  Leaf, 
  Download, 
  ArrowDown, 
  Zap,
  Menu
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('visao-geral');
  const LOGO_URL = "https://lqwywrknndolrxvmyuna.supabase.co/storage/v1/object/sign/arquivos%20da%20empresa/LOGO%20I9%20ENERGI%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85Y2EzZmYzMC1jYjNlLTRjZGUtOGM2MC0yYzA2ZGNlODM0ZTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcnF1aXZvcyBkYSBlbXByZXNhL0xPR08gSTkgRU5FUkdJICgxKS5wbmciLCJpYXQiOjE3NjU2OTI0NDUsImV4cCI6MTc5NzIyODQ0NX0.26LLt5xT84b3v_dbo9CoZ0UdEjKICVoOVz07OJJC0nQ";


  // Mock Data for Chart
  const chartData = [
    { month: 'Jan', contaOriginal: 450, contaI9: 380 },
    { month: 'Fev', contaOriginal: 480, contaI9: 405 },
    { month: 'Mar', contaOriginal: 420, contaI9: 355 },
    { month: 'Abr', contaOriginal: 500, contaI9: 420 },
    { month: 'Mai', contaOriginal: 460, contaI9: 390 },
    { month: 'Jun', contaOriginal: 440, contaI9: 370 },
  ];

  // Mock Data for Invoices
  const invoices = [
    { id: 'FAT-2024-06', month: 'Junho/2024', value: 'R$ 370,00', status: 'pending', date: '10/07/2024' },
    { id: 'FAT-2024-05', month: 'Maio/2024', value: 'R$ 390,00', status: 'paid', date: '10/06/2024' },
    { id: 'FAT-2024-04', month: 'Abril/2024', value: 'R$ 420,00', status: 'paid', date: '10/05/2024' },
  ];

  const SidebarItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-energisa-orange text-white shadow-lg shadow-orange-500/30' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="bg-white rounded-xl p-4 w-full flex justify-center">
              <img 
                src={LOGO_URL} 
                alt="i9 Energy Logo" 
                className="h-20 w-auto object-contain" 
              />
            </div>
          </div>

          <nav className="space-y-2">
            <SidebarItem id="visao-geral" icon={Home} label="Visão Geral" />
            <SidebarItem id="faturas" icon={FileText} label="Minhas Faturas" />
            <SidebarItem id="consumo" icon={PieChart} label="Histórico" />
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <span className="font-bold">CM</span>
            </div>
            <div>
              <p className="text-sm font-medium">Carlos Mendes</p>
              <p className="text-xs text-slate-500">Instalação: 99887766</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center text-slate-400 hover:text-white transition-colors text-sm"
          >
            <LogOut size={16} className="mr-2" />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10">
          <button 
            className="lg:hidden text-slate-600"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <h1 className="text-xl font-bold text-slate-800 lg:ml-0 ml-4">
            {activeTab === 'visao-geral' && 'Visão Geral'}
            {activeTab === 'faturas' && 'Faturas e Boletos'}
            {activeTab === 'consumo' && 'Análise de Consumo'}
          </h1>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-green-50 text-i9-green px-3 py-1 rounded-full text-sm font-medium border border-green-100">
              <Zap size={14} className="mr-2 fill-current" />
              Economizando Agora
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          
          {/* VISÃO GERAL TAB */}
          {activeTab === 'visao-geral' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-slate-500 font-medium uppercase">Economia Acumulada</p>
                    <div className="p-2 bg-green-100 rounded-lg text-i9-green">
                      <ArrowDown size={20} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">R$ 1.240,50</h3>
                  <p className="text-sm text-green-600 mt-2 font-medium">+ R$ 180,00 este mês</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-slate-500 font-medium uppercase">Impacto Ambiental</p>
                    <div className="p-2 bg-green-100 rounded-lg text-i9-green">
                      <Leaf size={20} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">420 kg</h3>
                  <p className="text-sm text-slate-500 mt-2">de CO2 evitado (aprox. 3 árvores)</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-full w-1 bg-energisa-orange"></div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-slate-500 font-medium uppercase">Próxima Fatura</p>
                    <div className="p-2 bg-orange-100 rounded-lg text-energisa-orange">
                      <FileText size={20} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">R$ 370,00</h3>
                  <p className="text-sm text-orange-600 mt-2 font-medium">Vence em 10/07</p>
                </div>
              </div>

              {/* Chart Section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Comparativo de Economia (Últimos 6 meses)</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorOriginal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorI9" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(v) => `R$${v}`} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" name="Sem i9 Energy" dataKey="contaOriginal" stroke="#94a3b8" fillOpacity={1} fill="url(#colorOriginal)" />
                      <Area type="monotone" name="Com i9 Energy" dataKey="contaI9" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorI9)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* FATURAS TAB (Visible if activeTab is 'faturas' or inside Visão Geral as a summary) */}
          {(activeTab === 'faturas' || activeTab === 'visao-geral') && (
            <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${activeTab === 'visao-geral' ? 'mt-8' : 'animate-in fade-in slide-in-from-bottom-4 duration-500'}`}>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Faturas Recentes</h3>
                {activeTab === 'visao-geral' && (
                   <button onClick={() => setActiveTab('faturas')} className="text-sm text-energisa-orange hover:underline">Ver todas</button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">Mês de Referência</th>
                      <th className="px-6 py-4 font-medium">Vencimento</th>
                      <th className="px-6 py-4 font-medium">Valor</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{invoice.month}</td>
                        <td className="px-6 py-4 text-slate-600">{invoice.date}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{invoice.value}</td>
                        <td className="px-6 py-4">
                          {invoice.status === 'paid' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Pago
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Pendente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-energisa-orange transition-colors">
                            <Download size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Placeholder for Consumo Tab */}
          {activeTab === 'consumo' && (
             <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 animate-in fade-in zoom-in-95">
                <div className="p-6 bg-slate-50 rounded-full mb-4">
                   <PieChart size={48} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Detalhamento Avançado</h3>
                <p className="text-slate-500 mt-2 max-w-md text-center">
                   Em breve você poderá baixar relatórios detalhados de injecção de energia e saldo acumulado de créditos.
                </p>
             </div>
          )}

        </div>
      </main>
    </div>
  );
};