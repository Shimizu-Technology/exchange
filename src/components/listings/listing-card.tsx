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
  "from-coral/15 to-sand-dark/30",
  "from-sage/15 to-sand-dark/30",
  "from-ocean/10 to-sage/15",
  "from-coral/10 to-sage/15",
  "from-sage/15 to-coral/10",
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
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/listing/${listing._id}`}
        className="group block bg-white rounded-xl overflow-hidden border border-charcoal/5 hover:border-coral/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          {listing.photos.length > 0 ? (
            <img
              src={listing.photos[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
              <Heart className="w-10 h-10 text-coral/20" />
            </div>
          )}

          {isSold && (
            <div className="absolute inset-0 bg-ocean/50 flex items-center justify-center">
              <span className="font-display text-xl font-bold text-white -rotate-6">
                Gone forever
              </span>
            </div>
          )}

          {isFeatured && !isSold && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-coral text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Featured
            </div>
          )}

          {isFree && !isSold && (
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-sage text-white text-xs font-semibold rounded-full">
              Free
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-body font-semibold text-sm leading-tight line-clamp-1 group-hover:text-coral transition-colors duration-200">
              {listing.title}
            </h3>
            <span className="font-body font-bold text-ocean text-sm whitespace-nowrap">
              {formatPrice(listing.price)}
            </span>
          </div>

          {listing.story && (
            <p className="text-muted text-xs leading-relaxed line-clamp-2 mb-2.5 italic">
              &ldquo;{listing.story}&rdquo;
            </p>
          )}

          <div className="flex items-center gap-3 text-muted text-xs">
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
    <div className="bg-white rounded-xl overflow-hidden border border-charcoal/5">
      <div className="aspect-square bg-charcoal/5 animate-pulse" />
      <div className="p-4 space-y-2.5">
        <div className="flex justify-between">
          <div className="h-4 w-2/3 bg-charcoal/5 rounded-lg animate-pulse" />
          <div className="h-4 w-14 bg-charcoal/5 rounded-lg animate-pulse" />
        </div>
        <div className="h-3.5 w-full bg-charcoal/5 rounded-lg animate-pulse" />
        <div className="h-3.5 w-3/4 bg-charcoal/5 rounded-lg animate-pulse" />
        <div className="flex gap-3">
          <div className="h-3 w-20 bg-charcoal/5 rounded-lg animate-pulse" />
          <div className="h-3 w-16 bg-charcoal/5 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
