import React, { useEffect } from 'react';
// Optimizing mobile performance
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

import { SimulationResult } from '../types';
import { Zap, Wallet, TrendingDown, ArrowRight, Trophy, Download, ShieldCheck, Sparkles } from 'lucide-react';
import { LightningSplit } from './ui/lightning-split';
import { Button } from './ui/Button';
import confetti from 'canvas-confetti';
import CountUp from 'react-countup';


interface ResultsProps {
  result: SimulationResult;
  onReset: () => void;
  onProceed: () => void;
}

const CompetitorSide = ({ result }: { result: SimulationResult }) => {
  const isCompetitor = result.hasCompetitor;
  const title = isCompetitor ? "Sua Situação Atual" : "Sua Fatura Hoje";
  const value = isCompetitor ? result.competitorTotalValue : result.originalBillValue;
  const subtitle = isCompetitor ? 'Valor aproximado com seu desconto atual' : 'Sem o plano i9 Energy';
  const tagText = isCompetitor ? "Desconto Baixo" : "Preço Cheio";

  return (
    <div className="h-full w-full bg-slate-900 flex flex-col items-center justify-center p-8 relative overflow-hidden group">
      {/* Background with subtle red flush */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/20 via-slate-900 to-slate-900"></div>

      <div className="relative z-10 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-white/5 text-xs font-semibold text-slate-400 uppercase tracking-wider backdrop-blur-none md:backdrop-blur-sm">
          <Wallet size={14} />
          {title}
        </div>

        <div className="relative inline-block">
          R$ <CountUp end={value || 0} decimals={2} duration={1} separator="." decimal="," />
          <div className="absolute top-1/2 left-0 w-full h-1 bg-red-500/50 -rotate-2 transform origin-center rounded-full"></div>
        </div>

        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl max-w-xs mx-auto">
          <p className="text-red-400 font-medium text-sm flex items-center justify-center gap-2">
            <TrendingDown size={16} />
            {tagText}
          </p>
        </div>

        <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
};

const I9Side = ({ result }: { result: SimulationResult }) => {
  // Sustainability Metrics (Approximation)
  const co2AvoidedKg = (result.estimatedConsumptionKwh * 12) * 0.1;
  const treesSaved = Math.max(1, Math.round(co2AvoidedKg / 20));

  return (
    <div className="h-full w-full bg-emerald-900 flex flex-col items-center justify-center p-6 relative overflow-hidden group">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

      <div className="relative z-10 w-full max-w-sm space-y-4">

        {/* Card 1: Immediate Savings (Months 1-3) */}
        <div className="bg-energisa-orange/10 border border-energisa-orange/30 p-4 rounded-2xl relative overflow-hidden shadow-lg shadow-orange-500/10 backdrop-blur-sm">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-energisa-orange/20 blur-2xl rounded-full"></div>
          <p className="text-orange-200 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
            <Zap size={12} className="fill-orange-400 text-orange-400" />
            Economia 1º Trimestre
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-orange-100/60 text-[10px] mb-0.5">Desconto de 50% aplicado</p>
              <div className="text-2xl font-black text-white tracking-tight flex items-baseline gap-1">
                R$ <CountUp end={result.savingsMonth1to3} decimals={2} duration={2} separator="." decimal="," />
                <span className="text-xs font-normal text-orange-200/50">/mês</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-orange-200/50">Você paga só</div>
              <div className="text-lg font-bold text-white">R$ {result.monthlyCostMonth1to3.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Card 2: Annual Savings */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl relative overflow-hidden shadow-lg backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-10 -mt-10"></div>

          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-1">Economia Total Anual</p>
              <div className="flex items-center gap-2 text-white">
                <Trophy size={18} className="text-yellow-400 fill-yellow-400/20" />
                <span className="text-3xl font-black tracking-tight">
                  R$ <CountUp end={result.annualSavings} decimals={2} duration={2.5} separator="." decimal="," />
                </span>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-emerald-500/20 my-2"></div>

          {/* Impact Row */}
          <div className="flex justify-between w-full px-1 gap-2">
            <div className="flex items-center gap-1.5">
              <div className="p-1 bg-emerald-500/20 rounded-full"><Sparkles size={10} className="text-emerald-300" /></div>
              <span className="text-[10px] text-emerald-100/80 font-medium">Bônus de Verão</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="p-1 bg-emerald-500/20 rounded-full"><ShieldCheck size={10} className="text-emerald-300" /></div>
              <span className="text-[10px] text-emerald-100/80 font-medium">Garantia em Contrato</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export const Results: React.FC<ResultsProps> = ({ result, onReset, onProceed }) => {
  // Fire confetti on mount
  // Fire confetti on mount - Optimized for mobile (One burst instead of loop)
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#fbbf24'],
      disableForReducedMotion: true
    });
  }, []);



  const chartData = [
    { name: result.hasCompetitor ? 'Concorrente' : 'Atual', valor: (result.hasCompetitor ? result.competitorTotalValue : result.originalBillValue), color: '#94a3b8' },
    { name: 'Com i9', valor: result.newTotalValue, color: '#10B981' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">

      <div className="bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-white/10 relative">

        {/* Header */}
        <div className="bg-slate-900/80 backdrop-blur-md p-6 border-b border-white/5 text-center">
          <h2 className="text-2xl font-bold text-white">Resultado da Simulação</h2>
          <p className="text-slate-400 text-sm">Veja como podemos transformar sua conta de luz</p>
        </div>

        {/* ALWAYS SHOW LIGHTNING SPLIT (Comparison Mode) */}
        <div className="h-[500px] relative">
          <LightningSplit
            className="h-full"
            leftComponent={<CompetitorSide result={result} />}
            rightComponent={<I9Side result={result} />}
          />

          {/* Floating Label Instructions */}
          <div className="hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none z-40">
            <p className="text-xs text-white/50 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
              Passe o mouse para comparar
            </p>
          </div>
        </div>

        {/* Shared Bottom Section (Chart & CTA) */}
        <div className="bg-slate-900 p-8 border-t border-white/5">
          {/* ... Chart ... */}
          {/* ... Chart ... */}
          <div className="h-72 w-full mt-4 mb-8 relative">
            {/* Chart Title Overlay */}
            <div className="absolute top-0 right-0 p-2 z-10 pointer-events-none">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
                <TrendingDown size={14} className="text-emerald-500" />
                Comparativo Visual
              </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGradientActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#94a3b8" stopOpacity={1} />
                    <stop offset="100%" stopColor="#475569" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="barGradientI9" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                  </linearGradient>

                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.4} />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={14}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#cbd5e1' }}
                  dy={10}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$${value}`}
                />
                <Tooltip
                  cursor={{ fill: '#334155', opacity: 0.1 }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-800/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl">
                          <p className="text-slate-400 text-xs uppercase mb-1">{label}</p>
                          <p className="text-white font-bold text-xl">
                            R$ {Number(payload[0].value).toFixed(2)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="valor" radius={[6, 6, 0, 0]} animationDuration={1500}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 1 ? "url(#barGradientI9)" : "url(#barGradientActual)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>



          <div className="space-y-4">
            <Button fullWidth className="text-lg py-5 shadow-xl shadow-orange-500/30" onClick={onProceed}>
              Quero Garantir Meu Desconto
            </Button>
            <Button fullWidth variant="ghost" onClick={onReset} className="text-slate-500 hover:text-slate-800">
              Fazer nova simulação
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};