import { describe, it, expect } from "vitest";
import { ALLOWED_ORIGINS } from "./cors";

describe("ALLOWED_ORIGINS", () => {
  it("always includes production origins", () => {
    expect(ALLOWED_ORIGINS).toContain("https://cronocapilar.web.app");
    expect(ALLOWED_ORIGINS).toContain("https://cronocapilar.firebaseapp.com");
  });

  it("contains only HTTPS production URLs or localhost dev URLs", () => {
    for (const origin of ALLOWED_ORIGINS) {
      const isHttpsProd = origin.startsWith("https://");
      const isLocalDev = origin.startsWith("http://localhost:");
      expect(isHttpsProd || isLocalDev).toBe(true);
    }
  });
});
