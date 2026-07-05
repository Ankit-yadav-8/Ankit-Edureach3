import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, ExternalLink, MapPin, Sparkles, CheckCircle2 } from "lucide-react";
import { PRIVATE_BY_SLUG } from "../data/counselling.js";
import { CenterDonut } from "../components/Charts.jsx";
import { fmtINR } from "../utils/format.js";
import Reveal from "../components/Reveal.jsx";
import Seo, { SITE_URL } from "../components/Seo.jsx";

export default function PrivateDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const u = PRIVATE_BY_SLUG[slug];
  if (!u) return <div className="page container" style={{ padding: "80px 0", textAlign: "center" }}><Seo title="University not found" robots="noindex, follow" path={`/private/${slug}`} /><h2>University not found</h2><Link to="/private-universities" className="btn btn-coral" style={{ marginTop: 16 }}>Private universities</Link></div>;

  const placeData = [
    { name: "Avg package", value: u.placements.avg },
    { name: "Highest", value: u.placements.highest },
  ];

  // ── SEO: per-university review-intent title, description & structured data ──
  const seoYear = new Date().getFullYear();
  const seoTitle = `${u.name} Review ${seoYear}: Fees, Placements, Admission & Courses`;
  const seoDesc =
    `${u.name} review ${seoYear}${u.state ? ` (${u.state})` : ""} — is it worth it? ` +
    `Fees ${u.fees}, branch-wise placements (avg & highest package), ${u.exam} admission, ` +
    `courses and an honest breakdown. Compare with IITs/NITs/IIITs free on CollegeParichay.`;
  const seoJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollegeOrUniversity",
        "@id": `${SITE_URL}/private/${slug}#university`,
        name: u.name,
        url: `${SITE_URL}/private/${slug}`,
        description: seoDesc,
        ...(u.website ? { sameAs: u.website } : {}),
        address: {
          "@type": "PostalAddress",
          addressRegion: u.state || "India",
          addressCountry: "IN",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Private Universities", item: `${SITE_URL}/private-universities` },
          { "@type": "ListItem", position: 3, name: u.name, item: `${SITE_URL}/private/${slug}` },
        ],
      },
    ],
  };

  return (
    <div className="page">
      <Seo title={seoTitle} description={seoDesc} path={`/private/${slug}`} jsonLd={seoJsonLd} />
      <section className="warm-page-header" style={{ padding: "40px 0" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: `radial-gradient(ellipse 60% 70% at 100% 20%, ${u.accent}30 0%, transparent 60%)` }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 40% 50% at 0% 100%, rgba(244,162,97,.18) 0%, transparent 60%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <button onClick={() => nav(-1)} className="cp-back-btn" style={{ marginBottom: 18 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <span className="eyebrow">Private University · {u.exam}</span>
          <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", margin: "10px 0 4px", color: "#1c1c28" }}>{u.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(28,28,40,.65)", marginTop: 6 }}><MapPin size={16} color="#FF693D" /> {u.state} · Fees {u.fees}</div>
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <a
              href={u.apply}
              target="_blank"
              rel="noreferrer"
              className="btn btn-coral"
              style={{ fontWeight: 700, boxShadow: "0 6px 18px rgba(255, 105, 61,.32)" }}
            >
              Apply Now <ExternalLink size={15} />
            </a>
            <a
              href={u.website}
              target="_blank"
              rel="noreferrer"
              className="btn"
              style={{
                background: "var(--page-bg)",
                color: "#E0421F",
                border: "1.5px solid rgba(255, 105, 61,.4)",
                fontWeight: 700,
                transition: "all .2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 105, 61,.09)"; e.currentTarget.style.borderColor = "#FF693D"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "rgba(255, 105, 61,.4)"; }}
            >
              <Globe size={15} /> Website
            </a>
          </div>
        </div>
      </section>

      <div className="container section">
        <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
          <Reveal>
            <div className="card">
              <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8 }}>About</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{u.about}</p>
              <h4 style={{ fontFamily: "Sora", fontWeight: 700, margin: "18px 0 10px", display: "flex", alignItems: "center", gap: 8 }}><Sparkles size={17} color="var(--gold)" /> Highlights</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
                {u.highlights.map((h) => <li key={h} style={{ display: "flex", gap: 9, fontSize: 14.5, color: "var(--navy)" }}><CheckCircle2 size={17} color="var(--teal)" style={{ flexShrink: 0, marginTop: 2 }} /> {h}</li>)}
              </ul>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                {u.courses.map((c) => <span key={c} className="pill" style={{ background: "var(--sky)", border: "1px solid var(--line)" }}>{c}</span>)}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="card">
              <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8 }}>Placements</h3>
              <CenterDonut data={placeData} centerLabel={`${u.placements.placedPct}%`} centerSub="placed" colors={["#2EC4B6", "#FF693D"]} height={190} />
              <div className="grid-2" style={{ gap: 12, marginTop: 12 }}>
                {[["Average", u.placements.avg], ["Highest", u.placements.highest]].map(([l, v]) => (
                  <div key={l} style={{ background: "var(--sky)", borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{l}</div>
                    <strong style={{ fontFamily: "Sora", fontSize: "1.2rem", color: "var(--navy)" }}>{fmtINR(v)}</strong>
                  </div>
                ))}
              </div>
              <span className="pill" style={{ marginTop: 14, background: "#fff3e6", color: "#FF693D" }}>Application deadline: {u.deadline}</span>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
