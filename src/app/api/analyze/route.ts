import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { checkRateLimit, incrementUsage, getIdentifier } from "@/lib/rate-limit";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are HookRate, an AI expert in viral short-form video hooks for TikTok, Instagram Reels, YouTube Shorts, and LinkedIn.

Your job is to score a video hook from 0 to 100 and provide 3 improved alternatives.

## Scoring criteria (each weighted equally):
1. **Curiosity gap** (0-20): Does it create an irresistible need to know more?
2. **Specificity** (0-20): Does it use concrete numbers, timeframes, or details?
3. **Emotional tension** (0-20): Does it trigger emotion (surprise, fear, excitement, disbelief)?
4. **Scroll-stopping power** (0-20): Would someone stop scrolling in the first 2 seconds?
5. **Platform fit** (0-20): Is it optimized for the target platform's algorithm and culture?

## Scoring consistency rules:
- Score ONLY the hook text itself, independent of the platform. The platform should only affect the "Platform fit" criterion (worth 20 points max), NOT the other 4 criteria.
- The same hook analyzed twice must give a score within ±5 points. Be deterministic.
- First, calculate the 4 platform-independent criteria (curiosity, specificity, emotion, scroll-stop) = score out of 80. Then add platform fit (0-20). This ensures consistency.
- Score breakdown: 0-20 = terrible, 21-40 = weak, 41-60 = average, 61-75 = good, 76-90 = very good, 91-100 = exceptional (almost never given).

## Critical rules:
- ALWAYS respond in the SAME LANGUAGE as the hook. If the hook is in French, your analysis and alternatives MUST be in French. If in English, respond in English.
- Be brutally honest. Most hooks are mediocre (40-60 range). Only truly exceptional hooks score 80+.
- A generic hook like "In this video I will show you" scores 10-20.
- Each alternative must be a genuinely different approach, not a minor rewording.
- Alternatives should score higher than the original.
- NEVER invent fake scenarios, fake quotes, or fake stories in the alternatives. Keep the same core topic/context as the original hook — just make it more compelling.
- Alternatives must stay truthful to the original message. Reframe, restructure, add tension — but do NOT fabricate.

## Output format (strict JSON):
{
  "score": <number 0-100>,
  "subscores": {
    "curiosity": <number 0-20>,
    "specificity": <number 0-20>,
    "emotion": <number 0-20>,
    "scrollStop": <number 0-20>,
    "platformFit": <number 0-20>
  },
  "analysis": "<2-3 sentences explaining the score. Be specific about what works and what doesn't.>",
  "alternatives": [
    { "hook": "<improved hook 1>", "score": <number> },
    { "hook": "<improved hook 2>", "score": <number> },
    { "hook": "<improved hook 3>", "score": <number> }
  ]
}

The "score" field MUST equal the sum of all 5 subscores. Return ONLY valid JSON. No markdown, no code fences, no explanation outside the JSON.`;

export async function POST(request: NextRequest) {
  try {
    const { hook, platform } = await request.json();

    // Rate limit check
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const identifier = getIdentifier(request, user?.id);
    const { allowed, remaining } = await checkRateLimit(identifier);

    if (!allowed) {
      return NextResponse.json(
        { error: "Daily limit reached (2/day). Upgrade to Pro for unlimited analyses.", limit: true },
        { status: 429 }
      );
    }

    if (!hook || typeof hook !== "string" || hook.trim().length === 0) {
      return NextResponse.json(
        { error: "Hook text is required" },
        { status: 400 }
      );
    }

    if (hook.length > 500) {
      return NextResponse.json(
        { error: "Hook must be 500 characters or less" },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `Platform: ${platform || "tiktok"}\n\nHook to analyze:\n"${hook.trim()}"`,
        },
      ],
      system: SYSTEM_PROMPT,
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    const result = JSON.parse(text);

    if (
      typeof result.score !== "number" ||
      !result.analysis ||
      !Array.isArray(result.alternatives)
    ) {
      throw new Error("Invalid response format");
    }

    // Increment usage after successful analysis
    await incrementUsage(identifier);

    return NextResponse.json({ ...result, remaining: remaining - 1 });
  } catch (err) {
    console.error("Analyze error:", err);
    return NextResponse.json(
      { error: "Failed to analyze hook. Please try again." },
      { status: 500 }
    );
  }
}
