import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Sparkles, Filter, Ticket, CheckCircle2 } from "lucide-react";
import { FESTS_DB } from "../data/fests";

const containerV = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemV = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

function FestCard({ t }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const iconColor = "#FF693D";

  return (
    <motion.div
      layout
      variants={itemV}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "#ffffff",
        border: `1px solid ${isHovered || isExpanded ? iconColor : `${iconColor}15`}`,
        borderRadius: 20,
        padding: 24,
        boxShadow: isHovered || isExpanded ? `0 12px 30px ${iconColor}15` : "0 4px 20px rgba(0,0,0,0.02)",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        textAlign: "left",
        transform: isHovered && !isExpanded ? "translateY(-4px)" : "translateY(0)",
        overflow: "hidden" // crucial for layout animations
      }}
    >
      <motion.div layout style={{ height: 200, borderRadius: 14, overflow: "hidden", marginBottom: 20, position: "relative" }}>
        <img src={t.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={t.college} />
        {/* Badges on image */}
        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6 }}>
           {t.cultFest && <span style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)", padding: "4px 10px", borderRadius: 8, fontSize: "0.75rem", fontWeight: 700, color: "#e5484d" }}>Cultural</span>}
           {t.techFest && <span style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)", padding: "4px 10px", borderRadius: 8, fontSize: "0.75rem", fontWeight: 700, color: "#6366f1" }}>Technical</span>}
        </div>
      </motion.div>

      <motion.h3 layout style={{ 
        fontFamily: "'Space Grotesk', 'Sora', sans-serif", 
        fontSize: "1.3rem", 
        fontWeight: 800, 
        color: "#1a1a2e", 
        margin: "0 0 12px 0",
        letterSpacing: "-0.5px"
      }}>
        {t.college} Fests
      </motion.h3>

      <motion.p layout style={{ color: "#6b7280", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 24px 0", flexGrow: !isExpanded ? 1 : 0 }}>
        Home to <strong style={{color:"#444"}}>{t.cultFest?.name || "its Cultural Fest"}</strong> & <strong style={{color:"#444"}}>{t.techFest?.name || "its Technical Fest"}</strong>. Discover flagship events, concerts, and hackathons.
      </motion.p>
      
      <AnimatePresence mode="wait">
        {!isExpanded ? (
           <motion.div key="collapsed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <button onClick={() => setIsExpanded(true)} style={{ width: "100%", padding: "12px", borderRadius: 12, background: isHovered ? iconColor : "#1a1a2e", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "0.95rem", transition: "background 0.3s" }}>
                Explore Fests
             </button>
           </motion.div>
        ) : (
          <motion.div 
            key="expanded"
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 20, borderTop: "1px solid #eee", paddingTop: 16 }}>
              
              {t.cultFest && (
                <div>
                  <h4 style={{ margin: "0 0 8px 0", color: "#e5484d", fontWeight: 700, fontSize: "1rem" }}>🎵 Cultural: {t.cultFest.name}</h4>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {(t.cultFest.details?.highlights || ["Flagship pro-shows", "Dance and music events", "Celebrity nights"]).slice(0,3).map(b => (
                      <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.9rem", color: "#4b5563" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#e5484d", marginTop: 7, flexShrink: 0, opacity: 0.8 }} />
                        <span style={{ lineHeight: 1.4 }}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {t.techFest && (
                <div>
                  <h4 style={{ margin: "0 0 8px 0", color: "#6366f1", fontWeight: 700, fontSize: "1rem" }}>💻 Technical: {t.techFest.name}</h4>
                   <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {(t.techFest.details?.highlights || ["Robotics & hackathons", "Technical workshops", "Guest lectures"]).slice(0,3).map(b => (
                      <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.9rem", color: "#4b5563" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", marginTop: 7, flexShrink: 0, opacity: 0.8 }} />
                        <span style={{ lineHeight: 1.4 }}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                  <button onClick={() => setIsExpanded(false)} style={{ flex: 1, padding: "12px", borderRadius: 12, background: "#f1f5f9", color: "#334155", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "0.95rem" }}>
                    Show Less
                  </button>
                  <button onClick={() => alert("Redirecting to portal...")} style={{ flex: 1, padding: "12px", borderRadius: 12, background: iconColor, color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "0.95rem" }}>
                    Register
                  </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CampusFests() {
  const [searchQ, setSearchQ] = useState("");

  const groupedFests = useMemo(() => {
    const groups = FESTS_DB.reduce((acc, fest) => {
      if (!acc[fest.college]) {
        acc[fest.college] = {
          id: fest.college,
          college: fest.college,
          cultFest: null,
          techFest: null,
          img: fest.img // fallback
        };
      }
      if (fest.type === "Cultural") acc[fest.college].cultFest = fest;
      else if (fest.type === "Technical") acc[fest.college].techFest = fest;
      
      // Override img for the 5 colleges we have custom images for
      if (fest.college === "IIT Bombay") acc[fest.college].img = "/images/fests/iit-bombay.jpg";
      if (fest.college === "IIT Delhi") acc[fest.college].img = "/images/fests/iit-delhi.jpg";
      if (fest.college === "IIT Kanpur") acc[fest.college].img = "/images/fests/iit-kanpur.jpg";
      if (fest.college === "IIT Madras") acc[fest.college].img = "/images/fests/iit-madras.jpg";
      if (fest.college === "IIT Roorkee") acc[fest.college].img = "/images/fests/iit-roorkee.jpg";
      return acc;
    }, {});
    return Object.values(groups);
  }, []);

  const filtered = groupedFests.filter((f) => {
    if (searchQ && !f.college.toLowerCase().includes(searchQ.toLowerCase()) && 
        !(f.cultFest?.name || "").toLowerCase().includes(searchQ.toLowerCase()) && 
        !(f.techFest?.name || "").toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ background: "#FDFDFD", minHeight: "100vh", paddingBottom: 100 }}>
      {/* ── HERO SECTION ── */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #2d2b55 100%)", padding: "120px 24px 80px", textAlign: "center", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", padding: "8px 16px", borderRadius: 999, fontSize: "0.85rem", fontWeight: 700, color: "#fff", marginBottom: 24 }}>
            <Sparkles size={14} color="#FF693D" /> India's largest college fest network
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.03em" }}>
            Campus Fests & Events
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Discover and book tickets for the biggest cultural nights, flagship hackathons, and technical symposiums across IITs, NITs, and IIITs.
          </motion.p>
        </div>
      </div>

      {/* ── SEARCH ── */}
      <div className="container" style={{ marginTop: "-32px", position: "relative", zIndex: 10, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 600, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{
            display: "flex",
            gap: 6,
            background: "#ffffff",
            padding: "8px",
            borderRadius: 9999,
            boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 10, paddingLeft: 24, minWidth: 0 }}>
              <Search size={18} color="#9ca3af" style={{ flexShrink: 0 }} />
              <input 
                value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search by college or fest name..." 
                style={{
                  border: "none",
                  outline: "none",
                  flex: 1,
                  minWidth: 0,
                  fontSize: 15,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  background: "transparent",
                  color: "#111",
                }}
              />
            </div>
            <button
              style={{
                borderRadius: 9999,
                padding: "12px 32px",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "'Inter', system-ui, sans-serif",
                background: "linear-gradient(135deg, #FF693D, #FF4500)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(255,105,61,0.3)"
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ── FESTS GRID ── */}
      <div className="container" style={{ marginTop: 60 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <Filter size={48} color="#ccc" style={{ marginBottom: 16, display: "block", margin: "0 auto 16px auto" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>No fests found</h3>
            <p style={{ color: "#64748b" }}>Try adjusting your search.</p>
          </div>
        ) : (
          <motion.div 
            layout
            variants={containerV}
            initial="hidden"
            animate="show"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24, alignItems: "start" }}
          >
            {filtered.map((fest) => (
              <FestCard key={fest.id} t={fest} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
