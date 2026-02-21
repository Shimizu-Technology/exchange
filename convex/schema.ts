import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  users: defineTable({
    tokenIdentifier: v.optional(v.string()),
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    area: v.optional(v.string()),
    role: v.string(),
    isBanned: v.boolean(),
    isPremium: v.boolean(),
    premiumUntil: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_token", ["tokenIdentifier"]),

  listings: defineTable({
    sellerId: v.id("users"),
    title: v.string(),
    description: v.string(),
    story: v.optional(v.string()),
    price: v.number(),
    photos: v.array(v.string()),
    category: v.string(),
    area: v.string(),
    condition: v.string(),
    status: v.string(),
    featured: v.boolean(),
    featuredUntil: v.optional(v.number()),
    reportCount: v.number(),
    isHidden: v.boolean(),
    viewCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_seller", ["sellerId", "status"])
    .index("by_status_created", ["status", "createdAt"])
    .index("by_category_status", ["category", "status", "createdAt"])
    .index("by_area_status", ["area", "status", "createdAt"])
    .index("by_featured", ["featured", "status", "featuredUntil"])
    .searchIndex("search_title_desc", {
      searchField: "title",
      filterFields: ["status", "category", "area"],
    }),

  conversations: defineTable({
    listingId: v.id("listings"),
    buyerId: v.id("users"),
    sellerId: v.id("users"),
    lastMessageAt: v.number(),
    lastMessagePreview: v.optional(v.string()),
    buyerUnread: v.number(),
    sellerUnread: v.number(),
  })
    .index("by_buyer", ["buyerId", "lastMessageAt"])
    .index("by_seller", ["sellerId", "lastMessageAt"])
    .index("by_listing_buyer", ["listingId", "buyerId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    text: v.string(),
    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId", "createdAt"]),

  reports: defineTable({
    listingId: v.id("listings"),
    reporterId: v.id("users"),
    reason: v.string(),
    details: v.optional(v.string()),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_status", ["status", "createdAt"])
    .index("by_listing", ["listingId"]),
});
