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
    <div className="h-full w-full bg-emerald-950 flex flex-col items-center justify-center p-8 relative overflow-hidden group">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-900"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

      <div className="relative z-10 text-center space-y-4 w-full max-w-sm">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 uppercase tracking-widest backdrop-blur-none md:backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)] mx-auto">
          <Zap size={14} className="fill-current" />
          Nova Mensalidade i9
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-emerald-500/20 blur-2xl rounded-full opacity-50 animate-pulse-slow"></div>
          <p className="text-emerald-100/70 text-xs mb-1 font-medium">Você pagará apenas:</p>
          R$ <CountUp end={result.newTotalValue} decimals={2} duration={1.5} separator="." decimal="," />
        </div>

        {/* Breakdown Mini-Table */}
        <div className="grid grid-cols-2 gap-2 text-xs text-emerald-200/60 bg-white/5 p-3 rounded-lg border border-white/5">
          <div className="text-left">Energia ({result.estimatedConsumptionKwh.toFixed(0)} kWh):</div>
          <div className="text-right font-medium text-white">R$ {result.subscriptionCost.toFixed(2)}</div>
          <div className="text-left">Taxa Distribuidora:</div>
          <div className="text-right font-medium text-white">R$ {result.residualBill.toFixed(2)}</div>
        </div>

        {/* Savings Card */}
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 p-4 rounded-xl backdrop-blur-none md:backdrop-blur-md shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/20 blur-2xl rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">Economia Anual</p>
            <div className="flex items-center gap-2 text-white">
              <Trophy size={18} className="text-yellow-400 fill-yellow-400/20" />
              <span className="text-2xl font-extrabold tracking-tight">
                R$ <CountUp end={result.annualSavings} decimals={2} duration={1.5} separator="." decimal="," />
              </span>
            </div>

            <div className="w-full h-px bg-emerald-500/20 my-3"></div>

            {/* Impact Row */}
            <div className="flex justify-between w-full px-2 gap-2">
              <div className="flex flex-col items-center">
                <Sparkles size={14} className="text-emerald-300 mb-1" />
                <span className="text-[10px] text-emerald-100/70 font-medium">Sustentável</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck size={14} className="text-emerald-300 mb-1" />
                <span className="text-[10px] text-emerald-100/70 font-medium">Garantido</span>
              </div>
              <div className="flex flex-col items-center" title="Estimativa de impacto ambiental">
                <div className="flex items-center gap-0.5">
                  <span className="text-sm font-bold text-white">{treesSaved}</span>
                  <span className="text-[10px] text-emerald-100/70">Árvores</span>
                </div>
              </div>
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