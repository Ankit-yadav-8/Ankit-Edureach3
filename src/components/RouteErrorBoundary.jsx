import { Component } from "react";

/* Catches render/chunk-load errors in the routed page so a single failed
   page never white-screens the whole app. Stale-chunk errors (after a deploy)
   trigger a one-time reload; anything else shows a friendly reload card.
   Reset per navigation by giving it a `key={pathname}` at the call site. */
export default class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(err) {
    const msg = String(err?.message || "");
    const stale = /dynamically imported module|Importing a module script failed|Failed to fetch|ChunkLoadError|error loading dynamically/i.test(msg);
    if (stale) {
      try {
        if (!sessionStorage.getItem("cp:chunk-reloaded")) {
          sessionStorage.setItem("cp:chunk-reloaded", String(Date.now()));
          window.location.reload();
        }
      } catch { /* ignore */ }
    }
  }

  render() {
    if (this.state.failed) {
      return (
        <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", textAlign: "center", padding: "2rem" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 20, color: "#1c1c28", marginBottom: 8 }}>
              This page didn’t load fully
            </div>
            <div style={{ color: "#6b6770", marginBottom: 18, fontFamily: "'Inter',system-ui,sans-serif" }}>
              A quick reload usually fixes it.
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{ background: "#FF5A36", color: "#fff", border: "none", borderRadius: 9999, padding: "11px 26px", fontWeight: 700, fontFamily: "'Inter',system-ui,sans-serif", cursor: "pointer" }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
