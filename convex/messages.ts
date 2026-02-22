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

async function getOptionalUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_token", (q: any) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .first();
}

export const getOrCreateConversation = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const listing = await ctx.db.get(args.listingId);
    if (!listing) throw new Error("Listing not found");
    if (listing.sellerId === user._id) throw new Error("Can't message yourself");

    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_listing_buyer", (q) =>
        q.eq("listingId", args.listingId).eq("buyerId", user._id)
      )
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("conversations", {
      listingId: args.listingId,
      buyerId: user._id,
      sellerId: listing.sellerId,
      lastMessageAt: Date.now(),
      buyerUnread: 0,
      sellerUnread: 0,
    });
  },
});

export const listConversations = query({
  args: {},
  handler: async (ctx) => {
    const user = await getOptionalUser(ctx);
    if (!user) return [];

    const asBuyer = await ctx.db
      .query("conversations")
      .withIndex("by_buyer", (q) => q.eq("buyerId", user._id))
      .order("desc")
      .collect();

    const asSeller = await ctx.db
      .query("conversations")
      .withIndex("by_seller", (q) => q.eq("sellerId", user._id))
      .order("desc")
      .collect();

    const all = [...asBuyer, ...asSeller].sort(
      (a, b) => b.lastMessageAt - a.lastMessageAt
    );

    const seen = new Set<string>();
    return all.filter((c) => {
      if (seen.has(c._id)) return false;
      seen.add(c._id);
      return true;
    });
  },
});

export const getConversation = query({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error("Conversation not found");

    if (
      conversation.buyerId !== user._id &&
      conversation.sellerId !== user._id
    ) {
      throw new Error("Not part of this conversation");
    }

    const now = Date.now();
    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: user._id,
      text: args.text,
      createdAt: now,
    });

    const preview =
      args.text.length > 80 ? args.text.substring(0, 80) + "..." : args.text;
    const isBuyer = conversation.buyerId === user._id;

    await ctx.db.patch(args.conversationId, {
      lastMessageAt: now,
      lastMessagePreview: preview,
      ...(isBuyer
        ? { sellerUnread: conversation.sellerUnread + 1 }
        : { buyerUnread: conversation.buyerUnread + 1 }),
    });
  },
});

export const markRead = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return;

    const isBuyer = conversation.buyerId === user._id;
    await ctx.db.patch(args.conversationId, {
      ...(isBuyer ? { buyerUnread: 0 } : { sellerUnread: 0 }),
    });
  },
});

export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const user = await getOptionalUser(ctx);
    if (!user) return 0;

    const asBuyer = await ctx.db
      .query("conversations")
      .withIndex("by_buyer", (q) => q.eq("buyerId", user._id))
      .collect();

    const asSeller = await ctx.db
      .query("conversations")
      .withIndex("by_seller", (q) => q.eq("sellerId", user._id))
      .collect();

    let total = 0;
    for (const c of asBuyer) total += c.buyerUnread;
    for (const c of asSeller) total += c.sellerUnread;
    return total;
  },
});
