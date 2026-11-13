import React from "react";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import {
  ClusterNav,
  ClusterHero,
  ClusterCta,
  ClusterFaq,
  ClusterRelated
} from "./ClusterShared.jsx";
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  ShieldCheck,
  Flame,
  Clock,
  Layers,
  ArrowRight
} from "lucide-react";

export default function JeePrepBacklog() {
  const currentPath = "/jee-preparation/backlog";

  const faqs = [
    {
      q: "What is the biggest mistake students make when dealing with JEE backlogs?",
      a: "The number one mistake is stopping or skipping ongoing coaching classes to study past backlogs. This creates a vicious cycle: while you struggle with 2 backlog chapters, 3 new chapters become backlogs in your coaching! You must strictly follow the 70-30 rule: 70% of time on ongoing topics, 30% on clearing past chapters."
    },
    {
      q: "How does the CampusPoint 70-30 Backlog Rule work?",
      a: "If you have 8 hours of self-study daily: Spend 5.5 hours (70%) completing today's homework, notes, and questions for your active coaching classes. Reserve exactly 2.5 hours (30%) exclusively for clearing your designated backlog chapter. This ensures zero new backlogs are created."
    },
    {
      q: "How do I choose which backlog chapters to clear first?",
      a: "We use a 3-tier triage matrix: Tier 1 consists of 'Bridge Chapters' (prerequisites like Vectors, GOC, Functions) that unlock current topics. Tier 2 consists of 'High-Yield Independent Chapters' (Modern Physics, Coordination Compounds, Vectors/3D). Tier 3 contains low-weightage isolated chapters."
    },
    {
      q: "Can I clear 6 months of backlogs in 60 days?",
      a: "Yes. By not re-watching 30 hours of long lectures and instead studying one-shot formula summaries combined with 30-40 targeted PYQs per chapter, students routinely clear 15 to 20 backlog chapters in 8-10 weeks with mentor guidance."
    }
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "JEE Backlog Clearance & Management Strategy",
      "description": "Scientific 70-30 backlog formula, prerequisite triage matrix, and weekend sprint blueprints to clear JEE syllabus backlogs.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "CampusPoint",
        "url": "https://campuspoint.in"
      },
      "offers": {
        "@type": "Offer",
        "price": "3499",
        "priceCurrency": "INR",
        "url": "https://campuspoint.in/mentorship/jee-2027"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    }
  ];

  const keywords = [
    "JEE backlog",
    "JEE backlog strategy",
    "JEE backlog management",
    "how to complete JEE backlog",
    "how to clear JEE backlog",
    "JEE backlog study plan",
    "JEE backlog recovery",
    "JEE backlog preparation",
    "JEE backlog mentor",
    "JEE backlog mentorship",
    "how to manage JEE backlog",
    "JEE syllabus backlog",
    "physics backlog JEE",
    "chemistry backlog JEE",
    "maths backlog JEE",
    "JEE backlog timetable",
    "JEE backlog revision strategy"
  ];

  return (
    <div className="seo-cluster-page">
      <Seo
        title="How to Clear JEE Backlogs | Backlog Management Strategy & Recovery Plan"
        description="Learn how to clear JEE backlogs without destroying your current preparation. The proven 70-30 backlog rule, priority chapter triage matrix, and mentor recovery plans."
        path={currentPath}
        keywords={keywords}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "JEE Preparation", path: "/jee-preparation" },
          { name: "Backlog Management", path: currentPath }
        ]}
        jsonLd={jsonLd}
      />

      <ClusterNav currentPath={currentPath} />

      <ClusterHero
        badge="SCIENTIFIC 70-30 BACKLOG ERADICATION FORMULA"
        title={
          <>
            How to Clear <span className="brand-accent">JEE Backlogs</span> Without Panic
          </>
        }
        description="Don't let backlogs kill your confidence. Learn the exact 70-30 recovery system used by top IITians to clear months of pending syllabus while staying 100% on track with ongoing coaching classes."
        stats={[
          { value: "70 / 30", label: "Ongoing vs Backlog Ratio", color: "brand" },
          { value: "60 Days", label: "Average Recovery Sprint", color: "emerald" },
          { value: "Tier 1-3", label: "Smart Chapter Triage", color: "violet" },
          { value: "1-on-1", label: "Mentor Accountability", color: "brand" }
        ]}
        ctaText="Get Mentor Backlog Roadmap · ₹3,499"
        ctaLink="/mentorship/jee-2027"
        secondaryText="View 70-30 System"
        secondaryLink="#backlog-system"
      />

      <main className="scp-container" id="details">
        {/* The 70-30 Rule */}
        <section className="scp-section" id="backlog-system">
          <div className="scp-section-header">
            <span className="scp-kicker">The Core Rule</span>
            <h2 className="scp-h2">The 70-30 Golden Rule of JEE Backlog Management</h2>
            <p className="scp-section-sub">
              Almost every student who panics about backlogs commits the fatal error of skipping ongoing lectures to catch up on old topics. Here is how our mentors prevent that vicious cycle:
            </p>
          </div>

          <div className="scp-grid-2">
            <div className="scp-card" style={{ borderLeft: "4px solid var(--scp-brand)" }}>
              <h3 className="scp-card-h3">70% Study Time: Ongoing Syllabus (Sacred)</h3>
              <p className="scp-card-p">
                Whatever is being taught in your coaching or school TODAY must be revised TODAY. Complete today's homework and formulas first.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Prevents creating any fresh backlogs</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Maintains high classroom confidence and morale</li>
              </ul>
            </div>

            <div className="scp-card" style={{ borderLeft: "4px solid var(--scp-emerald)" }}>
              <h3 className="scp-card-h3">30% Study Time: Systematic Backlog Clearance</h3>
              <p className="scp-card-p">
                Allocate a fixed 2 to 2.5 hour evening block or dedicated weekend sprints strictly to clear one high-priority backlog chapter at a time.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> High-speed formula review + 30 PYQs</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Clears 2 backlog chapters every week reliably</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Backlog Triage Matrix */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Smart Prioritization</span>
            <h2 className="scp-h2">The 3-Tier Backlog Prioritization Matrix</h2>
            <p className="scp-section-sub">
              Not all backlogs are created equal. Clear them in this exact order to maximize marks and unlock dependent chapters:
            </p>
          </div>

          <div className="scp-table-wrapper">
            <table className="scp-table">
              <thead>
                <tr>
                  <th>Tier & Category</th>
                  <th>Examples of Chapters</th>
                  <th>Why You Must Clear It First</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Tier 1: Prerequisite Bridge Chapters</strong></td>
                  <td>Vectors, Basic Calculus, GOC, Periodic Table, Functions</td>
                  <td><strong style={{ color: "var(--scp-brand)" }}>Immediate Priority:</strong> If these are weak, you cannot understand 50% of upcoming syllabus. Clear with mentor within 7 days.</td>
                </tr>
                <tr>
                  <td><strong>Tier 2: High-Yield Independent Chapters</strong></td>
                  <td>Modern Physics, Coordination Compounds, Matrices & Determinants, Thermodynamics</td>
                  <td><strong style={{ color: "var(--scp-emerald)" }}>High-Return Priority:</strong> These chapters have zero dependencies on other topics, are easy to learn, and guarantee 30-40 marks in JEE Main.</td>
                </tr>
                <tr>
                  <td><strong>Tier 3: Low-Yield or Heavy Chapters</strong></td>
                  <td>Rotational Dynamics (if completely unstarted), Complex Numbers, Surface Chemistry</td>
                  <td><strong style={{ color: "var(--scp-violet)" }}>Deferred Priority:</strong> High effort, lower direct return. Leave for the end; solve only basic PYQs to avoid wasting weeks of valuable time.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Weekend Sprint Protocol */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Execution Framework</span>
            <h2 className="scp-h2">The 6-Hour Weekend Backlog Sprint Protocol</h2>
            <p className="scp-section-sub">
              How our students clear an entire backlog chapter in a single weekend:
            </p>
          </div>

          <div className="scp-grid-3">
            <div className="scp-card">
              <div className="scp-card-icon brand">
                <Clock size={22} />
              </div>
              <h3 className="scp-card-h3">Hours 1–2: Concise Theory</h3>
              <p className="scp-card-p">
                Do NOT watch 15 hours of coaching recordings. Read a concise revision summary, mind map, and formula sheet to grasp key laws and definitions.
              </p>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon emerald">
                <Filter size={22} />
              </div>
              <h3 className="scp-card-h3">Hours 3–5: 35 Curated PYQs</h3>
              <p className="scp-card-p">
                Solve 35 recent JEE Main PYQs spanning all core sub-concepts. Mark questions where you got stuck for mentor review.
              </p>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon violet">
                <ShieldCheck size={22} />
              </div>
              <h3 className="scp-card-h3">Hour 6: Timed Sectional Test</h3>
              <p className="scp-card-p">
                Attempt a 15-question, 45-minute timed sectional quiz. Scoring above 70% accuracy means the chapter is officially CLEARED!
              </p>
            </div>
          </div>
        </section>

        <ClusterCta
          title="Eliminate Your Backlogs with an IITian Mentor"
          subtitle="Don't let pending chapters overwhelm you. Your personal IITian mentor triages your syllabus, schedules your daily 70-30 balance, and ensures you finish on time."
          primaryText="Clear My Backlogs · ₹3,499"
          primaryLink="/mentorship/jee-2027"
        />

        {/* FAQs */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">FAQ</span>
            <h2 className="scp-h2">Frequently Asked Questions on Backlog Clearance</h2>
          </div>
          <ClusterFaq items={faqs} />
        </section>

        {/* Related Topics */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Related Clusters</span>
            <h2 className="scp-h2">Explore Other Preparation Roadmaps</h2>
          </div>
          <ClusterRelated
            currentPath={currentPath}
            selectedPaths={[
              "/jee-preparation",
              "/jee-preparation/study-plan",
              "/jee-mentorship/droppers",
              "/jee-mentorship/1-to-1"
            ]}
          />
        </section>
      </main>
    </div>
  );
}
