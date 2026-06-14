import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Share2, Sparkles, ExternalLink, ArrowRight, MessageCircle,
  CalendarClock, ShieldCheck, Info, ChevronRight, Megaphone,
} from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import { useEnrol } from "../components/EnrolModal.jsx";
import { FFS_OPTIONS, QUICK_LINKS } from "../data/josaaRounds.js";
import Seo from "../components/Seo.jsx";

/* ═══════════════════════════════════════════════════════════
   JoSAA 2026 — ROUND 1 SEAT ALLOTMENT RESULT
   A heavy, self-contained news/result page scoped under
   `.josr-page`. Warm-orange brand theme, rich cards, the
   Freeze / Float / Slide explainer, round-1 cutoffs and the
   full next-steps timeline.
═══════════════════════════════════════════════════════════ */

const WA =
  "https://wa.me/917877596464?text=" +
  encodeURIComponent("Hi! JoSAA 2026 Round 1 is out — I need help deciding Freeze / Float / Slide and filling Round 2.");

/* Headline statistics for the round-1 allotment. */
const HEADER_STATS = [
  { val: "1,22,000+", lbl: "Seats on offer" },
  { val: "122", lbl: "Participating institutes" },
  { val: "~2.1 L", lbl: "Candidates in the pool" },
  { val: "6", lbl: "Total rounds" },
];

/* Quick at-a-glance facts. */
const SNAPSHOT = [
  ["Round", "Round 1 of 6"],
  ["Result declared", "13 June 2026"],
  ["Mode", "Online · josaa.nic.in"],
  ["Institutes", "23 IITs · 31 NITs · 26 IIITs · 42 GFTIs"],
  ["Seat-accept fee", "₹35,000 (Gen/OBC/EWS) · ₹15,000 (SC/ST/PwD)"],
  ["Next milestone", "Round 1 fee payment & reporting"],
];

/* Round-1 closing-rank snapshot for popular branches (illustrative, AI/OPEN). */
const CUTOFFS = [
  ["IIT Bombay", "Computer Science & Engineering", "67", "—", "iit"],
  ["IIT Delhi", "Computer Science & Engineering", "118", "—", "iit"],
  ["IIT Madras", "Computer Science & Engineering", "171", "—", "iit"],
  ["NIT Trichy", "Computer Science & Engineering", "—", "3,142", "nit"],
  ["NIT Warangal", "Computer Science & Engineering", "—", "4,008", "nit"],
  ["NIT Surathkal", "Computer Science & Engineering", "—", "4,371", "nit"],
  ["IIIT Hyderabad", "Computer Science & Engineering", "—", "2,210", "iiit"],
  ["IIIT Allahabad", "Information Technology", "—", "9,860", "iiit"],
  ["NIT Trichy", "Electronics & Communication", "—", "7,540", "nit"],
  ["IIT Roorkee", "Mechanical Engineering", "1,944", "—", "iit"],
];

/* Round 1 → Round 2 roadmap. */
const TIMELINE = [
  ["Round 1 result declared", "13 Jun 2026", "Seat-allotment list is live on josaa.nic.in. Log in with your JEE roll number and password to see your allotted institute & branch."],
  ["Online reporting + fee", "13–17 Jun 2026", "Pay the seat-acceptance fee and upload documents. Then choose Freeze, Float or Slide for your seat — this decides your Round 2."],
  ["Document verification", "14–18 Jun 2026", "Your uploaded documents are verified online. Respond fast to any query raised, or the seat can be withdrawn."],
  ["Round 2 seat allotment", "19 Jun 2026", "Float/Slide candidates may be upgraded. Fresh allotment is published for everyone still in the pool."],
  ["Rounds 3–5 + final round", "Jun–Jul 2026", "Allotment continues round by round. The final round seat is binding — withdrawal rules tighten as rounds progress."],
  ["CSAB special rounds", "Jul 2026", "After JoSAA closes, CSAB fills the leftover NIT / IIIT / GFTI seats — often the biggest last-minute upgrades."],
];

const FFS_COLOR_BY_TIER = { iit: "#F47B20", nit: "#6366f1", iiit: "#0ea5a4" };
const TIER_LABEL = { iit: "IIT", nit: "NIT", iiit: "IIIT" };

function ActionTab({ opt, active, onClick }) {
  const Ic = opt.icon;
  return (
    <button
      className={"josr-ffs-tab" + (active ? " is-active" : "")}
      onClick={onClick}
      style={active ? { "--ffs": opt.color, borderColor: opt.color, background: `${opt.color}12` } : { "--ffs": opt.color }}
    >
      <span className="josr-ffs-tab__ic" style={{ background: active ? opt.color : `${opt.color}1a`, color: active ? "#fff" : opt.color }}>
        <Ic size={18} />
      </span>
      <span className="josr-ffs-tab__txt">
        <span className="josr-ffs-tab__lbl" style={{ color: active ? opt.color : "var(--navy)" }}>{opt.label}</span>
        <span className="josr-ffs-tab__tag">{opt.tagline}</span>
      </span>
    </button>
  );
}

export default function JosaaRound1Result() {
  const nav = useNavigate();
  const { open: openEnrol } = useEnrol();
  const [ffs, setFfs] = useState("float");
  const active = FFS_OPTIONS.find((o) => o.key === ffs) || FFS_OPTIONS[0];
  const ActiveIc = active.icon;

  return (
    <div className="josr-page">
      <Seo
        title="JoSAA 2026 Round 1 Seat Allotment Result"
        description="JoSAA 2026 Round 1 seat allotment result, opening & closing ranks and what to do next (float/slide/freeze) — explained by IIT Roorkee alumni on CollegeParichay."
        path="/josaa-round-1-result-2026"
      />
      <style>{CSS}</style>

      {/* floating action bar */}
      <div className="josr-actionbar">
        <button className="josr-back" onClick={() => nav("/#news")}>
          <ArrowLeft size={16} /> All news
        </button>
        <button
          className="josr-share"
          onClick={() => {
            if (navigator.share) navigator.share({ title: "JoSAA 2026 Round 1 Result", url: window.location.href }).catch(() => {});
            else navigator.clipboard?.writeText(window.location.href);
          }}
        >
          <Share2 size={15} /> Share
        </button>
      </div>

      <div className="josr-wrap">
        {/* ── HERO ── */}
        <motion.header
          className="josr-hero"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="josr-live"
            animate={{ boxShadow: ["0 4px 16px rgba(244,123,32,.25)", "0 8px 30px rgba(244,123,32,.55)", "0 4px 16px rgba(244,123,32,.25)"] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Megaphone size={12} /> LIVE · ROUND 1 RESULT OUT
          </motion.span>
          <h1>JoSAA 2026 — Round 1 Seat Allotment Result</h1>
          <p className="josr-hero__sub">
            The first round of JoSAA 2026 seat allotment for all IITs, NITs, IIITs and GFTIs has been declared on
            <strong> josaa.nic.in</strong>. Check your allotted institute &amp; branch, then decide <strong>Freeze</strong>, <strong>Float</strong> or <strong>Slide</strong> before the reporting deadline.
          </p>
          <div className="josr-hero__cta">
            <a href="https://josaa.nic.in" target="_blank" rel="noreferrer" className="josr-btn josr-btn--primary">
              Check Round 1 result <ExternalLink size={16} />
            </a>
            <button className="josr-btn josr-btn--ghost" onClick={() => openEnrol("josaa")}>
              Get Round 2 help — ₹299 <ArrowRight size={15} />
            </button>
          </div>
          <div className="josr-hero__stats">
            {HEADER_STATS.map((s, i) => (
              <motion.div
                key={s.lbl}
                className="josr-hstat"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <div className="josr-hstat__v">{s.val}</div>
                <div className="josr-hstat__l">{s.lbl}</div>
              </motion.div>
            ))}
          </div>
        </motion.header>

        {/* ── SNAPSHOT ── */}
        <Section title="Round 1 at a glance" pill="Snapshot">
          <div className="josr-snap">
            {SNAPSHOT.map(([k, v], i) => (
              <Reveal key={k} delay={(i % 3) * 0.05}>
                <div className="josr-snap__row">
                  <span className="josr-snap__k">{k}</span>
                  <span className="josr-snap__v">{v}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ── FREEZE / FLOAT / SLIDE — the key decision ── */}
        <Section title="Got a seat? Now choose Freeze, Float or Slide" pill="Most important step">
          <p className="josr-lead">
            After Round 1, every allotted candidate must pick exactly <strong>one</strong> action for their seat before the
            reporting deadline. This single choice decides whether you lock your seat or stay in the race for an upgrade —
            pick the wrong one and you can lose an easy upgrade, or risk a confirmed seat. Tap each option to see exactly what it does.
          </p>

          <div className="josr-ffs-tabs">
            {FFS_OPTIONS.map((o) => (
              <ActionTab key={o.key} opt={o} active={ffs === o.key} onClick={() => setFfs(o.key)} />
            ))}
          </div>

          <motion.div
            key={ffs}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="josr-ffs-detail"
            style={{ "--ffs": active.color }}
          >
            <div className="josr-ffs-detail__head">
              <span className="josr-ffs-detail__ic" style={{ background: active.color }}><ActiveIc size={22} color="#fff" /></span>
              <div>
                <h3 style={{ color: active.color }}>{active.label}</h3>
                <span className="josr-ffs-detail__tag">{active.tagline}</span>
              </div>
            </div>
            <p className="josr-ffs-detail__fn">{active.fn}</p>
            <div className="josr-ffs-detail__grid">
              <div className="josr-ffs-block">
                <span className="josr-ffs-block__h"><ChevronRight size={13} /> What happens next</span>
                <p>{active.happens}</p>
              </div>
              <div className="josr-ffs-block">
                <span className="josr-ffs-block__h"><ChevronRight size={13} /> Best when</span>
                <p>{active.best}</p>
              </div>
            </div>
            <div className="josr-ffs-warn"><Info size={15} /> {active.warn}</div>
          </motion.div>

          <div className="josr-ffs-help">
            <ShieldCheck size={18} color="#F47B20" />
            <span>Not sure which to pick for your rank &amp; preferences? Our mentors decide it with you, every round.</span>
            <button className="josr-btn josr-btn--primary josr-btn--sm" onClick={() => openEnrol("josaa")}>Get expert help</button>
          </div>
        </Section>

        {/* ── ROUND 1 CUTOFFS ── */}
        <Section title="Round 1 closing ranks — popular branches" pill="Indicative cutoffs">
          <p className="josr-lead">
            A snapshot of where Round 1 closed for the most-chased branches (OPEN / All-India quota). Cutoffs ease in later
            rounds as candidates float and slide — so a branch just out of reach now can still open up in Round 2 or 3.
          </p>
          <Reveal>
            <div className="josr-table">
              <table>
                <thead>
                  <tr>
                    <th>Institute</th>
                    <th>Branch</th>
                    <th className="right">IIT — CRL</th>
                    <th className="right">NIT/IIIT — CRL</th>
                  </tr>
                </thead>
                <tbody>
                  {CUTOFFS.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <span className="josr-tier" style={{ background: `${FFS_COLOR_BY_TIER[r[4]]}1a`, color: FFS_COLOR_BY_TIER[r[4]] }}>{TIER_LABEL[r[4]]}</span>
                        <span className="josr-inst">{r[0]}</span>
                      </td>
                      <td className="josr-branch">{r[1]}</td>
                      <td className="right josr-rank">{r[2]}</td>
                      <td className="right josr-rank">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <p className="josr-fineprint">
            * Indicative OPEN-category ranks for illustration. Always verify exact opening/closing ranks on the official JoSAA portal and our{" "}
            <Link to="/cutoffs">official cutoffs</Link> page.
          </p>
        </Section>

        {/* ── NEXT STEPS TIMELINE ── */}
        <Section title="What happens after Round 1" pill="Roadmap">
          <div className="josr-timeline">
            {TIMELINE.map(([t, when, d], i) => (
              <Reveal key={t} delay={(i % 2) * 0.05}>
                <div className="josr-tl">
                  <div className="josr-tl__node">{i + 1}</div>
                  <div className="josr-tl__body">
                    <div className="josr-tl__top">
                      <h4>{t}</h4>
                      <span className="josr-tl__when"><CalendarClock size={12} /> {when}</span>
                    </div>
                    <p>{d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ── ALL QUICK LINKS ── */}
        <Section title="All JoSAA & counselling links" pill="Quick access">
          <div className="josr-links">
            {QUICK_LINKS.map((l) => {
              const Ic = l.icon;
              const inner = (
                <>
                  <span className="josr-link__ic" style={{ background: l.hot ? "#F47B20" : "rgba(244,123,32,.12)", color: l.hot ? "#fff" : "#F47B20" }}>
                    <Ic size={18} />
                  </span>
                  <span className="josr-link__txt">
                    <span className="josr-link__lbl">
                      {l.label}
                      {l.hot && <span className="josr-link__hot">HOT</span>}
                    </span>
                    <span className="josr-link__tag">{l.tag}</span>
                  </span>
                  <ArrowRight size={16} className="josr-link__arr" />
                </>
              );
              return l.external ? (
                <a key={l.label} href={l.to} target="_blank" rel="noreferrer" className="josr-link">{inner}</a>
              ) : (
                <button key={l.label} className="josr-link" onClick={() => { nav(l.to); window.scrollTo({ top: 0 }); }}>{inner}</button>
              );
            })}
          </div>
        </Section>

        {/* ── CTA ── */}
        <div className="josr-cta">
          <Sparkles size={22} color="#fff" />
          <h2>Don't gamble Round 2 on a guess.</h2>
          <p>Get a mentor who tells you exactly when to Freeze, Float or Slide and re-orders your choices every round — for ₹299.</p>
          <div className="josr-cta__btns">
            <button className="josr-btn josr-btn--light" onClick={() => openEnrol("josaa")}>Enrol now — ₹299 <ArrowRight size={16} /></button>
            <a href={WA} target="_blank" rel="noreferrer" className="josr-btn josr-btn--outline"><MessageCircle size={16} /> Ask on WhatsApp</a>
          </div>
        </div>

        <div className="josr-footer">
          Source: <strong>Joint Seat Allocation Authority (JoSAA) 2026</strong> · Official portal{" "}
          <a href="https://josaa.nic.in" target="_blank" rel="noreferrer">josaa.nic.in</a>. Figures shown are indicative and for guidance only.
        </div>
      </div>
    </div>
  );
}

/* Section shell with heading + accent bar. */
function Section({ title, pill, children }) {
  return (
    <section className="josr-section">
      <Reveal>
        <div className="josr-section__head">
          <h2>{title}</h2>
          {pill && <span className="josr-section__pill">{pill}</span>}
          <span className="josr-section__bar" />
        </div>
      </Reveal>
      {children}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCOPED CSS — everything under `.josr-page`
═══════════════════════════════════════════════════════════ */
const CSS = `
.josr-page{
  --o:#F47B20; --o2:#ff9f45; --navy:#1a1a2e; --muted:#6b7280;
  --card:#ffffff; --line:rgba(13,27,62,.08);
  background:#ffffff;
  color:var(--navy); min-height:100vh; position:relative; overflow-x:hidden;
  padding-top:56px;
  font-family:'Space Grotesk','Sora',system-ui,sans-serif;
}
@media (prefers-reduced-motion:reduce){.josr-page *{animation:none !important}}
.josr-page *{box-sizing:border-box}
.josr-wrap{position:relative; z-index:1; max-width:1040px; margin:0 auto; padding:18px 22px 80px}

/* action bar */
.josr-actionbar{position:sticky; top:108px; z-index:20; display:flex; justify-content:space-between; align-items:center; max-width:1040px; margin:0 auto; padding:10px 22px 0}
.josr-back,.josr-share{display:inline-flex; align-items:center; gap:7px; font-size:12.5px; font-weight:700; padding:8px 15px; border-radius:50px; cursor:pointer; border:1px solid rgba(244,123,32,.2); transition:all .22s}
.josr-back{background:rgba(255,255,255,.8); color:var(--navy); backdrop-filter:blur(8px)}
.josr-back:hover{background:#fff; transform:translateX(-2px); box-shadow:0 6px 18px rgba(13,27,62,.12)}
.josr-share{background:linear-gradient(135deg,var(--o),var(--o2)); color:#fff; border-color:transparent; box-shadow:0 4px 14px rgba(244,123,32,.32)}
.josr-share:hover{transform:translateY(-1px); box-shadow:0 8px 22px rgba(244,123,32,.45)}

/* hero */
.josr-hero{text-align:center; padding:30px 0 34px; border-bottom:1px solid var(--line); margin-bottom:8px}
.josr-live{display:inline-flex; align-items:center; gap:7px; background:linear-gradient(135deg,var(--o),var(--o2)); color:#fff; font-size:11px; font-weight:800; letter-spacing:1.6px; text-transform:uppercase; padding:7px 16px; border-radius:30px; margin-bottom:18px}
.josr-hero h1{font-weight:800; font-size:clamp(1.9rem,4.6vw,3rem); line-height:1.12; letter-spacing:-.5px; margin:0 auto 14px; max-width:820px;
  background:linear-gradient(105deg,#c2410c 0%,#F47B20 45%,#ea580c 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text}
.josr-hero__sub{color:rgba(28,28,40,.7); font-size:1.04rem; line-height:1.65; max-width:680px; margin:0 auto}
.josr-hero__sub strong{color:var(--o); font-weight:700}
.josr-hero__cta{display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:24px}
.josr-hero__stats{display:flex; justify-content:center; gap:14px; flex-wrap:wrap; margin-top:30px}
.josr-hstat{background:var(--card); border:1px solid var(--line); border-radius:14px; padding:16px 22px; min-width:140px; backdrop-filter:blur(6px); box-shadow:0 6px 22px rgba(13,27,62,.06)}
.josr-hstat__v{font-size:1.6rem; font-weight:800; line-height:1; background:linear-gradient(135deg,var(--o),#ea580c); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text}
.josr-hstat__l{font-size:11.5px; color:var(--muted); margin-top:6px; letter-spacing:.3px}

/* buttons */
.josr-btn{display:inline-flex; align-items:center; gap:8px; font-weight:700; font-size:14.5px; padding:13px 22px; border-radius:12px; cursor:pointer; border:none; text-decoration:none; transition:transform .2s, box-shadow .2s; font-family:inherit}
.josr-btn--sm{padding:9px 16px; font-size:13px}
.josr-btn--primary{background:linear-gradient(135deg,var(--o),#ea580c); color:#fff; box-shadow:0 8px 22px rgba(244,123,32,.36)}
.josr-btn--primary:hover{transform:translateY(-2px); box-shadow:0 12px 30px rgba(244,123,32,.5)}
.josr-btn--ghost{background:#fff; color:var(--navy); border:1.5px solid rgba(244,123,32,.3)}
.josr-btn--ghost:hover{transform:translateY(-2px); box-shadow:0 8px 22px rgba(13,27,62,.1)}
.josr-btn--light{background:#fff; color:var(--o)}
.josr-btn--light:hover{transform:translateY(-2px)}
.josr-btn--outline{background:rgba(255,255,255,.14); color:#fff; border:1.5px solid rgba(255,255,255,.55)}

/* section */
.josr-section{margin-top:48px}
.josr-section__head{display:flex; align-items:center; gap:12px; margin-bottom:16px}
.josr-section__head h2{font-size:clamp(1.2rem,2.6vw,1.55rem); font-weight:800; color:var(--navy); letter-spacing:-.3px}
.josr-section__pill{background:rgba(244,123,32,.1); border:1px solid rgba(244,123,32,.22); color:var(--o); font-size:10px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; padding:4px 11px; border-radius:30px; white-space:nowrap}
.josr-section__bar{flex:1; height:2px; border-radius:2px; background:linear-gradient(90deg,var(--o),rgba(244,123,32,.1),transparent)}
.josr-lead{color:rgba(28,28,40,.72); font-size:1rem; line-height:1.7; max-width:760px; margin:0 0 22px}
.josr-lead strong{color:var(--navy)}

/* snapshot */
.josr-snap{display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:12px}
.josr-snap__row{display:flex; justify-content:space-between; align-items:center; gap:14px; background:var(--card); border:1px solid var(--line); border-radius:12px; padding:14px 16px; backdrop-filter:blur(6px)}
.josr-snap__k{font-size:12.5px; color:var(--muted); font-weight:600; flex-shrink:0}
.josr-snap__v{font-size:13.5px; font-weight:700; color:var(--navy); text-align:right}

/* freeze/float/slide */
.josr-ffs-tabs{display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:18px}
@media(max-width:640px){.josr-ffs-tabs{grid-template-columns:1fr}}
.josr-ffs-tab{display:flex; align-items:center; gap:12px; text-align:left; padding:14px 16px; border-radius:14px; cursor:pointer; background:#fff; border:1.5px solid var(--line); transition:transform .2s, box-shadow .2s, border-color .2s}
.josr-ffs-tab:hover{transform:translateY(-2px); box-shadow:0 10px 26px rgba(13,27,62,.1)}
.josr-ffs-tab.is-active{box-shadow:0 10px 28px rgba(13,27,62,.14)}
.josr-ffs-tab__ic{width:40px; height:40px; border-radius:11px; display:grid; place-items:center; flex-shrink:0; transition:all .2s}
.josr-ffs-tab__lbl{display:block; font-weight:800; font-size:1.02rem}
.josr-ffs-tab__tag{display:block; font-size:11.5px; color:var(--muted); margin-top:1px}
.josr-ffs-detail{background:var(--card); border:1px solid var(--ffs); border-radius:18px; padding:24px; backdrop-filter:blur(8px); box-shadow:0 14px 40px rgba(13,27,62,.08); position:relative; overflow:hidden}
.josr-ffs-detail::before{content:''; position:absolute; top:0; left:0; width:100%; height:4px; background:var(--ffs)}
.josr-ffs-detail__head{display:flex; align-items:center; gap:14px; margin-bottom:14px}
.josr-ffs-detail__ic{width:48px; height:48px; border-radius:13px; display:grid; place-items:center; flex-shrink:0}
.josr-ffs-detail__head h3{font-size:1.4rem; font-weight:800; line-height:1}
.josr-ffs-detail__tag{font-size:12.5px; color:var(--muted); font-weight:600}
.josr-ffs-detail__fn{font-size:1.05rem; font-weight:600; color:var(--navy); line-height:1.6; margin:0 0 18px}
.josr-ffs-detail__grid{display:grid; grid-template-columns:1fr 1fr; gap:16px}
@media(max-width:640px){.josr-ffs-detail__grid{grid-template-columns:1fr}}
.josr-ffs-block{background:rgba(255,255,255,.6); border:1px solid var(--line); border-radius:12px; padding:14px 16px}
.josr-ffs-block__h{display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:800; letter-spacing:.6px; text-transform:uppercase; color:var(--ffs); margin-bottom:6px}
.josr-ffs-block p{font-size:13.8px; line-height:1.6; color:rgba(28,28,40,.78); margin:0}
.josr-ffs-warn{display:flex; align-items:center; gap:8px; margin-top:16px; background:rgba(244,123,32,.08); border:1px dashed rgba(244,123,32,.35); border-radius:10px; padding:10px 14px; font-size:13px; font-weight:600; color:#9a3412}
.josr-ffs-help{display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-top:18px; background:#fff; border:1px solid rgba(244,123,32,.22); border-radius:14px; padding:14px 18px; box-shadow:0 6px 20px rgba(13,27,62,.05)}
.josr-ffs-help span{flex:1; min-width:200px; font-size:13.8px; font-weight:600; color:var(--navy)}

/* table */
.josr-table{background:var(--card); border:1px solid var(--line); border-radius:16px; overflow:auto; backdrop-filter:blur(6px); box-shadow:0 8px 26px rgba(13,27,62,.06)}
.josr-table table{width:100%; border-collapse:collapse; min-width:560px}
.josr-table thead tr{background:linear-gradient(90deg,rgba(244,123,32,.1),rgba(99,102,241,.06))}
.josr-table th{text-align:left; padding:13px 16px; font-size:11px; font-weight:800; letter-spacing:.8px; text-transform:uppercase; color:var(--o)}
.josr-table th.right{text-align:right}
.josr-table tbody tr{border-top:1px solid var(--line); transition:background .2s}
.josr-table tbody tr:hover{background:rgba(244,123,32,.05)}
.josr-table td{padding:12px 16px; font-size:13.5px; color:var(--navy)}
.josr-table td.right{text-align:right}
.josr-tier{display:inline-block; font-size:9.5px; font-weight:800; letter-spacing:.5px; padding:2px 7px; border-radius:5px; margin-right:8px; vertical-align:middle}
.josr-inst{font-weight:700}
.josr-branch{color:var(--muted); font-size:13px}
.josr-rank{font-weight:800; font-variant-numeric:tabular-nums}
.josr-fineprint{font-size:12px; color:var(--muted); margin-top:12px; line-height:1.6}
.josr-fineprint a{color:var(--o); font-weight:700}

/* timeline */
.josr-timeline{display:flex; flex-direction:column; gap:12px}
.josr-tl{display:flex; gap:16px; background:var(--card); border:1px solid var(--line); border-radius:14px; padding:16px 18px; backdrop-filter:blur(6px); transition:transform .2s, box-shadow .2s}
.josr-tl:hover{transform:translateX(3px); box-shadow:0 10px 28px rgba(13,27,62,.08)}
.josr-tl__node{width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,var(--o),#ea580c); color:#fff; display:grid; place-items:center; font-weight:800; font-size:16px; flex-shrink:0}
.josr-tl__top{display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:4px}
.josr-tl__top h4{font-size:1rem; font-weight:800; color:var(--navy)}
.josr-tl__when{display:inline-flex; align-items:center; gap:4px; font-size:11.5px; font-weight:700; color:var(--o); background:rgba(244,123,32,.1); padding:2px 9px; border-radius:20px}
.josr-tl__body p{font-size:13.6px; line-height:1.6; color:rgba(28,28,40,.72); margin:0}

/* links */
.josr-links{display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:12px}
.josr-link{display:flex; align-items:center; gap:13px; text-align:left; width:100%; background:var(--card); border:1px solid var(--line); border-radius:14px; padding:14px 16px; cursor:pointer; text-decoration:none; backdrop-filter:blur(6px); transition:transform .2s, box-shadow .2s, border-color .2s}
.josr-link:hover{transform:translateY(-3px); border-color:rgba(244,123,32,.4); box-shadow:0 14px 32px rgba(244,123,32,.16)}
.josr-link__ic{width:40px; height:40px; border-radius:11px; display:grid; place-items:center; flex-shrink:0}
.josr-link__txt{flex:1; min-width:0}
.josr-link__lbl{display:flex; align-items:center; gap:8px; font-weight:700; font-size:14px; color:var(--navy)}
.josr-link__hot{font-size:9px; font-weight:800; letter-spacing:.5px; color:#fff; background:#ef4444; padding:2px 6px; border-radius:5px}
.josr-link__tag{display:block; font-size:12px; color:var(--muted); margin-top:2px}
.josr-link__arr{color:var(--o); flex-shrink:0}

/* cta */
.josr-cta{margin-top:56px; text-align:center; background:linear-gradient(135deg,var(--o),#ea580c); border-radius:24px; padding:44px 28px; color:#fff; box-shadow:0 20px 50px rgba(244,123,32,.34)}
.josr-cta h2{font-size:clamp(1.5rem,3.4vw,2.1rem); font-weight:800; margin:12px 0 8px}
.josr-cta p{color:rgba(255,255,255,.92); max-width:560px; margin:0 auto 22px; line-height:1.6}
.josr-cta__btns{display:flex; gap:12px; justify-content:center; flex-wrap:wrap}

/* footer */
.josr-footer{margin-top:40px; padding-top:22px; border-top:1px solid var(--line); text-align:center; font-size:12.5px; color:var(--muted); line-height:1.7}
.josr-footer strong{color:var(--o)}
.josr-footer a{color:var(--o); font-weight:700}
`;
