import { BadgeCheck } from "lucide-react";
import { useLocation } from "react-router-dom";

/* ============================================================
   TopBar - a slim, minimalist announcement strip pinned above
   the navbar. Solid orange background with clean white trust
   text (no glow / animation).
   ============================================================ */
export default function TopBar() {
  const { pathname } = useLocation();
  const p = (pathname || "").toLowerCase();
  const isExcluded = (
    p === "/admin" || p.startsWith("/admin/") ||
    p === "/mentor" || p.startsWith("/mentor/") ||
    p === "/ai"
  );
  if (isExcluded) {
    return null;
  }

  return (
    <div
      className="cp-topbar"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1001,
        height: 34, display: "flex", alignItems: "center", justifyContent: "center",
        gap: 14, padding: "0 1rem",
        background: "#C2410C", color: "#FFFFFF",
        fontFamily: "'Space Grotesk','Sora',sans-serif",
        fontSize: 12.5, fontWeight: 600, letterSpacing: ".2px",
        borderBottom: "1px solid rgba(255,255,255,.25)",
        whiteSpace: "nowrap", overflow: "hidden",
      }}
    >
      <style>{`
        .cp-topbar .cp-topbar__glow {
          display: inline-flex; align-items: center; gap: 6px; color: #FFFFFF;
        }
      `}</style>
      <span className="cp-topbar__glow">
        <span
          style={{
            width: 17, height: 17, borderRadius: "50%", background: "#FFFFFF",
            display: "grid", placeItems: "center", flexShrink: 0,
          }}
        >
          <span style={{ color: "#C2410C", fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 8.5, letterSpacing: "-0.3px", lineHeight: 1 }}>
            CP
          </span>
        </span>
        Built by <strong style={{ fontWeight: 800, color: "#FFFFFF" }}>IITians</strong>
      </span>
      <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,.85)", flexShrink: 0 }} />
      <span className="cp-topbar__glow">
        <BadgeCheck size={14} strokeWidth={2.4} color="#FFFFFF" />
        Trusted by <strong style={{ fontWeight: 800, color: "#FFFFFF" }}>Aspirants</strong>
      </span>
    </div>
  );
}
