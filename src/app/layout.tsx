import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HookRate — Score your hooks with AI",
  description:
    "Paste your TikTok, Reels or Shorts hook. Get a score from 0 to 100 and improved versions instantly.",
  keywords: ["hook", "tiktok", "reels", "shorts", "ai", "score", "viral"],
  openGraph: {
    title: "HookRate — Score your hooks with AI",
    description:
      "Paste your TikTok, Reels or Shorts hook. Get a score from 0 to 100 and improved versions instantly.",
    type: "website",
    url: "https://hookrate.io",
    siteName: "HookRate",
  },
  twitter: {
    card: "summary_large_image",
    title: "HookRate — Score your hooks with AI",
    description:
      "Is your hook good enough? Get an AI score from 0-100 and 3 improved alternatives.",
  },
};

const jsonLdWebApplication = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "HookRate",
  url: "https://hookrate.io",
  description:
    "Score your TikTok, Reels, Shorts and LinkedIn hooks with AI. Get a score from 0 to 100 and 3 improved versions instantly.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free — 2 analyses per day",
    },
    {
      "@type": "Offer",
      price: "4.90",
      priceCurrency: "USD",
      description: "Pro — unlimited analyses, all platforms",
    },
  ],
  creator: {
    "@type": "Person",
    name: "Ben",
    url: "https://tiktok.com/@bencodezero",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdWebApplication),
          }}
        />
        {children}
      </body>
    </html>
  );
}
