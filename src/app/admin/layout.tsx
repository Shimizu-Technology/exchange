"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Logo } from "@/components/brand/logo";
import { LayoutDashboard, Users, Package, Flag, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/listings", icon: Package, label: "Listings" },
  { href: "/admin/reports", icon: Flag, label: "Reports" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useQuery(api.users.getMe);

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-pulse text-muted">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="w-16 h-16 text-coral mx-auto mb-4" />
          <h1 className="font-display text-2xl text-ocean mb-2">Access Denied</h1>
          <p className="text-muted mb-6">You don&apos;t have permission to access this area.</p>
          <Link href="/" className="px-6 py-2 bg-coral text-white rounded-full text-sm font-semibold hover:bg-coral/90 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-64 bg-ocean text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="font-display text-lg">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {adminNav.map((item) => {
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-ocean text-white px-4 h-14 flex items-center justify-between">
        <span className="font-display text-lg">Admin</span>
        <div className="flex gap-2">
          {adminNav.map((item) => {
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isActive ? "bg-white/15" : "text-white/60 hover:text-white"
                )}
              >
                <item.icon className="w-4 h-4" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 md:p-8 p-4 pt-18 md:pt-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
