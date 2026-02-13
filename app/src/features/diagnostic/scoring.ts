// H/N/R scoring engine for hair diagnostic
// Implements accumulation, normalization, and validation per spec

import { QUESTIONS } from "./questions";

export interface RawScores {
  H: number;
  N: number;
  R: number;
}

export interface DiagnosticResult {
  hydrationNeed: number;
  nutritionNeed: number;
  reconstructionNeed: number;
  dominantNeed: "H" | "N" | "R";
}

export type HairType = "dry" | "oily" | "normal" | "mixed" | "damaged";
export type Porosity = "low" | "medium" | "high";

type Answers = Record<string, string | string[]>;

/**
 * Accumulate H/N/R weights from all questionnaire answers.
 */
export function accumulateScores(answers: Answers): RawScores {
  const scores: RawScores = { H: 0, N: 0, R: 0 };
  const questionMap = new Map(QUESTIONS.map((q) => [q.id, q]));

  for (const [questionId, answer] of Object.entries(answers)) {
    const question = questionMap.get(questionId);
    if (!question) continue;

    const selectedValues = Array.isArray(answer) ? answer : [answer];

    for (const valor of selectedValues) {
      const option = question.opcoes.find((o) => o.valor === valor);
      if (!option) continue;
      scores.H += option.peso.H;
      scores.N += option.peso.N;
      scores.R += option.peso.R;
    }
  }

  return scores;
}

/**
 * Normalize raw scores to percentages with constraints:
 * - Each axis minimum 10%
 * - Reconstruction maximum 40%
 * - Sum = 100%
 */
export function normalizeScores(raw: RawScores): DiagnosticResult {
  // Clamp negatives to zero
  const scores = {
    H: Math.max(0, raw.H),
    N: Math.max(0, raw.N),
    R: Math.max(0, raw.R),
  };

  const total = scores.H + scores.N + scores.R;

  // Edge case: no scores at all
  if (total === 0) {
    return { hydrationNeed: 33, nutritionNeed: 33, reconstructionNeed: 34, dominantNeed: "H" };
  }

  // Convert to percentages
  let h = Math.round((scores.H / total) * 100);
  let n = Math.round((scores.N / total) * 100);
  let r = Math.round((scores.R / total) * 100);

  // Cap R at 40%
  if (r > 40) {
    const excess = r - 40;
    r = 40;
    const hnSum = h + n || 1;
    const hShare = Math.round(excess * (h / hnSum));
    h += hShare;
    n += excess - hShare;
  }

  // Enforce minimum 10% for each
  function applyMin(a: number, b: number, c: number): [number, number, number] {
    if (a < 10) {
      const deficit = 10 - a;
      a = 10;
      const sum = b + c || 1;
      const subB = Math.floor(deficit * (b / sum));
      b = Math.max(10, b - subB);
      c = Math.max(10, c - (deficit - subB));
    }
    return [a, b, c];
  }

  [h, n, r] = applyMin(h, n, r);
  [n, h, r] = applyMin(n, h, r);
  [r, h, n] = applyMin(r, h, n);

  // Ensure sum = 100
  const sum = h + n + r;
  if (sum !== 100) {
    h += 100 - sum;
  }

  // Determine dominant need
  let dominant: "H" | "N" | "R" = "H";
  if (n > h && n > r) dominant = "N";
  else if (r > h && r > n) dominant = "R";

  return { hydrationNeed: h, nutritionNeed: n, reconstructionNeed: r, dominantNeed: dominant };
}

/**
 * Validate that a diagnostic result satisfies all constraints.
 */
export function validateResult(result: DiagnosticResult): boolean {
  const sum = result.hydrationNeed + result.nutritionNeed + result.reconstructionNeed;
  if (sum !== 100) return false;
  if (result.hydrationNeed < 10 || result.nutritionNeed < 10 || result.reconstructionNeed < 10) return false;
  if (result.reconstructionNeed > 40) return false;
  return true;
}

/**
 * Combine questionnaire (70%) and photo analysis (30%) results.
 */
export function combineWithPhotoAnalysis(
  questionnaire: DiagnosticResult,
  photo: DiagnosticResult,
): DiagnosticResult {
  const combined: RawScores = {
    H: Math.round(questionnaire.hydrationNeed * 0.7 + photo.hydrationNeed * 0.3),
    N: Math.round(questionnaire.nutritionNeed * 0.7 + photo.nutritionNeed * 0.3),
    R: Math.round(questionnaire.reconstructionNeed * 0.7 + photo.reconstructionNeed * 0.3),
  };
  return normalizeScores(combined);
}

/**
 * Map H/N/R diagnostic result to a hairType for backend compatibility
 * (the schedule generator uses hairType to select treatment patterns).
 */
export function mapToHairType(result: DiagnosticResult): HairType {
  const { hydrationNeed: h, nutritionNeed: n, reconstructionNeed: r } = result;

  // High reconstruction → damaged
  if (r >= 35) return "damaged";

  // Dominant hydration → dry
  if (h >= 45) return "dry";

  // Dominant nutrition → oily (nutrition needs often correlate with oily/porous hair)
  if (n >= 45) return "oily";

  // Balanced but with moderate R → mixed
  if (r >= 25 && Math.abs(h - n) <= 10) return "mixed";

  // Roughly balanced → normal
  if (Math.abs(h - n) <= 10 && r <= 20) return "normal";

  // Default: use dominant
  if (h > n) return "dry";
  return "oily";
}

/**
 * Derive porosity from questionnaire answers (Q08 and Q16).
 */
export function mapToPorosity(answers: Answers): Porosity {
  // Prefer Q16 (advanced water glass test) if answered
  const q16 = answers["Q16"] as string | undefined;
  if (q16) {
    if (q16 === "floats") return "low";
    if (q16 === "middle") return "medium";
    if (q16 === "sinks") return "high";
  }

  // Fall back to Q08 (basic porosity)
  const q08 = answers["Q08"] as string | undefined;
  if (q08) {
    if (q08 === "repels") return "low";
    if (q08 === "absorbs_normal") return "medium";
    if (q08 === "absorbs_fast") return "high";
  }

  // Default if neither answered
  return "medium";
}
