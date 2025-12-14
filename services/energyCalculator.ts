import { PhaseType, Distribuidora, SimulationParams, SimulationResult } from '../types';

// Constants defined in the Blueprint
const CONSTANTS = {
  TARIFA_MEDIA: 0.95, // R$/kWh
  ILUM_PUBLICA: 25.00, // R$
  TUSD_FIO_B: 0.28, // R$/kWh estimated component
  PERCENTUAL_FIO_B_2025: 0.45, // 45% non-compensable in 2025
  DESCONTO_OFERECIDO: 0.15, // 15% guaranteed discount on energy
};

const MINIMUM_CONSUMPTION = {
  [PhaseType.MONOFASICO]: 30,
  [PhaseType.BIFASICO]: 50,
  [PhaseType.TRIFASICO]: 100,
};

export const calculateSavings = (params: SimulationParams): SimulationResult => {
  const { billValue, phase } = params;

  // 1. Estimate Consumption (kWh) based on current bill
  // Formula: (Bill - CIP) / Tariff. Using simplified reverse calc for MVP.
  const estimatedConsumptionKwh = Math.round(billValue / CONSTANTS.TARIFA_MEDIA);

  // 2. Define Regulatory Minimum (Custo de Disponibilidade)
  const minConsumptionKwh = MINIMUM_CONSUMPTION[phase];

  // 3. Calculate Compensable Energy
  // The customer must pay at least the minimum to the utility.
  // Credits can only offset consumption ABOVE the minimum.
  let compensableEnergyKwh = estimatedConsumptionKwh - minConsumptionKwh;

  if (compensableEnergyKwh < 0) {
    compensableEnergyKwh = 0;
  }

  // 4. Calculate Gross Value of Compensable Energy
  const grossCompensableValue = compensableEnergyKwh * CONSTANTS.TARIFA_MEDIA;

  // 5. Calculate "Fio B" Tax (The "toll" for using the grid)
  // Law 14.300/2022: In 2025, user pays 45% of Fio B component on compensated energy.
  const fioBTax = compensableEnergyKwh * CONSTANTS.TUSD_FIO_B * CONSTANTS.PERCENTUAL_FIO_B_2025;

  // 6. Calculate Net Credit Value (Effective value of the injected energy)
  // The credit covers the energy, but the user still pays the Fio B portion to utility (or it's deducted)
  // In the subscription model, we usually treat it as:
  // Subscription Price = (Gross Value - Fio B Cost) * (1 - Discount)

  // We simplify: The customer "stops paying" the Gross Value to Energisa.
  // Instead, they pay:
  // a) Residual Bill to Energisa (Min + CIP + Fio B Tax)
  // b) Subscription to i9 (Compensable Energy * Rate with Discount)

  // i9 Price Calculation:
  // The "value" delivered is the energy credit.
  // i9 charges for that credit with a discount applied to the *net benefit*.
  const subscriptionCost = (grossCompensableValue - fioBTax) * (1 - CONSTANTS.DESCONTO_OFERECIDO);

  // 7. Calculate Residual Bill (Energisa)
  const costOfAvailability = minConsumptionKwh * CONSTANTS.TARIFA_MEDIA;
  const residualBill = costOfAvailability + CONSTANTS.ILUM_PUBLICA + fioBTax;

  // 8. Total New Monthly Cost
  const newTotalValue = subscriptionCost + residualBill;

  // 9. Savings
  const monthlySavings = billValue - newTotalValue;
  const annualSavings = monthlySavings * 12;

  const result: SimulationResult = {
    estimatedConsumptionKwh,
    minConsumptionKwh,
    compensableEnergyKwh,
    originalBillValue: billValue,
    newTotalValue,
    monthlySavings: monthlySavings > 0 ? monthlySavings : 0,
    annualSavings: annualSavings > 0 ? annualSavings : 0,
    residualBill,
    subscriptionCost,
    fioBTax,
    hasCompetitor: params.hasCompetitor,
    competitorTotalValue: 0,
    competitorSavings: 0,
    extraSavings: 0
  };

  if (params.hasCompetitor) {
    // Competitor Logic:
    // Even if discount is 0, we calculate the subscription cost.
    const discount = params.competitorDiscount || 0;
    const competitorDiscountDecimal = discount / 100;

    // Subscription = (Gross - FioB) * (1 - CompetitorDiscount)
    const competitorSubscriptionCost = (grossCompensableValue - fioBTax) * (1 - competitorDiscountDecimal);
    const competitorTotalValue = competitorSubscriptionCost + residualBill;

    const competitorMonthlySavings = billValue - competitorTotalValue;
    const extraMonthlySavings = competitorTotalValue - newTotalValue;

    return {
      ...result,
      competitorTotalValue,
      competitorSavings: competitorMonthlySavings > 0 ? competitorMonthlySavings : 0,
      extraSavings: extraMonthlySavings * 12 // Annual Extra Savings with i9
    };
  }

  return result;
};