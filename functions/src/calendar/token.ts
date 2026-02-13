import * as crypto from "crypto";
import { defineSecret } from "firebase-functions/params";

export const calendarTokenSecret = defineSecret("CALENDAR_TOKEN_SECRET");

/**
 * Generate an HMAC-SHA256 token for calendar URL authentication.
 * Allows Google Calendar / webcal clients to fetch .ics without JWT.
 */
export function generateCalendarToken(
  scheduleId: string,
  userId: string,
  secret: string,
): string {
  return crypto
    .createHmac("sha256", secret)
    .update(`${scheduleId}:${userId}`)
    .digest("hex");
}

/**
 * Verify that the provided token matches the expected HMAC.
 */
export function verifyCalendarToken(
  token: string,
  scheduleId: string,
  userId: string,
  secret: string,
): boolean {
  const expected = generateCalendarToken(scheduleId, userId, secret);
  return crypto.timingSafeEqual(
    Buffer.from(token, "hex"),
    Buffer.from(expected, "hex"),
  );
}
