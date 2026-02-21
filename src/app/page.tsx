"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ListingCard, ListingCardSkeleton } from "@/components/listings/listing-card";
import { CATEGORIES, AREAS } from "@/lib/utils";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, Sparkles, HeartCrack, X } from "lucide-react";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAreaFilter, setShowAreaFilter] = useState(false);

  const listings = useQuery(api.listings.list, {
    category: selectedCategory === "All" ? undefined : selectedCategory,
    area: selectedArea || undefined,
    search: searchQuery || undefined,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pt-6 md:pt-10 pb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-hot-pink" />
          <span className="text-sm font-medium text-hot-pink">Guam&apos;s breakup marketplace</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-3">
          Every item has a story.
          <br />
          <span className="text-hot-pink">Every sale is closure.</span>
        </h1>
        <p className="text-warm-gray text-lg max-w-lg">
          Sell the stuff, keep the lessons. Your ex&apos;s loss is someone else&apos;s treasure.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mb-4"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
          <input
            type="text"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 bg-white rounded-2xl border border-near-black/10 text-near-black placeholder:text-warm-gray/60 focus:outline-none focus:border-hot-pink/40 focus:ring-2 focus:ring-hot-pink/10 transition-all duration-200 font-body text-sm"
          />
          <button
            onClick={() => setShowAreaFilter(!showAreaFilter)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-colors duration-200 ${showAreaFilter ? "bg-hot-pink/10 text-hot-pink" : "text-warm-gray hover:text-near-black hover:bg-near-black/5"}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Area filter */}
      {showAreaFilter && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-warm-gray" />
            <span className="text-sm font-medium text-warm-gray">Filter by village</span>
            {selectedArea && (
              <button
                onClick={() => setSelectedArea("")}
                className="ml-auto text-xs text-hot-pink flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {AREAS.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(selectedArea === area ? "" : area)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  selectedArea === area
                    ? "bg-teal text-white shadow-md shadow-teal/20"
                    : "bg-white text-warm-gray border border-near-black/10 hover:border-teal/30 hover:text-teal"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Category pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-6 -mx-4 px-4"
      >
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-hot-pink text-white shadow-md shadow-hot-pink/20"
                  : "bg-white text-warm-gray border border-near-black/10 hover:border-hot-pink/30 hover:text-hot-pink"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Listings grid */}
      {listings === undefined ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <HeartCrack className="w-16 h-16 text-hot-pink/30 mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold mb-2">
            Nothing here yet.
          </h3>
          <p className="text-warm-gray">
            Guam must be in love. Check back when hearts break.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {listings.map((listing, i) => (
            <ListingCard key={listing._id} listing={listing} index={i} />
          ))}
        </div>
      )}

      <div className="h-8" />
    </div>
  );
}
