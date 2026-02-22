"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Eye, EyeOff, Trash2, Flag } from "lucide-react";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function AdminListingsPage() {
  const listingsData = useQuery(api.admin.listAllListings);
  const listings = listingsData ?? [];
  const hideListing = useMutation(api.admin.hideListing);
  const removeListing = useMutation(api.admin.removeListing);
  const [statusFilter, setStatusFilter] = useState("all");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filtered: any[] = !listingsData ? [] : listingsData.filter((l: any) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "hidden") return l.isHidden;
    return l.status === statusFilter;
  });

  const statusColors: Record<string, string> = {
    active: "bg-sage/10 text-sage",
    sold: "bg-ocean/10 text-ocean",
    removed: "bg-red-100 text-red-600",
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ocean mb-6">Listings</h1>

      <div className="flex gap-2 mb-6">
        {["all", "active", "sold", "removed", "hidden"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === s ? "bg-ocean text-white" : "bg-white border border-charcoal/10 text-muted hover:text-charcoal"}`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-charcoal/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal/5 bg-cream/50">
                <th className="text-left px-4 py-3 font-medium text-muted">Title</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Price</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Reports</th>
                <th className="text-left px-4 py-3 font-medium text-muted">Views</th>
                <th className="text-right px-4 py-3 font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((listing) => (
                <tr key={listing._id} className="border-b border-charcoal/5 last:border-0 hover:bg-cream/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-charcoal truncate max-w-[200px]">{listing.title}</span>
                      {listing.isHidden && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Hidden</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">${(listing.price / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[listing.status] ?? "bg-charcoal/5 text-muted"}`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {listing.reportCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-red-600">
                        <Flag className="w-3 h-3" /> {listing.reportCount}
                      </span>
                    ) : (
                      <span className="text-muted">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">{listing.viewCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => hideListing({ listingId: listing._id })}
                        className="p-1.5 rounded-lg border border-charcoal/10 text-muted hover:text-charcoal transition-colors"
                        title={listing.isHidden ? "Unhide" : "Hide"}
                      >
                        {listing.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      {listing.status !== "removed" && (
                        <button
                          onClick={() => removeListing({ listingId: listing._id })}
                          className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted">No listings found.</div>
        )}
      </div>
    </div>
  );
}
