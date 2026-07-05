/* CollegeReviews — home section just below the rank predictor.
   Two paths:
     • "Give a review"  → an animated form (name, college, overall + hostel +
        mess ratings, quick tags, free-text comment). Saved server-side.
     • "See all reviews" → a search-bar-style college picker (most-reviewed
        shown first, search any college) → opens that college's reviews with
        average rating, hostel/mess breakdown, tags and comments.
   Reviews are stored server-side, so every visitor sees the same reviews. */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, PenSquare, Search, ArrowLeft, Home as HomeIcon, Utensils, Send,
  CheckCircle2, MessageSquareQuote, ChevronRight, Building2, Quote, Loader2,
} from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";
import { reviewOverall, HOSTEL_TAGS, MESS_TAGS } from "../../utils/reviews.js";
import { useAuth } from "../../auth/AuthContext.jsx";
import { apiReviewColleges, apiReviewsForCollege, apiCreateReview } from "../../auth/api.js";

/* ── Stars ─────────────────────────────────────────────────────── */
function StarInput({ value, onChange, size = 24 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "inline-flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const on = (hover || value) >= n;
        return (
          <button key={n} type="button" aria-label={`${n} star`}
            onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => onChange(n)}
            style={{ background: "none", border: "none", padding: 2, cursor: "pointer", lineHeight: 0 }}>
            <motion.span whileTap={{ scale: 0.8 }} style={{ display: "inline-block" }}>
              <Star size={size} color={on ? "#f59e0b" : "#d6d3cd"} fill={on ? "#f59e0b" : "none"} />
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}

function StarRow({ value, size = 15 }) {
  const full = Math.round(value);
  return (
    <span style={{ display: "inline-flex", gap: 2, verticalAlign: "middle" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} color={n <= full ? "#f59e0b" : "#d8d4cf"} fill={n <= full ? "#f59e0b" : "none"} />
      ))}
    </span>
  );
}

function TagPicker({ options, selected, onToggle, accent }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {options.map((t) => {
        const on = selected.includes(t);
        return (
          <button key={t} type="button" onClick={() => onToggle(t)}
            style={{
              fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 50, cursor: "pointer",
              border: `1.5px solid ${on ? accent : CL.cream3}`,
              background: on ? `${accent}14` : "#fff", color: on ? accent : CL.body, transition: "all .15s",
            }}>
            {t}
          </button>
        );
      })}
    </div>
  );
}

/* ── One review block (hostel / mess) inside the form ──────────── */
function FormBlock({ icon: Icon, title, accent, rating, setRating, tags, allTags, toggleTag, text, setText, placeholder }) {
  return (
    <div style={{ background: CL.cream2, border: `1px solid ${CL.line}`, borderRadius: 14, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, background: `${accent}16`, display: "grid", placeItems: "center" }}>
            <Icon size={16} color={accent} />
          </span>
          <span style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 14, color: CL.ink }}>{title}</span>
        </div>
        <StarInput value={rating} onChange={setRating} size={20} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <TagPicker options={allTags} selected={tags} onToggle={toggleTag} accent={accent} />
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} rows={2}
        style={taStyle} onFocus={(e) => (e.target.style.borderColor = accent)} onBlur={(e) => (e.target.style.borderColor = CL.cream3)} />
    </div>
  );
}

/* ── GIVE A REVIEW ─────────────────────────────────────────────── */
function GiveForm({ token, colleges, presetCollege, onBack, onSubmitted }) {
  const [name, setName] = useState("");
  const [college, setCollege] = useState(presetCollege || "");
  const [overall, setOverall] = useState(0);
  const [comment, setComment] = useState("");
  const [hRating, setHRating] = useState(0);
  const [hTags, setHTags] = useState([]);
  const [hText, setHText] = useState("");
  const [mRating, setMRating] = useState(0);
  const [mTags, setMTags] = useState([]);
  const [mText, setMText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  const toggle = (list, set) => (t) => set(list.includes(t) ? list.filter((x) => x !== t) : [...list, t]);
  const canSubmit = name.trim() && college.trim() && (overall || hRating || mRating) && !busy;

  const submit = async () => {
    if (!canSubmit) return;
    setBusy(true); setErr("");
    try {
      await apiCreateReview(token, {
        name: name.trim(), college: college.trim(), overall,
        comment: comment.trim(),
        hostel: { rating: hRating, tags: hTags, text: hText.trim() },
        mess: { rating: mRating, tags: mTags, text: mText.trim() },
      });
      setDone(true);
      setTimeout(() => onSubmitted(college.trim()), 1400);
    } catch (e) {
      setErr(e?.message || "Could not submit your review. Please try again.");
      setBusy(false);
    }
  };

  if (done) {
    return (
      <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
        style={{ ...panel, textAlign: "center", padding: "48px 28px" }}>
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 16 }}
          style={{ width: 66, height: 66, borderRadius: "50%", background: CL.greenSoft, display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
          <CheckCircle2 size={34} color={CL.green} />
        </motion.div>
        <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.4rem", color: CL.ink, margin: "0 0 6px" }}>Thanks for the review!</h3>
        <p style={{ color: CL.body, fontSize: 14 }}>Opening {college}’s reviews…</p>
      </motion.div>
    );
  }

  return (
    <motion.div key="give" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}
      style={panel}>
      <button onClick={onBack} className="cp-back-btn" style={{ marginBottom: 18 }}><ArrowLeft size={16} /> Back</button>
      <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.5rem", color: CL.ink, margin: "0 0 18px" }}>Write a college review</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <label style={labelCol}>
          <span style={labelTxt}>Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ankit" style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = CL.coral)} onBlur={(e) => (e.target.style.borderColor = CL.cream3)} />
        </label>
        <label style={labelCol}>
          <span style={labelTxt}>College</span>
          <input list="cp-review-college-list" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="Search your college…" style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = CL.coral)} onBlur={(e) => (e.target.style.borderColor = CL.cream3)} />
          <datalist id="cp-review-college-list">{colleges.map((c) => <option key={c} value={c} />)}</datalist>
        </label>
      </div>

      <div style={{ background: CL.coralSoft, border: `1px solid ${CL.coral}26`, borderRadius: 14, padding: "14px 16px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 14.5, color: CL.ink }}>Overall rating</span>
        <StarInput value={overall} onChange={setOverall} />
      </div>

      <div style={{ display: "grid", gap: 14, marginBottom: 14 }}>
        <FormBlock icon={HomeIcon} title="Hostel" accent={CL.coral}
          rating={hRating} setRating={setHRating} tags={hTags} allTags={HOSTEL_TAGS} toggleTag={toggle(hTags, setHTags)}
          text={hText} setText={setHText} placeholder="Rooms, warden, Wi-Fi, cleanliness…" />
        <FormBlock icon={Utensils} title="Mess" accent={CL.green}
          rating={mRating} setRating={setMRating} tags={mTags} allTags={MESS_TAGS} toggleTag={toggle(mTags, setMTags)}
          text={mText} setText={setMText} placeholder="Taste, hygiene, variety, timings…" />
      </div>

      <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Anything else about campus life, faculty, location…"
        style={{ ...taStyle, marginBottom: 14 }} onFocus={(e) => (e.target.style.borderColor = CL.coral)} onBlur={(e) => (e.target.style.borderColor = CL.cream3)} />

      {err && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "10px 12px", borderRadius: 10, fontSize: 13, marginBottom: 12, fontWeight: 600 }}>{err}</div>}

      <button onClick={submit} disabled={!canSubmit}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%",
          padding: "14px", borderRadius: 12, border: "none",
          background: canSubmit ? `linear-gradient(135deg, ${CL.coral}, ${CL.coralDk})` : CL.cream3,
          color: canSubmit ? "#fff" : CL.muted, fontFamily: CL.display, fontWeight: 800, fontSize: 15,
          cursor: canSubmit ? "pointer" : "not-allowed", boxShadow: canSubmit ? `0 12px 26px -12px ${CL.coral}` : "none",
        }}>
        {busy ? <><Loader2 size={16} className="cp-spin" /> Submitting…</> : <><Send size={16} /> Submit review</>}
      </button>
    </motion.div>
  );
}

/* ── A single review card ──────────────────────────────────────── */
function ReviewCard({ r, i }) {
  const initials = (r.name || "A").trim().charAt(0).toUpperCase();
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.04 }}
      style={{ background: "var(--page-bg)", border: `1px solid ${CL.line}`, borderRadius: 16, padding: "16px 18px", boxShadow: CL.shadow }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
        <span style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${CL.coral}, ${CL.coralDk})`, color: "#fff", display: "grid", placeItems: "center", fontFamily: CL.display, fontWeight: 800, flexShrink: 0 }}>{initials}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 14.5, color: CL.ink }}>{r.name || "Anonymous"}</div>
          <div style={{ fontSize: 11.5, color: CL.muted }}>{r.at ? new Date(r.at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : ""}</div>
        </div>
        <StarRow value={reviewOverall(r)} size={16} />
      </div>

      {r.comment && (
        <div style={{ display: "flex", gap: 8, color: CL.ink2, fontSize: 13.5, lineHeight: 1.6, marginBottom: 12 }}>
          <Quote size={15} color={CL.coral} style={{ flexShrink: 0, marginTop: 2 }} /> {r.comment}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
        {[{ k: "hostel", label: "Hostel", icon: HomeIcon, accent: CL.coral, soft: CL.coralSoft }, { k: "mess", label: "Mess", icon: Utensils, accent: CL.green, soft: CL.greenSoft }].map(({ k, label, icon: Icon, accent, soft }) => {
          const d = r[k]; if (!d || (!d.rating && !d.text && !(d.tags || []).length)) return null;
          return (
            <div key={k} style={{ background: soft, borderRadius: 12, padding: "10px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 800, fontSize: 12.5, color: accent }}><Icon size={14} /> {label}</span>
                {d.rating ? <StarRow value={d.rating} size={12} /> : null}
              </div>
              {(d.tags || []).length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: d.text ? 6 : 0 }}>
                  {d.tags.map((t) => <span key={t} style={{ fontSize: 10.5, fontWeight: 600, color: accent, background: "var(--page-bg)", border: `1px solid ${accent}33`, borderRadius: 50, padding: "2px 8px" }}>{t}</span>)}
                </div>
              )}
              {d.text && <div style={{ fontSize: 12.5, color: CL.ink2, lineHeight: 1.5 }}>{d.text}</div>}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ── SEE REVIEWS — search + per-college list (server-backed) ───── */
function Browse({ colleges, summary, initialCollege, onBack, onGiveFor }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(initialCollege || null);
  const [data, setData] = useState(null);     // { reviews, count, avg }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selected) { setData(null); return; }
    let alive = true;
    setLoading(true);
    apiReviewsForCollege(selected)
      .then((d) => { if (alive) setData(d); })
      .catch(() => { if (alive) setData({ reviews: [], count: 0, avg: 0 }); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [selected]);

  const summaryMap = new Map(summary.map((s) => [s.college, s]));
  const countFor = (name) => summaryMap.get(name)?.count || 0;

  if (selected) {
    const list = data?.reviews || [];
    const overallAvg = data?.avg || 0;
    return (
      <motion.div key="college" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} style={panel}>
        <button onClick={() => setSelected(null)} className="cp-back-btn" style={{ marginBottom: 18 }}><ArrowLeft size={16} /> All colleges</button>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
          <span style={{ width: 50, height: 50, borderRadius: 14, background: CL.coralSoft, display: "grid", placeItems: "center", flexShrink: 0 }}><Building2 size={24} color={CL.coral} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.35rem", color: CL.ink, margin: 0 }}>{selected}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <StarRow value={overallAvg} size={16} />
              <span style={{ fontWeight: 800, color: CL.ink, fontSize: 14 }}>{overallAvg ? overallAvg.toFixed(1) : "—"}</span>
              <span style={{ color: CL.muted, fontSize: 13 }}>· {list.length} review{list.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
          <button onClick={() => onGiveFor(selected)} style={ctaSm}><PenSquare size={15} /> Add yours</button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: CL.muted, padding: "30px 10px" }}><Loader2 size={22} className="cp-spin" /> Loading reviews…</div>
        ) : list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 16px" }}>
            <div style={{ color: CL.body, fontSize: 14, marginBottom: 14 }}>No reviews yet for {selected}. Be the first!</div>
            <button onClick={() => onGiveFor(selected)} style={ctaSm}><PenSquare size={15} /> Write the first review</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {list.map((r, i) => <ReviewCard key={r.id || i} r={r} i={i} />)}
          </div>
        )}
      </motion.div>
    );
  }

  // college picker (search-bar style)
  const q = query.trim().toLowerCase();
  const results = q ? colleges.filter((c) => c.toLowerCase().includes(q)).slice(0, 40) : summary.map((s) => s.college);

  return (
    <motion.div key="see" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} style={panel}>
      <button onClick={onBack} className="cp-back-btn" style={{ marginBottom: 18 }}><ArrowLeft size={16} /> Back</button>
      <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.5rem", color: CL.ink, margin: "0 0 6px" }}>Browse college reviews</h3>
      <p style={{ color: CL.body, fontSize: 14, margin: "0 0 16px" }}>{q ? "Pick a college to read its reviews." : summary.length ? "Most-reviewed colleges — or search any college below." : "No reviews yet. Search a college and be the first to review it."}</p>

      {/* search bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--page-bg)", border: `1.5px solid ${CL.cream3}`, borderRadius: 14, padding: "11px 16px", marginBottom: 14, boxShadow: CL.shadow }}>
        <Search size={18} color={CL.muted} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search any college…"
          style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: CL.ink, background: "transparent", fontFamily: "DM Sans" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 360, overflowY: "auto" }}>
        {results.length === 0 && (
          <div style={{ textAlign: "center", color: CL.muted, padding: "26px 10px", fontSize: 14 }}>
            {q ? `No colleges match “${query}”.` : "Search a college above to add the first review."}
          </div>
        )}
        {results.map((name) => {
          const c = countFor(name);
          return (
            <button key={name} onClick={() => setSelected(name)}
              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", background: CL.cream2, border: `1px solid ${CL.line}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", transition: "all .15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${CL.coral}55`; e.currentTarget.style.background = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = CL.line; e.currentTarget.style.background = CL.cream2; }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: CL.coralSoft, display: "grid", placeItems: "center", flexShrink: 0 }}><Building2 size={18} color={CL.coral} /></span>
              <span style={{ flex: 1, minWidth: 0, fontFamily: CL.display, fontWeight: 700, fontSize: 14, color: CL.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
              {c > 0 && <span style={{ fontSize: 11.5, fontWeight: 700, color: CL.coralDk, background: CL.coralSoft, borderRadius: 50, padding: "3px 10px", flexShrink: 0 }}>{c} review{c !== 1 ? "s" : ""}</span>}
              <ChevronRight size={18} color={CL.muted} style={{ flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ── SECTION ───────────────────────────────────────────────────── */
export default function CollegeReviews() {
  const { token } = useAuth();
  const [view, setView] = useState("home");      // home | give | see
  const [colleges, setColleges] = useState([]);  // full searchable list (lazy)
  const [summary, setSummary] = useState([]);    // [{ college, count, avg }]
  const [preset, setPreset] = useState("");
  const loadedRef = useRef(false);

  const refreshSummary = () => apiReviewColleges().then((d) => setSummary(d.colleges || [])).catch(() => {});
  useEffect(() => { refreshSummary(); }, []);

  // lazily pull the (large) college list the first time the user leaves the chooser
  useEffect(() => {
    if (view === "home" || loadedRef.current) return;
    loadedRef.current = true;
    import("../../data/colleges.js")
      .then((m) => setColleges([...new Set((m.COLLEGES || []).map((c) => c.name))].sort()))
      .catch(() => setColleges([]));
  }, [view]);

  const totalReviews = summary.reduce((a, c) => a + (c.count || 0), 0);
  const totalColleges = summary.length;
  const openGiveFor = (name) => { setPreset(name); setView("give"); };
  const afterSubmit = (name) => { refreshSummary(); setPreset(name); setView("see"); };

  return (
    <section id="college-reviews" style={{ background: CL.cream, padding: "84px 0" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 36px" }}>
          <span style={clEyebrow}><MessageSquareQuote size={13} /> Campus Reviews</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.2vw,2.8rem)", color: CL.ink, letterSpacing: "-1.2px", margin: "16px 0 12px", lineHeight: 1.1 }}>
            Real <span style={{ color: CL.coral }}>hostel &amp; mess</span> reviews
          </h2>
          <p style={{ color: CL.body, fontSize: "1.04rem", lineHeight: 1.7 }}>
            Honest, student-written reviews of campus life. Share yours, or read what students say about any college.
          </p>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <AnimatePresence mode="wait">
            {view === "home" && (
              <motion.div key="home" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
                <OptionCard icon={PenSquare} accent={CL.coral} soft={CL.coralSoft} title="Give a college review"
                  desc="Rate the hostel & mess, add quick tags and a comment. Takes a minute." cta="Write a review" onClick={() => { setPreset(""); setView("give"); }} />
                <OptionCard icon={Star} accent={CL.green} soft={CL.greenSoft} title="See all college reviews"
                  desc={totalReviews ? `${totalReviews} review${totalReviews !== 1 ? "s" : ""} across ${totalColleges} college${totalColleges !== 1 ? "s" : ""}. Search and read.` : "Search any college and read student reviews."}
                  cta="Browse reviews" onClick={() => setView("see")} />
              </motion.div>
            )}
            {view === "give" && <GiveForm key="give" token={token} colleges={colleges} presetCollege={preset} onBack={() => setView("home")} onSubmitted={afterSubmit} />}
            {view === "see" && <Browse key="see" colleges={colleges} summary={summary} initialCollege={preset} onBack={() => { setPreset(""); setView("home"); }} onGiveFor={openGiveFor} />}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function OptionCard({ icon: Icon, accent, soft, title, desc, cta, onClick }) {
  return (
    <motion.button onClick={onClick} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
      style={{ textAlign: "left", cursor: "pointer", background: "var(--page-bg)", border: `1px solid ${CL.line}`, borderRadius: 20, padding: "26px 24px", boxShadow: CL.shadow, display: "flex", flexDirection: "column", gap: 12, position: "relative", overflow: "hidden" }}>
      <span aria-hidden style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: soft, borderBottomLeftRadius: 100, opacity: 0.6, pointerEvents: "none" }} />
      <span style={{ width: 54, height: 54, borderRadius: 16, background: soft, display: "grid", placeItems: "center", position: "relative" }}><Icon size={26} color={accent} /></span>
      <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.25rem", color: CL.ink, position: "relative" }}>{title}</div>
      <div style={{ color: CL.body, fontSize: 13.5, lineHeight: 1.55, flex: 1, position: "relative" }}>{desc}</div>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: CL.display, fontWeight: 800, fontSize: 14, color: accent, position: "relative" }}>{cta} <ChevronRight size={17} /></span>
    </motion.button>
  );
}

const panel = { background: "var(--page-bg)", border: `1px solid ${CL.line}`, borderRadius: 22, boxShadow: CL.shadowLg, padding: "26px 26px 28px" };
const labelCol = { display: "flex", flexDirection: "column", gap: 5, minWidth: 0 };
const labelTxt = { fontSize: 12, fontWeight: 700, color: CL.body };
const inputStyle = { width: "100%", padding: "11px 13px", borderRadius: 11, border: `1.5px solid ${CL.cream3}`, fontSize: 14, color: CL.ink, outline: "none", boxSizing: "border-box", fontFamily: "DM Sans" };
const taStyle = { width: "100%", resize: "vertical", borderRadius: 11, border: `1.5px solid ${CL.cream3}`, padding: "10px 12px", fontSize: 13.5, fontFamily: "DM Sans", color: CL.ink, outline: "none", boxSizing: "border-box" };
const ctaSm = { display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 16px", borderRadius: 11, border: "none", background: `linear-gradient(135deg, ${CL.coral}, ${CL.coralDk})`, color: "#fff", fontFamily: CL.display, fontWeight: 800, fontSize: 13.5, cursor: "pointer", flexShrink: 0 };
