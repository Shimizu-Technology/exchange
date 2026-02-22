"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, MessageCircle, User, Search } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { AuthButtons } from "@/components/layout/auth-buttons";

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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-xl border-t border-charcoal/5 md:hidden">
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
                isSell && "relative -mt-3",
                isActive ? "text-coral" : "text-muted hover:text-charcoal"
              )}
            >
              {isSell ? (
                <div className="w-11 h-11 rounded-full bg-coral text-white flex items-center justify-center shadow-md shadow-coral/20 hover:shadow-coral/40 hover:scale-105 transition-all duration-200">
                  <PlusCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="relative">
                  <item.icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
                  {item.href === "/messages" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-coral text-white text-[10px] font-bold rounded-full flex items-center justify-center">
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

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-cream/90 backdrop-blur-xl border-b border-charcoal/5">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo size="md" />
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
                "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                pathname === item.href
                  ? "bg-ocean/8 text-ocean"
                  : "text-muted hover:text-charcoal"
              )}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/sell"
            className="ml-3 px-5 py-2 bg-coral text-white rounded-full text-sm font-semibold hover:bg-coral-dark transition-all duration-200"
          >
            List an item
          </Link>

          <Link
            href="/messages"
            className={cn(
              "relative ml-2 p-2 rounded-full transition-colors duration-200",
              pathname.startsWith("/messages")
                ? "bg-ocean/8 text-ocean"
                : "text-muted hover:text-charcoal"
            )}
          >
            <MessageCircle className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-coral text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          <AuthButtons />
        </nav>
      </div>
    </header>
  );
}
