# ExChange UAT Checklist (ADM-10)

Last updated: 2026-03-06
Owner: Leon / Shimizu Technology

## Test Accounts
- Seller account (standard user)
- Buyer account (standard user)
- Admin account (moderation access)

---

## A) Public Marketplace Flows

- [ ] Home page loads and branding copy appears correctly
- [ ] Search page loads with listings and filters
- [ ] Listing detail page renders for active listing
- [ ] Hidden listing is not visible in public browse/search
- [ ] Removed listing is not visible in public browse/search

---

## B) Seller Listing Creation Flow

- [ ] `/sell` step navigation works (required fields enforced)
- [ ] Description min length enforced in-step
- [ ] Paid listing price validation prevents near-zero invalid values
- [ ] Image upload accepts valid images and stores URLs
- [ ] Upload failure shows inline error and preserves form state
- [ ] Listing publish succeeds and appears publicly

---

## C) Seller Dashboard / Ownership Controls

- [ ] Seller can view own listings in dashboard
- [ ] Seller can edit own listing
- [ ] Seller can deactivate own listing
- [ ] Seller cannot edit another user's listing (permission guard)

---

## D) Messaging / Contact Intent

- [ ] Buyer can initiate contact from listing
- [ ] Contact click intent path works on mobile + desktop
- [ ] Message thread opens and unread indicators update

---

## E) Moderation / Admin

- [ ] Admin reports page loads pending + resolved queues
- [ ] Report cards show reporter + listing context
- [ ] Resolve action works and marks report resolved
- [ ] Hide action sets listing hidden and removes it from public list
- [ ] Remove action sets listing removed and removes it from public list
- [ ] Action buttons lock while in-flight (no duplicate submits)

---

## F) Legal + Policy

- [ ] `/terms` page accessible and content complete
- [ ] `/privacy` page accessible and content complete
- [ ] `/prohibited-items` page accessible and content complete
- [ ] Footer links to policy pages work
- [ ] Sell flow disclaimer appears on final step and links correctly

---

## G) Analytics + Error Visibility (Quick Sanity)

- [ ] Core pages render without runtime errors
- [ ] Listing creation and moderation actions produce expected logs/events
- [ ] No blocking console errors on critical user flows

---

## H) Mobile Pass

### iOS Safari
- [ ] Home/search/listing pages usable
- [ ] Sell flow usable with image upload
- [ ] Contact action usable

### Android Chrome
- [ ] Home/search/listing pages usable
- [ ] Sell flow usable with image upload
- [ ] Contact action usable

---

## UAT Sign-off
- Date:
- Tested by:
- Result: PASS / PASS WITH NOTES / FAIL
- Notes:
