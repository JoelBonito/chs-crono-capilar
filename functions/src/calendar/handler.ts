import * as admin from "firebase-admin";
import type { Request, Response } from "express";
import { verifyCalendarToken, calendarTokenSecret } from "./token";
import { generateICS } from "./ics-generator";
import { buildCalendarEvents } from "../schedule/generator";
import { logInfo, logError } from "../shared/logger";

const db = admin.firestore();

/**
 * HTTP handler for GET /syncCalendar
 * Returns an .ics file for calendar subscription / download.
 *
 * Query params:
 *   - scheduleId: Firestore schedule document ID
 *   - token: HMAC-SHA256 authentication token
 */
export async function handleSyncCalendar(req: Request, res: Response): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { scheduleId, token } = req.query;

  if (typeof scheduleId !== "string" || typeof token !== "string") {
    res.status(400).json({
      error: "calendar/invalid-params",
      message: "Paramètres scheduleId et token requis.",
    });
    return;
  }

  // Fetch schedule from Firestore
  let scheduleSnap;
  try {
    scheduleSnap = await db.collection("schedules").doc(scheduleId).get();
  } catch (err) {
    logError("calendar/fetch-failed", err, { scheduleId });
    res.status(500).json({ error: "calendar/fetch-failed" });
    return;
  }

  if (!scheduleSnap.exists) {
    res.status(404).json({
      error: "calendar/not-found",
      message: "Chronogramme introuvable.",
    });
    return;
  }

  const schedule = scheduleSnap.data()!;

  // Verify HMAC token
  const secret = calendarTokenSecret.value();
  let isValid = false;
  try {
    isValid = verifyCalendarToken(token, scheduleId, schedule.userId, secret);
  } catch {
    isValid = false;
  }

  if (!isValid) {
    res.status(403).json({
      error: "calendar/invalid-token",
      message: "Token d'accès invalide.",
    });
    return;
  }

  // Rebuild calendar events from stored schedule data
  const startAt = schedule.startAt?.toDate?.()
    ? (schedule.startAt.toDate() as Date).toISOString()
    : schedule.startAt;

  const calendarEvents = buildCalendarEvents(
    schedule.sequence,
    startAt,
    schedule.daysOfWeek,
    schedule.time,
  );

  // Generate .ics content
  const icsContent = generateICS(calendarEvents, scheduleId);

  logInfo("calendar/sync", {
    scheduleId,
    userId: schedule.userId,
    eventsCount: calendarEvents.length,
  });

  // Return as iCalendar file
  res.set({
    "Content-Type": "text/calendar; charset=utf-8",
    "Content-Disposition": `attachment; filename="cronocapilar-chronogramme.ics"`,
    "Cache-Control": "no-cache, no-store, must-revalidate",
  });
  res.status(200).send(icsContent);
}
