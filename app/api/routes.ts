// pages/api/test.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { rateLimiter } from "../../lib/rateLimiter";

// Configure limits per role
const limiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  roleLimits: {
    admin: 100, // admin can do 100 requests per minute
    user: 10, // logged-in user 10 per minute
    default: 5, // guests/IPs 5 per minute
  },
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.body.user || null; // or get from session/auth
  const role = user?.role || "default";

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

  const { allowed, remaining } = limiter.check(
    user?.id || null,
    ip as string,
    role
  );

  if (!allowed) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  res.status(200).json({ message: "Success", remaining });
}
