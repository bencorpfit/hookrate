"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is HookRate free?",
    a: "Yes! You get 2 free analyses per day on TikTok. Upgrade to Pro for unlimited analyses on all platforms.",
  },
  {
    q: "What platforms are supported?",
    a: "Free users can analyze TikTok hooks. Pro users get TikTok, Instagram Reels, YouTube Shorts, and LinkedIn.",
  },
  {
    q: "How does the AI score work?",
    a: "Our AI analyzes your hook across 5 dimensions: curiosity gap, specificity, emotional tension, scroll-stopping power, and platform fit. Each gets a score, combined into a total from 0 to 100.",
  },
  {
    q: "How to write a viral TikTok hook?",
    a: "A viral TikTok hook grabs attention in the first 1-3 seconds. The best hooks use a surprising stat, a bold claim, a question that creates instant curiosity, or a visual shock. HookRate scores your hook on these exact dimensions so you know before you post.",
  },
  {
    q: "What is a good hook score?",
    a: "On HookRate's 0-100 scale: 0-40 is weak (most viewers will scroll past), 41-60 is average (might work but not optimized), 61-80 is strong (good engagement potential), 81-100 is viral-ready. Most first drafts score between 30-50. After using AI rewrites, creators typically improve to 70+.",
  },
  {
    q: "Does HookRate work for Instagram Reels?",
    a: "Yes! HookRate analyzes hooks for TikTok, Instagram Reels, YouTube Shorts, and LinkedIn. Each platform has different audience behavior, so HookRate adjusts its scoring based on the platform you select. Pro users get access to all platforms.",
  },
  {
    q: "How is HookRate different from other tools?",
    a: "Most competitor tools analyze uploaded videos. HookRate scores your hook TEXT before you even film. You can test and optimize 10 hooks in 2 minutes without shooting anything. Plus it's web-based — no app download needed.",
  },
  {
    q: "Can I test my hook before filming?",
    a: "That's exactly what HookRate is for. Paste your hook idea as text, get a score in seconds, then iterate until you hit 80+. No need to film, edit, and upload first. Save hours of production time.",
  },
  {
    q: "What does the AI analyze in my hook?",
    a: "HookRate's AI evaluates 5 key dimensions: Curiosity (does it make viewers want to know more?), Tension (is there conflict or stakes?), Specificity (are there concrete details?), Emotional pull (does it trigger an emotion?), and Scroll-stopping power (would someone actually stop scrolling?).",
  },
  {
    q: "Does it work in languages other than English?",
    a: "Yes! HookRate works in any language. The AI understands French, Spanish, Portuguese, German, Japanese, and many more. The scoring criteria are universal.",
  },
  {
    q: "How many hooks can I test for free?",
    a: "Free users get 2 hook analyses per day on TikTok. Each analysis includes a score from 0-100 and 3 AI-improved alternatives. Pro users get unlimited analyses on all platforms with 10 rewrites per hook.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no commitments. Cancel with one click.",
  },
  {
    q: "What is the Hook Bank?",
    a: "A curated library of the highest-scoring hooks analyzed on HookRate, organized by niche. Pro users can browse by niche (tech, fitness, food, business, lifestyle), filter by score range, and get inspired by what actually works.",
  },
  {
    q: "Is HookRate better than writing hooks manually?",
    a: "Most creators spend 5-10 minutes writing one hook and hoping it works. With HookRate, you paste your hook, get a score in 3 seconds, read the AI suggestions, and iterate. You can test 20 variations in the time it takes to write 2 manually.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <h3 className="text-2xl font-bold text-white text-center mb-10">
        Frequently asked questions
      </h3>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-white font-medium text-sm">{faq.q}</span>
              <svg
                className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4">
                <p className="text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
