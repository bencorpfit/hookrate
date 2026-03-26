// Local storage helpers for hook history
// Will be migrated to Supabase later

export interface HookEntry {
  id: string;
  hook: string;
  platform: string;
  score: number;
  analysis: string;
  alternatives: { hook: string; score: number }[];
  createdAt: string;
}

const STORAGE_KEY = "hookrate_history";

export function getHistory(): HookEntry[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function addToHistory(entry: Omit<HookEntry, "id" | "createdAt">): HookEntry {
  const history = getHistory();
  const newEntry: HookEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  history.unshift(newEntry);
  // Keep last 100 entries
  if (history.length > 100) history.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return newEntry;
}

export function getAverageScore(): number {
  const history = getHistory();
  if (history.length === 0) return 0;
  return Math.round(
    history.reduce((sum, e) => sum + e.score, 0) / history.length
  );
}

export function getBenchmarkPercentile(score: number): number {
  const history = getHistory();
  if (history.length < 2) return 50;
  const below = history.filter((e) => e.score < score).length;
  return Math.round((below / history.length) * 100);
}

export function getBestHooks(limit: number = 10): HookEntry[] {
  const history = getHistory();
  return [...history].sort((a, b) => b.score - a.score).slice(0, limit);
}

export function getScoreTrend(): { date: string; score: number }[] {
  const history = getHistory();
  return [...history]
    .reverse()
    .map((e) => ({
      date: new Date(e.createdAt).toLocaleDateString(),
      score: e.score,
    }));
}
