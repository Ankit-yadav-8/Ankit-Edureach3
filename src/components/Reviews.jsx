import { useState, useEffect, useMemo } from "react";
import { Star, MessageSquarePlus, Send } from "lucide-react";
import { defaultReviews } from "../data/reviews.js";

const keyFor = (slug) => `edureach:reviews:${slug}`;
const readUser = (slug) => { try { return JSON.parse(localStorage.getItem(keyFor(slug))) || []; } catch { return []; } };

function Stars({ value, onChange, size = 18 }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={onChange ? () => onChange(n) : undefined} disabled={!onChange}
          style={{ cursor: onChange ? "pointer" : "default", lineHeight: 0 }} aria-label={`${n} stars`}>
          <Star size={size} fill={n <= value ? "#F4A261" : "none"} color={n <= value ? "#F4A261" : "var(--line)"} />
        </button>
      ))}
    </span>
  );
}

export default function Reviews({ slug }) {
  const [userReviews, setUserReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 5, text: "" });

  useEffect(() => { setUserReviews(readUser(slug)); }, [slug]);

  const all = useMemo(() => [...userReviews, ...defaultReviews()], [userReviews]);
  const avg = useMemo(() => (all.reduce((s, r) => s + r.rating, 0) / all.length).toFixed(1), [all]);

  const submit = () => {
    if (!form.name.trim() || !form.text.trim()) return;
    const review = { ...form, year: String(new Date().getFullYear()), tags: [], mine: true };
    const next = [review, ...userReviews];
    setUserReviews(next);
    try { localStorage.setItem(keyFor(slug), JSON.stringify(next)); } catch {}
    setForm({ name: "", rating: 5, text: "" });
    setOpen(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "2rem", color: "var(--navy)", lineHeight: 1 }}>{avg}</div>
            <Stars value={Math.round(avg)} />
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{all.length} reviews</div>
          </div>
        </div>
        <button className="btn btn-coral" onClick={() => setOpen((o) => !o)}><MessageSquarePlus size={16} /> Write a review</button>
      </div>

      {open && (
        <div className="card" style={{ marginBottom: 16, background: "var(--sky)" }}>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="field"><label>Your name</label><input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Aarav S." /></div>
            <div className="field"><label>Rating</label><div style={{ marginTop: 6 }}><Stars value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} size={24} /></div></div>
          </div>
          <div className="field" style={{ marginTop: 8 }}>
            <label>Your review</label>
            <textarea className="input" rows={3} value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} placeholder="Share your honest experience…" style={{ resize: "vertical", fontFamily: "DM Sans" }} />
          </div>
          <button className="btn btn-coral" style={{ marginTop: 8 }} onClick={submit}><Send size={15} /> Post review</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {all.map((r, i) => (
          <div key={i} className="card" style={{ borderLeft: r.mine ? "3px solid var(--coral)" : "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <strong style={{ color: "var(--navy)" }}>{r.name} {r.mine && <span className="badge teal" style={{ marginLeft: 6 }}>You</span>}</strong>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>{r.year}</span>
            </div>
            <Stars value={r.rating} size={15} />
            <p style={{ color: "var(--ink)", lineHeight: 1.6, marginTop: 8, fontSize: 14.5 }}>{r.text}</p>
            {r.tags?.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                {r.tags.map((t) => <span key={t} className="pill" style={{ fontSize: 11, background: "var(--sky)", border: "1px solid var(--line)" }}>{t}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 12 }}>Reviews you post are saved in your browser (demo). Connect a backend to share reviews across all users.</p>
    </div>
  );
}
