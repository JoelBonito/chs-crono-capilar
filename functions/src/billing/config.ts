import { defineSecret, defineString } from "firebase-functions/params";

export const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
export const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");

// Stripe price ID for Premium subscription (set via firebase functions:config or .env)
export const stripePremiumPriceId = defineString("STRIPE_PREMIUM_PRICE_ID", {
  default: "price_premium_monthly",
  description: "Stripe Price ID for the Premium monthly subscription",
});

export function getPremiumPriceId(): string {
  return stripePremiumPriceId.value();
}

export const PREMIUM_PLAN = {
  name: "CronoCapilar Premium",
  priceMonthly: 990, // 9,90€ in cents
  currency: "eur",
  interval: "month" as const,
};
