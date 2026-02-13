import { z } from "zod";

export const TREATMENT_TYPES = ["H", "N", "R"] as const;
export type TreatmentType = (typeof TREATMENT_TYPES)[number];

export const HAIR_TYPES = ["dry", "oily", "normal", "mixed", "damaged"] as const;
export type HairType = (typeof HAIR_TYPES)[number];

export const POROSITY_LEVELS = ["low", "medium", "high"] as const;
export type PorosityLevel = (typeof POROSITY_LEVELS)[number];

// Request schema for generateSchedule endpoint
export const generateScheduleRequestSchema = z.object({
  diagnosticId: z.string().min(1),
  userId: z.string().min(1),
  startAt: z.string().datetime(),
  daysOfWeek: z
    .array(z.number().int().min(0).max(6))
    .min(1)
    .max(7)
    .refine((days) => new Set(days).size === days.length, {
      message: "Les jours doivent être uniques.",
    }),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Format attendu : HH:MM"),
});

export type GenerateScheduleRequest = z.infer<typeof generateScheduleRequestSchema>;

// A single calendar event in the generated schedule
export interface CalendarEvent {
  date: string; // ISO date YYYY-MM-DD
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  treatment: TreatmentType;
  weekNumber: number; // 1-4
  label: string; // French label for UI
}

// Response from generateSchedule
export interface GenerateScheduleResponse {
  scheduleId: string;
  diagnosticId: string;
  sequence: TreatmentType[];
  status: "active";
  calendarEvents: CalendarEvent[];
  calendarToken: string;
  totalSessions: number;
  weeksCount: number;
}
