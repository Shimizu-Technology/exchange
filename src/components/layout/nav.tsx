"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, MessageCircle, User, Search, Sparkles } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/sell", icon: PlusCircle, label: "Sell" },
  { href: "/messages", icon: MessageCircle, label: "Messages" },
  { href: "/dashboard", icon: User, label: "Me" },
];

export function BottomNav() {
  const pathname = usePathname();
  const unreadCount = useQuery(api.messages.getUnreadCount) ?? 0;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-near-black/5 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const isSell = item.href === "/sell";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200",
                isSell && "relative -mt-4",
                isActive ? "text-hot-pink" : "text-warm-gray hover:text-near-black"
              )}
            >
              {isSell ? (
                <div className="w-12 h-12 rounded-2xl bg-hot-pink text-white flex items-center justify-center shadow-lg shadow-hot-pink/30 hover:shadow-hot-pink/50 hover:scale-105 transition-all duration-200">
                  <PlusCircle className="w-6 h-6" />
                </div>
              ) : (
                <div className="relative">
                  <item.icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
                  {item.href === "/messages" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-hot-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
              )}
              {!isSell && (
                <span className="text-[10px] font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function TopNav() {
  const pathname = usePathname();
  const unreadCount = useQuery(api.messages.getUnreadCount) ?? 0;
  const user = useQuery(api.users.getMe);

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-near-black/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-hot-pink rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            Ex<span className="text-hot-pink">Change</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {[
            { href: "/", label: "Browse" },
            { href: "/search", label: "Search" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200",
                pathname === item.href
                  ? "bg-hot-pink/10 text-hot-pink"
                  : "text-warm-gray hover:text-near-black hover:bg-near-black/5"
              )}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/sell"
            className="ml-2 px-5 py-2 bg-hot-pink text-white rounded-xl text-sm font-semibold hover:bg-hot-pink-dark shadow-md shadow-hot-pink/20 hover:shadow-hot-pink/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Sell Something
          </Link>

          <Link
            href="/messages"
            className={cn(
              "relative ml-2 p-2 rounded-xl transition-colors duration-200",
              pathname.startsWith("/messages")
                ? "bg-hot-pink/10 text-hot-pink"
                : "text-warm-gray hover:text-near-black hover:bg-near-black/5"
            )}
          >
            <MessageCircle className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-hot-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          <Link
            href="/dashboard"
            className={cn(
              "ml-1 p-2 rounded-xl transition-colors duration-200",
              pathname.startsWith("/dashboard")
                ? "bg-hot-pink/10 text-hot-pink"
                : "text-warm-gray hover:text-near-black hover:bg-near-black/5"
            )}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-6 h-6 rounded-full" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
