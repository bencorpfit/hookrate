import Stripe from "stripe";

// Lazy initialization — build won't crash without STRIPE_SECRET_KEY
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-03-25.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

// For convenience — use getStripe() in API routes
export const stripe = {
  get instance() {
    return getStripe();
  },
};

// Price ID for Pro plan — set these in Stripe Dashboard + Vercel env vars
export const STRIPE_PRICE_MONTHLY = process.env.STRIPE_PRICE_MONTHLY_ID || "";
export const STRIPE_PRICE_YEARLY = process.env.STRIPE_PRICE_YEARLY_ID || "";
