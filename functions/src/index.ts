import "./init"; // Must be first
import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { REGION } from "./shared/config";
import { ALLOWED_ORIGINS } from "./shared/cors";
// TODO: Re-enable App Check after configuring reCAPTCHA v3 correctly
// import { withAppCheck } from "./shared/appcheck";
import { handleAnalyzeHair } from "./diagnostic/handler";
import { handleGenerateSchedule } from "./schedule/handler";
import { handleSyncCalendar } from "./calendar/handler";
import { calendarTokenSecret } from "./calendar/token";
import { handleRegisterProduct, handleUpdateProductUsage } from "./products/handler";
import { handleSendNotification, handleRetryNotifications } from "./notifications/handler";
import { twilioAccountSid, twilioAuthToken, twilioFromNumber } from "./notifications/sender";
import { handleAggregateMetrics, handleGetAdminStats } from "./analytics/handler";
import { handleCreateCheckout, handleCreatePortal, handleStripeWebhook } from "./billing/handler";
import { stripeSecretKey, stripeWebhookSecret } from "./billing/config";
import { handleDeleteAccount } from "./account/handler";

// Health check endpoint (no App Check — public)
export const healthCheck = onRequest(
  { region: REGION },
  (_req, res) => {
    res.json({
      status: "ok",
      service: "cronocapilar-api",
      region: REGION,
      timestamp: new Date().toISOString(),
    });
  },
);

// Diagnostic: analyze hair photos with Gemini
export const analyzeHair = onRequest(
  {
    region: REGION,
    cors: ALLOWED_ORIGINS,
    timeoutSeconds: 120,
    memory: "512MiB",
  },
  handleAnalyzeHair,
);

// Schedule: generate H/N/R cycle from diagnostic
export const generateSchedule = onRequest(
  {
    region: REGION,
    cors: ALLOWED_ORIGINS,
    timeoutSeconds: 30,
    secrets: [calendarTokenSecret],
  },
  handleGenerateSchedule,
);

// Calendar: export .ics for Google Calendar / Apple Calendar / Outlook
export const syncCalendar = onRequest(
  {
    region: REGION,
    cors: ALLOWED_ORIGINS,
    secrets: [calendarTokenSecret],
  },
  handleSyncCalendar,
);

// Products: register a product with volume tracking
export const registerProduct = onRequest(
  {
    region: REGION,
    cors: ALLOWED_ORIGINS,
    timeoutSeconds: 30,
  },
  handleRegisterProduct,
);

// Products: update consumption after a treatment session
export const updateProductUsage = onRequest(
  {
    region: REGION,
    cors: ALLOWED_ORIGINS,
    timeoutSeconds: 30,
  },
  handleUpdateProductUsage,
);

// Notifications: send SMS via Twilio
export const sendNotification = onRequest(
  {
    region: REGION,
    cors: ALLOWED_ORIGINS,
    timeoutSeconds: 30,
    secrets: [twilioAccountSid, twilioAuthToken, twilioFromNumber],
  },
  handleSendNotification,
);

// Notifications: retry failed SMS every 5 minutes (scheduler — no App Check)
export const retryNotifications = onSchedule(
  {
    region: REGION,
    schedule: "every 5 minutes",
    timeoutSeconds: 120,
    secrets: [twilioAccountSid, twilioAuthToken, twilioFromNumber],
  },
  handleRetryNotifications,
);

// Analytics: aggregate daily metrics at 02:00 UTC (scheduler — no App Check)
export const aggregateMetrics = onSchedule(
  {
    region: REGION,
    schedule: "0 2 * * *",
    timeoutSeconds: 120,
    memory: "512MiB",
  },
  handleAggregateMetrics,
);

// Analytics: get aggregated admin stats
export const getAdminStats = onRequest(
  {
    region: REGION,
    cors: ALLOWED_ORIGINS,
    timeoutSeconds: 30,
  },
  handleGetAdminStats,
);

// Billing: create Stripe Checkout session for Premium subscription
export const createCheckoutSession = onRequest(
  {
    region: REGION,
    cors: ALLOWED_ORIGINS,
    timeoutSeconds: 30,
    secrets: [stripeSecretKey],
  },
  handleCreateCheckout,
);

// Billing: create Stripe Customer Portal session
export const createPortalSession = onRequest(
  {
    region: REGION,
    cors: ALLOWED_ORIGINS,
    timeoutSeconds: 30,
    secrets: [stripeSecretKey],
  },
  handleCreatePortal,
);

// Account: RGPD Art. 17 — cascade delete all user data
export const deleteAccount = onRequest(
  {
    region: REGION,
    cors: ALLOWED_ORIGINS,
    timeoutSeconds: 120,
  },
  handleDeleteAccount,
);

// Billing: Stripe webhook handler (no CORS, no App Check — Stripe POSTs directly)
export const stripeWebhook = onRequest(
  {
    region: REGION,
    timeoutSeconds: 60,
    secrets: [stripeSecretKey, stripeWebhookSecret],
  },
  handleStripeWebhook,
);
