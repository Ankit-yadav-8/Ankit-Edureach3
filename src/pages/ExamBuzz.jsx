/* ExamBuzz — dedicated hub combining live news/updates, the application &
   counselling radar, in one place. Reached from the home Exam Buzz teaser. */
import { useEffect } from "react";
import Seo from "../components/Seo.jsx";
import ApplicationRadar from "../components/home/ApplicationRadar.jsx";
import NewsSection from "../components/home/NewsSection.jsx";
import { Radio } from "lucide-react";
import { CL } from "../components/home/clTheme.js";

export default function ExamBuzz() {
  useEffect(() => { document.title = "Exam Buzz — Live updates, applications & counselling · College Parichay"; }, []);

  return (
    <div style={{ background: CL.cream, minHeight: "100vh" }}>
      <Seo path="/exam-buzz" />
      {/* header */}
      <div style={{ paddingTop: 104, paddingBottom: 20, background: CL.cream, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${CL.cream3} 1.2px, transparent 1.2px)`, backgroundSize: "26px 26px", opacity: 0.6, pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 760 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11.5, fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase", color: CL.coralDk, background: CL.coralSoft, border: `1px solid ${CL.coral}33`, padding: "6px 14px", borderRadius: 50 }}>
            <Radio size={13} /> Exam Buzz
          </span>
          <h1 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(2.1rem,5vw,3.2rem)", color: CL.ink, letterSpacing: "-1.4px", margin: "18px auto 14px", lineHeight: 1.08 }}>
            Every exam update & deadline, <span style={{ color: CL.coral }}>in one feed.</span>
          </h1>
          <p style={{ color: CL.body, fontSize: "1.08rem", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
            Results, admit cards, counselling schedules and a live application radar — all the dates that decide your admission, tracked in real time.
          </p>
        </div>
      </div>

      {/* radar */}
      <ApplicationRadar />
      {/* news */}
      <NewsSection />
    </div>
  );
}
