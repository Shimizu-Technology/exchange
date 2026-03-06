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
    </div>
  );
}
