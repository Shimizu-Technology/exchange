"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { CATEGORIES, AREAS, CONDITIONS, formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowLeft, Save, Trash2, CheckCircle2, Package,
  MapPin, Tag, DollarSign, FileText, Heart, Zap,
} from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/components/analytics/posthog-provider";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as Id<"listings">;

  const listing = useQuery(api.listings.get, { id: listingId });
  const currentUser = useQuery(api.users.getMe);
  const updateListing = useMutation(api.listings.update);
  const markSold = useMutation(api.listings.markSold);
  const removeListing = useMutation(api.listings.remove);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [condition, setCondition] = useState("");
  const [story, setStory] = useState("");
  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Pre-populate form when listing loads
  useEffect(() => {
    if (listing && !initialized) {
      setTitle(listing.title);
      setDescription(listing.description || "");
      setCategory(listing.category);
      setArea(listing.area);
      setCondition(listing.condition);
      setStory(listing.story || "");
      setPrice(listing.price === 0 ? "" : (listing.price / 100).toString());
      setIsFree(listing.price === 0);
      setInitialized(true);
    }
  }, [listing, initialized]);

  const isOwner = currentUser && listing && currentUser._id === listing.sellerId;
  const isSold = listing?.status === "sold";

  const handleSave = useCallback(async () => {
    if (!isOwner) return;
    setSaving(true);
    try {
      await updateListing({
        id: listingId,
        title: title.trim(),
        description: description.trim(),
        story: story.trim() || undefined,
        price: isFree ? 0 : Math.round(Number(price) * 100),
        category,
        area,
        condition,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      alert(e.message || "Failed to save");
    }
    setSaving(false);
  }, [isOwner, updateListing, listingId, title, description, story, isFree, price, category, area, condition]);

  const handleMarkSold = useCallback(async () => {
    if (!confirm("Mark this listing as sold? It will be removed from the feed.")) return;
    try {
      await markSold({ id: listingId });
      router.push("/dashboard");
    } catch (e: any) {
      alert(e.message || "Failed to mark as sold");
    }
  }, [markSold, listingId, router]);

  const handleDelete = useCallback(async () => {
    if (!confirm("Delete this listing permanently? This cannot be undone.")) return;
    try {
      await removeListing({ id: listingId });
      router.push("/dashboard");
    } catch (e: any) {
      alert(e.message || "Failed to delete");
    }
  }, [removeListing, listingId, router]);

  // Loading state
  if (listing === undefined || currentUser === undefined) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-charcoal/5 rounded-lg w-1/3" />
          <div className="h-12 bg-charcoal/5 rounded-xl" />
          <div className="h-32 bg-charcoal/5 rounded-xl" />
          <div className="h-12 bg-charcoal/5 rounded-xl" />
        </div>
      </div>
    );
  }

  // Not found
  if (listing === null) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-muted">Listing not found</p>
        <Link href="/" className="text-coral hover:underline mt-2 inline-block">Go home</Link>
      </div>
    );
  }

  // Not owner
  if (!isOwner) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-muted">You can only edit your own listings</p>
        <Link href={`/listing/${listingId}`} className="text-coral hover:underline mt-2 inline-block">
          View listing
        </Link>
      </div>
    );
  }

  const categories = CATEGORIES.filter((c) => c !== "All");

  return (
    <div className="max-w-xl mx-auto px-4 py-6 md:py-10 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href={`/listing/${listingId}`} className="flex items-center gap-2 text-muted hover:text-charcoal transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to listing</span>
        </Link>
        {isSold && (
          <span className="px-3 py-1 bg-sage/10 text-sage rounded-full text-xs font-bold uppercase tracking-wider">
            Sold
          </span>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="font-display text-2xl text-ocean">Edit Listing</h1>

        {/* Title */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
            <Package className="w-4 h-4 text-coral" /> Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-xl border border-charcoal/10 focus:border-coral/40 focus:ring-2 focus:ring-coral/10 outline-none transition-all font-display"
            placeholder="What are you selling?"
          />
        </div>

        {/* Category */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
            <Tag className="w-4 h-4 text-coral" /> Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? "bg-coral text-white shadow-sm"
                    : "bg-charcoal/5 text-muted hover:bg-charcoal/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
            <MapPin className="w-4 h-4 text-coral" /> Location
          </label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-xl border border-charcoal/10 focus:border-coral/40 focus:ring-2 focus:ring-coral/10 outline-none transition-all"
          >
            <option value="">Select area</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="text-sm font-medium text-charcoal mb-2 block">Condition</label>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <button
                key={c}
                onClick={() => setCondition(c)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  condition === c
                    ? "bg-ocean text-white shadow-sm"
                    : "bg-charcoal/5 text-muted hover:bg-charcoal/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
            <FileText className="w-4 h-4 text-coral" /> Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white rounded-xl border border-charcoal/10 focus:border-coral/40 focus:ring-2 focus:ring-coral/10 outline-none transition-all resize-none"
            placeholder="What's included? Any details buyers should know?"
          />
        </div>

        {/* Story */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
            <Heart className="w-4 h-4 text-coral" /> The Story
          </label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-white rounded-xl border border-charcoal/10 focus:border-coral/40 focus:ring-2 focus:ring-coral/10 outline-none transition-all resize-none"
            placeholder="The breakup story behind this item..."
          />
        </div>

        {/* Price */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
            <DollarSign className="w-4 h-4 text-coral" /> Price
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
              <input
                type="number"
                value={price}
                onChange={(e) => { setPrice(e.target.value); setIsFree(false); }}
                disabled={isFree}
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 bg-white rounded-xl border border-charcoal/10 focus:border-coral/40 focus:ring-2 focus:ring-coral/10 outline-none transition-all disabled:opacity-40"
                placeholder="0.00"
              />
            </div>
            <button
              onClick={() => { setIsFree(!isFree); if (!isFree) setPrice(""); }}
              className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                isFree
                  ? "bg-sage text-white shadow-sm"
                  : "bg-charcoal/5 text-muted hover:bg-charcoal/10"
              }`}
            >
              Free
            </button>
          </div>
        </div>

        {/* Boost Listing */}
        {!isSold && !listing.featured && (
          <div className="bg-coral/5 rounded-2xl p-6 border border-coral/10">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-coral" />
              <h3 className="font-display font-bold text-charcoal">Boost Your Listing</h3>
            </div>
            <p className="text-sm text-muted mb-4">
              Get more eyes on your listing. Boost puts it at the top of the feed with a featured badge.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={async () => {
                  trackEvent("boost_initiated", { listingId, boostType: "24hr", price: 3 });
                  const res = await fetch("/api/stripe/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ listingId, listingTitle: title, boostType: "24hr", userId: currentUser?._id }),
                  });
                  const { url } = await res.json();
                  if (url) window.location.href = url;
                }}
                className="px-4 py-3 bg-white rounded-xl border border-coral/20 text-center hover:border-coral/40 transition-colors"
              >
                <span className="block font-display font-bold text-coral text-lg">$3</span>
                <span className="text-xs text-muted">24 Hours</span>
              </button>
              <button
                onClick={async () => {
                  trackEvent("boost_initiated", { listingId, boostType: "48hr", price: 5 });
                  const res = await fetch("/api/stripe/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ listingId, listingTitle: title, boostType: "48hr", userId: currentUser?._id }),
                  });
                  const { url } = await res.json();
                  if (url) window.location.href = url;
                }}
                className="px-4 py-3 bg-coral text-white rounded-xl text-center hover:bg-coral-dark transition-colors"
              >
                <span className="block font-display font-bold text-lg">$5</span>
                <span className="text-xs opacity-80">48 Hours</span>
              </button>
            </div>
          </div>
        )}

        {listing.featured && (
          <div className="bg-sage/10 rounded-2xl p-6 border border-sage/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-sage fill-sage" />
              <h3 className="font-display font-bold text-charcoal">Currently Boosted</h3>
            </div>
            <p className="text-sm text-muted">
              Your listing is featured until {listing.featuredUntil ? new Date(listing.featuredUntil).toLocaleString() : "soon"}.
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3 pt-4">
          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving || !title.trim() || !category || !area || !condition || (!isFree && (!price || Number(price) <= 0))}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-coral text-white rounded-2xl font-display font-bold text-lg shadow-lg shadow-coral/25 hover:bg-coral-dark hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {saved ? (
              <><CheckCircle2 className="w-5 h-5" /> Saved!</>
            ) : saving ? (
              "Saving..."
            ) : (
              <><Save className="w-5 h-5" /> Save Changes</>
            )}
          </button>

          {/* Mark as sold */}
          {!isSold && (
            <button
              onClick={handleMarkSold}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-sage text-white rounded-2xl font-display font-bold hover:bg-sage/90 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5" /> Mark as Sold
            </button>
          )}

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-red-500 bg-red-50 rounded-2xl font-medium hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete Listing
          </button>
        </div>
      </motion.div>
    </div>
  );
}
