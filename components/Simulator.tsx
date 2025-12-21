import React, { useState, useRef, useEffect } from 'react';
import { PhaseType, Distribuidora, SimulationParams, SimulationResult, LeadData } from '../types';
import { calculateSavings } from '../services/energyCalculator';
import { Button } from './ui/Button';
import { ArrowLeft, Check, Loader2, UploadCloud, FileText, X, AlertCircle, Zap, Coins, Calculator, CheckCircle2, Banknote } from 'lucide-react';
import { LocationMap } from './ui/expand-map';
import { Results } from './Results';
import { SuccessStep } from './SuccessStep';
import { LegalContentType } from './LegalModal';
import { supabase } from '../services/supabase';

interface SimulatorProps {
  onOpenLegal?: (type: LegalContentType) => void;
}

export const Simulator: React.FC<SimulatorProps> = ({ onOpenLegal }) => {
  const [step, setStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Capture Referral ID on Mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const partnerId = params.get('parceiro');
    if (partnerId) {
      console.log("Partner Code Detected:", partnerId);
      setLeadData(prev => ({ ...prev, referralId: partnerId }));
    }
  }, []);

  const [formData, setFormData] = useState<SimulationParams>({
    billValue: 350,
    phase: PhaseType.MONOFASICO,
    distribuidora: Distribuidora.ENERGISA_MG,
  });

  const [leadData, setLeadData] = useState<LeadData>({
    name: '',
    email: '',
    whatsapp: '',
    acceptedTerms: false,
    billFile: null
  });

  const handleNext = () => setStep((p) => p + 1);
  const handleBack = () => setStep((p) => p - 1);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    try {
      let publicUrl = null;

      // 1. Upload File if exists
      if (leadData.billFile) {
        const fileExt = leadData.billFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('bills')
          .upload(fileName, leadData.billFile);

        if (uploadError) throw uploadError;

        if (uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from('bills')
            .getPublicUrl(uploadData.path);
          publicUrl = publicUrlData.publicUrl;
        }
      }

      // 2. Save Lead to Database
      const { error: dbError } = await supabase
        .from('leads')
        .insert([{
          name: leadData.name,
          email: leadData.email || null,
          whatsapp: leadData.whatsapp,
          bill_value: formData.billValue,
          phase: formData.phase,
          distribuidora: formData.distribuidora,
          bill_url: publicUrl,
          referral_id: leadData.referralId || null,
          status: 'new'
        }]);

      if (dbError) {
        console.error('Error saving lead:', dbError);
        // Continue anyway to show results
      }

    } catch (error) {
      console.error('Error in simulation process:', error);
    }

    // Keep the UX delay
    setTimeout(() => {
      const simResult = calculateSavings(formData);
      setResult(simResult);
      setIsCalculating(false);
      setStep(4);
    }, 1500);
  };

  const handleProceed = () => setStep(5);

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setLeadData(prev => ({ ...prev, billFile: null }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLeadData({ ...leadData, billFile: e.target.files[0] });
    }
  };

  const handleRemoveFile = () => {
    setLeadData({ ...leadData, billFile: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const progress = (step / 3) * 100;

  if (step === 5) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <SuccessStep leadName={leadData.name} whatsapp={leadData.whatsapp} hasUploadedBill={!!leadData.billFile} result={result} />
      </div>
    );
  }

  if (step === 4 && result) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Results result={result} onReset={handleReset} onProceed={handleProceed} />
      </div>
    );
  }
  const maskPhone = (value: string) => {
    // Remove everything that is not a digit
    const numbers = value.replace(/\D/g, "");

    // Apply (XX) XXXXX-XXXX mask
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})/, "($1) ")
        .replace(/(\d{5})(\d{4})/, "$1-$2");
    }

    return value.substring(0, 15); // Limit max length
  };

  return (
    <div className="w-full max-w-xl mx-auto relative group perspective">
      {/* Decorative Blur behind card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-100 w-full">
          <div
            className="h-full bg-gradient-to-r from-energisa-orange to-red-500 transition-all duration-700 ease-out rounded-r-full shadow-[0_0_10px_rgba(255,107,0,0.5)]"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="p-8 md:p-10">
          <div className="mb-8 flex items-center justify-between">
            {step > 1 && step < 4 && (
              <button
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-energisa-orange' : 'bg-slate-200'}`}></div>
              <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-energisa-orange' : 'bg-slate-200'}`}></div>
              <div className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-energisa-orange' : 'bg-slate-200'}`}></div>
            </div>
          </div>

          <form onSubmit={step === 3 ? handleSimulate : (e) => { e.preventDefault(); handleNext(); }}>

            {/* STEP 1: Location & Type */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-energisa-orange shadow-inner">
                    <Zap size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Vamos começar</h2>
                  <p className="text-slate-500 mt-2 text-lg">Selecione sua região para calcularmos as tarifas.</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 pl-1">Distribuidora de Energia</label>
                    <div className="relative">
                      <select
                        className="w-full rounded-xl border-slate-700 bg-slate-800 text-white font-medium border-2 p-4 focus:ring-4 focus:ring-orange-500/20 focus:border-energisa-orange outline-none transition-all appearance-none cursor-pointer hover:bg-slate-700"
                        value={formData.distribuidora}
                        onChange={(e) => setFormData({ ...formData, distribuidora: e.target.value as Distribuidora })}
                      >
                        {Object.values(Distribuidora).map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ArrowLeft size={20} className="-rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 pl-1">Tipo de Ligação</label>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.values(PhaseType).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, phase: type })}
                          className={`p-4 text-sm font-bold rounded-xl border-2 transition-all duration-200 ${formData.phase === type
                            ? 'border-energisa-orange bg-slate-800 text-white shadow-lg shadow-orange-500/20 transform scale-[1.02]'
                            : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 pl-1">Já possui energia por assinatura?</label>
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasCompetitor: false, competitorDiscount: 0 })}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${!formData.hasCompetitor
                        ? 'border-slate-800 bg-slate-800 text-white'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                      Não, pago preço cheio
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasCompetitor: true })}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${formData.hasCompetitor
                        ? 'border-energisa-orange bg-orange-50 text-energisa-orange'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                      Sim, já tenho desconto
                    </button>
                  </div>

                  {formData.hasCompetitor && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-sm font-semibold text-slate-700 mb-2 pl-1">Qual é o seu desconto atual?</label>
                      <div className="relative">
                        <input
                          type="number"
                          className="w-full rounded-xl border-slate-700 bg-white text-slate-900 font-bold text-lg border-2 p-3.5 pl-4 focus:ring-4 focus:ring-orange-500/20 focus:border-energisa-orange outline-none transition-all placeholder:font-normal"
                          placeholder="Ex: 10"
                          min="0"
                          max="99"
                          value={formData.competitorDiscount || ''}
                          onChange={(e) => setFormData({ ...formData, competitorDiscount: parseFloat(e.target.value) })}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</div>
                      </div>
                      <p className="text-xs text-orange-600 mt-2 font-medium bg-orange-50 p-2 rounded-lg">
                        Vamos comparar se a i9 Energy consegue superar seu desconto atual.
                      </p>
                    </div>
                  )}
                </div>

                <Button type="button" onClick={handleNext} fullWidth className="mt-8 text-lg">
                  Continuar
                </Button>
              </div>
            )}

            {/* STEP 2: Value Slider */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600 border border-emerald-500/20 shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
                    <Banknote size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Média da Fatura</h2>
                  <p className="text-slate-500 mt-2 text-lg">Quanto você gasta por mês aproximadamente?</p>
                </div>

                <div className="py-8 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-center mb-8 relative">
                    <span className="text-sm text-slate-400 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">Valor Mensal</span>
                    <span className="text-6xl font-extrabold text-slate-900 tracking-tighter">
                      R$ {formData.billValue}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="300"
                    max="10000"
                    step="50"
                    value={formData.billValue}
                    onChange={(e) => setFormData({ ...formData, billValue: parseInt(e.target.value) })}
                    className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-energisa-orange/50"
                  />
                  <div className="flex justify-between text-xs font-bold text-slate-400 mt-4 uppercase tracking-wider">
                    <span>R$ 300</span>
                    <span>Arraste para ajustar</span>
                    <span>R$ 10.000+</span>
                  </div>
                </div>

                <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl flex items-start">
                  <div className="mt-0.5 mr-3 flex-shrink-0">
                    <CheckCircle2 size={18} className="text-energisa-orange" />
                  </div>
                  <p className="text-sm text-slate-700 font-medium">
                    Cálculo otimizado para a Lei 14.300 (Marco Legal) com isenção parcial de TUSD.
                  </p>
                </div>

                <Button type="button" onClick={handleNext} fullWidth className="text-lg">
                  Calcular Desconto
                </Button>
              </div>
            )}

            {/* STEP 3: Lead Capture */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500 shadow-inner">
                    <Calculator size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Gerar Estudo</h2>
                  <p className="text-slate-500 mt-2">Personalize sua proposta oficial.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 pl-1">Nome</label>
                      <input
                        required
                        type="text"
                        className="w-full rounded-xl border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 border-2 p-3.5 focus:ring-4 focus:ring-orange-500/20 focus:border-energisa-orange outline-none transition-all"
                        placeholder="Nome completo"
                        value={leadData.name}
                        onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 pl-1">WhatsApp</label>
                      <input
                        required
                        type="tel"
                        className="w-full rounded-xl border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 border-2 p-3.5 focus:ring-4 focus:ring-orange-500/20 focus:border-energisa-orange outline-none transition-all"
                        placeholder="(DDD) 99999-9999"
                        maxLength={15}
                        value={leadData.whatsapp}
                        onChange={(e) => {
                          // Apply mask as user types
                          const masked = maskPhone(e.target.value);
                          setLeadData({ ...leadData, whatsapp: masked });
                        }}
                      />
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 pl-1">Conta de Energia <span className="text-slate-400 font-normal">(Opcional)</span></label>
                    <div className={`
                      border-2 border-dashed rounded-xl p-6 transition-all text-center cursor-pointer group
                      ${leadData.billFile ? 'border-i9-green bg-green-50/30' : 'border-slate-300 hover:border-energisa-orange hover:bg-orange-50/30'}
                    `}>
                      {!leadData.billFile ? (
                        <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center">
                          <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                            <UploadCloud className="text-slate-400 group-hover:text-energisa-orange" size={24} />
                          </div>
                          <p className="text-sm text-slate-700 font-semibold">Toque para anexar conta (PDF/Foto)</p>
                          <p className="text-xs text-slate-400 mt-1">Aumenta a precisão do cálculo</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center overflow-hidden">
                            <div className="bg-white p-3 rounded-xl border border-slate-200 mr-3 shadow-sm">
                              <FileText className="text-energisa-orange" size={20} />
                            </div>
                            <div className="text-left overflow-hidden">
                              <p className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{leadData.billFile.name}</p>
                              <p className="text-xs text-slate-500 font-medium">Arquivo pronto para envio</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 pl-1">E-mail <span className="text-slate-400 font-normal">(Opcional)</span></label>
                    <input
                      type="email"
                      className="w-full rounded-xl border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 border-2 p-3.5 focus:ring-4 focus:ring-orange-500/20 focus:border-energisa-orange outline-none transition-all"
                      placeholder="seu@email.com"
                      value={leadData.email}
                      onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center pt-2">
                    <input
                      id="terms"
                      type="checkbox"
                      required
                      className="w-5 h-5 rounded border-slate-300 text-energisa-orange focus:ring-energisa-orange cursor-pointer"
                      checked={leadData.acceptedTerms}
                      onChange={(e) => setLeadData({ ...leadData, acceptedTerms: e.target.checked })}
                    />
                    <label htmlFor="terms" className="ml-3 text-sm text-slate-600 cursor-pointer">
                      Li e concordo com a <button type="button" onClick={() => onOpenLegal?.('privacy')} className="text-energisa-orange font-semibold hover:underline">Política de Privacidade</button>.
                    </label>
                  </div>
                </div>

                <Button type="submit" fullWidth disabled={isCalculating || !leadData.name || !leadData.whatsapp || !leadData.acceptedTerms} className="text-lg shadow-xl shadow-orange-500/20">
                  {isCalculating ? (
                    <div className="flex items-center">
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Processando Dados...
                    </div>
                  ) : (
                    "Ver Resultado Agora"
                  )}
                </Button>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};