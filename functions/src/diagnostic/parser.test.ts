import { describe, it, expect } from "vitest";
import { parseGeminiResponse, buildFallbackDiagnostic, ParseError } from "./parser";

describe("parseGeminiResponse", () => {
  const validJson = JSON.stringify({
    hairType: "dry",
    porosity: "high",
    recommendedAction: "Prioriser l'hydratation avec au moins 2 séances par semaine.",
    technicalSummary: "Cheveux secs avec porosité élevée nécessitant une hydratation intensive et régulière.",
  });

  it("parses valid JSON response", () => {
    const result = parseGeminiResponse(validJson, "user-1");

    expect(result.hairType).toBe("dry");
    expect(result.porosity).toBe("high");
    expect(result.recommendedAction).toContain("hydratation");
    expect(result.technicalSummary).toContain("secs");
  });

  it("extracts JSON from markdown code fences", () => {
    const wrapped = "```json\n" + validJson + "\n```";
    const result = parseGeminiResponse(wrapped, "user-1");

    expect(result.hairType).toBe("dry");
  });

  it("extracts JSON from plain code fences", () => {
    const wrapped = "```\n" + validJson + "\n```";
    const result = parseGeminiResponse(wrapped, "user-1");

    expect(result.hairType).toBe("dry");
  });

  it("extracts JSON embedded in extra text", () => {
    const embedded = "Here is the analysis:\n" + validJson + "\n\nPlease review.";
    const result = parseGeminiResponse(embedded, "user-1");

    expect(result.hairType).toBe("dry");
  });

  it("normalizes French hair type terms", () => {
    const frenchJson = JSON.stringify({
      hairType: "sec",
      porosity: "élevée",
      recommendedAction: "Prioriser l'hydratation avec au moins 2 séances par semaine.",
      technicalSummary: "Cheveux très secs avec cuticules ouvertes nécessitant hydratation intensive.",
    });

    const result = parseGeminiResponse(frenchJson, "user-1");
    expect(result.hairType).toBe("dry");
    expect(result.porosity).toBe("high");
  });

  it("normalizes 'abîmé' to 'damaged'", () => {
    const json = JSON.stringify({
      hairType: "abîmé",
      porosity: "haute",
      recommendedAction: "Commencer par la reconstruction intensive avant l'hydratation.",
      technicalSummary: "Cheveux abîmés par traitements chimiques avec porosité élevée nécessitant reconstruction.",
    });

    const result = parseGeminiResponse(json, "user-1");
    expect(result.hairType).toBe("damaged");
    expect(result.porosity).toBe("high");
  });

  it("throws ParseError for non-JSON text", () => {
    expect(() => parseGeminiResponse("This is not JSON at all", "user-1")).toThrow(ParseError);
  });

  it("throws ParseError for invalid JSON", () => {
    expect(() => parseGeminiResponse("{invalid: json}", "user-1")).toThrow(ParseError);
  });

  it("throws ParseError when missing required fields", () => {
    const incomplete = JSON.stringify({ hairType: "dry" });
    expect(() => parseGeminiResponse(incomplete, "user-1")).toThrow(ParseError);
  });

  it("includes phase info in ParseError", () => {
    try {
      parseGeminiResponse("not json", "user-1");
    } catch (err) {
      expect(err).toBeInstanceOf(ParseError);
      expect((err as ParseError).phase).toBe("extract");
    }
  });
});

describe("buildFallbackDiagnostic", () => {
  it("returns normal defaults when no context", () => {
    const result = buildFallbackDiagnostic();

    expect(result.hairType).toBe("normal");
    expect(result.porosity).toBe("medium");
    expect(result.recommendedAction).toContain("H/N/R");
    expect(result.technicalSummary).toContain("questionnaire");
  });

  it("maps dry scalp type", () => {
    const result = buildFallbackDiagnostic({ scalpType: "dry" });
    expect(result.hairType).toBe("dry");
  });

  it("maps oily scalp type", () => {
    const result = buildFallbackDiagnostic({ scalpType: "oily" });
    expect(result.hairType).toBe("oily");
  });

  it("prioritizes damaged for chemical treatments", () => {
    const result = buildFallbackDiagnostic({
      scalpType: "normal",
      chemicalTreatments: true,
    });

    expect(result.hairType).toBe("damaged");
    expect(result.porosity).toBe("high");
  });

  it("maps daily washing to oily when normal", () => {
    const result = buildFallbackDiagnostic({
      washingFrequency: "daily",
    });

    expect(result.hairType).toBe("oily");
  });

  it("keeps dry type even with daily washing", () => {
    const result = buildFallbackDiagnostic({
      scalpType: "dry",
      washingFrequency: "daily",
    });

    expect(result.hairType).toBe("dry");
  });
});
