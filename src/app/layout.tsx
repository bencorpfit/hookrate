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
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
