/* ExamCard — one rich card per entrance exam for the /other-exams page.
   Built in the College Parichay design language (CL theme): warm surfaces,
   coral accent, a category-tinted monogram badge, key facts up top and a
   tap-to-expand "Details" drawer with the full pattern + an editorial read.

   The visual layout is our own — it is not lifted from any third-party card.
   Each exam gets a monogram logo (code initials on a category-tinted badge);
   if a real logo file exists at `logo`, it is shown instead. */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IndianRupee, CalendarDays, GraduationCap, ChevronDown,
  Clock, ListChecks, Trophy, MinusCircle, Monitor, BadgeCheck, Sparkles,
} from "lucide-react";
import { CL } from "./home/clTheme.js";
import { STATUS_META } from "../data/otherExams.js";

/* Short monogram derived from the exam code — e.g. "JEE Main" → "JEE",
   "BITSAT" → "BIT", "AP EAPCET" → "AP". Keeps the badge legible at a glance. */
function monogram(code) {
  const clean = code.replace(/\(.*?\)/g, "").trim();
  const words = clean.split(/\s+/);
  if (words.length > 1) {
    return words.slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  }
  return clean.slice(0, 3).toUpperCase();
}

export default function ExamCard({ exam, index = 0 }) {
  const [open, setOpen] = useState(false);
  const s = STATUS_META[exam.status] || STATUS_META.past;

  const facts = [
    { icon: IndianRupee, label: "Fee", value: exam.fee },
    { icon: CalendarDays, label: "Exam window", value: exam.examDate },
    { icon: GraduationCap, label: "Profile", value: exam.profile },
  ];

  const details = [
    { icon: Clock, label: "Registration", value: exam.regWindow },
    { icon: Clock, label: "Duration", value: exam.duration },
    { icon: ListChecks, label: "Questions", value: exam.totalQ },
    { icon: Trophy, label: "Total marks", value: exam.totalMarks },
    { icon: MinusCircle, label: "Negative marking", value: exam.negMarking },
    { icon: Monitor, label: "Mode", value: exam.mode },
    { icon: BadgeCheck, label: "UGC / recognition", value: exam.ugc },
  ].filter((d) => d.value);

  return (
    <motion.article
      className="ex-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.06 }}
      style={{ "--tint": exam.tint, "--tint-soft": exam.tintSoft }}
    >
      {/* accent hairline */}
      <span className="ex-accent" />

      {/* header */}
      <div className="ex-head">
        <span className="ex-logo" aria-hidden="true">
          {exam.logo
            ? <img src={exam.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 12 }} />
            : monogram(exam.code)}
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="ex-title-row">
            <h3 className="ex-code">{exam.code}</h3>
            <span className="ex-status" style={{ color: s.fg, background: s.bg }}>
              <span className="ex-status-dot" style={{ background: s.dot }} />
              {s.label}
            </span>
          </div>
          <p className="ex-full">{exam.full}</p>
          <p className="ex-body">{exam.body}</p>
        </div>
      </div>

      {/* category chip */}
      <span className="ex-cat">{exam.categoryLabel} · Engineering</span>

      {/* key facts */}
      <div className="ex-facts">
        {facts.map((f) => (
          <div key={f.label} className="ex-fact">
            <span className="ex-fact-ic"><f.icon size={15} /></span>
            <div style={{ minWidth: 0 }}>
              <span className="ex-fact-label">{f.label}</span>
              <span className="ex-fact-value">{f.value || "—"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* details toggle */}
      <button className="ex-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? "Hide details" : "Full pattern & CP read"}
        <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .25s" }} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="ex-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            <dl className="ex-detail-grid">
              {details.map((d) => (
                <div key={d.label} className="ex-detail">
                  <dt><d.icon size={13} /> {d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>
            {exam.analysis && (
              <div className="ex-read">
                <span className="ex-read-eyebrow"><Sparkles size={12} /> CP read</span>
                <p>{exam.analysis}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{CSS}</style>
    </motion.article>
  );
}

const CSS = `
.ex-card {
  position:relative; overflow:hidden;
  background:${CL.card}; border:1px solid ${CL.line}; border-radius:22px;
  padding:22px 20px 18px; display:flex; flex-direction:column; gap:14px;
  box-shadow:${CL.shadow}; transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}
.ex-card:hover { transform:translateY(-5px); box-shadow:0 20px 46px rgba(33,29,46,.12); border-color:var(--tint); }
.ex-accent { position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg, var(--tint), color-mix(in srgb, var(--tint) 55%, #fff)); }

.ex-head { display:flex; gap:14px; align-items:flex-start; }
.ex-logo {
  width:52px; height:52px; flex-shrink:0; border-radius:14px;
  display:grid; place-items:center; overflow:hidden;
  background:var(--tint-soft); color:var(--tint);
  font:800 15px/1 ${CL.display}; letter-spacing:-.5px;
  border:1px solid color-mix(in srgb, var(--tint) 26%, transparent);
}
.ex-title-row { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.ex-code { font:800 1.16rem/1.15 ${CL.display}; color:${CL.ink}; letter-spacing:-.4px; margin:0; }
.ex-status {
  display:inline-flex; align-items:center; gap:5px;
  font:800 9.5px/1 ${CL.display}; letter-spacing:.07em; text-transform:uppercase;
  padding:5px 9px; border-radius:50px; white-space:nowrap;
}
.ex-status-dot { width:6px; height:6px; border-radius:50%; }
.ex-full { font:600 .82rem/1.35 sans-serif; color:${CL.ink2}; margin:5px 0 0; }
.ex-body { font:500 .76rem/1.4 sans-serif; color:${CL.muted}; margin:3px 0 0; }

.ex-cat {
  align-self:flex-start; font:800 9.5px/1 ${CL.display}; letter-spacing:.09em; text-transform:uppercase;
  color:var(--tint); background:var(--tint-soft); padding:6px 11px; border-radius:8px;
}

.ex-facts { display:flex; flex-direction:column; gap:11px; padding-top:2px; border-top:1px dashed ${CL.line}; margin-top:2px; padding-top:14px; }
.ex-fact { display:flex; gap:10px; align-items:flex-start; }
.ex-fact-ic { width:28px; height:28px; flex-shrink:0; border-radius:8px; display:grid; place-items:center; background:${CL.cream2}; color:${CL.ink2}; }
.ex-fact-label { display:block; font:700 .64rem/1 ${CL.display}; letter-spacing:.08em; text-transform:uppercase; color:${CL.muted}; margin-bottom:3px; }
.ex-fact-value { display:block; font:500 .8rem/1.4 sans-serif; color:${CL.ink2}; }

.ex-toggle {
  margin-top:auto; display:inline-flex; align-items:center; justify-content:center; gap:7px;
  width:100%; padding:11px 14px; cursor:pointer;
  background:${CL.cream2}; border:1px solid ${CL.line}; border-radius:12px;
  font:800 .8rem/1 ${CL.display}; color:${CL.ink};
  transition:background .2s, border-color .2s;
}
.ex-toggle:hover { background:var(--tint-soft); border-color:var(--tint); color:var(--tint); }

.ex-details { overflow:hidden; }
.ex-detail-grid { display:grid; grid-template-columns:1fr; gap:0; margin:14px 0 0; }
.ex-detail { padding:10px 0; border-top:1px solid ${CL.line}; }
.ex-detail dt { display:flex; align-items:center; gap:6px; font:800 .64rem/1 ${CL.display}; letter-spacing:.07em; text-transform:uppercase; color:${CL.muted}; margin-bottom:5px; }
.ex-detail dd { margin:0; font:500 .8rem/1.5 sans-serif; color:${CL.ink2}; }
.ex-read { margin-top:14px; padding:14px 15px; border-radius:14px; background:linear-gradient(160deg, var(--tint-soft), color-mix(in srgb, var(--tint-soft) 30%, #fff)); border:1px solid color-mix(in srgb, var(--tint) 20%, transparent); }
.ex-read-eyebrow { display:inline-flex; align-items:center; gap:5px; font:800 9.5px/1 ${CL.display}; letter-spacing:.1em; text-transform:uppercase; color:var(--tint); margin-bottom:8px; }
.ex-read p { margin:0; font:500 .8rem/1.6 sans-serif; color:${CL.ink2}; }
`;
