import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, ArrowRight, ExternalLink, MessageCircle, Clock } from "lucide-react";
import { FFS_OPTIONS, QUICK_LINKS, ROUND1_PATH } from "../data/josaaRounds.js";
import { useEnrol } from "./EnrolModal.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

/* ═══════════════════════════════════════════════════════════
   JosaaUpdatesPopup — a global "live counselling updates" card
   that surfaces every 2.5 minutes on every page. It bundles the
   JoSAA Round 1 result link, the full list of quick links and
   an interactive Freeze / Float / Slide explainer.
═══════════════════════════════════════════════════════════ */

const POPUP_INTERVAL = 150000; // 2.5 minutes
const WA =
  "https://wa.me/917877596464?text=" +
  encodeURIComponent("Hi! I saw the JoSAA 2026 Round 1 update — I need counselling help.");

export default function JosaaUpdatesPopup() {
  const [open, setOpen] = useState(false);
  const [ffs, setFfs] = useState("float");
  const nav = useNavigate();
  const enrol = useEnrol();
  const { isLoggedIn } = useAuth();

  // Re-surface the popup every 2.5 min. If it's already open, the tick is a
  // no-op, so it simply re-appears 2.5 min after the user closes it. Only runs
  // once the user is logged in — otherwise it would cover the mandatory login gate.
  useEffect(() => {
    if (!isLoggedIn) { setOpen(false); return; }
    const id = setInterval(() => setOpen(true), POPUP_INTERVAL);
    return () => clearInterval(id);
  }, [isLoggedIn]);

  const close = () => setOpen(false);

  const goInternal = (to) => {
    close();
    nav(to);
    window.scrollTo({ top: 0 });
  };

  const openEnrol = () => {
    close();
    enrol?.open?.("josaa");
  };

  const active = FFS_OPTIONS.find((o) => o.key === ffs) || FFS_OPTIONS[0];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="jpop-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <style>{CSS}</style>
          <motion.div
            className="jpop-card"
            initial={{ y: 30, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            role="dialog"
            aria-label="JoSAA 2026 live updates"
          >
            {/* close */}
            <button className="jpop-close" onClick={close} aria-label="Close"><X size={18} /></button>

            {/* header */}
            <div className="jpop-head">
              <span className="jpop-live"><span className="jpop-dot" /> LIVE</span>
              <h2><Bell size={17} /> JoSAA 2026 — Live Counselling Updates</h2>
              <p>Round 1 seat allotment is out. Don't miss your reporting window or your Freeze / Float / Slide decision.</p>
            </div>

            <div className="jpop-body">
              {/* featured Round 1 result banner */}
              <button className="jpop-feature" onClick={() => goInternal(ROUND1_PATH)}>
                <span className="jpop-feature__tag">🔥 JUST DECLARED</span>
                <span className="jpop-feature__title">JoSAA 2026 Round 1 Seat Allotment Result</span>
                <span className="jpop-feature__sub">View your allotment, Round 1 cutoffs &amp; next steps</span>
                <span className="jpop-feature__cta">Open result page <ArrowRight size={15} /></span>
              </button>

              {/* Freeze / Float / Slide */}
              <div className="jpop-sec-title">Got a seat? Choose your action</div>
              <div className="jpop-ffs-tabs">
                {FFS_OPTIONS.map((o) => {
                  const Ic = o.icon;
                  const on = ffs === o.key;
                  return (
                    <button
                      key={o.key}
                      className={"jpop-ffs-tab" + (on ? " is-on" : "")}
                      onClick={() => setFfs(o.key)}
                      style={on ? { borderColor: o.color, background: `${o.color}14`, color: o.color } : undefined}
                    >
                      <Ic size={15} /> {o.label}
                    </button>
                  );
                })}
              </div>
              <div className="jpop-ffs-detail" style={{ borderColor: `${active.color}55` }}>
                <span className="jpop-ffs-detail__fn" style={{ color: active.color }}>{active.tagline}</span>
                <p>{active.fn}</p>
                <p className="jpop-ffs-detail__next">{active.happens}</p>
              </div>

              {/* all links */}
              <div className="jpop-sec-title">All JoSAA &amp; counselling links</div>
              <div className="jpop-links">
                {QUICK_LINKS.map((l) => {
                  const Ic = l.icon;
                  const inner = (
                    <>
                      <span className="jpop-link__ic" style={{ background: l.hot ? "#F15A38" : "rgba(244,123,32,.12)", color: l.hot ? "#fff" : "#F15A38" }}>
                        <Ic size={15} />
                      </span>
                      <span className="jpop-link__txt">
                        <span className="jpop-link__lbl">
                          {l.label}
                          {l.hot && <span className="jpop-link__hot">HOT</span>}
                          {l.external && <ExternalLink size={11} style={{ marginLeft: 5, opacity: 0.6 }} />}
                        </span>
                        <span className="jpop-link__tag">{l.tag}</span>
                      </span>
                      <ArrowRight size={14} className="jpop-link__arr" />
                    </>
                  );
                  return l.external ? (
                    <a key={l.label} href={l.to} target="_blank" rel="noreferrer" className="jpop-link" onClick={close}>{inner}</a>
                  ) : (
                    <button key={l.label} className="jpop-link" onClick={() => goInternal(l.to)}>{inner}</button>
                  );
                })}
              </div>
            </div>

            {/* footer */}
            <div className="jpop-foot">
              <button className="jpop-btn jpop-btn--primary" onClick={openEnrol}>Get ₹299 counselling help <ArrowRight size={15} /></button>
              <a className="jpop-btn jpop-btn--wa" href={WA} target="_blank" rel="noreferrer" onClick={close}><MessageCircle size={15} /> WhatsApp</a>
              <span className="jpop-foot__note"><Clock size={12} /> Updates refresh every minute</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

const CSS = `
.jpop-overlay{position:fixed; inset:0; z-index:3500; display:grid; place-items:center; padding:16px;
  background:rgba(20,12,4,.55); backdrop-filter:blur(5px); -webkit-backdrop-filter:blur(5px); overflow-y:auto;
  font-family:'Space Grotesk','Sora',system-ui,sans-serif;}
.jpop-card{width:100%; max-width:540px; background:#fff; border-radius:22px; overflow:hidden; position:relative; margin:auto;
  box-shadow:0 30px 80px rgba(20,12,4,.45); display:flex; flex-direction:column; max-height:calc(100vh - 32px);}
.jpop-close{position:absolute; top:13px; right:13px; z-index:4; width:34px; height:34px; border-radius:50%; border:none;
  background:rgba(255,255,255,.2); color:#fff; cursor:pointer; display:grid; place-items:center; transition:background .15s}
.jpop-close:hover{background:rgba(255,255,255,.34)}

/* header */
.jpop-head{background:linear-gradient(135deg,#F15A38,#E0421F); color:#fff; padding:22px 24px 20px; position:relative; overflow:hidden}
.jpop-head::after{content:''; position:absolute; top:-40px; right:-20px; width:180px; height:180px; border-radius:50%;
  background:radial-gradient(circle,rgba(255,255,255,.18),transparent 70%)}
.jpop-live{display:inline-flex; align-items:center; gap:6px; font-size:10px; font-weight:800; letter-spacing:1.5px;
  background:rgba(255,255,255,.2); padding:4px 11px; border-radius:30px; position:relative}
.jpop-dot{width:7px; height:7px; border-radius:50%; background:#fff; animation:jpopPulse 1.3s ease-in-out infinite}
@keyframes jpopPulse{0%,100%{opacity:1; transform:scale(1)}50%{opacity:.4; transform:scale(.7)}}
.jpop-head h2{display:flex; align-items:center; gap:8px; font-size:1.18rem; font-weight:800; margin:12px 0 5px; position:relative; line-height:1.25}
.jpop-head p{font-size:13px; color:rgba(255,255,255,.92); line-height:1.5; position:relative; margin:0}

/* body (scrolls) */
.jpop-body{padding:18px 22px 6px; overflow-y:auto}
.jpop-sec-title{font-size:11px; font-weight:800; letter-spacing:.7px; text-transform:uppercase; color:#9a3412; margin:18px 0 10px}

/* featured */
.jpop-feature{display:flex; flex-direction:column; align-items:flex-start; gap:3px; width:100%; text-align:left; cursor:pointer;
  background:linear-gradient(135deg,#ffffff,#ffedd5); border:1.5px solid rgba(244,123,32,.4); border-radius:14px; padding:14px 16px;
  transition:transform .2s, box-shadow .2s}
.jpop-feature:hover{transform:translateY(-2px); box-shadow:0 12px 28px rgba(244,123,32,.22)}
.jpop-feature__tag{font-size:9.5px; font-weight:800; letter-spacing:.6px; color:#fff; background:#ef4444; padding:3px 8px; border-radius:5px}
.jpop-feature__title{font-size:15px; font-weight:800; color:#1a1a2e; margin-top:6px; line-height:1.3}
.jpop-feature__sub{font-size:12px; color:#6b7280}
.jpop-feature__cta{display:inline-flex; align-items:center; gap:5px; font-size:12.5px; font-weight:800; color:#F15A38; margin-top:7px}

/* ffs */
.jpop-ffs-tabs{display:grid; grid-template-columns:repeat(3,1fr); gap:8px}
.jpop-ffs-tab{display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:9px 6px; border-radius:10px;
  border:1.5px solid rgba(0,0,0,.1); background:#fff; color:#374151; font-weight:700; font-size:13px; cursor:pointer;
  font-family:inherit; transition:all .18s}
.jpop-ffs-tab:hover{border-color:rgba(244,123,32,.4)}
.jpop-ffs-detail{margin-top:10px; border:1.5px solid; border-radius:12px; padding:12px 14px; background:#fafafa}
.jpop-ffs-detail__fn{font-size:11px; font-weight:800; letter-spacing:.5px; text-transform:uppercase}
.jpop-ffs-detail p{font-size:13px; line-height:1.55; color:#374151; margin:5px 0 0}
.jpop-ffs-detail__next{color:#6b7280 !important; font-size:12.3px !important}

/* links */
.jpop-links{display:flex; flex-direction:column; gap:8px}
.jpop-link{display:flex; align-items:center; gap:11px; width:100%; text-align:left; cursor:pointer; text-decoration:none;
  background:#fff; border:1px solid rgba(0,0,0,.09); border-radius:12px; padding:10px 13px; transition:transform .18s, box-shadow .18s, border-color .18s}
.jpop-link:hover{transform:translateX(3px); border-color:rgba(244,123,32,.4); box-shadow:0 8px 20px rgba(244,123,32,.14)}
.jpop-link__ic{width:34px; height:34px; border-radius:9px; display:grid; place-items:center; flex-shrink:0}
.jpop-link__txt{flex:1; min-width:0}
.jpop-link__lbl{display:flex; align-items:center; gap:6px; font-weight:700; font-size:13.3px; color:#1a1a2e}
.jpop-link__hot{font-size:8.5px; font-weight:800; letter-spacing:.4px; color:#fff; background:#ef4444; padding:1px 5px; border-radius:4px}
.jpop-link__tag{display:block; font-size:11.3px; color:#9ca3af; margin-top:1px}
.jpop-link__arr{color:#F15A38; flex-shrink:0}

/* footer */
.jpop-foot{display:flex; align-items:center; gap:9px; flex-wrap:wrap; padding:14px 22px 18px; border-top:1px solid rgba(0,0,0,.07); background:#fff}
.jpop-btn{display:inline-flex; align-items:center; gap:7px; font-weight:800; font-size:13px; padding:11px 16px; border-radius:11px; cursor:pointer; border:none; text-decoration:none; font-family:inherit; transition:transform .18s, box-shadow .18s}
.jpop-btn--primary{flex:1; justify-content:center; background:linear-gradient(135deg,#F15A38,#E0421F); color:#fff; box-shadow:0 8px 20px rgba(244,123,32,.34)}
.jpop-btn--primary:hover{transform:translateY(-1px)}
.jpop-btn--wa{background:#25D366; color:#fff}
.jpop-foot__note{display:inline-flex; align-items:center; gap:4px; width:100%; justify-content:center; font-size:11px; color:#9ca3af; font-weight:600; margin-top:2px}

@media (max-width:560px){
  .jpop-head h2{font-size:1.05rem}
  .jpop-ffs-tab{font-size:12px; padding:8px 4px}
}
@media (prefers-reduced-motion:reduce){.jpop-dot{animation:none}}
`;
