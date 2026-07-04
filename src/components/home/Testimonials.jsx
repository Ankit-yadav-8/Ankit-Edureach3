/* Testimonials — a staggered "story wall" of student & parent quotes.
   Masonry columns let cards keep their natural height; each carries its
   own tint, a verified author and an entrance/hover animation. */
import { motion } from "framer-motion";
import { Quote, Star, BadgeCheck, Sparkles } from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

const TESTIMONIALS = [
  {
    name: "Ananya R.", detail: "B.Tech CSE, NIT Trichy · 2025", initials: "AR", color: CL.coral,
    text: "The college predictor showed me exactly which NITs were in reach for my 8,400 rank. I filled my JoSAA choices with so much more confidence — and landed CSE at Trichy in Round 3.",
  },
  {
    name: "Karthik V.", detail: "B.Tech, IIT Hyderabad · 2024", initials: "KV", color: CL.green,
    text: "Seeing all the round-wise opening and closing ranks in one place was a game-changer. The rank predictor came within ~400 ranks of my actual JEE Advanced result.",
  },
  {
    name: "Sneha P.", detail: "Parent of a 2025 aspirant", initials: "SP", color: CL.amber,
    text: "As a parent, the fee and placement breakdowns helped us plan finances honestly. No jargon, no false promises — just clear numbers we could actually understand.",
  },
  {
    name: "Rohit M.", detail: "Branch vs College user", initials: "RM", color: CL.violet,
    text: "I was torn between a top NIT's core branch and CSE at a mid-tier college. The quiz finally gave me clarity — it said branch-first, and it was spot on for me.",
  },
  {
    name: "Fatima S.", detail: "JoSAA ₹499 plan · 2025", initials: "FS", color: CL.blue,
    text: "The Pro counselling plan was worth every rupee. My mentor built a 32-choice list around my category rank and walked me through Float vs Freeze after Round 1 on WhatsApp.",
  },
  {
    name: "Aditya K.", detail: "Dropper, JEE 2026 prep", initials: "AK", color: CL.coralDk,
    text: "The Branch Explorer killed a lot of myths for me. I almost dropped ECE thinking it had 'no software scope' — turns out that's completely wrong. Changed my whole strategy.",
  },
];

export default function Testimonials() {
  return (
    <section style={{ background: CL.cream, padding: "84px 0", position: "relative", overflow: "hidden" }}>
      <style>{CSS}</style>
      {/* soft ambient glows */}
      <div style={{ position: "absolute", top: -60, right: "8%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${CL.coral}14, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: "4%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${CL.violet}12, transparent 70%)`, pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 40px" }}>
          <span style={clEyebrow}><Sparkles size={13} /> Student &amp; Parent Stories</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.2vw,2.7rem)", color: CL.ink, letterSpacing: "-1.1px", margin: "16px 0 14px", lineHeight: 1.1 }}>
            Real results, in their <span style={{ color: CL.coral }}>own words.</span>
          </h2>
          {/* aggregate rating chip */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 50, padding: "8px 16px", boxShadow: CL.shadow }}>
            <span style={{ display: "flex", gap: 2 }}>
              {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={15} fill={CL.amber} color={CL.amber} />)}
            </span>
            <span style={{ fontFamily: CL.display, fontWeight: 800, color: CL.ink, fontSize: 14 }}>4.9<span style={{ color: CL.muted, fontWeight: 600 }}>/5</span></span>
            <span style={{ width: 1, height: 16, background: CL.line }} />
            <span style={{ fontSize: 13, color: CL.body }}>from <strong style={{ color: CL.ink }}>3,200+</strong> families</span>
          </div>
        </div>

        <div className="tw-wall">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              className="tw-card"
              style={{ "--accent": t.color }}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.09, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="tw-quote"><Quote size={20} /></span>
              <blockquote className="tw-text">{t.text}</blockquote>
              <span className="tw-stars">
                {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={14} fill={CL.amber} color={CL.amber} />)}
              </span>
              <figcaption className="tw-author">
                <span className="tw-avatar">{t.initials}</span>
                <span>
                  <span className="tw-name">{t.name} <BadgeCheck size={14} color={CL.green} /></span>
                  <span className="tw-detail">{t.detail}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const CSS = `
.tw-wall { column-count: 3; column-gap: 20px; }
.tw-card {
  break-inside: avoid; margin: 0 0 20px; position: relative;
  background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 7%, ${CL.card}), ${CL.card});
  border: 1px solid color-mix(in srgb, var(--accent) 22%, ${CL.line});
  border-radius: 16px; padding: 18px 18px 16px; box-shadow: ${CL.shadow};
  transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s;
  overflow: hidden;
}
.tw-card::before {
  content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
  background: linear-gradient(var(--accent), color-mix(in srgb, var(--accent) 55%, transparent));
}
.tw-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(33,29,46,.12); }
.tw-quote {
  display: inline-grid; place-items: center; width: 34px; height: 34px; border-radius: 10px;
  background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); margin-bottom: 12px;
}
.tw-text { margin: 0 0 12px; color: ${CL.ink2}; font-size: 13.5px; line-height: 1.6; font-style: normal; }
.tw-stars { display: flex; gap: 2px; margin-bottom: 12px; }
.tw-author { display: flex; align-items: center; gap: 10px; padding-top: 12px; border-top: 1px dashed ${CL.cream3}; }
.tw-avatar {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; display: grid; place-items: center;
  font: 800 13px/1 ${CL.display}; color: #fff; background: var(--accent);
  box-shadow: 0 4px 10px color-mix(in srgb, var(--accent) 45%, transparent);
}
.tw-name { display: flex; align-items: center; gap: 5px; font: 800 13.5px/1.2 ${CL.display}; color: ${CL.ink}; }
.tw-detail { display: block; font-size: 11.5px; color: ${CL.muted}; margin-top: 3px; }

@media (max-width: 980px) { .tw-wall { column-count: 2; } }
@media (max-width: 640px) { .tw-wall { column-count: 1; } }
`;
