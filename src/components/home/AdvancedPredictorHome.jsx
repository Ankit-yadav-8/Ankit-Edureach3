/* AdvancedPredictorHome — full JEE Advanced college predictor embedded on the
   home page (replaces the old rank→cutoff mockup). Campusloom section header
   over the real CollegePredictorTool, so it predicts colleges and expands each
   result into its cutoff snapshot + an Explore button. */
import { Zap } from "lucide-react";
import CollegePredictorTool from "../predictor/CollegePredictorTool.jsx";
import { CL, clEyebrow } from "./clTheme.js";

export default function AdvancedPredictorHome() {
  return (
    <section id="advanced-predictor" style={{ background: CL.cream2, padding: "84px 0", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${CL.cream3} 1.2px, transparent 1.2px)`, backgroundSize: "26px 26px", opacity: 0.55, pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 36px" }}>
          <span style={clEyebrow}><Zap size={13} /> JoSAA Engine · JEE Advanced</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.4vw,2.9rem)", color: CL.ink, letterSpacing: "-1.3px", margin: "16px 0 12px", lineHeight: 1.08 }}>
            Map your rank to cutoffs with <span style={{ color: CL.coral }}>certainty.</span>
          </h2>
          <p style={{ color: CL.body, fontSize: "1.04rem", lineHeight: 1.7 }}>
            Enter your JEE Advanced rank and instantly see every IIT branch within reach — with round-by-round cutoffs.
            Tap any result to open its cutoff snapshot and explore the full college.
          </p>
        </div>

        <CollegePredictorTool basePath="/jee-advanced" />
      </div>
    </section>
  );
}
