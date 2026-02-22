"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function ClerkAuthButtons() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="ml-2 w-8 h-8 rounded-full bg-sand animate-pulse" />
    );
  }

  if (isSignedIn) {
    return (
      <div className="ml-2">
        <UserButton
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
    <SignInButton mode="modal">
      <button className="ml-2 px-4 py-2 rounded-full text-sm font-medium text-muted hover:text-charcoal transition-colors duration-200">
        Sign in
      </button>
    </SignInButton>
  );
}
