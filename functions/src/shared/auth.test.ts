import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock firebase-admin before importing the module under test
vi.mock("firebase-admin", () => {
  const verifyIdToken = vi.fn();
  return {
    default: {
      auth: () => ({ verifyIdToken }),
    },
    auth: () => ({ verifyIdToken }),
  };
});

import * as admin from "firebase-admin";
import { verifyAuth } from "./auth";

function mockRequest(authHeader?: string) {
  return {
    headers: {
      authorization: authHeader,
    },
  } as unknown as import("express").Request;
}

describe("verifyAuth", () => {
  const mockVerify = vi.mocked(admin.auth().verifyIdToken);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when no Authorization header", async () => {
    const req = mockRequest(undefined);
    const result = await verifyAuth(req);
    expect(result).toBeNull();
    expect(mockVerify).not.toHaveBeenCalled();
  });

  it("returns null when Authorization header lacks Bearer prefix", async () => {
    const req = mockRequest("Basic abc123");
    const result = await verifyAuth(req);
    expect(result).toBeNull();
  });

  it("returns null when Bearer token is empty", async () => {
    const req = mockRequest("Bearer ");
    const result = await verifyAuth(req);
    expect(result).toBeNull();
  });

  it("returns decoded token on valid JWT", async () => {
    const fakeToken = { uid: "user-123", email: "test@example.com" };
    mockVerify.mockResolvedValue(fakeToken as admin.auth.DecodedIdToken);

    const req = mockRequest("Bearer valid-jwt-token");
    const result = await verifyAuth(req);

    expect(result).toEqual(fakeToken);
    expect(mockVerify).toHaveBeenCalledWith("valid-jwt-token");
  });

  it("returns null when verifyIdToken throws", async () => {
    mockVerify.mockRejectedValue(new Error("Token expired"));

    const req = mockRequest("Bearer expired-token");
    const result = await verifyAuth(req);

    expect(result).toBeNull();
  });
});
