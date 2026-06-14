import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Reorder } from "framer-motion";
import { ListOrdered, GripVertical, Crosshair, RotateCcw, Trophy, MapPin, CheckCircle2, ArrowRight, Download, Loader2 } from "lucide-react";
import { TIER_COLOR } from "../utils/collegePredictor.js";
import { useCollegePredictor } from "../hooks/useCollegePredictor.js";
import { CATEGORIES, BRANCHES, STATES } from "../data/colleges.js";
import { fmtRank, fmtINR } from "../utils/format.js";
import Seo from "../components/Seo.jsx";

export default function CounsellingPlanner() {
  const [form, setForm] = useState({ rank: "", category: "OPEN", state: "", branch: "", exam: "advanced" });
  const [order, setOrder] = useState([]);
  const [ran, setRan] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Run the prediction in a Web Worker so the heavy JoSAA cutoff scan never
  // blocks the main thread — previously this ran synchronously here and froze
  // the page for 7–10s, making it look unresponsive / broken.
  const { predict, reset: resetPredict, results, loading, error } = useCollegePredictor();

  // When the worker returns, turn the flat result list into a draggable order.
  // Include EVERY eligible college-branch option (no cap) so the choice list is
  // complete — exactly the set of options the candidate can fill in JoSAA.
  useEffect(() => {
    if (!results) return;
    setOrder(results.map((o, i) => ({ ...o, _id: `${o.slug}-${o.branchCode}-${i}` })));
  }, [results]);

  // JEE Advanced → all IITs · JEE Main → all NITs, IIITs & GFTIs
  const run = () => {
    if (!form.rank || Number(form.rank) <= 0) return;
    setRan(true);
    const types = form.exam === "advanced" ? ["IIT"] : ["NIT", "IIIT", "GFTI"];
    predict({ ...form, types });
  };
  const reset = () => { setForm({ rank: "", category: "OPEN", state: "", branch: "", exam: "advanced" }); setOrder([]); setRan(false); resetPredict(); };

  const download = () => {
    if (!order.length) return;
    const head = `College Parichay — My JoSAA Choice List\nExam: ${form.exam === "advanced" ? "JEE Advanced (IITs)" : "JEE Main (NITs, IIITs & GFTIs)"}\nRank: ${form.rank || "-"}   Category: ${form.category}\nTotal options: ${order.length}\nGenerated on ${new Date().toLocaleDateString("en-IN")}\n${"=".repeat(50)}\n\n`;
    const body = order.map((o, i) => `${String(i + 1).padStart(2, " ")}. ${o.college} — ${o.branch}\n     Closing rank: ${o.closing}   |   ${o.tier}`).join("\n\n");
    const blob = new Blob([head + body + "\n\n(Illustrative — verify on josaa.nic.in)"], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "my-josaa-choice-list.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  // JoSAA logic: you get the highest preference in your list you actually qualify for.
  const rank = Number(form.rank) || Infinity;
  const allotIndex = order.findIndex((o) => rank <= o.closing);
  const allot = allotIndex >= 0 ? order[allotIndex] : null;

  return (
    <div className="page">
      <Seo
        title="JoSAA Counselling Planner — Build Your Choice-Filling Order"
        description="Free JoSAA 2026 counselling planner — arrange your IIT/NIT/IIIT choice list in the smartest order based on your rank, category and preferences, by IIT Roorkee alumni."
        path="/planner"
      />

      {/* ── Warm hero header ── */}
      <section className="warm-page-header" style={{ padding: "52px 0 48px" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 60% at 100% 20%, rgba(249,115,22,.22) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 45% 55% at 5% 80%, rgba(244,162,97,.20) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 35% 45% at 50% 110%, rgba(244,123,32,.14) 0%, transparent 55%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="eyebrow">
            Counselling Planner
          </span>
          <h1 style={{
            fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800,
            fontSize: "clamp(1.7rem,4vw,2.4rem)",
            margin: "10px 0 6px",
            display: "flex", alignItems: "center", gap: 10,
            color: "#1c1c28",
          }}>
            <ListOrdered size={28} color="#F47B20" /> Plan your JoSAA choice order
          </h1>
          <p style={{ color: "rgba(28,28,40,.62)", maxWidth: 640, fontSize: "0.97rem", lineHeight: 1.7 }}>
            Get your eligible options, drag them into your preferred order, and we'll show which seat you'd most likely be allotted — exactly how JoSAA fills choices.
          </p>
        </div>
      </section>

      {/* ── Main content — warm gradient ── */}
      <section style={{
        background: "linear-gradient(160deg, #fff7ef 0%, #fff3e6 40%, #fff 100%)",
        padding: "48px 0 72px",
      }}>
        <div className="container">

          {/* Form card */}
          <div className="card" style={{ marginBottom: 22 }}>
            <div className="field" style={{ marginBottom: 14 }}>
              <label>Which exam's counselling?</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { id: "advanced", label: "JEE Advanced", sub: "IITs only" },
                  { id: "mains",   label: "JEE Main",     sub: "NITs, IIITs & GFTIs" },
                ].map((e) => {
                  const on = form.exam === e.id;
                  return (
                    <button
                      key={e.id}
                      onClick={() => set("exam", e.id)}
                      className="btn"
                      style={{
                        flex: "1 1 200px", justifyContent: "center",
                        flexDirection: "column", gap: 2, padding: "10px 14px",
                        background: on ? "var(--coral)" : "transparent",
                        color: on ? "#fff" : "var(--ink)",
                        border: `1.6px solid ${on ? "var(--coral)" : "var(--line)"}`,
                        boxShadow: on ? "0 6px 20px rgba(244,123,32,.30)" : "none",
                      }}
                    >
                      <span style={{ fontWeight: 800 }}>{e.label}</span>
                      <span style={{ fontSize: 11.5, opacity: .85 }}>{e.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid-4" style={{ gap: 12 }}>
              <div className="field">
                <label>Your rank</label>
                <input className="input" type="number" min="1" value={form.rank} onChange={(e) => set("rank", e.target.value)} placeholder="e.g. 9000" />
              </div>
              <div className="field">
                <label>Category</label>
                <select className="select" value={form.category} onChange={(e) => set("category", e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Home state</label>
                <select className="select" value={form.state} onChange={(e) => set("state", e.target.value)}>
                  <option value="">Any</option>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Branch</label>
                <select className="select" value={form.branch} onChange={(e) => set("branch", e.target.value)}>
                  <option value="">All branches</option>
                  {BRANCHES.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button className="btn btn-coral" style={{ flex: 1, justifyContent: "center", opacity: loading ? 0.75 : 1 }} onClick={run} disabled={loading}>
                {loading
                  ? <><Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} /> Building…</>
                  : <><Crosshair size={16} /> Build my choice list</>}
              </button>
              <button className="btn btn-ghost" onClick={reset}><RotateCcw size={16} /></button>
            </div>
          </div>

          {loading && (
            <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", border: "4px solid #f3f0ec", borderTop: "4px solid var(--coral)", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
              Loading 2025 JoSAA cutoffs and building your choice list…
            </div>
          )}

          {error && !loading && (
            <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--coral)" }}>
              Couldn't build your list: {error}. Please try again.
            </div>
          )}

          {ran && !loading && !error && order.length === 0 && (
            <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>
              No eligible options — try widening your filters or check your rank.
            </div>
          )}

          {!loading && order.length > 0 && (
            <div className="grid-2" style={{ gap: 22, alignItems: "start" }}>

              {/* Choice list */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                    Your choice order
                    <span className="badge orange" style={{ fontSize: 12 }}>{order.length} options</span>
                  </h3>
                  <button className="btn btn-ghost" onClick={download} style={{ fontSize: 13, padding: "7px 12px" }}>
                    <Download size={15} /> Download list
                  </button>
                </div>
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
                  Every college-branch you're eligible for is listed below. Drag the handle to reorder — put your most-wanted seat at the top.
                </p>
                <Reorder.Group axis="y" values={order} onReorder={setOrder} style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {order.map((o, i) => (
                    <Reorder.Item
                      key={o._id}
                      value={o}
                      className="card"
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 14px", cursor: "grab",
                        borderLeft: `4px solid ${TIER_COLOR[o.tier]}`,
                      }}
                    >
                      <span style={{ fontFamily: "Sora", fontWeight: 800, color: "var(--muted)", width: 22 }}>{i + 1}</span>
                      <GripVertical size={16} color="var(--muted)" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: "var(--navy)" }}>{o.college} · {o.branch}</div>
                        <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span><MapPin size={11} style={{ verticalAlign: -1 }} /> {o.state}</span>
                          <span>Closing {fmtRank(o.closing)}</span>
                          <span style={{ color: TIER_COLOR[o.tier], fontWeight: 700 }}>{o.tier}</span>
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>

              {/* Allotment prediction */}
              <div style={{ position: "sticky", top: 90 }}>
                <div style={{
                  background: allot
                    ? "linear-gradient(135deg, #0d0800 0%, #1a0e00 50%, #2a1600 100%)"
                    : "#fff",
                  borderRadius: "var(--radius)",
                  border: allot ? "1px solid rgba(244,123,32,.35)" : "1px solid rgba(0,0,0,.06)",
                  boxShadow: allot
                    ? "0 8px 36px rgba(0,0,0,.28), 0 0 24px rgba(244,123,32,.15)"
                    : "0 2px 14px rgba(28,28,40,.06)",
                  padding: "1.3rem 1.4rem",
                  position: "relative", overflow: "hidden",
                }}>
                  {/* mesh grid when showing result */}
                  {allot && (
                    <div style={{
                      position: "absolute", inset: 0,
                      backgroundImage: "linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)",
                      backgroundSize: "36px 36px", pointerEvents: "none",
                    }} />
                  )}
                  {/* top accent line */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: allot
                      ? "linear-gradient(90deg, #F47B20, #fbbf24, #F47B20)"
                      : "var(--green)",
                  }} />

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <h3 style={{
                      fontFamily: "Sora", fontWeight: 700, marginBottom: 12,
                      display: "flex", alignItems: "center", gap: 8,
                      color: allot ? "#fff" : "var(--navy)",
                    }}>
                      <Trophy size={18} color={allot ? "#F47B20" : "var(--green)"} />
                      Likely allotment
                    </h3>

                    {allot ? (
                      <>
                        <div style={{
                          background: "rgba(244,123,32,.06)", borderRadius: 12, padding: 16,
                          border: "1px solid rgba(244,123,32,.25)",
                        }}>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>
                            With rank {fmtRank(rank)}, JoSAA would most likely allot:
                          </div>
                          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.2rem", color: "#1a1a2e", margin: "6px 0 2px" }}>
                            {allot.college}
                          </div>
                          <div style={{ color: "#F47B20", fontWeight: 600 }}>{allot.branch}</div>
                          <div style={{ fontSize: 13, color: "rgba(255,255,255,.45)", marginTop: 6 }}>
                            Choice #{allotIndex + 1} · closing {fmtRank(allot.closing)} · avg {fmtINR(allot.avgPackage)}
                          </div>
                          <Link
                            to={`/colleges/${allot.slug}`}
                            className="btn btn-coral"
                            style={{ marginTop: 14, fontSize: 13 }}
                          >
                            View college <ArrowRight size={14} />
                          </Link>
                        </div>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,.40)", marginTop: 12 }}>
                          You'd be allotted the <strong style={{ color: "rgba(255,255,255,.7)" }}>highest choice in your list you qualify for</strong>. Choices above #{allotIndex + 1} are currently a stretch — keep them on top only if you're willing to wait for later rounds.
                        </p>
                      </>
                    ) : (
                      <p style={{ color: "var(--muted)" }}>
                        Enter your rank above to see your likely allotment from this order.
                      </p>
                    )}
                  </div>
                </div>

                <div className="card" style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13 }}>
                    <CheckCircle2 size={16} color="var(--teal)" />
                    <span style={{ color: "var(--muted)" }}>
                      Tip: list dream colleges first, then safe ones — JoSAA never drops you to a lower choice if a higher one is available.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
