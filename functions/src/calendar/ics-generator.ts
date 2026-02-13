import type { CalendarEvent } from "../schedule/schemas";

const PRODID = "-//CronoCapilar//CHS//FR";
const CALNAME = "CronoCapilar - Mon Chronogramme";
const TIMEZONE = "Europe/Paris";
const EVENT_DURATION_MIN = 30;

const TREATMENT_EMOJI: Record<string, string> = {
  H: "\uD83E\uDDF4",
  N: "\uD83C\uDF3F",
  R: "\uD83D\uDD27",
};

/**
 * Fold long lines per RFC 5545 (max 75 octets per line).
 */
function foldLine(line: string): string {
  const MAX = 75;
  if (Buffer.byteLength(line, "utf-8") <= MAX) return line;

  const parts: string[] = [];
  let remaining = line;
  let isFirst = true;

  while (Buffer.byteLength(remaining, "utf-8") > MAX) {
    // Find a safe split point (max bytes for this segment)
    const limit = isFirst ? MAX : MAX - 1; // subsequent lines have leading space
    let cutAt = 0;
    let byteCount = 0;

    for (let i = 0; i < remaining.length; i++) {
      const charBytes = Buffer.byteLength(remaining[i]!, "utf-8");
      if (byteCount + charBytes > limit) break;
      byteCount += charBytes;
      cutAt = i + 1;
    }

    parts.push(remaining.slice(0, cutAt));
    remaining = remaining.slice(cutAt);
    isFirst = false;
  }

  if (remaining) parts.push(remaining);

  return parts.join("\r\n ");
}

/**
 * Format a date string (YYYY-MM-DDTHH:MM:SS) to iCalendar DTSTART format.
 * Returns YYYYMMDDTHHMMSS (local time, paired with TZID).
 */
function toICalDate(isoDate: string): string {
  return isoDate.replace(/[-:]/g, "").replace(/\.\d+/, "");
}

/**
 * Add minutes to an ISO-like date string and return iCal format.
 */
function addMinutes(isoDate: string, minutes: number): string {
  const d = new Date(isoDate);
  d.setMinutes(d.getMinutes() + minutes);
  const pad = (n: number) => String(n).padStart(2, "0");
  const result =
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  return result;
}

/**
 * Generate a valid iCalendar (RFC 5545) string from calendar events.
 */
export function generateICS(
  events: CalendarEvent[],
  scheduleId: string,
): string {
  const now = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d+/, "");

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${CALNAME}`,
    `X-WR-TIMEZONE:${TIMEZONE}`,
  ];

  for (let i = 0; i < events.length; i++) {
    const event = events[i]!;
    const emoji = TREATMENT_EMOJI[event.treatment] ?? "";
    const summary = `${emoji} ${event.label} - Semaine ${event.weekNumber}`;
    const description =
      `Traitement capillaire : ${event.label} (${event.treatment})\\n` +
      `Semaine ${event.weekNumber} de votre chronogramme CronoCapilar.`;

    const dtStart = toICalDate(event.date);
    const dtEnd = addMinutes(event.date, EVENT_DURATION_MIN);
    const uid = `${scheduleId}-${i}@cronocapilar.com`;

    lines.push(
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART;TZID=${TIMEZONE}:${dtStart}`,
      `DTEND;TZID=${TIMEZONE}:${dtEnd}`,
      foldLine(`SUMMARY:${summary}`),
      foldLine(`DESCRIPTION:${description}`),
      "LOCATION:À la maison",
      "STATUS:CONFIRMED",
      "BEGIN:VALARM",
      "TRIGGER:-PT1H",
      "ACTION:DISPLAY",
      foldLine(`DESCRIPTION:Rappel : ${event.label} dans 1 heure`),
      "END:VALARM",
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");

  return lines.join("\r\n") + "\r\n";
}
