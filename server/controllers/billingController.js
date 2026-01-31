import User from "../models/userModel.js";
import mongoose, { Types } from "mongoose";
import Directory from "../models/directoryModel.js";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51So56VHAoQrcVPyXATKAub9g2RmPgfnJbLuFWGTsFoG4Rz6b8CN4bM6ApZ4vAHTlQFN06auOW1muKbZoC1h341kO00ovlpAsc6",
);

const PLANS = {
  BASIC_3_MONTHS: {
    plan: "Pro",
    planId: "price_1Sq7LfHAoQrcVPyXdEdJDrZl",
    interval: "3_months",
    addStorageBytes: 10 * 1024 * 1024 * 1024,
  },

  BASIC_MONTHLY: {
    plan: "Ultimate",
    planId: "price_1Sq7LzHAoQrcVPyXMmh3W4PE",
    interval: "month",
    addStorageBytes: 200 * 1024 * 1024 * 1024,
  },
};

const PLAN_ID_MAP = Object.values(PLANS).reduce((acc, plan) => {
  acc[plan.planId] = plan;
  return acc;
}, {});

export const updateSubscription = async (req, res) => {
  try {
    const { subId } = req.body; // Stripe priceId
    const { name, email } = req.body.userData;

    // 1. Verify user identity
    if (req.user.email !== email || req.user.name !== name) {
      return res.status(403).json({ error: "User details do not match" });
    }

    // 2. Validate planId & resolve plan
    const planConfig = PLAN_ID_MAP[subId];
    if (!planConfig) {
      return res.status(400).json({ error: "Invalid planId" });
    }

    // 3. Create Stripe checkout
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
      metadata: {
        userId: req.user._id.toString(),
        planId: subId,
      },
      line_items: [
        {
          price: subId,
          quantity: 1,
        },
      ],
    });

    // console.log(session);
    // 4. Mark subscription as pending + UPDATE Plan
    await User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          Plan: planConfig.plan, // ✅ "Basic"
          subscriptionStatus: "pending",
        },
      },
    );

    return res.json({ checkoutUrl: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Subscription failed" });
  }
};

const endpointSecret = "whsec_a2kUfq30BqluPlHIHjCHZLuT87wdm1wH";

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  console.log(req.headers);

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(event);

  try {
    switch (event.type) {

      // =========================   CHECKOUT COMPLETED =========================

      case "checkout.session.completed": {
        const session = event.data.object;

        // Safety checks
        if (session.mode !== "subscription") break;
        if (session.payment_status !== "paid") break;

        const planId = session.metadata.planId;
        const userId = session.metadata.userId;
        

        if (!planId || !userId) break;

        const planConfig = PLAN_ID_MAP[planId];
        if (!planConfig) break;

        await User.updateOne(
          { _id: userId },
          {
            $set: {
              Plan: planConfig.plan,
              subscriptionStatus: "active",
            },
            $inc: {
              maxStorageInBytes: planConfig.addStorageBytes,
            },
          },
        );
        break;
      }

      /* =========================
         SUBSCRIPTION UPDATED
      ========================== */
      // case "customer.subscription.updated": {
      //   const sub = event.data.object;
      //   const planId = sub.items.data[0].price.id;

      //   const planConfig = PLAN_ID_MAP[planId];
      //   if (!planConfig) break;

      //   await User.updateOne(
      //     { stripeCustomerId: sub.customer },
      //     {
      //       $set: {
      //         Plan: planConfig.plan,
      //         planId,
      //         subscriptionStatus: sub.status,
      //         storageLimitGB: planConfig.storageGB,
      //       },
      //     },
      //   );
      //   break;
      // }

      /* =========================
         SUBSCRIPTION DELETED
      ========================== */
      // case "customer.subscription.deleted": {
      //   const sub = event.data.object;

      //   await User.updateOne(
      //     { stripeCustomerId: sub.customer },
      //     {
      //       $set: {
      //         subscriptionStatus: "canceled",
      //         planId: "basic",
      //         storageLimitGB: 5,
      //       },
      //     }
      //   );
      //   break;
      // }

      //  ========================= INVOICE PAYMENT FAILED =========================

      // case "invoice.payment_failed": {
      //   const invoice = event.data.object;

      //   await User.updateOne(
      //     { stripeCustomerId: invoice.customer },
      //     {
      //       $set: {
      //         subscriptionStatus: "past_due",
      //       },
      //     }
      //   );
      //   break;
      // }

      // ========================= INVOICE PAYMENT SUCCEEDED =========================
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;

        await User.updateOne(
          { stripeCustomerId: invoice.customer },
          {
            $set: {
              subscriptionStatus: "active",
            },
          },
        );
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};
