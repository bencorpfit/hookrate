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
    q: "Does it work in languages other than English?",
    a: "Yes! HookRate works in any language. The AI understands French, Spanish, Portuguese, German, and many more.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no commitments. Cancel with one click.",
  },
  {
    q: "What is the Hook Bank?",
    a: "A curated library of the highest-scoring hooks analyzed on HookRate, organized by niche. Pro users can filter, search, and get inspired by what works best in their category.",
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
