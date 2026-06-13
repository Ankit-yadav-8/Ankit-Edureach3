import { useState, useRef, useEffect } from "react";
import Seo from "../components/Seo.jsx";
import { useNavigate } from "react-router-dom";
import { Reorder } from "framer-motion";
import { Sparkles, MapPin, Trophy, ArrowRight, Wand2, Loader2, Award, GraduationCap, Download, Plus, Check, X, GripVertical, ListOrdered, Trash2 } from "lucide-react";
import { COLLEGE_BY_SLUG, CATEGORIES } from "../data/colleges.js";
import { TIER_COLOR } from "../utils/collegePredictor.js";
import { useCollegePredictor } from "../hooks/useCollegePredictor.js";
import { useShortlist } from "../context/Shortlist.jsx";
import { SaveButton, CompareButton } from "../components/SaveButton.jsx";
import { fmtINR, fmtRank } from "../utils/format.js";
import Reveal from "../components/Reveal.jsx";

const GROUP_META = {
  IIT:  { label: "IITs",  emoji: "🏆", color: "#e05a2b" },
  NIT:  { label: "NITs",  emoji: "🎓", color: "#2563eb" },
  IIIT: { label: "IIITs", emoji: "💡", color: "#7c3aed" },
  GFTI: { label: "GFTIs", emoji: "🏛️", color: "#059669" },
};

const GROUP_ORDER = ["IIT", "NIT", "IIIT", "GFTI"];

// Exam profiles drive which institute types we predict and how many we show.
const EXAM_PROFILES = {
  advanced: {
    key: "advanced",
    title: "JEE Advanced",
    sub: "IIT admissions",
    icon: Trophy,
    color: "#e05a2b",
    gradient: "linear-gradient(135deg,#F47B20 0%,#e05a2b 100%)",
    types: ["IIT"],
    rankLabel: "Your JEE Advanced rank (CRL / category)",
    note: "Showing every IIT branch you're eligible for with your JEE Advanced rank.",
    placeholder: "e.g. 4200",
  },
  main: {
    key: "main",
    title: "JEE Main",
    sub: "NIT + IIIT + GFTI admissions",
    icon: Award,
    color: "#2563eb",
    gradient: "linear-gradient(135deg,#3b82f6 0%,#7c3aed 100%)",
    types: ["NIT", "IIIT", "GFTI"],
    rankLabel: "Your JEE Main rank (CRL / category)",
    note: "Showing every NIT, IIIT & GFTI branch you're eligible for with your JEE Main rank.",
    placeholder: "e.g. 18500",
  },
};

const LOADING_TIPS = [
  "Scanning 1,000+ college-branch combinations…",
  "Matching your rank against 2025 JoSAA cutoffs…",
  "Calculating fit scores across all rounds…",
  "Almost there — ranking results by NIRF & branch value…",
];

export default function ForYou() {
  const { saved } = useShortlist();
  const nav = useNavigate();

  const [exam, setExam]         = useState("advanced");
  const [rank, setRank]         = useState("");
  const [category, setCategory] = useState("OPEN");
  const [tipIdx, setTipIdx]     = useState(0);
  const tipTimer = useRef(null);

  // ── User-built ordered choice list (persisted across visits) ──
  const [myList, setMyList] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cp_my_choice_list") || "[]"); }
    catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem("cp_my_choice_list", JSON.stringify(myList)); } catch { /* ignore quota */ }
  }, [myList]);

  const idOf       = (m) => `${m.slug}-${m.branchCode}`;
  const inList     = (m) => myList.some((x) => x._id === idOf(m));
  const addToList  = (m) => setMyList((l) => (l.some((x) => x._id === idOf(m)) ? l : [...l, { ...m, _id: idOf(m) }]));
  const removeFrom = (id) => setMyList((l) => l.filter((x) => x._id !== id));
  const clearList  = () => setMyList([]);

  const downloadMyList = () => {
    if (!myList.length) return;
    const head =
      `College Parichay — My Choice List (my preference order)\n` +
      `Rank: ${rank || "-"}   Category: ${category}\n` +
      `Total choices: ${myList.length}\n` +
      `Generated on ${new Date().toLocaleDateString("en-IN")}\n` +
      `${"=".repeat(52)}\n\n`;
    const body = myList
      .map((o, i) => {
        const c = COLLEGE_BY_SLUG[o.slug];
        const name = c?.short || o.college;
        return `${String(i + 1).padStart(2, " ")}. ${name} — ${o.branch}\n` +
               `     Closing ${fmtRank(o.closing)}  |  Avg ${fmtINR(o.avgPackage)}  |  ${o.tier}`;
      })
      .join("\n\n");
    const blob = new Blob([head + body + "\n\n(Order them in JoSAA exactly as above. Verify on josaa.nic.in)"], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-choice-list.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const { predict, reset, results: grouped, loading, error } = useCollegePredictor();

  const profile    = EXAM_PROFILES[exam];
  const hasResults = grouped && GROUP_ORDER.some((g) => grouped[g]?.length > 0);
  const savedCols  = saved.map((s) => COLLEGE_BY_SLUG[s]).filter(Boolean);

  function switchExam(key) {
    if (key === exam) return;
    setExam(key);
    reset();
  }

  function handlePredict() {
    if (!rank || Number(rank) <= 0) return;

    // Rotate loading tips every 1.5s
    setTipIdx(0);
    if (tipTimer.current) clearInterval(tipTimer.current);
    tipTimer.current = setInterval(() => {
      setTipIdx((i) => (i + 1) % LOADING_TIPS.length);
    }, 1500);

    predict({
      rank: Number(rank),
      category,
      types: profile.types,
      limit: Infinity,      // no per-group cap — show every eligible option
      allBranches: true,    // include every eligible branch of each college
    }, true);
  }

  // Clear tip timer when done
  if (!loading && tipTimer.current) {
    clearInterval(tipTimer.current);
    tipTimer.current = null;
  }

  function downloadList() {
    if (!hasResults) return;
    const head =
      `College Parichay — Colleges For You\n` +
      `Exam: ${profile.title} (${profile.sub})\n` +
      `Rank: ${rank || "-"}   Category: ${category}\n` +
      `Generated on ${new Date().toLocaleDateString("en-IN")}\n` +
      `${"=".repeat(52)}\n`;

    const sections = GROUP_ORDER.map((groupKey) => {
      const picks = grouped[groupKey];
      if (!picks?.length) return null;
      const meta = GROUP_META[groupKey];
      const lines = picks.map((m, i) => {
        const c = COLLEGE_BY_SLUG[m.slug];
        const name = c?.short || m.college;
        return `${String(i + 1).padStart(2, " ")}. ${name} — ${m.branch}\n` +
               `     Closing ${fmtRank(m.closing)}  |  Avg ${fmtINR(m.avgPackage)}  |  ${m.tier}`;
      }).join("\n");
      return `\n${meta.label} (${picks.length})\n${"-".repeat(52)}\n${lines}\n`;
    }).filter(Boolean).join("\n");

    const blob = new Blob(
      [head + sections + "\n(Illustrative — based on 2025 JoSAA cutoffs. Verify on josaa.nic.in)"],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `colleges-for-you-${profile.key}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <Seo
        title="College For You — Personalised IIT NIT IIIT Shortlist by JEE Rank"
        description="Get a personalised list of IITs, NITs and IIITs you can get with your JEE rank, category, home state and branch preference. Free college shortlist tool based on JoSAA cutoffs."
        path="/for-you"
      />
      {/* ── Hero ── */}
      <section className="warm-page-header" style={{ padding: "48px 0", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 65% at 100% 20%, rgba(249,115,22,.22) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 45% 55% at 0% 90%, rgba(124,58,237,.12) 0%, transparent 60%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Sparkles size={13} /> Personalized
          </span>
          <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem,4.5vw,2.7rem)", margin: "10px 0 6px", display: "flex", alignItems: "center", gap: 12, color: "#1c1c28" }}>
            <span style={{ display: "grid", placeItems: "center", width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#F47B20,#e05a2b)", boxShadow: "0 8px 22px -8px rgba(244,123,32,.7)" }}>
              <Wand2 size={24} color="#fff" />
            </span>
            Colleges for you
          </h1>
          <p style={{ color: "rgba(28,28,40,.62)", maxWidth: 620, lineHeight: 1.55 }}>
            Pick your exam, enter your rank, and we'll instantly shortlist the
            best-fit institutes based on real 2025 JoSAA cutoffs.
          </p>
        </div>
      </section>

      <div className="container section">

        {/* ── Exam selector ── */}
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 10 }}>
            Choose your exam
          </p>
          <div className="exam-toggle" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {Object.values(EXAM_PROFILES).map((p) => {
              const Ic = p.icon;
              const active = exam === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => switchExam(p.key)}
                  style={{
                    position: "relative", overflow: "hidden", textAlign: "left",
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "16px 18px", borderRadius: 16, cursor: "pointer",
                    border: active ? "2px solid transparent" : "2px solid var(--line)",
                    background: active ? p.gradient : "#fff",
                    color: active ? "#fff" : "var(--navy)",
                    boxShadow: active ? `0 14px 30px -12px ${p.color}` : "0 2px 8px rgba(0,0,0,.04)",
                    transform: active ? "translateY(-2px)" : "none",
                    transition: "all .25s cubic-bezier(.4,0,.2,1)",
                  }}
                >
                  <span style={{
                    display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: active ? "rgba(255,255,255,.22)" : `${p.color}14`,
                    color: active ? "#fff" : p.color,
                  }}>
                    <Ic size={22} />
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.02rem" }}>{p.title}</span>
                    <span style={{ fontSize: 12.5, opacity: active ? 0.92 : 0.6 }}>{p.sub}</span>
                  </span>
                  {active && (
                    <span style={{ position: "absolute", top: 10, right: 12, fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,.25)", padding: "2px 8px", borderRadius: 999 }}>
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Input card ── */}
        <div className="card" style={{ marginBottom: 28, borderTop: `3px solid ${profile.color}` }}>
          <div className="grid-3" style={{ gap: 12, alignItems: "end" }}>
            <div className="field">
              <label>{profile.rankLabel}</label>
              <input
                className="input"
                type="number"
                min="1"
                value={rank}
                onChange={(e) => { setRank(e.target.value); reset(); }}
                placeholder={profile.placeholder}
                onKeyDown={(e) => e.key === "Enter" && handlePredict()}
              />
            </div>
            <div className="field">
              <label>Category</label>
              <select
                className="select"
                value={category}
                onChange={(e) => { setCategory(e.target.value); reset(); }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              className="btn"
              style={{
                justifyContent: "center", color: "#fff", border: "none",
                background: profile.gradient,
                boxShadow: `0 10px 24px -10px ${profile.color}`,
                opacity: loading || !rank ? 0.7 : 1,
                transition: "all .2s",
              }}
              onClick={handlePredict}
              disabled={loading || !rank}
            >
              {loading
                ? <><Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} /> Predicting…</>
                : <><Sparkles size={16} /> Find my {profile.title} colleges</>
              }
            </button>
          </div>
          <p style={{ marginTop: 12, fontSize: 12.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6 }}>
            <GraduationCap size={14} color={profile.color} /> {profile.note}
          </p>
        </div>

        {/* ── Loading state ── */}
        {loading && (
          <div style={{
            textAlign: "center", padding: "60px 24px",
            background: "#fff", borderRadius: 16,
            border: "1px solid var(--line)", marginBottom: 28,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              border: "4px solid #f3f0ec",
              borderTop: `4px solid ${profile.color}`,
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 20px",
            }} />
            <p style={{ fontWeight: 700, color: "var(--navy)", fontSize: 15, marginBottom: 6 }}>
              Finding your best colleges…
            </p>
            <p style={{ color: "var(--muted)", fontSize: 13, transition: "all .3s" }}>
              {LOADING_TIPS[tipIdx]}
            </p>
            <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 12 }}>
              This runs in the background — feel free to scroll the page
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── Error state ── */}
        {error && (
          <div style={{
            background: "#fff0f0", border: "1px solid #fca5a5",
            borderRadius: 12, padding: "16px 20px", marginBottom: 24,
            color: "#dc2626", fontSize: 14,
          }}>
            ⚠️ {error} — please try again.
          </div>
        )}

        {/* ── Grouped results + My-list builder (two columns) ── */}
        {hasResults && !loading && (
          <div className="fy-layout">

            {/* LEFT — predicted colleges */}
            <div className="fy-main">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
                <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
                  Every <strong>{profile.title}</strong> branch you're eligible for · rank <strong>{fmtRank(Number(rank))}</strong> · {category} · 2025 cutoffs
                </p>
                <button className="btn btn-ghost" onClick={downloadList} style={{ fontSize: 13, padding: "8px 14px", whiteSpace: "nowrap" }}>
                  <Download size={15} /> Download all
                </button>
              </div>

              {GROUP_ORDER.map((groupKey) => {
                const picks = grouped[groupKey];
                if (!picks?.length) return null;
                const meta = GROUP_META[groupKey];

                return (
                  <div key={groupKey} style={{ marginBottom: 40 }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 10,
                      marginBottom: 14, paddingBottom: 10,
                      borderBottom: `2px solid ${meta.color}22`,
                    }}>
                      <span style={{ fontSize: 20 }}>{meta.emoji}</span>
                      <h3 style={{ fontFamily: "Sora", fontWeight: 700, color: meta.color, margin: 0 }}>
                        {meta.label}
                      </h3>
                      <span className="badge" style={{ background: `${meta.color}18`, color: meta.color, fontSize: 12 }}>
                        {picks.length} option{picks.length > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="fy-cards">
                      {picks.map((m, i) => {
                        const c = COLLEGE_BY_SLUG[m.slug];
                        if (!c) return null;
                        const added = inList(m);
                        return (
                          <Reveal key={`${m.slug}-${m.branchCode}`} delay={(i % 3) * 0.05}>
                            <div className="card fy-card" style={{
                              display: "flex", flexDirection: "column", gap: 9,
                              height: "100%", borderTop: `3px solid ${meta.color}`,
                            }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                                <h4 style={{ fontFamily: "Sora", fontWeight: 700, color: "var(--navy)", fontSize: 14, lineHeight: 1.3 }}>
                                  {c.short}
                                </h4>
                                <span className="badge" style={{ background: `${TIER_COLOR[m.tier]}22`, color: TIER_COLOR[m.tier], whiteSpace: "nowrap" }}>
                                  {m.tier}
                                </span>
                              </div>

                              <div style={{ fontSize: 12.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>
                                <MapPin size={12} /> {c.location}
                              </div>

                              <div style={{ fontSize: 13 }}>
                                Branch: <strong>{m.branch}</strong>
                              </div>

                              <div style={{ display: "flex", gap: 12, fontSize: 12.5, padding: "8px 0", borderTop: "1px solid var(--line)" }}>
                                <span>Closing <strong>{fmtRank(m.closing)}</strong></span>
                                <span>Avg <strong>{fmtINR(m.avgPackage)}</strong></span>
                              </div>

                              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                                <button
                                  className="btn"
                                  onClick={() => (added ? removeFrom(idOf(m)) : addToList(m))}
                                  style={{
                                    justifyContent: "center", fontSize: 12.5, fontWeight: 700,
                                    border: `1.5px solid ${added ? "var(--green)" : meta.color}`,
                                    background: added ? "rgba(46,196,182,.12)" : `${meta.color}10`,
                                    color: added ? "#0e9c90" : meta.color,
                                  }}
                                >
                                  {added ? <><Check size={14} /> In your list</> : <><Plus size={14} /> Add to my list</>}
                                </button>
                                <div style={{ display: "flex", gap: 8 }}>
                                  <SaveButton slug={c.slug} size={15} />
                                  <CompareButton slug={c.slug} label={false} />
                                  <button
                                    className="btn btn-ghost"
                                    style={{ flex: 1, justifyContent: "center", fontSize: 12.5 }}
                                    onClick={() => nav(`/colleges/${c.slug}`)}
                                  >
                                    Details <ArrowRight size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Reveal>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT — your own ordered choice list */}
            <aside className="fy-aside">
              <div className="card fy-mylist-card">
                <div className="fy-mylist-head">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="fy-mylist-icon"><ListOrdered size={16} /></span>
                    <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1rem", margin: 0 }}>My choice list</h3>
                  </div>
                  <span className="badge orange" style={{ fontSize: 12 }}>{myList.length}</span>
                </div>

                {myList.length === 0 ? (
                  <div className="fy-mylist-empty">
                    <Plus size={26} color="var(--line)" />
                    <p>Tap <strong>“Add to my list”</strong> on any college to start building your preference order — drag to rank them 1, 2, 3…</p>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 10px" }}>
                      Drag to reorder. JoSAA gives you the highest choice you qualify for, so put your most-wanted seat at #1.
                    </p>
                    <Reorder.Group axis="y" values={myList} onReorder={setMyList} style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                      {myList.map((o, i) => {
                        const c = COLLEGE_BY_SLUG[o.slug];
                        return (
                          <Reorder.Item key={o._id} value={o} className="fy-mylist-item" style={{ borderLeft: `4px solid ${TIER_COLOR[o.tier]}` }}>
                            <span className="fy-mylist-num">{i + 1}</span>
                            <GripVertical size={14} color="var(--muted)" style={{ flexShrink: 0, cursor: "grab" }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {c?.short || o.college}
                              </div>
                              <div style={{ fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {o.branch} · {fmtRank(o.closing)}
                              </div>
                            </div>
                            <button className="fy-mylist-x" onClick={() => removeFrom(o._id)} title="Remove" aria-label="Remove">
                              <X size={14} />
                            </button>
                          </Reorder.Item>
                        );
                      })}
                    </Reorder.Group>

                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button className="btn btn-coral" onClick={downloadMyList} style={{ flex: 1, justifyContent: "center", fontSize: 12.5 }}>
                        <Download size={14} /> Download
                      </button>
                      <button className="btn btn-ghost" onClick={clearList} style={{ fontSize: 12.5, padding: "8px 12px" }} title="Clear list">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </aside>
          </div>
        )}

        {/* ── No results ── */}
        {!loading && grouped && !hasResults && (
          <div className="card" style={{ textAlign: "center", padding: 44, color: "var(--muted)" }}>
            <Sparkles size={42} color="var(--line)" />
            <p style={{ marginTop: 12 }}>
              No {profile.title} colleges found for rank {fmtRank(Number(rank))} in {category}. Try a higher rank or different category.
            </p>
          </div>
        )}

        {/* ── Shortlist ── */}
        {savedCols.length > 0 && (
          <>
            <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 14, marginTop: hasResults ? 40 : 0 }}>
              From your shortlist
            </h3>
            <div className="grid-3">
              {savedCols.map((c) => (
                <div key={c.slug} className="card" style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ fontFamily: "Sora", fontWeight: 700, color: "var(--navy)" }}>{c.short}</h4>
                    <span className="badge orange"><Trophy size={11} /> #{c.nirf}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
                    {c.location} · Avg {fmtINR(c.placements.avg)}
                  </div>
                  <button
                    className="btn btn-ghost"
                    style={{ marginTop: "auto", justifyContent: "center", fontSize: 13 }}
                    onClick={() => nav(`/colleges/${c.slug}`)}
                  >
                    View <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Empty state ── */}
        {!loading && !grouped && savedCols.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: 44, color: "var(--muted)" }}>
            <Sparkles size={42} color="var(--line)" />
            <p style={{ marginTop: 12 }}>
              Enter your rank above for personalized picks, or save colleges to see them here.
            </p>
          </div>
        )}

      </div>

      <style>{`
        .fy-card { transition: transform .2s ease, box-shadow .2s ease; }
        .fy-card:hover { transform: translateY(-4px); box-shadow: 0 16px 34px -16px rgba(0,0,0,.28); }

        /* Two-column: predicted colleges + sticky my-list builder */
        .fy-layout { display: grid; grid-template-columns: minmax(0,1fr) 340px; gap: 26px; align-items: start; }
        .fy-cards  { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px,1fr)); gap: 16px; }
        .fy-aside  { position: sticky; top: 88px; }

        .fy-mylist-card { padding: 16px; }
        .fy-mylist-head { display: flex; align-items: center; justify-content: space-between; gap: 8; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--line); }
        .fy-mylist-icon { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 9px; background: rgba(249,115,22,.12); color: #e05a2b; }
        .fy-mylist-empty { text-align: center; padding: 24px 8px; color: var(--muted); }
        .fy-mylist-empty p { font-size: 12.5px; line-height: 1.6; margin: 10px 0 0; }
        .fy-mylist-item { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 8px 10px; box-shadow: 0 1px 6px rgba(13,27,62,.05); cursor: default; }
        .fy-mylist-num { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: linear-gradient(135deg,#F47B20,#ea580c); color: #fff; font-family: "Sora",sans-serif; font-weight: 800; font-size: 11px; }
        .fy-mylist-x { flex-shrink: 0; display: grid; place-items: center; width: 24px; height: 24px; border-radius: 7px; border: none; background: rgba(239,68,68,.08); color: #ef4444; cursor: pointer; transition: background .15s; }
        .fy-mylist-x:hover { background: rgba(239,68,68,.18); }

        /* On tablet/phone the builder drops below the predictions, full width */
        @media (max-width: 980px) {
          .fy-layout { grid-template-columns: 1fr; }
          .fy-aside  { position: static; }
        }
        @media (max-width: 560px) { .exam-toggle { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
