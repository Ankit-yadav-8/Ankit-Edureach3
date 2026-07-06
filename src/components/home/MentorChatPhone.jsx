/* MentorChatPhone — an animated phone mock-up that plays a mentor↔student
   WhatsApp-style conversation on a loop. Replaces the static mentorship
   illustration in the home "1-on-1 Mentorship" band: bubbles reveal one by one
   with a typing indicator, the thread auto-scrolls, then restarts. Honours
   prefers-reduced-motion (shows the full thread, no motion). Coral theme to
   match the site. */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap, Video, Phone, Paperclip, Smile, Camera, Mic,
  Check, CheckCheck, Signal, Wifi, BatteryFull,
} from "lucide-react";
import { CL } from "./clTheme.js";

// The conversation. from: "me" = student (right, coral) · "mentor" = left (white).
const SCRIPT = [
  { from: "me",     time: "9:32", text: "Sir, I can't finish Organic Chem in time 🤯" },
  { from: "mentor", time: "9:33", text: "Don't worry Aditi. Let's fix this today 💪" },
  { from: "mentor", time: "9:33", text: "First, tell me — GOC done or pending?" },
  { from: "me",     time: "9:34", text: "GOC half done. Hydrocarbons not started 🤪" },
  { from: "mentor", time: "9:35", text: "Got it. Here's your new 7-day plan 👇\n📅 Mon–Tue → GOC (finish + PYQs)\n📅 Wed–Fri → Hydrocarbons\n📅 Sat → Full revision\n📅 Sun → Mock test" },
  { from: "me",     time: "9:36", text: "And test on Sunday? 😨" },
  { from: "mentor", time: "9:36", text: "Booked ✅ Sunday 10 AM, 90 mins." },
  { from: "mentor", time: "9:37", text: "I'll personally review it with you Monday 8 PM on Zoom 🎥" },
  { from: "me",     time: "9:38", text: "Sir last month I scored only 42 in chem 😔" },
  { from: "mentor", time: "9:39", text: "That's the past. Follow this plan — I'm targeting 75+ for you this time 🚀" },
  { from: "me",     time: "9:40", text: "Thank you sir 🙌 feeling much better now" },
  { from: "mentor", time: "9:40", text: "That's what I'm here for. Now go crush GOC 🔥" },
];

const INK = "#20242e";
const SCREEN_BG = "#f5f4f6";

function Bubble({ m }) {
  const me = m.from === "me";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      style={{
        alignSelf: me ? "flex-end" : "flex-start",
        maxWidth: "84%",
        background: me ? `linear-gradient(135deg, ${CL.coral}, ${CL.coralDk})` : "#fff",
        color: me ? "#fff" : INK,
        border: me ? "none" : "1px solid rgba(26,26,46,.06)",
        borderRadius: 15,
        borderBottomRightRadius: me ? 4 : 15,
        borderBottomLeftRadius: me ? 15 : 4,
        padding: "8px 11px 6px",
        fontSize: 12.5,
        lineHeight: 1.42,
        whiteSpace: "pre-line",
        boxShadow: me ? "0 6px 16px -8px rgba(255,105,61,.7)" : "0 2px 8px rgba(26,26,46,.07)",
      }}
    >
      {m.text}
      <span style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, marginTop: 3, fontSize: 9, opacity: me ? 0.9 : 0.5 }}>
        {m.time} {me ? <CheckCheck size={12} /> : <Check size={11} />}
      </span>
    </motion.div>
  );
}

function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      style={{ alignSelf: "flex-start", background: "#fff", border: "1px solid rgba(26,26,46,.06)", borderRadius: 15, borderBottomLeftRadius: 4, padding: "11px 13px", display: "flex", gap: 4, boxShadow: "0 2px 8px rgba(26,26,46,.07)" }}
    >
      {[0, 1, 2].map((i) => (
        <motion.span key={i}
          animate={{ y: [0, -4, 0], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: "#9aa1ac" }} />
      ))}
    </motion.div>
  );
}

export default function MentorChatPhone() {
  const [visible, setVisible] = useState(0);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  // Sequential reveal + loop. A single recursive timer keeps it easy to cancel.
  useEffect(() => {
    const reduce = typeof window !== "undefined"
      && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setVisible(SCRIPT.length); return; }

    let t;
    let i = 0;
    let cancelled = false;
    const step = () => {
      if (cancelled) return;
      if (i >= SCRIPT.length) {                       // thread finished → pause, reset, loop
        t = setTimeout(() => {
          if (cancelled) return;
          i = 0; setVisible(0); setTyping(false);
          t = setTimeout(step, 700);
        }, 2800);
        return;
      }
      const m = SCRIPT[i];
      const reveal = () => {
        if (cancelled) return;
        setTyping(false);
        setVisible(i + 1);
        i += 1;
        t = setTimeout(step, 950 + Math.min(1600, m.text.length * 14)); // read time ∝ length
      };
      if (m.from === "mentor") { setTyping(true); t = setTimeout(reveal, 1100); } // typing dots first
      else reveal();
    };
    t = setTimeout(step, 650);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  // Keep the newest message (and the typing bubble) in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [visible, typing]);

  return (
    <div style={{ width: "100%", maxWidth: 306, margin: "0 auto" }}>
      {/* phone bezel */}
      <div style={{ position: "relative", borderRadius: 42, background: "#15151f", padding: 9, boxShadow: "0 34px 70px -26px rgba(26,26,46,.55), 0 0 0 2px rgba(26,26,46,.06)" }}>
        {/* screen */}
        <div style={{ position: "relative", borderRadius: 34, overflow: "hidden", background: SCREEN_BG, aspectRatio: "9 / 19", display: "flex", flexDirection: "column" }}>
          {/* notch */}
          <div style={{ position: "absolute", top: 9, left: "50%", transform: "translateX(-50%)", width: "34%", height: 20, background: "#15151f", borderRadius: 20, zIndex: 6 }} />

          {/* header (orange) */}
          <div style={{ flexShrink: 0, background: `linear-gradient(135deg, ${CL.coral}, ${CL.coralDk})`, color: "#fff", padding: "9px 14px 12px" }}>
            {/* status bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10.5, fontWeight: 800, marginBottom: 8 }}>
              <span>9:41</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Signal size={12} /><Wifi size={12} /><BatteryFull size={16} />
              </span>
            </div>
            {/* contact row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center" }}>
                  <GraduationCap size={19} color={CL.coral} />
                </div>
                <span style={{ position: "absolute", right: 0, bottom: 0, width: 11, height: 11, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: "-.2px", display: "flex", alignItems: "center", gap: 4 }}>
                  Mentor Arjun <span style={{ fontSize: 11 }}>🎓✨</span>
                </div>
                <div style={{ fontSize: 10.5, opacity: 0.92 }}>online • replies in minutes</div>
              </div>
              <Video size={18} style={{ flexShrink: 0 }} />
              <Phone size={16} style={{ flexShrink: 0 }} />
            </div>
          </div>

          {/* messages */}
          <div ref={scrollRef} style={{
            flex: 1, minHeight: 0, overflowY: "auto", padding: "12px 11px 8px",
            display: "flex", flexDirection: "column", gap: 8,
            backgroundColor: SCREEN_BG,
            backgroundImage: "radial-gradient(rgba(26,26,46,.06) 1px, transparent 1px)",
            backgroundSize: "15px 15px",
          }}>
            <span style={{ alignSelf: "center", background: "#fff", color: "#8b93a1", fontSize: 10.5, fontWeight: 700, padding: "3px 12px", borderRadius: 50, boxShadow: "0 1px 4px rgba(26,26,46,.06)", marginBottom: 2 }}>Today</span>
            {SCRIPT.slice(0, visible).map((m, idx) => <Bubble key={idx} m={m} />)}
            {typing && <TypingBubble />}
          </div>

          {/* input */}
          <div style={{ flexShrink: 0, background: "#fff", borderTop: "1px solid rgba(26,26,46,.07)", padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 }}>
            <Paperclip size={17} color="#9aa1ac" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 6, background: "#f0eff1", borderRadius: 50, padding: "7px 11px" }}>
              <Smile size={15} color="#9aa1ac" style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, minWidth: 0, fontSize: 11.5, color: "#9aa1ac", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Message your mentor…</span>
              <Camera size={15} color="#9aa1ac" style={{ flexShrink: 0 }} />
            </div>
            <span style={{ width: 33, height: 33, borderRadius: "50%", background: `linear-gradient(135deg, ${CL.coral}, ${CL.coralDk})`, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Mic size={16} color="#fff" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
