# ExChange — Build Plan

## Current Status

**Last Updated:** February 22, 2026

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 | ✅ Complete | Foundation |
| Phase 2 | ✅ Complete | Core Features |
| Phase 3 | 🟡 Partial | Polish + PWA (animations done, PWA manifest done, service worker TBD) |
| Phase 4 | ⬜ Not Started | Monetization + Launch |

### URLs
- **Production:** TBD
- **Staging:** TBD (Vercel preview deploys)
- **Local:** http://localhost:3000

---

## Phase 1: Foundation (Day 1)

### 1.1 Project Setup
- [ ] Initialize Next.js 15 (App Router, TypeScript, Tailwind)
- [ ] Install and configure shadcn/ui
- [ ] Install lucide-react for icons (NO emojis)
- [ ] Install framer-motion for animations
- [ ] Set up CSS variables for brand colors (hot pink, electric yellow, teal)
- [ ] Configure fonts: Cabinet Grotesk (display) + Satoshi (body)
- [ ] Create `.cursor/rules/` for AI agent context
- [ ] Set up ESLint + Prettier config
- [ ] Create `.env.example` with all required vars

### 1.2 Convex Setup
- [ ] Initialize Convex project (`npx convex init`)
- [ ] Define full schema (`convex/schema.ts`)
- [ ] Set up Convex Auth (Google + Phone providers)
- [ ] Create auth helper functions
- [ ] Test auth flow locally

### 1.3 Core Layout
- [ ] App layout with nav (mobile bottom nav + desktop top nav)
- [ ] Mobile-first responsive shell
- [ ] Loading states and skeleton components
- [ ] Error boundary component (not Sentry yet, just visual)
- [ ] 404 page with personality

### 1.4 Listing CRUD (Backend)
- [ ] `listings.create` mutation (with photo upload)
- [ ] `listings.get` query (single listing by ID)
- [ ] `listings.list` query (paginated, with filters)
- [ ] `listings.update` mutation
- [ ] `listings.remove` mutation (soft delete → status: removed)
- [ ] `listings.search` query (full-text search on title)
- [ ] `listings.markSold` mutation
- [ ] Image upload to Convex Storage (with client-side compression)

### 1.5 User Profile (Backend)
- [ ] `users.create` mutation (on first auth)
- [ ] `users.get` query (by ID)
- [ ] `users.getMe` query (current user)
- [ ] `users.update` mutation (name, bio, area, avatar)
- [ ] Auto-create user record on first sign-in

---

## Phase 2: Core Features (Day 2)

### 2.1 Home Feed Page
- [ ] Listing card component (photo, title, price, story preview, area)
- [ ] Card grid layout (responsive: 1 col mobile, 2 tablet, 3 desktop)
- [ ] Category filter pills (horizontal scroll mobile)
- [ ] Area filter dropdown
- [ ] Price range filter
- [ ] Sort selector (Latest, Trending, Price)
- [ ] Search bar with debounced query
- [ ] Infinite scroll / load more
- [ ] Empty state ("Nothing here yet. Guam must be in love 💔" — wait, SVG heart icon, no emoji)
- [ ] Featured listings badge + priority sort
- [ ] Pull-to-refresh feel

### 2.2 Listing Detail Page
- [ ] Photo carousel (swipeable on mobile)
- [ ] Title, price, category badge, area, condition, posted time
- [ ] Story section (prominently displayed)
- [ ] Seller info card (avatar, name, member since, listing count)
- [ ] "I Want This" CTA button
- [ ] Share button (Web Share API on mobile, clipboard fallback)
- [ ] Related listings section
- [ ] "Edit" button if current user is seller
- [ ] "SOLD" overlay state
- [ ] "Report" button

### 2.3 Post Listing Flow
- [ ] Multi-step form component (step indicator)
- [ ] Step 1: Photo upload (up to 5, drag to reorder, preview)
- [ ] Step 2: Details (title, category select, area select, condition select)
- [ ] Step 3: Story textarea with placeholder prompts + char count
- [ ] Step 4: Price input (dollars) with "Free" toggle
- [ ] Step 5: Preview card → Publish button
- [ ] Client-side image compression before upload
- [ ] Draft auto-save between steps
- [ ] Free tier limit check (3 active listings)
- [ ] Success animation on publish

### 2.4 Messaging System
- [ ] `conversations.getOrCreate` mutation
- [ ] `conversations.list` query (current user's conversations)
- [ ] `messages.send` mutation
- [ ] `messages.list` query (by conversation, realtime)
- [ ] `conversations.markRead` mutation
- [ ] Messages inbox page (conversation list with preview)
- [ ] Chat view per conversation (listing thumbnail in header)
- [ ] Realtime message updates (Convex subscription)
- [ ] Unread count badge in navigation
- [ ] "Is this still available?" quick-reply button
- [ ] "Mark as Sold to This Buyer" action for seller

### 2.5 User Profile Pages
- [ ] Public profile page (`/profile/[id]`)
- [ ] User's active listings grid
- [ ] Dashboard page (`/dashboard`)
- [ ] My Listings tab (active / sold / expired)
- [ ] My Messages tab (link to inbox)
- [ ] Edit Profile form (name, avatar, bio, area)
- [ ] Settings (notification preferences, delete account)

---

## Phase 3: Polish + PWA (Day 3)

### 3.1 Design Polish
- [ ] Entrance animations on feed cards (staggered fade-in)
- [ ] Page transition animations
- [ ] Hover states that surprise (scale, color shift, shadow)
- [ ] Micro-interactions on buttons (haptic-feel bounce)
- [ ] Loading skeletons that match layout
- [ ] Toast notifications (listing posted, message sent, etc.)
- [ ] Mobile bottom sheet for filters (not a dropdown)
- [ ] Swipe gestures where appropriate

### 3.2 PWA Setup
- [ ] `manifest.json` with brand colors and icons
- [ ] Service worker via next-pwa or Serwist
- [ ] Offline page with personality
- [ ] App icons (192px + 512px + maskable)
- [ ] iOS-specific meta tags (apple-mobile-web-app-capable, status-bar-style)
- [ ] Install prompt component
- [ ] Cache strategy: NetworkFirst for listings, CacheFirst for images

### 3.3 SEO
- [ ] Next.js Metadata API on all pages (title, description, OG)
- [ ] Dynamic OG images for listings (Next.js OG Image generation)
- [ ] JSON-LD: Product schema on listings, WebSite on home
- [ ] `robots.txt`
- [ ] Dynamic `sitemap.xml` (from Convex active listings)
- [ ] Canonical URLs
- [ ] Semantic HTML throughout

### 3.4 Mobile Optimization
- [ ] Touch targets minimum 44x44px
- [ ] No horizontal scroll issues
- [ ] Keyboard handling on forms (viewport resize)
- [ ] Image lazy loading
- [ ] Core Web Vitals audit (LCP < 2.5s, CLS < 0.1)

---

## Phase 4: Monetization + Analytics + Launch (Day 4)

### 4.1 Featured Listings (Stripe)
- [ ] Stripe account setup (test mode)
- [ ] "Boost This Listing" button on dashboard / listing detail
- [ ] Stripe Checkout redirect ($3/24hr or $5/48hr)
- [ ] Webhook endpoint (Convex HTTP action)
- [ ] Update listing `featured` + `featuredUntil` on payment success
- [ ] Scheduled function to expire boosts (Convex cron)
- [ ] Test end-to-end payment flow

### 4.2 Analytics (PostHog)
- [ ] Install posthog-js
- [ ] PostHog provider component
- [ ] Track key events: listing_viewed, listing_created, message_sent, share_clicked, i_want_this_clicked, signup_completed, listing_boosted
- [ ] Page view tracking
- [ ] User identification on sign-in

### 4.3 Error Monitoring (Sentry)
- [ ] Install @sentry/nextjs
- [ ] Configure DSN and environment
- [ ] Source map upload on deploy
- [ ] User context attachment
- [ ] Test error capture

### 4.4 Admin Panel
- [ ] Admin route protection (role check)
- [ ] Dashboard: total listings, users, revenue stats
- [ ] Reported listings queue
- [ ] Listing moderation (hide/remove/approve)
- [ ] User management (view, ban/suspend)

### 4.5 Deployment
- [ ] Vercel project creation (linked to GitHub)
- [ ] Convex production deployment
- [ ] Environment variables configured
- [ ] Auto-deploy on push to `main`
- [ ] Custom domain (when purchased)

### 4.6 Pre-Launch Checklist
- [ ] All critical flows tested (auth, listing, messaging, payment)
- [ ] Mobile testing on real devices (iOS Safari, Android Chrome)
- [ ] OG tags verified (Facebook Sharing Debugger, Twitter Card Validator)
- [ ] Lighthouse audit: Performance 90+, Accessibility 90+, SEO 90+
- [ ] Error monitoring confirmed working
- [ ] Analytics events firing correctly
- [ ] PWA installable on iOS + Android
- [ ] Content moderation policy documented

---

## Post-MVP Backlog

| Feature | Priority | Notes |
|---------|----------|-------|
| Premium seller subscriptions ($5/mo) | High | Recurring revenue |
| Push notifications | High | Re-engagement |
| Story reactions / upvotes | Medium | Engagement + virality |
| "Most Petty" leaderboard | Medium | Fun, shareable |
| Saved / favorited listings | Medium | User retention |
| Report system improvements | Medium | Safety |
| Multi-image OG cards | Low | Better social sharing |
| CHamoru language option | Low | Local appeal |
| "Breakup playlist" integration | Low | Fun feature, Spotify API |

---

## Timeline Summary

| Phase | Focus | Duration |
|-------|-------|----------|
| 1 | Foundation | Day 1 |
| 2 | Core Features | Day 2 |
| 3 | Polish + PWA | Day 3 |
| 4 | Monetization + Launch | Day 4 |

**Total:** ~4 days of focused development

---

*Ship it. Every sale is closure.*
