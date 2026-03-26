"use client";

import { useState } from "react";

interface CompareResult {
  hookA: { score: number; strengths: string; weaknesses: string };
  hookB: { score: number; strengths: string; weaknesses: string };
  winner: "A" | "B";
  verdict: string;
}

export default function HookCompare() {
  const [hookA, setHookA] = useState("");
  const [hookB, setHookB] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const compare = async () => {
    if (!hookA.trim() || !hookB.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hookA: hookA.trim(),
          hookB: hookB.trim(),
          platform,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await res.json();
      setResult(data);
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
        <div className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Hook A</label>
            <textarea
              value={hookA}
              onChange={(e) => setHookA(e.target.value)}
              placeholder="Paste your first hook..."
              className="w-full h-24 bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-zinc-500 transition-colors"
              maxLength={500}
            />
          </div>

          <div className="flex items-center justify-center">
            <span className="text-zinc-500 font-bold text-lg">VS</span>
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Hook B</label>
            <textarea
              value={hookB}
              onChange={(e) => setHookB(e.target.value)}
              placeholder="Paste your second hook..."
              className="w-full h-24 bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-zinc-500 transition-colors"
              maxLength={500}
            />
          </div>
        </div>

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
            onClick={compare}
            disabled={loading || !hookA.trim() || !hookB.trim()}
            className="flex-1 bg-white text-black font-semibold py-2.5 px-6 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Comparing..." : "Compare hooks"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-950/50 border border-red-800 rounded-xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          {/* Winner banner */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
            <p className="text-zinc-400 text-sm uppercase tracking-wider mb-2">
              Winner
            </p>
            <p className="text-4xl font-bold text-green-400">
              Hook {result.winner}
            </p>
            <p className="text-zinc-300 text-sm mt-3 leading-relaxed">
              {result.verdict}
            </p>
          </div>

          {/* Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hook A */}
            <div
              className={`bg-zinc-900 border rounded-2xl p-6 ${result.winner === "A" ? "border-green-500" : "border-zinc-800"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-zinc-400 font-semibold">
                  Hook A
                </span>
                <span
                  className={`text-3xl font-bold ${scoreColor(result.hookA.score)}`}
                >
                  {result.hookA.score}
                </span>
              </div>
              <p className="text-zinc-200 text-sm mb-3 italic">
                &ldquo;{hookA}&rdquo;
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-green-400">{result.hookA.strengths}</p>
                <p className="text-red-400">{result.hookA.weaknesses}</p>
              </div>
            </div>

            {/* Hook B */}
            <div
              className={`bg-zinc-900 border rounded-2xl p-6 ${result.winner === "B" ? "border-green-500" : "border-zinc-800"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-zinc-400 font-semibold">
                  Hook B
                </span>
                <span
                  className={`text-3xl font-bold ${scoreColor(result.hookB.score)}`}
                >
                  {result.hookB.score}
                </span>
              </div>
              <p className="text-zinc-200 text-sm mb-3 italic">
                &ldquo;{hookB}&rdquo;
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-green-400">{result.hookB.strengths}</p>
                <p className="text-red-400">{result.hookB.weaknesses}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
