import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prohibited Items",
};

const PROHIBITED = [
  "Stolen or illegally obtained items",
  "Weapons, explosives, or dangerous materials",
  "Illegal drugs or drug paraphernalia",
  "Counterfeit goods",
  "Explicit adult content",
  "Personal data, IDs, or financial accounts",
  "Anything that violates Guam or U.S. law",
];

export default function ProhibitedItemsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
      <h1 className="font-display text-3xl text-ocean">Prohibited Items</h1>
      <p className="text-charcoal/80">
        Listings that include prohibited content will be removed and may lead to account suspension.
      </p>

      <ul className="list-disc pl-6 space-y-2 text-charcoal/80">
        {PROHIBITED.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
