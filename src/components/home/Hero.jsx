import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Target, Bell, Sparkles, Users, CalendarClock, LineChart,
  ChevronRight, ChevronLeft, Landmark, CalendarDays, Map, Archive,
  Share2, Star, MoreHorizontal, BadgeCheck, MessageCircle, BellRing,
  ListChecks, LayoutDashboard, Crosshair, GraduationCap, BarChart3,
  ArrowRight, Check, Trophy, Stethoscope, Award, TrendingUp,
  Signal, Wifi, BatteryFull,
} from "lucide-react";

/* ════════════════════════════════════════════════
   HERO — big animated headline → twin CTAs → a
   Mentorship-Hub product card + testimonials.
════════════════════════════════════════════════ */

const CORAL    = "#FF5A36";
const CORAL_DK = "#E0421F";
const INK      = "#1c1c28";
const VIOLET   = "#8b5cf6";
const TEAL     = "#0ea5a4";
const GREEN    = "#22c55e";
const AMBER    = "#E29A2E";

/* ── breakpoints ── */
function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    if (w <= 430)  return "xs";
    if (w <= 768)  return "mobile";
    if (w <= 1024) return "tablet";
    if (w <= 1366) return "ipadpro";
    return "desktop";
  });
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 430)  setBp("xs");
      else if (w <= 768)  setBp("mobile");
      else if (w <= 1024) setBp("tablet");
      else if (w <= 1366) setBp("ipadpro");
      else setBp("desktop");
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return {
    bp,
    isXs:      bp === "xs",
    isMobile:  bp === "mobile" || bp === "xs",
    isTablet:  bp === "tablet" || bp === "ipadpro",
    isDesktop: bp === "desktop",
    isSmall:   bp === "xs" || bp === "mobile" || bp === "tablet",
  };
}

/* ════════════════════════════════════════════════
   ANIMATED HEADLINE — word-by-word reveal + drawn underline
════════════════════════════════════════════════ */
const LINE_A = [{ t: "Predict", c: false }, { t: "your", c: false }, { t: "rank.", c: true }];
const LINE_B = [{ t: "Meet", c: false }, { t: "your", c: false }, { t: "mentor.", c: true }];
const headVariants = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } };
const blackWord = {
  hidden: { opacity: 0, y: "0.55em", filter: "blur(6px)" },
  show:   { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const coralWord = {
  hidden: { opacity: 0, scale: 0.6, y: "0.2em" },
  show:   { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 380, damping: 17 } },
};
function HeadWord({ w, order }) {
  return (
    <motion.span variants={w.c ? coralWord : blackWord}
      style={{ display: "inline-block", marginRight: "0.26em", color: w.c ? CORAL : INK, position: w.c ? "relative" : undefined, whiteSpace: "nowrap" }}>
      {w.t}
      {w.c && (
        <svg width="100%" height="10" viewBox="0 0 200 10" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: "-0.12em", width: "100%" }}>
          <motion.path d="M3 7C40 2 70 2 100 5C130 8 160 8 197 3" stroke={CORAL} strokeWidth="4" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.55, delay: 0.9 + order * 0.28, ease: "easeInOut" }} />
        </svg>
      )}
    </motion.span>
  );
}

/* ════════════════════════════════════════════════
   MOBILE ANIMATED PHONE — cycles product sections with
   a bottom tab bar + crossfade (mobile view only).
════════════════════════════════════════════════ */
function useCycle(len, ms) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % len), ms);
    return () => clearInterval(t);
  }, [len, ms]);
  return [i, setI];
}

const SECTIONS = [
  { key: "dashboard",  label: "Dashboard",     Icon: LayoutDashboard, title: "Dashboard",         sub: "Your admission cockpit" },
  { key: "predictor",  label: "Rank Predictor", Icon: Crosshair,       title: "College Predictor",  sub: "Your rank → every college you can get" },
  { key: "colleges",   label: "Colleges",       Icon: GraduationCap,   title: "Explore Colleges",   sub: "850+ IITs · NITs · IIITs" },
  { key: "cutoffs",    label: "Cutoffs",        Icon: BarChart3,       title: "JoSAA Cutoffs 2025", sub: "Closing ranks, round-wise" },
  { key: "mentorship", label: "Mentorship",     Icon: Users,           title: "1-on-1 Mentorship",  sub: "JEE & NEET · 2027 · 2028" },
];
const PRED = [
  { rank: "01", name: "IIT Bombay", branch: "CSE",        chance: 96, tone: GREEN, pkg: "₹33.8L" },
  { rank: "02", name: "IIT Delhi",  branch: "CSE",        chance: 88, tone: GREEN, pkg: "₹32.3L" },
  { rank: "03", name: "IIT Madras", branch: "Electrical", chance: 71, tone: AMBER, pkg: "₹31.2L" },
];
const COLLEGE_ROWS = [
  { name: "IIT Bombay", tag: "IIT", nirf: 3, pkg: "₹33.8L", tone: CORAL },
  { name: "IIT Delhi",  tag: "IIT", nirf: 2, pkg: "₹32.3L", tone: VIOLET },
  { name: "NIT Trichy", tag: "NIT", nirf: 9, pkg: "₹18.4L", tone: GREEN },
];
const CUTOFF_ROWS = [
  ["IIT Bombay", "CSE", "67"],
  ["IIT Delhi",  "CSE", "110"],
  ["NIT Trichy", "CSE", "5,020"],
];
const PLANS = [
  { exam: "JEE 2027",  tag: "1:1 · Daily targets", price: "₹2,499", color: CORAL,  Icon: Trophy },
  { exam: "NEET 2027", tag: "1:1 · Doctor mentor",  price: "₹2,499", color: GREEN,  Icon: Stethoscope },
  { exam: "JEE 2028",  tag: "Foundation track",     price: "₹2,499", color: VIOLET, Icon: Award },
];
const TARGETS = [["Physics", 72, CORAL], ["Chemistry", 64, VIOLET], ["Maths", 85, TEAL]];

function Bar({ pct, tone }) {
  return (
    <div style={{ height: 5, borderRadius: 4, background: "#ececf0", overflow: "hidden" }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ height: "100%", borderRadius: 4, background: tone }} />
    </div>
  );
}

function SectionBody({ k }) {
  const card = { border: "1px solid rgba(28,28,40,.08)", borderRadius: 11, background: "#fff" };

  if (k === "dashboard") {
    const tiles = [
      { lbl: "Predicted AIR", val: "4,846", tone: CORAL },
      { lbl: "Matched", val: "12", tone: TEAL },
      { lbl: "Deadline", val: "2d", tone: VIOLET },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7 }}>
          {tiles.map((t) => (
            <div key={t.lbl} style={{ ...card, padding: "9px 8px" }}>
              <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: ".4px", color: "rgba(28,28,40,.45)", textTransform: "uppercase" }}>{t.lbl}</div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 17, color: t.tone, marginTop: 3 }}>{t.val}</div>
            </div>
          ))}
        </div>
        <div style={{ ...card, padding: "11px 12px" }}>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 12, color: INK, marginBottom: 9 }}>This week's targets</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {TARGETS.map(([name, pct, tone]) => (
              <div key={name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5 }}>
                  <span style={{ color: "rgba(28,28,40,.7)", fontWeight: 600 }}>{name}</span>
                  <span style={{ color: tone, fontWeight: 800 }}>{pct}%</span>
                </div>
                <Bar pct={pct} tone={tone} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (k === "predictor") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f7f6f9", border: "1px solid rgba(28,28,40,.07)", borderRadius: 8, padding: "6px 11px", fontSize: 11.5, color: INK, fontWeight: 700 }}>
            <Target size={12} color={CORAL} /> AIR&nbsp;4,846
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f7f6f9", border: "1px solid rgba(28,28,40,.07)", borderRadius: 8, padding: "6px 11px", fontSize: 11.5, color: "rgba(28,28,40,.7)" }}>
            General <ChevronRight size={12} style={{ transform: "rotate(90deg)" }} color="#9ca3af" />
          </div>
        </div>
        {PRED.map((c) => (
          <div key={c.name} style={{ ...card, display: "flex", alignItems: "center", gap: 10, padding: "8px 10px" }}>
            <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 11, color: "#c8c5cf", flexShrink: 0 }}>{c.rank}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Space Grotesk,Sora", fontWeight: 700, fontSize: 12, color: INK }}>{c.name}</div>
              <div style={{ fontSize: 10, color: "rgba(28,28,40,.5)" }}>{c.branch} · avg {c.pkg}</div>
              <div style={{ marginTop: 6 }}><Bar pct={c.chance} tone={c.tone} /></div>
            </div>
            <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 12, color: c.tone, flexShrink: 0 }}>{c.chance}%</span>
          </div>
        ))}
      </div>
    );
  }

  if (k === "colleges") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {COLLEGE_ROWS.map((c) => (
          <div key={c.name} style={{ ...card, display: "flex", alignItems: "center", gap: 10, padding: "9px 10px" }}>
            <span style={{ width: 34, height: 34, borderRadius: 9, background: `${c.tone}18`, border: `1.5px solid ${c.tone}38`, display: "grid", placeItems: "center", flexShrink: 0, fontFamily: "Sora", fontWeight: 800, fontSize: 10, color: c.tone }}>{c.tag}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Space Grotesk,Sora", fontWeight: 700, fontSize: 12, color: INK }}>{c.name}</div>
              <div style={{ fontSize: 10, color: "rgba(28,28,40,.5)" }}>NIRF #{c.nirf} · avg {c.pkg}</div>
            </div>
            <ArrowRight size={14} color={c.tone} style={{ flexShrink: 0 }} />
          </div>
        ))}
      </div>
    );
  }

  if (k === "cutoffs") {
    return (
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.9fr", gap: 6, padding: "8px 11px", background: "#faf9fb", fontSize: 9.5, fontWeight: 800, letterSpacing: ".4px", color: "rgba(28,28,40,.5)", textTransform: "uppercase" }}>
          <span>College</span><span>Branch</span><span style={{ textAlign: "right" }}>Close</span>
        </div>
        {CUTOFF_ROWS.map(([col, br, cr], i) => (
          <div key={col} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.9fr", gap: 6, padding: "9px 11px", borderTop: i === 0 ? "none" : "1px solid rgba(28,28,40,.06)", alignItems: "center" }}>
            <span style={{ fontFamily: "Space Grotesk,Sora", fontWeight: 700, fontSize: 11.5, color: INK }}>{col}</span>
            <span style={{ fontSize: 11, color: "rgba(28,28,40,.6)" }}>{br}</span>
            <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 11.5, color: VIOLET, textAlign: "right" }}>{cr}</span>
          </div>
        ))}
      </div>
    );
  }

  /* mentorship */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {PLANS.map(({ exam, tag, price, color, Icon }) => (
        <div key={exam} style={{ ...card, display: "flex", alignItems: "center", gap: 11, padding: "9px 11px" }}>
          <span style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, border: `1.5px solid ${color}38`, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Icon size={16} color={color} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "Space Grotesk,Sora", fontWeight: 700, fontSize: 12.5, color: INK }}>{exam} Mentorship</div>
            <div style={{ fontSize: 10, color: "rgba(28,28,40,.5)" }}>{tag}</div>
          </div>
          <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 12.5, color, flexShrink: 0 }}>{price}</span>
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,90,54,.07)", border: "1px solid rgba(255,90,54,.18)", borderRadius: 11, padding: "8px 11px" }}>
        <span style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg,${CORAL},${CORAL_DK})`, display: "grid", placeItems: "center", flexShrink: 0, fontFamily: "Sora", fontWeight: 800, fontSize: 10, color: "#fff" }}>AK</span>
        <div style={{ fontSize: 10.5, color: "rgba(28,28,40,.7)" }}>Mentored by <b style={{ color: INK }}>IITians & doctors</b></div>
        <Check size={15} color={GREEN} strokeWidth={3} style={{ marginLeft: "auto" }} />
      </div>
    </div>
  );
}

function MobileCyclePhone() {
  const [i, setI] = useCycle(SECTIONS.length, 2800);
  const sec = SECTIONS[i];
  return (
    <div style={{ width: "100%", maxWidth: 320, margin: "0 auto" }}>
      <div style={{ position: "relative", borderRadius: 42, background: "#15151f", padding: 9, boxShadow: "0 34px 70px -26px rgba(26,26,46,.55), 0 0 0 2px rgba(26,26,46,.05)" }}>
        <div style={{ position: "relative", borderRadius: 34, overflow: "hidden", background: "#f5f4f6", display: "flex", flexDirection: "column", minHeight: 520 }}>
          <div style={{ position: "absolute", top: 9, left: "50%", transform: "translateX(-50%)", width: "34%", height: 20, background: "#15151f", borderRadius: 20, zIndex: 6 }} />
          {/* coral header */}
          <div style={{ flexShrink: 0, background: `linear-gradient(135deg,${CORAL},${CORAL_DK})`, color: "#fff", padding: "10px 15px 13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10.5, fontWeight: 800, marginBottom: 10 }}>
              <span>9:41</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Signal size={12} /><Wifi size={12} /><BatteryFull size={16} /></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.3)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <sec.Icon size={18} color="#fff" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, opacity: 0.9, fontWeight: 700, letterSpacing: ".4px" }}>COLLEGEPARICHAY</div>
                <AnimatePresence mode="wait">
                  <motion.div key={sec.key} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}
                    style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 16, letterSpacing: "-.2px" }}>{sec.title}</motion.div>
                </AnimatePresence>
              </div>
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ width: 9, height: 9, borderRadius: "50%", background: "#fff", flexShrink: 0 }} />
            </div>
          </div>
          {/* body */}
          <div style={{ flex: 1, minHeight: 0, padding: "14px 13px", overflow: "hidden" }}>
            <AnimatePresence mode="wait">
              <motion.div key={sec.key} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                <div style={{ fontSize: 11.5, color: "rgba(28,28,40,.5)", marginBottom: 12 }}>{sec.sub}</div>
                <SectionBody k={sec.key} />
              </motion.div>
            </AnimatePresence>
          </div>
          {/* bottom tab bar */}
          <div style={{ flexShrink: 0, background: "#fff", borderTop: "1px solid rgba(26,26,46,.07)", padding: "9px 6px 13px", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
            {SECTIONS.map(({ key, Icon }, idx) => {
              const active = idx === i;
              return (
                <div key={key} onClick={() => setI(idx)} style={{ position: "relative", padding: "7px 12px", cursor: "pointer" }}>
                  {active && <motion.div layoutId="cp-tab-pill" transition={{ type: "spring", stiffness: 500, damping: 38 }} style={{ position: "absolute", inset: 0, background: "rgba(255,90,54,.12)", borderRadius: 10 }} />}
                  <Icon size={19} color={active ? CORAL : "#b6b3bb"} style={{ position: "relative" }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MENTORSHIP-HUB PRODUCT CARD (desktop / tablet)
════════════════════════════════════════════════ */
const LINE_ART = "#B85E13";
const gridStagger = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } };
const featVar = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } } };

function NavItem({ icon, label, active, sub }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: sub ? 6 : 8,
      fontSize: 12.5, marginBottom: 11,
      color: active ? CORAL : sub ? "#7A6A54" : "#5A4C3B",
      fontWeight: active ? 700 : 500,
    }}>
      {icon} {label}
    </div>
  );
}

function Feat({ icon, bg, color, label }) {
  return (
    <motion.div
      variants={featVar}
      whileHover={{ y: -3, boxShadow: "0 12px 24px -12px rgba(40,33,26,.2)", borderColor: `${CORAL}66` }}
      style={{
        border: "1px solid #F0E4D6", background: "#FFFFFF", borderRadius: 12,
        padding: "12px 13px", display: "flex", alignItems: "center", gap: 9,
        fontSize: 12.5, color: "#3D3324", fontWeight: 600, cursor: "default",
      }}
    >
      <span style={{ width: 30, height: 30, borderRadius: 8, background: bg, color, display: "grid", placeItems: "center", flexShrink: 0 }}>{icon}</span>
      {label}
    </motion.div>
  );
}

function Testimonial({ quote, initials, name, role, avBg, avColor }) {
  return (
    <div style={{ flex: 1, background: "#fff", borderRadius: 16, padding: 16, border: "1px solid #F0E4D6" }}>
      <p style={{ fontSize: 12.5, fontStyle: "italic", color: INK, lineHeight: 1.6, margin: "0 0 12px" }}>{quote}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: avBg, color: avColor, display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
        <div>
          <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: INK }}>{name}</p>
          <p style={{ margin: 0, fontSize: 10.5, color: "#A99378" }}>{role}</p>
        </div>
      </div>
    </div>
  );
}

function MentorshipHubMock({ isMobile }) {
  return (
    <div style={{ width: "100%", maxWidth: 960, margin: "0 auto" }}>
      {/* card */}
      <div style={{
        display: "flex", flexDirection: isMobile ? "column" : "row",
        background: "#fff", borderRadius: 18, overflow: "hidden",
        border: "1px solid #F0E4D6",
        boxShadow: "0 30px 70px -34px rgba(40,33,26,.28), 0 8px 20px -12px rgba(40,33,26,.1)",
      }}>
        {/* ── sidebar ── */}
        <div style={{
          width: isMobile ? "auto" : 230, flexShrink: 0,
          background: "#FFFFFF",
          borderRight: isMobile ? "none" : "1px solid #F0E4D6",
          borderBottom: isMobile ? "1px solid #F0E4D6" : "none",
          padding: "18px 14px", display: "flex", flexDirection: "column",
        }}>
          {/* brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 20 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${CORAL},${CORAL_DK})`, display: "grid", placeItems: "center", color: "#fff", fontSize: 12, fontWeight: 800, letterSpacing: "-0.02em", fontFamily: "Sora" }}>CP</div>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#28211A", fontFamily: "Sora" }}>College Parichay</div>
              <div style={{ fontSize: 9.5, color: "#B08B60", fontWeight: 500 }}>by IIT Roorkee alumni</div>
            </div>
            <Bell size={16} color="#B7ADA0" style={{ marginLeft: "auto" }} />
          </div>

          {/* search + ask */}
          <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, background: "#FDF1E4", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#B08B60" }}>
              <Search size={13} /> Search
            </div>
            <div style={{ flex: 0.6, display: "flex", alignItems: "center", gap: 6, background: "#FEECD8", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#8A6A3F" }}>
              <Sparkles size={13} /> Ask
            </div>
          </div>

          <p style={{ fontSize: 10.5, color: "#C4A87F", margin: "0 0 8px", letterSpacing: ".05em", textTransform: "uppercase", fontWeight: 600 }}>Favorites</p>
          <NavItem active icon={<Users size={15} />} label="Find a mentor" />
          <NavItem icon={<CalendarClock size={15} />} label="My sessions" />
          <NavItem icon={<LineChart size={15} />} label="Rank predictor" />

          <p style={{ fontSize: 10.5, color: "#C4A87F", margin: "10px 0 8px", letterSpacing: ".05em", textTransform: "uppercase", fontWeight: 600 }}>My channels</p>
          <NavItem sub icon={<><ChevronRight size={12} /><Landmark size={15} /></>} label="Colleges & cutoffs" />
          <NavItem sub icon={<><ChevronRight size={12} /><CalendarDays size={15} /></>} label="JoSAA deadlines" />

          <div style={{ marginTop: isMobile ? 8 : "auto", borderTop: "1px solid #F0E4D6", paddingTop: 12 }}>
            <NavItem icon={<Map size={15} />} label="Campus map" />
            <div style={{ marginBottom: 0 }}><NavItem icon={<Archive size={15} />} label="Archive" /></div>
          </div>
        </div>

        {/* ── main ── */}
        <div style={{ flex: 1, padding: isMobile ? "16px 16px 22px" : "16px 26px 26px", minWidth: 0 }}>
          {/* topbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#5A4C3B" }}>
              <ChevronLeft size={15} color="#B7ADA0" />
              <ChevronRight size={15} color="#B7ADA0" />
              <Users size={15} color={CORAL} style={{ marginLeft: 6 }} /> Mentorship hub
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#C4A87F" }}>
              <Share2 size={15} /><Star size={15} /><MoreHorizontal size={15} />
            </div>
          </div>

          {/* hero banner */}
          <div style={{ background: "linear-gradient(135deg,#FEECD8,#FDDFC0)", borderRadius: 16, height: 150, marginBottom: 20, position: "relative", overflow: "hidden" }}>
            <svg width="160" viewBox="0 0 160 100" style={{ position: "absolute", left: 24, top: 26 }}>
              <circle cx="38" cy="34" r="17" fill="none" stroke={LINE_ART} strokeWidth="1.6" />
              <path d="M16 76 Q38 54 60 76" fill="none" stroke={LINE_ART} strokeWidth="1.6" />
              <circle cx="102" cy="46" r="13" fill="none" stroke={LINE_ART} strokeWidth="1.6" />
              <path d="M82 80 Q102 62 122 80" fill="none" stroke={LINE_ART} strokeWidth="1.6" />
              <path d="M58 42 L84 50" stroke={LINE_ART} strokeWidth="1.2" strokeDasharray="2 3" />
            </svg>
            <div style={{ position: "absolute", right: 16, top: 16, background: "rgba(255,255,255,0.78)", borderRadius: 20, padding: "5px 13px", fontSize: 11, color: "#B85E13", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
              <BadgeCheck size={13} /> Verified IITian mentors
            </div>
          </div>

          <h2 style={{ fontSize: 21, fontWeight: 700, margin: "0 0 6px", color: "#28211A", fontFamily: "Sora" }}>Mentorship hub</h2>
          <p style={{ fontSize: 13, color: "#6E5D48", lineHeight: 1.65, margin: "0 0 22px", maxWidth: 480 }}>
            Get matched with an IITian mentor, book 1:1 sessions, and plan your JoSAA choices with confidence — all inside Parichay.
          </p>

          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px", color: "#28211A", fontFamily: "Sora" }}>Features</h3>
          <motion.div variants={gridStagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
            style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 10, marginBottom: 22 }}>
            <Feat icon={<Users size={15} />} bg="#FEECD8" color="#B85E13" label="Mentor matching" />
            <Feat icon={<CalendarClock size={15} />} bg="#E6F1FB" color="#185FA5" label="Session booking" />
            <Feat icon={<LineChart size={15} />} bg="#FBEAF0" color="#993556" label="Rank predictor" />
          </motion.div>

          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px", color: "#28211A", fontFamily: "Sora" }}>More ways to connect</h3>
          <p style={{ fontSize: 12, color: "#6E5D48", lineHeight: 1.65, margin: "0 0 14px", maxWidth: 480 }}>
            Chat with mentors between sessions, compare colleges with peers, and get reminders before every counselling deadline.
          </p>
          <motion.div variants={gridStagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
            style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 10 }}>
            <Feat icon={<MessageCircle size={15} />} bg="#EAF3DE" color="#3B6D11" label="1:1 chat" />
            <Feat icon={<Map size={15} />} bg="#E1F5EE" color="#0F6E56" label="Campus map explorer" />
            <Feat icon={<BellRing size={15} />} bg="#FAEEDA" color="#854F0B" label="Deadline nudges" />
            <Feat icon={<ListChecks size={15} />} bg="#EEEDFE" color="#3C3489" label="Choice list planner" />
          </motion.div>
        </div>
      </div>

      {/* testimonials */}
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 14, marginTop: 18 }}>
        <Testimonial
          quote={'"My mentor got matched to me in a day. Booking sessions around mock tests has never been this easy."'}
          initials="RA" name="Riya Agarwal" role="JEE aspirant, target CSE" avBg="#FEECD8" avColor="#B85E13" />
        <Testimonial
          quote={'"The rank predictor and mentor notes give my mentees a clear plan instead of just a cutoff number."'}
          initials="SK" name="Sanjay Kulkarni" role="Mentor, IIT Roorkee alumnus" avBg="#E1F5EE" avColor="#0F6E56" />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   HERO — MAIN EXPORT
════════════════════════════════════════════════ */
export default function Hero({ onSearch }) {
  const nav = useNavigate();
  const { bp, isXs, isMobile, isSmall } = useBreakpoint();
  const openSearch = () => { if (onSearch) onSearch(); else nav("/search"); };
  const twoCol = !isSmall; // side-by-side on ipadpro + desktop
  const headingSize =
    bp === "xs"      ? "2.05rem" :
    bp === "mobile"  ? "2.5rem"  :
    bp === "tablet"  ? "3rem"    :
    bp === "ipadpro" ? "2.7rem"  :
                       "clamp(2.7rem, 3.3vw, 3.5rem)";

  return (
    <section style={{ position: "relative", overflow: "hidden", width: "100%", boxSizing: "border-box", background: "#FFFFFF" }}>
      <div className="container" style={{
        position: "relative", zIndex: 2, width: "100%",
        paddingInline: "1.5rem", boxSizing: "border-box",
        paddingTop: isXs ? 118 : isMobile ? 128 : twoCol ? 150 : 138,
        paddingBottom: isMobile ? 48 : 72,
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: twoCol ? "minmax(0, 0.85fr) minmax(0, 1.15fr)" : "1fr",
          gap: twoCol ? 44 : 40,
          alignItems: "center",
        }}>
          {/* ══ LEFT — copy ══ */}
          <div style={{ textAlign: twoCol ? "left" : "center", maxWidth: twoCol ? "none" : 720, margin: twoCol ? 0 : "0 auto" }}>
            {/* eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${CORAL}14`, border: `1px solid ${CORAL}30`, color: CORAL_DK, borderRadius: 9999, padding: "6px 14px", fontSize: 12.5, fontWeight: 700, fontFamily: "'Inter',system-ui,sans-serif", marginBottom: 18 }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: CORAL }} /> 1-on-1 mentorship · free rank predictors
            </motion.div>

            <motion.h1
              variants={headVariants} initial="hidden" animate="show"
              style={{ fontFamily: "'Space Grotesk','Sora',system-ui,sans-serif", fontWeight: 800, color: INK, fontSize: headingSize, lineHeight: 1.08, letterSpacing: "-0.03em", margin: 0 }}
            >
              <span style={{ display: "block" }}>
                {LINE_A.map((w, idx) => <HeadWord key={idx} w={w} order={0} />)}
              </span>
              <span style={{ display: "block" }}>
                {LINE_B.map((w, idx) => <HeadWord key={idx} w={w} order={1} />)}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ marginTop: 18, marginBottom: 0, marginInline: twoCol ? 0 : "auto", maxWidth: twoCol ? 460 : 560, fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 500, fontSize: isXs ? "1rem" : "1.08rem", color: "#5b5b66", lineHeight: 1.55 }}
            >
              An <b style={{ color: CORAL_DK, fontWeight: 700 }}>IIT Roorkee</b> startup — predict your JEE &amp; NEET rank and get a personal IITian mentor. All free.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.32 }}
              style={{ display: "flex", flexWrap: "wrap", justifyContent: twoCol ? "flex-start" : "center", gap: 14, marginTop: 26 }}
            >
              <button
                onClick={openSearch}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 9, cursor: "pointer",
                  padding: "13px 26px", borderRadius: 9999, whiteSpace: "nowrap",
                  background: "#fff", border: "1px solid rgba(0,0,0,.14)", color: "#111",
                  fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 600, fontSize: isXs ? 14 : 15,
                  boxShadow: "0 4px 12px rgba(0,0,0,.03)", transition: "all .2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(0,0,0,.28)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(0,0,0,.14)"; }}
              >
                <Search size={17} /> Search
              </button>
              <button
                onClick={() => nav("/jee-main#college")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 9, cursor: "pointer",
                  padding: "14px 30px", borderRadius: 9999, whiteSpace: "nowrap",
                  background: CORAL, border: "none", color: "#fff",
                  fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 600, fontSize: isXs ? 14 : 15,
                  boxShadow: "0 8px 24px rgba(255, 90, 54, 0.3)", transition: "all .2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = CORAL_DK; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.background = CORAL; }}
              >
                Predict my college <Target size={18} />
              </button>
            </motion.div>

            {/* trust row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.44 }}
              style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 26, justifyContent: twoCol ? "flex-start" : "center" }}
            >
              <div style={{ display: "flex" }}>
                {[["A", "#FF7A50"], ["P", "#FF5A36"], ["R", "#E0421F"]].map(([t, bg], i) => (
                  <span key={t} style={{ width: 36, height: 36, borderRadius: "50%", background: bg, border: "2.5px solid #fff", display: "grid", placeItems: "center", marginLeft: i === 0 ? 0 : -12, color: "#fff", fontWeight: 800, fontSize: 13, fontFamily: "'Inter',system-ui,sans-serif" }}>{t}</span>
                ))}
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "#4B5563", fontFamily: "'Inter',system-ui,sans-serif" }}>
                Trusted by <b style={{ color: "#111" }}>3,200+</b> JEE &amp; NEET aspirants
              </p>
            </motion.div>
          </div>

          {/* ══ RIGHT — mentorship-hub card (desktop/tablet) · animated phone (mobile) ══ */}
          <motion.div
            initial={{ opacity: 0, x: twoCol ? 50 : 0, y: twoCol ? 0 : 40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ minWidth: 0 }}
          >
            {isMobile ? <MobileCyclePhone /> : <MentorshipHubMock isMobile={false} />}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
