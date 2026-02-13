type TreatmentType = "H" | "N" | "R";

interface GenerateScheduleRequest {
  diagnosticId: string;
  userId: string;
  startAt: string;
  daysOfWeek: number[];
  time: string;
}

interface CalendarEvent {
  date: string;
  dayOfWeek: number;
  treatment: TreatmentType;
  weekNumber: number;
  label: string;
}

interface GenerateScheduleResponse {
  scheduleId: string;
  diagnosticId: string;
  sequence: TreatmentType[];
  status: "active";
  calendarEvents: CalendarEvent[];
  calendarToken: string;
  totalSessions: number;
  weeksCount: number;
}

/**
 * Call the generateSchedule Cloud Function.
 */
export async function generateSchedule(
  request: GenerateScheduleRequest,
  idToken: string,
): Promise<GenerateScheduleResponse> {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const baseUrl =
    import.meta.env.VITE_USE_EMULATORS === "true"
      ? `http://localhost:5001/${projectId}/europe-west1`
      : `https://europe-west1-${projectId}.cloudfunctions.net`;

  const response = await fetch(`${baseUrl}/generateSchedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Impossible de créer le chronogramme.");
  }

  return response.json();
}

export type { TreatmentType, CalendarEvent, GenerateScheduleRequest, GenerateScheduleResponse };
