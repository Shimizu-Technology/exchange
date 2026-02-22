"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Users, Package, ShoppingBag, Flag } from "lucide-react";

export default function AdminDashboard() {
  const stats = useQuery(api.admin.getStats);

  const cards = [
    { label: "Total Users", value: stats?.totalUsers ?? "—", icon: Users, color: "bg-sage/10 text-sage" },
    { label: "Total Listings", value: stats?.totalListings ?? "—", icon: Package, color: "bg-ocean/10 text-ocean" },
    { label: "Active Listings", value: stats?.activeListings ?? "—", icon: ShoppingBag, color: "bg-coral/10 text-coral" },
    { label: "Pending Reports", value: stats?.pendingReports ?? "—", icon: Flag, color: "bg-red-100 text-red-600" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-ocean mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-6 border border-charcoal/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted font-medium">{card.label}</span>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="font-display text-3xl text-charcoal">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
