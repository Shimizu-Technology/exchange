import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Helper to get current user from Clerk identity
async function getCurrentUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q: any) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .first();
  if (!user) throw new Error("User not found");
  return user;
}

export const list = query({
  args: {
    category: v.optional(v.string()),
    area: v.optional(v.string()),
    search: v.optional(v.string()),
    sortBy: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    if (args.search && args.search.trim().length > 0) {
      const searchQuery = ctx.db
        .query("listings")
        .withSearchIndex("search_title_desc", (q) => {
          let sq = q.search("title", args.search!);
          sq = sq.eq("status", "active");
          if (args.category) sq = sq.eq("category", args.category);
          if (args.area) sq = sq.eq("area", args.area);
          return sq;
        });
      return await searchQuery.take(limit);
    }

    let results;
    if (args.category) {
      results = await ctx.db
        .query("listings")
        .withIndex("by_category_status", (q) =>
          q.eq("category", args.category!).eq("status", "active")
        )
        .order("desc")
        .take(limit);
    } else if (args.area) {
      results = await ctx.db
        .query("listings")
        .withIndex("by_area_status", (q) =>
          q.eq("area", args.area!).eq("status", "active")
        )
        .order("desc")
        .take(limit);
    } else {
      results = await ctx.db
        .query("listings")
        .withIndex("by_status_created", (q) => q.eq("status", "active"))
        .order("desc")
        .take(limit);
    }

    const now = Date.now();
    return results.sort((a, b) => {
      const aFeatured = a.featured && a.featuredUntil && a.featuredUntil > now;
      const bFeatured = b.featured && b.featuredUntil && b.featuredUntil > now;
      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;
      if (args.sortBy === "price_asc") return a.price - b.price;
      if (args.sortBy === "price_desc") return b.price - a.price;
      return b.createdAt - a.createdAt;
    });
  },
});

export const get = query({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySeller = query({
  args: { sellerId: v.id("users"), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("listings")
        .withIndex("by_seller", (q) =>
          q.eq("sellerId", args.sellerId).eq("status", args.status!)
        )
        .order("desc")
        .collect();
    }
    const active = await ctx.db
      .query("listings")
      .withIndex("by_seller", (q) =>
        q.eq("sellerId", args.sellerId).eq("status", "active")
      )
      .order("desc")
      .collect();
    const sold = await ctx.db
      .query("listings")
      .withIndex("by_seller", (q) =>
        q.eq("sellerId", args.sellerId).eq("status", "sold")
      )
      .order("desc")
      .collect();
    return [...active, ...sold];
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    story: v.optional(v.string()),
    price: v.number(),
    photos: v.array(v.string()),
    category: v.string(),
    area: v.string(),
    condition: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.isBanned) throw new Error("User is banned");

    if (!user.isPremium) {
      const activeListings = await ctx.db
        .query("listings")
        .withIndex("by_seller", (q) =>
          q.eq("sellerId", user._id).eq("status", "active")
        )
        .collect();
      if (activeListings.length >= 3) {
        throw new Error("Free tier limit: 3 active listings max");
      }
    }

    const now = Date.now();
    return await ctx.db.insert("listings", {
      sellerId: user._id,
      title: args.title,
      description: args.description,
      story: args.story,
      price: args.price,
      photos: args.photos,
      category: args.category,
      area: args.area,
      condition: args.condition,
      status: "active",
      featured: false,
      reportCount: 0,
      isHidden: false,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("listings"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    story: v.optional(v.string()),
    price: v.optional(v.number()),
    photos: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    area: v.optional(v.string()),
    condition: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const listing = await ctx.db.get(args.id);
    if (!listing) throw new Error("Listing not found");
    if (user._id !== listing.sellerId) throw new Error("Not authorized");

    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.story !== undefined) updates.story = args.story;
    if (args.price !== undefined) updates.price = args.price;
    if (args.photos !== undefined) updates.photos = args.photos;
    if (args.category !== undefined) updates.category = args.category;
    if (args.area !== undefined) updates.area = args.area;
    if (args.condition !== undefined) updates.condition = args.condition;

    await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const listing = await ctx.db.get(args.id);
    if (!listing) throw new Error("Listing not found");
    if (user._id !== listing.sellerId && user.role !== "admin") {
      throw new Error("Not authorized");
    }
    await ctx.db.patch(args.id, { status: "removed", updatedAt: Date.now() });
  },
});

export const markSold = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const listing = await ctx.db.get(args.id);
    if (!listing) throw new Error("Listing not found");
    if (user._id !== listing.sellerId) throw new Error("Not authorized");
    await ctx.db.patch(args.id, { status: "sold", updatedAt: Date.now() });
  },
});

export const incrementView = mutation({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.id);
    if (!listing) return;
    await ctx.db.patch(args.id, { viewCount: listing.viewCount + 1 });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

export const getImageUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId as any);
  },
});

export const report = mutation({
  args: {
    id: v.id("listings"),
    reason: v.string(),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!user) throw new Error("User not found");

    // Check if user already reported this listing
    const existing = await ctx.db
      .query("reports")
      .withIndex("by_listing", (q) => q.eq("listingId", args.id))
      .collect();
    if (existing.some((r) => r.reporterId === user._id)) {
      throw new Error("You already reported this listing");
    }

    await ctx.db.insert("reports", {
      listingId: args.id,
      reporterId: user._id,
      reason: args.reason,
      details: args.details,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});
