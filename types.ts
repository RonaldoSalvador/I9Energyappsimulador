
export enum PhaseType {
  MONOFASICO = 'MONOFASICO',
  BIFASICO = 'BIFASICO',
  TRIFASICO = 'TRIFASICO',
}

export enum Distribuidora {
  ENERGISA_MG = 'Energisa Minas Gerais',
  ENERGISA_MT = 'Energisa Mato Grosso',
  ENERGISA_PB = 'Energisa Paraíba',
  ENERGISA_MS = 'Energisa Mato Grosso do Sul',
}

export interface LeadData {
  name: string;
  email: string;
  whatsapp: string;
  acceptedTerms: boolean;
  billFile?: File | null;
  billUrl?: string; // URL after upload
}

export interface DatabaseLead {
  id?: string;
  created_at?: string;
  name: string;
  email: string | null;
  whatsapp: string;
  bill_value: number;
  phase: string;
  distribuidora: string;
  bill_url: string | null;
  status: 'new' | 'contacted' | 'converted' | 'rejected';
}

export interface SimulationParams {
  billValue: number;
  phase: PhaseType;
  distribuidora: Distribuidora;
  hasCompetitor?: boolean;
  competitorDiscount?: number; // 0 to 100
}

export interface SimulationResult {
  estimatedConsumptionKwh: number;
  minConsumptionKwh: number;
  compensableEnergyKwh: number;
  originalBillValue: number;
  newTotalValue: number;
  monthlySavings: number;
  annualSavings: number;
  residualBill: number; // What goes to Energisa
  subscriptionCost: number; // What goes to i9
  fioBTax: number;
  // Competitor Comparison
  hasCompetitor?: boolean;
  competitorTotalValue?: number;
  competitorSavings?: number; // How much they save today
  extraSavings?: number; // How much MORE they save with i9
}
