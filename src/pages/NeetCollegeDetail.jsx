import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, ArrowLeft, Stethoscope, Building2, Users, CalendarDays,
  Landmark, GraduationCap, Youtube, ExternalLink, Map as MapIcon, Crosshair,
} from "lucide-react";
import { NEET_BY_SLUG, neetByState } from "../data/neetColleges.js";
import Seo, { SITE_URL } from "../components/Seo.jsx";
import Reveal from "../components/Reveal.jsx";

const fmt = (n) => (n == null ? "—" : n.toLocaleString("en-IN"));

export default function NeetCollegeDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const college = NEET_BY_SLUG[slug];

  const similar = useMemo(
    () => (college ? neetByState(college.state).filter((c) => c.slug !== college.slug).slice(0, 6) : []),
    [college]
  );

  if (!college) {
    return (
      <div className="page container" style={{ padding: "120px 0", textAlign: "center" }}>
        <Seo title="Medical college not found" robots="noindex, follow" path={`/neet-colleges/${slug}`} />
        <h2>Medical college not found</h2>
        <Link to="/neet-colleges" className="btn btn-coral" style={{ marginTop: 16 }}>Back to all medical colleges</Link>
      </div>
    );
  }

  const accent = college.govt ? "#15a06e" : "#8b5cf6";
  const mgmtLabel = college.govt ? "Government" : college.management;
  const place = [college.district, college.state].filter(Boolean).join(", ");

  const about =
    `${college.name} is ${college.govt ? "a government" : `a ${college.management.toLowerCase()}-run`} ` +
    `MBBS medical college located in ${place}. ` +
    (college.year ? `Established in ${college.year}, it ` : "It ") +
    `offers an MBBS programme with an approved annual intake of ${fmt(college.seats)} seats` +
    (college.university ? `, and is affiliated to ${college.university}.` : ".") +
    ` Admission is through NEET UG followed by MCC / state counselling. ` +
    `Figures are from the NMC 2024-25 seat matrix — verify the latest intake on the official MCC / NMC portals before counselling.`;

  const seoTitle = `${college.name} — MBBS Seats, NEET Cutoff, Fees & Admission ${new Date().getFullYear()}`;
  const seoDesc =
    `${college.name} (${place}) — ${mgmtLabel} MBBS medical college` +
    (college.year ? `, established ${college.year}` : "") +
    `, with ${fmt(college.seats)} MBBS seats` +
    (college.university ? `, affiliated to ${college.university}` : "") +
    `. NEET UG admission, counselling and college details on CollegeParichay.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollegeOrUniversity",
        "@id": `${SITE_URL}/neet-colleges/${college.slug}#college`,
        name: college.name,
        url: `${SITE_URL}/neet-colleges/${college.slug}`,
        description: about,
        ...(college.year ? { foundingDate: String(college.year) } : {}),
        address: { "@type": "PostalAddress", addressLocality: college.district || college.state, addressRegion: college.state, addressCountry: "IN" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "NEET Medical Colleges", item: `${SITE_URL}/neet-colleges` },
          { "@type": "ListItem", position: 3, name: college.name, item: `${SITE_URL}/neet-colleges/${college.slug}` },
        ],
      },
    ],
  };

  const stats = [
    ["MBBS seats", fmt(college.seats), accent],
    ["Management", mgmtLabel, "#1c1c28"],
    ["Established", college.year || "—", "#F15A38"],
    ["State", college.state, "#3b3b98"],
  ];

  return (
    <div className="page">
      <Seo title={seoTitle} description={seoDesc} path={`/neet-colleges/${college.slug}`} jsonLd={jsonLd} />

      {/* Hero */}
      <section style={{ position: "relative", color: "#fff", padding: "108px 0 52px", overflow: "hidden", minHeight: 320, background: "linear-gradient(135deg, #0d2a20, #0d0d1f)" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: `radial-gradient(ellipse 55% 60% at 100% 0%, ${accent}44, transparent 60%)` }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, zIndex: 3, background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
        <div className="container" style={{ position: "relative", zIndex: 4 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <button onClick={() => nav(-1)} className="btn btn-light" style={{ marginBottom: 20 }}><ArrowLeft size={16} /> Back</button>
          </motion.div>
          <span className="badge orange" style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
            <Stethoscope size={12} /> {mgmtLabel} · MBBS
          </span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.7rem,4vw,2.5rem)", margin: "10px 0 6px", textShadow: "0 2px 18px rgba(0,0,0,.45)", lineHeight: 1.2 }}>
            {college.name}
          </motion.h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,.88)", fontSize: 15 }}>
            <MapPin size={16} /> {place}{college.year ? ` · Estd ${college.year}` : ""}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
            <button className="btn btn-coral btn-glow" onClick={() => nav("/neet")}><Crosshair size={16} /> NEET rank & counselling</button>
            <a className="btn btn-light" href={`https://www.google.com/maps/search/${encodeURIComponent(college.name + " " + college.state)}`} target="_blank" rel="noreferrer"><MapIcon size={16} /> View on Maps</a>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <div className="container" style={{ marginTop: 24, marginBottom: 8 }}>
        <div className="grid-4" style={{ gap: 14 }}>
          {stats.map(([l, v, hex], i) => (
            <motion.div key={l} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: i * 0.08 }}
              style={{ textAlign: "center", padding: "18px 12px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${hex}, transparent)`, opacity: 0.6 }} />
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{l}</div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.15rem", color: hex }}>{v}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="container" style={{ marginTop: 28, paddingBottom: 60 }}>
        <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
          <div className="card">
            <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8 }}>About this college</h3>
            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{about}</p>
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--line)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>
              {[
                ["Management", mgmtLabel],
                ["MBBS seats", fmt(college.seats)],
                ["Established", college.year || "—"],
                ["District", college.district || "—"],
                ["State / UT", college.state],
                ["Admission via", "NEET UG"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".5px" }}>{k}</div>
                  <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: 14, marginTop: 3 }}>{v}</div>
                </div>
              ))}
            </div>
            {college.university && (
              <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "flex-start", background: "var(--sky)", borderRadius: 12, padding: "12px 14px" }}>
                <GraduationCap size={18} color={accent} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".5px" }}>Affiliating university</div>
                  <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: 14, marginTop: 2 }}>{college.university}</div>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="card">
              <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <Landmark size={18} color={accent} /> NEET admission & counselling
              </h4>
              <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6 }}>
                MBBS seats here are filled through NEET UG. {college.govt
                  ? "15% of seats go to the All-India Quota (MCC) and 85% to the state quota."
                  : "Seats are filled via state counselling, management and (where applicable) NRI quotas."}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                {[
                  ["NEET rank predictor & guidance", "/neet"],
                  [`More medical colleges in ${college.state}`, `/neet-colleges?state=${encodeURIComponent(college.state)}`],
                  ["All MBBS colleges in India", "/neet-colleges"],
                ].map(([label, to]) => (
                  <Link key={label} to={to} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: "var(--sky)", borderRadius: 10, color: "var(--navy)", fontWeight: 600, fontSize: 14 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 9 }}><Landmark size={15} color={accent} /> {label}</span>
                    <ExternalLink size={14} color="var(--muted)" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="card">
              <h4 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <Youtube size={18} color="var(--coral)" /> Campus tour & reviews
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["Campus tour", `${college.name} campus tour`],
                  ["MBBS reviews & cutoff", `${college.name} MBBS review NEET cutoff`],
                ].map(([label, query]) => (
                  <a key={label} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`} target="_blank" rel="noreferrer"
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: "var(--sky)", borderRadius: 10, color: "var(--navy)", fontWeight: 500, fontSize: 14 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 9 }}><Youtube size={16} color="var(--coral)" /> {label}</span>
                    <ExternalLink size={14} color="var(--muted)" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Similar colleges in state */}
        {similar.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <div className="title-bar" style={{ alignItems: "flex-start", textAlign: "left", margin: "0 0 1.2rem" }}>
              <span className="eyebrow"><Building2 size={12} /> Same state</span>
              <h2 className="section-title" style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)" }}>More MBBS colleges in {college.state}</h2>
            </div>
            <div className="grid-3">
              {similar.map((c, i) => (
                <Reveal key={c.slug} delay={i * 0.05}>
                  <div className="card" style={{ height: "100%", cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 }} onClick={() => nav(`/neet-colleges/${c.slug}`)}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span className="badge" style={{ background: `${c.govt ? "#15a06e" : "#8b5cf6"}18`, color: c.govt ? "#15a06e" : "#8b5cf6" }}>{c.govt ? "Government" : c.management}</span>
                      <span className="badge teal"><Users size={11} /> {fmt(c.seats)} seats</span>
                    </div>
                    <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1rem", color: "var(--navy)" }}>{c.name}</h3>
                    <div style={{ fontSize: 12.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 5 }}><MapPin size={12} /> {c.district || c.state}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
