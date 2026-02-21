# ExChange

**Guam's Breakup Marketplace** — Sell stuff from your ex, buy someone else's baggage.

A local marketplace where every listing has a story. Part shopping, part entertainment, fully cathartic.

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Backend | Convex (database, auth, realtime, file storage) |
| Styling | Tailwind CSS + shadcn/ui |
| Icons | Lucide React (SVGs only) |
| Animation | Framer Motion |
| Payments | Stripe (featured listing boosts) |
| Analytics | PostHog |
| Errors | Sentry |
| Deploy | Vercel + Convex Cloud |
| PWA | next-pwa / Serwist |

## Getting Started

```bash
git clone https://github.com/Shimizu-Technology/exchange.git
cd exchange
npm install

# Terminal 1 — Convex backend
npx convex dev

# Terminal 2 — Next.js frontend
npm run dev
```

## Documentation

| Document | Purpose |
|----------|---------|
| `AGENTS.md` | Agent context, design rules, tech overview |
| `docs/PRD.md` | Full product requirements document |
| `docs/BUILD_PLAN.md` | Phased build plan with checkboxes |
| `docs/MVP_PLAN.md` | Original feature overview |

## Features

- Browse listings with stories, filter by category/area/price
- Post items with photos and breakup stories
- Realtime messaging between buyers and sellers
- Featured listing boosts (Stripe)
- PWA — installable on any phone
- User profiles with personality

## Design

**Aesthetic:** Playful Maximalist — bold, saturated, energetic
**Fonts:** Cabinet Grotesk (display) + Satoshi (body)
**Colors:** Hot Pink + Electric Yellow + Teal on warm neutrals

---

*Every item has a story. Every sale is closure.*
