/* Minimal service worker — caches the app shell for offline/installable PWA.
   Paths are relative so it works under the GitHub Pages repo subpath. */
const CACHE = "edureach-v10";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./favicon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()).catch(() => {}));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  // Never cache API calls — the admin dashboard and auth must always see live data.
  if (new URL(request.url).pathname.startsWith("/api/")) return;
  if (request.mode === "navigate") {
    e.respondWith(fetch(request).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((res) => {
      // Guard: do not cache HTML responses if the browser requested a JS module chunk!
      if (res.status === 200) {
        const ct = res.headers.get("content-type") || "";
        if (request.url.endsWith(".js") && !ct.includes("javascript")) {
          return res;
        }
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
      }
      return res;
    }).catch(() => cached))
  );
});
