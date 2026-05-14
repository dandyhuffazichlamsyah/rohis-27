/**
 * Simple in-memory rate limiter.
 * In a multi-instance deployment (Vercel), each instance has its own memory,
 * so this is a best-effort limiter. For stricter limits, use Redis or Vercel KV.
 */

type Entry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Entry>();

export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number,
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // First attempt or window expired
    const newEntry: Entry = { count: 1, resetAt: now + windowMs };
    store.set(key, newEntry);
    return { allowed: true, remaining: maxAttempts - 1, retryAfterMs: 0 };
  }

  if (entry.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: entry.resetAt - now,
    };
  }

  entry.count += 1;
  store.set(key, entry);
  return { allowed: true, remaining: maxAttempts - entry.count, retryAfterMs: 0 };
}
