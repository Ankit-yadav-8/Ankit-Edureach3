import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CL, clEyebrow } from "./clTheme.js";
import { Sparkles, ArrowRight, Video, Target, MessageCircle, CheckCircle2 } from "lucide-react";

export default function MentorshipBanner() {
  const nav = useNavigate();

  return (
    <section style={{ padding: "60px 24px", background: CL.cream, overflow: "hidden" }}>
      <div className="container" style={{ maxWidth: 1140, margin: "0 auto" }}>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          style={{
            background: CL.card,
            borderRadius: 32,
            border: `1px solid ${CL.line}`,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "56px 64px",
            position: "relative",
            boxShadow: CL.shadowLg,
            gap: 40
          }}
          className="mentorship-banner-card"
        >
          {/* Subtle background glow */}
          <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "radial-gradient(circle, rgba(255,105,61,0.04) 0%, rgba(255,255,255,0) 70%)", zIndex: 0 }} />

          {/* Left Text Content */}
          <div style={{ flex: 1, maxWidth: 540, position: "relative", zIndex: 2 }} className="mb-text-area">
            <span style={{ ...clEyebrow, marginBottom: 20 }}>
              <Sparkles size={14} /> Guided Prep
            </span>
            <h2 style={{ 
              fontFamily: CL.display, 
              fontSize: "clamp(2rem, 4vw, 2.6rem)", 
              fontWeight: 800, 
              color: CL.ink, 
              lineHeight: 1.15,
              marginBottom: 20,
              letterSpacing: "-1px"
            }}>
              Crack JEE & NEET with <span style={{ color: CL.coral }}>Top Rankers.</span>
            </h2>
            <p style={{ 
              color: CL.body, 
              fontSize: "1.1rem", 
              lineHeight: 1.6, 
              marginBottom: 36,
              maxWidth: 480
            }}>
              Stop guessing your prep strategy. Get paired with an IITian or top medical student. Receive personalized daily targets, live doubt resolution, and proven frameworks to maximize your score.
            </p>
            <motion.button
              whileHover={{ y: -3, boxShadow: `0 12px 24px rgba(255,105,61,0.3)` }}
              whileTap={{ y: 0 }}
              onClick={() => nav("/mentorship")}
              style={{
                background: CL.coral,
                color: "#FFFFFF",
                border: "none",
                padding: "16px 36px",
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                boxShadow: `0 6px 16px rgba(255,105,61,0.25)`,
                transition: "background 0.2s ease"
              }}
            >
              Explore Mentorship Plans
              <ArrowRight size={20} />
            </motion.button>
          </div>

          {/* Right Animated UI Content */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 1, height: 320 }} className="mb-anim-area">
            
            {/* Animated Floating Card 1 */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: 20,
                right: 40,
                background: "#FFFFFF",
                padding: "16px 20px",
                borderRadius: 16,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                border: `1px solid ${CL.line}`,
                display: "flex",
                alignItems: "center",
                gap: 12,
                zIndex: 3
              }}
            >
              <div style={{ background: CL.coralSoft, color: CL.coralDk, padding: 10, borderRadius: 10 }}>
                <Video size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: CL.muted, fontWeight: 600 }}>WEEKLY</div>
                <div style={{ fontSize: 15, color: CL.ink, fontWeight: 700 }}>1-on-1 Strategy Call</div>
              </div>
            </motion.div>

            {/* Animated Floating Card 2 */}
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              style={{
                position: "absolute",
                top: 140,
                left: 0,
                background: "#FFFFFF",
                padding: "16px 20px",
                borderRadius: 16,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                border: `1px solid ${CL.line}`,
                display: "flex",
                alignItems: "center",
                gap: 12,
                zIndex: 2
              }}
            >
              <div style={{ background: CL.greenSoft, color: "#0FAE6E", padding: 10, borderRadius: 10 }}>
                <Target size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: CL.muted, fontWeight: 600 }}>TODAY</div>
                <div style={{ fontSize: 15, color: CL.ink, fontWeight: 700 }}>Complete Ray Optics</div>
              </div>
            </motion.div>

            {/* Animated Floating Card 3 */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
              style={{
                position: "absolute",
                bottom: 30,
                right: 20,
                background: "#FFFFFF",
                padding: "16px 20px",
                borderRadius: 16,
                boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                border: `1px solid ${CL.line}`,
                display: "flex",
                alignItems: "center",
                gap: 12,
                zIndex: 4
              }}
            >
              <div style={{ background: CL.amberSoft, color: "#E29A2E", padding: 10, borderRadius: 10 }}>
                <MessageCircle size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: CL.muted, fontWeight: 600 }}>24/7 SUPPORT</div>
                <div style={{ fontSize: 15, color: CL.ink, fontWeight: 700 }}>Instant Doubt Solved</div>
              </div>
            </motion.div>

            {/* Central decorative element connecting them */}
            <div style={{ 
              width: 140, height: 140, 
              borderRadius: "50%", 
              background: `linear-gradient(135deg, ${CL.coralSoft}, #FFF4F2)`,
              border: `2px dashed rgba(255,105,61,0.2)`,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <CheckCircle2 size={48} color={CL.coral} opacity={0.8} />
            </div>

          </div>
        </motion.div>

      </div>
      
      <style>{`
        @media (max-width: 900px) {
          .mentorship-banner-card {
            flex-direction: column !important;
            padding: 40px 24px !important;
            text-align: center;
          }
          .mb-text-area {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .mb-anim-area {
            width: 100%;
            height: 280px !important;
            margin-top: 20px;
          }
          .mb-anim-area > div {
            transform: scale(0.9);
          }
        }
      `}</style>
    </section>
  );
}
