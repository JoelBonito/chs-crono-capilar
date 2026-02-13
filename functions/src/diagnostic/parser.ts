import { geminiResponseSchema, type GeminiDiagnosticResponse } from "./schemas";
import { logInfo, logWarn, logError } from "../shared/logger";

// Maps French/alternate terms to the expected enum values
const HAIR_TYPE_ALIASES: Record<string, GeminiDiagnosticResponse["hairType"]> = {
  sec: "dry",
  secs: "dry",
  dry: "dry",
  gras: "oily",
  oily: "oily",
  normal: "normal",
  mixte: "mixed",
  mixed: "mixed",
  abîmé: "damaged",
  abime: "damaged",
  damaged: "damaged",
  cassant: "damaged",
  déshydraté: "dry",
  deshydrate: "dry",
};

const POROSITY_ALIASES: Record<string, GeminiDiagnosticResponse["porosity"]> = {
  faible: "low",
  basse: "low",
  low: "low",
  moyenne: "medium",
  medium: "medium",
  haute: "high",
  élevée: "high",
  elevee: "high",
  high: "high",
};

export class ParseError extends Error {
  constructor(
    message: string,
    public readonly rawResponse: string,
    public readonly phase: "extract" | "json" | "validate" | "normalize",
  ) {
    super(message);
    this.name = "ParseError";
  }
}

/**
 * Extract JSON from raw Gemini text that may contain markdown fences or extra text.
 */
function extractJson(raw: string): string {
  // Try direct parse first
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) return trimmed;

  // Extract from markdown code fences: ```json ... ``` or ``` ... ```
  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch?.[1]) return fenceMatch[1].trim();

  // Find the first { and last } to extract embedded JSON
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.substring(firstBrace, lastBrace + 1);
  }

  throw new ParseError("No JSON object found in response", raw, "extract");
}

/**
 * Normalize a hairType value, accepting French terms and case variations.
 */
function normalizeHairType(value: unknown): GeminiDiagnosticResponse["hairType"] | null {
  if (typeof value !== "string") return null;
  const key = value.toLowerCase().trim();
  return HAIR_TYPE_ALIASES[key] ?? null;
}

/**
 * Normalize a porosity value, accepting French terms and case variations.
 */
function normalizePorosity(value: unknown): GeminiDiagnosticResponse["porosity"] | null {
  if (typeof value !== "string") return null;
  const key = value.toLowerCase().trim();
  return POROSITY_ALIASES[key] ?? null;
}

/**
 * Attempt to normalize a raw parsed object into the expected schema.
 * Handles cases where Gemini returns French enum values instead of English.
 */
function normalizeResponse(raw: Record<string, unknown>): Record<string, unknown> {
  const normalized = { ...raw };

  // Normalize hairType aliases
  if (raw.hairType) {
    const mapped = normalizeHairType(raw.hairType);
    if (mapped) normalized.hairType = mapped;
  }

  // Normalize porosity aliases
  if (raw.porosity) {
    const mapped = normalizePorosity(raw.porosity);
    if (mapped) normalized.porosity = mapped;
  }

  // Trim string fields
  if (typeof raw.recommendedAction === "string") {
    normalized.recommendedAction = raw.recommendedAction.trim();
  }
  if (typeof raw.technicalSummary === "string") {
    normalized.technicalSummary = raw.technicalSummary.trim();
  }

  return normalized;
}

/**
 * Parse and validate a raw Gemini response string into a structured diagnostic.
 * Handles JSON extraction, normalization of French terms, and Zod validation.
 *
 * @throws ParseError with phase information if parsing fails at any stage.
 */
export function parseGeminiResponse(
  rawText: string,
  userId: string,
): GeminiDiagnosticResponse {
  // Phase 1: Extract JSON from raw text
  let jsonString: string;
  try {
    jsonString = extractJson(rawText);
  } catch (err) {
    if (err instanceof ParseError) throw err;
    throw new ParseError("JSON extraction failed", rawText, "extract");
  }

  // Phase 2: Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    logError("parser/json-error", new Error("Invalid JSON"), {
      userId,
      rawFragment: jsonString.substring(0, 300),
    });
    throw new ParseError("Invalid JSON in extracted content", rawText, "json");
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new ParseError("Parsed content is not an object", rawText, "json");
  }

  // Phase 3: Normalize French terms → English enums
  const normalized = normalizeResponse(parsed as Record<string, unknown>);

  logInfo("parser/normalized", {
    userId,
    hairType: normalized.hairType,
    porosity: normalized.porosity,
  });

  // Phase 4: Validate with Zod
  const result = geminiResponseSchema.safeParse(normalized);
  if (!result.success) {
    logWarn("parser/validation-failed", {
      userId,
      zodErrors: result.error.issues,
      normalized,
    });
    throw new ParseError(
      `Schema validation failed: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
      rawText,
      "validate",
    );
  }

  return result.data;
}

/**
 * Build a textual fallback diagnostic when Gemini analysis fails entirely.
 * Based on user-provided context (questionnaire answers).
 */
export function buildFallbackDiagnostic(
  context?: { scalpType?: string; washingFrequency?: string; chemicalTreatments?: boolean },
): GeminiDiagnosticResponse {
  let hairType: GeminiDiagnosticResponse["hairType"] = "normal";
  let porosity: GeminiDiagnosticResponse["porosity"] = "medium";

  if (context?.scalpType) {
    const mapped = normalizeHairType(context.scalpType);
    if (mapped) hairType = mapped;
  }

  if (context?.chemicalTreatments) {
    hairType = "damaged";
    porosity = "high";
  }

  if (context?.washingFrequency === "daily") {
    if (hairType === "normal") hairType = "oily";
  }

  const actionMap: Record<string, string> = {
    dry: "Prioriser l'hydratation (H) avec au moins 2 séances par semaine dans votre chronogramme H/N/R.",
    oily: "Alterner hydratation légère (H) et nutrition (N), 2 à 3 fois par semaine dans votre chronogramme H/N/R.",
    normal: "Maintenir un équilibre H/N/R avec 1 séance de chaque type par semaine.",
    mixed: "Adapter le chronogramme H/N/R selon les zones : hydratation pour les pointes, soins légers pour les racines.",
    damaged: "Commencer par une phase intensive de reconstruction (R), puis alterner avec hydratation (H) dans votre chronogramme H/N/R.",
  };

  const summaryMap: Record<string, string> = {
    dry: "Diagnostic basé sur vos réponses au questionnaire. Vos cheveux présentent des signes de sécheresse. Un chronogramme adapté avec une priorité à l'hydratation est recommandé. Pour un diagnostic plus précis, veuillez réessayer l'analyse photo.",
    oily: "Diagnostic basé sur vos réponses au questionnaire. Votre cuir chevelu tend vers une production excessive de sébum. Un chronogramme équilibré avec des soins légers est recommandé. Pour un diagnostic plus précis, veuillez réessayer l'analyse photo.",
    normal: "Diagnostic basé sur vos réponses au questionnaire. Vos cheveux semblent en bonne santé. Un chronogramme d'entretien équilibré est recommandé. Pour un diagnostic plus précis, veuillez réessayer l'analyse photo.",
    mixed: "Diagnostic basé sur vos réponses au questionnaire. Vos cheveux présentent des caractéristiques mixtes. Un chronogramme adapté par zone est recommandé. Pour un diagnostic plus précis, veuillez réessayer l'analyse photo.",
    damaged: "Diagnostic basé sur vos réponses au questionnaire. Vos cheveux montrent des signes de dommages. Une phase de reconstruction intensive est recommandée avant de passer au chronogramme H/N/R régulier. Pour un diagnostic plus précis, veuillez réessayer l'analyse photo.",
  };

  return {
    hairType,
    porosity,
    recommendedAction: actionMap[hairType] ?? actionMap.normal,
    technicalSummary: summaryMap[hairType] ?? summaryMap.normal,
  };
}
