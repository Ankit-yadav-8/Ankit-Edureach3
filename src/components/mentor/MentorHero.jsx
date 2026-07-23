import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Eye, Users } from "lucide-react";

/* ══════════════════════════════════════════════
   Mentor dashboard hero.

   Speaks the mentorship page's visual language — cream paper, floating coral
   orbs, masked grid, outlined watermark, a Sora headline with a gradient accent
   and a hand-drawn underline — so the mentor side doesn't feel bolted on.

   What's unique to this hero: the avatar is orbited by one dot per assigned
   student, and the dot for whoever is on screen is lit. The mentor's caseload
   is the thing this page is about, so it's the thing that moves.
══════════════════════════════════════════════ */

const T = {
  ink: "#1B1B24", body: "#54525C",
  coral: "#FF693D", coralDk: "#D8512A", coralSoft: "#FFE7DE",
  line: "#EFE7DD", lineDk: "#D9CDBF",
};

/* One dot per assigned student, evenly spaced around the avatar. The active
   student's dot is filled and haloed — a glanceable "which of mine is this". */
function Orbit({ count, activeIndex, still }) {
  const n = Math.max(count, 1);
  const R = 46;
  return (
    <div style={{ position: "absolute", inset: -14, pointerEvents: "none" }}>
      <motion.div
        style={{ position: "absolute", inset: 0 }}
        animate={still ? {} : { rotate: 360 }}
        transition={still ? {} : { duration: 46, ease: "linear", repeat: Infinity }}
      >
        {Array.from({ length: n }).map((_, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          const on = i === activeIndex;
          return (
            <motion.span
              key={i}
              style={{
                position: "absolute", left: "50%", top: "50%",
                width: on ? 9 : 6, height: on ? 9 : 6, borderRadius: "50%",
                marginLeft: -(on ? 4.5 : 3), marginTop: -(on ? 4.5 : 3),
                x: Math.cos(a) * R, y: Math.sin(a) * R,
                background: on ? T.coral : `${T.coral}59`,
                boxShadow: on ? `0 0 0 4px ${T.coral}22` : "none",
              }}
              animate={still || !on ? {} : { scale: [1, 1.28, 1] }}
              transition={still ? {} : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

/* The switcher. Closes on outside click and on Escape — it covers content, so
   it must be dismissible without hunting for the trigger again. */
function StudentSwitcher({ students, activeId, onPick }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = students.find((s) => s.studentId === activeId);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  if (!students.length) return null;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="mh-switch" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="listbox">
        <span className="mh-switch-text">
          <span className="mh-switch-label">Viewing</span>
          <span className="mh-switch-name">{active ? active.name : "Select a student"}</span>
        </span>
        <ChevronDown size={15} style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .18s", color: T.body }} />
      </button>

      {open && (
        <motion.div
          role="listbox"
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="mh-menu"
        >
          {students.map((s) => (
            <button
              key={s.studentId} role="option" aria-selected={s.studentId === activeId}
              onClick={() => { onPick(s.studentId); setOpen(false); }}
              className={`mh-menu-item${s.studentId === activeId ? " mh-menu-on" : ""}`}
            >
              <span className="mh-menu-name">{s.name}</span>
              <span className="mh-menu-meta">{s.studentId} · {s.plan}</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function MentorHero({ mentor, students, activeId, onPick }) {
  const still = useReducedMotion();
  const activeIndex = Math.max(students.findIndex((s) => s.studentId === activeId), 0);
  const first = (mentor.name || "").trim().split(/\s+/)[0] || mentor.name;
  const initials = (mentor.name || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <section className="mh-hero">
      <div className="mh-bg" aria-hidden="true">
        <span className="mh-orb mh-orb-a" />
        <span className="mh-orb mh-orb-b" />
        <div className="mh-grid" />
        <div className="mh-watermark">MENTOR</div>
      </div>

      <div className="mh-inner">
        <motion.div
          className="mh-pill"
          initial={still ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="mh-dot" /> Mentor workspace
        </motion.div>

        <div className="mh-row">
          <motion.div
            className="mh-avatar-wrap"
            initial={still ? false : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <Orbit count={students.length} activeIndex={activeIndex} still={still} />
            <div className="mh-avatar">{initials}</div>
          </motion.div>

          <div className="mh-copy">
            <motion.h1
              className="mh-h1"
              initial={still ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Welcome back,{" "}
              <span className="mh-accent">
                {first}.
                <svg className="mh-uline" viewBox="0 0 320 14" preserveAspectRatio="none" aria-hidden="true">
                  <motion.path
                    d="M5 9 C 78 3, 244 3, 315 8"
                    initial={still ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              className="mh-sub"
              initial={still ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 }}
            >
              {students.length === 0
                ? "No students are assigned to you yet. Your admin assigns them by CP ID."
                : `You're following ${students.length} student${students.length === 1 ? "" : "s"}. Everything here is theirs — you can see all of it, and change none of it.`}
            </motion.p>

            <motion.div
              className="mh-meta"
              initial={still ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.26 }}
            >
              <span className="mh-tag"><Users size={13} /> {students.length} assigned</span>
              <span className="mh-tag"><Eye size={13} /> Read-only access</span>
              {mentor.college && <span className="mh-tag">{mentor.college}</span>}
            </motion.div>
          </div>

          <motion.div
            className="mh-switch-wrap"
            initial={still ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
          >
            <StudentSwitcher students={students} activeId={activeId} onPick={onPick} />
          </motion.div>
        </div>
      </div>

      <style>{`
        .mh-hero { position:relative; z-index:20; border-radius:24px; margin-bottom:24px;
          border:1px solid ${T.line}; background:var(--page-bg); }
        .mh-bg { position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden; border-radius:24px; }
        .mh-orb { position:absolute; border-radius:50%; filter:blur(80px); }
        .mh-orb-a { width:420px; height:420px; top:-190px; left:-120px;
          background:radial-gradient(circle, rgba(255,105,61,.26), transparent 70%); opacity:.55;
          animation:mhfloat 16s ease-in-out infinite; }
        .mh-orb-b { width:360px; height:360px; bottom:-200px; right:-110px;
          background:radial-gradient(circle, rgba(255,178,130,.24), transparent 70%); opacity:.55;
          animation:mhfloat 21s ease-in-out infinite reverse; }
        @keyframes mhfloat { 0%,100%{transform:translate(0,0);} 50%{transform:translate(34px,26px);} }
        .mh-grid { position:absolute; inset:0;
          background-image:linear-gradient(${T.lineDk} 1px,transparent 1px),linear-gradient(90deg,${T.lineDk} 1px,transparent 1px);
          background-size:44px 44px; opacity:.06;
          -webkit-mask-image:radial-gradient(74% 66% at 40% 40%, #000, transparent 76%);
          mask-image:radial-gradient(74% 66% at 40% 40%, #000, transparent 76%); }
        .mh-watermark { position:absolute; top:-14%; right:-2%; font-family:'Sora',sans-serif; font-weight:900;
          font-size:min(19vw,190px); line-height:1; color:transparent; -webkit-text-stroke:1.5px ${T.lineDk};
          opacity:.2; user-select:none; }

        .mh-inner { position:relative; z-index:2; padding:30px 30px 32px; }
        .mh-pill { display:inline-flex; align-items:center; gap:9px; padding:7px 16px; border-radius:50px;
          background:${T.coralSoft}; border:1px solid #F6CDBE; color:${T.coralDk};
          font:700 .78rem/1 'Sora',sans-serif; box-shadow:0 10px 26px -16px rgba(255,105,61,.6); }
        .mh-dot { width:7px; height:7px; border-radius:50%; background:${T.coral};
          box-shadow:0 0 0 0 rgba(255,105,61,.5); animation:mhpulse 2.4s ease-out infinite; }
        @keyframes mhpulse { 0%{box-shadow:0 0 0 0 rgba(255,105,61,.5);} 100%{box-shadow:0 0 0 8px rgba(255,105,61,0);} }

        .mh-row { display:flex; align-items:center; gap:22px; margin-top:20px; flex-wrap:wrap; }
        .mh-avatar-wrap { position:relative; flex-shrink:0; }
        .mh-avatar { width:64px; height:64px; border-radius:18px; display:grid; place-items:center;
          background:linear-gradient(135deg, ${T.coral}, ${T.coralDk}); color:#fff;
          font:800 1.15rem/1 'Sora',sans-serif; letter-spacing:.02em;
          box-shadow:0 12px 30px -10px rgba(255,105,61,.6); }

        .mh-copy { flex:1; min-width:260px; }
        .mh-h1 { font-family:'Sora',sans-serif; font-weight:800; font-size:clamp(1.6rem,3.4vw,2.5rem);
          line-height:1.08; letter-spacing:-.025em; color:${T.ink}; margin:0; }
        .mh-accent { position:relative; display:inline-block; white-space:nowrap;
          background:linear-gradient(96deg, #E5401A 0%, #FF7A45 52%, #FF9E6B 100%);
          -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; color:transparent; }
        .mh-uline { position:absolute; left:2%; bottom:-.16em; width:96%; height:.26em; overflow:visible; }
        .mh-uline path { fill:none; stroke:${T.coral}; stroke-width:5; stroke-linecap:round; vector-effect:non-scaling-stroke; }
        .mh-sub { font:400 .95rem/1.6 'DM Sans',sans-serif; color:${T.body}; margin:10px 0 0; max-width:560px; }
        .mh-meta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:14px; }
        .mh-tag { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:50px;
          background:rgba(255,255,255,.6); -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px);
          border:1px solid ${T.line}; color:${T.body}; font:600 .74rem/1 'Space Grotesk',sans-serif; }

        .mh-switch-wrap { flex-shrink:0; }
        .mh-switch { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:14px;
          background:rgba(255,255,255,.72); -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px);
          border:1px solid ${T.lineDk}; cursor:pointer; min-width:200px; text-align:left; transition:.16s; }
        .mh-switch:hover { border-color:${T.coral}; transform:translateY(-1px); }
        .mh-switch-text { flex:1; min-width:0; }
        .mh-switch-label { display:block; font:800 .6rem/1 'Space Grotesk',sans-serif; letter-spacing:.12em;
          text-transform:uppercase; color:${T.coralDk}; margin-bottom:3px; }
        .mh-switch-name { display:block; font:700 .86rem/1.3 'Sora',sans-serif; color:${T.ink};
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .mh-menu { position:absolute; top:calc(100% + 8px); right:0; z-index:30; min-width:250px;
          background:#fff; border:1px solid ${T.line}; border-radius:14px; overflow:hidden;
          box-shadow:0 18px 44px -12px rgba(27,27,36,.28); }
        .mh-menu-item { display:block; width:100%; text-align:left; padding:11px 14px; border:none;
          background:#fff; cursor:pointer; transition:background .14s; }
        .mh-menu-item:hover { background:${T.coralSoft}; }
        .mh-menu-on { background:${T.coralSoft}; }
        .mh-menu-name { display:block; font:700 .82rem/1.3 'Sora',sans-serif; color:${T.ink}; }
        .mh-menu-meta { display:block; font:500 .7rem/1.4 'DM Sans',sans-serif; color:${T.body}; margin-top:1px; }

        @media (max-width:720px) {
          .mh-inner { padding:24px 20px 26px; }
          .mh-switch-wrap { width:100%; }
          .mh-switch { width:100%; }
          .mh-menu { left:0; right:0; min-width:0; width:100%; }
          .mh-watermark { font-size:34vw; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mh-orb-a, .mh-orb-b, .mh-dot { animation:none; }
        }
      `}</style>
    </section>
  );
}
