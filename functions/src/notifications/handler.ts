import * as admin from "firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { Request, Response } from "express";
import {
  sendNotificationRequestSchema,
  MAX_SMS_PER_DAY,
  MAX_RETRIES,
  RETRY_DELAYS_MS,
} from "./schemas";
import { renderTemplate } from "./templates";
import { sendSMS } from "./sender";
import { verifyAuth } from "../shared/auth";
import { logInfo, logError, logWarn } from "../shared/logger";

const db = admin.firestore();

/**
 * HTTP handler for POST /sendNotification
 * Sends an SMS notification via Twilio with rate limiting and idempotency.
 */
export async function handleSendNotification(req: Request, res: Response): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const decodedToken = await verifyAuth(req);
  if (!decodedToken) {
    res.status(401).json({ error: "auth/unauthorized", message: "Token JWT manquant ou invalide." });
    return;
  }

  const parsed = sendNotificationRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    logWarn("notification/validation-failed", { issues: parsed.error.issues });
    res.status(400).json({
      error: "notification/invalid-request",
      message: "Données invalides.",
    });
    return;
  }

  const { userId, type, channel, data } = parsed.data;

  if (decodedToken.uid !== userId) {
    res.status(403).json({ error: "auth/forbidden", message: "Accès non autorisé." });
    return;
  }

  // Check SMS opt-in (RGPD compliance)
  if (channel === "sms") {
    const userSnap = await db.collection("users").doc(userId).get();
    const userData = userSnap.data();
    if (!userData?.optInSMS) {
      res.status(403).json({
        error: "notification/no-consent",
        message: "L'utilisateur n'a pas activé les notifications SMS.",
      });
      return;
    }
  }

  // Rate limiting: max SMS per day per user
  if (channel === "sms") {
    const today = new Date().toISOString().split("T")[0]!;
    const todayStart = Timestamp.fromDate(new Date(`${today}T00:00:00Z`));

    const recentSMS = await db
      .collection("notifications")
      .where("userId", "==", userId)
      .where("channel", "==", "sms")
      .where("createdAt", ">=", todayStart)
      .count()
      .get();

    if (recentSMS.data().count >= MAX_SMS_PER_DAY) {
      logWarn("notification/rate-limited", { userId, count: recentSMS.data().count });
      res.status(429).json({
        error: "notification/rate-limited",
        message: `Limite de ${MAX_SMS_PER_DAY} SMS par jour atteinte.`,
      });
      return;
    }
  }

  // Idempotency check: same type + user + day = skip
  const today = new Date().toISOString().split("T")[0]!;
  const idempotencyKey = `${userId}_${type}_${today}`;
  const existingSnap = await db
    .collection("notifications")
    .where("idempotencyKey", "==", idempotencyKey)
    .where("status", "in", ["sent", "delivered"])
    .limit(1)
    .get();

  if (!existingSnap.empty) {
    logInfo("notification/duplicate-skipped", { userId, type, idempotencyKey });
    res.status(200).json({
      notificationId: existingSnap.docs[0]!.id,
      status: "already_sent",
      message: "Notification déjà envoyée aujourd'hui.",
    });
    return;
  }

  // Render message
  const messageBody = renderTemplate(type, {
    firstName: data.firstName,
    productName: data.productName,
    productLink: data.productLink,
    treatmentName: data.treatmentName,
  });

  // Create notification record
  const notifRef = db.collection("notifications").doc();
  const notificationId = notifRef.id;

  await notifRef.set({
    id: notificationId,
    userId,
    type,
    channel,
    status: "pending",
    phoneNumber: data.phoneNumber,
    messageBody,
    idempotencyKey,
    retryCount: 0,
    provider: "twilio",
    createdAt: FieldValue.serverTimestamp(),
  });

  // Send SMS
  if (channel === "sms") {
    const result = await sendSMS({ to: data.phoneNumber, body: messageBody });

    if (result.success) {
      await notifRef.update({
        status: "sent",
        twilioSid: result.sid,
        sentAt: FieldValue.serverTimestamp(),
      });

      logInfo("notification/sent", { notificationId, userId, type, channel });

      res.status(200).json({
        notificationId,
        status: "sent",
        channel: "sms",
        sentAt: new Date().toISOString(),
      });
    } else {
      // Mark as failed, schedule retry
      const nextRetryAt = new Date(Date.now() + (RETRY_DELAYS_MS[0] ?? 60_000));

      await notifRef.update({
        status: "failed",
        errorMessage: result.errorMessage,
        retryCount: 1,
        nextRetryAt: Timestamp.fromDate(nextRetryAt),
      });

      logError("notification/send-failed", result.errorMessage, {
        notificationId, userId, type,
      });

      res.status(500).json({
        notificationId,
        status: "failed",
        errorMessage: "Échec de l'envoi du SMS. Une nouvelle tentative sera effectuée.",
      });
    }
  } else {
    // Email channel — placeholder for SendGrid integration
    await notifRef.update({ status: "sent", sentAt: FieldValue.serverTimestamp() });
    res.status(200).json({ notificationId, status: "sent", channel: "email" });
  }
}

/**
 * Process pending retries for failed notifications.
 * Called by Cloud Scheduler every 5 minutes.
 */
export async function handleRetryNotifications(): Promise<void> {
  const now = Timestamp.now();

  const pendingRetries = await db
    .collection("notifications")
    .where("status", "==", "failed")
    .where("nextRetryAt", "<=", now)
    .where("retryCount", "<", MAX_RETRIES)
    .limit(50)
    .get();

  if (pendingRetries.empty) return;

  logInfo("notification/retry-batch", { count: pendingRetries.size });

  for (const doc of pendingRetries.docs) {
    const notif = doc.data();

    if (notif.channel !== "sms") continue;

    const result = await sendSMS({ to: notif.phoneNumber, body: notif.messageBody });
    const retryCount = (notif.retryCount ?? 0) + 1;

    if (result.success) {
      await doc.ref.update({
        status: "sent",
        twilioSid: result.sid,
        sentAt: FieldValue.serverTimestamp(),
        retryCount,
      });

      logInfo("notification/retry-success", { notificationId: doc.id, retryCount });
    } else {
      const nextDelay = RETRY_DELAYS_MS[retryCount] ?? RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1]!;
      const nextRetryAt = new Date(Date.now() + nextDelay);

      const update: Record<string, unknown> = {
        errorMessage: result.errorMessage,
        retryCount,
      };

      if (retryCount >= MAX_RETRIES) {
        update.status = "failed";
        update.nextRetryAt = null;
        logError("notification/retry-exhausted", result.errorMessage, { notificationId: doc.id });
      } else {
        update.nextRetryAt = Timestamp.fromDate(nextRetryAt);
      }

      await doc.ref.update(update);
    }
  }
}
