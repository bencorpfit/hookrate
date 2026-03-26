"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBestHooks, type HookEntry } from "@/lib/storage";

export default function TrendingPage() {
  const [bestHooks, setBestHooks] = useState<HookEntry[]>([]);

  useEffect(() => {
    setBestHooks(getBestHooks(20));
  }, []);

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const platformLabel = (p: string) => {
    const labels: Record<string, string> = {
      tiktok: "TikTok",
      reels: "Reels",
      shorts: "Shorts",
      linkedin: "LinkedIn",
    };
    return labels[p] || p;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            Hook<span className="text-zinc-400">Rate</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Analyze
            </Link>
            <span className="text-white font-medium">Trending</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Top-rated hooks
          </h1>
          <p className="text-zinc-400">
            The highest-scoring hooks analyzed on HookRate. Learn from the best.
          </p>
        </div>

        {bestHooks.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
            <p className="text-zinc-400 mb-4">
              No hooks analyzed yet. Be the first!
            </p>
            <Link
              href="/"
              className="inline-block bg-white text-black font-semibold py-2.5 px-6 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Rate a hook
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bestHooks.map((entry, i) => (
              <div
                key={entry.id}
                className="flex items-start gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5"
              >
                {/* Rank */}
                <div className="shrink-0 w-8 text-center">
                  <span
                    className={`text-lg font-bold ${i < 3 ? "text-yellow-400" : "text-zinc-500"}`}
                  >
                    #{i + 1}
                  </span>
                </div>

                {/* Score */}
                <span
                  className={`text-3xl font-bold ${scoreColor(entry.score)} shrink-0`}
                >
                  {entry.score}
                </span>

                {/* Hook content */}
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-100 leading-relaxed">
                    &ldquo;{entry.hook}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                      {platformLabel(entry.platform)}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-800 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-zinc-500">
          Built by{" "}
          <a
            href="https://tiktok.com/@bencodezero"
            target="_blank"
            className="text-zinc-300 hover:text-white transition-colors"
          >
            @bencodezero
          </a>{" "}
          — Day 1 / 100K$
        </div>
      </footer>
    </div>
  );
}
