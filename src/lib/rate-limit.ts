import { createHash } from "node:crypto";

const buckets = new Map<string, { count: number; expires: number }>();
const windowSeconds = 15 * 60;
const limit = 5;

export async function rateLimit(identity: string): Promise<boolean> {
  const key = `prototech:form:${createHash("sha256").update(identity).digest("hex")}`;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    const script = "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]); end; return n";
    const response = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(["EVAL", script, "1", key, String(windowSeconds)]), signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error("Rate limit service unavailable");
    const result = await response.json();
    if (result.error || typeof result.result !== "number") throw new Error("Rate limit response invalid");
    return result.result <= limit;
  }
  // shortcut: memory limits apply per server instance; configure Redis before running multiple instances.
  const now = Date.now();
  for (const [entry, bucket] of buckets) if (bucket.expires <= now) buckets.delete(entry);
  const current = buckets.get(key);
  if (!current && buckets.size >= 10000) return false;
  const bucket = current || { count: 0, expires: now + windowSeconds * 1000 };
  bucket.count++;
  buckets.set(key, bucket);
  return bucket.count <= limit;
}
