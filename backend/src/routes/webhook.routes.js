import express from "express";
import { constructWebhookEvent } from "../services/stripe.service.js";
import prisma from "../config/database.js";

const router = express.Router();

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = constructWebhookEvent(req.body, sig);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const { contractId } = paymentIntent.metadata;
      const amount = paymentIntent.amount / 100;

      // Save payment to database
      await prisma.payment.create({
        data: {
          paymentNumber: `STRIPE-${Date.now()}`,
          contractId,
          amount,
          totalAmount: amount,
          method: "ONLINE_PAYMENT",
          status: "PAID",
          transactionId: paymentIntent.id,
          paymentDate: new Date(),
          dueDate: new Date(),
        },
      });
      console.log(`✅ Payment recorded for contract ${contractId}`);
    }

    res.json({ received: true });
  },
);

export default router;
