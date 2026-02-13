import * as admin from "firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { Request, Response } from "express";
import { registerProductRequestSchema } from "./schemas";
import { calculateConsumption, estimateDepletionDate } from "./calculator";
import { verifyAuth } from "../shared/auth";
import { logInfo, logError, logWarn } from "../shared/logger";

const db = admin.firestore();

/**
 * HTTP handler for POST /registerProduct
 * Registers a product and calculates initial consumption estimates.
 */
export async function handleRegisterProduct(req: Request, res: Response): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const decodedToken = await verifyAuth(req);
  if (!decodedToken) {
    res.status(401).json({ error: "auth/unauthorized", message: "Token JWT manquant ou invalide." });
    return;
  }

  const parsed = registerProductRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    logWarn("product/validation-failed", { issues: parsed.error.issues });
    res.status(400).json({
      error: "product/invalid-request",
      message: "Données invalides.",
    });
    return;
  }

  const { userId, name, type, totalVolumeMl, usagePerSessionMl } = parsed.data;

  if (decodedToken.uid !== userId) {
    res.status(403).json({ error: "auth/forbidden", message: "Accès non autorisé." });
    return;
  }

  // Fetch active schedule to compute depletion estimate
  let estimatedDepletion: Timestamp | null = null;

  try {
    const scheduleSnap = await db
      .collection("schedules")
      .where("userId", "==", userId)
      .where("status", "==", "active")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (!scheduleSnap.empty) {
      const schedule = scheduleSnap.docs[0]!.data();
      const startAt = schedule.startAt?.toDate
        ? (schedule.startAt.toDate() as Date).toISOString()
        : schedule.startAt;

      // Rebuild upcoming session dates from schedule data
      const { buildCalendarEvents } = await import("../schedule/generator");
      const events = buildCalendarEvents(
        schedule.sequence,
        startAt,
        schedule.daysOfWeek,
        schedule.time,
      );
      const upcomingDates = events.map((e: { date: string }) => e.date);

      const depletionDate = estimateDepletionDate({
        remainingMl: totalVolumeMl,
        usagePerSessionMl,
        upcomingSessionDates: upcomingDates,
      });

      if (depletionDate) {
        estimatedDepletion = Timestamp.fromDate(depletionDate);
      }
    }
  } catch (err) {
    logError("product/schedule-lookup-failed", err, { userId });
    // Non-blocking: continue without depletion estimate
  }

  const consumption = calculateConsumption({
    totalVolumeMl,
    usagePerSessionMl,
    sessionsCompleted: 0,
  });

  const productRef = db.collection("products").doc();
  const productId = productRef.id;

  try {
    await productRef.set({
      id: productId,
      userId,
      name,
      type,
      totalVolumeMl,
      usagePerSessionMl,
      sessionsCompleted: 0,
      remainingMl: consumption.remainingMl,
      estimatedDepletion,
      lowStock: consumption.lowStock,
      status: consumption.status,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    logInfo("product/registered", { productId, userId, type, totalVolumeMl });

    res.status(201).json({
      productId,
      userId,
      name,
      type,
      totalVolumeMl,
      usagePerSessionMl,
      remainingMl: consumption.remainingMl,
      lowStock: consumption.lowStock,
      status: consumption.status,
      estimatedDepletion: estimatedDepletion?.toDate().toISOString() ?? null,
    });
  } catch (err) {
    logError("product/register-failed", err, { userId });
    res.status(500).json({
      error: "product/register-failed",
      message: "Impossible d'enregistrer le produit. Veuillez réessayer.",
    });
  }
}

/**
 * HTTP handler for POST /updateProductUsage
 * Called after a treatment session to update consumption.
 */
export async function handleUpdateProductUsage(req: Request, res: Response): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const decodedToken = await verifyAuth(req);
  if (!decodedToken) {
    res.status(401).json({ error: "auth/unauthorized", message: "Token JWT manquant ou invalide." });
    return;
  }

  const { productId } = req.body;
  if (typeof productId !== "string" || !productId) {
    res.status(400).json({ error: "product/invalid-request", message: "productId requis." });
    return;
  }

  try {
    type TxError = { ok: false; httpStatus: number; error: string; message: string };
    type TxSuccess = { ok: true; productId: string; userId: string; sessionsCompleted: number; remainingMl: number; lowStock: boolean; status: string };
    type TxResult = TxError | TxSuccess;

    const result: TxResult = await db.runTransaction(async (tx) => {
      const productRef = db.collection("products").doc(productId);
      const productSnap = await tx.get(productRef);

      if (!productSnap.exists) {
        return { ok: false, httpStatus: 404, error: "product/not-found", message: "Produit introuvable." };
      }

      const product = productSnap.data()!;

      if (product.userId !== decodedToken.uid) {
        return { ok: false, httpStatus: 403, error: "auth/forbidden", message: "Accès non autorisé." };
      }

      if (product.status === "depleted") {
        return { ok: false, httpStatus: 400, error: "product/depleted", message: "Ce produit est épuisé." };
      }

      const newSessionsCompleted = (product.sessionsCompleted ?? 0) + 1;

      const consumption = calculateConsumption({
        totalVolumeMl: product.totalVolumeMl,
        usagePerSessionMl: product.usagePerSessionMl,
        sessionsCompleted: newSessionsCompleted,
      });

      tx.update(productRef, {
        sessionsCompleted: newSessionsCompleted,
        remainingMl: consumption.remainingMl,
        lowStock: consumption.lowStock,
        status: consumption.status,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return {
        ok: true,
        productId,
        userId: product.userId as string,
        sessionsCompleted: newSessionsCompleted,
        remainingMl: consumption.remainingMl,
        lowStock: consumption.lowStock,
        status: consumption.status,
      };
    });

    if (!result.ok) {
      res.status(result.httpStatus).json({ error: result.error, message: result.message });
      return;
    }

    logInfo("product/usage-updated", {
      productId: result.productId,
      userId: result.userId,
      sessionsCompleted: result.sessionsCompleted,
      remainingMl: result.remainingMl,
      lowStock: result.lowStock,
    });

    res.status(200).json({
      productId: result.productId,
      sessionsCompleted: result.sessionsCompleted,
      remainingMl: result.remainingMl,
      lowStock: result.lowStock,
      status: result.status,
    });
  } catch (err) {
    logError("product/update-failed", err, { productId });
    res.status(500).json({
      error: "product/update-failed",
      message: "Impossible de mettre à jour le produit.",
    });
  }
}
