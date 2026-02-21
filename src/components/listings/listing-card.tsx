"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, Zap, Heart } from "lucide-react";
import { formatPrice, formatTimeAgo } from "@/lib/utils";
import { Doc } from "../../../convex/_generated/dataModel";

interface ListingCardProps {
  listing: Doc<"listings">;
  index?: number;
}

const placeholderColors = [
  "from-hot-pink/20 to-electric-yellow/20",
  "from-teal/20 to-electric-yellow/20",
  "from-hot-pink/20 to-teal/20",
  "from-electric-yellow/20 to-hot-pink/20",
  "from-teal/20 to-hot-pink/20",
];

export function ListingCard({ listing, index = 0 }: ListingCardProps) {
  const isFeatured = listing.featured && listing.featuredUntil && listing.featuredUntil > Date.now();
  const isFree = listing.price === 0;
  const isSold = listing.status === "sold";
  const colorClass = placeholderColors[index % placeholderColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/listing/${listing._id}`}
        className="group block bg-white rounded-2xl overflow-hidden border border-near-black/5 hover:border-hot-pink/20 hover:shadow-xl hover:shadow-hot-pink/5 hover:-translate-y-1 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {listing.photos.length > 0 ? (
            <img
              src={listing.photos[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
              <Heart className="w-12 h-12 text-hot-pink/30" />
            </div>
          )}

          {isSold && (
            <div className="absolute inset-0 bg-deep-charcoal/60 flex items-center justify-center">
              <span className="font-display text-2xl font-bold text-white -rotate-12">
                Gone. Just like they are.
              </span>
            </div>
          )}

          {isFeatured && !isSold && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-electric-yellow text-near-black text-xs font-bold rounded-full flex items-center gap-1 shadow-md">
              <Zap className="w-3 h-3" />
              Boosted
            </div>
          )}

          {isFree && !isSold && (
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-teal text-white text-xs font-bold rounded-full shadow-md">
              Free
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-display font-bold text-base leading-tight line-clamp-1 group-hover:text-hot-pink transition-colors duration-200">
              {listing.title}
            </h3>
            <span className="font-display font-bold text-hot-pink text-base whitespace-nowrap">
              {formatPrice(listing.price)}
            </span>
          </div>

          {listing.story && (
            <p className="text-warm-gray text-sm leading-relaxed line-clamp-2 mb-3">
              &ldquo;{listing.story}&rdquo;
            </p>
          )}

          <div className="flex items-center gap-3 text-warm-gray text-xs">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {listing.area}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(listing.createdAt)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-near-black/5">
      <div className="aspect-[4/3] bg-near-black/5 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-2/3 bg-near-black/5 rounded-lg animate-pulse" />
          <div className="h-5 w-16 bg-near-black/5 rounded-lg animate-pulse" />
        </div>
        <div className="h-4 w-full bg-near-black/5 rounded-lg animate-pulse" />
        <div className="h-4 w-3/4 bg-near-black/5 rounded-lg animate-pulse" />
        <div className="flex gap-3">
          <div className="h-3 w-20 bg-near-black/5 rounded-lg animate-pulse" />
          <div className="h-3 w-16 bg-near-black/5 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
