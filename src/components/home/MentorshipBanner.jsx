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
            <div
              style={{
                animation: "float1 4s ease-in-out infinite",
                position: "absolute",
                top: 0,
                right: -20,
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
            </div>

            {/* Animated Floating Card 2 */}
            <div
              style={{
                animation: "float2 5s ease-in-out 1s infinite",
                position: "absolute",
                top: 140,
                left: -40,
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
            </div>

            {/* Animated Floating Card 3 */}
            <div
              style={{
                animation: "float3 4.5s ease-in-out 2s infinite",
                position: "absolute",
                bottom: 20,
                right: 0,
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
            </div>

            {/* Central Photo */}
            <div style={{ 
              width: 320, height: 320, 
              position: "relative",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 1
            }}>
              <img 
                src="/images/mentor_illustration.png" 
                alt="Expert Mentorship"
                loading="lazy"
                decoding="async"
                style={{
                  width: "100%", height: "100%", objectFit: "contain",
                  filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.1))"
                }} 
              />
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
        @keyframes float1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(15px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
}
