/* BackButton — a small, consistent "Back" pill used across tool pages.
   Goes back in history when possible, otherwise falls back to `to` (default home). */
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ to = "/", label = "Back", style }) {
  const nav = useNavigate();
  const go = () => { if (window.history.length > 1) nav(-1); else nav(to); };
  return (
    <button
      onClick={go}
      aria-label={label}
      className="cp-back-btn"
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "#fff", color: "#211D2E",
        border: "1px solid rgba(33,29,46,.10)", borderRadius: 50,
        padding: "9px 18px", fontFamily: "'Space Grotesk','Sora',sans-serif",
        fontWeight: 700, fontSize: 13.5, cursor: "pointer",
        boxShadow: "0 6px 18px rgba(33,29,46,.07)",
        transition: "background .18s, border-color .18s, transform .18s",
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#FCE7E0"; e.currentTarget.style.borderColor = "rgba(241,90,56,.4)"; e.currentTarget.style.transform = "translateX(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "rgba(33,29,46,.10)"; e.currentTarget.style.transform = ""; }}
    >
      <ArrowLeft size={16} /> {label}
    </button>
  );
}
