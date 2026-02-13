import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

interface AnalyzeHairRequest {
  userId: string;
  photoUrls: string[];
  context?: {
    scalpType?: "oily" | "dry" | "normal" | "combination";
    washingFrequency?: "daily" | "every_2_days" | "every_3_days" | "weekly";
    chemicalTreatments?: boolean;
    currentComplaints?: string;
  };
}

interface AnalyzeHairResponse {
  diagnosticId: string;
  hairType: "dry" | "oily" | "normal" | "mixed" | "damaged";
  porosity: "low" | "medium" | "high";
  recommendedAction: string;
  technicalSummary: string;
  analyzedAt: string;
  geminiModelVersion: string;
  isFallback: boolean;
}

/**
 * Call the analyzeHair Cloud Function via HTTP.
 * Uses the Firebase Auth token automatically.
 */
export async function analyzeHair(
  request: AnalyzeHairRequest,
  idToken: string,
): Promise<AnalyzeHairResponse> {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const baseUrl = import.meta.env.VITE_USE_EMULATORS === "true"
    ? `http://localhost:5001/${projectId}/europe-west1`
    : `https://europe-west1-${projectId}.cloudfunctions.net`;

  const response = await fetch(`${baseUrl}/analyzeHair`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Analyse indisponible. Veuillez réessayer.");
  }

  return response.json();
}

// Keep httpsCallable available for potential future onCall migration
export const analyzeHairCallable = httpsCallable<AnalyzeHairRequest, AnalyzeHairResponse>(
  functions,
  "analyzeHair",
);
