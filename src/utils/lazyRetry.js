import { lazy } from "react";

/* Robust lazy() for route/code-split chunks.

   Two failure modes it handles:
   1. A transient network blip → one silent retry after a short delay.
   2. A stale chunk after a new deploy (old hashed filename 404s, throwing
      "Failed to fetch dynamically imported module") → a one-time hard reload
      pulls the fresh index + chunk hashes. Guarded by a sessionStorage flag so
      it can never loop; the flag is cleared once the app mounts successfully. */

const RELOAD_FLAG = "cp:chunk-reloaded";

async function load(factory) {
  try {
    return await factory();
  } catch (err) {
    // one silent retry — covers transient network/CDN hiccups
    await new Promise((r) => setTimeout(r, 350));
    try {
      return await factory();
    } catch (err2) {
      try {
        if (!sessionStorage.getItem(RELOAD_FLAG)) {
          sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
          window.location.reload();
          return await new Promise(() => {}); // hold render; the page is reloading
        }
      } catch { /* sessionStorage unavailable — fall through and surface the error */ }
      throw err2;
    }
  }
}

export function lazyRetry(factory) {
  const Comp = lazy(() => load(factory));
  // Warm the chunk ahead of navigation (hover / idle). Errors are ignored —
  // this is best-effort prefetch, the real load still goes through load().
  Comp.preload = () => { try { factory(); } catch { /* ignore */ } };
  return Comp;
}

/* Called after a successful app mount so a future deploy can reload again. */
export function clearChunkReloadFlag() {
  try { sessionStorage.removeItem(RELOAD_FLAG); } catch { /* ignore */ }
}
