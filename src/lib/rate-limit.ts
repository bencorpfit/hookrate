import { createClient } from "@supabase/supabase-js";

const FREE_LIMIT = 2;
const PRO_LIMIT = 40;

// Service role client to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function checkRateLimit(
  identifier: string,
  isPro: boolean = false
): Promise<{ allowed: boolean; remaining: number }> {
  const limit = isPro ? PRO_LIMIT : FREE_LIMIT;
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabaseAdmin
    .from("daily_usage")
    .select("count")
    .eq("identifier", identifier)
    .eq("usage_date", today)
    .single();

  const currentCount = data?.count ?? 0;

  if (currentCount >= limit) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: limit - currentCount };
}

export async function incrementUsage(identifier: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabaseAdmin
    .from("daily_usage")
    .select("count")
    .eq("identifier", identifier)
    .eq("usage_date", today)
    .single();

  if (data) {
    await supabaseAdmin
      .from("daily_usage")
      .update({ count: data.count + 1 })
      .eq("identifier", identifier)
      .eq("usage_date", today);
  } else {
    await supabaseAdmin
      .from("daily_usage")
      .insert({ identifier, usage_date: today, count: 1 });
  }
}

export function getIdentifier(
  request: Request,
  userId?: string | null
): string {
  if (userId) return `user:${userId}`;
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `ip:${ip}`;
}
