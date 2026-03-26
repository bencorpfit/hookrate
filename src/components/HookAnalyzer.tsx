"use client";

import { useState } from "react";
import { addToHistory, getBenchmarkPercentile, getHistory } from "@/lib/storage";

interface HookResult {
  score: number;
  analysis: string;
  alternatives: { hook: string; score: number }[];
}

export default function HookAnalyzer() {
  const [hook, setHook] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [result, setResult] = useState<HookResult | null>(null);
  const [percentile, setPercentile] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!hook.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setPercentile(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hook: hook.trim(), platform }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await res.json();
      setResult(data);

      // Save to history
      addToHistory({
        hook: hook.trim(),
        platform,
        score: data.score,
        analysis: data.analysis,
        alternatives: data.alternatives,
      });

      // Calculate benchmark
      const history = getHistory();
      if (history.length >= 2) {
        setPercentile(getBenchmarkPercentile(data.score));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
        <textarea
          value={hook}
          onChange={(e) => setHook(e.target.value)}
          placeholder="Paste your hook here... e.g. &quot;I built an app in 14 days with zero coding experience. Here's what happened.&quot;"
          className="w-full h-32 bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-zinc-500 transition-colors"
          maxLength={500}
        />

        <div className="flex items-center gap-3 mt-4">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-500"
          >
            <option value="tiktok">TikTok</option>
            <option value="reels">Instagram Reels</option>
            <option value="shorts">YouTube Shorts</option>
            <option value="linkedin">LinkedIn</option>
          </select>

          <button
            onClick={analyze}
            disabled={loading || !hook.trim()}
            className="flex-1 bg-white text-black font-semibold py-2.5 px-6 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "Rate my hook"}
          </button>
        </div>

        <p className="text-xs text-zinc-500 mt-2 text-right">
          {hook.length}/500
        </p>
      </div>

      {error && (
        <div className="mt-4 bg-red-950/50 border border-red-800 rounded-xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          {/* Score + Benchmark */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
            <p className="text-zinc-400 text-sm uppercase tracking-wider mb-2">
              Hook Score
            </p>
            <p className={`text-7xl font-bold ${scoreColor(result.score)}`}>
              {result.score}
            </p>
            <p className="text-zinc-500 text-sm mt-1">/100</p>
            {percentile !== null && (
              <p className="text-zinc-400 text-sm mt-3">
                Better than <span className="text-white font-semibold">{percentile}%</span> of your hooks
              </p>
            )}
          </div>

          {/* Analysis */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-3">Analysis</h3>
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
              {result.analysis}
            </p>
          </div>

          {/* Alternatives */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">
              3 improved versions
            </h3>
            <div className="space-y-3">
              {result.alternatives.map((alt, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-zinc-950 rounded-xl p-4 border border-zinc-800"
                >
                  <span
                    className={`text-2xl font-bold ${scoreColor(alt.score)} shrink-0`}
                  >
                    {alt.score}
                  </span>
                  <p className="text-zinc-200 text-sm leading-relaxed">
                    {alt.hook}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
