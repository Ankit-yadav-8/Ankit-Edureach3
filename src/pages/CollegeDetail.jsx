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
import { getCollegeStats } from "../data/collegeStats.js";
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
import Seo, { SITE_URL } from "../components/Seo.jsx";
import { Youtube, Map as MapIcon } from "lucide-react";

const TABS = ["Overview", "Cutoff", "Fees", "Courses", "Placements", "Campus Life", "Reviews"];
const tabKey = (t) => t.toLowerCase().split(" ")[0];

export default function CollegeDetail() {
  // Kick off the 8-year cutoff DB load when this page mounts — NOT at module
  // scope: App.jsx imports every page, so a module-level call fetched ~85 MB
  // of JoSAA CSVs on every route, including the homepage.
  useEffect(() => { loadCutoffDB(); }, []);

  const { slug } = useParams();
  const [sp, setSp] = useSearchParams();
  const nav = useNavigate();
  const baseCollege = COLLEGE_BY_SLUG[slug];
  // Overlay real, verified fees/placements from collegeStats.js when present.
  // Any field not supplied there falls back to the base (illustrative) value,
  // so a half-filled entry is safe. Colleges with no entry are unchanged.
  const stats = baseCollege ? getCollegeStats(baseCollege.slug) : null;
  const college = baseCollege && stats
    ? {
        ...baseCollege,
        fees: { ...baseCollege.fees, ...(stats.fees || {}) },
        placements: { ...baseCollege.placements, ...(stats.placements || {}) },
      }
    : baseCollege;

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
        <Seo title="College not found" robots="noindex, follow" path={`/colleges/${slug}`} />
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

  // Clean the About copy for display: drop the internal "(Illustrative profile …)"
  // note and fix the "is an National…" grammar so the page reads professionally.
  const aboutText = (college.about || "")
    .replace(/\s*\(Illustrative profile[^)]*\)\s*/gi, " ")
    .replace(/\bis an National\b/g, "is a National")
    .replace(/\s{2,}/g, " ")
    .trim();

  // ── SEO: per-college title, description and structured data ───────────────
  const seoYear = new Date().getFullYear();
  const seoTitle = `${college.name} Review ${seoYear}: Cutoffs, Placements, Fees & Ranking`;
  const seoDesc =
    `${college.name} review ${seoYear}${college.location ? ` (${college.location})` : ""} — ` +
    `is it worth it? See NIRF ranking, JoSAA cutoffs, branch-wise placements, average package, ` +
    `fees, hostel details and honest student reviews. Check your admission chances free with the ` +
    `CollegeParichay JEE rank predictor — built by IIT Roorkee alumni.`;
  const seoImage = college.heroImage
    ? SITE_URL + encodeURI(college.heroImage)
    : undefined;
  const seoJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollegeOrUniversity",
        "@id": `${SITE_URL}/colleges/${college.slug}#college`,
        name: college.name,
        url: `${SITE_URL}/colleges/${college.slug}`,
        description: aboutText || seoDesc,
        ...(college.estd ? { foundingDate: String(college.estd) } : {}),
        ...(college.website ? { sameAs: college.website } : {}),
        address: {
          "@type": "PostalAddress",
          addressLocality: college.location || college.state || "India",
          ...(college.state ? { addressRegion: college.state } : {}),
          addressCountry: "IN",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Colleges", item: `${SITE_URL}/colleges` },
          { "@type": "ListItem", position: 3, name: `${college.type} Colleges`, item: `${SITE_URL}/colleges?type=${college.type}` },
          { "@type": "ListItem", position: 4, name: college.name, item: `${SITE_URL}/colleges/${college.slug}` },
        ],
      },
    ],
  };

  return (
    <div className="page">
      <Seo
        title={seoTitle}
        description={seoDesc}
        path={`/colleges/${college.slug}`}
        image={seoImage}
        jsonLd={seoJsonLd}
      />

      {/* ── Hero — clean: image + one readability gradient + a subtle accent ──── */}
      <section style={{
        position: "relative", color: "#fff",
        padding: "108px 0 52px", overflow: "hidden",
        minHeight: 400,
        background: "linear-gradient(135deg, #15152e, #0d0d1f)",
      }}>
        {/* Background image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("${encodeURI(college.heroImage)}")`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }} />

        {/* Single top-to-bottom gradient for text legibility */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(10,10,24,.30) 0%, rgba(10,10,24,.46) 52%, rgba(10,10,24,.88) 100%)",
        }} />

        {/* One subtle brand-colour glow in the top corner */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: `radial-gradient(ellipse 55% 60% at 100% 0%, ${college.accent}33, transparent 60%)`,
        }} />

        {/* Static accent line at the bottom edge */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 3, zIndex: 3,
          background: `linear-gradient(90deg, transparent, ${college.accent}, transparent)`,
        }} />

        <div className="container" style={{ position: "relative", zIndex: 4 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button onClick={() => nav(-1)} className="cp-back-btn" style={{ marginBottom: 20 }}>
              <ArrowLeft size={16} /> Back
            </button>
          </motion.div>

          <div style={{
            display: "flex", justifyContent: "space-between",
            flexWrap: "wrap", gap: 20, alignItems: "flex-end",
          }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <span
                className="badge orange"
                style={{ display: "inline-flex", gap: 4, alignItems: "center" }}
              >
                <Trophy size={12} /> NIRF #{college.nirf} · {college.type}
              </span>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  fontFamily: "Sora", fontWeight: 800,
                  fontSize: "clamp(1.8rem,4vw,2.6rem)", margin: "10px 0 6px",
                  textShadow: "0 2px 18px rgba(0,0,0,.45)", lineHeight: 1.2,
                }}
              >
                {college.name}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,.88)", fontSize: 15 }}
              >
                <MapPin size={16} /> {college.location} · Estd {college.estd}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}
            >
              <a href={college.website} target="_blank" rel="noreferrer" className="btn btn-coral btn-glow">
                <Globe size={16} /> Official Website
              </a>
              <button
                className="btn btn-light"
                onClick={() => nav(college.type === "IIT" ? "/jee-advanced#college" : "/jee-main#college")}
              >
                <Crosshair size={16} /> Check if I qualify
              </button>
              <SaveButton slug={college.slug} label />
              <CompareButton slug={college.slug} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Quick stats ──────────────────────────────────────────────────────── */}
      <div className="container" style={{ marginTop: 24, marginBottom: 8 }}>
        <div className="grid-4" style={{ gap: 14 }}>
          {[
            ["Avg package", fmtINR(college.placements.avg),         "var(--navy)",   "#1c1c28"],
            ["Highest",     fmtINR(college.placements.highest),      "var(--green)",  "#15a06e"],
            ["Placed",      `${college.placements.placedPct}%`,      "var(--orange)", "#FF693D"],
            ["Total fees",  `${fmtINR(totalFee)}/yr`,                "var(--violet)", "#FF693D"],
          ].map(([l, v, c, hex], i) => (
            <motion.div
              key={l}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{
                y: -6,
                boxShadow: `0 0 0 2px ${hex}44, 0 20px 50px ${hex}22`,
                borderColor: `${hex}55`,
              }}
              style={{ textAlign: "center", padding: "18px 12px", position: "relative", overflow: "hidden" }}
            >
              {/* Top accent bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${hex}, transparent)`, opacity: 0.6 }} />
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{l}</div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.3rem", color: c }}>{v}</div>
            </motion.div>
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
                <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{aboutText}</p>
                <div style={{
                  marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--line)",
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px",
                }}>
                  {[
                    ["NIRF Rank",   `#${college.nirf}`],
                    ["Type",        college.type],
                    ["Established", college.estd],
                    ["State",       college.state],
                    ["Location",    college.location],
                    ["Counselling", college.counsellingExam],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".5px" }}>{k}</div>
                      <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: 14, marginTop: 3 }}>{v}</div>
                    </div>
                  ))}
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
                    colors={["#FF693D","#2EC4B6","#0EA5A4","#FF693D","#0EA5A4","#F4A261"]}
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
              <div className="card">
                <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 4 }}>Seat matrix (approx.)</h4>
                <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
                  Indicative seats per branch and category. Verify the official seat matrix on josaa.nic.in.
                </p>
                <p className="table-scroll-hint">← Swipe sideways to see every category →</p>
                <div className="table-scroll">
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
                    colors={["#FF693D","#2EC4B6","#0EA5A4","#0EA5A4"]}
                    height={240}
                    fmt={fmtINR}
                  />
                </div>
                <div className="card">
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 12 }}>
                    Cost summary
                  </h4>
                  <div className="fee-rows">
                    {feeData.map((f) => (
                      <div key={f.name} className="fee-row">
                        <span className="fee-row-label">{f.name}</span>
                        <span className="fee-row-value">{fmtINR(f.value)}</span>
                      </div>
                    ))}
                    <div className="fee-row fee-row-total">
                      <span className="fee-row-label">Total / year</span>
                      <span className="fee-row-value" style={{ color: "var(--coral)" }}>{fmtINR(totalFee)}</span>
                    </div>
                    <div className="fee-row fee-row-total">
                      <span className="fee-row-label">Approx 4-year cost</span>
                      <span className="fee-row-value" style={{ color: "var(--navy)" }}>{fmtINR(totalFee * 4)}</span>
                    </div>
                  </div>
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
                  bars={[{ key: "value", label: "Avg package", color: "#FF693D" }]}
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

              {/* ── Location — full-width premium card. The embedded map was
                     dropped; "Open in Maps" hands off to Google Maps instead. ── */}
              <div className="card" style={{ overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "rgba(255, 105, 61, .1)",
                    border: "1px solid rgba(255, 105, 61, .25)",
                    display: "grid", placeItems: "center", flexShrink: 0,
                  }}>
                    <MapPin size={18} color="var(--coral)" />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 16, margin: 0 }}>Location</h4>
                    <p style={{ color: "var(--muted)", fontSize: 13, margin: 0, marginTop: 2 }}>
                      {college.location}
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(college.name + " " + (college.location || ""))}`}
                    target="_blank" rel="noreferrer"
                    style={{
                      marginLeft: "auto", display: "flex", alignItems: "center", gap: 5,
                      background: "rgba(255, 105, 61, .1)", border: "1px solid rgba(255, 105, 61, .25)",
                      borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600,
                      color: "#FF693D", textDecoration: "none", whiteSpace: "nowrap",
                    }}
                  >
                    Open in Maps <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="grid-2" style={{ gap: 22, alignItems: "start" }}>
                {/* ── Virtual Tour & Videos — redesigned card ── */}
                <div className="card" style={{ overflow: "hidden", position: "relative" }}>
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: "linear-gradient(90deg, #FF693D, #f97316, #FF693D)",
                  }} />
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 4,
                    display: "flex", alignItems: "center", gap: 8 }}>
                    <Youtube size={18} color="var(--coral)" /> Virtual tour & videos
                  </h4>
                  <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
                    Watch real campus tours, placement talks and student vlogs.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      ["🎬", "Campus tour",         `${college.name} campus tour`],
                      ["💼", "Placement reviews",   `${college.name} placements review`],
                      ["🎓", "Student vlog / life", `${college.name} student life vlog`],
                    ].map(([emoji, label, query]) => (
                      <a
                        key={label}
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
                        target="_blank" rel="noreferrer"
                        style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "12px 14px", background: "var(--sky)", borderRadius: 12,
                          color: "var(--navy)", fontWeight: 600, fontSize: 14,
                          border: "1px solid rgba(255, 105, 61, .1)",
                          textDecoration: "none",
                          transition: "all .2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 105, 61, .08)"; e.currentTarget.style.borderColor = "rgba(255, 105, 61, .25)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--sky)"; e.currentTarget.style.borderColor = "rgba(255, 105, 61, .1)"; }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 16 }}>{emoji}</span> {label}
                        </span>
                        <ExternalLink size={14} color="var(--muted)" />
                      </a>
                    ))}
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(college.name)}/@${college.coords?.lat || ""},${college.coords?.lng || ""},17z`}
                      target="_blank" rel="noreferrer"
                      style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "12px 14px", background: "rgba(14, 165, 164, .06)", borderRadius: 12,
                        color: "var(--navy)", fontWeight: 600, fontSize: 14,
                        border: "1px solid rgba(14, 165, 164, .15)",
                        textDecoration: "none",
                        transition: "all .2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(14, 165, 164, .12)"; e.currentTarget.style.borderColor = "rgba(14, 165, 164, .3)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(14, 165, 164, .06)"; e.currentTarget.style.borderColor = "rgba(14, 165, 164, .15)"; }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 16 }}>🗺️</span> Street View & 360° on Maps
                      </span>
                      <ExternalLink size={14} color="var(--muted)" />
                    </a>
                  </div>
                </div>

                {/* ── Campus Highlights — redesigned card ── */}
                <div className="card" style={{ overflow: "hidden", position: "relative" }}>
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: "linear-gradient(90deg, #0ea5a4, #22c55e, #0ea5a4)",
                  }} />
                  <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 4,
                    display: "flex", alignItems: "center", gap: 8 }}>
                    <Building2 size={18} color="var(--teal)" /> Campus highlights
                  </h4>
                  <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
                    What makes {college.name} campus special.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      ["🏠", "Fully residential campus", "Multiple hostels with modern amenities"],
                      ["🎭", "Active societies", "Technical, cultural & sports clubs"],
                      ["📚", "Central library", "Sports complex & medical centre"],
                      ["🚀", "Startup incubation", "Research park & innovation labs"],
                      ["🌐", "Wi-Fi campus", "24/7 internet & smart classrooms"],
                    ].map(([emoji, title, sub]) => (
                      <div key={title} style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 14px", background: "rgba(14, 165, 164, .04)",
                        borderRadius: 12, border: "1px solid rgba(14, 165, 164, .1)",
                      }}>
                        <span style={{
                          fontSize: 18, width: 36, height: 36, borderRadius: 10,
                          background: "rgba(14, 165, 164, .08)",
                          display: "grid", placeItems: "center", flexShrink: 0,
                        }}>{emoji}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--navy)" }}>{title}</div>
                          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
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