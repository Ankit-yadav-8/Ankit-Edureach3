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
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart,
  Flame,
  Layers,
  ArrowRight
} from "lucide-react";

export default function JeePrepStudyPlan() {
  const currentPath = "/jee-preparation/study-plan";

  const faqs = [
    {
      q: "How many hours should I study daily for JEE Main and Advanced?",
      a: "Top rankers consistently study 8 to 10 focused hours on non-school/coaching days, and 4 to 6 focused hours on regular school/coaching days. Rather than studying 14 exhausting hours, high efficiency in 2-hour deep work blocks with active problem solving is what produces top percentile results."
    },
    {
      q: "What is the best subject allocation ratio per day?",
      a: "Our mentors recommend the 40:30:30 rule: 40% of daily self-study time dedicated to your weakest or most challenging subject (typically Mathematics or Physics), and 30% each to the remaining two subjects, ensuring no subject is neglected for more than 48 hours."
    },
    {
      q: "How does spaced repetition work in a JEE study plan?",
      a: "To prevent forgetting formulas, our study plans use a 1-7-21 revision schedule: Review a newly completed chapter 24 hours later (15 mins), 7 days later (30 mins solving 10 hard PYQs), and 21 days later (timed 45-min sectional test)."
    },
    {
      q: "Can my IITian mentor customize this timetable for my coaching timings?",
      a: "Yes! Every student receives a fully customized timetable calibrated to their specific school hours, coaching institute schedule, and natural circadian rhythm (morning person vs night owl)."
    }
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Personalized JEE Study Plan & Timetable Strategy",
      "description": "Comprehensive daily, weekly, and monthly JEE study timetables, spaced repetition revision frameworks, and mentor accountability.",
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
    "JEE study plan",
    "JEE preparation plan",
    "JEE study schedule",
    "JEE timetable",
    "JEE preparation timetable",
    "JEE daily schedule",
    "JEE weekly study plan",
    "JEE monthly study plan",
    "personalized JEE study plan",
    "personalized JEE timetable",
    "JEE study plan with mentor",
    "JEE preparation schedule",
    "JEE revision schedule",
    "JEE chapter wise study plan",
    "JEE subject wise study plan",
    "JEE backlog study plan",
    "JEE revision plan",
    "JEE test preparation plan"
  ];

  return (
    <div className="seo-cluster-page">
      <Seo
        title="JEE Study Plan & Timetable | Daily, Weekly & Monthly Schedules"
        description="Master your JEE preparation with a personalized study plan and timetable. Daily routines, weekly progress reviews, spaced repetition revision, and mentor accountability."
        path={currentPath}
        keywords={keywords}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "JEE Preparation", path: "/jee-preparation" },
          { name: "Study Plan", path: currentPath }
        ]}
        jsonLd={jsonLd}
      />

      <ClusterNav currentPath={currentPath} />

      <ClusterHero
        badge="SCIENTIFIC DAILY & WEEKLY TIME MANAGEMENT"
        title={
          <>
            Personalized <span className="brand-accent">JEE Study Plan</span> & Daily Timetable
          </>
        }
        description="Stop wasting hours wondering what to study each day. Follow a proven, high-yield daily routine designed by IITians that balances Physics, Chemistry, and Maths, systematically clears backlogs, and ensures consistent revision."
        stats={[
          { value: "8-10 Hrs", label: "Optimized Daily Self-Study", color: "brand" },
          { value: "1-7-21", label: "Spaced Repetition System", color: "emerald" },
          { value: "60-80 Qs", label: "Daily Problem Target", color: "violet" },
          { value: "1-on-1", label: "Custom Mentor Scheduling", color: "brand" }
        ]}
        ctaText="Get a Custom Study Plan with Mentor · ₹3,499"
        ctaLink="/mentorship/jee-2027"
        secondaryText="View Daily Routine"
        secondaryLink="#daily-schedule"
      />

      <main className="scp-container" id="details">
        {/* Daily Schedule Structure */}
        <section className="scp-section" id="daily-schedule">
          <div className="scp-section-header">
            <span className="scp-kicker">High-Performance Routine</span>
            <h2 className="scp-h2">The 8-Hour Master Daily Schedule for JEE Aspirants</h2>
            <p className="scp-section-sub">
              This routine is built around ultradian focus rhythms (90-120 minute deep work sprints) to maximize problem-solving retention without mental exhaustion:
            </p>
          </div>

          <div className="scp-table-wrapper">
            <table className="scp-table">
              <thead>
                <tr>
                  <th>Block & Time</th>
                  <th>Core Activity</th>
                  <th>Best Practice Guidance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Slot 1 (06:30 – 08:30 AM)</strong></td>
                  <td>Chemistry NCERT & Memory Block</td>
                  <td>Brain is fresh: read Inorganic NCERT, memorize Organic name reactions, or review formula sheets.</td>
                </tr>
                <tr>
                  <td><strong>Slot 2 (09:30 – 12:00 PM)</strong></td>
                  <td>Physics Heavy Numerical Sprint</td>
                  <td>Solve 25-30 timed problems in Mechanics, Electromagnetism, or Thermodynamics.</td>
                </tr>
                <tr>
                  <td><strong>Slot 3 (02:00 – 04:30 PM)</strong></td>
                  <td>Mathematics Problem Solving</td>
                  <td>Tackle 15-20 challenging Calculus or Coordinate Geometry problems without looking at answer keys.</td>
                </tr>
                <tr>
                  <td><strong>Slot 4 (05:30 – 07:30 PM)</strong></td>
                  <td>Classroom / Coaching Lecture Review</td>
                  <td>Synthesize coaching notes, clarify doubts, solve assigned homework sets.</td>
                </tr>
                <tr>
                  <td><strong>Slot 5 (08:30 – 10:00 PM)</strong></td>
                  <td>Backlog & Spaced Revision Block</td>
                  <td>Review Day-7 and Day-21 flagged questions; complete 10 backlog questions.</td>
                </tr>
                <tr>
                  <td><strong>Night Check-in (10:15 PM)</strong></td>
                  <td>Mentor Accountability Log</td>
                  <td>Submit completed question count and hours to your IITian mentor on the portal.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3 Core Rules of Top Scorers */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Habits of Toppers</span>
            <h2 className="scp-h2">The 3 Golden Rules of a Winning JEE Study Plan</h2>
            <p className="scp-section-sub">
              Why the best timetable fails if these behavioral systems are not in place:
            </p>
          </div>

          <div className="scp-grid-3">
            <div className="scp-card">
              <div className="scp-card-icon brand">
                <Clock size={22} />
              </div>
              <h3 className="scp-card-h3">1. Measure Questions, Not Just Hours</h3>
              <p className="scp-card-p">
                Sitting with a book open for 10 hours while daydreaming produces zero marks. We track total questions solved with pen on paper. 60-80 questions daily guarantees success.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Output-based accountability</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Timed stopwatch solving</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon emerald">
                <Layers size={22} />
              </div>
              <h3 className="scp-card-h3">2. The 1-7-21 Spaced Repetition Engine</h3>
              <p className="scp-card-p">
                Human memory fades rapidly without deliberate reviews. By revising after 24 hours, 7 days, and 21 days, formulas and mechanisms move permanently into long-term memory.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Zero last-minute exam panic</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Instant formula recall in tests</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon violet">
                <Flame size={22} />
              </div>
              <h3 className="scp-card-h3">3. Dedicated Backlog Guardrails</h3>
              <p className="scp-card-p">
                Never stop ongoing syllabus to clear past chapters. We designate 90 minutes every evening strictly for backlog clearance without disturbing today's coaching topic.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Protect ongoing momentum</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Systematic backlog recovery</li>
              </ul>
            </div>
          </div>
        </section>

        <ClusterCta
          title="Get a 100% Custom Study Plan from an IITian"
          subtitle="Don't rely on generic internet timetables. Your dedicated IITian mentor builds a custom daily schedule based on your school hours, coaching schedule, and target percentile."
          primaryText="Build My Custom Study Plan · ₹3,499"
          primaryLink="/mentorship/jee-2027"
        />

        {/* FAQs */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">FAQ</span>
            <h2 className="scp-h2">Frequently Asked Questions About JEE Study Plans</h2>
          </div>
          <ClusterFaq items={faqs} />
        </section>

        {/* Related Topics */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Related Clusters</span>
            <h2 className="scp-h2">Explore Preparation Strategies</h2>
          </div>
          <ClusterRelated
            currentPath={currentPath}
            selectedPaths={[
              "/jee-preparation",
              "/jee-preparation/backlog",
              "/jee-preparation/strategy",
              "/jee-mentorship/1-to-1"
            ]}
          />
        </section>
      </main>
    </div>
  );
}
