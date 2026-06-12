import { GraduationCap, BadgeCheck } from "lucide-react";

/* ============================================================
   TopBar — a slim, minimalist announcement strip pinned above
   the navbar. Same orange + white brand colours, no animation.
   ============================================================ */
export default function TopBar() {
  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1001,
        height: 34, display: "flex", alignItems: "center", justifyContent: "center",
        gap: 14, padding: "0 1rem",
        background: "#F47B20", color: "#fff",
        fontFamily: "'Space Grotesk','Sora',sans-serif",
        fontSize: 12.5, fontWeight: 600, letterSpacing: ".2px",
        borderBottom: "1px solid rgba(255,255,255,.18)",
        whiteSpace: "nowrap", overflow: "hidden",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <GraduationCap size={14} strokeWidth={2.4} />
        Built by <strong style={{ fontWeight: 800 }}>IITians</strong>
      </span>
      <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,.7)", flexShrink: 0 }} />
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <BadgeCheck size={14} strokeWidth={2.4} />
        Trusted by <strong style={{ fontWeight: 800 }}>Aspirants</strong>
      </span>
    </div>
  );
}
