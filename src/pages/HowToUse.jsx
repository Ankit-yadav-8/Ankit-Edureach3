import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserPlus, Gauge, Crosshair, Sparkles, Award, CalendarDays,
  GitCompare, BarChart3, Heart, ShieldCheck, Landmark, BadgeCheck,
  Search, MessageCircle, ArrowRight, ArrowDown, CheckCircle2,
  Compass, Lightbulb, Rocket, HelpCircle,
} from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import Seo from "../components/Seo.jsx";

const OR = "#FF693D";

/* ── The 4-step big-picture journey ─────────────────────────── */
const JOURNEY = [
  { icon: UserPlus,  label: "Sign Up",        sub: "Create your free account" },
  { icon: Gauge,     label: "Predict Rank",   sub: "Estimate your JEE rank" },
  { icon: Crosshair, label: "Predict College",sub: "See where you fit" },
  { icon: Rocket,    label: "Plan & Apply",   sub: "Shortlist · compare · counsel" },
];

/* ── Full tool-by-tool guide ────────────────────────────────── */
const GUIDE = [
  {
    n: 1,
    icon: UserPlus,
    title: "Create Your Free Account",
    to: null,
    tag: "Start here",
    what: "Sign up takes under a minute and unlocks every tool on College Parichay — predictors, planners and saved shortlists.",
    steps: [
      "Click the orange Sign Up button at the top-right of any page.",
      "Enter your name, email, 10-digit mobile number and coaching.",
      "Add your JEE Main rank (JEE Advanced rank is optional).",
      "Set a password — or use Email OTP to log in without one.",
    ],
    help: "Your rank is remembered, so every predictor and recommendation is personalised to you the moment you log in.",
  },
  {
    n: 2,
    icon: Gauge,
    title: "JEE Rank Predictor",
    to: "/jee-main#rank",
    tag: "Step 1 of prediction",
    what: "Don't have your rank yet? Convert your expected marks or percentile into a likely All-India Rank for JEE Main & Advanced.",
    steps: [
      "Open JEE Main → Rank Predictor (or JEE Advanced for IIT ranks).",
      "Enter your expected marks or percentile and your category.",
      "Get an estimated rank range built on 2019–2025 NTA trends.",
    ],
    help: "Gives you a realistic rank to feed into the College Predictor — even before official results are out.",
  },
  {
    n: 3,
    icon: Crosshair,
    title: "College Predictor",
    to: "/jee-main#college",
    tag: "The core tool",
    what: "The heart of College Parichay. Enter your rank and instantly see which IITs, NITs, IIITs and GFTIs you can realistically get.",
    steps: [
      "Open the College Predictor from the JEE menu or the navbar button.",
      "Enter your rank, category, gender and home state.",
      "Browse colleges sorted by your chance — Safe, Moderate or Ambitious.",
      "Tap any college to see branch-wise opening & closing ranks.",
    ],
    help: "Backed by verified JoSAA closing-rank data, so you target colleges you can actually get — not guesses.",
  },
  {
    n: 4,
    icon: Sparkles,
    title: "Colleges For You",
    to: "/for-you",
    tag: "Personalised",
    what: "A smart, personalised feed of colleges matched to your rank, preferred branches and location — curated automatically.",
    steps: [
      "Open Colleges For You from the navbar.",
      "Set your preferences — branch, budget and location.",
      "Scroll a ranked list of best-fit colleges picked for your profile.",
    ],
    help: "Removes the overwhelm of browsing hundreds of colleges — you see only the ones that fit you.",
  },
  {
    n: 5,
    icon: Award,
    title: "JoSAA 2026 Counselling",
    to: "/josaa-2026",
    tag: "Admission roadmap",
    what: "Your complete guide to the JoSAA counselling process — rounds, dates, seat allotment and choice-filling strategy.",
    steps: [
      "Open JoSAA 2026 from the Tools menu.",
      "Follow the round-by-round timeline and what to do at each stage.",
      "Use the choice-filling tips to order your preferences smartly.",
    ],
    help: "Demystifies the most confusing part of admission so you never miss a round or make a costly choice-order mistake.",
  },
  {
    n: 6,
    icon: CalendarDays,
    title: "Counselling Planner",
    to: "/planner",
    tag: "Stay on track",
    what: "A personal checklist and calendar that keeps every counselling deadline, document and fee in one place.",
    steps: [
      "Open the Counselling Planner from the Tools menu.",
      "Track upcoming dates, documents and fee deadlines.",
      "Tick off tasks as you complete each step.",
    ],
    help: "No more missed deadlines — everything you need to do, in the order you need to do it.",
  },
  {
    n: 7,
    icon: GitCompare,
    title: "Compare Colleges",
    to: "/compare",
    tag: "Decide confidently",
    what: "Put up to 3 colleges side-by-side — each shown by name with its type badge — on every metric that matters: NIRF rank, location, year established, average & highest package, placement %, total fees per year, CSE (General) closing rank and counselling body.",
    steps: [
      "Add a college with the Compare (⚖) button on any college card, or open Compare and tap “Add colleges”.",
      "Open Compare from the navbar — each college appears as its own column with full name and short code.",
      "Read the row-by-row table: rankings, fees, placements and cutoffs line up neatly.",
      "Scroll to the Average package and Total fees / year bar charts for a quick visual verdict.",
    ],
    help: "You compare a maximum of 3 colleges at a time, so the table never gets cramped — turning a tough decision into a clear, data-backed choice in seconds.",
  },
  {
    n: 8,
    icon: BarChart3,
    title: "Compare Exams",
    to: "/compare-exams",
    tag: "Plan your attempts",
    what: "Compare up to 3 entrance exams side-by-side — JEE Main, JEE Advanced, BITSAT, VITEEE, MHT-CET, KCET, WBJEE and COMEDK UGET — on full name, conducting body, level, who accepts them, eligibility and exam pattern.",
    steps: [
      "Open Compare Exams from the Tools menu (it starts with JEE Main vs JEE Advanced).",
      "Tap “Add” to pick another exam from the list — up to 3 columns at once.",
      "Read each row: conducting body, level, accepted-by colleges, eligibility and pattern.",
      "Tap an exam’s name or “Open” to jump to its full detail page.",
    ],
    help: "Shows at a glance which exams unlock the colleges you want — so you only sit the ones worth your time and effort.",
  },
  {
    n: 9,
    icon: Heart,
    title: "Shortlist & Saved Colleges",
    to: "/shortlist",
    tag: "Your wishlist",
    what: "Tap the heart on any college to save it by name. All your favourites live together in “My Colleges”, and stay saved on your device even after you close the tab.",
    steps: [
      "Tap the ♥ icon on any college card or profile to add it to your shortlist.",
      "Open My Colleges from the heart icon in the navbar to see every saved college by name.",
      "Send any saved college straight into Compare, or tap the heart again to remove it.",
    ],
    help: "Builds your personal, named wishlist that persists across visits — so you never lose track of a college you liked.",
  },
  {
    n: 10,
    icon: ShieldCheck,
    title: "Official Cutoffs",
    to: "/cutoffs",
    tag: "Verified data",
    what: "Browse authentic JoSAA opening & closing ranks for every college, branch, category and round.",
    steps: [
      "Open Cutoffs from the navbar.",
      "Filter by college, branch, category and counselling round.",
      "Read the exact ranks to benchmark your own.",
    ],
    help: "The same verified data our predictors use — so you can cross-check any result yourself.",
  },
  {
    n: 11,
    icon: Landmark,
    title: "College Map",
    to: "/map",
    tag: "Explore by location",
    what: "Every IIT, NIT and IIIT pinned on an interactive map of India. Pins are colour-coded by type (orange IIT, teal NIT, amber IIIT) and a legend keeps it clear, so you can explore colleges region by region.",
    steps: [
      "Open College Map from the Tools menu.",
      "Use the All / IIT / NIT / IIIT filter tabs — each shows a live count of colleges.",
      "Pan and zoom across India; hover a pin to see the college name, location and average package.",
      "Tap a pin — or any card in the list below the map — to open that college’s full profile.",
    ],
    help: "Perfect when location matters — instantly spot strong colleges close to home and see how they cluster across the country.",
  },
  {
    n: 12,
    icon: BadgeCheck,
    title: "Scholarships & Loans",
    to: "/scholarships",
    tag: "Fund your dream",
    what: "A directory of scholarships and education-loan options with eligibility and how-to-apply details.",
    steps: [
      "Open Scholarships & Loans from the Tools menu.",
      "Filter by category, income and course.",
      "Check eligibility and follow the application links.",
    ],
    help: "Makes top colleges affordable — money should never stop a deserving student.",
  },
];

/* ── Little helper tools ─────────────────────────────────────── */
const QUICK = [
  { icon: Search,        title: "Instant Search",  desc: "Press Ctrl + K (or ⌘ K) anywhere to search colleges, exams and tools in a flash." },
  { icon: MessageCircle, title: "AI Chatbot",      desc: "Tap the chat bubble at the bottom-right for instant answers to your counselling questions." },
  { icon: Compass,       title: "Smart Navbar",    desc: "Every tool is one click away from the top menu — JEE, Colleges, Cutoffs and Tools." },
];

/* ══════════════════════════════════════════════════════════════
   STEP CARD
══════════════════════════════════════════════════════════════ */
function StepCard({ item, last }) {
  const Ic = item.icon;
  return (
    <div style={{ position: "relative" }}>
      <Reveal>
        <div
          className="htu-step-card"
          style={{
            background: "var(--page-bg)",
            border: "1px solid rgba(0,0,0,.08)",
            borderRadius: 22,
            boxShadow: "0 2px 16px rgba(0,0,0,.07)",
            padding: "28px 26px",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 22,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* coloured left rail */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: `linear-gradient(180deg, ${OR}, #fbbf24)` }} />

          {/* number + icon column */}
          <div className="htu-step-rail" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 58, height: 58, borderRadius: 16,
                background: `linear-gradient(135deg, ${OR}, #f9953d)`,
                display: "grid", placeItems: "center",
                boxShadow: "0 8px 20px -6px rgba(255, 105, 61,.6)",
                flexShrink: 0,
              }}
            >
              <Ic size={26} color="#fff" />
            </div>
            <span
              style={{
                fontFamily: "Sora", fontWeight: 800, fontSize: 13,
                color: OR, background: "rgba(255, 105, 61,.1)",
                borderRadius: 999, padding: "3px 11px", whiteSpace: "nowrap",
              }}
            >
              Step {item.n}
            </span>
          </div>

          {/* content */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
              <h3 style={{ fontFamily: "Space Grotesk", fontWeight: 800, fontSize: "1.32rem", color: "var(--navy)" }}>
                {item.title}
              </h3>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#E0421F", background: "rgba(255, 105, 61,.12)", padding: "3px 9px", borderRadius: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>
                {item.tag}
              </span>
            </div>

            <p style={{ color: "var(--gray)", fontSize: "0.97rem", lineHeight: 1.6, marginBottom: 16 }}>
              {item.what}
            </p>

            {/* how-to steps with arrows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 16 }}>
              {item.steps.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <ArrowRight size={16} color={OR} style={{ marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--navy)", lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>

            {/* how it helps */}
            <div
              style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                background: "linear-gradient(120deg, rgba(255, 105, 61,.07), rgba(251,191,36,.07))",
                border: "1px solid rgba(255, 105, 61,.18)",
                borderRadius: 12, padding: "11px 14px", marginBottom: item.to ? 16 : 0,
              }}
            >
              <Lightbulb size={17} color="#E0421F" style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontSize: "0.9rem", color: "var(--navy)", lineHeight: 1.5 }}>
                <strong style={{ color: "#E0421F" }}>How it helps: </strong>{item.help}
              </span>
            </div>

            {/* CTA */}
            {item.to && (
              <Link
                to={item.to}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: OR, color: "#fff", fontWeight: 700, fontSize: "0.9rem",
                  padding: "9px 18px", borderRadius: 10, textDecoration: "none",
                  boxShadow: "0 8px 18px -8px rgba(255, 105, 61,.7)",
                }}
              >
                Try it now <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </Reveal>

      {/* downward connector arrow between steps */}
      {!last && (
        <div style={{ display: "grid", placeItems: "center", padding: "10px 0" }}>
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(255, 105, 61,.1)", border: "1.5px solid rgba(255, 105, 61,.3)",
              display: "grid", placeItems: "center",
            }}
          >
            <ArrowDown size={20} color={OR} />
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */
export default function HowToUse() {
  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <Seo
        title="How to Use CollegeParichay — Rank, Shortlist & Counselling"
        description="A quick guide to using CollegeParichay — predict your JEE rank, build a college shortlist, compare options and plan JoSAA/CSAB counselling, all free and built by IIT Roorkee alumni."
        path="/how-to-use"
      />
      {/* ── HERO ── */}
      <header className="warm-page-header" style={{ paddingTop: 96 }}>
        <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: "rgba(255, 105, 61,.12)", color: "#E0421F",
                fontWeight: 700, fontSize: 13, padding: "6px 15px",
                borderRadius: 999, marginBottom: 18, letterSpacing: ".02em",
              }}
            >
              <HelpCircle size={15} /> Step-by-step guide
            </span>
            <h1 style={{ fontFamily: "Space Grotesk", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "var(--navy)", lineHeight: 1.12, marginBottom: 14 }}>
              How to use{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #FF693D, #FF693D, #fbbf24)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}
              >
                College Parichay
              </span>
            </h1>
            <p style={{ maxWidth: 640, margin: "0 auto", color: "var(--gray)", fontSize: "1.06rem", lineHeight: 1.6 }}>
              From signing up to landing your dream seat — here's exactly how every tool works
              and how it helps you make a confident, data-backed decision.
            </p>
          </motion.div>

          {/* ── 4-step journey strip with arrows ── */}
          <div className="htu-journey">
            {JOURNEY.map((j, i) => {
              const Ic = j.icon;
              return (
                <div key={j.label} className="htu-journey-item">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + i * 0.12, type: "spring", bounce: 0.4 }}
                    className="htu-journey-card"
                    style={{
                      background: "var(--page-bg)", borderRadius: 16,
                      border: "1px solid rgba(255, 105, 61,.2)",
                      boxShadow: "0 6px 20px -8px rgba(255, 105, 61,.4)",
                      padding: "16px 18px", width: 132, textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 44, height: 44, borderRadius: 12, margin: "0 auto 8px",
                        background: `linear-gradient(135deg, ${OR}, #f9953d)`,
                        display: "grid", placeItems: "center",
                      }}
                    >
                      <Ic size={21} color="#fff" />
                    </div>
                    <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 14, color: "var(--navy)" }}>{j.label}</div>
                    <div style={{ fontSize: 11, color: "var(--gray)", marginTop: 3, lineHeight: 1.3 }}>{j.sub}</div>
                  </motion.div>
                  {i < JOURNEY.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 + i * 0.12 }}
                      className="journey-arrow"
                    >
                      <ArrowRight size={22} color={OR} />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── DETAILED GUIDE ── */}
      <section className="section" style={{ padding: "56px 0" }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 38 }}>
              <h2 style={{ fontFamily: "Space Grotesk", fontWeight: 800, fontSize: "clamp(1.6rem,3.5vw,2.3rem)", color: "var(--navy)", marginBottom: 8 }}>
                Every tool, explained
              </h2>
              <p style={{ color: "var(--gray)", fontSize: "1rem" }}>
                Follow the arrows top-to-bottom — or jump straight to the tool you need.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {GUIDE.map((item, i) => (
              <StepCard key={item.n} item={item} last={i === GUIDE.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK HELPERS ── */}
      <section className="section section--tint" style={{ padding: "56px 0" }}>
        <div className="container" style={{ maxWidth: 980 }}>
          <Reveal>
            <h2 style={{ textAlign: "center", fontFamily: "Space Grotesk", fontWeight: 800, fontSize: "clamp(1.5rem,3vw,2.1rem)", color: "var(--navy)", marginBottom: 8 }}>
              Handy shortcuts
            </h2>
            <p style={{ textAlign: "center", color: "var(--gray)", marginBottom: 34 }}>
              Little things that make College Parichay faster to use.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: 18 }}>
            {QUICK.map((q) => {
              const Ic = q.icon;
              return (
                <Reveal key={q.title}>
                  <div
                    style={{
                      background: "var(--page-bg)", borderRadius: 18, padding: "24px 22px",
                      border: "1px solid rgba(0,0,0,.08)", boxShadow: "0 2px 14px rgba(0,0,0,.06)",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: 46, height: 46, borderRadius: 12, marginBottom: 14,
                        background: "rgba(255, 105, 61,.12)", display: "grid", placeItems: "center",
                      }}
                    >
                      <Ic size={22} color={OR} />
                    </div>
                    <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.1rem", color: "var(--navy)", marginBottom: 6 }}>{q.title}</h3>
                    <p style={{ color: "var(--gray)", fontSize: "0.92rem", lineHeight: 1.55 }}>{q.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="section" style={{ padding: "60px 0 80px" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <Reveal>
            <div
              style={{
                background: "linear-gradient(135deg, #FF693D 0%, #FF693D 55%, #fb923c 100%)",
                borderRadius: 26, padding: "44px 32px", textAlign: "center",
                boxShadow: "0 20px 50px -16px rgba(255, 105, 61,.6)",
              }}
            >
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,.18)", display: "grid", placeItems: "center", margin: "0 auto 18px" }}>
                <CheckCircle2 size={30} color="#fff" />
              </div>
              <h2 style={{ fontFamily: "Space Grotesk", fontWeight: 800, fontSize: "clamp(1.6rem,3.5vw,2.2rem)", color: "#fff", marginBottom: 12 }}>
                Ready to find your college?
              </h2>
              <p style={{ color: "rgba(255,255,255,.92)", fontSize: "1.05rem", maxWidth: 480, margin: "0 auto 26px", lineHeight: 1.55 }}>
                Put it all together — start with the College Predictor and let your rank do the talking.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link
                  to="/jee-main#college"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "var(--page-bg)", color: OR, fontWeight: 800, fontSize: "1rem",
                    padding: "13px 26px", borderRadius: 12, textDecoration: "none",
                  }}
                >
                  <Crosshair size={18} /> Open College Predictor <ArrowRight size={18} />
                </Link>
                <Link
                  to="/for-you"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(255,255,255,.16)", color: "#fff", fontWeight: 700, fontSize: "1rem",
                    padding: "13px 24px", borderRadius: 12, textDecoration: "none",
                    border: "1.5px solid rgba(255,255,255,.4)",
                  }}
                >
                  <Sparkles size={18} /> Colleges For You
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── responsive layout rules ── */}
      <style>{`
        /* journey strip */
        .htu-journey {
          display: flex;
          align-items: stretch;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 40px;
        }
        .htu-journey-item { display: flex; align-items: center; gap: 6px; }
        .journey-arrow { display: grid; place-items: center; }

        /* tablet: 2x2 journey grid so cards don't shrink awkwardly */
        @media (max-width: 720px) {
          .htu-journey { gap: 10px; }
        }

        /* phones: stack the journey vertically, arrows point down */
        @media (max-width: 560px) {
          .htu-journey { flex-direction: column; align-items: center; gap: 0; margin-top: 30px; }
          .htu-journey-item { flex-direction: column; gap: 0; width: 100%; max-width: 280px; }
          .htu-journey-card { width: 100% !important; }
          .journey-arrow { transform: rotate(90deg); margin: 6px 0; }
        }

        /* step cards: tighten spacing as the screen narrows */
        @media (max-width: 600px) {
          .htu-step-card { padding: 22px 18px !important; gap: 16px !important; }
        }
        @media (max-width: 430px) {
          .htu-step-card {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
            padding: 20px 16px 20px 20px !important;
          }
          .htu-step-rail { flex-direction: row !important; align-items: center !important; gap: 10px !important; }
        }
      `}</style>
    </div>
  );
}
