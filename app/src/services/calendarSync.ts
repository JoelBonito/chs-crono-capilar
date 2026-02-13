import { getDeviceInfo } from "@/lib/device";
import i18n from "@/i18n";

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const FUNCTIONS_BASE_URL =
  import.meta.env.VITE_USE_EMULATORS === "true"
    ? `http://localhost:5001/${projectId}/europe-west1`
    : `https://europe-west1-${projectId}.cloudfunctions.net`;

/**
 * Build the syncCalendar endpoint URL with HMAC token.
 */
function buildSyncUrl(scheduleId: string, token: string): string {
  const params = new URLSearchParams({ scheduleId, token });
  return `${FUNCTIONS_BASE_URL}/syncCalendar?${params.toString()}`;
}

/**
 * Fetch the .ics content as a Blob with correct MIME type.
 */
async function fetchICSBlob(scheduleId: string, calendarToken: string): Promise<Blob> {
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

/**
 * Open .ics natively so the OS presents the calendar app picker.
 * - iOS: triggers "Add to Calendar" sheet (Apple Calendar, Google Calendar, Outlook)
 * - Android: triggers intent chooser with all installed calendar apps
 *
 * Uses window.location.href instead of <a download> so the OS intercepts
 * the text/calendar MIME type and opens the native handler.
 */
async function openICSNatively(
  scheduleId: string,
  calendarToken: string,
): Promise<void> {
  const blob = await fetchICSBlob(scheduleId, calendarToken);
  const blobUrl = URL.createObjectURL(blob);

  // Navigate to blob URL — OS intercepts text/calendar and opens calendar picker
  window.location.href = blobUrl;

  // Cleanup after the OS has had time to process
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
}

/**
 * Smart calendar sync: picks the best method based on device.
 * - Mobile (iOS/Android): opens .ics natively → OS calendar picker
 * - Desktop: opens Google Calendar web subscription
 */
export async function syncToCalendar(
  scheduleId: string,
  calendarToken: string,
): Promise<void> {
  const { isMobile } = getDeviceInfo();

  if (isMobile) {
    await openICSNatively(scheduleId, calendarToken);
    return;
  }

  // Desktop: Google Calendar web subscription
  const url = getGoogleCalendarUrl(scheduleId, calendarToken);
  window.open(url, "_blank", "noopener,noreferrer");
}
