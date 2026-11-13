import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  ChevronDown,
  Sparkles,
  Award,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Users,
  ShieldCheck,
  Zap,
  Target
} from "lucide-react";
import "../../styles/seo-cluster.css";

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

/**
 * Horizontal cluster navigation bar for Google crawl authority and easy user traversal.
 */
export function ClusterNav({ currentPath }) {
  return (
    <div className="scp-cluster-nav" aria-label="JEE Mentorship and Preparation Topic Cluster">
      <div className="scp-container">
        <div className="scp-cluster-nav-inner">
          <span style={{ fontSize: "0.74rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--scp-faint)", marginRight: 4, flexShrink: 0 }}>
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
    </div>
  );
}

/**
 * Standardized High-Impact SEO Hero
 */
export function ClusterHero({
  badge = "JEE MENTORSHIP PROGRAM",
  title = "Personalized JEE Mentorship Program",
  description = "Get 1-to-1 guidance from top IITians, daily personalized study plans, test analytics, and backlog clearance.",
  stats = [
    { value: "1-on-1", label: "Personal IITian Mentor", color: "brand" },
    { value: "+45-60", label: "Avg Marks Jump in 60 Days", color: "emerald" },
    { value: "24/7", label: "WhatsApp Doubt Support", color: "violet" },
    { value: "₹3,499", label: "Till JEE Mains 2027", color: "brand" }
  ],
  ctaText = "Enroll in Mentorship · ₹3,499",
  ctaLink = "/mentorship/jee-2027",
  secondaryText = "Explore Topic Hub",
  secondaryLink = "#details"
}) {
  return (
    <section className="scp-hero">
      <div className="scp-container">
        <div className="scp-badge">
          <span className="scp-badge-dot" />
          <span>{badge}</span>
        </div>
        <h1 className="scp-h1">{title}</h1>
        <p className="scp-hero-desc">{description}</p>
        <div className="scp-hero-actions">
          <Link to={ctaLink} className="scp-btn-primary">
            {ctaText} <ArrowRight size={16} />
          </Link>
          {secondaryLink.startsWith("#") ? (
            <a
              href={secondaryLink}
              className="scp-btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                const el = document.querySelector(secondaryLink);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {secondaryText}
            </a>
          ) : (
            <Link to={secondaryLink} className="scp-btn-secondary">
              {secondaryText}
            </Link>
          )}
        </div>

        {stats && stats.length > 0 && (
          <div className="scp-stat-grid">
            {stats.map((s, i) => (
              <div key={i} className="scp-stat-card">
                <div className={`scp-stat-val ${s.color || "brand"}`}>{s.value}</div>
                <div className="scp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * High-converting CTA block linking directly to CampusPoint Mentorship
 */
export function ClusterCta({
  title = "Get Your Dedicated IITian Mentor Today",
  subtitle = "Don't gamble with generic batch coachings. Work 1-on-1 with an IIT Roorkee top ranker who tracks your daily study log, analyzes every test mistake, and guarantees your personal preparation roadmap.",
  primaryText = "Join JEE 2027 Mentorship · ₹3,499",
  primaryLink = "/mentorship/jee-2027",
  secondaryText = "View Mentorship Variants",
  secondaryLink = "/mentorship"
}) {
  return (
    <div className="scp-container">
      <div className="scp-cta-box">
        <div className="scp-cta-content">
          <h3>{title}</h3>
          <p>{subtitle}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", color: "#A1A1AA" }}>
              <ShieldCheck size={16} color="#10B981" /> Verified IITian Mentors
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", color: "#A1A1AA" }}>
              <Zap size={16} color="#FF693D" /> Instant WhatsApp Access
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 260 }}>
          <Link to={primaryLink} className="scp-btn-primary" style={{ justifyContent: "center" }}>
            {primaryText} <ArrowRight size={16} />
          </Link>
          <Link to={secondaryLink} className="scp-btn-secondary" style={{ justifyContent: "center", background: "rgba(255,255,255,0.08)", color: "#FFFFFF", borderColor: "rgba(255,255,255,0.2)" }}>
            {secondaryText}
          </Link>
          <span style={{ textAlign: "center", fontSize: "0.78rem", color: "#9CA3AF" }}>
            Backed by IIT Roorkee alumni & top rankers
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive Accordion FAQ with schema generator
 */
export function ClusterFaq({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!items.length) return null;

  return (
    <div className="scp-faq-list">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="scp-faq-item">
            <button
              type="button"
              className="scp-faq-btn"
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
              {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
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
 * Cross-linking card grid to sibling cluster pages
 */
export function ClusterRelated({ currentPath, selectedPaths = [] }) {
  const pagesToShow = selectedPaths.length
    ? CLUSTER_PAGES.filter((p) => selectedPaths.includes(p.path))
    : CLUSTER_PAGES.filter((p) => p.path !== currentPath).slice(0, 4);

  return (
    <div className="scp-topic-cloud">
      {pagesToShow.map((page) => (
        <Link key={page.path} to={page.path} className="scp-topic-link">
          <span>{page.label}</span>
          <ChevronRight size={16} />
        </Link>
      ))}
    </div>
  );
}
