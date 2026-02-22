"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatTimeAgo } from "@/lib/utils";
import { motion } from "framer-motion";
import { MessageCircle, User } from "lucide-react";
import Link from "next/link";

export default function MessagesPage() {
  const conversations = useQuery(api.messages.listConversations);
  const currentUser = useQuery(api.users.getMe);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <MessageCircle className="w-16 h-16 text-coral/20 mx-auto mb-4" />
        <h2 className="font-display text-xl font-bold mb-2">Sign in to see your messages</h2>
        <p className="text-muted text-sm">Start a conversation by tapping &ldquo;I Want This&rdquo; on any listing.</p>
      </div>
    );
  }

  if (conversations === undefined) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6">
        <h1 className="font-display text-2xl font-bold mb-6">Messages</h1>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-charcoal/5" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-charcoal/5 rounded" />
              <div className="h-3 w-2/3 bg-charcoal/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="font-display text-2xl font-bold mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle className="w-16 h-16 text-coral/20 mx-auto mb-4" />
          <h3 className="font-display text-lg font-bold mb-2">No messages yet</h3>
          <p className="text-muted text-sm">
            Start a conversation by tapping &ldquo;I Want This&rdquo; on any listing.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {conversations.map((conv, i) => (
            <ConversationItem key={conv._id} conversation={conv} currentUserId={currentUser._id} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function ConversationItem({ conversation, currentUserId, index }: {
  conversation: any;
  currentUserId: string;
  index: number;
}) {
  const isBuyer = conversation.buyerId === currentUserId;
  const otherUserId = isBuyer ? conversation.sellerId : conversation.buyerId;
  const otherUser = useQuery(api.users.get, { id: otherUserId });
  const listing = useQuery(api.listings.get, { id: conversation.listingId });
  const unread = isBuyer ? conversation.buyerUnread : conversation.sellerUnread;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        href={`/messages/${conversation._id}`}
        className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white transition-colors group"
      >
        <div className="relative w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center flex-shrink-0">
          {otherUser?.avatarUrl ? (
            <img src={otherUser.avatarUrl} alt="" className="w-12 h-12 rounded-full" />
          ) : (
            <User className="w-6 h-6 text-coral" />
          )}
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-coral text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={`font-medium text-sm truncate ${unread > 0 ? "font-bold" : ""}`}>
              {otherUser?.name ?? "Loading..."}
            </p>
            <span className="text-xs text-muted ml-2 whitespace-nowrap">
              {formatTimeAgo(conversation.lastMessageAt)}
            </span>
          </div>
          {listing && (
            <p className="text-xs text-coral truncate">{listing.title}</p>
          )}
          {conversation.lastMessagePreview && (
            <p className={`text-sm truncate ${unread > 0 ? "text-charcoal" : "text-muted"}`}>
              {conversation.lastMessagePreview}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
