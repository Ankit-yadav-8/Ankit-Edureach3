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
import "../../styles/seo-cluster.css";

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
 * Cluster horizontal navigation bar.
 */
export function ClusterNav({ currentPath }) {
  return (
    <nav className="scp-cluster-nav" aria-label="JEE Mentorship & Prep Cluster">
      <div className="scp-container">
        <div className="scp-cluster-nav-inner">
          <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--mj-muted)", marginRight: 6, flexShrink: 0, fontFamily: "Space Grotesk, sans-serif" }}>
            Topic Cluster:
          </span>
          {CLUSTER_PAGES.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`scp-nav-chip ${isActive ? "active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.short}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/**
 * Glassmorphic Hero matching the signature JEE 2027 Mentorship Page.
 */
export function ClusterHero({
  badge = "🔥 Mentorship by IITians · Limited Seats",
  title,
  titlePrefix = "Personalized",
  accentWord = "JEE Mentorship",
  titleSuffix = "Program",
  description = "Get paired 1-on-1 with an IIT Roorkee top ranker. Receive daily customized study plans, question-level mock error autopsies, and backlog clearance to secure your IIT seat.",
  planKey = "mentor-jee-2027-6m",
  bullets = [
    "1-on-1 Verified IIT Roorkee Mentor",
    "Daily WhatsApp Study Log & Check-ins",
    "Question-Level Mock Error Autopsy"
  ]
}) {
  const { open: openEnrol } = useEnrol();
  const plan = MENTOR_PLANS[planKey] || { amount: 3499 };

  return (
    <header className="mj-hero-seo">
      <div className="mj-hero-bg" aria-hidden="true">
        <span className="mj-orb mj-orb-a" />
        <span className="mj-orb mj-orb-b" />
      </div>

      <div className="scp-container">
        <div className="mj-hero-inner">
          <div className="mj-hero-pill">
            <span className="mj-dot" /> {badge}
          </div>

          <h1 className="mj-hero-h1">
            {title ? (
              title
            ) : (
              <>
                {titlePrefix}{" "}
                <span className="mj-hero-accent">
                  {accentWord}
                  <svg className="mj-hero-uline" viewBox="0 0 320 14" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M5 9 C 78 3, 244 3, 315 8" />
                  </svg>
                </span>{" "}
                {titleSuffix}
              </>
            )}
          </h1>

          <p className="mj-hero-sub">{description}</p>

          <div className="mj-hero-cta">
            <button
              type="button"
              className="mj-btn-glow"
              onClick={() => openEnrol(planKey)}
            >
              Get Started · ₹{plan.amount.toLocaleString("en-IN")} <ArrowRight size={18} />
            </button>
            <button
              type="button"
              className="mj-btn-glass"
              onClick={() => {
                const el = document.getElementById("pricing");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Plans
            </button>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Hi%20CampusPoint,%20I%20want%20to%20know%20more%20about%20JEE%20mentorship`}
              target="_blank"
              rel="noopener noreferrer"
              className="mj-btn-glass"
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              Talk to Mentor <Phone size={16} />
            </a>
          </div>

          <div className="mj-hero-bullets">
            {bullets.map((b, i) => (
              <span key={i} className="mj-hero-bullet">
                <i /> {b}
              </span>
            ))}
          </div>

          {/* 3 Signature Glassmorphic Feature Cards from Mentorship */}
          <div className="mj-hero-cards">
            <div className="mj-gcard">
              <div className="mj-gcard-ic">
                <GraduationCap size={22} />
              </div>
              <h3>1-on-1 IIT Roorkee Mentors</h3>
              <p>Paired directly with verified rankers (AIR 3846 CRL, top percentiles) who cracked JEE Advanced themselves.</p>
            </div>
            <div className="mj-gcard">
              <div className="mj-gcard-ic">
                <Calendar size={22} />
              </div>
              <h3>Daily Telemetry & Study Log</h3>
              <p>Custom daily study targets, active streak tracking, and 10:30 PM nightly accountability check-ins on WhatsApp.</p>
            </div>
            <div className="mj-gcard">
              <div className="mj-gcard-ic">
                <BarChart3 size={22} />
              </div>
              <h3>Question-Level Error Autopsy</h3>
              <p>Evaluate time spent per question, eliminate silly slips and negative marks, and remediate weak topics weekly.</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * Full 2-Card Mentorship Pricing Section with direct Razorpay checkout.
 */
export function ClusterPricing({
  planKey = "mentor-jee-2027-6m",
  exam = "JEE Main & Advanced",
  sublabel = "Till JEE Mains 2027"
}) {
  const { open: openEnrol } = useEnrol();
  const indianPlan = MENTOR_PLANS[planKey] || { amount: 3499, old: 5999 };
  const intlKey = planKey.replace("-6m", "-intl");
  const intlPlan = MENTOR_PLANS[intlKey] || { amount: 13999, old: 24999 };

  return (
    <section id="pricing" className="mj-pricing-section">
      <div className="scp-container">
        <div style={{ textAlign: "center", maxWidth: 660, margin: "0 auto" }}>
          <span className="scp-kicker">Simple, Transparent Pricing</span>
          <h2 className="scp-h2">Choose your plan. Start at ₹3,499.</h2>
          <p className="scp-section-sub" style={{ margin: "12px auto 0" }}>
            Comprehensive 1-on-1 mentorship by verified IIT Roorkee rankers. Pick your region and lock in your seat today.
          </p>
        </div>

        <div className="mj-pricing-grid">
          {/* Card 1: Indian Students */}
          <div className="mj-pricing-tier">
            <div className="mj-tier-left" style={{ background: "linear-gradient(135deg, #FF7A3C 0%, #F1531F 100%)" }}>
              <span className="mj-tier-flag">🇮🇳</span>
              <span className="mj-tier-kicker">INDIAN STUDENTS</span>
              <span className="mj-tier-sub">{sublabel}</span>
              <span style={{ fontSize: "0.82rem", opacity: 0.9, textTransform: "uppercase", letterSpacing: "0.08em" }}>{exam}</span>
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
                <div className="mj-price-foot">
                  <span>◈ RAZORPAY GATEWAY</span>
                  <span>🔒 SECURE 256-BIT ENCRYPTION</span>
                </div>
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
              <span style={{ fontSize: "0.82rem", opacity: 0.9, textTransform: "uppercase", letterSpacing: "0.08em" }}>{exam}</span>
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
                <div className="mj-price-foot">
                  <span>◈ RAZORPAY GATEWAY</span>
                  <span>🔒 SECURE 256-BIT ENCRYPTION</span>
                </div>
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
        <div className="scp-section-header" style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 36px" }}>
          <span className="scp-kicker">Guidance From Verified IITians</span>
          <h2 className="scp-h2">Founded & Mentored by IIT Roorkee Students</h2>
          <p className="scp-section-sub">
            Learn from rankers who conquered the modern NTA computer-based exam format and know exactly what it takes to crack IIT:
          </p>
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
 * Related Cluster Navigation Cards.
 */
export function ClusterRelated({ currentPath, selectedPaths = [] }) {
  const pool = selectedPaths.length > 0
    ? CLUSTER_PAGES.filter((p) => selectedPaths.includes(p.path))
    : CLUSTER_PAGES.filter((p) => p.path !== currentPath).slice(0, 4);

  return (
    <div className="scp-grid-2">
      {pool.map((page) => (
        <Link key={page.path} to={page.path} className="scp-card" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--mj-coral)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Related Topic
            </span>
            <ChevronRight size={16} color="var(--mj-coral)" />
          </div>
          <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--mj-ink)", margin: "0 0 6px", fontFamily: "Sora, sans-serif" }}>
            {page.label}
          </h4>
          <span style={{ fontSize: "0.85rem", color: "var(--mj-muted)" }}>
            Explore full framework & guidance →
          </span>
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
