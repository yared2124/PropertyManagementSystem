import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe Payment Intent
 * @param {number} amount - Amount in the smallest currency unit (e.g., cents for USD, halalas for SAR)
 * @param {string} currency - Currency code (default: sar)
 * @param {object} metadata - Additional data (contractId, tenantId, etc.)
 * @returns {Promise<Stripe.PaymentIntent>}
 */
export const createPaymentIntent = async (
  amount,
  currency = "sar",
  metadata = {},
) => {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to halalas (smallest unit)
    currency,
    metadata,
    payment_method_types: ["card"],
  });
};

/**
 * Construct Stripe webhook event
 * @param {Buffer|string} rawBody - Raw request body
 * @param {string} signature - Stripe signature header
 * @returns {Stripe.Event}
 */
export const constructWebhookEvent = (rawBody, signature) => {
  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );
};
