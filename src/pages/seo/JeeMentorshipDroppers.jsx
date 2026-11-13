import React from "react";
import { SEO_KEYWORD_MAP } from "../../data/seoKeywordMap.js";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import {
  ClusterNav,
  ClusterHero,
  ClusterCta,
  ClusterFaq,
  ClusterRelated,
  getOrganizationSchema,
  getArticleSchema
} from "./ClusterShared.jsx";
import {
  RefreshCw,
  CheckCircle2,
  Calendar,
  Flame,
  ShieldAlert,
  HeartHandshake,
  Clock,
  ArrowRight
} from "lucide-react";

export default function JeeMentorshipDroppers() {
  const currentPath = "/jee-mentorship/droppers";

  const faqs = [
    {
      q: "Why is a dedicated mentor critical for a JEE dropper or repeater?",
      a: "The biggest challenge for a dropper is not syllabus content—it is psychological isolation, self-doubt, lack of accountability, and repeating the exact same preparation mistakes from their previous attempt. A dedicated IITian mentor provides daily structure, unbiased mistake diagnosis, and continuous emotional and strategic support."
    },
    {
      q: "How does the CampusPoint dropper study plan work in 8 months?",
      a: "Our dropper roadmap divides the year into three high-velocity phases: Phase 1 (Months 1-4) completes 100% of high-weightage chapters with 50-70 PYQs per chapter. Phase 2 (Months 5-6) focuses on intensive full-syllabus mock tests and weak chapter remediation. Phase 3 (Months 7-8) is dedicated to rapid revision and exam temperament calibration."
    },
    {
      q: "Can a student jump from 80 percentile to 99 percentile in a drop year?",
      a: "Absolutely. Scores jump dramatically when students stop watching passive lecture videos and instead solve 80-100 timed problems daily, fix their test panic, and aggressively clear backlogs with a mentor holding them accountable every single night."
    },
    {
      q: "How many study hours are required daily for a JEE dropper?",
      a: "We recommend 8 to 10 focused hours divided into 2-hour deep work blocks. Quality and active problem solving always beat unfocused 14-hour marathon sessions that lead to burnout."
    }
  ];

  const jsonLd = [
    getOrganizationSchema(),
    getArticleSchema({
      headline: "Specialized JEE Droppers Mentorship & Repeaters Plan",
      description: "Comprehensive JEE dropper mentorship for serious repeaters. Get personal IITian guidance, 8-month intensive timetable, mistake audit, and daily accountability.",
      path: "/jee-mentorship/droppers"
    }),
    {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "JEE Droppers Mentorship Program",
      "description": "Specialized 1-on-1 mentorship for JEE droppers and repeaters featuring diagnostic gap audits, 8-month intensive timetables, and daily accountability.",
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

  const keywords = SEO_KEYWORD_MAP["/jee-mentorship/droppers"].targetKeywords;

  return (
    <div className="seo-cluster-page">
      <Seo
        title="JEE Dropper Mentorship Program | Repeaters Strategy & Study Plan"
        description="Comprehensive JEE dropper mentorship for serious repeaters. Get personal IITian guidance, 8-month intensive timetable, mistake audit, and daily accountability."
        path={currentPath}
        keywords={keywords}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "JEE Mentorship", path: "/jee-mentorship" },
          { name: "Droppers Mentorship", path: currentPath }
        ]}
        jsonLd={jsonLd}
      />

      <ClusterNav currentPath={currentPath} />

      <ClusterHero
        badge="DROP YEAR RECOVERY & 99%ILE ROADMAP"
        title={
          <>
            Specialized <span className="brand-accent">JEE Droppers Mentorship</span> & Repeaters Plan
          </>
        }
        description="Your drop year is your second and most focused chance. Don't repeat the mistakes of your previous attempt. Get a dedicated IITian mentor who creates your 8-month recovery roadmap, tracks daily study hours, and keeps your motivation unwavering."
        stats={[
          { value: "8 Months", label: "Intensive Syllabus Cycle", color: "brand" },
          { value: "+60-80", label: "Avg Marks Jump in Drop Year", color: "emerald" },
          { value: "Daily", label: "Nightly Study Check-ins", color: "violet" },
          { value: "1-on-1", label: "Dedicated IITian Mentor", color: "brand" }
        ]}
        ctaText="Enroll in Droppers Mentorship · ₹3,499"
        ctaLink="/mentorship/jee-2027"
        secondaryText="View Dropper Blueprint"
        secondaryLink="#dropper-blueprint"
      />

      <main className="scp-container" id="details">
        {/* Core Dropper Problems Solved */}
        <section className="scp-section" id="dropper-blueprint">
          <div className="scp-section-header">
            <span className="scp-kicker">Diagnosing The Drop Year</span>
            <h2 className="scp-h2">Why Most Droppers Fail & How We Fix It</h2>
            <p className="scp-section-sub">
              More than 60% of droppers score the same or worse in their second attempt because they take the same generic coaching classes, re-watch basic lectures, and suffer from mid-year burnout.
            </p>
          </div>

          <div className="scp-grid-3">
            <div className="scp-card">
              <div className="scp-card-icon brand">
                <ShieldAlert size={22} />
              </div>
              <h3 className="scp-card-h3">1. Attempt 1 Post-Mortem Audit</h3>
              <p className="scp-card-p">
                We start with a complete diagnosis of your past attempt: Was your score hindered by lack of syllabus coverage, zero mock practice, or exam panic? Your mentor identifies the true bottlenecks.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Identifying your top 10 bleeding chapters</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Eliminating passive video-watching habits</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon emerald">
                <RefreshCw size={22} />
              </div>
              <h3 className="scp-card-h3">2. Problem-Solving Over Re-Lectures</h3>
              <p className="scp-card-p">
                You already know the basic theory from Class 11 and 12. Sitting through 6 hours of coaching lectures every day is a trap. We focus 70% of your day on active, timed question solving.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> 60-80 timed questions per day minimum</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> 10-year Chapter-wise PYQ mastery</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon violet">
                <HeartHandshake size={22} />
              </div>
              <h3 className="scp-card-h3">3. Daily Accountability & Mental Health</h3>
              <p className="scp-card-p">
                The drop year is lonely. Having an IITian mentor to talk to on WhatsApp and regular video check-ins prevents procrastination, breaks negative thought spirals, and keeps your drive intense.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> 10:30 PM nightly study log review</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Ongoing mindset & burnout management</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 8-Month Dropper Timeline */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Strategic Phasing</span>
            <h2 className="scp-h2">The 8-Month JEE Dropper Recovery Roadmap</h2>
            <p className="scp-section-sub">
              How our mentors structure your preparation to finish the syllabus with mastery well before JEE Main Session 1.
            </p>
          </div>

          <div className="scp-table-wrapper">
            <table className="scp-table">
              <thead>
                <tr>
                  <th>Phase & Months</th>
                  <th>Core Focus</th>
                  <th>Key Milestone Deliverable</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Phase 1 (Months 1–3)</strong></td>
                  <td>Class 11 Mechanics, Physical Chem & Algebra Rebuild</td>
                  <td>Eliminate Class 11 foundation flaws; solve 2,000+ targeted PYQs</td>
                </tr>
                <tr>
                  <td><strong>Phase 2 (Months 4–5)</strong></td>
                  <td>Class 12 Electrodynamics, Organic Chem & Calculus</td>
                  <td>Complete 100% JEE Main syllabus; initiate part-syllabus mock tests</td>
                </tr>
                <tr>
                  <td><strong>Phase 3 (Month 6)</strong></td>
                  <td>Intensive Full Mock Series & Error Remediation</td>
                  <td>2 full tests weekly (CBT format) + mentor question-level autopsy</td>
                </tr>
                <tr>
                  <td><strong>Phase 4 (Months 7–8)</strong></td>
                  <td>JEE Main Final Sprint + JEE Advanced Multi-Concept Shift</td>
                  <td>Lock 99%ile in JEE Main Session 1; pivot to JEE Advanced Paper 1 & 2 sets</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <ClusterCta
          title="Make Your Drop Year Count with an IITian Mentor"
          subtitle="Don't spend another year wondering what went wrong. Get personalized daily schedules, rigorous test error audits, and continuous motivation from mentors who achieved top ranks."
          primaryText="Join Droppers Mentorship · ₹3,499"
          primaryLink="/mentorship/jee-2027"
        />

        {/* FAQs */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">FAQ</span>
            <h2 className="scp-h2">Frequently Asked Questions for JEE Repeaters</h2>
          </div>
          <ClusterFaq items={faqs} />
        </section>

        {/* Related Pages */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Explore Related Topics</span>
            <h2 className="scp-h2">More Guides for Droppers & Repeaters</h2>
          </div>
          <ClusterRelated
            currentPath={currentPath}
            selectedPaths={[
              "/jee-mentorship",
              "/jee-preparation/backlog",
              "/jee-preparation/study-plan",
              "/jee-mentorship/test-analysis"
            ]}
          />
        </section>
      </main>
    </div>
  );
}

