"use client";

import { useState } from "react";
import { addToHistory, getBenchmarkPercentile, getHistory, getAverageScore } from "@/lib/storage";

interface Subscores {
  curiosity: number;
  specificity: number;
  emotion: number;
  scrollStop: number;
  platformFit: number;
}

interface HookResult {
  score: number;
  subscores?: Subscores;
  analysis: string;
  alternatives: { hook: string; score: number }[];
  remaining?: number;
}

interface HookAnalyzerProps {
  onRequireAuth?: () => void;
  isLoggedIn?: boolean;
  isPro?: boolean;
  onUpgrade?: () => void;
}

const subscoreLabels: { key: keyof Subscores; label: string }[] = [
  { key: "curiosity", label: "Curiosity Gap" },
  { key: "specificity", label: "Specificity" },
  { key: "emotion", label: "Emotional Tension" },
  { key: "scrollStop", label: "Scroll-Stopping" },
  { key: "platformFit", label: "Platform Fit" },
];

export default function HookAnalyzer({ onRequireAuth, isLoggedIn, isPro = false, onUpgrade }: HookAnalyzerProps) {
  const [hook, setHook] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [result, setResult] = useState<HookResult | null>(null);
  const [percentile, setPercentile] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const analyze = async (hookText?: string) => {
    const textToAnalyze = hookText || hook;
    if (!textToAnalyze.trim()) return;
    if (!isLoggedIn && onRequireAuth) {
      onRequireAuth();
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setPercentile(null);
    setLimitReached(false);

    if (hookText) {
      setHook(hookText);
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hook: textToAnalyze.trim(), platform }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.limit) {
          setLimitReached(true);
        }
        throw new Error(data.error || "Something went wrong");
      }

      const data = await res.json();
      setResult(data);
      setHasAnalyzed(true);
      if (typeof data.remaining === "number") {
        setRemaining(data.remaining);
      }

      addToHistory({
        hook: textToAnalyze.trim(),
        platform,
        score: data.score,
        analysis: data.analysis,
        alternatives: data.alternatives,
      });

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

  const barColor = (score: number) => {
    if (score >= 16) return "bg-green-400";
    if (score >= 12) return "bg-yellow-400";
    if (score >= 8) return "bg-orange-400";
    return "bg-red-400";
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const avgScore = getAverageScore();
  const hookCount = getHistory().length;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
        <textarea
          value={hook}
          onChange={(e) => setHook(e.target.value)}
          placeholder="Paste your hook here..."
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
            onClick={() => analyze()}
            disabled={loading || !hook.trim()}
            className="flex-1 bg-white text-black font-semibold py-2.5 px-6 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading
              ? "Analyzing..."
              : hasAnalyzed && result
                ? `Score another — beat your ${result.score}`
                : "Rate my hook"}
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          {!isPro && remaining !== null && remaining >= 0 && (
            <p className="text-xs text-zinc-500">
              {remaining > 0 ? (
                <>{remaining} free {remaining === 1 ? "analysis" : "analyses"} left today</>
              ) : (
                <span className="text-orange-400">No analyses left today</span>
              )}
            </p>
          )}
          {isPro && (
            <p className="text-xs text-emerald-500">PRO — unlimited</p>
          )}
          <p className="text-xs text-zinc-500 ml-auto">
            {hook.length}/500
          </p>
        </div>
      </div>

      {/* Limit reached — smart message */}
      {error && limitReached && (
        <div className="mt-4 bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center">
          <p className="text-white font-semibold text-base mb-1">Daily limit reached</p>
          {hookCount >= 2 && avgScore > 0 ? (
            <p className="text-zinc-400 text-sm mb-1">
              Your average score: <span className={`font-bold ${scoreColor(avgScore)}`}>{avgScore}</span>/100
              {avgScore < 65 && " — below the average creator (65)."}
              {avgScore >= 65 && avgScore < 80 && " — above average, but not viral yet."}
              {avgScore >= 80 && " — you're in the top tier."}
            </p>
          ) : null}
          <p className="text-zinc-500 text-sm mb-4">
            With Pro: unlimited analyses, detailed score breakdown, 10 AI rewrites per hook.
          </p>
          <a href="#pricing" className="inline-block bg-white text-black font-semibold py-2.5 px-6 rounded-lg hover:bg-zinc-200 transition-colors">
            Unlock Pro — $4.90/mo
          </a>
          <p className="text-zinc-600 text-xs mt-3">or come back tomorrow for 2 free analyses</p>
        </div>
      )}

      {/* Other errors */}
      {error && !limitReached && (
        <div className="mt-4 bg-red-950/50 border border-red-800 rounded-xl p-4 text-sm text-red-400">
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

          {/* Sub-scores: PRO = visible, FREE = blurred teaser */}
          {isPro && result.subscores ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Score breakdown</h3>
              <div className="space-y-3">
                {subscoreLabels.map(({ key, label }) => {
                  const value = result.subscores![key];
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-400">{label}</span>
                        <span className={`font-semibold ${value >= 16 ? "text-green-400" : value >= 12 ? "text-yellow-400" : value >= 8 ? "text-orange-400" : "text-red-400"}`}>
                          {value}/20
                        </span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${barColor(value)} rounded-full transition-all duration-500`}
                          style={{ width: `${(value / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Weak spot callout */}
              {(() => {
                const weakest = subscoreLabels.reduce((min, curr) =>
                  result.subscores![curr.key] < result.subscores![min.key] ? curr : min
                );
                const weakScore = result.subscores![weakest.key];
                if (weakScore <= 12) {
                  return (
                    <div className="mt-4 bg-zinc-950 border border-zinc-700 rounded-lg p-3">
                      <p className="text-zinc-400 text-xs">
                        <span className="text-orange-400 font-semibold">Weak spot:</span>{" "}
                        {weakest.label} ({weakScore}/20). Focus on improving this to push your score higher.
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          ) : (
            /* FREE user — locked sub-scores teaser */
            <div className="bg-zinc-900 border border-dashed border-zinc-600 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                PRO
              </div>
              <h3 className="text-white font-semibold mb-4">Score breakdown</h3>
              <div className="space-y-3">
                {subscoreLabels.map(({ label }, i) => {
                  // Fake blurred bars to tease
                  const fakeWidths = [75, 45, 60, 85, 55];
                  return (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-500">{label}</span>
                        <span className="text-zinc-600 font-semibold">??/20</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zinc-600 rounded-full"
                          style={{ width: `${fakeWidths[i]}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-zinc-500 text-xs mt-4">
                See exactly where your hook is strong and weak. Find your blind spots.
              </p>
              <a
                href="#pricing"
                className="block mt-3 text-center bg-white text-black font-semibold py-2 rounded-lg hover:bg-zinc-200 transition-colors text-sm"
              >
                Unlock score breakdown — $4.90/mo
              </a>
            </div>
          )}

          {/* Analysis */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-3">Analysis</h3>
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
              {result.analysis}
            </p>
          </div>

          {/* Alternatives with Copy + Re-score buttons */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">
              3 improved versions
            </h3>
            <div className="space-y-3">
              {result.alternatives.map((alt, i) => (
                <div
                  key={i}
                  className="bg-zinc-950 rounded-xl p-4 border border-zinc-800"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`text-2xl font-bold ${scoreColor(alt.score)} shrink-0`}
                    >
                      {alt.score}
                    </span>
                    <p className="text-zinc-200 text-sm leading-relaxed flex-1">
                      {alt.hook}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => copyToClipboard(alt.hook, i)}
                      className="text-xs border border-zinc-700 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-40 flex items-center gap-1.5"
                      style={{
                        color: copiedIndex === i ? "#4ade80" : "#71717a",
                        borderColor: copiedIndex === i ? "#4ade80" : undefined,
                      }}
                    >
                      {copiedIndex === i ? (
                        <>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => analyze(alt.hook)}
                      disabled={loading}
                      className="text-xs text-zinc-500 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-40"
                    >
                      Re-score
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro upsell block — only for free users */}
          {!isPro && (
            <div className="bg-zinc-900 border border-dashed border-zinc-600 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                PRO
              </div>
              <h3 className="text-white font-semibold mb-4">Get more from every hook</h3>

              <div className="space-y-3 opacity-60">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-400 text-sm">&#10003;</span>
                  <div>
                    <p className="text-zinc-300 text-sm font-medium">10 AI rewrites per hook</p>
                    <p className="text-zinc-500 text-xs">Shock, curiosity, emotion, contrarian, question styles</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-400 text-sm">&#10003;</span>
                  <div>
                    <p className="text-zinc-300 text-sm font-medium">Unlimited analyses</p>
                    <p className="text-zinc-500 text-xs">No daily limit — test as many hooks as you want</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-400 text-sm">&#10003;</span>
                  <div>
                    <p className="text-zinc-300 text-sm font-medium">Weak spot tracking</p>
                    <p className="text-zinc-500 text-xs">See your patterns over weeks — not just one hook</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-400 text-sm">&#10003;</span>
                  <div>
                    <p className="text-zinc-300 text-sm font-medium">All platforms</p>
                    <p className="text-zinc-500 text-xs">TikTok, Reels, Shorts, LinkedIn — optimized scoring</p>
                  </div>
                </div>
              </div>

              {hookCount >= 2 && avgScore > 0 && avgScore < 80 && (
                <p className="text-zinc-400 text-xs mt-4">
                  Your average: <span className={`font-semibold ${scoreColor(avgScore)}`}>{avgScore}</span>. Pro users improve to 74+ within 2 weeks.
                </p>
              )}

              <a
                href="#pricing"
                className="block mt-4 text-center bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Upgrade to Pro — $4.90/mo
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
