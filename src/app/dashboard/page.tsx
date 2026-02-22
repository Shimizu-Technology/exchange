"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { ListingCard, ListingCardSkeleton } from "@/components/listings/listing-card";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  User, MapPin, Settings, LogOut, Package, MessageCircle,
  ShoppingBag, CheckCircle2, Pencil, Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const currentUser = useQuery(api.users.getMe);
  const { signIn, signOut } = useAuthActions();

  if (currentUser === undefined) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-charcoal/5 rounded-2xl" />
          <div className="h-64 bg-charcoal/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <SignInView signIn={signIn} />;
  }

  return <DashboardContent user={currentUser} signOut={signOut} />;
}

function SignInView({ signIn }: { signIn: any }) {
  const [signingIn, setSigningIn] = useState(false);

  const handleAnonymousSignIn = async () => {
    setSigningIn(true);
    try {
      await signIn("anonymous");
    } catch {
      setSigningIn(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-20 h-20 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-coral" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">Join ExChange</h1>
        <p className="text-muted mb-8">
          Turn your ex&apos;s stuff into someone else&apos;s treasure.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleAnonymousSignIn}
            disabled={signingIn}
            className="w-full px-6 py-3.5 bg-coral text-white rounded-2xl font-display font-bold shadow-lg shadow-coral/25 hover:bg-coral-dark hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50"
          >
            {signingIn ? "Signing in..." : "Continue as Guest"}
          </button>
          <p className="text-xs text-muted">
            Google sign-in coming soon. For now, try it as a guest!
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function DashboardContent({ user, signOut }: { user: any; signOut: any }) {
  const [tab, setTab] = useState<"active" | "sold">("active");
  const activeListings = useQuery(api.listings.getBySeller, {
    sellerId: user._id,
    status: "active",
  });
  const soldListings = useQuery(api.listings.getBySeller, {
    sellerId: user._id,
    status: "sold",
  });
  const updateUser = useMutation(api.users.update);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? "");
  const [area, setArea] = useState(user.area ?? "");

  const handleSaveProfile = async () => {
    await updateUser({
      name: name.trim() || user.name,
      bio: bio.trim() || undefined,
      area: area || undefined,
    });
    setEditing(false);
  };

  const listings = tab === "active" ? activeListings : soldListings;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-charcoal/5 p-6 mb-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-coral/10 flex items-center justify-center">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-16 h-16 rounded-full" />
              ) : (
                <User className="w-8 h-8 text-coral" />
              )}
            </div>
            {!editing ? (
              <div>
                <h2 className="font-display text-xl font-bold">{user.name}</h2>
                {user.bio && <p className="text-muted text-sm">{user.bio}</p>}
                {user.area && (
                  <p className="text-xs text-muted flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {user.area}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex-1 space-y-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-cream rounded-xl border border-charcoal/10 text-sm focus:outline-none focus:border-coral/40"
                  placeholder="Your name"
                />
                <input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 bg-cream rounded-xl border border-charcoal/10 text-sm focus:outline-none focus:border-coral/40"
                  placeholder="Bio (optional, be sassy)"
                />
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2 bg-cream rounded-xl border border-charcoal/10 text-sm focus:outline-none focus:border-coral/40"
                >
                  <option value="">Select village</option>
                  {["Dededo", "Yigo", "Tamuning", "Tumon", "Hagatna", "Mangilao", "Barrigada", "Sinajana"].map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="px-3 py-1.5 text-sm text-muted hover:text-charcoal transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveProfile} className="px-4 py-1.5 bg-coral text-white text-sm font-medium rounded-xl hover:bg-coral-dark transition-colors">
                  Save
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="p-2 text-muted hover:text-charcoal hover:bg-charcoal/5 rounded-xl transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-charcoal/5">
          <Link href="/messages" className="flex items-center gap-1.5 text-sm text-muted hover:text-coral transition-colors">
            <MessageCircle className="w-4 h-4" /> Messages
          </Link>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-red-500 transition-colors ml-auto"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-charcoal/5 rounded-xl p-1 mb-6">
        <button
          onClick={() => setTab("active")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === "active" ? "bg-white text-charcoal shadow-sm" : "text-muted"
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Active ({activeListings?.length ?? 0})
        </button>
        <button
          onClick={() => setTab("sold")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === "sold" ? "bg-white text-charcoal shadow-sm" : "text-muted"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> Sold ({soldListings?.length ?? 0})
        </button>
      </div>

      {/* Listings */}
      {listings === undefined ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <ListingCardSkeleton key={i} />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-coral/20 mx-auto mb-3" />
          <h3 className="font-display font-bold mb-1">
            {tab === "active" ? "No active listings" : "Nothing sold yet"}
          </h3>
          <p className="text-muted text-sm mb-4">
            {tab === "active" ? "Time to let go of some baggage?" : "Your stuff is still looking for new homes"}
          </p>
          {tab === "active" && (
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-coral text-white rounded-xl font-medium hover:bg-coral-dark transition-colors"
            >
              <Sparkles className="w-4 h-4" /> Post a Listing
            </Link>
          )}
        </div>
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
