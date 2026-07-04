/* FaqSection — accordion of frequently asked questions. */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

const FAQS = [
  {
    q: "How accurate is the rank & college predictor?",
    a: "Our predictions are built on previous years' official JoSAA and CSAB closing ranks plus normalisation trends. They give a reliable Safe / Moderate / Reach picture, but actual cutoffs shift slightly each year — always keep a ±5% buffer when filling choices.",
  },
  {
    q: "What's the difference between Branch Explorer and Branch vs College?",
    a: "The Branch Explorer is an encyclopaedia of 220+ branches across 10 paths — salaries, AI outlook, myths and where to study each. Branch vs College is a 6-question assessment that tells you whether the institute or the subject should win when the two conflict on your choice list.",
  },
  {
    q: "Is the ₹299 JoSAA counselling plan worth it over free tools?",
    a: "The free tools predict and explore. The ₹299 plan adds a human expert who builds and mistake-proofs your actual rank-specific choice list, predicts allotments round-wise, and supports you on WhatsApp through every JoSAA + CSAB round.",
  },
  {
    q: "Do I need to log in to use the predictors?",
    a: "You can explore the Branch Explorer, Branch vs College assessment and rank-to-cutoff demo freely. Saving shortlists, the full college predictor and counselling features ask you to sign in so your data stays with your account.",
  },
  {
    q: "How is the 1-on-1 mentorship different from counselling?",
    a: "Counselling is a one-time, season-specific service for JoSAA choice filling. Mentorship is a long-term program (1–2 years) with a dedicated IITian / doctor mentor, daily targets, weekly test analysis and accountability for JEE & NEET preparation.",
  },
  {
    q: "Where does the data come from?",
    a: "Cutoffs and seat matrices are sourced from official JoSAA, CSAB and NIRF releases. Branch insights and salary arcs are indicative India-market estimates compiled from placement reports — they're directional, not official figures.",
  },
];

function Item({ item, open, onToggle }) {
  return (
    <div style={{ background: CL.card, border: `1px solid ${open ? CL.coral + "55" : CL.line}`, borderRadius: 16, boxShadow: open ? "0 8px 26px rgba(255, 105, 61,.08)" : CL.shadow, overflow: "hidden", transition: "border-color .2s" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 22px", cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontFamily: CL.display, fontWeight: 700, fontSize: 15.5, color: CL.ink }}>{item.q}</span>
        <span style={{ width: 28, height: 28, borderRadius: "50%", background: open ? CL.coral : CL.coralSoft, display: "grid", placeItems: "center", flexShrink: 0 }}>
          {open ? <Minus size={15} color="#fff" /> : <Plus size={15} color={CL.coralDk} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}>
            <p style={{ padding: "0 22px 20px", color: CL.body, fontSize: 14, lineHeight: 1.7 }}>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" style={{ background: CL.cream, padding: "84px 0", position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: 1040 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={clEyebrow}><HelpCircle size={13} /> FAQ</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: CL.ink, letterSpacing: "-1px", margin: "16px 0 10px", lineHeight: 1.12 }}>
            Frequently asked <span style={{ color: CL.coral }}>questions</span>
          </h2>
          <p style={{ color: CL.body, fontSize: "1.02rem" }}>Everything students and parents ask us before getting started.</p>
        </div>
        <div className="faq-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))", gap: 14, alignItems: "start" }}>
          {FAQS.map((f, i) => (
            <Item key={i} item={f} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
