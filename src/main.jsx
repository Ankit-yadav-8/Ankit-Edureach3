import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ShortlistProvider } from "./context/Shortlist.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { EnrolProvider } from "./components/EnrolModal.jsx";
import { API_BASE } from "./auth/api.js";
import "./styles/index.css";

// ── Auto-recovery for stale-chunk errors after new production deployments ─────
const handleChunkError = (err) => {
  const msg = String(err?.message || err?.reason?.message || err?.reason || "");
  if (/Failed to fetch dynamically imported module|Importing a module script failed/i.test(msg)) {
    const lastReload = Number(sessionStorage.getItem("cp:chunk-reloaded") || 0);
    if (Date.now() - lastReload > 8000) {
      sessionStorage.setItem("cp:chunk-reloaded", String(Date.now()));
      window.location.reload();
    }
  }
};
window.addEventListener("error", handleChunkError);
window.addEventListener("unhandledrejection", handleChunkError);

// ── Warm-up ping ────────────────────────────────────────────────────────────
if (API_BASE.includes("onrender.com")) {
  fetch(`${API_BASE}/health`, { method: "GET", keepalive: true }).catch(() => {});
}

for (const link of document.querySelectorAll('link[data-async-css]')) {
  if (link.media !== "all") link.media = "all";
}

/**
 * SPA deep-link fallback.
 */
(function restoreDeepLink(l) {
  if (l.search[1] === "/") {
    const decoded = l.search.slice(1).split("&")
      .map((s) => s.replace(/~and~/g, "&"))
      .join("?");
    window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
  }
})(window.location);

// Base path: "/" in dev, "/Ankit-Edureach" on GitHub Pages (from vite base).
const basename = import.meta.env.BASE_URL.replace(/\/+$/, "");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <ShortlistProvider>
          <EnrolProvider>
            <App />
          </EnrolProvider>
        </ShortlistProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Register PWA service worker (production builds), under the correct base.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + "sw.js").catch(() => {});
  });
}
