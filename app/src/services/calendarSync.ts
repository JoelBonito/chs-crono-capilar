import { getDeviceInfo } from "@/lib/device";
import i18n from "@/i18n";

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const FUNCTIONS_BASE_URL =
  import.meta.env.VITE_USE_EMULATORS === "true"
    ? `http://localhost:5001/${projectId}/europe-west1`
    : `https://europe-west1-${projectId}.cloudfunctions.net`;

export type SyncMethod = "ios" | "android" | "desktop";

export interface SyncResult {
  method: SyncMethod;
  /** True when the caller should show a manual instruction toast (Android download) */
  showToast: boolean;
}

/**
 * Build the syncCalendar endpoint URL with HMAC token.
 * Optionally appends disposition=inline for iOS Safari native interception.
 */
function buildSyncUrl(
  scheduleId: string,
  token: string,
  options?: { inline?: boolean },
): string {
  const params = new URLSearchParams({ scheduleId, token });
  if (options?.inline) {
    params.set("disposition", "inline");
  }
  return `${FUNCTIONS_BASE_URL}/syncCalendar?${params.toString()}`;
}

/**
 * Fetch the .ics content as a Blob with correct MIME type.
 * Used exclusively by downloadICSFile (desktop fallback).
 */
async function fetchICSBlob(
  scheduleId: string,
  calendarToken: string,
): Promise<Blob> {
  const url = buildSyncUrl(scheduleId, calendarToken);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(i18n.t("calendar:errors.downloadFailed"));
  }
  const buffer = await response.arrayBuffer();
  return new Blob([buffer], { type: "text/calendar;charset=utf-8" });
}

/**
 * Download the .ics file and trigger a browser download (desktop).
 */
export async function downloadICSFile(
  scheduleId: string,
  calendarToken: string,
): Promise<void> {
  const blob = await fetchICSBlob(scheduleId, calendarToken);
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = "cronocapilar-chronogramme.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}

/**
 * Get the Google Calendar subscription URL (desktop only).
 * Opens Google Calendar with a webcal:// subscription to the .ics endpoint.
 */
export function getGoogleCalendarUrl(
  scheduleId: string,
  calendarToken: string,
): string {
  const httpsUrl = buildSyncUrl(scheduleId, calendarToken);
  const webcalUrl = httpsUrl.replace(/^https?:\/\//, "webcal://");
  return `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`;
}

// ---------------------------------------------------------------------------
// Platform-specific sync strategies
// ---------------------------------------------------------------------------

/**
 * iOS: Navigate directly to the server endpoint with disposition=inline.
 * iOS Safari intercepts text/calendar + Content-Disposition: inline and
 * presents the native "Add to Calendar" dialog. No fetch/blob needed.
 */
function syncOnIOS(scheduleId: string, calendarToken: string): void {
  const url = buildSyncUrl(scheduleId, calendarToken, { inline: true });
  window.location.href = url;
}

/**
 * Android: Download the .ics via fetch + Blob + <a download>.
 * Android Chrome does not intercept text/calendar inline, so we trigger
 * a file download. The user then taps the downloaded file to open their
 * calendar app. The caller should display a toast with this instruction.
 */
async function syncOnAndroid(
  scheduleId: string,
  calendarToken: string,
): Promise<void> {
  const blob = await fetchICSBlob(scheduleId, calendarToken);
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = "cronocapilar-chronogramme.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Give the browser time to start the download before revoking
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
}

/**
 * Smart calendar sync: picks the best method based on device.
 *
 * - iOS:     Direct URL navigation with disposition=inline -> native dialog
 * - Android: Downloads .ics file -> user taps to open in calendar app
 * - Desktop: Opens Google Calendar web subscription
 *
 * Returns a SyncResult so the caller knows which path was taken
 * and whether to show a toast with manual instructions.
 */
export async function syncToCalendar(
  scheduleId: string,
  calendarToken: string,
): Promise<SyncResult> {
  const { isIOS, isAndroid } = getDeviceInfo();

  if (isIOS) {
    syncOnIOS(scheduleId, calendarToken);
    return { method: "ios", showToast: false };
  }

  if (isAndroid) {
    await syncOnAndroid(scheduleId, calendarToken);
    return { method: "android", showToast: true };
  }

  // Desktop: Google Calendar web subscription
  const url = getGoogleCalendarUrl(scheduleId, calendarToken);
  window.open(url, "_blank", "noopener,noreferrer");
  return { method: "desktop", showToast: false };
}
