"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ListingCard, ListingCardSkeleton } from "@/components/listings/listing-card";
import { motion } from "framer-motion";
import { Search, HeartCrack } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const listings = useQuery(api.listings.list, {
    search: query || undefined,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display text-2xl font-bold mb-4">Search</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
          <input
            type="text"
            placeholder="What are you looking for?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-near-black/10 text-near-black placeholder:text-warm-gray/60 focus:outline-none focus:border-hot-pink/40 focus:ring-2 focus:ring-hot-pink/10 transition-all duration-200 font-body text-base"
          />
        </div>
      </motion.div>

      {listings === undefined ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      ) : listings.length === 0 && query ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <HeartCrack className="w-12 h-12 text-hot-pink/20 mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold mb-1">No results for &ldquo;{query}&rdquo;</h3>
          <p className="text-warm-gray text-sm">Try a different search or browse all listings</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {listings?.map((listing, i) => (
            <ListingCard key={listing._id} listing={listing} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
