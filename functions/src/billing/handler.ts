import * as admin from "firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import Stripe from "stripe";
import type { Request, Response } from "express";
import { stripeSecretKey, stripeWebhookSecret, getPremiumPriceId } from "./config";
import { verifyAuth } from "../shared/auth";
import { logInfo, logError } from "../shared/logger";

const db = admin.firestore();

const ALLOWED_REDIRECT_HOSTS = [
  "cronocapilar.web.app",
  "cronocapilar.firebaseapp.com",
  "cronocapilar.inoveai.app.br",
  "localhost",
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

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(stripeSecretKey.value());
  }
  return stripeInstance;
}

/**
 * POST /createCheckoutSession
 * Creates a Stripe Checkout session for Premium subscription.
 */
export async function handleCreateCheckout(req: Request, res: Response): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const decodedToken = await verifyAuth(req);
  if (!decodedToken) {
    res.status(401).json({ error: "auth/unauthorized", message: "Token JWT manquant ou invalide." });
    return;
  }

  const uid = decodedToken.uid;
  const { successUrl, cancelUrl } = req.body;

  if (typeof successUrl !== "string" || typeof cancelUrl !== "string") {
    res.status(400).json({ error: "billing/invalid-params", message: "successUrl et cancelUrl requis." });
    return;
  }

  if (!isAllowedRedirectUrl(successUrl) || !isAllowedRedirectUrl(cancelUrl)) {
    res.status(400).json({ error: "billing/invalid-redirect", message: "URL de redirection non autorisée." });
    return;
  }

  const stripe = getStripe();

  try {
    // Check if user already has a Stripe customer ID
    const userSnap = await db.collection("users").doc(uid).get();
    const userData = userSnap.data();
    let customerId = userData?.stripeCustomerId as string | undefined;

    // Create Stripe customer if needed
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData?.email ?? decodedToken.email,
        metadata: { firebaseUid: uid },
      });
      customerId = customer.id;

      await db.collection("users").doc(uid).update({
        stripeCustomerId: customerId,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    // Check for existing active subscription
    const existingSub = await db
      .collection("subscriptions")
      .where("userId", "==", uid)
      .where("status", "in", ["active", "trialing"])
      .limit(1)
      .get();

    if (!existingSub.empty) {
      res.status(400).json({
        error: "billing/already-subscribed",
        message: "Vous avez déjà un abonnement Premium actif.",
      });
      return;
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: getPremiumPriceId(), quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { firebaseUid: uid },
      locale: "fr",
      allow_promotion_codes: true,
    });

    logInfo("billing/checkout-created", { uid, sessionId: session.id });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err) {
    logError("billing/checkout-failed", err, { uid });
    res.status(500).json({
      error: "billing/checkout-failed",
      message: "Impossible de créer la session de paiement.",
    });
  }
}

/**
 * POST /createPortalSession
 * Creates a Stripe Customer Portal session for subscription management.
 */
export async function handleCreatePortal(req: Request, res: Response): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const decodedToken = await verifyAuth(req);
  if (!decodedToken) {
    res.status(401).json({ error: "auth/unauthorized", message: "Token JWT manquant ou invalide." });
    return;
  }

  const uid = decodedToken.uid;
  const { returnUrl } = req.body;

  if (typeof returnUrl !== "string") {
    res.status(400).json({ error: "billing/invalid-params", message: "returnUrl requis." });
    return;
  }

  if (!isAllowedRedirectUrl(returnUrl)) {
    res.status(400).json({ error: "billing/invalid-redirect", message: "URL de redirection non autorisée." });
    return;
  }

  const userSnap = await db.collection("users").doc(uid).get();
  const customerId = userSnap.data()?.stripeCustomerId as string | undefined;

  if (!customerId) {
    res.status(400).json({
      error: "billing/no-customer",
      message: "Aucun compte de facturation trouvé.",
    });
    return;
  }

  const stripe = getStripe();

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    logInfo("billing/portal-created", { uid });

    res.status(200).json({ url: session.url });
  } catch (err) {
    logError("billing/portal-failed", err, { uid });
    res.status(500).json({
      error: "billing/portal-failed",
      message: "Impossible d'accéder au portail de gestion.",
    });
  }
}

/**
 * POST /stripeWebhook
 * Handles Stripe webhook events for subscription lifecycle.
 * NOTE: This endpoint must NOT use verifyAuth — Stripe sends its own signature.
 */
export async function handleStripeWebhook(req: Request, res: Response): Promise<void> {
  const stripe = getStripe();
  const sig = req.headers["stripe-signature"];

  if (!sig || typeof sig !== "string") {
    res.status(400).json({ error: "webhook/missing-signature" });
    return;
  }

  let event: Stripe.Event;
  try {
    // Firebase Functions v2 provides the raw body on req.body when content-type isn't JSON
    const rawBody = (req as unknown as { rawBody: Buffer }).rawBody ?? req.body;
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      stripeWebhookSecret.value(),
    );
  } catch (err) {
    logError("webhook/verification-failed", err);
    res.status(400).json({ error: "webhook/invalid-signature" });
    return;
  }

  logInfo("webhook/received", { type: event.type, id: event.id });

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await onCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.updated":
        await onSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await onSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.payment_failed":
        await onPaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        logInfo("webhook/unhandled-event", { type: event.type });
    }

    res.status(200).json({ received: true });
  } catch (err) {
    logError("webhook/handler-failed", err, { type: event.type });
    res.status(500).json({ error: "webhook/handler-failed" });
  }
}

// --- Webhook event handlers ---

async function onCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const uid = session.metadata?.firebaseUid;
  if (!uid) return;

  const subscriptionId = session.subscription as string;
  if (!subscriptionId) return;

  await db.collection("subscriptions").doc(subscriptionId).set({
    id: subscriptionId,
    userId: uid,
    stripeCustomerId: session.customer as string,
    status: "active",
    priceId: getPremiumPriceId(),
    currentPeriodStart: Timestamp.now(),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  // Update user document with premium status
  await db.collection("users").doc(uid).update({
    isPremium: true,
    subscriptionId,
    updatedAt: FieldValue.serverTimestamp(),
  });

  logInfo("billing/subscription-activated", { uid, subscriptionId });
}

async function onSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const subDoc = await db.collection("subscriptions").doc(subscription.id).get();
  if (!subDoc.exists) return;

  const status = subscription.status;
  const isActive = status === "active" || status === "trialing";

  await subDoc.ref.update({
    status,
    currentPeriodEnd: subscription.current_period_end
      ? Timestamp.fromMillis(subscription.current_period_end * 1000)
      : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: FieldValue.serverTimestamp(),
  });

  const userId = subDoc.data()?.userId;
  if (userId) {
    await db.collection("users").doc(userId).update({
      isPremium: isActive,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  logInfo("billing/subscription-updated", { subscriptionId: subscription.id, status });
}

async function onSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const subDoc = await db.collection("subscriptions").doc(subscription.id).get();
  if (!subDoc.exists) return;

  await subDoc.ref.update({
    status: "canceled",
    updatedAt: FieldValue.serverTimestamp(),
  });

  const userId = subDoc.data()?.userId;
  if (userId) {
    await db.collection("users").doc(userId).update({
      isPremium: false,
      subscriptionId: null,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  logInfo("billing/subscription-canceled", { subscriptionId: subscription.id });
}

async function onPaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const customerId = invoice.customer as string;
  if (!customerId) return;

  // Find user by stripeCustomerId
  const userSnap = await db
    .collection("users")
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .get();

  if (!userSnap.empty) {
    const userId = userSnap.docs[0]!.id;
    logError("billing/payment-failed", new Error("Invoice payment failed"), {
      userId,
      invoiceId: invoice.id,
    });
  }
}
