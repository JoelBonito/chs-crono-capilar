import * as admin from "firebase-admin";
import type { Request } from "express";

/**
 * Verify Firebase JWT from Authorization header.
 * Returns the decoded token or null if invalid.
 */
export async function verifyAuth(req: Request): Promise<admin.auth.DecodedIdToken | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split("Bearer ")[1];
  if (!token) return null;

  try {
    return await admin.auth().verifyIdToken(token);
  } catch {
    return null;
  }
}
