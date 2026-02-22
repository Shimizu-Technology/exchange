"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { formatPrice, formatTimeAgo } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Clock, Tag, Share2, Heart, MessageCircle,
  ChevronLeft, ChevronRight, Zap, Flag, Pencil, Eye, User,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as Id<"listings">;

  const listing = useQuery(api.listings.get, { id: listingId });
  const currentUser = useQuery(api.users.getMe);
  const seller = useQuery(
    api.users.get,
    listing ? { id: listing.sellerId } : "skip"
  );
  const sellerListingCount = useQuery(
    api.users.getListingCount,
    listing ? { userId: listing.sellerId } : "skip"
  );

  const incrementView = useMutation(api.listings.incrementView);
  const getOrCreateConversation = useMutation(api.messages.getOrCreateConversation);
  const reportListing = useMutation(api.listings.report);

  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => {
    if (listing) {
      incrementView({ id: listingId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  const handleIWantThis = useCallback(async () => {
    if (!currentUser) {
      // Would trigger auth - for now just alert
      alert("Sign in to message the seller!");
      return;
    }
    try {
      const convId = await getOrCreateConversation({ listingId });
      router.push(`/messages/${convId}`);
    } catch (e: any) {
      alert(e.message);
    }
  }, [currentUser, getOrCreateConversation, listingId, router]);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: listing?.title ?? "ExChange",
        text: listing?.story ? `"${listing.story.slice(0, 100)}..."` : undefined,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  }, [listing]);

  if (listing === undefined) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-24 bg-charcoal/5 rounded-xl" />
          <div className="aspect-[4/3] bg-charcoal/5 rounded-2xl" />
          <div className="h-8 w-3/4 bg-charcoal/5 rounded-xl" />
          <div className="h-6 w-1/4 bg-charcoal/5 rounded-xl" />
          <div className="h-32 bg-charcoal/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold mb-2">
          This one got away.
        </h2>
        <p className="text-muted mb-6">
          This listing has moved on to better things. Just like you should.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-coral text-white rounded-xl font-semibold hover:bg-coral-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to browsing
        </Link>
      </div>
    );
  }

  const isOwner = currentUser && seller && currentUser._id === seller._id;
  const isSold = listing.status === "sold";
  const isFeatured = listing.featured && listing.featuredUntil && listing.featuredUntil > Date.now();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto px-4 md:px-6 py-4 md:py-8"
    >
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-muted hover:text-charcoal mb-4 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Photo carousel */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-charcoal/5 mb-6">
        {listing.photos.length > 0 ? (
          <>
            <img
              src={listing.photos[currentPhoto]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            {listing.photos.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentPhoto((p) => (p > 0 ? p - 1 : listing.photos.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPhoto((p) => (p < listing.photos.length - 1 ? p + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {listing.photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPhoto(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentPhoto ? "bg-white w-6" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-coral/10 to-sage/10 flex items-center justify-center">
            <Heart className="w-20 h-20 text-coral/20" />
          </div>
        )}

        {isSold && (
          <div className="absolute inset-0 bg-ocean/60 flex items-center justify-center">
            <span className="font-display text-3xl font-bold text-white -rotate-12">
              Gone. Just like they are.
            </span>
          </div>
        )}

        {isFeatured && !isSold && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-sage text-charcoal text-sm font-bold rounded-full flex items-center gap-1 shadow-lg">
            <Zap className="w-4 h-4" /> Boosted
          </div>
        )}
      </div>

      {/* Title & Price */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            {listing.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> {listing.category}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {listing.area}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {formatTimeAgo(listing.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {listing.viewCount} views
            </span>
          </div>
        </div>
        <span className="font-display text-2xl md:text-3xl font-bold text-coral whitespace-nowrap">
          {formatPrice(listing.price)}
        </span>
      </div>

      {/* Condition badge */}
      <div className="mb-6">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
          listing.condition === "New" ? "bg-sage/10 text-sage" :
          listing.condition === "Like New" ? "bg-sage/10 text-sage" :
          listing.condition === "Good" ? "bg-sage/20 text-charcoal" :
          listing.condition === "Fair" ? "bg-muted/10 text-muted" :
          "bg-coral/10 text-coral"
        }`}>
          {listing.condition}
        </span>
      </div>

      {/* THE STORY — this is the hero */}
      {listing.story && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="relative mb-8 p-6 bg-gradient-to-br from-coral/5 via-cream to-sage/5 rounded-2xl border border-coral/10"
        >
          <div className="absolute -top-3 left-6 px-3 py-1 bg-coral text-white text-xs font-bold rounded-full">
            The Story
          </div>
          <p className="text-charcoal leading-relaxed text-base md:text-lg mt-2 italic">
            &ldquo;{listing.story}&rdquo;
          </p>
        </motion.div>
      )}

      {/* Description */}
      {listing.description && (
        <div className="mb-8">
          <h3 className="font-display font-bold text-sm text-muted uppercase tracking-wider mb-2">
            Details
          </h3>
          <p className="text-charcoal leading-relaxed">{listing.description}</p>
        </div>
      )}

      {/* Seller card */}
      {seller && (
        <Link
          href={`/profile/${seller._id}`}
          className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-charcoal/5 hover:border-coral/20 transition-colors mb-8"
        >
          <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center">
            {seller.avatarUrl ? (
              <img src={seller.avatarUrl} alt="" className="w-12 h-12 rounded-full" />
            ) : (
              <User className="w-6 h-6 text-coral" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold truncate">{seller.name}</p>
            <p className="text-xs text-muted">
              {sellerListingCount ?? 0} listing{(sellerListingCount ?? 0) !== 1 ? "s" : ""} &middot; Member since {new Date(seller.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </p>
          </div>
        </Link>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3 mb-8">
        {isOwner ? (
          <Link
            href={`/listing/${listingId}/edit`}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-charcoal text-white rounded-2xl font-display font-bold hover:bg-ocean transition-colors"
          >
            <Pencil className="w-5 h-5" /> Edit Listing
          </Link>
        ) : (
          <button
            onClick={handleIWantThis}
            disabled={isSold}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-coral text-white rounded-2xl font-display font-bold text-lg shadow-lg shadow-coral/25 hover:bg-coral-dark hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5" /> I Want This
          </button>
        )}

        <button
          onClick={handleShare}
          className="p-3.5 bg-white rounded-2xl border border-charcoal/10 hover:border-coral/20 hover:text-coral transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </button>

        {!isOwner && (
          <button
            onClick={async () => {
              if (!currentUser) {
                alert("Sign in to report a listing");
                return;
              }
              const reason = prompt("Why are you reporting this listing?\n\n• Spam or scam\n• Inappropriate content\n• Prohibited item\n• Other");
              if (!reason) return;
              try {
                await reportListing({ id: listingId, reason });
                alert("Report submitted. Thank you!");
              } catch (e: any) {
                alert(e.message?.includes("already reported") ? "You already reported this listing" : "Failed to submit report");
              }
            }}
            className="p-3.5 bg-white rounded-2xl border border-charcoal/10 hover:border-red-300 hover:text-red-500 transition-colors"
          >
            <Flag className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
