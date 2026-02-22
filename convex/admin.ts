import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Helper to verify admin role
async function requireAdmin(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q: any) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .first();
  if (!user) throw new Error("User not found");
  if (user.role !== "admin") throw new Error("Not authorized");
  return user;
}

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const users = await ctx.db.query("users").collect();
    const listings = await ctx.db.query("listings").collect();
    const reports = await ctx.db
      .query("reports")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    const activeListings = listings.filter((l) => l.status === "active");

    return {
      totalUsers: users.length,
      totalListings: listings.length,
      activeListings: activeListings.length,
      pendingReports: reports.length,
    };
  },
});

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("users").order("desc").collect();
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    role: v.optional(v.string()),
    isBanned: v.optional(v.boolean()),
    isPremium: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const updates: Record<string, unknown> = {};
    if (args.role !== undefined) updates.role = args.role;
    if (args.isBanned !== undefined) updates.isBanned = args.isBanned;
    if (args.isPremium !== undefined) updates.isPremium = args.isPremium;

    await ctx.db.patch(args.userId, updates);
  },
});

export const listAllListings = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("listings").order("desc").collect();
  },
});

export const hideListing = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const listing = await ctx.db.get(args.listingId);
    if (!listing) throw new Error("Listing not found");
    await ctx.db.patch(args.listingId, { isHidden: !listing.isHidden });
  },
});

export const removeListing = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.listingId, { status: "removed", updatedAt: Date.now() });
  },
});

export const listReports = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("reports").order("desc").collect();
  },
});

export const resolveReport = mutation({
  args: { reportId: v.id("reports") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.reportId, { status: "resolved" });
  },
});
