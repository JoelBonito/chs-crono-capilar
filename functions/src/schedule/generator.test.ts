import { describe, it, expect } from "vitest";
import { generateSequence, buildCalendarEvents } from "./generator";

describe("generateSequence", () => {
  it("generates correct number of sessions for 4 weeks", () => {
    const sequence = generateSequence("normal", "medium", 3);
    expect(sequence).toHaveLength(12); // 3 per week * 4 weeks
  });

  it("generates correct number for 1 session per week", () => {
    const sequence = generateSequence("dry", "low", 1);
    expect(sequence).toHaveLength(4); // 1 per week * 4 weeks
  });

  it("generates correct number for 7 sessions per week", () => {
    const sequence = generateSequence("oily", "medium", 7);
    expect(sequence).toHaveLength(28); // 7 per week * 4 weeks
  });

  it("only contains valid treatment types", () => {
    const sequence = generateSequence("damaged", "high", 5);
    for (const t of sequence) {
      expect(["H", "N", "R"]).toContain(t);
    }
  });

  it("prioritizes hydration for dry hair", () => {
    const sequence = generateSequence("dry", "medium", 6);
    const hCount = sequence.filter((t) => t === "H").length;
    const rCount = sequence.filter((t) => t === "R").length;
    expect(hCount).toBeGreaterThan(rCount);
  });

  it("prioritizes reconstruction for damaged hair", () => {
    const sequence = generateSequence("damaged", "medium", 6);
    const rCount = sequence.filter((t) => t === "R").length;
    const hCount = sequence.filter((t) => t === "H").length;
    expect(rCount).toBeGreaterThan(hCount);
  });

  it("balances treatments for normal hair with medium porosity", () => {
    const sequence = generateSequence("normal", "medium", 3);
    const counts = { H: 0, N: 0, R: 0 };
    for (const t of sequence) counts[t]++;
    expect(counts.H).toBe(counts.N);
    expect(counts.N).toBe(counts.R);
  });

  it("high porosity boosts reconstruction", () => {
    const mediumSeq = generateSequence("normal", "medium", 6);
    const highSeq = generateSequence("normal", "high", 6);

    const mediumR = mediumSeq.filter((t) => t === "R").length;
    const highR = highSeq.filter((t) => t === "R").length;

    expect(highR).toBeGreaterThan(mediumR);
  });

  it("low porosity boosts nutrition", () => {
    const mediumSeq = generateSequence("normal", "medium", 6);
    const lowSeq = generateSequence("normal", "low", 6);

    const mediumN = mediumSeq.filter((t) => t === "N").length;
    const lowN = lowSeq.filter((t) => t === "N").length;

    expect(lowN).toBeGreaterThan(mediumN);
  });
});

describe("buildCalendarEvents", () => {
  it("builds correct number of events", () => {
    const sequence = generateSequence("normal", "medium", 3);
    const events = buildCalendarEvents(
      sequence,
      "2026-03-02",
      [1, 3, 5], // Mon, Wed, Fri
      "09:00",
    );

    expect(events).toHaveLength(12);
  });

  it("assigns correct treatment labels", () => {
    const events = buildCalendarEvents(
      ["H", "N", "R"],
      "2026-03-02",
      [1, 3, 5],
      "09:00",
    );

    expect(events[0]!.label).toBe("Hydratation");
    expect(events[1]!.label).toBe("Nutrition");
    expect(events[2]!.label).toBe("Reconstruction");
  });

  it("includes time in event date", () => {
    const events = buildCalendarEvents(
      ["H"],
      "2026-03-02",
      [1],
      "14:30",
    );

    expect(events[0]!.date).toContain("T14:30:00");
  });

  it("assigns correct week numbers", () => {
    const sequence = generateSequence("normal", "medium", 2);
    const events = buildCalendarEvents(
      sequence,
      "2026-03-02",
      [1, 4], // Mon, Thu
      "09:00",
    );

    const week1Events = events.filter((e) => e.weekNumber === 1);
    const week2Events = events.filter((e) => e.weekNumber === 2);

    expect(week1Events).toHaveLength(2);
    expect(week2Events).toHaveLength(2);
  });

  it("sorts daysOfWeek internally", () => {
    const events = buildCalendarEvents(
      ["H", "N"],
      "2026-03-02",
      [5, 1], // Fri, Mon (unsorted)
      "09:00",
    );

    // Monday (1) should come before Friday (5)
    expect(events[0]!.dayOfWeek).toBe(1);
    expect(events[1]!.dayOfWeek).toBe(5);
  });

  it("handles single day per week", () => {
    const events = buildCalendarEvents(
      ["H", "H", "H", "H"],
      "2026-03-01",
      [0], // Sunday
      "10:00",
    );

    expect(events).toHaveLength(4);
    for (const e of events) {
      expect(e.dayOfWeek).toBe(0);
    }
  });
});
