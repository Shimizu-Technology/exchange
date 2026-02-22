"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ConvexProvider as BaseConvexProvider } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = clerkKey && clerkKey.startsWith("pk_") && !clerkKey.includes("PLACEHOLDER");

function ConvexWithClerk({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={clerkKey!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

function ConvexWithoutClerk({ children }: { children: ReactNode }) {
  return (
    <BaseConvexProvider client={convex}>
      {children}
    </BaseConvexProvider>
  );
}

export function ConvexProvider({ children }: { children: ReactNode }) {
  if (hasValidClerkKey) {
    return <ConvexWithClerk>{children}</ConvexWithClerk>;
  }
  return <ConvexWithoutClerk>{children}</ConvexWithoutClerk>;
}
