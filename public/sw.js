/* Minimal service worker — caches the app shell for offline/installable PWA.
   Paths are relative so it works under the GitHub Pages repo subpath. */
const CACHE = "edureach-v20";
const SHELL = ["/", "/index.html", "/manifest.webmanifest", "/favicon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()).catch(() => {})
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  // Never cache API calls — auth, admin, and live dashboard metrics must always be real-time
  try {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return;
  } catch {
    return;
  }

  // SPA navigation requests
  if (request.mode === "navigate") {
    e.respondWith(
      (async () => {
        try {
          const res = await fetch(request);
          if (res && res.status < 400) return res;
          const cached = (await caches.match("/index.html")) || (await caches.match("./index.html")) || (await caches.match("/"));
          if (cached) return cached;
          return res || new Response("", { status: 404 });
        } catch (err) {
          try {
            const cached = (await caches.match("/index.html")) || (await caches.match("./index.html")) || (await caches.match("/"));
            if (cached) return cached;
          } catch {}
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Campus Point · Offline</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:sans-serif;text-align:center;padding:40px 16px;color:#0f172a;"><h2 style="margin:0 0 8px;">Network connection issue</h2><p style="color:#64748b;margin:0 0 16px;">Please check your connection and refresh.</p><button onclick="location.reload()" style="background:#FF693D;color:#fff;border:none;padding:10px 18px;border-radius:8px;font-weight:700;cursor:pointer;">Retry</button></body></html>',
            { status: 200, headers: { "Content-Type": "text/html" } }
          );
        }
      })()
    );
    return;
  }

  // Static assets (JS, CSS, images, fonts)
  e.respondWith(
    (async () => {
      try {
        const cached = await caches.match(request);
        if (cached) return cached;
        const res = await fetch(request);
        if (res && res.status === 200) {
          const ct = res.headers.get("content-type") || "";
          if (!request.url.endsWith(".js") || ct.includes("javascript")) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
          }
        }
        return res || new Response("", { status: 404 });
      } catch (err) {
        // Guarantee respondWith never resolves to undefined or uncaught rejection
        return new Response("", { status: 408, statusText: "Network Timeout" });
      }
    })()
  );
});
