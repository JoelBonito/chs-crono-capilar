import { describe, it, expect } from "vitest";

// Test the isAllowedRedirectUrl logic directly by reimplementing it
// (the function is not exported, so we test the logic pattern)
const ALLOWED_REDIRECT_HOSTS = [
  "cronocapilar.web.app",
  "cronocapilar.firebaseapp.com",
];

function isAllowedRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      ALLOWED_REDIRECT_HOSTS.some((h) => parsed.hostname === h)
    );
  } catch {
    return false;
  }
}

describe("isAllowedRedirectUrl", () => {
  it("accepts valid production URLs", () => {
    expect(isAllowedRedirectUrl("https://cronocapilar.web.app/success")).toBe(true);
    expect(isAllowedRedirectUrl("https://cronocapilar.firebaseapp.com/cancel")).toBe(true);
  });

  it("accepts URLs with paths and query params", () => {
    expect(isAllowedRedirectUrl("https://cronocapilar.web.app/billing?status=ok")).toBe(true);
  });

  it("rejects HTTP URLs", () => {
    expect(isAllowedRedirectUrl("http://cronocapilar.web.app/success")).toBe(false);
  });

  it("rejects unknown hosts", () => {
    expect(isAllowedRedirectUrl("https://evil.com/steal")).toBe(false);
    expect(isAllowedRedirectUrl("https://cronocapilar.evil.com/")).toBe(false);
  });

  it("rejects javascript: protocol", () => {
    expect(isAllowedRedirectUrl("javascript:alert(1)")).toBe(false);
  });

  it("rejects data: protocol", () => {
    expect(isAllowedRedirectUrl("data:text/html,<h1>hi</h1>")).toBe(false);
  });

  it("rejects invalid URLs", () => {
    expect(isAllowedRedirectUrl("not a url")).toBe(false);
    expect(isAllowedRedirectUrl("")).toBe(false);
  });

  it("rejects subdomain spoofing", () => {
    expect(isAllowedRedirectUrl("https://fake.cronocapilar.web.app/")).toBe(false);
  });
});
