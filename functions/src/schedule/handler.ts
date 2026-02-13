import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import type { Request, Response } from "express";
import { generateScheduleRequestSchema } from "./schemas";
import { generateSequence, buildCalendarEvents } from "./generator";
import { verifyAuth } from "../shared/auth";
import { logInfo, logError, logWarn } from "../shared/logger";
import { generateCalendarToken, calendarTokenSecret } from "../calendar/token";

const db = admin.firestore();

/**
 * HTTP handler for POST /generateSchedule
 */
export async function handleGenerateSchedule(req: Request, res: Response): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Auth
  const decodedToken = await verifyAuth(req);
  if (!decodedToken) {
    res.status(401).json({ error: "auth/unauthorized", message: "Token JWT manquant ou invalide." });
    return;
  }

  // Validate request
  const parsed = generateScheduleRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    logWarn("schedule/validation-failed", { issues: parsed.error.issues });
    res.status(400).json({
      error: "schedule/invalid-request",
      message: "Données invalides.",
    });
    return;
  }

  const { diagnosticId, userId, startAt, daysOfWeek, time } = parsed.data;

  // Verify ownership
  if (decodedToken.uid !== userId) {
    res.status(403).json({ error: "auth/forbidden", message: "Accès non autorisé." });
    return;
  }

  // Fetch the diagnostic to get hairType and porosity
  const diagnosticSnap = await db.collection("diagnostics").doc(diagnosticId).get();
  if (!diagnosticSnap.exists) {
    res.status(404).json({
      error: "schedule/diagnostic-not-found",
      message: "Diagnostic introuvable.",
    });
    return;
  }

  const diagnostic = diagnosticSnap.data()!;

  if (diagnostic.userId !== userId) {
    res.status(403).json({ error: "auth/forbidden", message: "Accès non autorisé." });
    return;
  }

  if (diagnostic.status !== "completed") {
    res.status(400).json({
      error: "schedule/diagnostic-incomplete",
      message: "Le diagnostic n'est pas encore terminé.",
    });
    return;
  }

  const { hairType, porosity } = diagnostic;

  logInfo("schedule/generating", {
    userId, diagnosticId, hairType, porosity,
    daysOfWeek, sessionsPerWeek: daysOfWeek.length,
  });

  // Generate the H/N/R sequence
  const sequence = generateSequence(hairType, porosity, daysOfWeek.length);

  // Build calendar events
  const calendarEvents = buildCalendarEvents(sequence, startAt, daysOfWeek, time);

  // Persist to Firestore
  const scheduleRef = db.collection("schedules").doc();
  const scheduleId = scheduleRef.id;

  // Generate HMAC token for calendar subscription URL
  const secret = calendarTokenSecret.value();
  const calendarToken = generateCalendarToken(scheduleId, userId, secret);

  try {
    await scheduleRef.set({
      id: scheduleId,
      userId,
      diagnosticId,
      sequence,
      daysOfWeek,
      time,
      calendarToken,
      startAt: new Date(startAt), // Firestore auto-converts Date to Timestamp
      status: "active",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    logInfo("schedule/created", {
      scheduleId, userId, diagnosticId,
      totalSessions: sequence.length,
    });

    res.status(201).json({
      scheduleId,
      diagnosticId,
      sequence,
      status: "active",
      calendarEvents,
      calendarToken,
      totalSessions: sequence.length,
      weeksCount: 4,
    });
  } catch (err) {
    logError("schedule/create-failed", err, { userId, diagnosticId });
    res.status(500).json({
      error: "schedule/create-failed",
      message: "Impossible de créer le chronogramme. Veuillez réessayer.",
    });
  }
}
