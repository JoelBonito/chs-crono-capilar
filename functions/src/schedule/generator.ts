import type { TreatmentType, HairType, PorosityLevel, CalendarEvent } from "./schemas";

const WEEKS = 4;

const TREATMENT_LABELS: Record<TreatmentType, string> = {
  H: "Hydratation",
  N: "Nutrition",
  R: "Reconstruction",
};

/**
 * Base weekly patterns per hair type.
 * Each pattern defines the ratio of H/N/R treatments per week.
 * The generator repeats and adapts these across the 4-week cycle.
 */
const BASE_PATTERNS: Record<HairType, TreatmentType[]> = {
  // Dry: prioritize hydration (60% H, 25% N, 15% R)
  dry: ["H", "H", "N", "H", "R", "H", "H", "N", "H", "R", "H", "N"],
  // Oily: light balanced (40% H, 40% N, 20% R)
  oily: ["H", "N", "H", "N", "R", "H", "N", "H", "N", "R", "H", "N"],
  // Normal: even distribution (33% each)
  normal: ["H", "N", "R", "H", "N", "R", "H", "N", "R", "H", "N", "R"],
  // Mixed: hydration-leaning with variety
  mixed: ["H", "N", "H", "R", "H", "N", "H", "R", "H", "N", "R", "H"],
  // Damaged: prioritize reconstruction (50% R, 30% H, 20% N)
  damaged: ["R", "H", "R", "N", "R", "H", "R", "H", "R", "N", "R", "H"],
};

/**
 * Porosity modifiers: adjust the base pattern by swapping treatments.
 *
 * - High porosity: cuticles are open → needs more R (reconstruction)
 * - Low porosity: cuticles are tight → needs more N (nutrition to penetrate)
 * - Medium: no modification
 */
function applyPorosityModifier(
  sequence: TreatmentType[],
  porosity: PorosityLevel,
): TreatmentType[] {
  if (porosity === "medium") return sequence;

  const modified = [...sequence];
  const boost: TreatmentType = porosity === "high" ? "R" : "N";
  const reduce: TreatmentType = porosity === "high" ? "N" : "R";

  // Swap up to 2 occurrences of the reduced type with the boosted type
  let swapped = 0;
  for (let i = 0; i < modified.length && swapped < 2; i++) {
    if (modified[i] === reduce) {
      modified[i] = boost;
      swapped++;
    }
  }

  return modified;
}

/**
 * Generate the H/N/R treatment sequence for a 4-week cycle.
 *
 * @param hairType - Diagnostic result hair type
 * @param porosity - Diagnostic result porosity level
 * @param sessionsPerWeek - Number of treatment days per week (from daysOfWeek.length)
 * @returns Array of TreatmentType for all sessions across 4 weeks
 */
export function generateSequence(
  hairType: HairType,
  porosity: PorosityLevel,
  sessionsPerWeek: number,
): TreatmentType[] {
  const basePattern = BASE_PATTERNS[hairType];
  const totalSessions = sessionsPerWeek * WEEKS;

  // Pick treatments from the base pattern, cycling through it
  const rawSequence: TreatmentType[] = [];
  for (let i = 0; i < totalSessions; i++) {
    rawSequence.push(basePattern[i % basePattern.length]!);
  }

  return applyPorosityModifier(rawSequence, porosity);
}

/**
 * Build calendar events from the sequence, start date, and selected days.
 *
 * @param sequence - Generated H/N/R sequence
 * @param startAt - ISO date string for the start of the cycle
 * @param daysOfWeek - Array of day numbers (0=Sun, 1=Mon, ..., 6=Sat)
 * @param time - Time string HH:MM
 * @returns Array of CalendarEvent objects
 */
export function buildCalendarEvents(
  sequence: TreatmentType[],
  startAt: string,
  daysOfWeek: number[],
  time: string,
): CalendarEvent[] {
  const sortedDays = [...daysOfWeek].sort((a, b) => a - b);
  const start = new Date(startAt);
  const events: CalendarEvent[] = [];

  let sessionIndex = 0;

  for (let week = 0; week < WEEKS; week++) {
    for (const targetDay of sortedDays) {
      if (sessionIndex >= sequence.length) break;

      // Find the date for this day in this week
      const date = new Date(start);
      date.setDate(date.getDate() + week * 7);

      // Adjust to the target day of the week
      const currentDay = date.getDay();
      let diff = targetDay - currentDay;
      if (diff < 0) diff += 7;
      date.setDate(date.getDate() + diff);

      const treatment = sequence[sessionIndex]!;
      const isoDate = date.toISOString().split("T")[0]!;

      events.push({
        date: `${isoDate}T${time}:00`,
        dayOfWeek: targetDay,
        treatment,
        weekNumber: week + 1,
        label: TREATMENT_LABELS[treatment],
      });

      sessionIndex++;
    }
  }

  return events;
}
