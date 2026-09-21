import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";

// NOTE: We use CSS @font-face fallbacks pointing to Google Fonts in production.
// When network access to fonts.googleapis.com is unavailable (e.g. in a sandbox)
// the UI falls back to built-in Playfair/Inter system stacks defined in globals.css.

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: {
    default: "NexMansion — Exceptional homes. Curated stays.",
    template: "%s · NexMansion",
  },
  description:
    "A private collection of extraordinary villas, selected for unforgettable stays. The Bali Collection: ten handpicked luxury homes, curated and verified.",
  keywords: [
    "luxury villas",
    "Bali villas",
    "curated stays",
    "private villa rental",
    "luxury hospitality",
    "Uluwatu",
    "Ubud",
    "Canggu",
    "Seminyak",
    "Nusa Dua",
  ],
  openGraph: {
    title: "NexMansion — Exceptional homes. Curated stays.",
    description: "A private collection of extraordinary villas, selected for unforgettable stays.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <SkipLink />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
