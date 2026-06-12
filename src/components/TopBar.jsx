import { GraduationCap, BadgeCheck } from "lucide-react";

/* ============================================================
   TopBar — a slim, minimalist announcement strip pinned above
   the navbar. Same orange + white brand colours. The trust
   line carries a soft glow (the one glow effect kept on the
   site after the footer was flattened).
   ============================================================ */
export default function TopBar() {
  return (
    <div
      className="cp-topbar"
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
      <style>{`
        .cp-topbar .cp-topbar__glow {
          display: inline-flex; align-items: center; gap: 6px;
          text-shadow: 0 0 8px rgba(255,255,255,.85), 0 0 16px rgba(255,224,178,.6);
          animation: cpTopbarGlow 2.4s ease-in-out infinite;
        }
        @keyframes cpTopbarGlow {
          0%, 100% { text-shadow: 0 0 6px rgba(255,255,255,.6), 0 0 12px rgba(255,224,178,.4); }
          50%      { text-shadow: 0 0 12px rgba(255,255,255,1), 0 0 24px rgba(255,224,178,.85); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cp-topbar .cp-topbar__glow { animation: none; }
        }
      `}</style>
      <span className="cp-topbar__glow">
        <GraduationCap size={14} strokeWidth={2.4} />
        Built by <strong style={{ fontWeight: 800 }}>IITians</strong>
      </span>
      <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,.7)", flexShrink: 0 }} />
      <span className="cp-topbar__glow">
        <BadgeCheck size={14} strokeWidth={2.4} />
        Trusted by <strong style={{ fontWeight: 800 }}>Aspirants</strong>
      </span>
    </div>
  );
}
