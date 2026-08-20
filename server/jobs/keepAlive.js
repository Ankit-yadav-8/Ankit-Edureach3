/**
 * Keep-alive self-ping — prevents Render's free tier from spinning down the
 * service after 15 minutes of inactivity.  A lightweight GET to "/" every
 * 14 minutes is enough to reset the idle timer without adding meaningful load.
 *
 * The ping is fire-and-forget: failures are logged once and silently retried
 * on the next tick.  In non-production environments (local dev) the job is a
 * no-op so it never clutters the console.
 */

const INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

export function startKeepAliveJob() {
  // Only run in production — locally the server never sleeps.
  if (process.env.NODE_ENV !== "production") return;

  const url =
    process.env.RENDER_EXTERNAL_URL ||          // Render sets this automatically
    process.env.SELF_URL ||                      // manual override
    `http://localhost:${process.env.PORT || 5000}`;

  console.log(`[keep-alive] pinging ${url} every ${INTERVAL_MS / 60000} min`);

  setInterval(async () => {
    try {
      const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(10000) });
      if (!res.ok) console.warn(`[keep-alive] ping returned ${res.status}`);
    } catch (e) {
      console.warn(`[keep-alive] ping failed: ${e.message}`);
    }
  }, INTERVAL_MS);
}
