import { useState } from "react";
import { Link } from "react-router-dom";
import { Reorder } from "framer-motion";
import { ListOrdered, GripVertical, Crosshair, RotateCcw, Trophy, MapPin, CheckCircle2, ArrowRight, Download } from "lucide-react";
import { predictColleges, TIER_COLOR } from "../utils/collegePredictor.js";
import { CATEGORIES, BRANCHES, STATES } from "../data/colleges.js";
import { fmtRank, fmtINR } from "../utils/format.js";

export default function CounsellingPlanner() {
  const [form, setForm] = useState({ rank: "", category: "OPEN", state: "", branch: "", exam: "advanced" });
  const [order, setOrder] = useState([]);
  const [ran, setRan] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // JEE Advanced → only IITs · JEE Main → only NITs & IIITs
  const run = () => {
    const types = form.exam === "advanced" ? ["IIT"] : ["NIT", "IIIT"];
    const out = predictColleges({ ...form, types }).slice(0, 14);
    setOrder(out.map((o, i) => ({ ...o, _id: `${o.slug}-${o.branchCode}-${i}` })));
    setRan(true);
  };
  const reset = () => { setForm({ rank: "", category: "OPEN", state: "", branch: "", exam: "advanced" }); setOrder([]); setRan(false); };

  const download = () => {
    if (!order.length) return;
    const head = `College Parichay — My JoSAA Choice List\nExam: ${form.exam === "advanced" ? "JEE Advanced (IITs)" : "JEE Main (NITs & IIITs)"}\nRank: ${form.rank || "-"}   Category: ${form.category}\nGenerated on ${new Date().toLocaleDateString("en-IN")}\n${"=".repeat(50)}\n\n`;
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
      <section style={{ background: "linear-gradient(135deg,#fff7f0,#ffe8d6)", color: "var(--ink)", padding: "40px 0" }}>
        <div className="container">
          <span className="eyebrow" style={{ color: "var(--coral)" }}>Counselling Planner</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.7rem,4vw,2.4rem)", margin: "8px 0 4px", display: "flex", alignItems: "center", gap: 10 }}>
            <ListOrdered size={28} /> Plan your JoSAA choice order
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: 640 }}>Get your eligible options, drag them into your preferred order, and we'll show which seat you'd most likely be allotted — exactly how JoSAA fills choices.</p>
        </div>
      </section>

      <div className="container section">
        <div className="card" style={{ marginBottom: 22 }}>
          <div className="field" style={{ marginBottom: 14 }}>
            <label>Which exam's counselling?</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { id: "advanced", label: "JEE Advanced", sub: "IITs only" },
                { id: "mains", label: "JEE Main", sub: "NITs & IIITs" },
              ].map((e) => {
                const on = form.exam === e.id;
                return (
                  <button key={e.id} onClick={() => set("exam", e.id)} className="btn"
                    style={{ flex: "1 1 200px", justifyContent: "center", flexDirection: "column", gap: 2, padding: "10px 14px",
                      background: on ? "var(--coral)" : "transparent", color: on ? "#fff" : "var(--ink)",
                      border: `1.6px solid ${on ? "var(--coral)" : "var(--line)"}` }}>
                    <span style={{ fontWeight: 800 }}>{e.label}</span>
                    <span style={{ fontSize: 11.5, opacity: .85 }}>{e.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid-4" style={{ gap: 12 }}>
            <div className="field"><label>Your rank</label><input className="input" type="number" min="1" value={form.rank} onChange={(e) => set("rank", e.target.value)} placeholder="e.g. 9000" /></div>
            <div className="field"><label>Category</label><select className="select" value={form.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
            <div className="field"><label>Home state</label><select className="select" value={form.state} onChange={(e) => set("state", e.target.value)}><option value="">Any</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select></div>
            <div className="field"><label>Branch</label><select className="select" value={form.branch} onChange={(e) => set("branch", e.target.value)}><option value="">All branches</option>{BRANCHES.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}</select></div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button className="btn btn-coral" style={{ flex: 1, justifyContent: "center" }} onClick={run}><Crosshair size={16} /> Build my choice list</button>
            <button className="btn btn-ghost" onClick={reset}><RotateCcw size={16} /></button>
          </div>
        </div>

        {ran && order.length === 0 && <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>No eligible options — try widening your filters or check your rank.</div>}

        {order.length > 0 && (
          <div className="grid-2" style={{ gap: 22, alignItems: "start" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                <h3 style={{ fontFamily: "Sora", fontWeight: 700 }}>Your choice order</h3>
                <button className="btn btn-ghost" onClick={download} style={{ fontSize: 13, padding: "7px 12px" }}><Download size={15} /> Download list</button>
              </div>
              <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>Drag the handle to reorder. Put your most-wanted seat at the top.</p>
              <Reorder.Group axis="y" values={order} onReorder={setOrder} style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {order.map((o, i) => (
                  <Reorder.Item key={o._id} value={o} className="card" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", cursor: "grab", borderLeft: `4px solid ${TIER_COLOR[o.tier]}` }}>
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

            <div style={{ position: "sticky", top: 90 }}>
              <div className="card" style={{ borderTop: "3px solid var(--green)" }}>
                <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Trophy size={18} color="var(--green)" /> Likely allotment</h3>
                {allot ? (
                  <>
                    <div style={{ background: "var(--sky)", borderRadius: 12, padding: 16 }}>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>With rank {fmtRank(rank)}, JoSAA would most likely allot:</div>
                      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.2rem", color: "var(--navy)", margin: "4px 0" }}>{allot.college}</div>
                      <div style={{ color: "var(--navy)", fontWeight: 600 }}>{allot.branch}</div>
                      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>Choice #{allotIndex + 1} · closing {fmtRank(allot.closing)} · avg {fmtINR(allot.avgPackage)}</div>
                      <Link to={`/colleges/${allot.slug}`} className="btn btn-coral" style={{ marginTop: 12, fontSize: 13 }}>View college <ArrowRight size={14} /></Link>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>You'd be allotted the <strong>highest choice in your list you qualify for</strong>. Choices above #{allotIndex + 1} are currently a stretch for your rank — keep them on top only if you're willing to wait for later rounds.</p>
                  </>
                ) : (
                  <p style={{ color: "var(--muted)" }}>Enter your rank above to see your likely allotment from this order.</p>
                )}
              </div>
              <div className="card" style={{ marginTop: 14 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13 }}>
                  <CheckCircle2 size={16} color="var(--teal)" />
                  <span style={{ color: "var(--muted)" }}>Tip: list dream colleges first, then safe ones — JoSAA never drops you to a lower choice if a higher one is available.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
