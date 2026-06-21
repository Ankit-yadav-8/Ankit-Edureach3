/* BackButton — a small, consistent "Back" pill used across tool pages.
   Goes back in history when possible, otherwise falls back to `to` (default home). */
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ to = "/", label = "Back", style }) {
  const nav = useNavigate();
  const go = () => { if (window.history.length > 1) nav(-1); else nav(to); };
  return (
    <button onClick={go} aria-label={label} className="cp-back-btn" style={style}>
      <ArrowLeft size={16} /> {label}
    </button>
  );
}
