// lib/rateLimit.ts
const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit = 60, windowMs = 60_000) {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || entry.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (entry.count >= limit)
    return { ok: false, remaining: 0, retryAfter: entry.reset - now };
  entry.count += 1;
  return { ok: true, remaining: limit - entry.count };
}
