/* Mentorship — the "CollegeParichay Mentorship Journal".
   An editorial, magazine-style landing page for 1-on-1 IITian mentorship:
   cream paper, Playfair display serif with coral-italic emphasis, dark navy
   feature sections, §0X·LABEL micro-headers. Config-driven per variant
   (jee-2027 / jee-2028 / neet) from data/mentorship.js. Image slots are filled
   with the existing /images mentorship assets. */
import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Plus, Check, Star, Send, Radio,
} from "lucide-react";
import { MENTORSHIP, MENTOR_PLANS, SEATS_LIMIT, SEATS_LEFT, MENTOR_LINKS } from "../data/mentorship.js";
import { useEnrol } from "../components/EnrolModal.jsx";
import Seo from "../components/Seo.jsx";

const WA_NUMBER = "917877596464";

/* ── warm paper / coral / navy theme ── */
const T = {
  paper: "#F7F3EC", paper2: "#F1EBE0", card: "#FFFFFF",
  ink: "#1B1B24", body: "#54525C", muted: "#8C877E",
  line: "#E4DED2", lineDk: "#D6CFC0",
  coral: "#FF693D", coralDk: "#D8512A", coralSoft: "#FFE7DE",
  navy: "#12141C", navy2: "#191C26", navyLine: "rgba(255,255,255,.10)",
  onNavy: "#EDEBE6", onNavyMute: "#8E93A3",
};

/* ── small building blocks ── */
function Reveal({ children, delay = 0, className, style }) {
  return (
    <motion.div className={className} style={style}
      initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.6, delay, ease: [0.16, 0.84, 0.32, 1] }}>
      {children}
    </motion.div>
  );
}
function Label({ children, dark }) {
  return <span className={dark ? "mj-label mj-label-dark" : "mj-label"}>{children}</span>;
}

/* ═══════════════ HERO — journal masthead ═══════════════ */
function Hero({ cfg, plan, year, exam, openEnrol, scrollTo }) {
  return (
    <section className="mj-hero">
      <span className="mj-watermark" aria-hidden="true">{year}</span>
      <div className="mj-wrap mj-hero-inner">
        <div className="mj-hero-meta">
          <span className="mj-pill"><span className="mj-dot" /> COHORT · BATCH 07</span>
          <span className="mj-issue">VOL. 27 / ISSUE 01 · COLLEGEPARICHAY MENTORSHIP JOURNAL</span>
          <span className="mj-pill mj-pill-warn">{SEATS_LEFT} SEATS · CLOSING SOON</span>
        </div>

        <div className="mj-hero-grid">
          <Reveal className="mj-hero-left">
            <h1 className="mj-hero-h1">
              A 1-on-1 mentorship built by <em>IITians</em> — with weekly test surgery,
              a live tracker your parents can read, and the calm rhythm that actually
              gets you a rank in <em>{exam}.</em>
            </h1>
            <div className="mj-hero-cta">
              <button className="mj-btn-dark" onClick={() => openEnrol(plan)}>Start at ₹1 <ArrowRight size={17} /></button>
              <button className="mj-btn-link" onClick={() => scrollTo("method")}>
                <span className="mj-btn-circ"><ArrowUpRight size={15} /></span> SEE THE METHOD
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="mj-hero-visual">
            <span className="mj-badge-jump"><b>AVG JUMP</b>+18,400 ranks</span>
            <div className="mj-hero-imgcard">
              <img src={cfg.heroImage} alt={`${exam} mentorship`} loading="eager" />
            </div>
            <span className="mj-badge-live"><span className="mj-dot mj-dot-live" /> LIVE NOW · 312 studying</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ STAT BAND ═══════════════ */
function StatBand({ cfg }) {
  return (
    <section className="mj-statband">
      <div className="mj-wrap mj-stat-row">
        {(cfg.stats || []).map((s, i) => (
          <div key={i} className="mj-stat">
            <div className="mj-stat-v">{s.val}</div>
            <div className="mj-stat-l">{s.lbl}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════ QUALIFIER — "is this you?" ═══════════════ */
function Qualifier({ cfg }) {
  return (
    <section className="mj-section">
      <div className="mj-wrap">
        <Reveal>
          <p className="mj-lead">
            This program is designed for <em>one type of aspirant</em> — the one who
            wants a real system, not another shelf of unopened books.
          </p>
        </Reveal>
        <div className="mj-checklist">
          {(cfg.forYou || []).map((line, i) => (
            <Reveal key={i} delay={(i % 2) * 0.05} className={i % 2 ? "mj-check-card mj-check-right" : "mj-check-card"}>
              <span className="mj-check-ic"><Check size={16} strokeWidth={3} /></span>
              <span className="mj-check-t">{line}</span>
              <span className="mj-check-n">{String(i + 1).padStart(2, "0")}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ § 02 · METHOD (dark, horizontal steps) ═══════════════ */
function Method({ cfg }) {
  return (
    <section id="method" className="mj-dark">
      <div className="mj-wrap">
        <div className="mj-dark-head">
          <div>
            <Label dark>§ 02 · METHOD</Label>
            <h2 className="mj-display mj-display-lg mj-on-navy">A calm, connected system —<br /><em>Day 1 to Rank Day.</em></h2>
          </div>
          <span className="mj-scrollhint">SCROLL →</span>
        </div>
      </div>
      <div className="mj-steps">
        {(cfg.howWeGuide || []).map((s, i) => (
          <div key={i} className="mj-step">
            <div className="mj-step-top">
              <span className="mj-step-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="mj-step-tag">STEP</span>
            </div>
            <h3 className="mj-step-t">{s.title}</h3>
            <p className="mj-step-d">{s.desc}</p>
            <span className="mj-step-foot">→ {i + 1 < (cfg.howWeGuide.length) ? `CONTINUE TO ${String(i + 2).padStart(2, "0")}` : "RANK ACHIEVED"}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════ § 04 · PROGRESS (dashboard) ═══════════════ */
function LineChart({ you = [], batch = [] }) {
  const all = [...you, ...batch, 1];
  const max = Math.max(...all);
  const W = 520, H = 150, n = Math.max(you.length, 2);
  const pts = (arr) => arr.map((v, i) => `${(i / (n - 1)) * W},${H - (v / max) * (H - 12) - 6}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mj-line" preserveAspectRatio="none">
      <polyline points={pts(batch)} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="2.5" strokeDasharray="4 5" />
      <polyline points={pts(you)} fill="none" stroke={T.coral} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {you.map((v, i) => (
        <circle key={i} cx={(i / (n - 1)) * W} cy={H - (v / max) * (H - 12) - 6} r="3.5" fill={T.coral} />
      ))}
    </svg>
  );
}
function Progress({ cfg }) {
  const m = cfg.metrics || {};
  const g = m.growth || {};
  const pct = m.outcomes?.find((o) => /percentile|%ile/i.test(o.l)) || m.outcomes?.[1] || { v: "94%", l: "Rank percentile" };
  const wk = m.weekHours || [];
  const wkMax = Math.max(...wk, 1);
  const totalH = wk.reduce((a, b) => a + b, 0).toFixed(0);
  return (
    <section className="mj-section">
      <div className="mj-wrap">
        <Reveal className="mj-sec-head">
          <div>
            <Label>§ 04 · PROGRESS</Label>
            <h2 className="mj-display mj-display-lg">Numbers that <em>move.</em></h2>
          </div>
          <p className="mj-sec-sub">The dashboard shows the week — not the semester. Small wins, stacked visibly.</p>
        </Reveal>

        <div className="mj-prog-grid">
          <Reveal className="mj-prog-card mj-navy-card">
            <div className="mj-card-head"><span>MOCK SCORE · LAST {(g.you || []).length} WKS</span><span className="mj-up">↗ +120% growth</span></div>
            <LineChart you={g.you} batch={g.batch} />
          </Reveal>
          <Reveal delay={0.08} className="mj-prog-card mj-coral-card">
            <span className="mj-card-head-lite">RANK PERCENTILE</span>
            <div className="mj-bignum">{pct.v}</div>
            <div className="mj-bignum-l">{pct.l}</div>
          </Reveal>
          <Reveal delay={0.12} className="mj-prog-card mj-paper-card mj-prog-bars">
            <div className="mj-card-head-lite mj-dk">WEEKLY STUDY HOURS</div>
            <div className="mj-bars">
              {wk.map((h, i) => (
                <div key={i} className="mj-bar-col">
                  <div className="mj-bar" style={{ height: `${(h / wkMax) * 100}%` }} />
                  <span>W{i + 1}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.16} className="mj-prog-card mj-paper-card mj-prog-hours">
            <div className="mj-card-head-lite mj-dk">HOURS THIS WEEK</div>
            <div className="mj-bignum mj-dk">{totalH}h</div>
            <div className="mj-bignum-l mj-up-dk">↗ tracked live with your mentor</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ § 05 · LIVE TRACKING ═══════════════ */
function LiveTracking({ cfg }) {
  const m = cfg.metrics || {};
  const tiles = m.liveTiles || [];
  return (
    <section className="mj-section">
      <div className="mj-wrap">
        <Reveal className="mj-sec-head">
          <div>
            <Label>§ 05 · LIVE TRACKING</Label>
            <h2 className="mj-display mj-display-lg">A dashboard that feels<br /><em>alive — because it is.</em></h2>
          </div>
          <span className="mj-live-chip"><span className="mj-dot mj-dot-live" /> SESSION · LIVE</span>
        </Reveal>

        <Reveal delay={0.08} className="mj-tracker">
          <div className="mj-tracker-bar">
            <span className="mj-traffic"><i /><i /><i /></span>
            <span className="mj-tracker-title">PARICHAY / TRACKER · {(m.student?.name || "STUDENT").toUpperCase()}</span>
            <span className="mj-tracker-stream"><Radio size={12} /> STREAMING</span>
          </div>
          <div className="mj-tracker-body">
            <div className="mj-tracker-img"><img src={cfg.analyticsImage} alt="Live tracking dashboard" loading="lazy" /></div>
            <div className="mj-tracker-tiles">
              {tiles.map((t, i) => (
                <div key={i} className="mj-tile">
                  <span className="mj-tile-l">{t.l}</span>
                  <span className="mj-tile-v" style={{ color: t.c }}>{t.v}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ § 06 · FOR PARENTS ═══════════════ */
function ForParents({ cfg }) {
  const p = cfg.metrics?.parent || {};
  return (
    <section className="mj-section">
      <div className="mj-wrap mj-parent-grid">
        <Reveal>
          <Label>§ 06 · FOR PARENTS</Label>
          <h2 className="mj-display mj-display-lg">A window into <em>the week.</em></h2>
          <p className="mj-body">Every Sunday, a printable one-pager lands in your inbox. Not marketing.
            The exact hours, tests, ranks and mentor notes your child heard that week.</p>
          <button className="mj-btn-outline" onClick={() => window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi! Can I see a sample parent weekly report?")}`, "_blank")}>
            See sample <ArrowUpRight size={15} />
          </button>
        </Reveal>

        <Reveal delay={0.1} className="mj-weekly">
          <div className="mj-weekly-top">
            <span className="mj-weekly-name">The Weekly</span>
            <span className="mj-weekly-vol">{p.week ? p.week.toUpperCase() : "VOL 14"} · PARENT REPORT</span>
          </div>
          <div className="mj-weekly-body">
            <div className="mj-weekly-featured">
              <span className="mj-featured-lbl">FEATURED</span>
              <p className="mj-featured-quote">{p.remark || "Consistency jumped this week — next we focus on the weakest chapter."}</p>
              <div className="mj-weekly-photo"><img src="/images/home_mentorship_overview.png" alt="Weekly booklet" loading="lazy" /></div>
            </div>
            <div className="mj-weekly-glance">
              <span className="mj-glance-lbl">AT A GLANCE</span>
              {(p.rows || []).slice(0, 5).map((r, i) => (
                <div key={i} className="mj-glance-row">
                  <span>{r.l}</span><strong style={{ color: r.c }}>{r.v}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="mj-weekly-foot"><span>PARICHAY · PARENT REPORT</span><span>PAGE 01 / 04</span></div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ § 07 · REAL THREADS (whatsapp) ═══════════════ */
const CHATS = [
  { from: "student", t: "Sir I'm stuck on rotational motion, been 2 hrs 😩", time: "11:42 PM" },
  { from: "mentor", t: "Send me the Q. Skip torque-heavy ones tonight — do the 6 PYQs I marked, we'll do the rest on Sunday.", time: "11:45 PM" },
  { from: "student", t: "Mock went 178/300 today 🔥 up from 126", time: "6:10 PM" },
  { from: "mentor", t: "That's the jump we planned. Chemistry accuracy is your next 20 marks — capsule coming at 7am.", time: "6:12 PM" },
];
function WhatsApp() {
  return (
    <section className="mj-section">
      <div className="mj-wrap">
        <Reveal className="mj-sec-head">
          <div>
            <Label>§ 07 · REAL THREADS</Label>
            <h2 className="mj-display mj-display-lg">What actually happens<br />in <em>your WhatsApp.</em></h2>
          </div>
          <p className="mj-sec-sub">Unedited. Unscripted. Late-night doubt, Sunday plan, Wednesday pep talk.</p>
        </Reveal>
        <div className="mj-chats">
          {CHATS.map((c, i) => (
            <Reveal key={i} delay={(i % 4) * 0.05} className="mj-chat" style={{ ["--tilt"]: `${(i % 2 ? 1 : -1) * (1.5 + i * 0.4)}deg` }}>
              <span className="mj-tape" />
              <div className={c.from === "mentor" ? "mj-bubble mj-bubble-mentor" : "mj-bubble"}>
                <span className="mj-bubble-who">{c.from === "mentor" ? "Mentor · IIT Delhi" : "You"}</span>
                <p>{c.t}</p>
                <span className="mj-bubble-time">{c.time}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ § 08 · THE PATH ═══════════════ */
function ThePath({ cfg }) {
  return (
    <section className="mj-section mj-path">
      <div className="mj-wrap">
        <Reveal style={{ textAlign: "center" }}>
          <Label>§ 08 · THE PATH</Label>
          <h2 className="mj-display mj-display-xl">From confused aspirant<br />to <em>confident ranker.</em></h2>
        </Reveal>
        <Reveal delay={0.1} className="mj-path-card">
          <img src={cfg.roadmapImage} alt="Mentorship roadmap" loading="lazy" />
          <span className="mj-path-cap">JOURNEY · INTAKE → BACKLOG → RANK PUSH</span>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ § 09 · ALUMNI (proof) ═══════════════ */
function Proof({ cfg }) {
  return (
    <section className="mj-section">
      <div className="mj-wrap mj-proof-grid">
        <div className="mj-proof-head">
          <Label>§ 09 · ALUMNI</Label>
          <h2 className="mj-display mj-display-lg">Chose to be<br /><em>mentored,</em><br />not just taught.</h2>
          <div className="mj-stars">
            {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={18} fill={T.coral} color={T.coral} />)}
            <span>4.9 / 5 · 1,240 REVIEWS</span>
          </div>
        </div>
        <div className="mj-proof-masonry">
          {(cfg.testimonials || []).map((t, i) => (
            <Reveal key={i} delay={(i % 2) * 0.06} className="mj-quote-card">
              <span className="mj-quote-mark">&ldquo;</span>
              <p className="mj-quote-t">{t.quote}</p>
              <div className="mj-quote-by">
                <span className="mj-quote-av">{t.name[0]}</span>
                <div><strong>{t.name}</strong><span>{t.improvement}</span></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ PRICING ═══════════════ */
const INCLUDED = [
  "1-on-1 IITian mentor for 12 months", "Weekly personalised study plan",
  "Weekly test analysis + priority checklist", "Live study tracking dashboard",
  "Parent weekly booklet", "24/7 WhatsApp doubt support",
  "Full mock marathon in final phase", "Rank prediction + college shortlist",
];
function Pricing({ plan, exam, openEnrol }) {
  const p = MENTOR_PLANS[plan] || { amount: 1, old: 7999 };
  return (
    <section id="enrol" className="mj-section">
      <div className="mj-wrap">
        <Reveal style={{ textAlign: "center" }}>
          <h2 className="mj-display mj-display-xl">One plan. Everything.<br />Start at <em>₹{p.amount}.</em></h2>
        </Reveal>
        <Reveal delay={0.1} className="mj-price-card">
          <div className="mj-price-left">
            <span className="mj-price-kicker">ADMISSION PASS</span>
            <span className="mj-price-plan">{exam}</span>
            <div className="mj-price-amt">₹{p.amount}</div>
            <div className="mj-price-old">₹{p.old?.toLocaleString("en-IN")}</div>
            <div className="mj-price-terms">7-DAY TRIAL · THEN ₹{p.old?.toLocaleString("en-IN")}/YR</div>
            <span className="mj-price-seats">⚡ {SEATS_LEFT} SEATS LEFT</span>
          </div>
          <div className="mj-price-right">
            <span className="mj-inc-lbl">EVERYTHING INCLUDED</span>
            <div className="mj-inc-grid">
              {INCLUDED.map((f) => (
                <div key={f} className="mj-inc-item"><Check size={15} strokeWidth={3} color={T.coral} /> {f}</div>
              ))}
            </div>
            <button className="mj-btn-dark mj-btn-block" onClick={() => openEnrol(plan)}>Claim your seat <ArrowRight size={17} /></button>
            <div className="mj-price-foot"><span>◈ RAZORPAY</span><span>⟲ 7-DAY REFUND</span></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ FAQ ═══════════════ */
function Faqs({ cfg }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="mj-section">
      <div className="mj-wrap">
        <Reveal><Label>§ 10 · QUESTIONS</Label>
          <h2 className="mj-display mj-display-lg mj-faq-h">Everything you're<br /><em>wondering.</em></h2>
        </Reveal>
        <div className="mj-faqs">
          {(cfg.faqs || []).map((f, i) => (
            <div key={i} className={open === i ? "mj-faq mj-faq-open" : "mj-faq"}>
              <button className="mj-faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="mj-faq-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="mj-faq-qt">{f.q}</span>
                <span className="mj-faq-ic"><Plus size={18} /></span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div className="mj-faq-a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}>
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ § 11 · TALK TO US ═══════════════ */
function TalkToUs({ exam }) {
  const [f, setF] = useState({ name: "", phone: "", email: "", goal: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const text = `Hi! I'd like a callback about ${exam} mentorship.\nName: ${f.name}\nPhone: ${f.phone}\nEmail: ${f.email}\nGoal: ${f.goal}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };
  return (
    <section className="mj-section mj-talk">
      <div className="mj-wrap mj-talk-grid">
        <Reveal>
          <Label>§ 11 · TALK TO US</Label>
          <h2 className="mj-display mj-display-lg">Not sure?<br /><em>Let&rsquo;s talk.</em></h2>
          <p className="mj-body">A 15-minute call, no pressure. We&rsquo;ll listen to where you are,
            share what the year could look like, and let you decide.</p>
          <div className="mj-reach">
            <span>REACH US · HELLO@COLLEGEPARICHAY.IN</span>
            <span>CALL · +91 78775 96464</span>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="mj-form">
          <form onSubmit={submit}>
            <div className="mj-form-row">
              <label className="mj-field"><span>Your name</span><input required value={f.name} onChange={set("name")} placeholder="Your name" /></label>
              <label className="mj-field"><span>Phone</span><input required inputMode="tel" value={f.phone} onChange={set("phone")} placeholder="Phone" /></label>
            </div>
            <label className="mj-field"><span>Email</span><input type="email" value={f.email} onChange={set("email")} placeholder="Email" /></label>
            <label className="mj-field"><span>Tell us about your goal</span><textarea rows={3} value={f.goal} onChange={set("goal")} placeholder="Tell us about your goal" /></label>
            <button className="mj-btn-dark mj-btn-block" type="submit">Request a callback <Send size={16} /></button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ variant tabs + floating enrol ═══════════════ */
function VariantTabs({ variant }) {
  return (
    <div className="mj-wrap mj-tabs">
      {MENTOR_LINKS.map((l) => (
        <Link key={l.slug} to={l.to} className={l.slug === variant ? "mj-tab mj-tab-on" : "mj-tab"}>{l.label}</Link>
      ))}
    </div>
  );
}
/* ═══════════════ PAGE ═══════════════ */
export default function Mentorship() {
  const { variant } = useParams();
  const cfg = MENTORSHIP[variant];
  const { open: openEnrol } = useEnrol();
  if (!cfg) return <Navigate to="/mentorship/jee-2027" replace />;

  const plan = cfg.tracks?.[0]?.plan || "mentor-jee-2027";
  const exam = cfg.tracks?.[0]?.exam || "JEE 2027";
  const year = (cfg.eyebrow || "").match(/\d{4}/)?.[0] || String(MENTOR_PLANS[plan]?.year || "2027");
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="mj">
      <Seo
        title={`${exam} Mentorship by IITians — 1-on-1 Guidance | CollegeParichay`}
        description="1-on-1 JEE & NEET mentorship by IIT alumni — daily targets, weekly test analysis, live tracking and parent reports. Limited seats. Start at ₹1 on CollegeParichay."
        path={`/mentorship/${variant}`}
      />
      <VariantTabs variant={variant} />
      <Hero cfg={cfg} plan={plan} year={year} exam={exam} openEnrol={openEnrol} scrollTo={scrollTo} />
      <StatBand cfg={cfg} />
      <Qualifier cfg={cfg} />
      <Method cfg={cfg} />
      <Progress cfg={cfg} />
      <LiveTracking cfg={cfg} />
      <ForParents cfg={cfg} />
      <WhatsApp />
      <ThePath cfg={cfg} />
      <Proof cfg={cfg} />
      <Pricing plan={plan} exam={exam} openEnrol={openEnrol} />
      <Faqs cfg={cfg} />
      <TalkToUs exam={exam} />
      <style>{CSS}</style>
    </div>
  );
}

const CSS = `
.mj { background:${T.paper}; color:${T.ink}; font-family:'DM Sans',sans-serif; overflow-x:hidden; }
.mj * { box-sizing:border-box; }
.mj-wrap { max-width:1200px; margin:0 auto; padding:0 24px; }
.mj em { font-family:'Playfair Display',serif; font-style:italic; color:${T.coral}; font-weight:800; }
.mj-display { font-family:'Playfair Display',serif; font-weight:800; color:${T.ink}; letter-spacing:-.5px; line-height:1.08; margin:14px 0 0; }
.mj-display em { color:${T.coral}; }
.mj-display-lg { font-size:clamp(2rem,4.4vw,3.3rem); }
.mj-display-xl { font-size:clamp(2.3rem,5.4vw,4rem); }
.mj-on-navy { color:${T.onNavy}; }
.mj-label { display:inline-flex; align-items:center; gap:8px; padding:5px 13px; border:1px solid ${T.lineDk}; border-radius:6px; background:${T.card}; font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; color:${T.body}; }
.mj-label-dark { background:transparent; border-color:${T.navyLine}; color:${T.onNavyMute}; }
.mj-body { font:400 1.05rem/1.7 'DM Sans',sans-serif; color:${T.body}; margin:20px 0 0; max-width:460px; }
.mj-section { padding:clamp(64px,9vw,110px) 0; position:relative; }

/* variant tabs */
.mj-tabs { display:flex; gap:8px; padding-top:112px; padding-bottom:2px; flex-wrap:wrap; position:relative; z-index:2; }
.mj-tab { text-decoration:none; padding:8px 16px; border-radius:50px; border:1px solid ${T.line}; background:${T.card}; color:${T.body}; font:700 .82rem/1 'Space Grotesk',sans-serif; transition:.16s; }
.mj-tab:hover { border-color:${T.coral}; color:${T.coralDk}; }
.mj-tab-on { background:${T.ink}; border-color:${T.ink}; color:#fff; }

/* hero */
.mj-hero { position:relative; padding:22px 0 70px; overflow:hidden; border-bottom:1px solid ${T.line}; }
.mj-watermark { position:absolute; top:-4%; left:50%; transform:translateX(-50%); font-family:'Playfair Display',serif; font-style:italic; font-weight:900; font-size:min(42vw,600px); line-height:1; color:transparent; -webkit-text-stroke:1.5px ${T.lineDk}; opacity:.5; pointer-events:none; user-select:none; z-index:0; }
.mj-hero-inner { position:relative; z-index:1; }
.mj-hero-meta { display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap; }
.mj-pill { display:inline-flex; align-items:center; gap:8px; padding:7px 14px; border:1px solid ${T.lineDk}; border-radius:50px; background:${T.card}; font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; color:${T.body}; }
.mj-pill-warn { color:${T.coralDk}; border-color:${T.coralSoft}; background:${T.coralSoft}; }
.mj-issue { font:700 .7rem/1 'Space Grotesk',sans-serif; letter-spacing:.16em; color:${T.muted}; text-align:center; }
.mj-dot { width:8px; height:8px; border-radius:50%; background:${T.coral}; flex-shrink:0; }
.mj-dot-live { background:#22c55e; box-shadow:0 0 0 0 rgba(34,197,94,.5); animation:mjpulse 1.8s infinite; }
@keyframes mjpulse { 0%{box-shadow:0 0 0 0 rgba(34,197,94,.5);} 100%{box-shadow:0 0 0 8px rgba(34,197,94,0);} }
.mj-hero-grid { display:grid; grid-template-columns:1.05fr .95fr; gap:56px; align-items:center; margin-top:clamp(40px,7vw,90px); }
.mj-hero-h1 { font-family:'Playfair Display',serif; font-weight:700; font-size:clamp(1.7rem,3vw,2.5rem); line-height:1.28; letter-spacing:-.3px; color:${T.ink}; margin:0; }
.mj-hero-cta { display:flex; align-items:center; gap:22px; flex-wrap:wrap; margin-top:34px; }
.mj-btn-dark { display:inline-flex; align-items:center; gap:9px; padding:15px 26px; border:none; border-radius:12px; background:${T.ink}; color:#fff; font:700 .98rem/1 'Space Grotesk',sans-serif; cursor:pointer; transition:transform .16s, background .16s; }
.mj-btn-dark:hover { background:#000; transform:translateY(-2px); }
.mj-btn-link { display:inline-flex; align-items:center; gap:10px; background:none; border:none; cursor:pointer; font:800 .74rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; color:${T.ink}; }
.mj-btn-circ { display:grid; place-items:center; width:30px; height:30px; border:1px solid ${T.lineDk}; border-radius:50%; transition:.16s; }
.mj-btn-link:hover .mj-btn-circ { background:${T.coral}; border-color:${T.coral}; color:#fff; }
.mj-btn-outline { display:inline-flex; align-items:center; gap:8px; margin-top:26px; padding:13px 24px; border:1px solid ${T.lineDk}; border-radius:12px; background:${T.card}; color:${T.ink}; font:700 .9rem/1 'Space Grotesk',sans-serif; cursor:pointer; transition:.16s; }
.mj-btn-outline:hover { border-color:${T.coral}; color:${T.coralDk}; }
.mj-btn-block { width:100%; justify-content:center; margin-top:22px; }

.mj-hero-visual { position:relative; }
.mj-hero-imgcard { position:relative; border-radius:22px; overflow:hidden; background:${T.navy}; border:1px solid ${T.line}; box-shadow:14px 14px 0 -2px ${T.coral}, 0 30px 60px -30px rgba(0,0,0,.4); }
.mj-hero-imgcard img { width:100%; display:block; }
.mj-badge-jump { position:absolute; top:-18px; right:14px; z-index:3; display:flex; flex-direction:column; align-items:flex-end; gap:1px; padding:10px 16px; border-radius:14px; background:${T.coral}; color:#fff; font:800 1.15rem/1 'Playfair Display',serif; box-shadow:0 12px 26px -10px rgba(255,105,61,.7); }
.mj-badge-jump b { font:800 .58rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; opacity:.85; }
.mj-badge-live { position:absolute; bottom:-16px; left:14px; z-index:3; display:inline-flex; align-items:center; gap:8px; padding:9px 16px; border-radius:50px; background:${T.card}; border:1px solid ${T.line}; font:700 .78rem/1 'Space Grotesk',sans-serif; color:${T.ink}; box-shadow:0 14px 30px -14px rgba(0,0,0,.35); }

/* stat band */
.mj-statband { border-bottom:1px solid ${T.line}; }
.mj-stat-row { display:grid; grid-template-columns:repeat(4,1fr); }
.mj-stat { padding:34px 10px 34px 0; border-left:1px solid ${T.line}; padding-left:26px; }
.mj-stat:first-child { border-left:none; padding-left:0; }
.mj-stat-v { font:800 clamp(1.7rem,3vw,2.4rem)/1 'Playfair Display',serif; color:${T.ink}; }
.mj-stat-l { margin-top:8px; font:700 .74rem/1.3 'Space Grotesk',sans-serif; letter-spacing:.06em; text-transform:uppercase; color:${T.muted}; }

/* qualifier */
.mj-lead { font-family:'Playfair Display',serif; font-weight:600; font-size:clamp(1.3rem,2.6vw,2rem); line-height:1.4; color:${T.ink}; max-width:820px; margin:0 0 44px; }
.mj-checklist { display:flex; flex-direction:column; gap:16px; }
.mj-check-card { display:flex; align-items:center; gap:16px; width:min(620px,100%); padding:20px 24px; background:${T.card}; border:1px solid ${T.line}; border-radius:16px; box-shadow:0 10px 30px -24px rgba(0,0,0,.4); }
.mj-check-right { align-self:flex-end; flex-direction:row-reverse; text-align:right; }
.mj-check-ic { display:grid; place-items:center; width:38px; height:38px; border-radius:50%; background:${T.coral}; color:#fff; flex-shrink:0; }
.mj-check-t { flex:1; font:600 1rem/1.4 'DM Sans',sans-serif; color:${T.ink}; }
.mj-check-n { font:800 .8rem/1 'Space Grotesk',sans-serif; color:${T.muted}; }

/* dark method */
.mj-dark { background:${T.navy}; color:${T.onNavy}; padding:clamp(70px,9vw,120px) 0; position:relative; }
.mj-dark-head { display:flex; align-items:flex-end; justify-content:space-between; gap:20px; margin-bottom:44px; }
.mj-scrollhint { font:800 .72rem/1 'Space Grotesk',sans-serif; letter-spacing:.16em; color:${T.onNavyMute}; white-space:nowrap; }
.mj-steps { display:flex; gap:20px; overflow-x:auto; padding:4px 24px 20px; scroll-snap-type:x mandatory; max-width:1248px; margin:0 auto; }
.mj-steps::-webkit-scrollbar { height:6px; } .mj-steps::-webkit-scrollbar-thumb { background:${T.navyLine}; border-radius:6px; }
.mj-step { scroll-snap-align:start; flex:0 0 320px; min-height:300px; display:flex; flex-direction:column; padding:26px; border:1px solid ${T.navyLine}; border-radius:18px; background:${T.navy2}; }
.mj-step-top { display:flex; align-items:flex-start; justify-content:space-between; }
.mj-step-n { font:800 3.4rem/1 'Playfair Display',serif; color:${T.coral}; }
.mj-step-tag { padding:5px 11px; border:1px solid ${T.navyLine}; border-radius:6px; font:800 .6rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; color:${T.onNavyMute}; }
.mj-step-t { font:700 1.35rem/1.25 'Playfair Display',serif; color:${T.onNavy}; margin:auto 0 0; }
.mj-step-d { font:400 .92rem/1.6 'DM Sans',sans-serif; color:${T.onNavyMute}; margin:12px 0 18px; }
.mj-step-foot { font:800 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em; color:${T.coral}; padding-top:14px; border-top:1px solid ${T.navyLine}; }

/* section head shared */
.mj-sec-head { display:flex; align-items:flex-end; justify-content:space-between; gap:24px; margin-bottom:48px; flex-wrap:wrap; }
.mj-sec-sub { font:400 1rem/1.6 'DM Sans',sans-serif; color:${T.body}; max-width:320px; }
.mj-live-chip { display:inline-flex; align-items:center; gap:8px; padding:8px 15px; border:1px solid #bbe6c8; border-radius:50px; background:#e9f8ee; font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; color:#15803d; }

/* progress */
.mj-prog-grid { display:grid; grid-template-columns:2fr 1fr; grid-auto-rows:auto; gap:18px; }
.mj-prog-card { border-radius:18px; padding:24px; border:1px solid ${T.line}; }
.mj-navy-card { grid-row:span 2; background:${T.navy}; border-color:${T.navyLine}; color:${T.onNavy}; display:flex; flex-direction:column; }
.mj-card-head { display:flex; justify-content:space-between; font:700 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; color:${T.onNavyMute}; margin-bottom:auto; }
.mj-up { color:#22c55e; } .mj-up-dk { color:#16a34a; }
.mj-line { width:100%; height:150px; margin-top:24px; }
.mj-coral-card { background:${T.coral}; color:#fff; border-color:${T.coral}; display:flex; flex-direction:column; }
.mj-card-head-lite { font:700 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; opacity:.85; }
.mj-card-head-lite.mj-dk { color:${T.muted}; opacity:1; }
.mj-bignum { font:800 clamp(2.6rem,5vw,3.6rem)/1 'Playfair Display',serif; margin-top:14px; }
.mj-bignum.mj-dk { color:${T.ink}; }
.mj-bignum-l { font:600 .82rem/1.3 'DM Sans',sans-serif; opacity:.9; margin-top:6px; }
.mj-paper-card { background:${T.card}; }
.mj-prog-bars .mj-bars { display:flex; align-items:flex-end; gap:8px; height:90px; margin-top:16px; }
.mj-bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; height:100%; justify-content:flex-end; }
.mj-bar { width:100%; background:${T.coral}; border-radius:5px 5px 0 0; min-height:5px; }
.mj-bar-col span { font:700 .6rem/1 'Space Grotesk',sans-serif; color:${T.muted}; }

/* live tracker */
.mj-tracker { border-radius:20px; overflow:hidden; border:1px solid ${T.navyLine}; background:${T.navy}; box-shadow:0 40px 80px -50px rgba(0,0,0,.6); }
.mj-tracker-bar { display:flex; align-items:center; gap:14px; padding:12px 18px; border-bottom:1px solid ${T.navyLine}; }
.mj-traffic { display:flex; gap:6px; } .mj-traffic i { width:11px; height:11px; border-radius:50%; background:#3a3f4d; } .mj-traffic i:first-child{background:#ff5f57;} .mj-traffic i:nth-child(2){background:#febc2e;} .mj-traffic i:nth-child(3){background:#28c840;}
.mj-tracker-title { font:700 .72rem/1 'Space Grotesk',sans-serif; letter-spacing:.08em; color:${T.onNavyMute}; }
.mj-tracker-stream { margin-left:auto; display:inline-flex; align-items:center; gap:6px; font:700 .68rem/1 'Space Grotesk',sans-serif; color:#22c55e; }
.mj-tracker-body { display:grid; grid-template-columns:1.5fr 1fr; gap:0; }
.mj-tracker-img { border-right:1px solid ${T.navyLine}; background:${T.navy2}; }
.mj-tracker-img img { width:100%; height:100%; object-fit:cover; display:block; }
.mj-tracker-tiles { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:${T.navyLine}; }
.mj-tile { background:${T.navy}; padding:22px 20px; display:flex; flex-direction:column; gap:8px; }
.mj-tile-l { font:700 .66rem/1 'Space Grotesk',sans-serif; letter-spacing:.08em; text-transform:uppercase; color:${T.onNavyMute}; }
.mj-tile-v { font:800 1.7rem/1 'Playfair Display',serif; }

/* for parents */
.mj-parent-grid { display:grid; grid-template-columns:.9fr 1.1fr; gap:48px; align-items:center; }
.mj-weekly { background:${T.card}; border:1px solid ${T.line}; border-radius:6px; padding:30px; box-shadow:24px 24px 0 -2px ${T.paper2}, 0 30px 60px -34px rgba(0,0,0,.3); }
.mj-weekly-top { display:flex; align-items:baseline; justify-content:space-between; border-bottom:2px solid ${T.ink}; padding-bottom:12px; }
.mj-weekly-name { font:800 1.7rem/1 'Playfair Display',serif; font-style:italic; color:${T.ink}; }
.mj-weekly-vol { font:700 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; color:${T.muted}; }
.mj-weekly-body { display:grid; grid-template-columns:1.3fr 1fr; gap:24px; margin-top:20px; }
.mj-featured-lbl, .mj-glance-lbl { font:800 .62rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; color:${T.coral}; }
.mj-featured-quote { font:600 1.05rem/1.4 'Playfair Display',serif; color:${T.ink}; margin:10px 0 16px; }
.mj-weekly-photo { border-radius:8px; overflow:hidden; border:1px solid ${T.line}; }
.mj-weekly-photo img { width:100%; display:block; }
.mj-glance-row { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 0; border-bottom:1px solid ${T.line}; font:500 .84rem/1.3 'DM Sans',sans-serif; color:${T.body}; }
.mj-glance-row strong { font:800 .9rem/1 'Space Grotesk',sans-serif; }
.mj-glance-lbl { display:block; margin-bottom:6px; }
.mj-weekly-foot { display:flex; justify-content:space-between; margin-top:20px; padding-top:14px; border-top:1px solid ${T.line}; font:700 .62rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; color:${T.muted}; }

/* whatsapp */
.mj-chats { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
.mj-chat { position:relative; transform:rotate(var(--tilt,0deg)); }
.mj-tape { position:absolute; top:-10px; left:50%; transform:translateX(-50%) rotate(-4deg); width:70px; height:22px; background:${T.coralSoft}; border:1px solid ${T.coral}; opacity:.6; border-radius:2px; }
.mj-bubble { background:${T.navy}; border:1px solid ${T.navyLine}; border-radius:16px; padding:20px 18px; box-shadow:0 20px 40px -26px rgba(0,0,0,.5); }
.mj-bubble-mentor { background:${T.coral}; border-color:${T.coral}; }
.mj-bubble-who { font:800 .62rem/1 'Space Grotesk',sans-serif; letter-spacing:.08em; color:${T.onNavyMute}; }
.mj-bubble-mentor .mj-bubble-who { color:rgba(255,255,255,.85); }
.mj-bubble p { font:500 .92rem/1.5 'DM Sans',sans-serif; color:${T.onNavy}; margin:10px 0; }
.mj-bubble-mentor p { color:#fff; }
.mj-bubble-time { font:600 .62rem/1 'Space Grotesk',sans-serif; color:${T.onNavyMute}; }
.mj-bubble-mentor .mj-bubble-time { color:rgba(255,255,255,.8); }

/* the path */
.mj-path { text-align:center; }
.mj-path-card { position:relative; margin:44px auto 0; max-width:1000px; border-radius:22px; overflow:hidden; background:${T.navy}; border:1px solid ${T.line}; box-shadow:0 40px 80px -50px rgba(0,0,0,.5); }
.mj-path-card img { width:100%; display:block; }
.mj-path-cap { position:absolute; bottom:14px; left:0; right:0; text-align:center; font:700 .66rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; color:${T.onNavyMute}; }

/* proof */
.mj-proof-grid { display:grid; grid-template-columns:.8fr 1.2fr; gap:44px; align-items:start; }
.mj-proof-head { position:sticky; top:110px; }
.mj-stars { display:flex; align-items:center; gap:4px; margin-top:22px; }
.mj-stars span { margin-left:10px; font:700 .74rem/1 'Space Grotesk',sans-serif; letter-spacing:.06em; color:${T.muted}; }
.mj-proof-masonry { columns:2; column-gap:18px; }
.mj-quote-card { break-inside:avoid; margin-bottom:18px; background:${T.card}; border:1px solid ${T.line}; border-radius:16px; padding:22px; box-shadow:0 12px 30px -24px rgba(0,0,0,.4); }
.mj-quote-mark { font:800 2.4rem/.6 'Playfair Display',serif; color:${T.coral}; }
.mj-quote-t { font:500 .98rem/1.55 'DM Sans',sans-serif; color:${T.ink}; margin:6px 0 18px; }
.mj-quote-by { display:flex; align-items:center; gap:11px; }
.mj-quote-av { display:grid; place-items:center; width:36px; height:36px; border-radius:50%; background:${T.coralSoft}; color:${T.coralDk}; font:800 .9rem/1 'Space Grotesk',sans-serif; flex-shrink:0; }
.mj-quote-by strong { display:block; font:700 .88rem/1.2 'Space Grotesk',sans-serif; color:${T.ink}; }
.mj-quote-by span { font:600 .74rem/1.2 'DM Sans',sans-serif; color:${T.coralDk}; }

/* pricing */
.mj-price-card { display:grid; grid-template-columns:.85fr 1.15fr; margin:44px auto 0; max-width:960px; border-radius:22px; overflow:hidden; border:1px solid ${T.line}; box-shadow:0 40px 80px -50px rgba(0,0,0,.4); }
.mj-price-left { background:${T.coral}; color:#fff; padding:36px 30px; display:flex; flex-direction:column; }
.mj-price-kicker { font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; opacity:.9; }
.mj-price-plan { font:800 1.6rem/1.1 'Playfair Display',serif; margin-top:8px; }
.mj-price-amt { font:800 3.6rem/1 'Playfair Display',serif; margin-top:auto; }
.mj-price-old { font:600 1rem/1 'Space Grotesk',sans-serif; text-decoration:line-through; opacity:.75; margin-top:4px; }
.mj-price-terms { font:700 .66rem/1.3 'Space Grotesk',sans-serif; letter-spacing:.08em; opacity:.9; margin-top:12px; text-transform:uppercase; }
.mj-price-seats { align-self:flex-start; margin-top:20px; padding:8px 14px; border-radius:50px; background:rgba(0,0,0,.18); font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.08em; }
.mj-price-right { background:${T.card}; padding:36px 32px; }
.mj-inc-lbl { font:800 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.14em; color:${T.muted}; }
.mj-inc-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px 20px; margin:20px 0 8px; }
.mj-inc-item { display:flex; align-items:flex-start; gap:8px; font:500 .9rem/1.4 'DM Sans',sans-serif; color:${T.ink}; }
.mj-inc-item svg { flex-shrink:0; margin-top:2px; }
.mj-price-foot { display:flex; justify-content:space-between; margin-top:16px; font:700 .68rem/1 'Space Grotesk',sans-serif; letter-spacing:.08em; color:${T.muted}; }

/* faq */
.mj-faq-h { margin-bottom:40px; }
.mj-faqs { border-top:1px solid ${T.lineDk}; }
.mj-faq { border-bottom:1px solid ${T.lineDk}; }
.mj-faq-q { display:flex; align-items:center; gap:20px; width:100%; padding:24px 4px; background:none; border:none; cursor:pointer; text-align:left; }
.mj-faq-n { font:700 .8rem/1 'Space Grotesk',sans-serif; color:${T.muted}; }
.mj-faq-qt { flex:1; font:700 clamp(1.05rem,2vw,1.4rem)/1.3 'Playfair Display',serif; color:${T.ink}; }
.mj-faq-ic { display:grid; place-items:center; width:34px; height:34px; border:1px solid ${T.lineDk}; border-radius:50%; color:${T.ink}; transition:.2s; flex-shrink:0; }
.mj-faq-open .mj-faq-ic { background:${T.coral}; border-color:${T.coral}; color:#fff; transform:rotate(45deg); }
.mj-faq-a { overflow:hidden; }
.mj-faq-a p { font:400 1rem/1.7 'DM Sans',sans-serif; color:${T.body}; padding:0 54px 26px; max-width:760px; margin:0; }

/* talk */
.mj-talk-grid { display:grid; grid-template-columns:.85fr 1.15fr; gap:48px; align-items:center; }
.mj-reach { display:flex; flex-direction:column; gap:8px; margin-top:30px; font:700 .74rem/1.4 'Space Grotesk',sans-serif; letter-spacing:.08em; color:${T.muted}; }
.mj-form { background:${T.card}; border:1px solid ${T.line}; border-radius:22px; padding:34px; box-shadow:0 30px 60px -40px rgba(0,0,0,.3); }
.mj-form-row { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
.mj-field { display:flex; flex-direction:column; gap:6px; margin-bottom:22px; }
.mj-field span { font:700 .64rem/1 'Space Grotesk',sans-serif; letter-spacing:.1em; text-transform:uppercase; color:${T.muted}; }
.mj-field input, .mj-field textarea { border:none; border-bottom:1.5px solid ${T.line}; background:none; padding:8px 2px; font:500 1rem/1.4 'DM Sans',sans-serif; color:${T.ink}; outline:none; resize:vertical; transition:border-color .16s; }
.mj-field input:focus, .mj-field textarea:focus { border-color:${T.coral}; }

/* responsive */
@media (max-width:940px) {
  .mj-hero-grid, .mj-parent-grid, .mj-proof-grid, .mj-talk-grid, .mj-price-card, .mj-tracker-body, .mj-weekly-body { grid-template-columns:1fr; }
  .mj-hero-visual { order:-1; }
  .mj-sec-head, .mj-dark-head { flex-direction:column; align-items:flex-start; }
  .mj-prog-grid { grid-template-columns:1fr 1fr; } .mj-navy-card { grid-row:auto; grid-column:span 2; }
  .mj-chats { grid-template-columns:1fr 1fr; }
  .mj-proof-masonry { columns:1; } .mj-proof-head { position:static; }
  .mj-tracker-img { border-right:none; border-bottom:1px solid ${T.navyLine}; min-height:180px; }
}
@media (max-width:560px) {
  .mj-stat-row { grid-template-columns:1fr 1fr; } .mj-stat { border-left:none; padding-left:0; }
  .mj-prog-grid, .mj-chats, .mj-form-row, .mj-inc-grid { grid-template-columns:1fr; } .mj-navy-card { grid-column:auto; }
  .mj-check-right { align-self:stretch; }
  .mj-badge-jump { font-size:.95rem; } .mj-watermark { font-size:64vw; }
}
`;
