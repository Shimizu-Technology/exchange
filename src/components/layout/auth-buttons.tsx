"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Dynamically check if Clerk is available
let ClerkComponents: {
  SignInButton: any;
  UserButton: any;
  useUser: any;
} | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const clerk = require("@clerk/nextjs");
  ClerkComponents = {
    SignInButton: clerk.SignInButton,
    UserButton: clerk.UserButton,
    useUser: clerk.useUser,
  };
} catch {
  // Clerk not available
}

function ClerkAuthButtons() {
  if (!ClerkComponents) return <FallbackAuthButton />;
  const { isSignedIn } = ClerkComponents.useUser();

  if (isSignedIn) {
    return (
      <div className="ml-2">
        <ClerkComponents.UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </div>
    );
  }

  return (
    <ClerkComponents.SignInButton mode="modal">
      <button className="ml-2 px-4 py-2 rounded-full text-sm font-medium text-muted hover:text-charcoal transition-colors duration-200">
        Sign in
      </button>
    </ClerkComponents.SignInButton>
  );
}

function FallbackAuthButton() {
  const pathname = usePathname();
  return (
    <Link
      href="/dashboard"
      className={cn(
        "ml-1 p-2 rounded-full transition-colors duration-200",
        pathname.startsWith("/dashboard")
          ? "bg-ocean/8 text-ocean"
          : "text-muted hover:text-charcoal"
      )}
    >
      <User className="w-5 h-5" />
    </Link>
  );
}

export function AuthButtons() {
  // Check if we have a valid Clerk key at runtime
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasValidClerkKey = clerkKey && clerkKey.startsWith("pk_") && !clerkKey.includes("PLACEHOLDER");

  if (hasValidClerkKey && ClerkComponents) {
    return <ClerkAuthButtons />;
  }

  return <FallbackAuthButton />;
}
