import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { SimulationResult } from '../types';
import { Zap, Wallet, TrendingDown, ArrowRight, Trophy, Download, ShieldCheck, Sparkles } from 'lucide-react';
import { LightningSplit } from './ui/lightning-split';
import { Button } from './ui/Button';

interface ResultsProps {
  result: SimulationResult;
  onReset: () => void;
  onProceed: () => void;
}

const CompetitorSide = ({ result }: { result: SimulationResult }) => {
  const isCompetitor = result.hasCompetitor;
  const title = isCompetitor ? "Concorrência" : "Fatura Atual";
  const value = isCompetitor ? result.competitorTotalValue : result.originalBillValue;
  const subtitle = isCompetitor ? 'O que você pagaria com seu "desconto" atual' : 'O que você paga hoje sem a i9';
  const tagText = isCompetitor ? "Desconto fraco" : "Preço Cheio";

  return (
    <div className="h-full w-full bg-slate-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
      <div className="relative z-10 text-center">
        <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-4">{title}</h3>
        <div className="text-5xl font-mono text-slate-500 line-through decoration-red-500/50 mb-2 font-bold decoration-4">
          R$ {value?.toFixed(2)}
        </div>
        <p className="text-slate-400 text-sm">{subtitle}</p>
        <div className="mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
          <p className="text-red-400 font-bold">{tagText}</p>
        </div>
      </div>
    </div>
  );
};

const I9Side = ({ result }: { result: SimulationResult }) => (
  <div className="h-full w-full bg-emerald-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-bl from-emerald-900 to-slate-900"></div>
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>
    <div className="relative z-10 text-center">
      <h3 className="text-xl font-bold text-emerald-400 uppercase tracking-widest mb-4">Com a i9 Energy</h3>
      <div className="text-6xl font-mono text-white mb-2 font-bold drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
        R$ {result.newTotalValue.toFixed(2)}
      </div>
      <p className="text-emerald-200 text-sm mb-6">Mensalidade Otimizada</p>

      {/* Total Annual Savings Highlight */}
      <div className="mt-2 p-6 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl animate-pulse shadow-[0_0_30px_rgba(16,185,129,0.2)]">
        <p className="text-emerald-100 text-xs uppercase tracking-wider mb-1">Economia Anual Total</p>
        <p className="text-white font-extrabold text-3xl">
          R$ {result.annualSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        {result.extraSavings > 0 && (
          <p className="text-emerald-300 text-xs mt-2 border-t border-emerald-500/30 pt-2">
            (+ R$ {result.extraSavings?.toFixed(2)} vs Concorrência)
          </p>
        )}
      </div>
    </div>
  </div>
);

export const Results: React.FC<ResultsProps> = ({ result, onReset, onProceed }) => {
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
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none z-40">
            <p className="text-xs text-white/50 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
              Passe o mouse para comparar
            </p>
          </div>
        </div>

        {/* Shared Bottom Section (Chart & CTA) */}
        <div className="bg-slate-900 p-8 border-t border-white/5">
          {/* ... Chart ... */}
          <div className="h-64 w-full mt-4 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                <Tooltip
                  cursor={{ fill: '#334155', opacity: 0.2 }}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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