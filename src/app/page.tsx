"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CATEGORIES } from "@/lib/utils";
import { formatPrice, formatTimeAgo } from "@/lib/utils";
import { motion, type Variants } from "framer-motion";
import { Search, MapPin, HeartCrack, Zap, Heart } from "lucide-react";
import Link from "next/link";

const TAGLINES = [
  "He bought it. You profit.",
  "Breakup? Make it bank-up.",
  "From ex to extra cash.",
  "Moving on, making money.",
  "Eff that. Buy it.",
  "Your ex's trash, your treasure.",
] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 4500);

    return () => window.clearInterval(id);
  }, []);

  const listings = useQuery(api.listings.list, {
    category: selectedCategory === "All" ? undefined : selectedCategory,
    search: searchQuery || undefined,
  });

  const featured = listings?.slice(0, 2) || [];
  const rest = listings?.slice(2) || [];

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8">
      {/* Masthead — editorial, left-aligned */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pt-16 md:pt-24 pb-8"
      >
        <div className="flex items-end justify-between gap-8">
          <div>
            <p className="text-coral text-[11px] font-body font-bold tracking-[0.3em] uppercase mb-4">Issue #001 — Guam</p>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[0.95] italic">
              <span className="text-ocean">Shoutout</span>
              <br />
              <span className="text-ocean">to my </span>
              <span className="text-coral not-italic">Ex.</span>
            </h1>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-muted text-sm max-w-[220px] leading-relaxed">
              The marketplace where breakups become business. Every listing tells a story.
            </p>
            <p className="mt-2 text-coral text-xs font-semibold">{TAGLINES[taglineIndex]}</p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-coral via-sage/50 to-transparent mt-8" />
      </motion.div>

      {/* Search + Category bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex items-center gap-4 mb-10 overflow-x-auto hide-scrollbar"
      >
        <div className="relative flex-shrink-0 w-44">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted/50" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-sand rounded-lg border border-muted/15 text-ocean placeholder:text-muted/35 focus:outline-none focus:border-coral/50 text-xs"
          />
        </div>
        <div className="h-4 w-px bg-muted/15 flex-shrink-0" />
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`text-[11px] font-body font-medium whitespace-nowrap transition-all duration-200 pb-1 border-b-2 ${
              selectedCategory === category
                ? "text-coral border-coral"
                : "text-muted/60 border-transparent hover:text-ocean hover:border-ocean/20"
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Featured — two large hero cards */}
      {featured.length >= 2 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3"
        >
          {featured.map((listing) => (
            <motion.div key={listing._id} variants={fadeUp}>
              <Link href={`/listing/${listing._id}`} className="group block relative overflow-hidden aspect-[4/3] rounded-sm">
                {listing.photos.length > 0 ? (
                  <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out" />
                ) : (
                  <div className="w-full h-full bg-sand flex items-center justify-center"><Heart className="w-12 h-12 text-coral/10" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="text-[10px] text-white/40 font-body tracking-[0.2em] uppercase mb-2 block">{listing.category}</span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight italic mb-2">{listing.title}</h2>
                  {listing.story && <p className="text-white/50 text-sm line-clamp-2 italic mb-3">&ldquo;{listing.story}&rdquo;</p>}
                  <div className="flex items-center justify-between">
                    <span className="text-white/30 text-[11px] flex items-center gap-1"><MapPin className="w-3 h-3" />{listing.area} &middot; {formatTimeAgo(listing.createdAt)}</span>
                    <span className="font-display font-bold text-coral text-xl">{formatPrice(listing.price)}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Rest — 3-column grid, smaller */}
      {listings === undefined ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse bg-sand rounded-sm" />
          ))}
        </div>
      ) : rest.length === 0 && featured.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
          <HeartCrack className="w-12 h-12 text-coral/15 mx-auto mb-4" />
          <p className="text-muted text-sm italic">No listings yet. Your ex's trash, your treasure — be the first listing.</p>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } } }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
        >
          {rest.map((listing) => {
            const isFree = listing.price === 0;
            return (
              <motion.div key={listing._id} variants={fadeUp}>
                <Link href={`/listing/${listing._id}`} className="group block overflow-hidden rounded-sm">
                  <div className="relative aspect-square overflow-hidden">
                    {listing.photos.length > 0 ? (
                      <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out brightness-90 group-hover:brightness-100" />
                    ) : (
                      <div className="w-full h-full bg-sand flex items-center justify-center"><Heart className="w-8 h-8 text-coral/10" /></div>
                    )}
                  </div>
                  <div className="py-3 flex items-baseline justify-between gap-2">
                    <h3 className="font-body font-medium text-ocean text-xs truncate">{listing.title}</h3>
                    <span className={`font-display font-bold text-xs whitespace-nowrap ${isFree ? "text-sage" : "text-coral"}`}>
                      {isFree ? "Free" : formatPrice(listing.price)}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
      <div className="h-12" />
    </div>
  );
}
