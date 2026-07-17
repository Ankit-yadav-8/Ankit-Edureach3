import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ShortlistProvider } from "./context/Shortlist.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { EnrolProvider } from "./components/EnrolModal.jsx";
import "./styles/index.css";
import "./styles/strategy.css";

/**
 * Apply the async-loaded stylesheets. They ship as media="print" so they don't
 * block first paint; flipping to "all" is what actually applies them.
 *
 * This was an inline onload="this.media='all'" in index.html. CSP blocks inline
 * event handlers, so under the tightened policy the flip never ran and the site
 * stayed on fallback fonts — silently, since nothing errors.
 */
for (const link of document.querySelectorAll('link[data-async-css]')) {
  if (link.media !== "all") link.media = "all";
}

/**
 * SPA deep-link fallback. 404.html bounces /some/path to /?/some/path so a
 * refresh on a deep link survives; this turns it back into a real URL.
 *
 * This used to be an inline <script> in index.html, and it was the sole reason
 * the CSP had to allow 'unsafe-inline' on script-src — which also allowed any
 * injected inline script to run. Living here instead means script-src can be
 * 'self' with no inline escape hatch at all.
 *
 * Must run before BrowserRouter reads window.location, i.e. before render().
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