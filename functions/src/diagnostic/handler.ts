import "../init"; // Must be first
import * as admin from "firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { Request, Response } from "express";
import { analyzeHairRequestSchema } from "./schemas";
import { analyzeHairWithGemini } from "./analyzer";
import { verifyAuth } from "../shared/auth";
import { MAX_DIAGNOSTICS_PER_DAY, GEMINI_MODEL } from "../shared/config";
import { logInfo, logError, logWarn } from "../shared/logger";

const db = admin.firestore();

/**
 * Check rate limit: max N diagnostics per user per day.
 */
async function checkRateLimit(userId: string): Promise<boolean> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const snapshot = await db
    .collection("diagnostics")
    .where("userId", "==", userId)
    .where("createdAt", ">=", Timestamp.fromDate(todayStart))
    .count()
    .get();

  return snapshot.data().count < MAX_DIAGNOSTICS_PER_DAY;
}

/**
 * HTTP handler for POST /analyzeHair
 */
export async function handleAnalyzeHair(req: Request, res: Response): Promise<void> {
  // Only POST
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Verify authentication
  const decodedToken = await verifyAuth(req);
  if (!decodedToken) {
    res.status(401).json({ error: "auth/unauthorized", message: "Token JWT manquant ou invalide." });
    return;
  }

  // Validate request body
  const parsed = analyzeHairRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    logWarn("diagnostic/validation-failed", { issues: parsed.error.issues });
    res.status(400).json({
      error: "diagnostic/invalid-request",
      message: "Données invalides.",
    });
    return;
  }

  const { userId, photoUrls, context } = parsed.data;

  // Ensure the authenticated user matches the request
  if (decodedToken.uid !== userId) {
    res.status(403).json({ error: "auth/forbidden", message: "Accès non autorisé." });
    return;
  }

  // Rate limit check
  const withinLimit = await checkRateLimit(userId);
  if (!withinLimit) {
    logWarn("diagnostic/rate-limited", { userId });
    res.status(429).json({
      error: "diagnostic/rate-limited",
      message: `Limite de ${MAX_DIAGNOSTICS_PER_DAY} diagnostics par jour atteinte.`,
    });
    return;
  }

  // Create a pending diagnostic document
  const diagnosticRef = db.collection("diagnostics").doc();
  const diagnosticId = diagnosticRef.id;

  await diagnosticRef.set({
    id: diagnosticId,
    userId,
    photoUrls,
    status: "pending",
    createdAt: FieldValue.serverTimestamp(),
    hairType: "",
    porosity: "",
    recommendedAction: "",
    technicalSummary: "",
    analyzedAt: null,
    geminiModelVersion: GEMINI_MODEL,
  });

  logInfo("diagnostic/created", { diagnosticId, userId, photoCount: photoUrls.length });

  // Call Gemini for analysis (includes retry + fallback)
  try {
    const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || "";
    const { result, isFallback } = await analyzeHairWithGemini(
      { userId, photoUrls, context },
      projectId,
    );

    // Update diagnostic with results
    await diagnosticRef.update({
      hairType: result.hairType,
      porosity: result.porosity,
      recommendedAction: result.recommendedAction,
      technicalSummary: result.technicalSummary,
      status: "completed",
      analyzedAt: FieldValue.serverTimestamp(),
      isFallback,
    });

    logInfo("diagnostic/completed", {
      diagnosticId, userId, hairType: result.hairType, isFallback,
    });

    res.status(200).json({
      diagnosticId,
      hairType: result.hairType,
      porosity: result.porosity,
      recommendedAction: result.recommendedAction,
      technicalSummary: result.technicalSummary,
      analyzedAt: new Date().toISOString(),
      geminiModelVersion: isFallback ? "fallback-textual" : GEMINI_MODEL,
      isFallback,
    });
  } catch (err) {
    // Mark diagnostic as failed (should rarely happen since analyzer has fallback)
    await diagnosticRef.update({ status: "failed" });

    logError("diagnostic/analysis-failed", err, { diagnosticId, userId });

    res.status(500).json({
      error: "integration/provider-down",
      diagnosticId,
      message: "Analyse indisponible. Veuillez réessayer.",
    });
  }
}
