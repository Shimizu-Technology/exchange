"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-lg rounded-2xl border border-charcoal/5",
            headerTitle: "font-display text-ocean",
            headerSubtitle: "text-muted",
            formButtonPrimary: "bg-coral hover:bg-coral/90",
            footerActionLink: "text-coral hover:text-coral/80",
          },
        }}
      />
    </div>
  );
}
