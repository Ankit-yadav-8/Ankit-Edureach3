import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  ChevronDown,
  Sparkles,
  Award,
  Check,
  ArrowRight,
  Users,
  ShieldCheck,
  Zap,
  Target,
  Clock,
  Phone,
  BarChart3,
  Calendar,
  Layers,
  GraduationCap
} from "lucide-react";
import { useEnrol } from "../../components/EnrolModal.jsx";
import { MENTOR_PLANS } from "../../data/mentorship.js";
import JeeBatchSelectModal from "../../components/roadmap/JeeBatchSelectModal.jsx";
import "../../styles/seo-cluster.css";
export { default as InteractiveJourneyRoadmap } from "../../components/roadmap/InteractiveJourneyRoadmap.jsx";

const WA_NUMBER = "918118826194";

export const CLUSTER_PAGES = [
  { path: "/jee-mentorship", label: "Mentorship Hub", short: "Mentorship Hub" },
  { path: "/jee-mentorship/jee-main", label: "JEE Main Mentorship", short: "JEE Main" },
  { path: "/jee-mentorship/jee-advanced", label: "JEE Advanced Mentorship", short: "JEE Advanced" },
  { path: "/jee-mentorship/1-to-1", label: "1-on-1 Mentorship", short: "1-to-1" },
  { path: "/jee-mentorship/iitian-mentor", label: "IITian Mentors", short: "IITian Mentors" },
  { path: "/jee-mentorship/test-analysis", label: "Test Analysis", short: "Test Analysis" },
  { path: "/jee-mentorship/droppers", label: "Dropper Mentorship", short: "Droppers" },
  { path: "/jee-mentorship/class-11", label: "Class 11 Mentorship", short: "Class 11" },
  { path: "/jee-mentorship/class-12", label: "Class 12 Mentorship", short: "Class 12" },
  { path: "/jee-preparation/study-plan", label: "Study Plan & Timetable", short: "Study Plan" },
  { path: "/jee-preparation/backlog", label: "Backlog Clearance", short: "Backlog Recovery" },
  { path: "/jee-preparation/strategy", label: "Preparation Strategy", short: "Strategy" },
  { path: "/jee-preparation", label: "JEE Prep Hub", short: "Prep Hub" },
];

const INCLUDED_FEATURES = [
  "1-on-1 dedicated IITian mentor from IIT Roorkee / top IITs",
  "Daily customized study timetable & question targets",
  "Weekly private 1-on-1 strategy video calls",
  "24/7 WhatsApp doubt solving & motivation support",
  "Question-level mock test mistake autopsy & error diary",
  "Proven 70-30 backlog eradication roadmap",
  "Automated weekly parent audit reports & progress logs",
  "Rank prediction & JoSAA / CSAB college choice counseling"
];

/**
 * Cluster horizontal navigation bar with seamless infinite auto-scroll
 * and edge white shadow fade effects.
 */
export function ClusterNav({ currentPath }) {
  const pages = [...CLUSTER_PAGES, ...CLUSTER_PAGES];

  return (
    <nav className="scp-cluster-nav" aria-label="JEE Mentorship & Prep Cluster">
      <div className="scp-container">
        <div className="scp-cluster-nav-wrapper">
          <div className="scp-cluster-nav-fade-left" aria-hidden="true" />
          <div className="scp-cluster-nav-fade-right" aria-hidden="true" />
          <div className="scp-cluster-nav-viewport">
            <div className="scp-cluster-nav-track">
              {pages.map((item, index) => {
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={`${item.path}-${index}`}
                    to={item.path}
                    className={`scp-nav-chip ${isActive ? "active" : ""}`}
                    aria-current={isActive && index < CLUSTER_PAGES.length ? "page" : undefined}
                  >
                    {item.short}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

/**
 * Clean, modern editorial Hero tailored to CampusPoint brand theme.
 * Two refined lines (reduced letter boldness) + brand pill + theme buttons + illustration.
 */
export function ClusterHero({
  title,
  line1,
  line2Lead,
  line2Box,
  // Legacy props fallback
  titlePrefix,
  accentWord,
  titleSuffix,
  subtitle,
  description,
  planKey = "mentor-jee-2027-6m",
  bullets = [],
  heroImage = "/images/jee_mentor_kit_hero_transparent.webp",
  heroImageFallback = "/images/jee_mentor_kit_hero.jpg"
}) {
  const { open: openEnrol } = useEnrol();
  const [showBatchModal, setShowBatchModal] = useState(false);
  const plan = MENTOR_PLANS[planKey] || { amount: 3499 };

  // Smart resolution for the 2 strong lines:
  const resolvedLine1 =
    line1 ||
    (titlePrefix ? `${titlePrefix} 1-on-1` : "Personalized 1-on-1");
  const resolvedLine2Lead =
    line2Lead !== undefined
      ? line2Lead
      : (titleSuffix && titleSuffix.toLowerCase().includes("iit") ? "by" : "for your");
  const resolvedLine2Box =
    line2Box ||
    (accentWord ? `${accentWord}.` : "JEE Mentorship.");

  const subtext =
    subtitle ||
    description ||
    "Direct daily guidance from IIT Roorkee rankers to manage study schedules, clear backlogs, and secure top ranks.";

  return (
    <header className="mj-hero-seo">
      <div className="scp-container">
        <div className="mj-hero-seo-grid">
          {/* Left Column: Two Refined Lines + Subtext + Brand Action Buttons */}
          <div className="mj-hero-copy-col">
            <h1 className="mj-hero-h1">
              {title ? (
                title
              ) : (
                <>
                  <span className="mj-hero-line1">{resolvedLine1}</span>
                  <span className="mj-hero-line2">
                    {resolvedLine2Lead && (
                      <span className="mj-hero-line2-lead">{resolvedLine2Lead} </span>
                    )}
                    <span className="mj-hero-brand-pill">
                      {resolvedLine2Box}
                    </span>
                  </span>
                </>
              )}
            </h1>

            {subtext && (
              <p className="mj-hero-sub">
                {subtext}
              </p>
            )}

            <div className="mj-hero-brand-actions">
              <button
                type="button"
                className="mj-btn-brand"
                onClick={() => setShowBatchModal(true)}
              >
                Get Started · ₹{plan.amount.toLocaleString("en-IN")} <ArrowRight size={17} />
              </button>
              <button
                type="button"
                className="mj-btn-outline"
                onClick={() => {
                  const el = document.getElementById("pricing");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore Plans <ArrowRight size={17} />
              </button>
            </div>

            <div className="mj-hero-wa-hint">
              <a
                href={`https://wa.me/${WA_NUMBER}?text=Hi%20CampusPoint,%20I%20want%20to%20know%20more%20about%20JEE%20mentorship`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone size={14} /> Have questions? Chat with an IITian Mentor on WhatsApp
              </a>
            </div>

            {bullets && bullets.length > 0 && (
              <div className="mj-hero-bullets">
                {bullets.map((b, i) => (
                  <span key={i} className="mj-hero-bullet">
                    <i /> {b}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Hero Illustration Visual */}
          <div className="mj-hero-illustration-col">
            <div className="mj-hero-illustration-wrapper">
              <picture>
                <source srcSet={heroImage} type="image/webp" />
                <img
                  src={heroImageFallback}
                  alt="JEE Preparation and IITian Mentorship Kit Illustration"
                  className="mj-hero-illustration-img"
                  width="520"
                  height="520"
                  loading="eager"
                  fetchPriority="high"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>

      {/* Target Batch Selection Modal (JEE 2027 vs JEE 2028) */}
      <JeeBatchSelectModal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
      />
    </header>
  );
}

/**
 * Full 2-Card Mentorship Pricing Section with direct Razorpay checkout.
 */
export function ClusterPricing({
  planKey = "mentor-jee-2027-6m",
  exam = "Till JEE Mains",
  sublabel = "Till JEE Mains 2027"
}) {
  const { open: openEnrol } = useEnrol();
  const indianPlan = MENTOR_PLANS[planKey] || { amount: 3499, old: 5999 };
  const intlKey = planKey.replace("-6m", "-intl");
  const intlPlan = MENTOR_PLANS[intlKey] || { amount: 13999, old: 24999 };

  return (
    <section id="pricing" className="mj-pricing-section">
      <div className="scp-container">
        <div style={{ textAlign: "center", maxWidth: 660, margin: "0 auto 36px" }}>
          <span className="scp-kicker">Simple, Transparent Pricing</span>
          <h2 className="scp-h2">Choose your plan. Start at ₹3,499.</h2>
        </div>

        <div className="mj-pricing-grid">
          {/* Card 1: Indian Students */}
          <div className="mj-pricing-tier">
            <div className="mj-tier-left" style={{ background: "linear-gradient(135deg, #FF7A3C 0%, #F1531F 100%)" }}>
              <span className="mj-tier-flag">🇮🇳</span>
              <span className="mj-tier-kicker">INDIAN STUDENTS</span>
              <span className="mj-tier-sub">{sublabel}</span>
              <div className="mj-tier-amt">₹{indianPlan.amount.toLocaleString("en-IN")}</div>
              <div className="mj-tier-old">₹{indianPlan.old.toLocaleString("en-IN")}</div>
              <div style={{ marginTop: 16, padding: "8px 12px", background: "rgba(0,0,0,0.18)", borderRadius: 8, fontSize: "0.75rem", lineHeight: 1.4, fontWeight: 600, color: "rgba(255,255,255,0.95)" }}>
                Valid for Indian residents. One-time payment with zero hidden fees.
              </div>
            </div>

            <div className="mj-tier-right">
              <div>
                <span className="mj-inc-lbl">EVERYTHING INCLUDED</span>
                <div className="mj-inc-list">
                  {INCLUDED_FEATURES.map((feat, idx) => (
                    <div key={idx} className="mj-inc-item">
                      <Check size={15} strokeWidth={3} color="#FF693D" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="mj-btn-dark"
                  onClick={() => openEnrol(planKey)}
                >
                  Claim Your Seat · ₹{indianPlan.amount.toLocaleString("en-IN")} <ArrowRight size={17} />
                </button>
                
              </div>
            </div>
          </div>

          {/* Card 2: International Students */}
          <div className="mj-pricing-tier mj-pricing-tier-hl">
            <span className="mj-tier-badge" style={{ background: "linear-gradient(135deg, #FF693D, #E0421F)", color: "#FFFFFF" }}>
              🌏 INTERNATIONAL
            </span>
            <div className="mj-tier-left" style={{ background: "linear-gradient(135deg, #18181B 0%, #27272A 100%)" }}>
              <span className="mj-tier-flag">🌍</span>
              <span className="mj-tier-kicker">NRI & INTERNATIONAL</span>
              <span className="mj-tier-sub">1 Year Full Mentorship</span>
              <div className="mj-tier-amt">₹{intlPlan.amount.toLocaleString("en-IN")}</div>
              <div className="mj-tier-old">₹{intlPlan.old.toLocaleString("en-IN")}</div>
              <div style={{ marginTop: 16, padding: "8px 12px", background: "rgba(255,255,255,0.1)", borderRadius: 8, fontSize: "0.75rem", lineHeight: 1.4, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                Includes international timezone coordination and NRI admission guidance.
              </div>
            </div>

            <div className="mj-tier-right">
              <div>
                <span className="mj-inc-lbl">INTERNATIONAL PRIVILEGES</span>
                <div className="mj-inc-list">
                  {INCLUDED_FEATURES.slice(0, 5).map((feat, idx) => (
                    <div key={idx} className="mj-inc-item">
                      <Check size={15} strokeWidth={3} color="#FF693D" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                  <div className="mj-inc-item" style={{ color: "#111827", fontWeight: 700 }}>
                    <Check size={15} strokeWidth={3} color="#FF693D" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>Dedicated international timezone scheduling (Gulf, US, Singapore)</span>
                  </div>
                  <div className="mj-inc-item" style={{ color: "#111827", fontWeight: 700 }}>
                    <Check size={15} strokeWidth={3} color="#FF693D" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>NRI admission guidance (DASA / CIWG scheme quota)</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="mj-btn-dark"
                  onClick={() => openEnrol(intlKey)}
                >
                  Claim International Seat · ₹{intlPlan.amount.toLocaleString("en-IN")} <ArrowRight size={17} />
                </button>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Authentic IIT Roorkee Founders & Mentors Section.
 */
export function ClusterFounders() {
  const mentors = [
    {
      name: "Ankit Kumar",
      role: "Founder & CEO, IIT Roorkee (AIR 3846 CRL, 938 OBC)",
      desc: "Having cleared JEE Advanced to reach IIT Roorkee, I know where aspirants lose marks. Our mentorship replaces passive lecture-watching with active question-solving and weekly diagnostic mistake audits."
    },
    {
      name: "Saket Kumar",
      role: "Operations Head, IIT Roorkee",
      desc: "Execution turns plans into ranks. We ensure every student receives structured daily timetables, immediate doubt unblocking, and disciplined exam temperament training."
    },
    {
      name: "Mayank Singh",
      role: "Marketing Head, IIT Roorkee",
      desc: "Mentorship is not about burying you in more material; it is about providing the exact high-yield strategy so every hour of hard work directly moves your percentile."
    }
  ];

  return (
    <section className="scp-section">
      <div className="scp-container">
        <div className="scp-section-header">
          <span className="scp-kicker">Guidance From Verified IITians</span>
          <h2 className="scp-h2">Mentorship by IIT Roorkee Rankers</h2>
        </div>

        <div className="scp-grid-3">
          {mentors.map((m, i) => (
            <div key={i} className="scp-card" style={{ borderTop: "4px solid var(--mj-coral)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--mj-coral-soft)", display: "grid", placeItems: "center", color: "var(--mj-coral-dk)", fontWeight: 800, fontSize: "1rem" }}>
                  {m.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, color: "var(--mj-ink)", fontFamily: "Sora, sans-serif" }}>
                    {m.name}
                  </h3>
                  <span style={{ fontSize: "0.78rem", color: "var(--mj-coral)", fontWeight: 700 }}>
                    {m.role}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "var(--mj-body)", margin: 0 }}>
                "{m.desc}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Backwards compatibility alias for ClusterCta: renders ClusterPricing + ClusterFounders
 */
export function ClusterCta(props) {
  return (
    <>
      <ClusterPricing
        planKey={props.planKey || "mentor-jee-2027-6m"}
        exam={props.exam || "JEE Main & Advanced"}
        sublabel={props.sublabel || "Till JEE Mains 2027"}
      />
      <ClusterFounders />
    </>
  );
}

/**
 * SEO Cluster FAQ Accordion.
 */
export function ClusterFaq({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="scp-faq-list">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="scp-faq-item">
            <button
              className="scp-faq-btn"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
              <ChevronDown
                size={18}
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  flexShrink: 0
                }}
              />
            </button>
            {isOpen && (
              <div className="scp-faq-body">
                <p style={{ margin: 0 }}>{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Related Cluster Navigation Cards (Always exactly 3 centered cards, no lower text line).
 */
export function ClusterRelated({ currentPath, selectedPaths = [] }) {
  const pool = selectedPaths.length > 0
    ? CLUSTER_PAGES.filter((p) => selectedPaths.includes(p.path)).slice(0, 3)
    : CLUSTER_PAGES.filter((p) => p.path !== currentPath).slice(0, 3);

  return (
    <div className="scp-grid-3">
      {pool.map((page) => (
        <Link
          key={page.path}
          to={page.path}
          className="scp-card"
          style={{ textDecoration: "none", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "var(--mj-coral)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "Space Grotesk, sans-serif" }}>
              Related Strategy
            </span>
            <ChevronRight size={16} color="var(--mj-coral)" />
          </div>
          <h4 style={{ fontSize: "1.08rem", fontWeight: 800, color: "var(--mj-ink)", margin: 0, fontFamily: "Sora, sans-serif", lineHeight: 1.35 }}>
            {page.label}
          </h4>
        </Link>
      ))}
    </div>
  );
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "CampusPoint",
    "url": "https://campuspoint.in",
    "logo": "https://campuspoint.in/icons/icon-512x512.png",
    "description": "Premium 1-to-1 JEE and NEET mentorship platform founded and run by IIT Roorkee students and top rankers.",
    "founder": [
      {
        "@type": "Person",
        "name": "Ankit Kumar",
        "jobTitle": "Founder & CEO",
        "alumniOf": "IIT Roorkee",
        "description": "AIR 3846 CRL in JEE Advanced, leading 1-on-1 JEE mentorship."
      },
      {
        "@type": "Person",
        "name": "Saket Kumar",
        "jobTitle": "Operations Head",
        "alumniOf": "IIT Roorkee"
      },
      {
        "@type": "Person",
        "name": "Mayank Singh",
        "jobTitle": "Marketing Head",
        "alumniOf": "IIT Roorkee"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/campuspoint",
      "https://www.linkedin.com/company/campuspoint"
    ]
  };
}

export function getArticleSchema({
  headline,
  description,
  path,
  datePublished = "2026-01-15T08:00:00+05:30",
  dateModified = "2026-03-30T10:00:00+05:30"
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "mainEntityOfPage": `https://campuspoint.in${path}`,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "author": {
      "@type": "Person",
      "name": "Ankit Kumar",
      "jobTitle": "IIT Roorkee Ranker (AIR 3846 CRL)",
      "url": "https://campuspoint.in/mentorship/jee-2027"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CampusPoint",
      "logo": {
        "@type": "ImageObject",
        "url": "https://campuspoint.in/icons/icon-512x512.png"
      }
    }
  };
}
