// lib/rateLimiter.ts
import { LRUCache as LRU } from "lru-cache";

interface RateLimitOptions {
  windowMs: number; // window in milliseconds
  roleLimits: Record<string, number>; // max requests per role
}

interface Entry {
  count: number;
  lastRequest: number;
}

export function rateLimiter(options: RateLimitOptions) {
  const cache = new LRU<string, Entry>({
    max: 1000, // max 1000 users/ips
    ttl: options.windowMs, // reset after window
  });

  return {
    /**
     * Checks if request is allowed
     * @param userId string | null - logged-in user id
     * @param ip string - fallback IP
     * @param role string - user role
     */
    check: (userId: string | null, ip: string, role: string) => {
      const key = userId ? `user:${userId}` : `ip:${ip}`;
      const maxRequests =
        options.roleLimits[role] ?? options.roleLimits["default"];
      if (!maxRequests) throw new Error(`No limit defined for role "${role}"`);

      const now = Date.now();
      const entry = cache.get(key);

      if (!entry) {
        cache.set(key, { count: 1, lastRequest: now });
        return { allowed: true, remaining: maxRequests - 1 };
      }

      if (entry.count >= maxRequests) {
        return { allowed: false, remaining: 0 };
      }

      entry.count += 1;
      entry.lastRequest = now;
      cache.set(key, entry);

      return { allowed: true, remaining: maxRequests - entry.count };
    },
  };
}
