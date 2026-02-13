import { z } from "zod";

export const NOTIFICATION_TYPES = ["rebuy_alert", "treatment_reminder", "welcome"] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const NOTIFICATION_CHANNELS = ["sms", "email"] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

export const NOTIFICATION_STATUSES = ["pending", "sent", "delivered", "failed"] as const;
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number];

// E.164 phone number format (France: +33)
const E164_REGEX = /^\+[1-9]\d{1,14}$/;

export const sendNotificationRequestSchema = z.object({
  userId: z.string().min(1),
  type: z.enum(NOTIFICATION_TYPES),
  channel: z.enum(NOTIFICATION_CHANNELS),
  data: z.object({
    phoneNumber: z.string().regex(E164_REGEX, "Format E.164 requis (ex: +33612345678)"),
    firstName: z.string().min(1),
    productName: z.string().optional(),
    productLink: z.string().url().optional(),
    treatmentName: z.string().optional(),
  }),
});

export type SendNotificationRequest = z.infer<typeof sendNotificationRequestSchema>;

// Max SMS per day per user (RGPD / anti-spam)
export const MAX_SMS_PER_DAY = 3;

// Retry configuration
export const MAX_RETRIES = 4;
export const RETRY_DELAYS_MS = [
  60_000,       // 1 min
  300_000,      // 5 min
  900_000,      // 15 min
  3_600_000,    // 1 hour
];
