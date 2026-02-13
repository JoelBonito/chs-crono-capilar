import { describe, it, expect } from "vitest";
import { calculateConsumption, estimateDepletionDate, treatmentToProductType } from "./calculator";

describe("calculateConsumption", () => {
  it("returns full volume when no sessions completed", () => {
    const result = calculateConsumption({
      totalVolumeMl: 300,
      usagePerSessionMl: 15,
      sessionsCompleted: 0,
    });

    expect(result.remainingMl).toBe(300);
    expect(result.lowStock).toBe(false);
    expect(result.status).toBe("in_use");
  });

  it("correctly calculates remaining volume after sessions", () => {
    const result = calculateConsumption({
      totalVolumeMl: 300,
      usagePerSessionMl: 15,
      sessionsCompleted: 10,
    });

    expect(result.remainingMl).toBe(150);
    expect(result.lowStock).toBe(false);
    expect(result.status).toBe("in_use");
  });

  it("flags lowStock when 2 or fewer sessions remaining", () => {
    const result = calculateConsumption({
      totalVolumeMl: 300,
      usagePerSessionMl: 15,
      sessionsCompleted: 18,
    });

    expect(result.remainingMl).toBe(30);
    expect(result.lowStock).toBe(true);
    expect(result.status).toBe("in_use");
  });

  it("returns depleted when all volume consumed", () => {
    const result = calculateConsumption({
      totalVolumeMl: 300,
      usagePerSessionMl: 15,
      sessionsCompleted: 20,
    });

    expect(result.remainingMl).toBe(0);
    expect(result.lowStock).toBe(true);
    expect(result.status).toBe("depleted");
  });

  it("clamps remaining to 0 when over-consumed", () => {
    const result = calculateConsumption({
      totalVolumeMl: 300,
      usagePerSessionMl: 15,
      sessionsCompleted: 25,
    });

    expect(result.remainingMl).toBe(0);
    expect(result.status).toBe("depleted");
  });

  it("handles zero usagePerSessionMl gracefully", () => {
    const result = calculateConsumption({
      totalVolumeMl: 300,
      usagePerSessionMl: 0,
      sessionsCompleted: 5,
    });

    expect(result.remainingMl).toBe(300);
    expect(result.lowStock).toBe(true);
    expect(result.status).toBe("in_use");
  });
});

describe("estimateDepletionDate", () => {
  it("returns the date when product will be depleted", () => {
    const result = estimateDepletionDate({
      remainingMl: 45,
      usagePerSessionMl: 15,
      upcomingSessionDates: [
        "2026-03-01",
        "2026-03-03",
        "2026-03-05",
        "2026-03-07",
      ],
    });

    expect(result).toEqual(new Date("2026-03-05"));
  });

  it("returns last date if product outlasts all sessions", () => {
    const result = estimateDepletionDate({
      remainingMl: 300,
      usagePerSessionMl: 15,
      upcomingSessionDates: ["2026-03-01", "2026-03-03"],
    });

    expect(result).toEqual(new Date("2026-03-03"));
  });

  it("returns null when no remaining volume", () => {
    const result = estimateDepletionDate({
      remainingMl: 0,
      usagePerSessionMl: 15,
      upcomingSessionDates: ["2026-03-01"],
    });

    expect(result).toBeNull();
  });

  it("returns null when no upcoming sessions", () => {
    const result = estimateDepletionDate({
      remainingMl: 100,
      usagePerSessionMl: 15,
      upcomingSessionDates: [],
    });

    expect(result).toBeNull();
  });

  it("returns null when usagePerSessionMl is 0", () => {
    const result = estimateDepletionDate({
      remainingMl: 100,
      usagePerSessionMl: 0,
      upcomingSessionDates: ["2026-03-01"],
    });

    expect(result).toBeNull();
  });

  it("sorts dates chronologically", () => {
    const result = estimateDepletionDate({
      remainingMl: 30,
      usagePerSessionMl: 15,
      upcomingSessionDates: [
        "2026-03-05",
        "2026-03-01",
        "2026-03-03",
      ],
    });

    expect(result).toEqual(new Date("2026-03-03"));
  });
});

describe("treatmentToProductType", () => {
  it("maps H to hydration", () => {
    expect(treatmentToProductType("H")).toBe("hydration");
  });

  it("maps N to nutrition", () => {
    expect(treatmentToProductType("N")).toBe("nutrition");
  });

  it("maps R to reconstruction", () => {
    expect(treatmentToProductType("R")).toBe("reconstruction");
  });

  it("defaults to hydration for unknown types", () => {
    expect(treatmentToProductType("X")).toBe("hydration");
  });
});
