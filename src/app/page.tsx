"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ListingCard, ListingCardSkeleton } from "@/components/listings/listing-card";
import { CATEGORIES, AREAS } from "@/lib/utils";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, HeartCrack, X } from "lucide-react";

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
    <div className="max-w-5xl mx-auto px-4 md:px-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="pt-10 md:pt-16 pb-8 text-center"
      >
        <p className="text-sm font-medium text-coral tracking-widest uppercase mb-4">
          Guam&apos;s breakup marketplace
        </p>
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-4 text-ocean">
          Let go of the stuff.
          <br />
          Keep the story.
        </h1>
        <p className="text-muted text-lg max-w-md mx-auto leading-relaxed">
          Your ex&apos;s things deserve a new home. Every listing comes with the breakup tale that made it available.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-6 max-w-xl mx-auto"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 bg-white rounded-full border border-charcoal/10 text-charcoal placeholder:text-muted/50 focus:outline-none focus:border-coral/40 focus:ring-2 focus:ring-coral/10 transition-all duration-200 font-body text-sm"
          />
          <button
            onClick={() => setShowAreaFilter(!showAreaFilter)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors duration-200 ${showAreaFilter ? "bg-coral/10 text-coral" : "text-muted hover:text-charcoal hover:bg-charcoal/5"}`}
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
          className="mb-4 max-w-xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-muted" />
            <span className="text-sm font-medium text-muted">Filter by village</span>
            {selectedArea && (
              <button
                onClick={() => setSelectedArea("")}
                className="ml-auto text-xs text-coral flex items-center gap-1"
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
                    ? "bg-sage text-white"
                    : "bg-white text-muted border border-charcoal/10 hover:border-sage/40 hover:text-sage"
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
        transition={{ duration: 0.4, delay: 0.25 }}
        className="mb-8 -mx-4 px-4 flex justify-center"
      >
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-ocean text-white"
                  : "bg-white text-muted border border-charcoal/8 hover:border-ocean/30 hover:text-ocean"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Listings grid */}
      {listings === undefined ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
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
          <HeartCrack className="w-14 h-14 text-coral/30 mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold mb-2 text-ocean">
            Nothing here yet.
          </h3>
          <p className="text-muted">
            Guam must be in love. Check back when hearts break.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {listings.map((listing, i) => (
            <ListingCard key={listing._id} listing={listing} index={i} />
          ))}
        </div>
      )}

      <div className="h-8" />
    </div>
  );
}
