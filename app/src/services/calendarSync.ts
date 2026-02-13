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
 * Download the .ics file and trigger a browser download.
 */
export async function downloadICSFile(
  scheduleId: string,
  calendarToken: string,
): Promise<void> {
  const url = buildSyncUrl(scheduleId, calendarToken);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Impossible de télécharger le fichier .ics");
  }

  const blob = await response.blob();
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
 * Get the Google Calendar subscription URL.
 * Opens Google Calendar with a webcal:// subscription to the .ics endpoint.
 */
export function getGoogleCalendarUrl(
  scheduleId: string,
  calendarToken: string,
): string {
  const httpsUrl = buildSyncUrl(scheduleId, calendarToken);
  // Google Calendar accepts webcal:// or https:// URLs for subscription
  const webcalUrl = httpsUrl.replace(/^https?:\/\//, "webcal://");
  return `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`;
}
