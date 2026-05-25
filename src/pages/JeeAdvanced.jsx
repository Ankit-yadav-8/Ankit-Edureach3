import { EXAM_BY_SLUG } from "../data/exams.js";
import RankPredictorTool from "../components/predictor/RankPredictorTool.jsx";
import CollegePredictorTool from "../components/predictor/CollegePredictorTool.jsx";
import { DifficultyAnalysis, PapersGrid, EligibilityCards, RankingsTable } from "../components/predictor/AnalysisSections.jsx";
import { Trend } from "../components/Charts.jsx";
import Reveal from "../components/Reveal.jsx";
import { Info } from "lucide-react";

function Block({ id, eyebrow, title, sub, children }) {
  return (
    <section id={id} className="section" style={{ scrollMarginTop: 90 }}>
      <div className="container">
        <div className="title-bar">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="section-title">{title}</h2>
          {sub && <p className="section-sub">{sub}</p>}
        </div>
        <Reveal>{children}</Reveal>
      </div>
    </section>
  );
}

export default function JeeAdvanced() {
  const exam = EXAM_BY_SLUG["jee-advanced"];
  const trend = exam.cutoffTrend;

  return (
    <div className="page">
      <section style={{ background: "linear-gradient(135deg,#fff7f0,#ffe8d6)", color: "var(--ink)", padding: "48px 0" }}>
        <div className="container">
          <span className="badge violet">JEE Advanced 2026</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", margin: "10px 0 6px" }}>JEE Advanced — IIT Rank & Seat Predictor</h1>
          <p style={{ color: "var(--muted)", maxWidth: 620 }}>Estimate your IIT rank, find which IIT branches are within reach across all JoSAA rounds, and review Paper 1 & 2 analysis.</p>
        </div>
      </section>

      <div className="container" style={{ marginTop: 18 }}>
        <div className="info-banner"><Info size={18} /> Illustrative 2026 data modelled on historical trends — verify on jeeadv.ac.in and josaa.nic.in.</div>
      </div>

      <Block id="rank" eyebrow="Tool 1" title="JEE Advanced Rank Predictor" sub="A modelled estimate of your IIT rank based on expected marks.">
        <RankPredictorTool accent="#0EA5A4" advanced />
      </Block>

      <div style={{ background: "var(--sky)" }}>
        <Block id="college" eyebrow="Tool 2" title="IIT College & Branch Predictor" sub="See which IIT branches you can secure across all 6 JoSAA rounds (IITs have no CSAB).">
          <CollegePredictorTool basePath="/jee-advanced" />
        </Block>
      </div>

      <Block id="analysis" eyebrow="Paper Analysis" title="Paper 1 & Paper 2 difficulty analysis" sub="Subject-level difficulty index across both papers.">
        <DifficultyAnalysis />
      </Block>

      <div style={{ background: "var(--sky)" }}>
        <Block id="trend" eyebrow="Cutoff Trends" title="5-year qualifying marks trend" sub="Aggregate qualifying marks out of 360, category-wise (official IIT figures for 2023–2025; 2021–22 approximate).">
          <div className="card">
            <Trend data={trend} lines={[
              { key: "open", label: "General", color: "#1c1c28" },
              { key: "obc", label: "OBC-NCL", color: "#F4A261" },
              { key: "sc", label: "SC", color: "#2EC4B6" },
              { key: "st", label: "ST", color: "#F97316" },
            ]} height={320} />
          </div>
        </Block>
      </div>

      <Block id="papers" eyebrow="Question Papers" title="Paper 1 & Paper 2 — papers, keys & solutions" sub="Download links (opens official portal).">
        <PapersGrid exam={exam} />
      </Block>

      <div style={{ background: "var(--sky)" }}>
        <Block id="eligibility" eyebrow="Eligibility" title="Who can appear for JEE Advanced?" sub="Key eligibility criteria.">
          <EligibilityCards exam={exam} />
        </Block>
      </div>

      <Block id="iit-rankings" eyebrow="NIRF Rankings" title="Top IITs by ranking & placements" sub="Sort by NIRF rank, average package or placement percentage.">
        <RankingsTable type="IIT" />
      </Block>
    </div>
  );
}
