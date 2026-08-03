import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function MentorshipBanner() {
  const nav = useNavigate();

  return (
    <section style={{ padding: "40px 24px", background: "var(--page-bg, #fff)" }}>
      <div className="container" style={{ maxWidth: 1100, margin: "0 auto" }}>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          style={{
            background: "linear-gradient(135deg, #0B192C 0%, #113F36 100%)",
            borderRadius: 24,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "48px 64px",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 20px 40px rgba(11, 25, 44, 0.15)"
          }}
          className="mentorship-banner-card"
        >
          {/* Left Text Content */}
          <div style={{ flex: 1, maxWidth: 540, position: "relative", zIndex: 2 }} className="mb-text-area">
            <h2 style={{ 
              fontFamily: "'Space Grotesk', 'Sora', sans-serif", 
              fontSize: "clamp(2rem, 4vw, 2.8rem)", 
              fontWeight: 800, 
              color: "#FFFFFF", 
              lineHeight: 1.2,
              marginBottom: 16,
              letterSpacing: "-0.5px"
            }}>
              Achieve Your Dream College: Expert Mentorship for JEE & NEET
            </h2>
            <p style={{ 
              color: "rgba(255, 255, 255, 0.85)", 
              fontSize: "1.1rem", 
              lineHeight: 1.6, 
              marginBottom: 32,
              maxWidth: 480
            }}>
              Connect with experienced mentors from top IITs and Medical Colleges to accelerate your preparation.
            </p>
            <button
              onClick={() => nav("/mentorship")}
              style={{
                background: "#10B981", // Bright green from image
                color: "#FFFFFF",
                border: "none",
                padding: "16px 32px",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(16, 185, 129, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(16, 185, 129, 0.3)";
              }}
            >
              Book a Free Consultation
            </button>
          </div>

          {/* Right Image Content */}
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", position: "relative", zIndex: 1 }} className="mb-image-area">
            <img 
              src="/images/home_mentorship_overview.png" 
              alt="Expert Mentors" 
              style={{
                maxWidth: "100%",
                height: "auto",
                maxHeight: 340,
                objectFit: "contain",
                filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.2))"
              }}
              onError={(e) => {
                // Fallback if the image doesn't exist
                e.target.style.display = 'none';
              }}
            />
          </div>
        </motion.div>

      </div>
      
      <style>{`
        @media (max-width: 900px) {
          .mentorship-banner-card {
            flex-direction: column !important;
            padding: 40px 32px !important;
            text-align: center;
            gap: 40px;
          }
          .mb-text-area {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .mb-image-area {
            justify-content: center !important;
          }
        }
        @media (max-width: 480px) {
          .mentorship-banner-card {
            padding: 32px 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
