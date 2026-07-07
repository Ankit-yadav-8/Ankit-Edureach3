/* JosaaAwaitedResult — shared layout for JoSAA seat-allotment result pages
   whose result is not yet declared. Round 2 & 3 render this with their own
   round number and expected window; the live cutoff table is filled in once
   JoSAA publishes that round. Styled with the College Parichay warm theme. */
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Clock, ExternalLink, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import Seo from "./Seo.jsx";
import { CL, clEyebrow } from "./home/clTheme.js";

const STEPS = [
  ["Seat allotment is published", "Log in on josaa.nic.in with your JEE roll number & password to see the institute and branch allotted this round."],
  ["Accept, pay & report online", "Pay the seat-acceptance fee and complete online reporting within the window, then upload your documents for verification."],
  ["Choose Freeze, Float or Slide", "Freeze locks this seat, Float keeps you in for a better college/branch, Slide upgrades the branch within the same institute."],
  ["Wait for the next round", "Float/Slide candidates are re-considered in the following round — fresh, often better, allotments are published each round."],
];

export default function JosaaAwaitedResult({ roundNo, expected, path, blurb }) {
  const nav = useNavigate();
  return (
    <div style={{ background: CL.cream, minHeight: "100vh" }}>
      <Seo
        title={`JoSAA 2026 Round ${roundNo} Seat Allotment Result — Date & Updates`}
        description={`JoSAA 2026 Round ${roundNo} seat allotment result date, reporting steps and Freeze/Float/Slide guidance. Live opening & closing ranks are updated here as soon as JoSAA declares Round ${roundNo}.`}
        path={path}
      />
      <style>{CSS}</style>

      {/* action bar */}
      <div className="jar-actionbar">
        <button className="jar-btn" onClick={() => nav("/")}><ArrowLeft size={16} /> Back to home</button>
        <button
          className="jar-btn"
          onClick={() => {
            if (navigator.share) navigator.share({ title: `JoSAA 2026 Round ${roundNo} Result`, url: window.location.href }).catch(() => {});
            else navigator.clipboard?.writeText(window.location.href);
          }}
        ><Share2 size={15} /> Share</button>
      </div>

      <div className="container" style={{ maxWidth: 860, paddingTop: 96, paddingBottom: 80 }}>
        {/* hero */}
        <motion.header initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span style={clEyebrow}>JoSAA 2026 · Round {roundNo}</span>
          <div className="jar-await"><Clock size={13} /> Result Awaited</div>
          <h1 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(2rem,5vw,3rem)", color: CL.ink, letterSpacing: "-1.3px", lineHeight: 1.08, margin: "14px 0 12px" }}>
            JoSAA 2026 Round {roundNo} <span style={{ color: CL.coral }}>Seat Allotment</span>
          </h1>
          <p style={{ color: CL.body, fontSize: "1.06rem", lineHeight: 1.7, maxWidth: 640 }}>{blurb}</p>
          <div className="jar-expected"><CheckCircle2 size={15} color={CL.green} /> Expected: <strong>{expected}</strong></div>
        </motion.header>

        {/* snapshot */}
        <div className="jar-snapshot">
          {[
            ["Round", `Round ${roundNo} of 6`],
            ["Expected result", expected],
            ["Mode", "Online · josaa.nic.in"],
            ["Applies to", "Float / Slide candidates + fresh pool"],
          ].map(([k, v]) => (
            <div key={k} className="jar-snap-row"><span>{k}</span><strong>{v}</strong></div>
          ))}
        </div>

        {/* what happens */}
        <h2 className="jar-h2">What happens in Round {roundNo}</h2>
        <div className="jar-steps">
          {STEPS.map(([t, d], i) => (
            <div key={t} className="jar-step">
              <span className="jar-step-n">{i + 1}</span>
              <div><div className="jar-step-t">{t}</div><div className="jar-step-d">{d}</div></div>
            </div>
          ))}
        </div>

        {/* live-table placeholder */}
        <div className="jar-note">
          <ShieldCheck size={18} color={CL.coral} />
          <div>
            <strong>Live opening &amp; closing ranks for Round {roundNo} will appear here</strong> the moment JoSAA
            publishes the allotment. Bookmark this page or follow us for the update.
          </div>
        </div>

        {/* CTAs */}
        <div className="jar-cta-row">
          <a href="https://josaa.nic.in" target="_blank" rel="noreferrer" className="jar-cta jar-cta--primary">
            Official JoSAA Portal <ExternalLink size={15} />
          </a>
          <Link to="/josaa-round-1-result-2026" className="jar-cta jar-cta--ghost">
            View Round 1 Result <ArrowRight size={15} />
          </Link>
          <Link to="/josaa-2026" className="jar-cta jar-cta--ghost">
            JoSAA Counselling Help <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

const CSS = `
.jar-actionbar { position:sticky; top:64px; z-index:20; display:flex; gap:10px; justify-content:flex-end; max-width:860px; margin:0 auto; padding:10px 20px 0; }
.jar-btn { display:inline-flex; align-items:center; gap:7px; background:#fff; border:1px solid ${CL.cream3}; border-radius:50px; padding:8px 15px; font:700 13px/1 ${CL.display}; color:${CL.ink}; cursor:pointer; box-shadow:0 4px 14px rgba(33,29,46,.06); }
.jar-btn:hover { border-color:${CL.coral}66; }
.jar-await { display:inline-flex; align-items:center; gap:6px; margin-left:10px; font:800 11px/1 ${CL.display}; letter-spacing:.06em; text-transform:uppercase; color:${CL.coralDk}; background:${CL.coralSoft}; padding:6px 12px; border-radius:50px; }
.jar-expected { display:inline-flex; align-items:center; gap:8px; margin-top:20px; font-size:.98rem; color:${CL.ink2}; background:#fff; border:1px solid ${CL.line}; border-radius:12px; padding:11px 16px; }
.jar-snapshot { margin:30px 0 8px; background:#fff; border:1px solid ${CL.line}; border-radius:18px; overflow:hidden; box-shadow:0 8px 24px rgba(33,29,46,.05); }
.jar-snap-row { display:flex; justify-content:space-between; gap:16px; padding:14px 20px; border-top:1px solid ${CL.line}; font-size:.94rem; }
.jar-snap-row:first-child { border-top:none; }
.jar-snap-row span { color:${CL.muted}; font-weight:600; }
.jar-snap-row strong { color:${CL.ink}; text-align:right; }
.jar-h2 { font:800 1.5rem/1.2 ${CL.display}; color:${CL.ink}; letter-spacing:-.5px; margin:44px 0 20px; }
.jar-steps { display:flex; flex-direction:column; gap:14px; }
.jar-step { display:flex; gap:14px; background:#fff; border:1px solid ${CL.line}; border-radius:16px; padding:16px 18px; box-shadow:0 6px 18px rgba(33,29,46,.04); }
.jar-step-n { flex-shrink:0; width:28px; height:28px; border-radius:50%; display:grid; place-items:center; background:${CL.coralSoft}; color:${CL.coralDk}; font:800 .9rem/1 ${CL.display}; }
.jar-step-t { font:800 1rem/1.3 ${CL.display}; color:${CL.ink}; margin-bottom:4px; }
.jar-step-d { font-size:.9rem; line-height:1.55; color:${CL.body}; }
.jar-note { display:flex; gap:12px; align-items:flex-start; margin:26px 0 0; background:${CL.coralSoft}66; border:1px solid ${CL.coral}33; border-radius:16px; padding:16px 18px; font-size:.92rem; line-height:1.55; color:${CL.ink2}; }
.jar-cta-row { display:flex; flex-wrap:wrap; gap:12px; margin-top:30px; }
.jar-cta { display:inline-flex; align-items:center; gap:8px; border-radius:50px; padding:13px 22px; font:800 .92rem/1 ${CL.display}; text-decoration:none; }
.jar-cta--primary { background:${CL.coral}; color:#fff; box-shadow:0 10px 24px rgba(255,105,61,.3); }
.jar-cta--ghost { background:#fff; color:${CL.ink}; border:1px solid ${CL.cream3}; }
.jar-cta--ghost:hover { border-color:${CL.coral}66; }
@media (max-width:520px) { .jar-snap-row { flex-direction:column; gap:3px; } .jar-snap-row strong { text-align:left; } }
`;
