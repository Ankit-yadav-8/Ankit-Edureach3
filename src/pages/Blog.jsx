/* Blog — College Parichay blog index. Hero with floating preview cards, then a
   category-filtered grid of article cards that link to /blog/:slug. */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Sparkles, GitCompareArrows, Gauge, Building2,
  Brain, ListChecks, TrendingUp, ShieldCheck, Layers, Clock, ArrowRight,
  Trophy, Medal, Award,
} from "lucide-react";
import Seo from "../components/Seo.jsx";
import { CL, clEyebrow } from "../components/home/clTheme.js";
import { BLOG_POSTS } from "../data/blog.js";

const ICONS = { BookOpen, GitCompareArrows, Gauge, Building2, Brain, ListChecks, TrendingUp, ShieldCheck, Layers, Trophy, Medal, Award };
const ACCENTS = { coral: CL.coral, green: CL.green, blue: CL.blue, violet: CL.violet, amber: CL.amber };

const CATEGORIES = ["All", "NEET", "Counselling", "Strategy", "Exams", "Careers", "Colleges"];

function PostCard({ p }) {
  const Ic = ICONS[p.iconName] || BookOpen;
  const accent = ACCENTS[p.accent] || CL.coral;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      style={{ height: "100%" }}
    >
      <Link to={p.link || `/blog/${p.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
        <article style={{
          background: CL.card, borderRadius: 20, border: `1px solid ${CL.line}`,
          boxShadow: CL.shadow, padding: "22px 22px 20px", height: "100%",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <span style={{ width: 44, height: 44, borderRadius: 12, background: `${accent}18`, display: "grid", placeItems: "center" }}>
              <Ic size={21} color={accent} />
            </span>
            <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".08em", color: CL.muted, background: CL.cream2, border: `1px solid ${CL.cream3}`, padding: "4px 10px", borderRadius: 50 }}>
              {p.badge}
            </span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".04em", color: accent, marginBottom: 7, textTransform: "uppercase" }}>{p.category}</div>
          <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.08rem", color: CL.ink, lineHeight: 1.25, letterSpacing: "-0.3px", marginBottom: 9 }}>{p.title}</h3>
          <p style={{ color: CL.body, fontSize: 13.2, lineHeight: 1.6, marginBottom: 16, flex: 1 }}>{p.snippet}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: `1px solid ${CL.line}` }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: CL.muted, fontWeight: 600 }}>
              <Clock size={12} /> {p.read}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 800, color: accent, fontFamily: CL.display }}>
              Read <ArrowRight size={13} />
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

function HeroPreview() {
  const cards = BLOG_POSTS.slice(0, 3);
  return (
    <div className="blog-hero-preview" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {cards.map((p, i) => {
        const Ic = ICONS[p.iconName] || BookOpen;
        const accent = ACCENTS[p.accent] || CL.coral;
        return (
          <Link to={p.link || `/blog/${p.slug}`} key={p.slug} style={{ textDecoration: "none" }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02, x: -4 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.12 }}
              style={{ 
                display: "flex", alignItems: "center", gap: 16, 
                background: CL.card, borderRadius: 18, border: `1px solid ${CL.line}`, 
                boxShadow: CL.shadow, padding: "16px 20px",
                marginLeft: i * 24, // visual staggering step effect
                marginRight: (2 - i) * 24 // keeps overall width consistent
              }}>
              <span style={{ width: 44, height: 44, borderRadius: 12, background: `${accent}14`, border: `1px solid ${accent}28`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Ic size={20} color={accent} />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: 0.5 }}>{p.category}</span>
                  <span style={{ fontSize: 10, color: CL.muted }}>· {p.read}</span>
                </div>
                <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 13.5, color: CL.ink, lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.title}</div>
              </div>
              <span style={{ width: 32, height: 32, borderRadius: "50%", background: CL.cream2, display: "grid", placeItems: "center", flexShrink: 0 }}>
                <ArrowRight size={14} color={CL.ink2} />
              </span>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}

export default function Blog() {
  const [cat, setCat] = useState("All");
  useEffect(() => { document.title = "Blog — JEE, counselling & college insights · College Parichay"; }, []);
  const shown = cat === "All" ? BLOG_POSTS : BLOG_POSTS.filter((p) => p.category === cat);

  return (
    <div style={{ background: CL.cream, minHeight: "100vh" }}>
      <Seo title="Blog — JEE, counselling & college insights · College Parichay"
        description="Guides and insights on JEE, JoSAA & CSAB counselling, branch choice and college selection — written by IIT Roorkee alumni at College Parichay."
        path="/blog" />

      <section style={{ paddingTop: 128, paddingBottom: 40, position: "relative", overflow: "hidden" }}>
        <div className="container">
          <div className="blog-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 36, alignItems: "center" }}>
            <div>
              <span style={clEyebrow}><Sparkles size={13} /> College Parichay Blog</span>
              <h1 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(2.1rem,5vw,3.3rem)", color: CL.ink, letterSpacing: "-1.4px", lineHeight: 1.07, margin: "18px 0 16px" }}>
                Crack JEE with <span style={{ color: CL.amber }}>better insights.</span><br />
                <span style={{ color: CL.coral }}>Decisions, sorted.</span>
              </h1>
              <p style={{ color: CL.body, fontSize: "1.06rem", lineHeight: 1.7, maxWidth: 460 }}>
                Honest, data-backed guides on counselling, branch choice and college selection — written by IIT Roorkee alumni who've lived the JoSAA chaos.
              </p>
            </div>
            <HeroPreview />
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 90 }}>
        <div className="container">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9, justifyContent: "center", marginBottom: 34 }}>
            {CATEGORIES.map((c) => {
              const on = cat === c;
              return (
                <button key={c} onClick={() => setCat(c)} style={{
                  padding: "9px 18px", borderRadius: 50, cursor: "pointer", fontFamily: CL.display,
                  fontWeight: 700, fontSize: 13, transition: "all .15s",
                  background: on ? CL.coral : CL.card, color: on ? "#fff" : CL.ink2,
                  border: `1px solid ${on ? CL.coral : CL.line}`,
                  boxShadow: on ? "0 8px 20px rgba(255, 105, 61,.28)" : "none",
                }}>{c}</button>
              );
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 22 }}>
            {shown.map((p) => <PostCard key={p.slug} p={p} />)}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .blog-hero-grid { grid-template-columns: 1fr !important; }
          .blog-hero-preview { display: none !important; }
        }
      `}</style>
    </div>
  );
}
