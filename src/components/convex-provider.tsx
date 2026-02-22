"use client";

import { ClerkProvider, useAuth, useUser } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ConvexProvider as BaseConvexProvider, useMutation } from "convex/react";
import { ReactNode, useEffect, useRef } from "react";
import { api } from "../../convex/_generated/api";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = clerkKey && clerkKey.startsWith("pk_") && !clerkKey.includes("PLACEHOLDER");

// Automatically creates Convex user record when Clerk user signs in
function EnsureUser({ children }: { children: ReactNode }) {
  const { isSignedIn } = useUser();
  const getOrCreate = useMutation(api.users.getOrCreate);
  const hasRun = useRef(false);

  useEffect(() => {
    if (isSignedIn && !hasRun.current) {
      hasRun.current = true;
      getOrCreate().catch(console.error);
    }
  }, [isSignedIn, getOrCreate]);

  return <>{children}</>;
}

function ConvexWithClerk({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={clerkKey!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <EnsureUser>{children}</EnsureUser>
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
