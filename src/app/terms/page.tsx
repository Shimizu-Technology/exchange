import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
      <h1 className="font-display text-3xl text-ocean">Terms of Use</h1>
      <p className="text-sm text-muted">Last updated: 2026-03-06</p>

      <section className="space-y-2">
        <h2 className="font-semibold text-charcoal">1. Marketplace role</h2>
        <p className="text-charcoal/80">
          ExChange is a peer-to-peer marketplace. We provide listing and discovery tools, but we are not a party to transactions between buyers and sellers.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-charcoal">2. Ownership and authenticity</h2>
        <p className="text-charcoal/80">
          Sellers are solely responsible for ensuring they have the legal right to sell listed items and that listings are accurate and not misleading.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-charcoal">3. Disputes</h2>
        <p className="text-charcoal/80">
          Buyers and sellers are responsible for resolving disputes directly. ExChange may remove listings or restrict accounts that violate platform rules.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-charcoal">4. Safety and conduct</h2>
        <p className="text-charcoal/80">
          Harassment, fraud, impersonation, and prohibited items are not allowed. Accounts or listings may be suspended or removed at our discretion.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-charcoal">5. Payments and transaction terms</h2>
        <p className="text-charcoal/80">
          Payment processing for paid listing features is handled by Stripe. ExChange does not store full card details.
        </p>
        <p className="text-charcoal/80">
          Platform fees, if applicable, are shown at checkout before purchase confirmation. Unless required by law, completed paid boosts/listing fees are non-refundable.
        </p>
        <p className="text-charcoal/80">
          If a payment fails or is disputed/charged back, related paid promotion may be removed or reversed while the dispute is resolved.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-charcoal">6. Governing law</h2>
        <p className="text-charcoal/80">
          These Terms are governed by the laws of Guam, U.S.A. Any disputes arising from use of the platform are subject to the exclusive jurisdiction of the courts of Guam.
        </p>
      </section>
    </div>
  );
}
