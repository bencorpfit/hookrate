"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import HookAnalyzer from "@/components/HookAnalyzer";
import HookCompare from "@/components/HookCompare";
import HookHistory from "@/components/HookHistory";
import AuthModal from "@/components/AuthModal";

type Tab = "rate" | "compare" | "history";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("rate");
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            Hook<span className="text-zinc-400">Rate</span>
          </h1>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/trending"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Trending
            </Link>
            <a
              href="#pricing"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Pricing
            </a>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-zinc-400 text-xs hidden md:inline">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="bg-white text-black font-medium px-4 py-1.5 rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Sign in
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onAuth={() => setShowAuth(false)}
        />
      )}

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-4 pt-12 md:pt-20 pb-12">
        <div className="text-center mb-8 max-w-xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Is your hook good enough?
          </h2>
          <p className="text-lg text-zinc-400">
            Score your hooks, compare them, and track your progress — powered by
            AI.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-8">
          {[
            { id: "rate" as Tab, label: "Rate" },
            { id: "compare" as Tab, label: "A/B Compare" },
            { id: "history" as Tab, label: "History" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if ((tab.id === "compare" || tab.id === "history") && !user) {
                  setShowAuth(true);
                  return;
                }
                setActiveTab(tab.id);
              }}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "rate" && <HookAnalyzer />}
        {activeTab === "compare" && user && <HookCompare />}
        {activeTab === "history" && user && <HookHistory />}

        {/* Social proof */}
        {activeTab === "rate" && (
          <div className="mt-16 text-center">
            <p className="text-zinc-500 text-sm">
              71% of viewers decide in 3 seconds whether to keep watching.
              <br />
              Make those seconds count.
            </p>
          </div>
        )}

        {/* How it works */}
        {activeTab === "rate" && (
          <div className="mt-20 max-w-3xl w-full">
            <h3 className="text-2xl font-bold text-white text-center mb-10">
              How it works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Paste your hook",
                  desc: "The first sentence of your video script — the one that stops the scroll.",
                },
                {
                  step: "2",
                  title: "Get your score",
                  desc: "AI analyzes curiosity, tension, specificity and more. Score from 0 to 100.",
                },
                {
                  step: "3",
                  title: "Use the better version",
                  desc: "Get 3 improved alternatives ranked by score. Copy, paste, post.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center"
                >
                  <div className="w-10 h-10 bg-white text-black font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h4 className="text-white font-semibold mb-2">
                    {item.title}
                  </h4>
                  <p className="text-zinc-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing */}
        <div id="pricing" className="mt-20 max-w-3xl w-full">
          <h3 className="text-2xl font-bold text-white text-center mb-10">
            Simple pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h4 className="text-white font-semibold text-lg">Free</h4>
              <p className="text-3xl font-bold text-white mt-2">
                $0
                <span className="text-sm text-zinc-500 font-normal">
                  /month
                </span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                <li>2 analyses per day</li>
                <li>Score 0-100</li>
                <li>3 improved alternatives</li>
              </ul>
              {!user && (
                <button
                  onClick={() => setShowAuth(true)}
                  className="w-full mt-6 border border-zinc-600 text-white font-medium py-2.5 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  Get started free
                </button>
              )}
            </div>

            <div className="bg-zinc-900 border-2 border-white rounded-2xl p-6 relative">
              <span className="absolute -top-3 left-6 bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </span>
              <h4 className="text-white font-semibold text-lg">Pro</h4>
              <p className="text-3xl font-bold text-white mt-2">
                $9
                <span className="text-sm text-zinc-500 font-normal">
                  /month
                </span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                <li>Unlimited analyses</li>
                <li>A/B hook comparison</li>
                <li>Score history &amp; trends</li>
                <li>Benchmark vs. other hooks</li>
                <li>Platform-specific tips</li>
              </ul>
              <button className="w-full mt-6 bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors">
                Coming soon
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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
