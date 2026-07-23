import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, GraduationCap, ArrowRight, Target, TrendingUp, Users, Trophy,
  Crosshair, ChevronRight, LayoutDashboard, BarChart3, CalendarDays,
  MapPin, Check, Stethoscope, Award, Signal, Wifi, BatteryFull,
} from "lucide-react";

/* ════════════════════════════════════════════════
   HERO — big centred headline → twin CTAs → an
   animated product dashboard (sidebar sections cycle
   one-by-one, styled like the live site) + a phone.
   Mobile shows a mentorship-style animated phone.
════════════════════════════════════════════════ */

const CORAL    = "#FF5A36";
const CORAL_DK = "#E0421F";
const INK      = "#1c1c28";
const VIOLET   = "#8b5cf6";
const TEAL     = "#0ea5a4";
const GREEN    = "#22c55e";
const AMBER     = "#E29A2E";

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
    isSmall:   bp !== "desktop" && bp !== "ipadpro",
  };
}

/* auto-advancing index */
function useCycle(len, ms) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % len), ms);
    return () => clearInterval(t);
  }, [len, ms]);
  return [i, setI];
}

/* ════════════════════════════════════════════════
   SECTION DATA (mirrors the real site)
════════════════════════════════════════════════ */
const SECTIONS = [
  { key: "dashboard",  label: "Dashboard",     Icon: LayoutDashboard, accent: CORAL,  title: "Dashboard",         sub: "Your admission cockpit" },
  { key: "predictor",  label: "Rank Predictor", Icon: Crosshair,       accent: CORAL,  title: "College Predictor",  sub: "Your rank → every college you can get" },
  { key: "colleges",   label: "Colleges",       Icon: GraduationCap,   accent: TEAL,   title: "Explore Colleges",   sub: "850+ IITs · NITs · IIITs" },
  { key: "cutoffs",    label: "Cutoffs",        Icon: BarChart3,       accent: VIOLET, title: "JoSAA Cutoffs 2025", sub: "Closing ranks, round-wise" },
  { key: "mentorship", label: "Mentorship",     Icon: Users,           accent: GREEN,  title: "1-on-1 Mentorship",  sub: "JEE & NEET · 2027 · 2028" },
];

const PRED = [
  { rank: "01", name: "IIT Bombay", branch: "CSE",        chance: 96, tone: GREEN, pkg: "₹33.8L" },
  { rank: "02", name: "IIT Delhi",  branch: "CSE",        chance: 88, tone: GREEN, pkg: "₹32.3L" },
  { rank: "03", name: "IIT Madras", branch: "Electrical", chance: 71, tone: AMBER, pkg: "₹31.2L" },
  { rank: "04", name: "NIT Trichy", branch: "CSE",        chance: 54, tone: AMBER, pkg: "₹18.4L" },
];
const COLLEGE_ROWS = [
  { name: "IIT Bombay", tag: "IIT", nirf: 3, pkg: "₹33.8L", tone: CORAL },
  { name: "IIT Delhi",  tag: "IIT", nirf: 2, pkg: "₹32.3L", tone: VIOLET },
  { name: "IIT Madras", tag: "IIT", nirf: 1, pkg: "₹31.2L", tone: TEAL },
  { name: "NIT Trichy", tag: "NIT", nirf: 9, pkg: "₹18.4L", tone: GREEN },
];
const CUTOFF_ROWS = [
  ["IIT Bombay", "CSE", "67"],
  ["IIT Delhi",  "CSE", "110"],
  ["IIT Madras", "EE",  "512"],
  ["NIT Trichy", "CSE", "5,020"],
];
const PLANS = [
  { exam: "JEE 2027",  tag: "1:1 · Daily targets", price: "₹2,499", color: CORAL,  Icon: Trophy },
  { exam: "NEET 2027", tag: "1:1 · Doctor mentor",  price: "₹2,499", color: GREEN,  Icon: Stethoscope },
  { exam: "JEE 2028",  tag: "Foundation track",     price: "₹2,499", color: VIOLET, Icon: Award },
];
const TARGETS = [["Physics", 72, CORAL], ["Chemistry", 64, VIOLET], ["Maths", 85, TEAL]];

/* ════════════════════════════════════════════════
   SECTION BODY (shared by dashboard + phone; `compact`
   tightens it for the phone screen)
════════════════════════════════════════════════ */
function SecHead({ title, sub, compact }) {
  return (
    <div style={{ marginBottom: compact ? 11 : 15 }}>
      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: compact ? 16 : 20, color: INK }}>{title}</div>
      <div style={{ fontSize: compact ? 10.5 : 12, color: "rgba(28,28,40,.5)", marginTop: 2 }}>{sub}</div>
    </div>
  );
}
function Bar({ pct, tone, compact }) {
  return (
    <div style={{ height: compact ? 5 : 6, borderRadius: 4, background: "#ececf0", overflow: "hidden" }}>
      <motion.div
        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ height: "100%", borderRadius: 4, background: tone }}
      />
    </div>
  );
}

function SectionBody({ k, compact }) {
  const gap = compact ? 8 : 10;
  const card = { border: "1px solid rgba(28,28,40,.08)", borderRadius: compact ? 11 : 12, background: "#fff" };

  if (k === "dashboard") {
    const tiles = [
      { lbl: "Predicted AIR", val: "4,846", tone: CORAL },
      { lbl: "Colleges matched", val: "12", tone: TEAL },
      { lbl: "Next deadline", val: "2d", tone: VIOLET },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: compact ? 7 : 10 }}>
          {tiles.map((t) => (
            <div key={t.lbl} style={{ ...card, padding: compact ? "9px 8px" : "12px 12px" }}>
              <div style={{ fontSize: compact ? 8.5 : 10, fontWeight: 800, letterSpacing: ".4px", color: "rgba(28,28,40,.45)", textTransform: "uppercase" }}>{t.lbl}</div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: compact ? 17 : 22, color: t.tone, marginTop: 3 }}>{t.val}</div>
            </div>
          ))}
        </div>
        <div style={{ ...card, padding: compact ? "11px 12px" : "14px 15px" }}>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: compact ? 12 : 13.5, color: INK, marginBottom: compact ? 9 : 12 }}>This week's targets</div>
          <div style={{ display: "flex", flexDirection: "column", gap: compact ? 9 : 12 }}>
            {TARGETS.map(([name, pct, tone]) => (
              <div key={name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: compact ? 11 : 12, marginBottom: 5 }}>
                  <span style={{ color: "rgba(28,28,40,.7)", fontWeight: 600 }}>{name}</span>
                  <span style={{ color: tone, fontWeight: 800 }}>{pct}%</span>
                </div>
                <Bar pct={pct} tone={tone} compact={compact} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (k === "predictor") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f7f6f9", border: "1px solid rgba(28,28,40,.07)", borderRadius: 8, padding: "6px 11px", fontSize: 11.5, color: INK, fontWeight: 700 }}>
            <Target size={12} color={CORAL} /> AIR&nbsp;4,846
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f7f6f9", border: "1px solid rgba(28,28,40,.07)", borderRadius: 8, padding: "6px 11px", fontSize: 11.5, color: "rgba(28,28,40,.7)" }}>
            General <ChevronRight size={12} style={{ transform: "rotate(90deg)" }} color="#9ca3af" />
          </div>
          {!compact && (
            <button style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, background: CORAL, color: "#fff", border: "none", borderRadius: 8, padding: "6px 15px", fontSize: 12, fontWeight: 800, fontFamily: "Sora" }}>
              Predict <ArrowRight size={12} />
            </button>
          )}
        </div>
        {(compact ? PRED.slice(0, 3) : PRED).map((c) => (
          <div key={c.name} style={{ ...card, display: "flex", alignItems: "center", gap: 10, padding: compact ? "8px 10px" : "10px 12px" }}>
            <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 11, color: "#c8c5cf", flexShrink: 0 }}>{c.rank}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Space Grotesk,Sora", fontWeight: 700, fontSize: compact ? 12 : 13, color: INK }}>{c.name}</div>
              <div style={{ fontSize: compact ? 10 : 11, color: "rgba(28,28,40,.5)" }}>{c.branch} · avg {c.pkg}</div>
              <div style={{ marginTop: 6 }}><Bar pct={c.chance} tone={c.tone} compact={compact} /></div>
            </div>
            <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: compact ? 12 : 13, color: c.tone, flexShrink: 0 }}>{c.chance}%</span>
          </div>
        ))}
      </div>
    );
  }

  if (k === "colleges") {
    return (
      <div style={{ display: compact ? "flex" : "grid", flexDirection: "column", gridTemplateColumns: "1fr 1fr", gap: compact ? 8 : 10 }}>
        {(compact ? COLLEGE_ROWS.slice(0, 3) : COLLEGE_ROWS).map((c) => (
          <div key={c.name} style={{ ...card, display: "flex", alignItems: "center", gap: 10, padding: compact ? "9px 10px" : "11px 12px" }}>
            <span style={{ width: 34, height: 34, borderRadius: 9, background: `${c.tone}18`, border: `1.5px solid ${c.tone}38`, display: "grid", placeItems: "center", flexShrink: 0, fontFamily: "Sora", fontWeight: 800, fontSize: 10, color: c.tone }}>{c.tag}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Space Grotesk,Sora", fontWeight: 700, fontSize: compact ? 12 : 13, color: INK }}>{c.name}</div>
              <div style={{ fontSize: compact ? 10 : 11, color: "rgba(28,28,40,.5)" }}>NIRF #{c.nirf} · avg {c.pkg}</div>
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
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.9fr", gap: 6, padding: compact ? "8px 11px" : "10px 14px", background: "#faf9fb", fontSize: compact ? 9.5 : 10.5, fontWeight: 800, letterSpacing: ".4px", color: "rgba(28,28,40,.5)", textTransform: "uppercase" }}>
          <span>College</span><span>Branch</span><span style={{ textAlign: "right" }}>Close</span>
        </div>
        {(compact ? CUTOFF_ROWS.slice(0, 3) : CUTOFF_ROWS).map(([col, br, cr], i) => (
          <div key={col} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.9fr", gap: 6, padding: compact ? "9px 11px" : "11px 14px", borderTop: i === 0 ? "none" : "1px solid rgba(28,28,40,.06)", alignItems: "center" }}>
            <span style={{ fontFamily: "Space Grotesk,Sora", fontWeight: 700, fontSize: compact ? 11.5 : 12.5, color: INK }}>{col}</span>
            <span style={{ fontSize: compact ? 11 : 12, color: "rgba(28,28,40,.6)" }}>{br}</span>
            <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: compact ? 11.5 : 12.5, color: VIOLET, textAlign: "right" }}>{cr}</span>
          </div>
        ))}
      </div>
    );
  }

  /* mentorship */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {PLANS.map(({ exam, tag, price, color, Icon }) => (
        <div key={exam} style={{ ...card, display: "flex", alignItems: "center", gap: 11, padding: compact ? "9px 11px" : "11px 13px" }}>
          <span style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, border: `1.5px solid ${color}38`, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Icon size={16} color={color} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "Space Grotesk,Sora", fontWeight: 700, fontSize: compact ? 12.5 : 13.5, color: INK }}>{exam} Mentorship</div>
            <div style={{ fontSize: compact ? 10 : 11, color: "rgba(28,28,40,.5)" }}>{tag}</div>
          </div>
          <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: compact ? 12.5 : 14, color, flexShrink: 0 }}>{price}</span>
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,90,54,.07)", border: "1px solid rgba(255,90,54,.18)", borderRadius: 11, padding: compact ? "8px 11px" : "10px 13px" }}>
        <span style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg,${CORAL},${CORAL_DK})`, display: "grid", placeItems: "center", flexShrink: 0, fontFamily: "Sora", fontWeight: 800, fontSize: 10, color: "#fff" }}>AK</span>
        <div style={{ fontSize: compact ? 10.5 : 11.5, color: "rgba(28,28,40,.7)" }}>Mentored by <b style={{ color: INK }}>IITians & doctors</b></div>
        <Check size={15} color={GREEN} strokeWidth={3} style={{ marginLeft: "auto" }} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   ANIMATED DASHBOARD (desktop / tablet)
════════════════════════════════════════════════ */
function AnimatedDashboard({ width = 860 }) {
  const [i, setI] = useCycle(SECTIONS.length, 3000);
  const sec = SECTIONS[i];
  return (
    <div style={{
      width, background: "#fff", borderRadius: 18, overflow: "hidden",
      border: "1px solid rgba(28,28,40,.08)",
      boxShadow: "0 40px 80px -30px rgba(28,28,40,.35), 0 10px 24px -12px rgba(28,28,40,.14)",
    }}>
      {/* browser chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", borderBottom: "1px solid rgba(28,28,40,.06)" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <span style={{ fontSize: 11.5, color: "#9ca3af", background: "#f4f4f6", padding: "5px 16px", borderRadius: 7, fontFamily: "'Inter',sans-serif" }}>collegeparichay.in/{sec.key}</span>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: 430 }}>
        {/* sidebar */}
        <div style={{ width: 196, background: "#faf9fb", borderRight: "1px solid rgba(28,28,40,.06)", padding: "16px 12px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <span style={{ width: 26, height: 26, borderRadius: 8, background: `linear-gradient(135deg,${CORAL},${CORAL_DK})`, display: "grid", placeItems: "center", fontFamily: "Sora", fontWeight: 800, fontSize: 11, color: "#fff" }}>CP</span>
            <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13, color: INK }}>CollegeParichay</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid rgba(28,28,40,.08)", borderRadius: 8, padding: "7px 10px", marginBottom: 14 }}>
            <Search size={13} color="#9ca3af" />
            <span style={{ fontSize: 11.5, color: "#b6b3bb" }}>Search…</span>
          </div>
          {SECTIONS.map(({ key, label, Icon }, idx) => {
            const active = idx === i;
            return (
              <div key={key} onClick={() => setI(idx)} style={{ position: "relative", cursor: "pointer", marginBottom: 3 }}>
                {active && (
                  <motion.div layoutId="cp-nav-pill" transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    style={{ position: "absolute", inset: 0, background: "rgba(255,90,54,.1)", borderRadius: 8 }} />
                )}
                <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", fontSize: 12.5, fontFamily: "'Inter',sans-serif", color: active ? CORAL_DK : "rgba(28,28,40,.62)", fontWeight: active ? 700 : 500, transition: "color .3s" }}>
                  <Icon size={15} color={active ? CORAL : "#9ca3af"} /> {label}
                </div>
              </div>
            );
          })}
        </div>

        {/* main — crossfades per active section */}
        <div style={{ flex: 1, padding: "18px 22px", minWidth: 0, position: "relative" }}>
          <AnimatePresence mode="wait">
            <motion.div key={sec.key}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <SecHead title={sec.title} sub={sec.sub} />
              <SectionBody k={sec.key} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   STATIC PHONE (desktop companion, overlaps dashboard)
════════════════════════════════════════════════ */
function PhoneMock() {
  return (
    <div style={{ width: 236, borderRadius: 40, padding: 9, background: "#0b0b12", boxShadow: "0 44px 90px -26px rgba(28,28,40,.5), 0 12px 28px -14px rgba(28,28,40,.3)", border: "1px solid rgba(255,255,255,.08)" }}>
      <div style={{ borderRadius: 32, overflow: "hidden", background: "#0f0f18", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px 6px", fontSize: 11, color: "#fff", fontWeight: 700 }}>
          <span>9:41</span>
          <span style={{ display: "flex", gap: 5, alignItems: "center", opacity: 0.85 }}><Signal size={12} /><Wifi size={12} /><BatteryFull size={16} /></span>
        </div>
        <div style={{ padding: "14px 18px 10px", textAlign: "center" }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, margin: "0 auto 12px", background: `linear-gradient(135deg,${CORAL},${CORAL_DK})`, display: "grid", placeItems: "center", boxShadow: `0 10px 24px -6px ${CORAL}aa` }}>
            <GraduationCap size={24} color="#fff" />
          </div>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 19, color: "#fff", lineHeight: 1.25 }}>Hi Aspirant,<br />your rank is ready</div>
        </div>
        <div style={{ padding: "6px 14px 16px", display: "flex", flexDirection: "column", gap: 9 }}>
          <div style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 14, padding: "12px 13px" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", fontWeight: 700, letterSpacing: ".5px" }}>PREDICTED RANK</div>
            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 24, color: "#fff", marginTop: 2 }}>AIR&nbsp;4,846</div>
            <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}><TrendingUp size={12} /> Top 1.2% percentile</div>
          </div>
          <div style={{ background: "rgba(255,90,54,.14)", border: "1px solid rgba(255,90,54,.3)", borderRadius: 14, padding: "11px 13px" }}>
            <div style={{ fontSize: 10, color: "#ffb59e", fontWeight: 700, letterSpacing: ".5px" }}>TOP MATCH</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(255,255,255,.14)", display: "grid", placeItems: "center", flexShrink: 0 }}><Trophy size={14} color="#fff" /></span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 13, color: "#fff" }}>IIT Bombay</div>
                <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.6)" }}>CSE · 96% chance</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 14, padding: "10px 13px" }}>
            <CalendarDays size={15} color={VIOLET} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>JoSAA Round 1</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)" }}>Choice filling · Jun 28</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#0f0f18", background: CORAL, padding: "3px 8px", borderRadius: 6 }}>2d</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 0 14px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
          {[Crosshair, GraduationCap, Users, MapPin].map((Icon, k) => <Icon key={k} size={18} color={k === 0 ? CORAL : "rgba(255,255,255,.4)"} />)}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   ANIMATED PHONE (mobile) — cycles the same sections
   with a mentorship-style bottom tab + crossfade.
════════════════════════════════════════════════ */
function MobileCyclePhone() {
  const [i, setI] = useCycle(SECTIONS.length, 2800);
  const sec = SECTIONS[i];
  return (
    <div style={{ width: "100%", maxWidth: 320, margin: "0 auto" }}>
      <div style={{ position: "relative", borderRadius: 42, background: "#15151f", padding: 9, boxShadow: "0 34px 70px -26px rgba(26,26,46,.55), 0 0 0 2px rgba(26,26,46,.05)" }}>
        <div style={{ position: "relative", borderRadius: 34, overflow: "hidden", background: "#f5f4f6", display: "flex", flexDirection: "column", minHeight: 520 }}>
          {/* notch */}
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
                <SectionBody k={sec.key} compact />
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
   HERO — MAIN EXPORT
════════════════════════════════════════════════ */
export default function Hero({ onSearch }) {
  const nav = useNavigate();
  const { isXs, isMobile, isTablet } = useBreakpoint();
  const openSearch = () => { if (onSearch) onSearch(); else nav("/search"); };
  const headingSize = isXs ? "2.4rem" : isMobile ? "3rem" : isTablet ? "3.8rem" : "clamp(3.4rem, 5vw, 5rem)";

  return (
    <section style={{ position: "relative", overflow: "hidden", width: "100%", boxSizing: "border-box", background: "#FFFFFF" }}>
      <div className="container" style={{
        position: "relative", zIndex: 2, width: "100%",
        paddingInline: "1.5rem", boxSizing: "border-box",
        paddingTop: isXs ? 118 : isMobile ? 128 : isTablet ? 138 : 150,
      }}>
        {/* ══ Headline ══ */}
        <div style={{ position: "relative", maxWidth: 1120, margin: "0 auto", textAlign: "center" }}>
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

          {/* startup line — single line, previous style */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              marginTop: isMobile ? "1.3rem" : "1.8rem",
              fontFamily: "'Inter','Space Grotesk',system-ui,sans-serif", fontWeight: 600,
              fontSize: "clamp(12px, 2.8vw, 15px)", color: "#444",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%",
            }}
          >
            An <span style={{ color: CORAL }}>IIT Roorkee</span> startup — built by IITians, trusted by aspirants
          </motion.div>
        </div>

        {/* ══ Twin CTAs ══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.28 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, margin: "2rem 0 0" }}
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

        {/* ══ Product mockups ══ */}
        <motion.div
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginTop: isMobile ? "2.6rem" : "3.6rem", display: "flex", justifyContent: "center", paddingBottom: 30 }}
        >
          {isMobile ? (
            <MobileCyclePhone />
          ) : (
            <div style={{ position: "relative", width: isTablet ? 760 : 980, maxWidth: "100%", display: "flex", justifyContent: "center" }}>
              <div style={{ transform: isTablet ? "scale(0.82)" : "none", transformOrigin: "top center" }}>
                <AnimatedDashboard width={860} />
              </div>
              <div style={{ position: "absolute", right: isTablet ? -4 : 12, bottom: -18, transform: isTablet ? "scale(0.88)" : "none", transformOrigin: "bottom right" }}>
                <PhoneMock />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
