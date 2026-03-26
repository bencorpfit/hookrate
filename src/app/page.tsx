"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import HookAnalyzer from "@/components/HookAnalyzer";
import HookCompare from "@/components/HookCompare";
import HookHistory from "@/components/HookHistory";
import AuthModal from "@/components/AuthModal";
import WaitlistModal from "@/components/WaitlistModal";
import FAQ from "@/components/FAQ";

type Tab = "rate" | "compare" | "history";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("rate");
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
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
            <a
              href="#features"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Features
            </a>
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

      {/* Waitlist Modal */}
      {showWaitlist && (
        <WaitlistModal onClose={() => setShowWaitlist(false)} />
      )}

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-4 pt-12 md:pt-20 pb-12">
        <div className="text-center mb-8 max-w-2xl">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
            Is your hook good enough?
          </h2>
          <p className="text-lg text-zinc-400">
            Score your hooks, compare them, and track your progress — powered by AI.
          </p>
          <p className="text-sm text-zinc-500 mt-3">
            Join 500+ creators improving their hooks daily
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

        {/* Before/After Example */}
        {activeTab === "rate" && (
          <div className="mt-12 max-w-2xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">Before</span>
                </div>
                <p className="text-zinc-300 text-sm mb-3">
                  &quot;Here&apos;s what I learned building my app&quot;
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-red-400">34</span>
                  <span className="text-zinc-500 text-xs">/100 — Weak hook, no tension</span>
                </div>
              </div>
              <div className="bg-zinc-900 border border-green-800/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">After</span>
                </div>
                <p className="text-zinc-300 text-sm mb-3">
                  &quot;I mass-deleted 10,000 lines of code. My app got faster.&quot;
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-400">89</span>
                  <span className="text-zinc-500 text-xs">/100 — Strong hook, high curiosity</span>
                </div>
              </div>
            </div>
          </div>
        )}

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

        {/* Features */}
        <div id="features" className="mt-20 max-w-4xl w-full">
          <h3 className="text-2xl font-bold text-white text-center mb-10">
            Everything you need to go viral
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                ),
                title: "AI Hook Score",
                desc: "Get a score from 0-100 based on curiosity, tension, specificity, and emotional pull.",
                pro: false,
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ),
                title: "10 AI Rewrites",
                desc: "Get 10 hook alternatives in different styles: shock, curiosity, emotion, contrarian.",
                pro: true,
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                ),
                title: "Hook Bank",
                desc: "Browse the highest-scoring hooks by niche. Filter by tech, fitness, food, business and more.",
                pro: true,
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Niche Benchmark",
                desc: "See how your hook compares to others in your niche. Know if you're top 10% or bottom 50%.",
                pro: true,
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
                title: "Caption Generator",
                desc: "Turn your hook into a full caption for TikTok, Instagram, and LinkedIn. Ready to post.",
                pro: true,
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                title: "Score History & Export",
                desc: "Track your hook scores over time. See your progress week by week. Export to CSV.",
                pro: true,
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 relative"
              >
                {feature.pro && (
                  <span className="absolute top-4 right-4 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                    PRO
                  </span>
                )}
                <div className="text-white mb-3">{feature.icon}</div>
                <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="mt-20 max-w-3xl w-full">
          <h3 className="text-2xl font-bold text-white text-center mb-4">
            Simple pricing
          </h3>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className={`text-sm ${billingCycle === "monthly" ? "text-white" : "text-zinc-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                billingCycle === "yearly" ? "bg-white" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${
                  billingCycle === "yearly"
                    ? "translate-x-6 bg-black"
                    : "translate-x-0 bg-zinc-400"
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === "yearly" ? "text-white" : "text-zinc-500"}`}>
              Yearly
            </span>
            {billingCycle === "yearly" && (
              <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            )}
          </div>

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
                <li>TikTok only</li>
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
                {billingCycle === "monthly" ? "$4.90" : "$48"}
                <span className="text-sm text-zinc-500 font-normal">
                  {billingCycle === "monthly" ? "/month" : "/year"}
                </span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                <li>Unlimited analyses</li>
                <li>All platforms (TikTok, Reels, Shorts, LinkedIn)</li>
                <li>A/B hook comparison</li>
                <li>10 AI rewrites per hook</li>
                <li>Hook Bank — top hooks by niche</li>
                <li>Niche Benchmark scoring</li>
                <li>Caption Generator</li>
                <li>Score history &amp; trends</li>
                <li>Export to CSV</li>
              </ul>
              <button
                onClick={() => setShowWaitlist(true)}
                className="w-full mt-6 bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Start free trial
              </button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl w-full">
          <FAQ />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-zinc-500">
          <div>
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
          <div className="mt-2 flex items-center justify-center gap-4">
            <a
              href="https://x.com/bencodezero"
              target="_blank"
              className="text-zinc-500 hover:text-white transition-colors"
            >
              X/Twitter
            </a>
            <a
              href="mailto:b.corpfit@gmail.com"
              className="text-zinc-500 hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
