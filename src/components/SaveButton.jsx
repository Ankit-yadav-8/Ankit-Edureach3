import { Heart, GitCompare, Check } from "lucide-react";
import { useShortlist } from "../context/Shortlist.jsx";

/* Heart button — saves a college to "My Colleges". */
export function SaveButton({ slug, size = 18, label = false }) {
  const { isSaved, toggleSaved } = useShortlist();
  const active = isSaved(slug);
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSaved(slug); }}
      aria-label={active ? "Remove from shortlist" : "Save to shortlist"}
      title={active ? "Saved — click to remove" : "Save to My Colleges"}
      className="icon-btn"
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: active ? "var(--coral)" : "#fff",
        color: active ? "#fff" : "var(--coral)",
        border: `1.5px solid var(--coral)`, borderRadius: 999,
        padding: label ? "7px 14px" : 8, fontWeight: 600, fontSize: 13,
      }}
    >
      <Heart size={size} fill={active ? "#fff" : "none"} />
      {label && (active ? "Saved" : "Save")}
    </button>
  );
}

/* Compare toggle — adds a college to the compare tray (max 3). */
export function CompareButton({ slug, label = true }) {
  const { inCompare, toggleCompare, compare, MAX_COMPARE } = useShortlist();
  const active = inCompare(slug);
  const full = compare.length >= MAX_COMPARE && !active;
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!full) toggleCompare(slug); }}
      disabled={full}
      title={full ? `You can compare up to ${MAX_COMPARE} colleges` : active ? "Added to compare" : "Add to compare"}
      className="icon-btn"
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: active ? "var(--teal)" : "#fff",
        color: active ? "#fff" : full ? "var(--muted)" : "var(--navy)",
        border: `1.5px solid ${active ? "var(--teal)" : "var(--line)"}`,
        borderRadius: 999, padding: label ? "7px 14px" : 8, fontWeight: 600, fontSize: 13,
        cursor: full ? "not-allowed" : "pointer", opacity: full ? 0.6 : 1,
      }}
    >
      {active ? <Check size={16} /> : <GitCompare size={16} />}
      {label && (active ? "Comparing" : "Compare")}
    </button>
  );
}
