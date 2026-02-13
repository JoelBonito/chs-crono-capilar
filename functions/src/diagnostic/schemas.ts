import { z } from "zod";

// Request schema for analyzeHair endpoint
export const analyzeHairRequestSchema = z.object({
  userId: z.string().min(1),
  photoUrls: z.array(
    z.string().url().refine(
      (url) => {
        try {
          const parsed = new URL(url);
          return (
            parsed.protocol === "https:" &&
            (parsed.hostname.endsWith(".googleapis.com") ||
             parsed.hostname.endsWith(".appspot.com"))
          );
        } catch {
          return false;
        }
      },
      { message: "Only Firebase Storage URLs are allowed." },
    ),
  ).min(1).max(5),
  context: z.object({
    scalpType: z.enum(["oily", "dry", "normal", "combination"]).optional(),
    washingFrequency: z.enum(["daily", "every_2_days", "every_3_days", "weekly"]).optional(),
    chemicalTreatments: z.boolean().optional(),
    currentComplaints: z.string().max(500).optional(),
  }).optional(),
});

export type AnalyzeHairRequest = z.infer<typeof analyzeHairRequestSchema>;

// Expected structured output from Gemini
export const geminiResponseSchema = z.object({
  hairType: z.enum(["dry", "oily", "normal", "mixed", "damaged"]),
  porosity: z.enum(["low", "medium", "high"]),
  recommendedAction: z.string().min(10).max(500),
  technicalSummary: z.string().min(20).max(1000),
});

export type GeminiDiagnosticResponse = z.infer<typeof geminiResponseSchema>;

// Firestore diagnostic document
export interface DiagnosticDocument {
  id: string;
  userId: string;
  hairType: string;
  porosity: string;
  recommendedAction: string;
  technicalSummary: string;
  photoUrls: string[];
  status: "pending" | "completed" | "failed";
  analyzedAt: FirebaseFirestore.Timestamp | null;
  createdAt: FirebaseFirestore.FieldValue;
  geminiModelVersion: string;
  isFallback: boolean;
}
