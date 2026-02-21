# AGENTS.md — ExChange

## Project Overview

**ExChange** is a local marketplace app for Guam where people sell items from past relationships. Think Facebook Marketplace meets breakup therapy. Every listing has a story — that's the hook.

**Client:** Daena (Leon's auntie)
**Status:** Planning → Build
**Lead Dev:** Theo
**Repo:** https://github.com/Shimizu-Technology/exchange

## Key Documents

- **PRD:** `docs/PRD.md` — Full product requirements, schema, SEO, analytics plan
- **BUILD_PLAN:** `docs/BUILD_PLAN.md` — Phased tasks with checkboxes
- **MVP_PLAN:** `docs/MVP_PLAN.md` — Original feature overview

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Convex** (database, auth, realtime, file storage — serverless backend)
- **Tailwind CSS + shadcn/ui** (styling)
- **Lucide React** (SVG icons — NO EMOJIS EVER)
- **Framer Motion** (animations)
- **Stripe Checkout** (featured listings payment only)
- **PostHog** (analytics)
- **Sentry** (error monitoring)
- **Vercel** (frontend deployment)
- **next-pwa / Serwist** (PWA)

This is a **serverless** project — no Rails, no separate API server. Convex is the entire backend.

## Convex Basics (for agents unfamiliar)

- **Queries** — read data, auto-reactive (UI updates when data changes)
- **Mutations** — write data (create/update/delete)
- **Actions** — side effects (Stripe calls, external APIs)
- **Schema** — TypeScript-defined in `convex/schema.ts`, type-safe everywhere
- All backend code lives in `/convex/` directory
- No SQL — you write TypeScript functions
- Realtime by default — no websockets to configure

## Design Direction — CRITICAL

### Aesthetic: Playful Maximalist

Bold, saturated, energetic, life-of-the-party energy. The app should make you smile. Think Depop meets early TikTok meets a party invitation.

**Personality:** Sassy but warm. Not mean-petty — more "let it go and get paid" empowering catharsis. Fun, loud (in a good way), playful.

### Brand Colors

| Role | Color | Hex |
|------|-------|-----|
| Primary | Hot Pink / Magenta | `#e91e8c` |
| Secondary | Electric Yellow | `#ffe14d` |
| Accent | Teal | `#14b8a6` |
| Background Light | Warm White | `#faf8f5` |
| Background Dark | Deep Charcoal | `#1a1a2e` |
| Text | Near Black | `#1c1917` |
| Muted | Warm Gray | `#78716c` |

### Typography

| Role | Font |
|------|------|
| Display / Headlines | **Cabinet Grotesk** |
| Body | **Satoshi** |

### Shimizu Hard Rules (from Frontend Design Guide)

**MUST follow — no exceptions:**

1. **NO EMOJIS in UI** — Use Lucide React SVG icons instead. Never `<span>🎉</span>`. This applies to buttons, labels, headings, nav, badges, EVERYTHING.
2. **NO Inter, Roboto, Arial, system-ui** — We use Cabinet Grotesk + Satoshi
3. **NO purple-to-blue gradients** — The #1 AI slop signal
4. **NO Tailwind `blue-500` as primary** — We have a custom palette
5. **NO cookie-cutter layouts** — No "hero → 3 features → testimonials → CTA"
6. **NO `rounded-lg` on everything** — Vary border radius intentionally
7. **NO default Tailwind shadows unchanged** — Use tinted shadows or none
8. **Dark mode backgrounds:** Never pure `#000000` — use `#1a1a2e`
9. **Dark mode text:** Never pure `#ffffff` — use `#ececec` or `#e5e5e5`
10. **Every animation needs a PURPOSE** — guide attention, show relationships, add delight

**DO:**
- Choose distinctive, characterful fonts (we have)
- Use CSS variables for color consistency
- Bold accent colors with warm neutrals
- Fast animations (200-400ms), always eased
- Generous negative space OR controlled density
- Unexpected layouts, asymmetry, grid-breaking elements
- Add depth: gradient meshes, noise textures, geometric patterns
- Mobile-first responsive design

### Brand Voice (in UI copy)

- Tagline: "Every item has a story. Every sale is closure."
- CTA: "I Want This" (not "Contact Seller")
- Empty state: "Nothing here yet. Guam must be in love."
- Post prompt: "What's the story? (The pettier, the better.)"
- Sold badge: "Gone. Just like they are."
- Condition option: "It's Been Through a Lot"
- Category: "Stuff They Left Behind"

## Data Model Summary

- **users** — auth, profile, area, role, premium status
- **listings** — item with photos, price, story, category, area, boost status
- **conversations** — per-listing chat thread between buyer + seller
- **messages** — individual messages within conversation
- **reports** — content moderation

Full schema in `docs/PRD.md`.

## Monetization

- **Featured listings** ($3/24hr, $5/48hr boost via Stripe Checkout)
- **Free tier:** 3 active listings max
- **Premium seller (post-MVP):** $5/mo unlimited listings
- **No payment processing for item sales** — cash meetups only

## Guam Context

- **Population:** ~170k people on island
- **Villages:** Dededo, Yigo, Tamuning, Tumon, Hagatna, Mangilao, Barrigada, Chalan Pago, Sinajana, Agana Heights, Mongmong-Toto-Maite, Asan, Piti, Santa Rita, Agat, Talofofo, Inarajan, Merizo, Umatac
- **Transaction style:** In-person meetup, cash. No shipping.
- **Community:** Everyone knows everyone. Trust is social.
- **Language:** English primary, some CHamoru

## Development

```bash
npm install
npx convex dev    # terminal 1 — Convex backend
npm run dev       # terminal 2 — Next.js frontend
```

## File Structure

```
exchange/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui base components
│   └── ...                # Feature components
├── convex/                 # Convex backend
│   ├── schema.ts          # Data model
│   ├── listings.ts        # Listing queries/mutations
│   ├── messages.ts        # Chat queries/mutations
│   ├── users.ts           # User queries/mutations
│   └── payments.ts        # Stripe actions
├── lib/                   # Utilities, constants
├── public/                # Static assets
└── docs/                  # PRD, BUILD_PLAN, MVP_PLAN
```

## Rules

1. **TypeScript everywhere** — no `.js` files
2. **Tailwind for all styling** — no CSS modules, no styled-components
3. **shadcn/ui for base components** — customize heavily to match brand
4. **Lucide React for ALL icons** — no emojis, no icon fonts
5. **Mobile-first** — design for phone, enhance for desktop
6. **Convex for ALL data** — no external database
7. **Feature branches + PRs** — Greptile reviews before merge
8. **Follow the Shimizu Frontend Design Guide** — see hard rules above
9. **Test critical flows** — auth, listing CRUD, messaging, payments
10. **The story is the feature** — always give it visual prominence
