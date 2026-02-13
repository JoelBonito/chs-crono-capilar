import type { ProductType } from "./schemas";
import { LOW_STOCK_THRESHOLD_SESSIONS } from "./schemas";

interface ConsumptionInput {
  totalVolumeMl: number;
  usagePerSessionMl: number;
  sessionsCompleted: number;
}

interface DepletionInput {
  remainingMl: number;
  usagePerSessionMl: number;
  upcomingSessionDates: string[];
}

export interface ConsumptionResult {
  remainingMl: number;
  lowStock: boolean;
  status: "in_use" | "depleted";
}

/**
 * Calculate remaining product volume and low stock status.
 */
export function calculateConsumption(input: ConsumptionInput): ConsumptionResult {
  const { totalVolumeMl, usagePerSessionMl, sessionsCompleted } = input;

  const consumed = sessionsCompleted * usagePerSessionMl;
  const remainingMl = Math.max(0, totalVolumeMl - consumed);

  const sessionsLeft = usagePerSessionMl > 0
    ? Math.floor(remainingMl / usagePerSessionMl)
    : 0;

  const lowStock = sessionsLeft <= LOW_STOCK_THRESHOLD_SESSIONS;
  const status = remainingMl <= 0 ? "depleted" as const : "in_use" as const;

  return { remainingMl, lowStock, status };
}

/**
 * Estimate the depletion date based on upcoming scheduled sessions.
 * Returns null if no upcoming sessions or product already depleted.
 */
export function estimateDepletionDate(input: DepletionInput): Date | null {
  const { remainingMl, usagePerSessionMl, upcomingSessionDates } = input;

  if (remainingMl <= 0 || usagePerSessionMl <= 0 || upcomingSessionDates.length === 0) {
    return null;
  }

  const sessionsUntilEmpty = Math.ceil(remainingMl / usagePerSessionMl);

  // Sort dates chronologically
  const sorted = [...upcomingSessionDates].sort();

  // Find the session date when product will be depleted
  const depletionIndex = Math.min(sessionsUntilEmpty - 1, sorted.length - 1);
  const depletionDateStr = sorted[depletionIndex];

  if (!depletionDateStr) return null;

  return new Date(depletionDateStr);
}

/**
 * Map treatment type (H/N/R) to product type.
 */
export function treatmentToProductType(treatment: string): ProductType {
  switch (treatment) {
    case "H": return "hydration";
    case "N": return "nutrition";
    case "R": return "reconstruction";
    default: return "hydration";
  }
}
