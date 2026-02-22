import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  // In dev/test without webhook secret, just parse the event
  let event: Stripe.Event;
  if (process.env.STRIPE_WEBHOOK_SECRET && sig) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    event = JSON.parse(body);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { listingId, boostHours } = session.metadata || {};

    if (listingId && boostHours) {
      try {
        await convex.mutation(api.listings.boostListing, {
          id: listingId as Id<"listings">,
          hours: parseInt(boostHours, 10),
        });
        console.log(`Boosted listing ${listingId} for ${boostHours} hours`);
      } catch (e: any) {
        console.error("Failed to boost listing:", e.message);
      }
    }
  }

  return NextResponse.json({ received: true });
}
