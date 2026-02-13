import { VertexAI } from "@google-cloud/vertexai";
import { GEMINI_MODEL, REGION } from "../shared/config";
import { type GeminiDiagnosticResponse, type AnalyzeHairRequest } from "./schemas";
import { buildDiagnosticPrompt } from "./prompt";
import { parseGeminiResponse, buildFallbackDiagnostic, ParseError } from "./parser";
import { logInfo, logError, logWarn } from "../shared/logger";

let vertexAI: VertexAI | null = null;

function getVertexAI(projectId: string): VertexAI {
  if (!vertexAI) {
    vertexAI = new VertexAI({ project: projectId, location: REGION });
  }
  return vertexAI;
}

/**
 * Call Gemini and return the raw text response.
 */
async function callGemini(
  prompt: string,
  photoUrls: string[],
  projectId: string,
): Promise<string> {
  const ai = getVertexAI(projectId);
  const model = ai.getGenerativeModel({ model: GEMINI_MODEL });

  const imageParts = photoUrls.map((url) => ({
    fileData: { mimeType: "image/jpeg" as const, fileUri: url },
  }));

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }, ...imageParts],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1024,
      responseMimeType: "application/json",
    },
  });

  const textContent = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) {
    throw new Error("Gemini returned an empty response");
  }
  return textContent;
}

/**
 * Retry prompt: simpler, more constrained, used when first attempt fails parsing.
 */
function buildRetryPrompt(): string {
  return `La réponse précédente n'était pas au format attendu. Réponds UNIQUEMENT avec un JSON valide dans ce format exact, sans aucun texte avant ou après :

{
  "hairType": "dry",
  "porosity": "medium",
  "recommendedAction": "Description en français",
  "technicalSummary": "Résumé en français"
}

Valeurs autorisées pour hairType : "dry", "oily", "normal", "mixed", "damaged"
Valeurs autorisées pour porosity : "low", "medium", "high"`;
}

/**
 * Analyze hair photos using Gemini via Vertex AI.
 * Includes retry with simplified prompt and fallback to textual diagnostic.
 */
export async function analyzeHairWithGemini(
  request: AnalyzeHairRequest,
  projectId: string,
): Promise<{ result: GeminiDiagnosticResponse; isFallback: boolean }> {
  const { userId, photoUrls, context } = request;

  logInfo("gemini/request", {
    userId,
    model: GEMINI_MODEL,
    photoCount: photoUrls.length,
  });

  // Attempt 1: Full diagnostic prompt
  try {
    const prompt = buildDiagnosticPrompt(request);
    const rawText = await callGemini(prompt, photoUrls, projectId);

    logInfo("gemini/raw-response", { userId, responseLength: rawText.length });

    const result = parseGeminiResponse(rawText, userId);
    logInfo("gemini/success", { userId, hairType: result.hairType, porosity: result.porosity });
    return { result, isFallback: false };
  } catch (err) {
    if (err instanceof ParseError) {
      logWarn("gemini/attempt1-parse-failed", {
        userId,
        phase: err.phase,
        message: err.message,
      });
    } else {
      logError("gemini/attempt1-failed", err, { userId });
    }
  }

  // Attempt 2: Retry with simplified prompt
  try {
    logInfo("gemini/retry", { userId });
    const retryPrompt = buildRetryPrompt();
    const rawText = await callGemini(retryPrompt, photoUrls, projectId);
    const result = parseGeminiResponse(rawText, userId);

    logInfo("gemini/retry-success", { userId, hairType: result.hairType });
    return { result, isFallback: false };
  } catch (err) {
    logError("gemini/retry-failed", err, { userId });
  }

  // Attempt 3: Textual fallback based on questionnaire context
  logWarn("gemini/fallback", { userId });
  const fallback = buildFallbackDiagnostic(context);
  return { result: fallback, isFallback: true };
}
