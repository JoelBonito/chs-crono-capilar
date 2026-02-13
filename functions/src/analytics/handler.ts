import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import type { Request, Response } from "express";
import { aggregateDailyMetrics } from "./aggregator";
import { verifyAuth } from "../shared/auth";
import { logInfo, logError } from "../shared/logger";

const db = admin.firestore();

/**
 * Scheduled handler for daily metrics aggregation.
 * Triggered by Cloud Scheduler via Pub/Sub at 02:00 UTC.
 */
export async function handleAggregateMetrics(): Promise<void> {
  // Process yesterday's data
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const date = yesterday.toISOString().split("T")[0]!;

  logInfo("analytics/aggregation-start", { date });

  // Check if already aggregated (idempotency)
  const existing = await db.collection("adminMetrics").doc(date).get();
  if (existing.exists && existing.data()?.status === "success") {
    logInfo("analytics/already-aggregated", { date });
    return;
  }

  try {
    const metrics = await aggregateDailyMetrics(date);

    await db.collection("adminMetrics").doc(date).set(metrics);

    logInfo("analytics/aggregation-complete", {
      date,
      status: metrics.status,
      durationMs: metrics.executionDurationMs,
      diagnostics: metrics.totalDiagnostics,
      smsSent: metrics.totalSMSSent,
    });
  } catch (err) {
    logError("analytics/aggregation-failed", err, { date });

    // Save partial failure record
    await db.collection("adminMetrics").doc(date).set({
      date,
      status: "failed",
      errorMessage: err instanceof Error ? err.message : String(err),
      executedAt: FieldValue.serverTimestamp(),
      version: "1.0",
    });

    throw err; // Re-throw so Cloud Scheduler knows to retry
  }
}

/**
 * HTTP handler for GET /getAdminStats
 * Returns aggregated metrics for a date range.
 * Requires admin role.
 */
export async function handleGetAdminStats(req: Request, res: Response): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const decodedToken = await verifyAuth(req);
  if (!decodedToken) {
    res.status(401).json({ error: "auth/unauthorized", message: "Token JWT manquant ou invalide." });
    return;
  }

  // Check admin role
  if (decodedToken.role !== "admin_chs") {
    res.status(403).json({ error: "auth/forbidden", message: "Accès réservé aux administrateurs." });
    return;
  }

  const startDate = req.query.startDate as string | undefined;
  const endDate = req.query.endDate as string | undefined;

  if (!startDate || !endDate) {
    res.status(400).json({
      error: "analytics/invalid-params",
      message: "Paramètres startDate et endDate requis (format YYYY-MM-DD).",
    });
    return;
  }

  try {
    const snap = await db
      .collection("adminMetrics")
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .orderBy("date", "asc")
      .get();

    const daily = snap.docs.map((doc) => doc.data());

    // Compute summary
    const summary = daily.reduce(
      (acc, d) => ({
        totalDiagnostics: acc.totalDiagnostics + (d.totalDiagnostics ?? 0),
        totalSMSSent: acc.totalSMSSent + (d.totalSMSSent ?? 0),
        smsDelivered: acc.smsDelivered + (d.smsDelivered ?? 0),
        smsFailed: acc.smsFailed + (d.smsFailed ?? 0),
        newUsers: acc.newUsers + (d.newUsers ?? 0),
      }),
      { totalDiagnostics: 0, totalSMSSent: 0, smsDelivered: 0, smsFailed: 0, newUsers: 0 },
    );

    res.status(200).json({
      period: { start: startDate, end: endDate },
      summary: {
        ...summary,
        smsFailureRate: summary.totalSMSSent > 0
          ? Number(((summary.smsFailed / summary.totalSMSSent) * 100).toFixed(2))
          : 0,
      },
      daily,
    });
  } catch (err) {
    logError("analytics/query-failed", err, { startDate, endDate });
    res.status(500).json({
      error: "analytics/query-failed",
      message: "Impossible de récupérer les métriques.",
    });
  }
}
