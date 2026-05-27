/* CollegeDetail.jsx — full updated version with Seat Matrix
   Key changes vs original:
   • cutoffBranch state — set when "View cutoffs" is clicked in Courses tab
   • setTabQ("Cutoff") called simultaneously so the tab switches
   • <CutoffSection initialProgram={cutoffBranch} … /> passes the branch down
   • seatMatrix imported and added below the CutoffSection
   ============================================================ */

import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Globe, Trophy, ArrowLeft, ExternalLink, Crosshair, Building2 } from "lucide-react";
import { COLLEGE_BY_SLUG, CATEGORIES, BRANCHES } from "../data/colleges.js";
import { collegeBranches, seatMatrix } from "../utils/cutoffEngine.js";
import { loadCutoffDB } from "../utils/realCutoffEngine.js";
import { Bars, PieWithLegend, CenterDonut, Trend } from "../components/Charts.jsx";
import { fmtINR, fmtRank } from "../utils/format.js";
import Reveal from "../components/Reveal.jsx";
import { SaveButton, CompareButton } from "../components/SaveButton.jsx";
import Reviews from "../components/Reviews.jsx";
import Gallery from "../components/Gallery.jsx";
import ROICalculator from "../components/ROICalculator.jsx";
import CutoffSection from "../components/CutoffSection.jsx";
import { Youtube, Map as MapIcon } from "lucide-react";

// Kick off the DB load as soon as this module is imported
loadCutoffDB();

const TABS = ["Overview", "Cutoff", "Fees", "Courses", "Placements", "Campus Life", "Reviews"];
const tabKey = (t) => t.toLowerCase().split(" ")[0];

export default function CollegeDetail() {
  const { slug } = useParams();
  const [sp, setSp] = useSearchParams();
  const nav = useNavigate();
  const college = COLLEGE_BY_SLUG[slug];

  const initial = TABS.find((t) => tabKey(t) === sp.get("tab")) || "Overview";
  const [tab, setTab] = useState(initial);

  // ── tracks which branch was clicked in Courses tab ────────────────────────
  // Stores the branch *code* (e.g. "cse", "ece") so CutoffSection can
  // fuzzy-match it to the real JoSAA program name.
  const [cutoffBranch, setCutoffBranch] = useState(null);

  useEffect(() => {
    const t = TABS.find((x) => tabKey(x) === sp.get("tab"));
    if (t) setTab(t);
  }, [sp]);

  const branches = college ? collegeBranches(college) : [];

  if (!college) {
    return (
      <div className="page container" style={{ padding: "80px 0", textAlign: "center" }}>
        <h2>College not found</h2>
        <Link to="/colleges" className="btn btn-coral" style={{ marginTop: 16 }}>
          Back to colleges
        </Link>
      </div>
    );
  }

  // Calculate seat matrix
  const seats = seatMatrix(college);

  // ── Tab navigation helper ─────────────────────────────────────────────────
  const setTabQ = (t) => {
    setTab(t);
    setSp({ tab: tabKey(t) });
  };

  // ── navigate to Cutoff tab pre-filtered to a branch ───────────────────────
  const goToCutoff = (branchCode) => {
    setCutoffBranch(branchCode);
    setTabQ("Cutoff");
  };

  // ── Chart / fee data ──────────────────────────────────────────────────────
  const placeData = Object.entries(college.placements.byBranch || {}).map(([code, v]) => ({
    name: BRANCHES.find((b) => b.code === code)?.code.toUpperCase() || code.toUpperCase(),
    value: v,
  }));
  const feeData = [
    { name: "Tuition", value: college.fees.tuition },
    { name: "Hostel",  value: college.fees.hostel  },
    { name: "Mess",    value: college.fees.mess    },
    { name: "Other",   value: college.fees.other   },
  ];
  const totalFee = feeData.reduce((s, f) => s + f.value, 0);

  return (
    <div className="page">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section style={{
        position: "relative", color: "#fff",
        padding: "120px 0 56px", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${college.heroImage})`,
          backgroundSize: "cover", backgroundPosition: "center", zIndex: 0,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg,rgba(28,28,40,.6) 0%,rgba(28,28,40,.75) 55%,rgba(28,28,40,.92) 100%)",
          zIndex: 1,
        }} />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <button onClick={() => nav(-1)} className="btn btn-light" style={{ marginBottom: 20 }}>
            <ArrowLeft size={16} /> Back
          </button>

          <div style={{
            display: "flex", justifyContent: "space-between",
            flexWrap: "wrap", gap: 20, alignItems: "flex-end",
          }}>
            <div>
              <span className="badge orange" style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                <Trophy size={12} /> NIRF #{college.nirf} · {college.type}
              </span>
              <h1 style={{
                fontFamily: "Sora", fontWeight: 800,
                fontSize: "clamp(1.8rem,4vw,2.6rem)", margin: "10px 0 6px",
                textShadow: "0 2px 18px rgba(0,0,0,.45)", lineHeight: 1.2,
              }}>
                {college.name}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,.88)", fontSize: 15 }}>
                <MapPin size={16} /> {college.location} · Estd {college.estd}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <a href={college.website} target="_blank" rel="noreferrer" className="btn btn-coral">
                <Globe size={16} /> Official Website
              </a>
              <button className="btn btn-light" onClick={() => nav("/jee-main#college")}>
                <Crosshair size={16} /> Check if I qualify
              </button>
              <SaveButton slug={college.slug} label />
              <CompareButton slug={college.slug} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick stats ──────────────────────────────────────────────────────── */}
      <div className="container" style={{ marginTop: 24, marginBottom: 8 }}>
        <div className="grid-4" style={{ gap: 14 }}>
          {[
            ["Avg package", fmtINR(college.placements.avg),         "var(--navy)"],
            ["Highest",     fmtINR(college.placements.highest),      "var(--green)"],
            ["Placed",      `${college.placements.placedPct}%`,      "var(--orange)"],
            ["Total fees",  `${fmtINR(totalFee)}/yr`,                "var(--violet)"],
          ].map(([l, v, c]) => (
            <div key={l} className="card" style={{ textAlign: "center", padding: "18px 12px" }}>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{l}</div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.3rem", color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────────── */}
      <div className="container" style={{ marginTop: 28 }}>
        <div className="tabs" style={{ flexWrap: "wrap", marginBottom: 24 }}>
          {TABS.map((t) => (
            <button
              key={t}
              className={`tab ${tab === t ? "active" : ""}`}
              onClick={() => setTabQ(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ paddingBottom: 60 }}
        >

          {/* ── Overview ────────────────────────────────────────────────────── */}
          {tab === "Overview" && (
            <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
              <div className="card">
                <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8 }}>
                  About {college.short}
                </h3>
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
                  {college.placements.recruiters.map((r) => (
                    <span key={r} className="pill"
                      style={{ background: "var(--sky)", border: "1px solid var(--line)" }}>
                      {r}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: 18 }}>
                  <CenterDonut
                    data={placeData}
                    centerLabel={fmtINR(college.placements.avg)}
                    centerSub="avg package"
                    colors={["#F97316","#2EC4B6","#0EA5A4","#F97316","#0EA5A4","#F4A261"]}
                    height={180}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Cutoff ──────────────────────────────────────────────────────── */}
          {tab === "Cutoff" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <CutoffSection
                college={college}
                initialProgram={cutoffBranch}
              />
              
              {/* ── Seat Matrix Table ── */}
              <div className="card" style={{ overflowX: "auto" }}>
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 4 }}>Seat matrix (approx.)</h4>
                <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
                  Indicative seats per branch and category. Verify the official seat matrix on josaa.nic.in.
                </p>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Branch</th>
                      <th>OPEN</th>
                      <th>OBC-NCL</th>
                      <th>EWS</th>
                      <th>SC</th>
                      <th>ST</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seats.map((s) => (
                      <tr key={s.code}>
                        <td><strong style={{ color: "var(--navy)" }}>{s.name}</strong></td>
                        <td>{s.byCat.OPEN}</td>
                        <td>{s.byCat["OBC-NCL"]}</td>
                        <td>{s.byCat.EWS}</td>
                        <td>{s.byCat.SC}</td>
                        <td>{s.byCat.ST}</td>
                        <td><strong>{s.total}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Fees ────────────────────────────────────────────────────────── */}
          {tab === "Fees" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
                <div className="card">
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>
                    Annual fee breakup
                  </h4>
                  <PieWithLegend
                    data={feeData}
                    colors={["#F97316","#2EC4B6","#0EA5A4","#0EA5A4"]}
                    height={240}
                    fmt={fmtINR}
                  />
                </div>
                <div className="card">
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>
                    Cost summary
                  </h4>
                  <table className="data-table">
                    <tbody>
                      {feeData.map((f) => (
                        <tr key={f.name}>
                          <td>{f.name}</td>
                          <td style={{ textAlign: "right" }}>{fmtINR(f.value)}</td>
                        </tr>
                      ))}
                      <tr style={{ fontWeight: 800 }}>
                        <td>Total / year</td>
                        <td style={{ textAlign: "right", color: "var(--coral)" }}>{fmtINR(totalFee)}</td>
                      </tr>
                      <tr style={{ fontWeight: 800 }}>
                        <td>Approx 4-year cost</td>
                        <td style={{ textAlign: "right", color: "var(--navy)" }}>{fmtINR(totalFee * 4)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>
                    Scholarships, fee waivers (SC/ST/EWS) and mess refunds can significantly
                    reduce the net cost.
                  </p>
                </div>
              </div>
              <ROICalculator college={college} />
            </div>
          )}

          {/* ── Courses ─────────────────────────────────────────────────────── */}
          {tab === "Courses" && (
            <div className="grid-3">
              {branches.map((b, i) => (
                <Reveal key={b.code} delay={i * 0.05}>
                  <div className="card" style={{
                    display: "flex", flexDirection: "column", gap: 8, height: "100%",
                  }}>
                    <Building2 size={22} color={college.accent} />
                    <h4 style={{ fontFamily: "Sora", fontWeight: 700 }}>{b.name}</h4>
                    <div style={{ fontSize: 13, color: "var(--muted)" }}>B.Tech · 4 years</div>

                    {college.placements.byBranch?.[b.code] && (
                      <div style={{ marginTop: 4 }}>
                        <span className="badge teal">
                          Avg {fmtINR(college.placements.byBranch[b.code])}
                        </span>
                      </div>
                    )}

                    <button
                      className="btn btn-ghost"
                      style={{ marginTop: "auto", fontSize: 13, justifyContent: "center" }}
                      onClick={() => goToCutoff(b.code)}
                    >
                      View cutoffs →
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {/* ── Placements ──────────────────────────────────────────────────── */}
          {tab === "Placements" && (
            <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
              <div className="card">
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>
                  Branch-wise average package
                </h4>
                <Bars
                  data={placeData}
                  bars={[{ key: "value", label: "Avg package", color: "#F97316" }]}
                  height={300} fmt={fmtINR} angle={-20}
                />
              </div>
              <div className="card">
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>
                  Placement summary
                </h4>
                <div className="grid-2" style={{ gap: 12 }}>
                  {[
                    ["Average", college.placements.avg],
                    ["Median",  college.placements.median],
                    ["Highest", college.placements.highest],
                  ].map(([l, v]) => (
                    <div key={l} style={{ background: "var(--sky)", borderRadius: 12, padding: 14 }}>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{l}</div>
                      <strong style={{ fontFamily: "Sora", fontSize: "1.2rem", color: "var(--navy)" }}>
                        {fmtINR(v)}
                      </strong>
                    </div>
                  ))}
                  <div style={{ background: "var(--sky)", borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Placed</div>
                    <strong style={{ fontFamily: "Sora", fontSize: "1.2rem", color: "var(--green)" }}>
                      {college.placements.placedPct}%
                    </strong>
                  </div>
                </div>
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, margin: "18px 0 8px" }}>Recruiters</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {college.placements.recruiters.map((r) => (
                    <span key={r} className="pill"
                      style={{ background: "var(--sky)", border: "1px solid var(--line)" }}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Campus Life ─────────────────────────────────────────────────── */}
          {tab === "Campus Life" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div className="card">
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>
                  Campus gallery
                </h4>
                <Gallery slug={college.slug} accent={college.accent} />
              </div>
              <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
                <div className="card">
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8,
                    display: "flex", alignItems: "center", gap: 8 }}>
                    <Youtube size={18} color="var(--coral)" /> Virtual tour & videos
                  </h4>
                  <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
                    Watch real campus tours, placement talks and student vlogs.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      ["Campus tour",         `${college.name} campus tour`],
                      ["Placement reviews",   `${college.name} placements review`],
                      ["Student vlog / life", `${college.name} student life vlog`],
                    ].map(([label, query]) => (
                      <a
                        key={label}
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
                        target="_blank" rel="noreferrer"
                        style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "11px 14px", background: "var(--sky)", borderRadius: 10,
                          color: "var(--navy)", fontWeight: 500, fontSize: 14,
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <Youtube size={16} color="var(--coral)" /> {label}
                        </span>
                        <ExternalLink size={14} color="var(--muted)" />
                      </a>
                    ))}
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(college.name)}`}
                      target="_blank" rel="noreferrer"
                      style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "11px 14px", background: "var(--sky)", borderRadius: 10,
                        color: "var(--navy)", fontWeight: 500, fontSize: 14,
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <MapIcon size={16} color="var(--teal)" /> Street View & 360° on Maps
                      </span>
                      <ExternalLink size={14} color="var(--muted)" />
                    </a>
                  </div>
                </div>

                <div className="card">
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8 }}>Location</h4>
                  <p style={{ color: "var(--muted)", display: "flex", gap: 6, alignItems: "center" }}>
                    <MapPin size={16} /> {college.location}
                  </p>
                  <iframe
                    title="map"
                    style={{ width: "100%", height: 220, border: 0, borderRadius: 12, marginTop: 12 }}
                    src={`https://www.google.com/maps?q=${college.coords.lat},${college.coords.lng}&z=14&output=embed`}
                    loading="lazy"
                  />
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, margin: "16px 0 8px" }}>
                    Campus highlights
                  </h4>
                  <ul style={{ paddingLeft: 18, color: "var(--muted)", lineHeight: 1.9 }}>
                    <li>Fully residential campus with multiple hostels</li>
                    <li>Active technical, cultural & sports societies</li>
                    <li>Central library, sports complex & medical centre</li>
                    <li>Startup incubation & research park access</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ── Reviews ─────────────────────────────────────────────────────── */}
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