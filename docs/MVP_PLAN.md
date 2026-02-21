# ExChange MVP Plan

## Vision

A local Guam marketplace where people sell items from past relationships. The breakup story behind each listing is what makes it unique, shareable, and entertaining. Part marketplace, part content platform.

## MVP Scope

### Core Pages

1. **Home/Feed** (`/`)
   - Scrollable listing cards with photo, title, price, story preview
   - Category filter pills (All, Jewelry, Clothes, Electronics, Furniture, Other)
   - Area filter (Guam villages)
   - Price range filter
   - "Trending" / "Latest" sort
   - Search bar

2. **Listing Detail** (`/listing/[id]`)
   - Photo carousel
   - Full breakup story
   - Price, category, area
   - Seller info (name, avatar, listing count)
   - "I Want This" button → opens/creates chat
   - Share button (social sharing for viral growth)
   - Related listings

3. **Post a Listing** (`/post`)
   - Multi-step form:
     1. Upload photos (up to 5)
     2. Title + description + category + area
     3. The Story (prompted: "What's the story behind this item?")
     4. Set price (or "Free — just take it")
     5. Preview → Publish

4. **Messages** (`/messages`)
   - Inbox with conversation list
   - Per-listing chat threads
   - Realtime (Convex subscription)
   - Unread badge count

5. **Profile** (`/profile`)
   - Your active listings
   - Your sold items
   - Edit profile (name, avatar, bio)
   - Settings

6. **Category Browse** (`/category/[slug]`)
   - Filtered feed by category

### Auth Flow
- Sign up with phone number or Google
- Phone verification via OTP
- Minimal profile setup (name, area)

### Categories
- Jewelry & Watches
- Clothes & Accessories
- Electronics
- Furniture & Home
- Books & Media
- Gifts & Misc
- "Stuff They Left Behind" (catch-all)

### Guam Areas
- Dededo, Yigo, Tamuning, Tumon, Hagatna, Mangilao, Barrigada
- Chalan Pago, Sinajana, Agana Heights, Mongmong-Toto-Maite
- Asan, Piti, Santa Rita, Agat, Talofofo, Inarajan, Merizo, Umatac

## Monetization (MVP)

### Featured Listings
- $3 for 24-hour boost
- $5 for 48-hour boost
- Stripe Checkout (one-time payment)
- Featured items show with a badge + appear at top of feed

### Free Tier Limits
- 3 active listings at a time
- Standard feed placement
- Unlimited messaging

### Premium Seller (Post-MVP)
- $5/month
- Unlimited active listings
- Verified badge
- Priority in search results

## Design Principles

1. **Story-first** — The breakup story is as prominent as the item photos
2. **Fun, not corporate** — Sassy copy, bold personality, slight pettiness
3. **Mobile-first** — 90%+ of Guam users will be on phones
4. **Fast** — Listings load instantly, images optimized
5. **Shareable** — Every listing is a potential social media post (OG tags)
6. **Local** — Area selection, meetup-focused, no shipping complexity

## Brand Voice Examples

- Tagline: "Every item has a story. Every sale is closure."
- Category: "Stuff They Left Behind"
- CTA: "I Want This"
- Empty state: "Nothing here yet. Lucky you — or unlucky in love?"
- Post prompt: "What's the story? (The pettier, the better.)"
- Sold badge: "Gone. Just like they are."

## Technical Architecture

```
Browser/PWA
    ↓ (useQuery / useMutation)
Convex Cloud
    ├── listings.ts (CRUD, search, featured)
    ├── messages.ts (realtime chat)
    ├── users.ts (auth, profiles)
    ├── payments.ts (Stripe actions)
    └── storage (listing photos)
```

### Convex Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.optional(v.string()),
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    avatar: v.optional(v.id("_storage")),
    bio: v.optional(v.string()),
    area: v.optional(v.string()),
    isPremium: v.boolean(),
    premiumUntil: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  listings: defineTable({
    sellerId: v.id("users"),
    title: v.string(),
    description: v.string(),
    story: v.optional(v.string()),
    price: v.number(), // cents, 0 = free
    photos: v.array(v.id("_storage")),
    category: v.string(),
    area: v.string(),
    status: v.string(), // "active" | "sold" | "expired"
    featured: v.boolean(),
    featuredUntil: v.optional(v.number()),
    viewCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_seller", ["sellerId"])
    .index("by_category", ["category", "status"])
    .index("by_area", ["area", "status"])
    .index("by_status_created", ["status", "createdAt"])
    .index("by_featured", ["featured", "featuredUntil"]),

  messages: defineTable({
    listingId: v.id("listings"),
    senderId: v.id("users"),
    receiverId: v.id("users"),
    text: v.string(),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_listing", ["listingId", "createdAt"])
    .index("by_receiver_unread", ["receiverId", "readAt"]),

  conversations: defineTable({
    listingId: v.id("listings"),
    buyerId: v.id("users"),
    sellerId: v.id("users"),
    lastMessageAt: v.number(),
  })
    .index("by_buyer", ["buyerId", "lastMessageAt"])
    .index("by_seller", ["sellerId", "lastMessageAt"])
    .index("by_listing_buyer", ["listingId", "buyerId"]),
});
```

## Sprint Plan

### Day 1 — Foundation
- [ ] Next.js 15 + TypeScript + Tailwind + shadcn/ui setup
- [ ] Convex project init + schema
- [ ] Auth (Convex Auth or Clerk)
- [ ] Listing CRUD (create, read, list)
- [ ] Image upload to Convex Storage
- [ ] Home feed with listing cards

### Day 2 — Features + Polish
- [ ] Listing detail page
- [ ] Messaging (realtime chat)
- [ ] User profiles
- [ ] Search + filters (category, area, price)
- [ ] PWA setup
- [ ] Deploy to Vercel + Convex Cloud

### Day 3 — Monetization + Launch Prep
- [ ] Featured listings (Stripe integration)
- [ ] Share/OG tags for listings
- [ ] Mobile polish
- [ ] SEO basics
- [ ] Final deploy

## Post-MVP Features
- Premium seller subscriptions
- Story reactions/upvotes ("Most Petty" leaderboard)
- Push notifications (new messages, listing sold)
- Report/moderation system
- Saved/favorited listings
- "Similar stories" recommendations
