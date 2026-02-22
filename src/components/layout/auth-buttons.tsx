"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Lazy-load ClerkAuthButtons only on client to avoid SSG issues
const ClerkAuthButtons = dynamic(() => import("./clerk-auth-buttons"), {
  ssr: false,
  loading: () => <FallbackAuthButton />,
});

function FallbackAuthButton() {
  const pathname = usePathname();
  return (
    <Link
      href="/dashboard"
      className={cn(
        "ml-1 p-2 rounded-full transition-colors duration-200",
        pathname?.startsWith("/dashboard")
          ? "bg-ocean/8 text-ocean"
          : "text-muted hover:text-charcoal"
      )}
    >
      <User className="w-5 h-5" />
    </Link>
  );
}

export function AuthButtons() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasValidClerkKey = clerkKey && clerkKey.startsWith("pk_") && !clerkKey.includes("PLACEHOLDER");

  if (!mounted || !hasValidClerkKey) {
    return <FallbackAuthButton />;
  }

  return <ClerkAuthButtons />;
}
