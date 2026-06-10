import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ShortlistProvider } from "./context/Shortlist.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { EnrolProvider } from "./components/EnrolModal.jsx";
import "./styles/index.css";

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