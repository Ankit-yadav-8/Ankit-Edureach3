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
  BookOpen,
  Calendar,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Sparkles,
  Award,
  ArrowRight
} from "lucide-react";

export default function JeePrepHub() {
  const currentPath = "/jee-preparation";

  const faqs = [
    {
      q: "What resources are included in the CampusPoint JEE Preparation Hub?",
      a: "The JEE Preparation Hub brings together all essential tools and frameworks for JEE Main and Advanced: daily and weekly study timetables, the 70-30 backlog clearance methodology, subject-wise tactical playbooks for Physics, Chemistry & Maths, question-level test error tracking, and direct access to 1-to-1 IITian mentorship."
    },
    {
      q: "How does CampusPoint differ from other JEE preparation websites?",
      a: "Most platforms only provide static PDF notes or recorded video playlists. CampusPoint pairs interactive data-driven tools (Rank Predictors, College Cutoffs, Chapter Weightage) with personalized 1-on-1 mentorship by verified IIT Roorkee rankers to ensure you actually execute your preparation plan daily."
    },
    {
      q: "Is this preparation guide updated for the latest JEE 2027 and 2028 syllabi?",
      a: "Yes. All guides, weightage breakdowns, and study plans reflect the latest NTA reduced syllabus for JEE Main and the updated multi-concept format for JEE Advanced."
    }
  ];

  const jsonLd = [
    getOrganizationSchema(),
    getArticleSchema({
      headline: "Master Your JEE Preparation with Proven Frameworks",
      description: "The ultimate JEE preparation hub. Access proven daily study plans, scientific backlog recovery systems, subject tactical guides, and 1-to-1 IITian mentorship.",
      path: "/jee-preparation"
    }),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "JEE Preparation Hub | Study Plans, Backlogs & Strategy Guides",
      "description": "The ultimate JEE preparation hub featuring proven study plans, backlog recovery systems, subject tactical guides, and 1-to-1 IITian mentorship.",
      "url": "https://campuspoint.in/jee-preparation"
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

  const keywords = SEO_KEYWORD_MAP["/jee-preparation"].targetKeywords;

  return (
    <div className="seo-cluster-page">
      <Seo
        title="JEE Preparation Hub | Study Plans, Backlogs & Strategy Guides"
        description="The ultimate JEE preparation hub. Access proven daily study plans, scientific backlog recovery systems, subject tactical guides, and 1-to-1 IITian mentorship."
        path={currentPath}
        keywords={keywords}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "JEE Preparation", path: currentPath }
        ]}
        jsonLd={jsonLd}
      />

      <ClusterNav currentPath={currentPath} />

      <ClusterHero
        badge="THE COMPREHENSIVE JEE PREPARATION HUB"
        title={
          <>
            Master Your <span className="brand-accent">JEE Preparation</span> with Proven Frameworks
          </>
        }
        description="Everything you need to conquer JEE Main and JEE Advanced: structured daily study plans, the 70-30 backlog recovery formula, subject playbooks, and 1-on-1 IITian mentorship."
        stats={[
          { value: "3 Pillars", label: "Study Plan, Backlog, Strategy", color: "brand" },
          { value: "100%", label: "Updated for JEE 2027/28", color: "emerald" },
          { value: "1,000+", label: "Students Guided", color: "violet" },
          { value: "1-on-1", label: "IITian Mentorship Available", color: "brand" }
        ]}
        ctaText="Join Mentorship · ₹3,499"
        ctaLink="/mentorship/jee-2027"
        secondaryText="Browse Preparation Guides"
        secondaryLink="#guides"
      />

      <main className="scp-container" id="details">
        {/* Core Preparation Pillars */}
        <section className="scp-section" id="guides">
          <div className="scp-section-header">
            <span className="scp-kicker">Core Pillars</span>
            <h2 className="scp-h2">Essential JEE Preparation Modules</h2>
            <p className="scp-section-sub">
              Explore our in-depth guides designed to fix every common bottleneck in JEE preparation:
            </p>
          </div>

          <div className="scp-grid-3">
            <div className="scp-card">
              <div className="scp-card-icon brand">
                <Calendar size={22} />
              </div>
              <h3 className="scp-card-h3">1. JEE Study Plan & Timetable</h3>
              <p className="scp-card-p">
                Daily, weekly, and monthly timetable templates with built-in 1-7-21 spaced repetition and deep-work study blocks.
              </p>
              <Link to="/jee-preparation/study-plan" className="scp-btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                View Study Plans <ArrowRight size={16} />
              </Link>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon emerald">
                <AlertTriangle size={22} />
              </div>
              <h3 className="scp-card-h3">2. Backlog Clearance Strategy</h3>
              <p className="scp-card-p">
                The proven 70-30 formula to systematically clear months of pending syllabus without falling behind on ongoing coaching topics.
              </p>
              <Link to="/jee-preparation/backlog" className="scp-btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                Clear Backlogs <ArrowRight size={16} />
              </Link>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon violet">
                <Compass size={22} />
              </div>
              <h3 className="scp-card-h3">3. Master Preparation Strategy</h3>
              <p className="scp-card-p">
                Subject-wise tactical playbooks for Physics, Chemistry, and Mathematics, book recommendations, and 3-pass exam tactics.
              </p>
              <Link to="/jee-preparation/strategy" className="scp-btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                Read Strategy Guide <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Explore Full Topical Cluster */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Topical Cluster Directory</span>
            <h2 className="scp-h2">Explore All JEE Mentorship & Preparation Hubs</h2>
            <p className="scp-section-sub">
              Deep dive into specialized tracks matching your exact grade and preparation goals:
            </p>
          </div>

          <div className="scp-topic-cloud">
            <Link to="/jee-mentorship" className="scp-topic-link">
              <span><strong>JEE Mentorship Hub</strong> — 1-on-1 IITian Guidance</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-mentorship/jee-main" className="scp-topic-link">
              <span><strong>JEE Main Mentorship</strong> — 99%ile Speed & Accuracy</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-mentorship/jee-advanced" className="scp-topic-link">
              <span><strong>JEE Advanced Mentorship</strong> — Multi-Concept IIT Strategy</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-mentorship/droppers" className="scp-topic-link">
              <span><strong>JEE Droppers Mentorship</strong> — 8-Month Recovery Plan</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-mentorship/test-analysis" className="scp-topic-link">
              <span><strong>Mock Test Analysis</strong> — 8-Step Mistake Auditing</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-mentorship/1-to-1" className="scp-topic-link">
              <span><strong>1-on-1 Mentorship</strong> — Private IITian Guidance</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-mentorship/class-11" className="scp-topic-link">
              <span><strong>Class 11 Mentorship</strong> — Foundation Building</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/jee-mentorship/class-12" className="scp-topic-link">
              <span><strong>Class 12 Mentorship</strong> — Boards + JEE Synchronization</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <ClusterCta
          title="Supercharge Your Preparation with an IITian Mentor"
          subtitle="Frameworks are great, but daily personal accountability is what delivers ranks. Get assigned an IIT Roorkee mentor to guide your journey to IIT."
          primaryText="Start Mentorship · ₹3,499"
          primaryLink="/mentorship/jee-2027"
        />

        {/* FAQs */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">FAQ</span>
            <h2 className="scp-h2">Frequently Asked Questions About JEE Preparation</h2>
          </div>
          <ClusterFaq items={faqs} />
        </section>

        {/* Related Topics */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Related Clusters</span>
            <h2 className="scp-h2">Next Recommended Reading</h2>
          </div>
          <ClusterRelated
            currentPath={currentPath}
            selectedPaths={[
              "/jee-mentorship",
              "/jee-preparation/study-plan",
              "/jee-preparation/backlog",
              "/jee-preparation/strategy"
            ]}
          />
        </section>
      </main>
    </div>
  );
}

