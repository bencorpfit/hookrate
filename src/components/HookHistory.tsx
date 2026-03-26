"use client";

import { useEffect, useState } from "react";
import {
  getHistory,
  getAverageScore,
  getScoreTrend,
  type HookEntry,
} from "@/lib/storage";

export default function HookHistory() {
  const [history, setHistory] = useState<HookEntry[]>([]);
  const [avgScore, setAvgScore] = useState(0);
  const [trend, setTrend] = useState<{ date: string; score: number }[]>([]);

  useEffect(() => {
    setHistory(getHistory());
    setAvgScore(getAverageScore());
    setTrend(getScoreTrend());
  }, []);

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  if (history.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <p className="text-zinc-400">No analyses yet. Rate your first hook to see your history.</p>
        </div>
      </div>
    );
  }

  // Simple visual trend bar chart
  const maxScore = Math.max(...trend.map((t) => t.score), 1);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-wider">
            Total analyses
          </p>
          <p className="text-2xl font-bold text-white mt-1">{history.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-wider">
            Average score
          </p>
          <p className={`text-2xl font-bold mt-1 ${scoreColor(avgScore)}`}>
            {avgScore}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-wider">
            Best score
          </p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {Math.max(...history.map((h) => h.score))}
          </p>
        </div>
      </div>

      {/* Trend chart */}
      {trend.length > 1 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Score trend</h3>
          <div className="flex items-end gap-1 h-32">
            {trend.slice(-20).map((t, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span className="text-xs text-zinc-500">{t.score}</span>
                <div
                  className={`w-full rounded-t transition-all ${
                    t.score >= 80
                      ? "bg-green-500"
                      : t.score >= 60
                        ? "bg-yellow-500"
                        : t.score >= 40
                          ? "bg-orange-500"
                          : "bg-red-500"
                  }`}
                  style={{
                    height: `${(t.score / maxScore) * 100}%`,
                    minHeight: "4px",
                  }}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-2 text-center">
            Last {Math.min(trend.length, 20)} analyses
          </p>
        </div>
      )}

      {/* History list */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Recent analyses</h3>
        <div className="space-y-3">
          {history.slice(0, 15).map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 bg-zinc-950 rounded-xl p-4 border border-zinc-800"
            >
              <span
                className={`text-2xl font-bold ${scoreColor(entry.score)} shrink-0 w-12 text-center`}
              >
                {entry.score}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-zinc-200 text-sm truncate">{entry.hook}</p>
                <p className="text-zinc-500 text-xs mt-1">
                  {entry.platform} &middot;{" "}
                  {new Date(entry.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
