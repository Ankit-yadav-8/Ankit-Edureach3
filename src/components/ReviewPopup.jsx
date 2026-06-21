/* ReviewPopup — a friendly hostel & mess review prompt that slides in
   after the visitor has spent ~2 minutes on the site. Collects their name,
   the college (searchable list of every college we track), and a star
   rating + quick tags + free text for both the hostel and the mess.
   Shows once per browser (until submitted or dismissed) and stores the
   review locally. Mounted globally from App.jsx. */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Home, Utensils, Send, CheckCircle2, Loader2 } from "lucide-react";
import { HOSTEL_TAGS, MESS_TAGS } from "../utils/reviews.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { apiCreateReview } from "../auth/api.js";

const ORANGE = "#FF693D";
const DELAY_MS = 2 * 60 * 1000;        // 2 minutes
const DONE_KEY = "cp:review:done";     // set once submitted or dismissed

/* Clickable 5-star rating. */
function Stars({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "inline-flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const on = (hover || value) >= n;
        return (
          <button key={n} type="button" aria-label={`${n} star`}
            onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
            style={{ background: "none", border: "none", padding: 2, cursor: "pointer", lineHeight: 0 }}>
            <motion.span whileTap={{ scale: 0.8 }} style={{ display: "inline-block" }}>
              <Star size={24} color={on ? "#f59e0b" : "#d6d3cd"} fill={on ? "#f59e0b" : "none"} />
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}

/* Toggleable quick-tag chips (multi-select). */
function Tags({ options, selected, onToggle, accent }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {options.map((t) => {
        const on = selected.includes(t);
        return (
          <button key={t} type="button" onClick={() => onToggle(t)}
            style={{
              fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 50, cursor: "pointer",
              border: `1.5px solid ${on ? accent : "rgba(33,29,46,.14)"}`,
              background: on ? `${accent}14` : "#fff", color: on ? accent : "#475067",
              transition: "all .15s",
            }}>
            {t}
          </button>
        );
      })}
    </div>
  );
}

/* One review block (hostel or mess) — icon header, stars, tags, textarea. */
function ReviewBlock({ icon: Icon, title, accent, rating, setRating, tags, allTags, toggleTag, text, setText, placeholder }) {
  return (
    <div style={{ background: "#faf9f7", border: "1px solid rgba(33,29,46,.08)", borderRadius: 14, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, background: `${accent}16`, display: "grid", placeItems: "center" }}>
            <Icon size={16} color={accent} />
          </span>
          <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 14, color: "#211D2E" }}>{title}</span>
        </div>
        <Stars value={rating} onChange={setRating} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <Tags options={allTags} selected={tags} onToggle={toggleTag} accent={accent} />
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} rows={2}
        style={{ width: "100%", resize: "vertical", borderRadius: 10, border: "1.5px solid rgba(33,29,46,.12)", padding: "9px 11px", fontSize: 13.5, fontFamily: "DM Sans", color: "#211D2E", outline: "none", boxSizing: "border-box" }}
        onFocus={(e) => { e.target.style.borderColor = accent; }}
        onBlur={(e) => { e.target.style.borderColor = "rgba(33,29,46,.12)"; }} />
    </div>
  );
}

export default function ReviewPopup() {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [hostelRating, setHostelRating] = useState(0);
  const [hostelTags, setHostelTags] = useState([]);
  const [hostelText, setHostelText] = useState("");
  const [messRating, setMessRating] = useState(0);
  const [messTags, setMessTags] = useState([]);
  const [messText, setMessText] = useState("");

  // Arm the 2-minute timer once per browser (unless already submitted/dismissed).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DONE_KEY)) return;
    const t = setTimeout(() => {
      // lazily pull the (large) college list only when the popup is about to show
      import("../data/colleges.js")
        .then((m) => setColleges([...new Set((m.COLLEGES || []).map((c) => c.name))].sort()))
        .catch(() => setColleges([]));
      setOpen(true);
    }, DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const finish = () => { try { localStorage.setItem(DONE_KEY, "1"); } catch { /* ignore */ } };

  const close = () => { finish(); setOpen(false); };

  const toggle = (list, set) => (t) =>
    set(list.includes(t) ? list.filter((x) => x !== t) : [...list, t]);

  const canSubmit = name.trim() && college.trim() && (hostelRating || messRating) && !busy;

  const submit = async () => {
    if (!canSubmit) return;
    setBusy(true); setErr("");
    try {
      await apiCreateReview(token, {
        name: name.trim(), college: college.trim(),
        hostel: { rating: hostelRating, tags: hostelTags, text: hostelText.trim() },
        mess: { rating: messRating, tags: messTags, text: messText.trim() },
      });
      finish();
      setDone(true);
      setTimeout(() => setOpen(false), 1700);
    } catch (e) {
      setErr(e?.message || "Could not submit. Please try again.");
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
          style={{ position: "fixed", inset: 0, zIndex: 3500, background: "rgba(13,27,62,.45)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", display: "grid", placeItems: "end center", padding: 16, overflowY: "auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }} onMouseDown={(e) => e.stopPropagation()}
            style={{ width: "min(520px,100%)", background: "#fff", borderRadius: 22, boxShadow: "0 30px 80px rgba(13,27,62,.4)", overflow: "hidden", margin: "auto 0 8px" }}>

            {done ? (
              <div style={{ padding: "40px 28px", textAlign: "center" }}>
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  style={{ width: 64, height: 64, borderRadius: "50%", background: "#dcfce7", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
                  <CheckCircle2 size={32} color="#15a06e" />
                </motion.div>
                <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.3rem", color: "#211D2E", margin: "0 0 6px" }}>Thank you!</h3>
                <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Your review helps future students pick the right campus.</p>
              </div>
            ) : (
              <>
                {/* header */}
                <div style={{ background: `linear-gradient(135deg, ${ORANGE}, #E0421F)`, color: "#fff", padding: "20px 24px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -30, right: -10, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,.14)" }} />
                  <button onClick={close} aria-label="Close"
                    style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.2)", color: "#fff", cursor: "pointer", display: "grid", placeItems: "center" }}>
                    <X size={16} />
                  </button>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.25rem", margin: 0, position: "relative" }}>Rate your hostel & mess</h3>
                  <div style={{ fontSize: 12.5, opacity: .9, marginTop: 3, position: "relative" }}>2 minutes of your time helps the next batch choose well 🙌</div>
                </div>

                {/* body */}
                <div style={{ padding: "18px 22px 22px", display: "flex", flexDirection: "column", gap: 14, maxHeight: "62vh", overflowY: "auto" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#6b7280" }}>Your name</span>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ankit"
                        style={inputStyle} onFocus={(e) => e.target.style.borderColor = ORANGE} onBlur={(e) => e.target.style.borderColor = "rgba(33,29,46,.12)"} />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#6b7280" }}>College</span>
                      <input list="cp-college-list" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="Search your college…"
                        style={inputStyle} onFocus={(e) => e.target.style.borderColor = ORANGE} onBlur={(e) => e.target.style.borderColor = "rgba(33,29,46,.12)"} />
                      <datalist id="cp-college-list">
                        {colleges.map((c) => <option key={c} value={c} />)}
                      </datalist>
                    </label>
                  </div>

                  <ReviewBlock icon={Home} title="Hostel" accent={ORANGE}
                    rating={hostelRating} setRating={setHostelRating}
                    tags={hostelTags} allTags={HOSTEL_TAGS} toggleTag={toggle(hostelTags, setHostelTags)}
                    text={hostelText} setText={setHostelText} placeholder="Rooms, warden, Wi-Fi, cleanliness…" />

                  <ReviewBlock icon={Utensils} title="Mess" accent="#15a06e"
                    rating={messRating} setRating={setMessRating}
                    tags={messTags} allTags={MESS_TAGS} toggleTag={toggle(messTags, setMessTags)}
                    text={messText} setText={setMessText} placeholder="Taste, hygiene, variety, timings…" />

                  {err && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "9px 11px", borderRadius: 10, fontSize: 12.5, fontWeight: 600 }}>{err}</div>}

                  <button onClick={submit} disabled={!canSubmit}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      padding: "13px", borderRadius: 12, border: "none", marginTop: 2,
                      background: canSubmit ? `linear-gradient(135deg, ${ORANGE}, #E0421F)` : "#e5e7eb",
                      color: canSubmit ? "#fff" : "#9ca3af", fontFamily: "Sora", fontWeight: 800, fontSize: 14.5,
                      cursor: canSubmit ? "pointer" : "not-allowed",
                      boxShadow: canSubmit ? `0 12px 26px -12px ${ORANGE}` : "none",
                    }}>
                    {busy ? <><Loader2 size={16} className="cp-spin" /> Submitting…</> : <><Send size={16} /> Submit review</>}
                  </button>
                  <div style={{ fontSize: 11.5, color: "#9ca3af", textAlign: "center" }}>Shared with other students · helps them choose</div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 10,
  border: "1.5px solid rgba(33,29,46,.12)", fontSize: 14, color: "#211D2E",
  outline: "none", boxSizing: "border-box", fontFamily: "DM Sans",
};
