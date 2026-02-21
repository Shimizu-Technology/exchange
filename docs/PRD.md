# ExChange — Product Requirements Document

**Version:** 1.0
**Date:** February 21, 2026
**Client:** Daena (Leon's auntie)
**Developer:** Shimizu Technology

---

## Guiding Principles

### 1. Fun First, Functional Always
This is a personality-driven app. If it doesn't make someone smile while using it, we've missed the point. But it still has to WORK flawlessly.

### 2. Mobile-First, Island Style
90%+ of Guam users are on phones. Every feature must feel native on mobile. Desktop is a nice-to-have, not the priority.

### 3. Stories Sell — Items Are Secondary
The breakup story is the hook. It's what makes people browse, share, and come back. The marketplace is the vehicle, the stories are the fuel.

### 4. Ship Simple, Iterate Fast
No payment processing for sales (cash meetups). No shipping logistics. Keep the MVP tight and fun. Add complexity only when validated.

### 5. Community Over Commerce
Guam is 170k people. Everyone knows someone. Build for trust, humor, and local connection — not anonymous transactions.

---

## Executive Summary

ExChange is a local marketplace app for Guam where people sell items from past relationships. Think Facebook Marketplace meets breakup therapy — every listing has a story, and that story is what makes it shareable, entertaining, and sticky.

The client (Daena) wants a dedicated platform for this niche. While Facebook Marketplace and OfferUp exist, they're generic. ExChange leans into the emotional, comedic, and cathartic angle. The breakup story behind each item is front-and-center, making every listing potential social media content.

---

## Business Information

| Field | Value |
|-------|-------|
| Client | Daena (Leon's auntie) |
| Developer | Shimizu Technology |
| Domain | TBD (not purchased yet) |
| Target Market | Guam (170k population) |
| Launch Target | Q1 2026 |

### Branding

| Element | Value |
|---------|-------|
| Name | ExChange (working title — client can rename) |
| Aesthetic | **Playful Maximalist** — bold, saturated, energetic, sassy-but-warm |
| Personality | Life of the party. Loud (in a good way). Fun. Empowering. |
| Tone | "Girl, let it GO and get paid" — not mean-petty, more empowering catharsis |
| Logo | TBD |

### Colors (Proposed)

| Role | Color | Hex | Notes |
|------|-------|-----|-------|
| Primary | Hot Pink / Magenta | `#e91e8c` | Bold, impossible to ignore |
| Secondary | Electric Yellow | `#ffe14d` | Playful energy, contrast |
| Accent | Teal | `#14b8a6` | Balances warmth, used for CTAs |
| Background (Light) | Warm White | `#faf8f5` | Not sterile, has warmth |
| Background (Dark) | Deep Charcoal | `#1a1a2e` | Night mode, not pure black |
| Text | Near Black | `#1c1917` | Warm, readable |
| Muted Text | Warm Gray | `#78716c` | Secondary info |

### Typography (Proposed)

| Role | Font | Why |
|------|------|-----|
| Display/Headlines | **Cabinet Grotesk** | Bold, playful, distinctive — NOT generic |
| Body | **Satoshi** | Clean, modern, excellent readability |

Both are on the Shimizu approved list (not Inter, not Roboto, not system-ui).

---

## Technical Architecture

### Overview

```
┌─────────────────┐
│   User's Phone   │
│   (PWA / Browser)│
└────────┬─────────┘
         │ useQuery / useMutation
         ▼
┌─────────────────┐
│    Vercel        │
│  (Next.js 15)   │
│  App Router +   │
│  Server Components│
└────────┬─────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│    Convex       │     │     Stripe      │
│  (Database,     │────▶│  (Featured      │
│   Auth, Files,  │     │   listings only)│
│   Realtime)     │     └─────────────────┘
└─────────────────┘
```

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 15 (App Router, TypeScript) | SSR, SEO, PWA |
| Backend/DB | Convex | Database, auth, realtime, file storage |
| Auth | Convex Auth | Phone/Google sign-in |
| Styling | Tailwind CSS + shadcn/ui | UI components |
| Icons | Lucide React | SVG icons (no emojis ever) |
| Motion | Framer Motion | Animations and transitions |
| Payments | Stripe Checkout | Featured listings boost |
| Analytics | PostHog | Privacy-friendly analytics |
| Error Monitoring | Sentry | Error tracking |
| Deploy (Frontend) | Vercel | Auto-deploy, edge functions |
| Deploy (Backend) | Convex Cloud | Managed, serverless |
| PWA | next-pwa / Serwist | Installable, offline browsing |

### Cost Structure

| Service | Free Tier | Paid Trigger |
|---------|-----------|--------------|
| Vercel | 100GB bandwidth | ~$20/mo if exceeded |
| Convex | 1M function calls/mo | ~$25/mo at scale |
| Stripe | 2.9% + $0.30 per charge | Per transaction |
| PostHog | 1M events/mo | Way beyond MVP needs |
| Sentry | 5K errors/mo | Way beyond MVP needs |

**MVP monthly cost: $0** until significant traction.

---

## User Roles

| Role | Description |
|------|-------------|
| **Visitor** | Browse listings and stories (no auth required) |
| **User** | Post listings, message sellers, manage profile |
| **Admin** | Moderate listings, manage users, view analytics |

### Permission Matrix

| Feature | Visitor | User | Admin |
|---------|---------|------|-------|
| Browse listings | Yes | Yes | Yes |
| Read stories | Yes | Yes | Yes |
| View seller profile | Yes | Yes | Yes |
| Post listing | No | Yes | Yes |
| Message seller | No | Yes | Yes |
| Boost listing (pay) | No | Yes | Yes |
| Edit own listings | No | Yes | Yes |
| Delete own listings | No | Yes | Yes |
| Moderate any listing | No | No | Yes |
| Ban users | No | No | Yes |
| View analytics | No | No | Yes |

---

## Feature Specifications

### 1. Listing Feed (Home Page)

**Purpose:** The main browsing experience. Equal parts shopping and entertainment.

**Requirements:**
- Scrollable card grid (masonry or uniform)
- Each card shows: lead photo, title, price, story preview (first ~80 chars), area, time posted
- Category filter pills at top (horizontal scroll on mobile)
- Area filter (Guam villages dropdown)
- Price range filter
- Sort: Latest / Trending / Price Low-High / Price High-Low
- Search bar (title + description)
- Featured listings appear with a subtle "Boosted" badge and show first
- Infinite scroll or paginated load-more
- Pull-to-refresh on mobile (PWA)

**Edge Cases:**
- No listings yet → fun empty state ("Nothing here yet. Guam must be in love")
- No results for search/filter → helpful message + clear filters CTA

### 2. Listing Detail Page

**Purpose:** Full listing view with the story prominently displayed.

**Requirements:**
- Photo carousel (swipeable on mobile, up to 5 images)
- Title, price (or "Free — just take it"), category badge, area
- **The Story** — displayed prominently, not hidden. This is the feature.
- Seller info card (avatar, name, member since, listing count)
- "I Want This" CTA button → creates conversation or opens existing one
- Share button (native share API on mobile, copy link on desktop)
- Related listings at bottom (same category or area)
- JSON-LD Product schema for SEO
- OG meta tags for social sharing (photo + title + story preview)

**Edge Cases:**
- Listing marked as sold → show "SOLD" overlay, disable "I Want This", keep visible for story
- Listing deleted/reported → 404 with redirect to home
- Seller is the current user → show "Edit" button instead of "I Want This"

### 3. Post a Listing

**Purpose:** Let users list items quickly with an emphasis on the story.

**Requirements:**
- Multi-step form (feels less overwhelming on mobile):
  1. **Photos** — upload up to 5, drag to reorder, crop/rotate
  2. **Details** — title, category (select), area (select), condition (select)
  3. **The Story** — prompted: "What's the story behind this item?" with placeholder examples. Optional but heavily encouraged. Character count shown.
  4. **Price** — number input in dollars, or toggle "Free — just take it"
  5. **Preview** — see how it'll look, then publish
- Drafts auto-saved (Convex mutation on each step)
- Category options: Jewelry & Watches, Clothes & Accessories, Electronics, Furniture & Home, Books & Media, Gifts & Misc, "Stuff They Left Behind"
- Area options: All Guam villages (Dededo, Yigo, Tamuning, Tumon, Hagatna, Mangilao, Barrigada, Chalan Pago, Sinajana, Agana Heights, Mongmong-Toto-Maite, Asan, Piti, Santa Rita, Agat, Talofofo, Inarajan, Merizo, Umatac)
- Condition: New, Like New, Good, Fair, "It's Been Through a Lot"
- Image compression client-side before upload (keep under 2MB each)

**Free tier:** 3 active listings max. Premium: unlimited.

**Edge Cases:**
- User hits 3-listing limit → show upgrade prompt
- Upload fails → retry with error message
- Very long story → cap at 2000 characters with counter

### 4. Messaging

**Purpose:** Connect buyers and sellers per listing.

**Requirements:**
- Conversation created when buyer taps "I Want This"
- Realtime messaging (Convex subscriptions — no polling)
- Message inbox page showing all conversations
- Each conversation tied to a specific listing (show listing thumbnail in header)
- Unread message count badge in nav
- Typing indicator (nice-to-have)
- "Is this still available?" quick-reply button on first message
- Seller can mark conversation as "Sold to this person" → listing status → sold

**Edge Cases:**
- Listing sold → existing conversations stay readable but can't send new messages
- User blocked → messages don't deliver, no error shown to sender
- Both users in same conversation → real-time sync

### 5. User Profile

**Purpose:** Identity, listings management, settings.

**Requirements:**
- Public profile: name, avatar, bio ("About me" — optional, can be sassy), member since, active listings
- Private dashboard: my listings (active/sold/expired), my messages, settings
- Edit profile: name, avatar upload, bio, area
- Settings: notification preferences, account deletion

### 6. Auth Flow

**Purpose:** Quick, low-friction sign-up appropriate for Guam.

**Requirements:**
- Sign up with Google (one-tap) or phone number (OTP)
- Minimal onboarding: just name + area after first sign-in
- No email/password flow (too much friction for a fun app)
- Persistent sessions (don't make people log in repeatedly)

### 7. Featured Listings (Monetization)

**Purpose:** Revenue generation through paid listing boosts.

**Requirements:**
- "Boost This Listing" button on own listing detail or dashboard
- Two tiers: $3 (24 hours) or $5 (48 hours)
- Stripe Checkout (redirect, not embedded — simpler)
- Boosted listings show a subtle badge + priority in feed sort
- Webhook confirmation from Stripe updates listing in Convex
- No recurring charges — one-time per boost

### 8. Admin Panel

**Purpose:** Content moderation and user management.

**Requirements:**
- Dashboard: total listings, total users, revenue, reported content
- Listing moderation: review reported listings, hide/remove, contact seller
- User management: view users, ban/suspend
- Simple and functional — doesn't need to be fancy
- Protected route (admin role only)

---

## Database Schema (Convex)

```typescript
// convex/schema.ts

users: defineTable({
  // Auth
  tokenIdentifier: v.string(),    // Convex Auth identifier
  // Profile
  name: v.string(),
  phone: v.optional(v.string()),
  email: v.optional(v.string()),
  avatarStorageId: v.optional(v.id("_storage")),
  bio: v.optional(v.string()),
  area: v.optional(v.string()),
  // Status
  role: v.string(),               // "user" | "admin"
  isBanned: v.boolean(),
  isPremium: v.boolean(),
  premiumUntil: v.optional(v.number()),
  // Meta
  createdAt: v.number(),
})
  .index("by_token", ["tokenIdentifier"])

listings: defineTable({
  sellerId: v.id("users"),
  title: v.string(),
  description: v.string(),
  story: v.optional(v.string()),
  price: v.number(),              // cents, 0 = free
  photos: v.array(v.id("_storage")),
  category: v.string(),
  area: v.string(),
  condition: v.string(),
  status: v.string(),             // "active" | "sold" | "expired" | "removed"
  // Boost
  featured: v.boolean(),
  featuredUntil: v.optional(v.number()),
  // Moderation
  reportCount: v.number(),
  isHidden: v.boolean(),
  // Meta
  viewCount: v.number(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_seller", ["sellerId", "status"])
  .index("by_status_created", ["status", "createdAt"])
  .index("by_category_status", ["category", "status", "createdAt"])
  .index("by_area_status", ["area", "status", "createdAt"])
  .index("by_featured", ["featured", "status", "featuredUntil"])
  .searchIndex("search_title_desc", {
    searchField: "title",
    filterFields: ["status", "category", "area"],
  })

conversations: defineTable({
  listingId: v.id("listings"),
  buyerId: v.id("users"),
  sellerId: v.id("users"),
  lastMessageAt: v.number(),
  lastMessagePreview: v.optional(v.string()),
  buyerUnread: v.number(),
  sellerUnread: v.number(),
})
  .index("by_buyer", ["buyerId", "lastMessageAt"])
  .index("by_seller", ["sellerId", "lastMessageAt"])
  .index("by_listing_buyer", ["listingId", "buyerId"])

messages: defineTable({
  conversationId: v.id("conversations"),
  senderId: v.id("users"),
  text: v.string(),
  createdAt: v.number(),
})
  .index("by_conversation", ["conversationId", "createdAt"])

reports: defineTable({
  listingId: v.id("listings"),
  reporterId: v.id("users"),
  reason: v.string(),
  details: v.optional(v.string()),
  status: v.string(),             // "pending" | "reviewed" | "dismissed"
  createdAt: v.number(),
})
  .index("by_status", ["status", "createdAt"])
  .index("by_listing", ["listingId"])
```

---

## SEO Strategy

### Per-Page Meta (Next.js Metadata API)

| Page | Title | Description |
|------|-------|-------------|
| Home | ExChange · Guam's Breakup Marketplace | Sell stuff from your ex. Buy someone else's baggage. Every item has a story. |
| Listing | {title} · ExChange | {story preview, 155 chars} |
| Category | {category} · ExChange | Browse {category} items on ExChange — Guam's breakup marketplace |
| Profile | {name} · ExChange | {name}'s listings on ExChange |

### Structured Data
- **Product** JSON-LD on listing pages (name, price, image, availability, seller)
- **WebSite** JSON-LD on home page (name, url, search action)
- **BreadcrumbList** on listing/category pages

### Technical SEO
- `robots.txt` allowing all crawlers
- Dynamic `sitemap.xml` from Convex (active listings + categories)
- Canonical URLs on all pages
- OG image generation (Next.js OG Image with listing photo + title overlay)

---

## Analytics Plan (PostHog)

### Key Events to Track

| Event | When | Why |
|-------|------|-----|
| `listing_viewed` | View listing detail | Engagement |
| `listing_created` | Publish new listing | Activation |
| `listing_boosted` | Pay for featured | Revenue |
| `message_sent` | Send chat message | Engagement |
| `signup_completed` | Finish onboarding | Growth |
| `search_performed` | Use search/filters | Product insight |
| `share_clicked` | Tap share button | Virality |
| `i_want_this_clicked` | Tap buy CTA | Conversion |

### Funnels
1. Visit → Sign Up → Create Listing (Seller activation)
2. Visit → View Listing → "I Want This" → Message Sent (Buyer conversion)
3. Create Listing → Boost Listing (Monetization)

---

## Error Monitoring Plan (Sentry)

- Frontend SDK in Next.js (catches React errors, network failures)
- Source maps uploaded on deploy
- User context attached (user ID, area)
- Alerts to Slack/email for P0 errors
- Performance monitoring for Core Web Vitals

---

## Testing Strategy

### Test Accounts

| Name | Role | Purpose |
|------|------|---------|
| Test User | user | Standard user flows |
| Test Admin | admin | Admin panel testing |

### Critical Flows (P0 — Must Work)

| Flow | Type |
|------|------|
| Sign up (Google + Phone) | E2E |
| Create listing with photos | E2E |
| Browse and filter listings | E2E |
| View listing detail + story | E2E |
| Send message to seller | E2E |
| Boost listing (Stripe) | E2E |

### Tools
- **Playwright** for E2E tests
- **Convex test utilities** for backend logic
- **Browser testing** via OpenClaw for visual QA

---

## Phase Roadmap

| Phase | Focus | Timeline |
|-------|-------|----------|
| 1 | Foundation (auth, schema, basic CRUD) | Day 1 |
| 2 | Core Features (feed, detail, messaging) | Day 2 |
| 3 | Polish (PWA, SEO, animations, mobile) | Day 3 |
| 4 | Monetization + Analytics + Launch | Day 4 |

---

## Open Questions

| Question | Status | Answer |
|----------|--------|--------|
| App name — is "ExChange" final? | ⏳ Working title | Daena can rename |
| Domain name? | ⏳ Not purchased | TBD |
| Logo/branding assets? | ⏳ None yet | Will design during build |
| Does Daena want admin access? | ⏳ Ask Leon | TBD |
| Age restriction on listings? | ⏳ Ask Leon | Probably 18+ for safety |
| Content moderation policy? | ⏳ Draft needed | What's not allowed? |

---

*Every item has a story. Every sale is closure.*
