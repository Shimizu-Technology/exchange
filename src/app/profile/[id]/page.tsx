"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ListingCard, ListingCardSkeleton } from "@/components/listings/listing-card";
import { motion } from "framer-motion";
import { User, MapPin, Calendar, Package } from "lucide-react";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as Id<"users">;
  const user = useQuery(api.users.get, { id: userId });
  const listings = useQuery(api.listings.getBySeller, { sellerId: userId, status: "active" });

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-charcoal/5" />
            <div className="space-y-2">
              <div className="h-6 w-40 bg-charcoal/5 rounded" />
              <div className="h-4 w-24 bg-charcoal/5 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-20 h-20 rounded-full bg-coral/10 flex items-center justify-center">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="w-20 h-20 rounded-full" />
          ) : (
            <User className="w-10 h-10 text-coral" />
          )}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">{user.name}</h1>
          {user.bio && <p className="text-muted text-sm mt-1">{user.bio}</p>}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted">
            {user.area && (
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {user.area}</span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" /> {listings?.length ?? 0} listings
            </span>
          </div>
        </div>
      </motion.div>

      <h2 className="font-display text-lg font-bold mb-4">Listings</h2>
      {listings === undefined ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <ListingCardSkeleton key={i} />)}
        </div>
      ) : listings.length === 0 ? (
        <p className="text-muted text-sm py-8 text-center">No listings yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {listings.map((listing, i) => (
            <ListingCard key={listing._id} listing={listing} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
