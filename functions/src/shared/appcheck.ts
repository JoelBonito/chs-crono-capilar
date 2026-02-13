import * as admin from "firebase-admin";
import type { Request, Response } from "express";

type RequestHandler = (req: Request, res: Response) => void | Promise<void>;

function isEmulatorMode(): boolean {
  return (
    process.env.FUNCTIONS_EMULATOR === "true" ||
    process.env.FIREBASE_EMULATOR_HUB !== undefined
  );
}

/**
 * Middleware wrapper that verifies Firebase App Check token on onRequest functions.
 * Rejects requests without a valid token (except in emulator mode).
 */
export function withAppCheck(handler: RequestHandler): RequestHandler {
  return async (req: Request, res: Response) => {
    // Skip App Check verification in emulator mode
    if (isEmulatorMode()) {
      return handler(req, res);
    }

    const appCheckToken = req.header("X-Firebase-AppCheck");
    if (!appCheckToken) {
      res.status(401).json({ error: "Missing App Check token" });
      return;
    }

    try {
      await admin.appCheck().verifyToken(appCheckToken);
    } catch {
      res.status(401).json({ error: "Invalid App Check token" });
      return;
    }

    return handler(req, res);
  };
}
