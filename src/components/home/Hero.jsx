import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, Target, Bell, Sparkles, Users, CalendarClock, LineChart,
  ChevronRight, ChevronLeft, Landmark, CalendarDays, Map, Archive,
  Share2, Star, MoreHorizontal, BadgeCheck, MessageCircle, BellRing,
  ListChecks,
} from "lucide-react";

/* ════════════════════════════════════════════════
   HERO — big animated headline → twin CTAs → a
   Mentorship-Hub product card + testimonials.
════════════════════════════════════════════════ */

const CORAL    = "#FF5A36";
const CORAL_DK = "#E0421F";
const INK      = "#1c1c28";

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
   MENTORSHIP-HUB PRODUCT CARD (replaces the dashboard)
════════════════════════════════════════════════ */
const LINE_ART = "#B85E13";

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

function Feat({ icon, bg, color, label, wide }) {
  return (
    <motion.div
      whileHover={{ y: -2, borderColor: `${CORAL}66` }}
      style={{
        border: "1px solid #F0E4D6", background: "#FFFCF8", borderRadius: 12,
        padding: "12px 13px", display: "flex", alignItems: "center", gap: 9,
        fontSize: 12.5, color: "#3D3324", fontWeight: 600, cursor: "default",
        gridColumn: wide ? "1 / -1" : undefined,
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
          background: "#FFFBF6",
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
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 10, marginBottom: 22 }}>
            <Feat icon={<Users size={15} />} bg="#FEECD8" color="#B85E13" label="Mentor matching" />
            <Feat icon={<CalendarClock size={15} />} bg="#E6F1FB" color="#185FA5" label="Session booking" />
            <Feat icon={<LineChart size={15} />} bg="#FBEAF0" color="#993556" label="Rank predictor" />
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px", color: "#28211A", fontFamily: "Sora" }}>More ways to connect</h3>
          <p style={{ fontSize: 12, color: "#6E5D48", lineHeight: 1.65, margin: "0 0 14px", maxWidth: 480 }}>
            Chat with mentors between sessions, compare colleges with peers, and get reminders before every counselling deadline.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 10 }}>
            <Feat icon={<MessageCircle size={15} />} bg="#EAF3DE" color="#3B6D11" label="1:1 chat" />
            <Feat icon={<Map size={15} />} bg="#E1F5EE" color="#0F6E56" label="Campus map explorer" />
            <Feat icon={<BellRing size={15} />} bg="#FAEEDA" color="#854F0B" label="Deadline nudges" />
            <Feat icon={<ListChecks size={15} />} bg="#EEEDFE" color="#3C3489" label="Choice list planner" />
          </div>
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

          {/* startup line — single line */}
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

        {/* ══ Mentorship-hub product card ══ */}
        <motion.div
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginTop: isMobile ? "2.6rem" : "3.6rem", paddingBottom: 30 }}
        >
          <MentorshipHubMock isMobile={isMobile} />
        </motion.div>
      </div>
    </section>
  );
}
