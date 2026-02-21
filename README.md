# ExChange 💔→💰

**Guam's Breakup Marketplace** — Sell stuff from your ex, buy someone else's baggage.

A local marketplace app built for Guam where people can sell items from past relationships. Every listing has a story. Part shopping, part entertainment, fully cathartic.

## Why ExChange?

Facebook Marketplace is generic. ExChange is *specific*. The breakup story behind every listing is what makes it shareable, browsable, and fun. People will open this app just to scroll — and that's the point.

## Tech Stack

| Layer | Tool | Purpose |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR, SEO for listings |
| Backend/DB | Convex | Realtime data, auth, file storage |
| Auth | Convex Auth | Phone/Google sign-in |
| File Storage | Convex Storage | Listing photos |
| Styling | Tailwind CSS + shadcn/ui | Fast, clean UI |
| Payments | Stripe | Featured listings only |
| Deploy | Vercel | Frontend hosting |
| PWA | next-pwa | Installable on phones |

## Features (MVP)

- **Listing Feed** — Browse items with stories, filter by category/area/price
- **Post a Listing** — Photos, price, description, and the breakup story
- **Realtime Messaging** — Chat between buyer and seller per listing
- **Categories** — Jewelry, Clothes, Electronics, Furniture, "Gifts I Never Asked For"
- **Guam Areas** — Tumon, Dededo, Hagatna, Tamuning, Yigo, etc.
- **Featured Listings** — Pay $3-5 to boost your listing to the top
- **PWA** — Installable on any phone, works offline for browsing
- **User Profiles** — Your listings, messages, optional petty bio

## Monetization

- **Featured Listings** ($3-5) — Pin to top for 24-48 hours
- **Premium Seller** ($5/mo) — Verified badge, priority placement, unlimited listings
- **Free tier** — 3 active listings, standard placement

## Getting Started

```bash
# Clone
git clone https://github.com/Shimizu-Technology/exchange.git
cd exchange

# Install
npm install

# Set up Convex
npx convex dev

# Run
npm run dev
```

## Project Structure

```
exchange/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home/feed
│   ├── listing/[id]/      # Listing detail
│   ├── post/              # Create listing
│   ├── messages/          # Chat inbox
│   └── profile/           # User profile
├── convex/                # Convex backend
│   ├── schema.ts          # Data model
│   ├── listings.ts        # Listing queries/mutations
│   ├── messages.ts        # Chat queries/mutations
│   └── users.ts           # User queries/mutations
├── components/            # Reusable UI components
├── lib/                   # Utilities
└── public/                # Static assets
```

## Data Model

### Listings
- `sellerId`, `title`, `description`, `story` (the breakup story)
- `price` (cents), `photos` (Convex storage IDs)
- `category`, `area`, `status` (active/sold/expired)
- `featured`, `featuredUntil`

### Messages
- `listingId`, `senderId`, `receiverId`, `text`, `readAt`

### Users
- `name`, `phone`, `avatar`, `bio`, `listingCount`

## Environment

- **Target audience**: Guam (170k population, tight-knit community)
- **Transactions**: In-person meetup/pickup (no shipping)
- **Payments**: Cash in person (app only charges for premium features)

## Links

- **Org**: [Shimizu Technology](https://github.com/Shimizu-Technology)
- **Client**: Leon's auntie

---

*Every item has a story. Every sale is closure.*
