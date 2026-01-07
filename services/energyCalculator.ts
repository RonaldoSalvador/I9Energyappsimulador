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

  // 1. Estimate Consumption (kWh)
  const estimatedConsumptionKwh = Math.round(billValue / CONSTANTS.TARIFA_MEDIA);

  // 2. Define Regulatory Minimum
  const minConsumptionKwh = MINIMUM_CONSUMPTION[phase];

  // 3. Calculate Compensable Energy
  let compensableEnergyKwh = estimatedConsumptionKwh - minConsumptionKwh;
  if (compensableEnergyKwh < 0) {
    compensableEnergyKwh = 0;
  }

  // 4. Calculate Gross Value of Compensable Energy
  const grossCompensableValue = compensableEnergyKwh * CONSTANTS.TARIFA_MEDIA;

  // 5. Calculate "Fio B" Tax
  const fioBTax = compensableEnergyKwh * CONSTANTS.TUSD_FIO_B * CONSTANTS.PERCENTUAL_FIO_B_2025;

  // 6. Calculate Residual Bill (Fixed Utility Cost)
  const costOfAvailability = minConsumptionKwh * CONSTANTS.TARIFA_MEDIA;
  const residualBill = costOfAvailability + CONSTANTS.ILUM_PUBLICA + fioBTax;

  // --- NEW TIERED LOGIC ---

  // Strategy: 
  // Months 1-3: 50% Discount
  // Months 4-12: Tiered Discount (25%, 28%, 30%)

  // Tier Calculation for Months 4-12
  let discount4to12 = 0.25; // Default < 1000
  if (billValue > 4000) {
    discount4to12 = 0.30;
  } else if (billValue >= 1000) {
    discount4to12 = 0.28;
  }

  const discount1to3 = 0.50;

  // Calculate Costs for Period 1 (Months 1-3)
  // Subscription = (Gross - FioB) * (1 - Discount)
  const subscriptionCost1to3 = (grossCompensableValue - fioBTax) * (1 - discount1to3);
  const totalCost1to3 = subscriptionCost1to3 + residualBill;
  const savings1to3 = billValue - totalCost1to3;

  // Calculate Costs for Period 2 (Months 4-12)
  const subscriptionCost4to12 = (grossCompensableValue - fioBTax) * (1 - discount4to12);
  const totalCost4to12 = subscriptionCost4to12 + residualBill;
  const savings4to12 = billValue - totalCost4to12;

  // Annual Totals
  const totalSavingsAnnual = (savings1to3 * 3) + (savings4to12 * 9);

  // For compatibility with UI that expects single values, we prioritize the "Immediate" (1-3) or average?
  // We'll return the 1-3 values for "monthlySavings" to maximize impact, but UI should explicitly read the new fields.
  const monthlySavings = savings1to3 > 0 ? savings1to3 : 0;
  const annualSavings = totalSavingsAnnual > 0 ? totalSavingsAnnual : 0;

  // Subscription Cost shown in generic UI -> average or immediate? Let's show immediate.
  const subscriptionCost = subscriptionCost1to3;
  const newTotalValue = totalCost1to3;

  const result: SimulationResult = {
    estimatedConsumptionKwh,
    minConsumptionKwh,
    compensableEnergyKwh,
    originalBillValue: billValue,

    newTotalValue, // Immediate (Mo 1-3)
    subscriptionCost, // Immediate (Mo 1-3)
    monthlySavings, // Immediate (Mo 1-3)
    annualSavings,

    residualBill,
    fioBTax,

    // New Fields
    savingsMonth1to3: savings1to3 > 0 ? savings1to3 : 0,
    savingsMonth4to12: savings4to12 > 0 ? savings4to12 : 0,
    discountAppliedMonth1to3: discount1to3,
    discountAppliedMonth4to12: discount4to12,
    monthlyCostMonth1to3: totalCost1to3,
    monthlyCostMonth4to12: totalCost4to12,

    hasCompetitor: params.hasCompetitor,
    competitorTotalValue: 0,
    competitorSavings: 0,
    extraSavings: 0
  };

  if (params.hasCompetitor) {
    const discount = params.competitorDiscount || 0;
    const competitorDiscountDecimal = discount / 100;

    // Competitor usually has flat discount year round
    const competitorSubscriptionCost = (grossCompensableValue - fioBTax) * (1 - competitorDiscountDecimal);
    const competitorTotal = competitorSubscriptionCost + residualBill;
    const competitorMonthlySavings = billValue - competitorTotal;

    // Extra Annual Savings: (My Annual Cost) vs (Competitor Annual Cost)
    const myAnnualCost = (totalCost1to3 * 3) + (totalCost4to12 * 9);
    const competitorAnnualCost = competitorTotal * 12;
    const extraAnnualSavings = competitorAnnualCost - myAnnualCost;

    return {
      ...result,
      competitorTotalValue: competitorTotal,
      competitorSavings: competitorMonthlySavings > 0 ? competitorMonthlySavings : 0,
      extraSavings: extraAnnualSavings > 0 ? extraAnnualSavings : 0
    };
  }

  return result;
};