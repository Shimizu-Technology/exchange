# ExChange Soft Launch Runbook (ADM-10)

Last updated: 2026-03-06
Owner: Leon / Shimizu Technology

## Launch Objective
Soft launch to a small Guam pilot cohort, validate reliability + moderation + conversion flow before broad rollout.

---

## 1) Go/No-Go Criteria

Launch only if all are true:
- [ ] UAT checklist completed (no P0 blockers)
- [ ] Listing create/edit/deactivate flows are stable
- [ ] Moderation queue actions verified (resolve/hide/remove)
- [ ] Policy pages are live and linked
- [ ] Production env vars verified (Clerk, Convex, Stripe, analytics)

If any P0 blocker exists -> **No-Go** and patch first.

---

## 2) Pilot Cohort

Suggested pilot size: 20–50 users
- 8–15 sellers
- 12–35 buyers/browsers

Include:
- trusted early users
- at least 2 users with heavy listing volume
- at least 1 moderator/admin available during launch window

---

## 3) Launch-Day Sequence

1. Confirm latest `main` deployed to production
2. Run smoke checks:
   - `/`, `/search`, `/sell`, listing detail, `/terms`, `/privacy`, `/prohibited-items`
   - `/sign-in` and `/sign-up` routes load and are functional
3. Post launch message to pilot cohort with clear feedback channel
4. Monitor first 2 hours closely:
   - listing creation failures
   - upload failures
   - report queue activity
   - payment issues

---

## 4) Monitoring Focus

Priority watchlist:
- failed uploads
- failed listing publish
- auth/session errors
- moderation action failures
- payment checkout errors

Operational thresholds (initial):
- >5% listing publish failure in 1 hour -> investigate immediately
- repeated moderation action failures -> pause new invites until resolved
- payment checkout failures affecting multiple users -> temporarily disable paid boosts and announce fallback

---

## 5) Rollback / Mitigation Plan

### Fast mitigations (preferred)
- Disable paid-boost CTA temporarily if Stripe instability appears
- Restrict new signups if abuse spikes
- Increase moderation cadence if report volume spikes

### Full rollback (if critical)
- Revert to last known stable production deployment
- Post short incident notice in pilot channel
- Resume after hotfix verification

---

## 6) Feedback Capture Template

Per issue capture:
- Timestamp
- User role (buyer/seller/admin)
- Platform/device
- Steps to reproduce
- Expected vs actual
- Severity (P0/P1/P2)

Store consolidated notes in launch log.

---

## 7) Decision at End of Pilot Window

After first 24–72 hours:
- [ ] Review metrics + issue volume
- [ ] Classify defects (P0/P1/P2)
- [ ] Decide:
  - continue pilot
  - expand cohort
  - pause for hardening

---

## 8) Contact Matrix

- Product/Owner: Leon
- Engineering: Theo (implementation)
- Moderation/Admin on-call: (assign before launch)
- Payment escalation: Stripe dashboard + logs

---

## 9) Post-Launch Next Tasks

- Address pilot P1 defects
- tighten analytics dashboards
- prepare public launch messaging
- finalize roadmap for ADM-9 follow-through
