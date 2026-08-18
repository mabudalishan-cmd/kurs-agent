/**
 * Sadə yaddaş əsaslı (in-memory) sliding window rate limiter.
 *
 * DİQQƏT: Sayğaclar proses yaddaşında saxlanılır. Serverless mühitdə
 * (məsələn Vercel) hər instansiyanın öz sayğacı olur, ona görə də real
 * limit instansiya sayına görə çoxala bilər. Yüksək trafikdə Upstash Redis
 * kimi paylaşılan store-a keçmək lazımdır.
 */

type Entry = { timestamps: number[] };

const store = new Map<string, Entry>();

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Verilmiş açar üçün `windowMs` müddətində `limit` sayda müraciətə icazə verir.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();

  // Vaxtaşırı köhnəlmiş açarları təmizlə ki, yaddaş şişməsin.
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    for (const [storedKey, entry] of store) {
      if (entry.timestamps.every((t) => now - t > windowMs)) {
        store.delete(storedKey);
      }
    }
    lastCleanup = now;
  }

  const entry = store.get(key) ?? { timestamps: [] };
  const fresh = entry.timestamps.filter((t) => now - t < windowMs);

  if (fresh.length >= limit) {
    const oldest = fresh[0];
    return {
      success: false,
      limit,
      remaining: 0,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((windowMs - (now - oldest)) / 1000)
      ),
    };
  }

  fresh.push(now);
  store.set(key, { timestamps: fresh });

  return {
    success: true,
    limit,
    remaining: limit - fresh.length,
    retryAfterSeconds: 0,
  };
}

/**
 * Proxy başlıqlarından müştəri IP-sini çıxarır.
 * Vercel və əksər reverse proxy-lər `x-forwarded-for` göndərir.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}

/**
 * Limit aşıldıqda standart 429 cavabı qaytarır.
 */
export function tooManyRequests(result: RateLimitResult): Response {
  return Response.json(
    {
      error:
        "Çox sayda müraciət göndərdiniz. Zəhmət olmasa bir az sonra yenidən cəhd edin.",
    },
    {
      status: 429,
      headers: { "Retry-After": String(result.retryAfterSeconds) },
    }
  );
}
