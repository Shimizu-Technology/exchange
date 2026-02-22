"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="font-display text-2xl text-ocean mb-4">Something went wrong</h2>
          <p className="text-muted mb-6">We've been notified and are looking into it.</p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-coral text-white rounded-2xl font-display font-bold hover:bg-coral-dark transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
