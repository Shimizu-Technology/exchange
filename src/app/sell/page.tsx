"use client";

import { useState, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, AREAS, CONDITIONS, formatPrice } from "@/lib/utils";
import {
  Camera, ArrowLeft, ArrowRight, Check, X, ImagePlus,
  MapPin, Tag, Sparkles, DollarSign, Eye, Heart,
} from "lucide-react";

const STEPS = ["Photos", "Details", "Story", "Price", "Preview"];

const storyPrompts = [
  "What's the story behind this item?",
  "The pettier, the better.",
  "Did they forget it? Did you throw it out the window?",
  "We're all ears. Let it out.",
];

export default function SellPage() {
  const router = useRouter();
  const currentUser = useQuery(api.users.getMe);
  const createListing = useMutation(api.listings.create);

  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [condition, setCondition] = useState("");
  const [story, setStory] = useState("");
  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canProceed = () => {
    switch (step) {
      case 0: return true; // Photos optional for now
      case 1: return title.trim() && category && area && condition;
      case 2: return true; // Story optional
      case 3: return isFree || (price && Number(price) > 0);
      case 4: return true;
      default: return false;
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!currentUser) {
      alert("Please sign in to post a listing!");
      return;
    }
    setSubmitting(true);
    try {
      const listingId = await createListing({
        title: title.trim(),
        description: description.trim(),
        story: story.trim() || undefined,
        price: isFree ? 0 : Math.round(Number(price) * 100),
        photos,
        category,
        area,
        condition,
      });
      router.push(`/listing/${listingId}`);
    } catch (e: any) {
      alert(e.message || "Something went wrong");
      setSubmitting(false);
    }
  }, [currentUser, createListing, title, description, story, isFree, price, photos, category, area, condition, router]);

  return (
    <div className="max-w-xl mx-auto px-4 py-6 md:py-10">
      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                i === step ? "text-hot-pink" : i < step ? "text-teal cursor-pointer" : "text-warm-gray/40"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                i === step ? "bg-hot-pink text-white scale-110" :
                i < step ? "bg-teal text-white" :
                "bg-near-black/5 text-warm-gray/40"
              }`}>
                {i < step ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                i < step ? "bg-teal" : "bg-near-black/5"
              }`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {/* Step 0: Photos */}
          {step === 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-1">Add some photos</h2>
              <p className="text-warm-gray text-sm mb-6">Show off what you&apos;re selling. Up to 5 photos.</p>

              <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-near-black/5">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                      className="absolute top-2 right-2 w-6 h-6 bg-near-black/60 text-white rounded-full flex items-center justify-center hover:bg-near-black/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <button className="aspect-square rounded-xl border-2 border-dashed border-near-black/10 hover:border-hot-pink/30 flex flex-col items-center justify-center gap-1.5 transition-colors group">
                    <ImagePlus className="w-8 h-8 text-warm-gray/40 group-hover:text-hot-pink/60 transition-colors" />
                    <span className="text-xs text-warm-gray/40 group-hover:text-hot-pink/60 transition-colors">Add photo</span>
                  </button>
                )}
              </div>

              <p className="text-warm-gray/60 text-xs mt-4 text-center">
                Photo upload coming soon — listings will work without photos for now
              </p>
            </div>
          )}

          {/* Step 1: Details */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-1">Item details</h2>
              <p className="text-warm-gray text-sm mb-6">What are you getting rid of?</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., PS5 + 12 Games Bundle"
                    className="w-full px-4 py-3 bg-white rounded-xl border border-near-black/10 focus:border-hot-pink/40 focus:ring-2 focus:ring-hot-pink/10 focus:outline-none transition-all text-sm"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Details about the item — condition, what's included, etc."
                    rows={3}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-near-black/10 focus:border-hot-pink/40 focus:ring-2 focus:ring-hot-pink/10 focus:outline-none transition-all text-sm resize-none"
                    maxLength={1000}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          category === cat
                            ? "bg-hot-pink text-white shadow-sm"
                            : "bg-white text-warm-gray border border-near-black/10 hover:border-hot-pink/30"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Village
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-near-black/10 focus:border-hot-pink/40 focus:ring-2 focus:ring-hot-pink/10 focus:outline-none transition-all text-sm appearance-none"
                  >
                    <option value="">Select your village</option>
                    {AREAS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Condition</label>
                  <div className="flex flex-wrap gap-2">
                    {CONDITIONS.map((cond) => (
                      <button
                        key={cond}
                        onClick={() => setCondition(cond)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          condition === cond
                            ? "bg-teal text-white shadow-sm"
                            : "bg-white text-warm-gray border border-near-black/10 hover:border-teal/30"
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Story */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-hot-pink" />
                <h2 className="font-display text-2xl font-bold">The Story</h2>
              </div>
              <p className="text-warm-gray text-sm mb-6">
                This is what makes ExChange special. {storyPrompts[Math.floor(Math.random() * storyPrompts.length)]}
              </p>

              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="He said he needed 'space to figure things out.' Guess what doesn't need space anymore? His gaming setup..."
                rows={8}
                className="w-full px-4 py-3 bg-white rounded-xl border border-near-black/10 focus:border-hot-pink/40 focus:ring-2 focus:ring-hot-pink/10 focus:outline-none transition-all text-sm resize-none leading-relaxed"
                maxLength={2000}
              />
              <div className="flex items-center justify-between mt-2 text-xs text-warm-gray">
                <span>Optional, but highly encouraged</span>
                <span className={story.length > 1800 ? "text-hot-pink" : ""}>{story.length}/2000</span>
              </div>
            </div>
          )}

          {/* Step 3: Price */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-1">Set your price</h2>
              <p className="text-warm-gray text-sm mb-6">How much is this closure worth?</p>

              <div className="space-y-4">
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => { setPrice(e.target.value); setIsFree(false); }}
                    placeholder="0.00"
                    disabled={isFree}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-near-black/10 focus:border-hot-pink/40 focus:ring-2 focus:ring-hot-pink/10 focus:outline-none transition-all text-2xl font-display font-bold disabled:opacity-30"
                    min="0"
                    step="1"
                  />
                </div>

                <button
                  onClick={() => { setIsFree(!isFree); if (!isFree) setPrice(""); }}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                    isFree
                      ? "border-teal bg-teal/5"
                      : "border-near-black/10 hover:border-teal/30"
                  }`}
                >
                  <span className={`font-display font-bold ${isFree ? "text-teal" : "text-near-black"}`}>
                    Free — just take it
                  </span>
                  <p className="text-xs text-warm-gray mt-0.5">Sometimes the best revenge is giving it away</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {step === 4 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-1">Preview</h2>
              <p className="text-warm-gray text-sm mb-6">Here&apos;s how your listing will look</p>

              <div className="bg-white rounded-2xl border border-near-black/5 overflow-hidden">
                <div className="aspect-[4/3] bg-gradient-to-br from-hot-pink/10 to-electric-yellow/10 flex items-center justify-center">
                  {photos.length > 0 ? (
                    <img src={photos[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Heart className="w-16 h-16 text-hot-pink/20" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display font-bold text-lg">{title || "Your listing title"}</h3>
                    <span className="font-display font-bold text-hot-pink text-lg">
                      {isFree ? "Free" : price ? `$${price}` : "$0"}
                    </span>
                  </div>
                  {story && (
                    <p className="text-warm-gray text-sm italic leading-relaxed mb-3">
                      &ldquo;{story.slice(0, 120)}{story.length > 120 ? "..." : ""}&rdquo;
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-warm-gray">
                    {area && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {area}</span>}
                    {category && <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {category}</span>}
                    {condition && <span>{condition}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center gap-3 mt-8">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-5 py-3 rounded-xl border border-near-black/10 text-warm-gray font-medium hover:text-near-black hover:border-near-black/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-near-black text-white rounded-xl font-display font-bold hover:bg-deep-charcoal disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || !canProceed()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-hot-pink text-white rounded-xl font-display font-bold text-lg shadow-lg shadow-hot-pink/25 hover:bg-hot-pink-dark hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {submitting ? (
              <span className="animate-pulse">Publishing...</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Publish Listing
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
