import { logger } from "firebase-functions/v2";

/**
 * Mask a phone number for safe logging: +33612345678 → +336****5678
 */
export function maskPhone(phone: string): string {
  if (phone.length <= 6) return "***";
  return phone.slice(0, 4) + "****" + phone.slice(-4);
}

export function logInfo(action: string, data: Record<string, unknown>) {
  logger.info(action, { ...data, service: "cronocapilar-api" });
}

export function logError(action: string, error: unknown, data?: Record<string, unknown>) {
  const message = error instanceof Error ? error.message : String(error);
  logger.error(action, { ...data, error: message, service: "cronocapilar-api" });
}

export function logWarn(action: string, data: Record<string, unknown>) {
  logger.warn(action, { ...data, service: "cronocapilar-api" });
}
