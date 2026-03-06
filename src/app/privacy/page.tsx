export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
      <h1 className="font-display text-3xl text-ocean">Privacy Policy</h1>
      <p className="text-sm text-muted">Last updated: 2026-03-06</p>

      <section className="space-y-2">
        <h2 className="font-semibold text-charcoal">What we collect</h2>
        <p className="text-charcoal/80">We collect account profile details, listing content, report submissions, and basic usage analytics needed to operate the marketplace.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-charcoal">How we use data</h2>
        <p className="text-charcoal/80">Data is used to power listings, moderation, anti-abuse checks, communication features, and service improvement.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-charcoal">Sharing</h2>
        <p className="text-charcoal/80">We do not sell personal data. We may share limited data with service providers required to run the app (hosting, analytics, authentication, storage).</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-charcoal">Your controls</h2>
        <p className="text-charcoal/80">You can edit or remove your listings, and you can request account removal by contacting support.</p>
      </section>
    </div>
  );
}
