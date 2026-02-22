import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

const BOOST_PRICES = {
  "24hr": { amount: 300, label: "24-Hour Boost", hours: 24 },
  "48hr": { amount: 500, label: "48-Hour Boost", hours: 48 },
} as const;

export async function POST(req: NextRequest) {
  try {
    const { listingId, listingTitle, boostType, userId } = await req.json();

    if (!listingId || !boostType || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const boost = BOOST_PRICES[boostType as keyof typeof BOOST_PRICES];
    if (!boost) {
      return NextResponse.json({ error: "Invalid boost type" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3001";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${boost.label} — ${listingTitle || "Listing"}`,
              description: `Boost your listing to the top of the feed for ${boost.hours} hours`,
            },
            unit_amount: boost.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        listingId,
        userId,
        boostType,
        boostHours: boost.hours.toString(),
      },
      success_url: `${origin}/listing/${listingId}?boosted=true`,
      cancel_url: `${origin}/listing/${listingId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
