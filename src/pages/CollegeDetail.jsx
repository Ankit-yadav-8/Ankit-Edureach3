import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Globe, Trophy, ArrowLeft, ExternalLink, Crosshair, Calendar, Building2 } from "lucide-react";
import { COLLEGE_BY_SLUG, CATEGORIES, BRANCHES } from "../data/colleges.js";
import { expandRounds, collegeBranches, cutoffHistory, forecastClosing, seatMatrix } from "../utils/cutoffEngine.js";
import { Bars, PieWithLegend, CenterDonut, Trend } from "../components/Charts.jsx";
import { fmtINR, fmtRank } from "../utils/format.js";
import Reveal from "../components/Reveal.jsx";
import { SaveButton, CompareButton } from "../components/SaveButton.jsx";
import Reviews from "../components/Reviews.jsx";
import Gallery from "../components/Gallery.jsx";
import ROICalculator from "../components/ROICalculator.jsx";
import { Youtube, Map as MapIcon, Star } from "lucide-react";

const TABS = ["Overview", "Cutoff", "Fees", "Courses", "Placements", "Campus Life", "Reviews"];
const tabKey = (t) => t.toLowerCase().split(" ")[0];

export default function CollegeDetail() {
  const { slug } = useParams();
  const [sp, setSp] = useSearchParams();
  const nav = useNavigate();
  const college = COLLEGE_BY_SLUG[slug];

  const initial = TABS.find((t) => tabKey(t) === sp.get("tab")) || "Overview";
  const [tab, setTab] = useState(initial);
  useEffect(() => { const t = TABS.find((x) => tabKey(x) === sp.get("tab")); if (t) setTab(t); }, [sp]);

  const branches = college ? collegeBranches(college) : [];
  const [branch, setBranch] = useState(branches[0]?.code || "cse");
  const [cat, setCat] = useState("OPEN");

  if (!college) {
    return <div className="page container" style={{ padding: "80px 0", textAlign: "center" }}>
      <h2>College not found</h2><Link to="/colleges" className="btn btn-coral" style={{ marginTop: 16 }}>Back to colleges</Link>
    </div>;
  }

  const setTabQ = (t) => { setTab(t); setSp({ tab: tabKey(t) }); };
  const rounds = expandRounds(college, branch, cat);
  const roundChart = rounds.map((r) => ({ name: r.round, Opening: r.opening, Closing: r.closing }));
  const history = cutoffHistory(college, branch, cat);
  const forecast = forecastClosing(college, branch, cat);
  const seats = seatMatrix(college);

  const placeData = Object.entries(college.placements.byBranch || {}).map(([code, v]) => ({
    name: BRANCHES.find((b) => b.code === code)?.code.toUpperCase() || code.toUpperCase(), value: v,
  }));
  const feeData = [
    { name: "Tuition", value: college.fees.tuition },
    { name: "Hostel", value: college.fees.hostel },
    { name: "Mess", value: college.fees.mess },
    { name: "Other", value: college.fees.other },
  ];
  const totalFee = feeData.reduce((s, f) => s + f.value, 0);

  return (
    <div className="page">
      {/* Hero with campus photo */}
      <section style={{ position: "relative", color: "#fff", padding: "104px 0 34px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${college.heroImage})`, backgroundSize: "cover", backgroundPosition: "center", zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(28,28,40,.55) 0%, rgba(28,28,40,.72) 55%, rgba(28,28,40,.9) 100%)`, zIndex: 1 }} />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <button onClick={() => nav(-1)} className="btn btn-light" style={{ marginBottom: 18 }}><ArrowLeft size={16} /> Back</button>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
            <div>
              <span className="badge orange" style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Trophy size={12} /> NIRF #{college.nirf} · {college.type}</span>
              <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", margin: "10px 0 4px", textShadow: "0 2px 18px rgba(0,0,0,.4)" }}>{college.name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,.9)" }}><MapPin size={16} /> {college.location} · Estd {college.estd}</div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href={college.website} target="_blank" rel="noreferrer" className="btn btn-coral"><Globe size={16} /> Official Website</a>
              <button className="btn btn-light" onClick={() => nav("/jee-main#college")}><Crosshair size={16} /> Check if I qualify</button>
              <SaveButton slug={college.slug} label />
              <CompareButton slug={college.slug} />
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <div className="container" style={{ marginTop: -24 }}>
        <div className="grid-4" style={{ gap: 14 }}>
          {[
            ["Avg package", fmtINR(college.placements.avg), "var(--navy)"],
            ["Highest", fmtINR(college.placements.highest), "var(--green)"],
            ["Placed", `${college.placements.placedPct}%`, "var(--orange)"],
            ["Total fees", fmtINR(totalFee) + "/yr", "var(--violet)"],
          ].map(([l, v, c]) => (
            <div key={l} className="card" style={{ textAlign: "center", padding: "16px 10px" }}>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{l}</div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.3rem", color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="container" style={{ marginTop: 28 }}>
        <div className="tabs" style={{ flexWrap: "wrap", marginBottom: 24 }}>
          {TABS.map((t) => <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTabQ(t)}>{t}</button>)}
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ paddingBottom: 60 }}>
          {tab === "Overview" && (
            <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
              <div className="card">
                <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8 }}>About {college.short}</h3>
                <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{college.about}</p>
                <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span className="badge teal">{college.counsellingExam}</span>
                  <span className="badge orange">Estd {college.estd}</span>
                  <span className="badge violet">{college.state}</span>
                </div>
              </div>
              <div className="card">
                <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8 }}>Top recruiters</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {college.placements.recruiters.map((r) => <span key={r} className="pill" style={{ background: "var(--sky)", border: "1px solid var(--line)" }}>{r}</span>)}
                </div>
                <div style={{ marginTop: 18 }}>
                  <CenterDonut data={placeData} centerLabel={fmtINR(college.placements.avg)} centerSub="avg package"
                    colors={["#F97316", "#2EC4B6", "#0EA5A4", "#F97316", "#0EA5A4", "#F4A261"]} height={180} />
                </div>
              </div>
            </div>
          )}

          {tab === "Cutoff" && (
            <div>
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="grid-2" style={{ gap: 14 }}>
                  <div className="field">
                    <label>Branch</label>
                    <select className="select" value={branch} onChange={(e) => setBranch(e.target.value)}>
                      {branches.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Category</label>
                    <select className="select" value={cat} onChange={(e) => setCat(e.target.value)}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid-2" style={{ gap: 22, alignItems: "start" }}>
                <div className="card" style={{ overflowX: "auto" }}>
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>All rounds · {branches.find((b) => b.code === branch)?.name} · {cat}</h4>
                  <table className="data-table">
                    <thead><tr><th>Round</th><th>Stage</th><th>Opening</th><th>Closing</th></tr></thead>
                    <tbody>
                      {rounds.map((r) => (
                        <tr key={r.round}>
                          <td><strong>{r.round}</strong></td>
                          <td><span className={`badge ${r.stage === "CSAB" ? "violet" : "teal"}`}>{r.stage}</span></td>
                          <td>{fmtRank(r.opening)}</td>
                          <td>{fmtRank(r.closing)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10 }}>{college.type === "IIT" ? "6 JoSAA rounds — IITs do not have CSAB. Illustrative; verify on josaa.nic.in." : "6 JoSAA + 2 CSAB special rounds. Illustrative; verify on josaa.nic.in / csab.nic.in."}</p>
                </div>
                <div className="card">
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>Opening vs closing across rounds</h4>
                  <Bars data={roundChart} bars={[{ key: "Opening", label: "Opening", color: "#2EC4B6" }, { key: "Closing", label: "Closing", color: "#F97316" }]} height={300} fmt={fmtRank} angle={-30} />
                </div>
              </div>

              {/* 5-year cutoff history */}
              <div className="grid-2" style={{ gap: 22, alignItems: "start", marginTop: 22 }}>
                <div className="card" style={{ overflowX: "auto" }}>
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 4 }}>5-year cutoff history (2021–2025)</h4>
                  <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>Year-wise opening &amp; closing rank — {branches.find((b) => b.code === branch)?.name} · {cat}</p>
                  <table className="data-table">
                    <thead><tr><th>Year</th><th>Opening</th><th>Closing</th></tr></thead>
                    <tbody>
                      {history.map((h) => (
                        <tr key={h.year}>
                          <td><strong>{h.year}</strong></td>
                          <td>{fmtRank(h.opening)}</td>
                          <td>{fmtRank(h.closing)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card">
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>Closing-rank trend (2021–2025)</h4>
                  <Trend data={history} lines={[{ key: "closing", label: "Closing rank", color: "#F97316" }, { key: "opening", label: "Opening rank", color: "#2EC4B6" }]} height={280} fmt={fmtRank} />
                  {forecast && (
                    <div style={{ marginTop: 12, background: "linear-gradient(135deg,#fff,var(--sky))", border: "1px dashed var(--coral)", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, color: "var(--muted)" }}>📈 Forecast for <strong style={{ color: "var(--navy)" }}>2026</strong> (from trend)</span>
                      <strong style={{ fontFamily: "Sora", color: "var(--coral)" }}>~{fmtRank(forecast.closing)} closing</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Seat matrix */}
              <div className="card" style={{ marginTop: 22, overflowX: "auto" }}>
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 4 }}>Seat matrix (approx.)</h4>
                <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>Indicative seats per branch and category. Verify the official seat matrix on josaa.nic.in.</p>
                <table className="data-table">
                  <thead><tr><th>Branch</th><th>OPEN</th><th>OBC-NCL</th><th>EWS</th><th>SC</th><th>ST</th><th>Total</th></tr></thead>
                  <tbody>
                    {seats.map((s) => (
                      <tr key={s.code}>
                        <td><strong style={{ color: "var(--navy)" }}>{s.name}</strong></td>
                        <td>{s.byCat.OPEN}</td><td>{s.byCat["OBC-NCL"]}</td><td>{s.byCat.EWS}</td><td>{s.byCat.SC}</td><td>{s.byCat.ST}</td>
                        <td><strong>{s.total}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "Fees" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
              <div className="card">
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>Annual fee breakup</h4>
                <PieWithLegend data={feeData} colors={["#F97316", "#2EC4B6", "#0EA5A4", "#0EA5A4"]} height={240} fmt={fmtINR} />
              </div>
              <div className="card">
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>Cost summary</h4>
                <table className="data-table">
                  <tbody>
                    {feeData.map((f) => <tr key={f.name}><td>{f.name}</td><td style={{ textAlign: "right" }}>{fmtINR(f.value)}</td></tr>)}
                    <tr style={{ fontWeight: 800 }}><td>Total / year</td><td style={{ textAlign: "right", color: "var(--coral)" }}>{fmtINR(totalFee)}</td></tr>
                    <tr style={{ fontWeight: 800 }}><td>Approx 4-year cost</td><td style={{ textAlign: "right", color: "var(--navy)" }}>{fmtINR(totalFee * 4)}</td></tr>
                  </tbody>
                </table>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>Scholarships, fee waivers (SC/ST/EWS) and mess refunds can significantly reduce the net cost.</p>
              </div>
            </div>
            <ROICalculator college={college} />
            </div>
          )}

          {tab === "Courses" && (
            <div className="grid-3">
              {branches.map((b, i) => (
                <Reveal key={b.code} delay={i * 0.05}>
                  <div className="card" style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%" }}>
                    <Building2 size={22} color={college.accent} />
                    <h4 style={{ fontFamily: "Sora", fontWeight: 700 }}>{b.name}</h4>
                    <div style={{ fontSize: 13, color: "var(--muted)" }}>B.Tech · 4 years</div>
                    {college.placements.byBranch?.[b.code] && (
                      <div style={{ marginTop: 4 }}><span className="badge teal">Avg {fmtINR(college.placements.byBranch[b.code])}</span></div>
                    )}
                    <Link to={`/colleges/${slug}?tab=cutoff`} onClick={() => setBranch(b.code)} className="btn btn-ghost" style={{ marginTop: "auto", fontSize: 13, justifyContent: "center" }}>View cutoffs</Link>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {tab === "Placements" && (
            <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
              <div className="card">
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>Branch-wise average package</h4>
                <Bars data={placeData} bars={[{ key: "value", label: "Avg package", color: "#F97316" }]} height={300} fmt={fmtINR} angle={-20} />
              </div>
              <div className="card">
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>Placement summary</h4>
                <div className="grid-2" style={{ gap: 12 }}>
                  {[["Average", college.placements.avg], ["Median", college.placements.median], ["Highest", college.placements.highest]].map(([l, v]) => (
                    <div key={l} style={{ background: "var(--sky)", borderRadius: 12, padding: 14 }}>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{l}</div>
                      <strong style={{ fontFamily: "Sora", fontSize: "1.2rem", color: "var(--navy)" }}>{fmtINR(v)}</strong>
                    </div>
                  ))}
                  <div style={{ background: "var(--sky)", borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Placed</div>
                    <strong style={{ fontFamily: "Sora", fontSize: "1.2rem", color: "var(--green)" }}>{college.placements.placedPct}%</strong>
                  </div>
                </div>
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, margin: "18px 0 8px" }}>Recruiters</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {college.placements.recruiters.map((r) => <span key={r} className="pill" style={{ background: "var(--sky)", border: "1px solid var(--line)" }}>{r}</span>)}
                </div>
              </div>
            </div>
          )}

          {tab === "Campus Life" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div className="card">
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>Campus gallery</h4>
                <Gallery slug={college.slug} accent={college.accent} />
              </div>
              <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
                <div className="card">
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}><Youtube size={18} color="var(--coral)" /> Virtual tour &amp; videos</h4>
                  <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>Watch real campus tours, placement talks and student vlogs.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      ["Campus tour", `${college.name} campus tour`],
                      ["Placement reviews", `${college.name} placements review`],
                      ["Student vlog / life", `${college.name} student life vlog`],
                    ].map(([label, query]) => (
                      <a key={label} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`} target="_blank" rel="noreferrer"
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: "var(--sky)", borderRadius: 10, color: "var(--navy)", fontWeight: 500, fontSize: 14 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 9 }}><Youtube size={16} color="var(--coral)" /> {label}</span>
                        <ExternalLink size={14} color="var(--muted)" />
                      </a>
                    ))}
                    <a href={`https://www.google.com/maps/search/${encodeURIComponent(college.name)}`} target="_blank" rel="noreferrer"
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: "var(--sky)", borderRadius: 10, color: "var(--navy)", fontWeight: 500, fontSize: 14 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 9 }}><MapIcon size={16} color="var(--teal)" /> Street View &amp; 360° on Maps</span>
                      <ExternalLink size={14} color="var(--muted)" />
                    </a>
                  </div>
                </div>
                <div className="card">
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8 }}>Location</h4>
                  <p style={{ color: "var(--muted)", display: "flex", gap: 6, alignItems: "center" }}><MapPin size={16} /> {college.location}</p>
                  <iframe
                    title="map"
                    style={{ width: "100%", height: 220, border: 0, borderRadius: 12, marginTop: 12 }}
                    src={`https://www.google.com/maps?q=${college.coords.lat},${college.coords.lng}&z=14&output=embed`}
                    loading="lazy"
                  />
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, margin: "16px 0 8px" }}>Campus highlights</h4>
                  <ul style={{ paddingLeft: 18, color: "var(--muted)", lineHeight: 1.9 }}>
                    <li>Fully residential campus with multiple hostels</li>
                    <li>Active technical, cultural &amp; sports societies</li>
                    <li>Central library, sports complex &amp; medical centre</li>
                    <li>Startup incubation &amp; research park access</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === "Reviews" && (
            <div style={{ maxWidth: 760 }}>
              <Reviews slug={college.slug} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
