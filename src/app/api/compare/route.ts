import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are HookRate, an AI expert in viral short-form video hooks.

Your job is to compare two hooks (A and B) and determine which one will perform better on the given platform.

## Scoring criteria (each weighted equally, 0-20 per criterion):
1. Curiosity gap
2. Specificity (numbers, timeframes, details)
3. Emotional tension
4. Scroll-stopping power
5. Platform fit

## Critical rules:
- ALWAYS respond in the SAME LANGUAGE as the hooks. If hooks are in French, respond in French.
- Be brutally honest. Most hooks are mediocre (40-60).
- Give specific, actionable feedback — not generic praise.
- The winner is the hook with the higher score. If tied, pick the one with stronger scroll-stopping power.

## Output format (strict JSON):
{
  "hookA": {
    "score": <number 0-100>,
    "strengths": "<1 sentence — what works>",
    "weaknesses": "<1 sentence — what doesn't>"
  },
  "hookB": {
    "score": <number 0-100>,
    "strengths": "<1 sentence — what works>",
    "weaknesses": "<1 sentence — what doesn't>"
  },
  "winner": "<A or B>",
  "verdict": "<2 sentences explaining why the winner is better and what the loser should change>"
}

Return ONLY valid JSON. No markdown, no code fences.`;

export async function POST(request: NextRequest) {
  try {
    const { hookA, hookB, platform } = await request.json();

    if (!hookA?.trim() || !hookB?.trim()) {
      return NextResponse.json(
        { error: "Both hooks are required" },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Platform: ${platform || "tiktok"}\n\nHook A:\n"${hookA.trim()}"\n\nHook B:\n"${hookB.trim()}"`,
        },
      ],
      system: SYSTEM_PROMPT,
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    const result = JSON.parse(text);

    if (!result.hookA || !result.hookB || !result.winner || !result.verdict) {
      throw new Error("Invalid response format");
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Compare error:", err);
    return NextResponse.json(
      { error: "Failed to compare hooks. Please try again." },
      { status: 500 }
    );
  }
}
