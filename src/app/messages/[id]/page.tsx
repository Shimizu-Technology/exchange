"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { formatTimeAgo, formatPrice } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, User, Heart } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const convId = params.id as Id<"conversations">;

  const conversation = useQuery(api.messages.getConversation, { id: convId });
  const messages = useQuery(api.messages.listMessages, { conversationId: convId });
  const currentUser = useQuery(api.users.getMe);
  const sendMessage = useMutation(api.messages.sendMessage);
  const markRead = useMutation(api.messages.markRead);

  const listing = useQuery(
    api.listings.get,
    conversation ? { id: conversation.listingId } : "skip"
  );
  const otherUserId = conversation
    ? conversation.buyerId === currentUser?._id
      ? conversation.sellerId
      : conversation.buyerId
    : undefined;
  const otherUser = useQuery(
    api.users.get,
    otherUserId ? { id: otherUserId } : "skip"
  );

  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversation && currentUser) {
      markRead({ conversationId: convId });
    }
  }, [conversation, currentUser, messages?.length, convId, markRead]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages?.length]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const t = text.trim();
    setText("");
    await sendMessage({ conversationId: convId, text: t });
  };

  if (!conversation || !currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-near-black/5 rounded-xl" />
          <div className="h-[60vh] bg-near-black/5 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-near-black/5 bg-white/80 backdrop-blur-sm">
        <button onClick={() => router.push("/messages")} className="text-warm-gray hover:text-near-black transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-full bg-hot-pink/10 flex items-center justify-center flex-shrink-0">
          {otherUser?.avatarUrl ? (
            <img src={otherUser.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
          ) : (
            <User className="w-5 h-5 text-hot-pink" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{otherUser?.name ?? "..."}</p>
          {listing && (
            <Link href={`/listing/${listing._id}`} className="text-xs text-hot-pink truncate block hover:underline">
              {listing.title} &middot; {formatPrice(listing.price)}
            </Link>
          )}
        </div>
      </div>

      {/* Listing preview */}
      {listing && (
        <Link
          href={`/listing/${listing._id}`}
          className="flex items-center gap-3 px-4 py-2.5 bg-warm-white border-b border-near-black/5 hover:bg-white transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-hot-pink/10 to-electric-yellow/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {listing.photos[0] ? (
              <img src={listing.photos[0]} alt="" className="w-10 h-10 object-cover" />
            ) : (
              <Heart className="w-4 h-4 text-hot-pink/30" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{listing.title}</p>
            <p className="text-xs text-hot-pink font-bold">{formatPrice(listing.price)}</p>
          </div>
        </Link>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-warm-gray text-sm">Start the conversation!</p>
            <button
              onClick={() => { setText("Is this still available?"); }}
              className="mt-3 px-4 py-2 bg-white rounded-full border border-near-black/10 text-sm text-warm-gray hover:text-hot-pink hover:border-hot-pink/20 transition-colors"
            >
              &ldquo;Is this still available?&rdquo;
            </button>
          </div>
        )}

        {messages?.map((msg, i) => {
          const isMe = msg.senderId === currentUser._id;
          return (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                isMe
                  ? "bg-hot-pink text-white rounded-br-md"
                  : "bg-white border border-near-black/5 rounded-bl-md"
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${isMe ? "text-white/60" : "text-warm-gray"}`}>
                  {formatTimeAgo(msg.createdAt)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-near-black/5 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-warm-white rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-hot-pink/10"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="p-3 bg-hot-pink text-white rounded-2xl hover:bg-hot-pink-dark disabled:opacity-30 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
