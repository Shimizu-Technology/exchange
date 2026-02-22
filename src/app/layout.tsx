import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ConvexProvider } from "@/components/convex-provider";
import { BottomNav, TopNav } from "@/components/layout/nav";

export const metadata: Metadata = {
  title: "ExChange — Guam's Breakup Marketplace",
  description: "Sell stuff from your ex. Buy someone else's baggage. Every item has a story.",
  openGraph: {
    title: "ExChange — Guam's Breakup Marketplace",
    description: "Sell stuff from your ex. Buy someone else's baggage. Every item has a story.",
    type: "website",
    locale: "en_US",
    siteName: "ExChange",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExChange — Guam's Breakup Marketplace",
    description: "Sell stuff from your ex. Buy someone else's baggage. Every item has a story.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#e07a5f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream">
        <ConvexProvider>
          <TopNav />
          <main className="pb-20 md:pb-0">
            {children}
          </main>
          <BottomNav />
        </ConvexProvider>
      </body>
    </html>
  );
}
