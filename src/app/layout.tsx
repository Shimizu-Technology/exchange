import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ConvexProvider } from "@/components/convex-provider";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import { BottomNav, TopNav } from "@/components/layout/nav";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://exchange-guam.netlify.app";

export const metadata: Metadata = {
  title: {
    default: "ExChange — Guam's Breakup Marketplace",
    template: "%s | ExChange",
  },
  description: "Sell stuff from your ex. Buy someone else's baggage. Every item has a story.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "ExChange — Guam's Breakup Marketplace",
    description: "Sell stuff from your ex. Buy someone else's baggage. Every item has a story.",
    type: "website",
    locale: "en_US",
    siteName: "ExChange",
    url: siteUrl,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ExChange — Guam's Breakup Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ExChange — Guam's Breakup Marketplace",
    description: "Sell stuff from your ex. Buy someone else's baggage. Every item has a story.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ExChange",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3d405b" },
    { media: "(prefers-color-scheme: dark)", color: "#3d405b" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream">
        <PostHogProvider>
          <ConvexProvider>
            <TopNav />
            <main className="pb-20 md:pb-0">
              {children}
            </main>
            <BottomNav />
          </ConvexProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
