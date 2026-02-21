# AGENTS.md — ExChange

## Project Overview

**ExChange** is a local marketplace app for Guam where people sell items from past relationships. Think Facebook Marketplace meets breakup therapy. Every listing has a story — that's the hook.

**Client:** Leon's auntie
**Status:** Planning/scaffolding
**Lead Dev:** Theo

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Convex** (database, auth, realtime, file storage — serverless backend)
- **Tailwind CSS + shadcn/ui** (styling)
- **Stripe** (featured listings payment only)
- **Vercel** (deployment)
- **PWA** via next-pwa

This is a **serverless** project — no Rails, no separate API server. Convex is the entire backend. Next.js talks to Convex directly.

## Key Concepts

### Convex Basics (for agents unfamiliar)
- **Queries** — read data, auto-reactive (UI updates when data changes)
- **Mutations** — write data (create/update/delete)
- **Actions** — side effects (Stripe calls, external APIs)
- **Schema** — TypeScript-defined, type-safe everywhere
- All backend code lives in `/convex/` directory
- No SQL — you write TypeScript functions

### Data Model
- **Listings** — items for sale with photos, price, category, area, and breakup story
- **Messages** — realtime chat between buyer/seller per listing
- **Users** — profiles with optional bio

### Monetization
- Featured listings ($3-5 boost)
- Premium seller tier ($5/mo)
- No payment processing for actual item sales (cash meetups)

## Development

```bash
# Install deps
npm install

# Start Convex backend + Next.js frontend
npx convex dev   # in one terminal
npm run dev      # in another

# Deploy
vercel deploy    # frontend
npx convex deploy  # backend
```

## Guam-Specific Context

- **Areas:** Tumon, Dededo, Hagatna, Tamuning, Yigo, Mangilao, Barrigada, Chalan Pago, Sinajana, Agana Heights, etc.
- **Transaction style:** In-person meetup, cash. No shipping.
- **Community size:** ~170k people. Everyone knows everyone. Trust is social.
- **Language:** English primary, some CHamoru

## Design Direction

- Fun, sassy, slightly petty brand voice
- NOT corporate. NOT generic marketplace.
- Bold colors, personality-driven UI
- The story behind each listing is front and center
- Mobile-first (most users will be on phones)
- Must NOT look AI-generated (see Shimizu Frontend Design Guide)

## File Structure

```
exchange/
├── app/                    # Next.js pages
├── convex/                 # Convex backend (schema, queries, mutations)
├── components/             # React components
├── lib/                    # Utilities
└── public/                 # Static assets
```

## Rules

1. Everything in TypeScript — no JS files
2. Tailwind for all styling — no CSS modules
3. shadcn/ui for base components — customize from there
4. Mobile-first responsive design
5. Follow Shimizu Frontend Design Guide (no emojis in UI, SVGs only)
6. Convex for ALL data operations — no external DB
7. Feature branches, PRs, Greptile reviews before merge
