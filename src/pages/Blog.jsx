/* Blog — College Parichay blog. A hero with floating preview cards, then a grid
   of article cards styled like study-note cards: icon tile, coloured category,
   title, snippet, a corner badge and a read-time + tag footer. Content is
   admissions / JEE / branch focused. */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Sparkles, ArrowRight, GitCompareArrows, Gauge, Building2,
  Brain, ListChecks, TrendingUp, ShieldCheck, Layers, Clock,
} from "lucide-react";
import Seo from "../components/Seo.jsx";
import { CL, clEyebrow } from "../components/home/clTheme.js";

const CATEGORIES = ["All", "Counselling", "Strategy", "Exams", "Careers", "Colleges"];

const POSTS = [
  {
    icon: ListChecks, accent: CL.coral, category: "Counselling", badge: "GUIDE", read: "8 min read",
    title: "Fill JoSAA choices without losing your dream branch",
    snippet: "The exact order — Safe, Moderate and Reach — to lock the branch you want without gambling away a seat you deserved.",
    tag: "JoSAA 2026",
  },
  {
    icon: GitCompareArrows, accent: CL.green, category: "Strategy", badge: "FRAMEWORK", read: "6 min read",
    title: "Branch vs College: the framework that actually works",
    snippet: "When the institute and the subject collide on your list, here's how to decide which one should win — backed by outcomes, not opinions.",
    tag: "Decision",
  },
  {
    icon: Gauge, accent: CL.blue, category: "Exams", badge: "EXPLAINER", read: "7 min read",
    title: "JEE Main percentile → rank: how normalisation really works",
    snippet: "Why two students with the same marks in different shifts get different ranks — and what it means for your college predictions.",
    tag: "JEE Main",
  },
  {
    icon: Brain, accent: CL.violet, category: "Careers", badge: "INSIGHT", read: "9 min read",
    title: "AI-proof engineering branches for the next decade",
    snippet: "Which branches automation actually threatens, which ones it supercharges, and how to read the AI-risk score before you choose.",
    tag: "Future of work",
  },
  {
    icon: Building2, accent: CL.amber, category: "Colleges", badge: "COMPARE", read: "6 min read",
    title: "NIT vs IIIT vs GFTI — which fits your rank?",
    snippet: "A clear-eyed comparison of placements, fees, brand and branch flexibility so you spend your rank where it pays off most.",
    tag: "Colleges",
  },
  {
    icon: ShieldCheck, accent: CL.coral, category: "Counselling", badge: "GUIDE", read: "5 min read",
    title: "Float, Slide & Freeze: JoSAA seat acceptance decoded",
    snippet: "The single decision after every round that students misunderstand the most — and the safe default for each situation.",
    tag: "JoSAA",
  },
  {
    icon: TrendingUp, accent: CL.green, category: "Careers", badge: "INSIDER", read: "7 min read",
    title: "Read a placement report like an insider",
    snippet: "Median vs average, dispersion, mass recruiters vs dream offers — the numbers that actually tell you what a branch is worth.",
    tag: "Placements",
  },
  {
    icon: Layers, accent: CL.blue, category: "Strategy", badge: "PLAYBOOK", read: "6 min read",
    title: "Shortlist 20 colleges in 30 minutes",
    snippet: "A rank-aware shortlisting method that turns 800+ colleges into a tight, personalised choice list you can actually act on.",
    tag: "Shortlist",
  },
  {
    icon: BookOpen, accent: CL.amber, category: "Exams", badge: "RESOURCE", read: "10 min read",
    title: "CSAB special rounds — your second shot at an NIT",
    snippet: "Who should register, how vacancies open up, and the rank movements that make CSAB worth the wait after JoSAA.",
    tag: "CSAB 2026",
  },
];

const CAT_COLORS = {
  Counselling: CL.coral, Strategy: CL.green, Exams: CL.blue, Careers: CL.violet, Colleges: CL.amber,
};

function PostCard({ p }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      style={{
        background: CL.card, borderRadius: 20, border: `1px solid ${CL.line}`,
        boxShadow: CL.shadow, padding: "22px 22px 20px", height: "100%",
        display: "flex", flexDirection: "column", cursor: "pointer", position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <span style={{ width: 44, height: 44, borderRadius: 12, background: `${p.accent}18`, display: "grid", placeItems: "center" }}>
          <p.icon size={21} color={p.accent} />
        </span>
        <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".08em", color: CL.muted, background: CL.cream2, border: `1px solid ${CL.cream3}`, padding: "4px 10px", borderRadius: 50 }}>
          {p.badge}
        </span>
      </div>

      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".04em", color: p.accent, marginBottom: 7, textTransform: "uppercase" }}>
        {p.category}
      </div>
      <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.08rem", color: CL.ink, lineHeight: 1.25, letterSpacing: "-0.3px", marginBottom: 9 }}>
        {p.title}
      </h3>
      <p style={{ color: CL.body, fontSize: 13.2, lineHeight: 1.6, marginBottom: 16, flex: 1 }}>{p.snippet}</p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: `1px solid ${CL.line}` }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: CL.muted, fontWeight: 600 }}>
          <Clock size={12} /> {p.read}
        </span>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: CL.ink2, background: CL.cream2, border: `1px solid ${CL.cream3}`, padding: "4px 11px", borderRadius: 50 }}>
          {p.tag}
        </span>
      </div>
    </motion.article>
  );
}

/* Small floating preview cards in the hero (decorative, like the reference). */
function HeroPreview() {
  const cards = POSTS.slice(0, 3);
  const offsets = [
    { top: 0, right: 60, rotate: -4, z: 2 },
    { top: 30, right: 0, rotate: 5, z: 3 },
    { top: 120, right: 110, rotate: -2, z: 1 },
  ];
  return (
    <div className="blog-hero-preview" style={{ position: "relative", height: 300 }}>
      {cards.map((p, i) => {
        const o = offsets[i];
        return (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 24, rotate: o.rotate }}
            animate={{ opacity: 1, y: 0, rotate: o.rotate }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
            style={{
              position: "absolute", top: o.top, right: o.right, zIndex: o.z, width: 210,
              background: CL.card, borderRadius: 16, border: `1px solid ${CL.line}`,
              boxShadow: CL.shadowLg, padding: "14px 15px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: `${p.accent}18`, display: "grid", placeItems: "center" }}>
                <p.icon size={15} color={p.accent} />
              </span>
              <span style={{ fontSize: 8.5, fontWeight: 800, color: CL.muted, background: CL.cream2, padding: "3px 8px", borderRadius: 50 }}>{p.badge}</span>
            </div>
            <div style={{ fontSize: 9.5, fontWeight: 800, color: p.accent, textTransform: "uppercase", marginBottom: 4 }}>{p.category}</div>
            <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 12.5, color: CL.ink, lineHeight: 1.3, marginBottom: 6 }}>{p.title}</div>
            <div style={{ fontSize: 10, color: CL.muted }}>{p.read} · {p.tag}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function Blog() {
  const [cat, setCat] = useState("All");
  useEffect(() => { document.title = "Blog — JEE, counselling & college insights · College Parichay"; }, []);
  const shown = cat === "All" ? POSTS : POSTS.filter((p) => p.category === cat);

  return (
    <div style={{ background: CL.cream, minHeight: "100vh" }}>
      <Seo title="Blog — JEE, counselling & college insights · College Parichay"
        description="Guides and insights on JEE, JoSAA & CSAB counselling, branch choice and college selection — written by IIT Roorkee alumni at College Parichay."
        path="/blog" />

      {/* hero */}
      <section style={{ paddingTop: 128, paddingBottom: 40, position: "relative", overflow: "hidden" }}>
        <div className="container">
          <div className="blog-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 36, alignItems: "center" }}>
            <div>
              <span style={clEyebrow}><Sparkles size={13} /> College Parichay Blog</span>
              <h1 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(2.1rem,5vw,3.3rem)", color: CL.ink, letterSpacing: "-1.4px", lineHeight: 1.07, margin: "18px 0 16px" }}>
                Crack JEE with <span style={{ background: CL.amberSoft, padding: "0 10px", borderRadius: 10 }}>better insights.</span><br />
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

      {/* filter + grid */}
      <section style={{ paddingBottom: 90 }}>
        <div className="container">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9, justifyContent: "center", marginBottom: 34 }}>
            {CATEGORIES.map((c) => {
              const on = cat === c;
              return (
                <button key={c} onClick={() => setCat(c)} style={{
                  padding: "9px 18px", borderRadius: 50, cursor: "pointer", fontFamily: CL.display,
                  fontWeight: 700, fontSize: 13, transition: "all .15s",
                  background: on ? CL.coral : CL.card,
                  color: on ? "#fff" : CL.ink2,
                  border: `1px solid ${on ? CL.coral : CL.line}`,
                  boxShadow: on ? "0 8px 20px rgba(241,90,56,.28)" : "none",
                }}>
                  {c}
                </button>
              );
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 22 }}>
            {shown.map((p) => <PostCard key={p.title} p={p} />)}
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
