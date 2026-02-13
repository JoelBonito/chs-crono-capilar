import { describe, it, expect } from "vitest";
import { maskPhone } from "./logger";

describe("maskPhone", () => {
  it("masks a standard French phone number", () => {
    expect(maskPhone("+33612345678")).toBe("+336****5678");
  });

  it("masks a short number as ***", () => {
    expect(maskPhone("+3361")).toBe("***");
  });

  it("returns *** for very short input", () => {
    expect(maskPhone("+336")).toBe("***");
    expect(maskPhone("")).toBe("***");
  });

  it("masks a long international number", () => {
    expect(maskPhone("+441234567890")).toBe("+441****7890");
  });
});
