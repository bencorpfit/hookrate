import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "7 Hook Formulas for Short-Form Video (TikTok, Reels, Shorts) — HookRate",
  description:
    "Master the 7 proven hook formulas used by top creators on TikTok, Instagram Reels, and YouTube Shorts. Each formula includes examples, scores, and templates you can copy.",
  keywords: [
    "hook formula",
    "short form video hooks",
    "tiktok hook formula",
    "reels hook formula",
    "youtube shorts hooks",
    "viral hook template",
    "content hook examples",
  ],
  openGraph: {
    title: "7 Hook Formulas for Short-Form Video",
    description:
      "Proven hook formulas with AI scores and copy-paste templates for TikTok, Reels, and Shorts.",
    type: "article",
    url: "https://hookrate.io/blog/hook-formulas",
  },
};

const formulas = [
  {
    number: 1,
    name: "The Shock Number",
    template: "[Extreme number] + [unexpected context]",
    examples: [
      { hook: "I made $12,000 in 30 days selling a product that doesn't exist.", score: 93 },
      { hook: "This $2 ingredient fixed my skin after 6 years of acne.", score: 87 },
      { hook: "I lost 40 pounds by adding one meal, not removing one.", score: 85 },
    ],
    why: "Numbers are processed faster than words. Extreme numbers create cognitive dissonance — the viewer's brain says \"that can't be right\" and must verify.",
    when: "When you have a specific, impressive result. Works for finance, fitness, growth, and transformation content.",
    proTip: "Use odd or precise numbers ($12,347 > $12,000). Precision implies truth.",
  },
  {
    number: 2,
    name: "The Contrarian",
    template: "Stop/Don't [common advice]. [Surprising reason].",
    examples: [
      { hook: "Stop posting every day. It's killing your reach.", score: 91 },
      { hook: "Don't learn Python in 2026. Here's what to learn instead.", score: 88 },
      { hook: "Quit meditating. It's making your anxiety worse.", score: 84 },
    ],
    why: "Attacking popular beliefs triggers a defensive reaction. The viewer thinks \"that's wrong!\" and watches to argue — but stays for the explanation.",
    when: "When you have genuine insight that contradicts mainstream advice. Don't be contrarian just for clicks — have a real argument.",
    proTip: "The more universally accepted the advice you're challenging, the stronger the hook.",
  },
  {
    number: 3,
    name: "The Experiment",
    template: "I [did X] for [specific time]. [Teaser of results].",
    examples: [
      { hook: "I woke up at 4am for 30 days. Here's what actually changed.", score: 89 },
      { hook: "I used AI to write all my emails for a week. My boss noticed.", score: 86 },
      { hook: "I ate only gas station food for 7 days. Day 5 got scary.", score: 83 },
    ],
    why: "Experiments have built-in narrative structure: setup, journey, result. The defined timeframe makes it feel achievable and finite.",
    when: "When you've actually done something unusual and documented it. Authenticity matters — viewers detect fake experiments quickly.",
    proTip: "Tease the most dramatic moment, don't reveal the conclusion. \"Day 5 got scary\" > \"and I lost 3 pounds.\"",
  },
  {
    number: 4,
    name: "The Warning",
    template: "[Do this/Watch this] before [time-sensitive event].",
    examples: [
      { hook: "Watch this before you sign your next lease.", score: 86 },
      { hook: "Delete this app from your phone right now. Seriously.", score: 85 },
      { hook: "Check your bank account. This new scam is draining people overnight.", score: 84 },
    ],
    why: "Fear of loss is 2x stronger than desire for gain (loss aversion). Warning hooks trigger the survival instinct — \"am I at risk?\"",
    when: "When you have genuinely useful information that could prevent harm or save money. Don't cry wolf.",
    proTip: "Urgency words (\"right now\", \"before it's too late\", \"immediately\") amplify the effect.",
  },
  {
    number: 5,
    name: "The Hidden Gem",
    template: "Nobody talks about [valuable thing]. [Proof it works].",
    examples: [
      { hook: "This free app replaced Photoshop for me. 2 years, zero complaints.", score: 88 },
      { hook: "The most underrated city in Europe costs $30/day to live in.", score: 82 },
      { hook: "Nobody uses this Google feature. It saved me 5 hours last week.", score: 81 },
    ],
    why: "People love feeling like they've discovered a secret. \"Nobody talks about\" creates instant exclusivity — the viewer is now part of a small group.",
    when: "When you've found something genuinely underappreciated. The value must be real or your credibility tanks.",
    proTip: "Pair the discovery with a specific benefit (\"saved me 5 hours\", \"costs $30/day\") to make it concrete.",
  },
  {
    number: 6,
    name: "The Comparison",
    template: "[Option A] vs [Option B] — [surprising verdict].",
    examples: [
      { hook: "A $5 steak vs a $500 steak. The winner surprised me.", score: 87 },
      { hook: "I tested ChatGPT vs Claude on 50 prompts. One was clearly better.", score: 85 },
      { hook: "Airbnb vs hotel in Tokyo. I paid half for 3x the space.", score: 82 },
    ],
    why: "Comparisons create an instant mental framework. The viewer picks a side and watches to see if they're right. It's a game.",
    when: "When you can compare two things people actually care about choosing between. Price contrasts work especially well.",
    proTip: "Withhold the winner in the hook. \"The winner surprised me\" outperforms \"X was better\" every time.",
  },
  {
    number: 7,
    name: "The Mid-Story Drop",
    template: "[Start in the middle of action]. [Cliffhanger].",
    examples: [
      { hook: "He looked at my screen and said 'you need to stop.' I didn't listen.", score: 86 },
      { hook: "The landlord called at 2am. What he said changed everything.", score: 84 },
      { hook: "I was about to quit when my first customer sent me this message.", score: 82 },
    ],
    why: "Starting in the middle of a story skips the boring setup. The viewer is immediately inside the narrative and needs context — which means they keep watching.",
    when: "When you have a real story with a turning point. This formula requires genuine narrative, not manufactured drama.",
    proTip: "Use dialogue or a specific time (\"at 2am\") to make it feel vivid and real.",
  },
];

function scoreColor(score: number) {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "7 Hook Formulas for Short-Form Video (TikTok, Reels, Shorts)",
  description:
    "Master the 7 proven hook formulas used by top creators on TikTok, Instagram Reels, and YouTube Shorts. Each formula includes examples, scores, and templates you can copy.",
  url: "https://hookrate.io/blog/hook-formulas",
  datePublished: "2026-03-20",
  dateModified: "2026-03-28",
  author: {
    "@type": "Person",
    name: "Ben",
    url: "https://tiktok.com/@bencodezero",
  },
  publisher: {
    "@type": "Organization",
    name: "HookRate",
    url: "https://hookrate.io",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "HookRate", item: "https://hookrate.io" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://hookrate.io/blog" },
    { "@type": "ListItem", position: 3, name: "Hook Formulas", item: "https://hookrate.io/blog/hook-formulas" },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a hook in short-form video?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A hook is the first 1-3 seconds of your video — the opening line, visual, or text overlay that determines whether a viewer keeps watching or scrolls past. On TikTok, Instagram Reels, and YouTube Shorts, hooks are the single biggest factor in video performance.",
      },
    },
    {
      "@type": "Question",
      name: "How do I know if my hook is good?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A good hook creates an open loop (unanswered question), uses specific details instead of vague claims, and triggers an emotional response. You can test your hook objectively using HookRate, which scores it on 5 criteria and suggests improved versions.",
      },
    },
    {
      "@type": "Question",
      name: "Do the same hooks work on TikTok, Reels, and Shorts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The core principles are the same, but each platform has nuances. TikTok rewards bold, polarizing hooks. Instagram Reels favors aesthetic and aspirational hooks. YouTube Shorts performs best with educational and how-to hooks. HookRate adjusts its scoring based on the platform you select.",
      },
    },
    {
      "@type": "Question",
      name: "How many hooks should I test per video?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Write at least 3-5 hooks for every video, then pick the one with the highest score. Many top creators post the same video with different hooks to see which performs best. HookRate generates 3 improved alternatives automatically, giving you options without the extra work.",
      },
    },
  ],
};

export default function HookFormulasPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
            <Link
              href="/blog/best-tiktok-hooks-2026"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Best Hooks 2026
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <article>
          <div className="text-center mb-10">
            <p className="text-sm text-zinc-500 uppercase tracking-wider mb-3">
              The Complete Guide
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              7 Hook Formulas for Short-Form Video
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              These 7 formulas power 90% of viral hooks on TikTok, Instagram
              Reels, and YouTube Shorts. Each one includes a template, scored
              examples, and when to use it.
            </p>
          </div>

          {/* CTA top */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center mb-10">
            <p className="text-white font-semibold mb-2">
              Test your hook before you post
            </p>
            <p className="text-zinc-400 text-sm mb-4">
              HookRate scores your hook on 5 criteria and generates 3 improved
              versions in seconds.
            </p>
            <Link
              href="/"
              className="inline-block bg-white text-black font-semibold py-2.5 px-6 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Score my hook — free
            </Link>
          </div>

          {/* Table of contents */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-10">
            <h2 className="text-white font-semibold mb-3">The 7 Formulas</h2>
            <ol className="space-y-1">
              {formulas.map((f) => (
                <li key={f.number}>
                  <a
                    href={`#formula-${f.number}`}
                    className="text-zinc-400 hover:text-white transition-colors text-sm"
                  >
                    {f.number}. {f.name}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Formulas */}
          <div className="space-y-12">
            {formulas.map((formula) => (
              <section
                key={formula.number}
                id={`formula-${formula.number}`}
                className="scroll-mt-8"
              >
                <h2 className="text-2xl font-bold text-white mb-2">
                  Formula #{formula.number}: {formula.name}
                </h2>

                {/* Template */}
                <div className="bg-zinc-950 border border-zinc-700 rounded-lg p-4 mb-4">
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
                    Template
                  </p>
                  <p className="text-white font-mono text-lg">
                    {formula.template}
                  </p>
                </div>

                {/* Examples with scores */}
                <div className="space-y-2 mb-4">
                  {formula.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-3"
                    >
                      <span
                        className={`text-xl font-bold ${scoreColor(ex.score)} shrink-0 w-10 text-center`}
                      >
                        {ex.score}
                      </span>
                      <p className="text-zinc-200 text-sm">
                        &ldquo;{ex.hook}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>

                {/* Why it works */}
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-zinc-500 font-semibold uppercase tracking-wider text-xs mb-1">
                      Why it works
                    </p>
                    <p className="text-zinc-300">{formula.why}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 font-semibold uppercase tracking-wider text-xs mb-1">
                      When to use
                    </p>
                    <p className="text-zinc-300">{formula.when}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 font-semibold uppercase tracking-wider text-xs mb-1">
                      Pro tip
                    </p>
                    <p className="text-zinc-300">{formula.proTip}</p>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center my-12">
            <h2 className="text-2xl font-bold text-white mb-3">
              Write your hook. Score it. Improve it.
            </h2>
            <p className="text-zinc-400 mb-6">
              HookRate uses AI to analyze your hook on 5 proven criteria —
              curiosity gap, specificity, emotional tension, scroll-stopping
              power, and platform fit. Get a score from 0 to 100 and 3
              improved alternatives in seconds.
            </p>
            <Link
              href="/"
              className="inline-block bg-white text-black font-semibold py-3 px-8 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Try HookRate — it&apos;s free
            </Link>
          </div>

          {/* FAQ SEO section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-1">
                  What is a hook in short-form video?
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  A hook is the first 1-3 seconds of your video — the opening
                  line, visual, or text overlay that determines whether a
                  viewer keeps watching or scrolls past. On TikTok, Instagram
                  Reels, and YouTube Shorts, hooks are the single biggest
                  factor in video performance.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-1">
                  How do I know if my hook is good?
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  A good hook creates an open loop (unanswered question), uses
                  specific details instead of vague claims, and triggers an
                  emotional response. You can test your hook objectively using
                  HookRate, which scores it on 5 criteria and suggests improved
                  versions.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-1">
                  Do the same hooks work on TikTok, Reels, and Shorts?
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  The core principles are the same, but each platform has
                  nuances. TikTok rewards bold, polarizing hooks. Instagram
                  Reels favors aesthetic and aspirational hooks. YouTube Shorts
                  performs best with educational and how-to hooks. HookRate
                  adjusts its scoring based on the platform you select.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-1">
                  How many hooks should I test per video?
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Write at least 3-5 hooks for every video, then pick the one
                  with the highest score. Many top creators post the same video
                  with different hooks to see which performs best. HookRate
                  generates 3 improved alternatives automatically, giving you
                  options without the extra work.
                </p>
              </div>
            </div>
          </section>
        </article>
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
