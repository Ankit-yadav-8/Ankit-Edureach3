const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Campus Point — Automated JEE Examination, Evaluation & Analytics Platform Masterplan</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @page {
    size: A4 portrait;
    margin: 18mm 14mm 18mm 14mm;
    @bottom-right {
      content: "Page " counter(page);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 8.5pt;
      color: #64748b;
    }
    @bottom-left {
      content: "Campus Point — Confidential Architecture Specification";
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 8.5pt;
      color: #64748b;
    }
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    line-height: 1.55;
    font-size: 9.5pt;
    margin: 0;
    padding: 0;
  }

  /* Cover Page */
  .cover-page {
    page-break-after: always;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px 20px 20px 20px;
    background: linear-gradient(135deg, #091124 0%, #0f172a 50%, #1e3a8a 100%);
    color: #ffffff;
    border-radius: 8px;
  }

  .cover-brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .cover-logo {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #3b82f6, #06b6d4);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 20pt;
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
  }

  .cover-brand-text h2 {
    margin: 0;
    font-size: 18pt;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #ffffff;
  }

  .cover-brand-text p {
    margin: 0;
    font-size: 9pt;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  .cover-title-container {
    margin-top: auto;
    margin-bottom: auto;
  }

  .cover-badge {
    display: inline-block;
    background: rgba(59, 130, 246, 0.2);
    border: 1px solid rgba(59, 130, 246, 0.5);
    color: #93c5fd;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 8.5pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 18px;
  }

  .cover-title-container h1 {
    font-size: 30pt;
    font-weight: 800;
    line-height: 1.15;
    margin: 0 0 16px 0;
    color: #f8fafc;
    letter-spacing: -0.8px;
  }

  .cover-title-container p {
    font-size: 13pt;
    line-height: 1.5;
    color: #cbd5e1;
    max-width: 650px;
    margin: 0;
  }

  .cover-meta {
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    padding-top: 20px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    font-size: 8.5pt;
  }

  .cover-meta-item strong {
    display: block;
    color: #60a5fa;
    text-transform: uppercase;
    font-size: 7.5pt;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  .cover-meta-item span {
    color: #e2e8f0;
    font-weight: 500;
  }

  /* Headings */
  h1, h2, h3, h4 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #0f172a;
    letter-spacing: -0.3px;
    margin-top: 24px;
    margin-bottom: 10px;
  }

  h1 {
    font-size: 16pt;
    font-weight: 800;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 6px;
    margin-top: 32px;
    color: #1e3a8a;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-number {
    background: #1e3a8a;
    color: #ffffff;
    font-size: 9pt;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
    display: inline-block;
  }

  h2 {
    font-size: 12.5pt;
    font-weight: 700;
    color: #1e293b;
    border-left: 3px solid #3b82f6;
    padding-left: 8px;
    margin-top: 20px;
  }

  h3 {
    font-size: 10.5pt;
    font-weight: 600;
    color: #334155;
    margin-top: 16px;
  }

  p {
    margin-top: 0;
    margin-bottom: 10px;
    color: #334155;
  }

  /* Break control */
  .page-break {
    page-break-after: always;
  }

  .avoid-break {
    page-break-inside: avoid;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 16px 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
  }

  th, td {
    padding: 7px 10px;
    text-align: left;
    vertical-align: top;
    border: 1px solid #e2e8f0;
  }

  th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 7.5pt;
    letter-spacing: 0.5px;
  }

  tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  /* Code & Syntax */
  code, pre {
    font-family: 'JetBrains Mono', monospace;
  }

  code {
    background-color: #f1f5f9;
    color: #0f172a;
    padding: 1.5px 4px;
    border-radius: 4px;
    font-size: 8pt;
    border: 1px solid #e2e8f0;
  }

  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 12px 14px;
    border-radius: 6px;
    font-size: 7.5pt;
    line-height: 1.45;
    overflow-x: hidden;
    margin: 10px 0 14px 0;
    page-break-inside: avoid;
    border: 1px solid #1e293b;
    position: relative;
  }

  pre .comment { color: #64748b; font-style: italic; }
  pre .keyword { color: #38bdf8; font-weight: 600; }
  pre .type { color: #818cf8; font-weight: 600; }
  pre .string { color: #34d399; }
  pre .number { color: #fbbf24; }
  pre .func { color: #f472b6; }

  /* Callout & Cards */
  .callout {
    padding: 10px 14px;
    border-radius: 6px;
    margin: 12px 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
    border-left: 4px solid;
  }

  .callout-info {
    background-color: #eff6ff;
    border-left-color: #3b82f6;
    color: #1e40af;
  }

  .callout-warning {
    background-color: #fffbeb;
    border-left-color: #f59e0b;
    color: #92400e;
  }

  .callout-success {
    background-color: #f0fdf4;
    border-left-color: #10b981;
    color: #065f46;
  }

  .callout strong {
    display: block;
    margin-bottom: 3px;
    font-size: 9pt;
  }

  /* Grid Layouts */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    page-break-inside: avoid;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    page-break-inside: avoid;
  }

  .card {
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 12px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  }

  .card-header {
    font-weight: 700;
    font-size: 9pt;
    color: #0f172a;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* Architecture Box Diagram */
  .arch-diagram {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 14px;
    margin: 14px 0;
    page-break-inside: avoid;
    font-size: 8pt;
  }

  .arch-tier {
    background: #ffffff;
    border: 1px solid #94a3b8;
    border-radius: 6px;
    padding: 8px 12px;
    margin-bottom: 8px;
  }

  .arch-tier-title {
    font-weight: 700;
    font-size: 8.5pt;
    color: #1e3a8a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }

  .arch-boxes {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .arch-box {
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 6px 10px;
    flex: 1;
    min-width: 120px;
    text-align: center;
    font-weight: 600;
    color: #334155;
  }

  .arch-box.highlight {
    background: #e0f2fe;
    border-color: #38bdf8;
    color: #0369a1;
  }

  .arch-box.mongo {
    background: #ecfdf5;
    border-color: #34d399;
    color: #065f46;
  }

  .arch-box.sql {
    background: #eff6ff;
    border-color: #60a5fa;
    color: #1d4ed8;
  }

  /* Badges */
  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 12px;
    font-size: 7pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .badge-p0 { background: #fee2e2; color: #b91c1c; border: 1px solid #f87171; }
  .badge-p1 { background: #fef3c7; color: #b45309; border: 1px solid #fbbf24; }
  .badge-p2 { background: #e0f2fe; color: #0369a1; border: 1px solid #38bdf8; }

  /* NTA Palette mock */
  .nta-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    font-weight: 700;
    font-size: 8pt;
    border-radius: 4px;
    color: #ffffff;
    margin-right: 4px;
  }
  .nta-silver { background-color: #cbd5e1; color: #334155; }
  .nta-red { background-color: #ef4444; }
  .nta-green { background-color: #22c55e; }
  .nta-purple { background-color: #8b5cf6; border-radius: 50%; }
  .nta-purple-green { background-color: #8b5cf6; border-radius: 50%; border: 2px solid #22c55e; }

  /* Scorecard Header */
  .scorecard-header {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
    color: #ffffff;
    padding: 14px 18px;
    border-radius: 8px;
    margin-bottom: 12px;
    page-break-inside: avoid;
  }
  .scorecard-title {
    font-size: 11pt;
    font-weight: 800;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    padding-bottom: 6px;
    margin-bottom: 10px;
  }
  .score-stats {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    text-align: center;
  }
  .stat-box {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    padding: 6px 4px;
  }
  .stat-val {
    font-size: 12pt;
    font-weight: 800;
    color: #ffffff;
  }
  .stat-label {
    font-size: 6.5pt;
    text-transform: uppercase;
    color: #94a3b8;
    letter-spacing: 0.5px;
  }

  /* List Styling */
  ul, ol {
    margin-top: 0;
    margin-bottom: 10px;
    padding-left: 20px;
  }
  li {
    margin-bottom: 4px;
    color: #334155;
  }

  /* TOC */
  .toc-container {
    page-break-after: always;
    padding: 10px 0;
  }
  .toc-title {
    font-size: 16pt;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2px solid #3b82f6;
    padding-bottom: 8px;
    margin-bottom: 16px;
  }
  .toc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 24px;
    font-size: 8.5pt;
  }
  .toc-item {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px dotted #cbd5e1;
    padding-bottom: 3px;
    color: #1e293b;
    font-weight: 500;
  }
  .toc-item strong {
    color: #1e3a8a;
    margin-right: 6px;
  }
</style>
</head>
<body>

<!-- ========================================================================= -->
<!-- COVER PAGE -->
<!-- ========================================================================= -->
<div class="cover-page">
  <div class="cover-brand">
    <div class="cover-logo">CP</div>
    <div class="cover-brand-text">
      <h2>Campus Point</h2>
      <p>Enterprise EdTech Architecture Group</p>
    </div>
  </div>

  <div class="cover-title-container">
    <span class="cover-badge">Confidential Technical Blueprint • Ver 1.0</span>
    <h1>Automated JEE Examination, Evaluation & Analytics Platform</h1>
    <p>Comprehensive System Architecture, Relational Schema, Multi-Pattern Evaluation Engine, NTA Interface Specification, and Microsoft Power BI Enterprise Star Schema.</p>
  </div>

  <div class="cover-meta">
    <div class="cover-meta-item">
      <strong>Engineering Leadership</strong>
      <span>Senior Software Architect, DB Engineer, EdTech PM & Data Analyst</span>
    </div>
    <div class="cover-meta-item">
      <strong>Target Platform</strong>
      <span>Campus Point (JEE Main & JEE Advanced Ecosystem)</span>
    </div>
    <div class="cover-meta-item">
      <strong>Architecture Status</strong>
      <span>Production-Ready Masterplan • Oct 2026</span>
    </div>
  </div>
</div>

<!-- ========================================================================= -->
<!-- TABLE OF CONTENTS -->
<!-- ========================================================================= -->
<div class="toc-container">
  <div class="toc-title">Table of Contents & Architecture Index</div>
  <div class="toc-grid">
    <div class="toc-item"><span><strong>01.</strong> Executive Summary</span></div>
    <div class="toc-item"><span><strong>11.</strong> Student Report Design (Deep-Blue)</span></div>
    <div class="toc-item"><span><strong>02.</strong> Recommended Technology Stack</span></div>
    <div class="toc-item"><span><strong>12.</strong> Multi-Persona Dashboards</span></div>
    <div class="toc-item"><span><strong>03.</strong> System Architecture (Mermaid)</span></div>
    <div class="toc-item"><span><strong>13.</strong> REST API Specification</span></div>
    <div class="toc-item"><span><strong>04.</strong> End-to-End Workflow Flowchart</span></div>
    <div class="toc-item"><span><strong>14.</strong> Power BI Star Schema & DAX</span></div>
    <div class="toc-item"><span><strong>05.</strong> MongoDB vs SQL Responsibility</span></div>
    <div class="toc-item"><span><strong>15.</strong> Security, Reliability & Scale</span></div>
    <div class="toc-item"><span><strong>06.</strong> SQL Schema & ER Diagram</span></div>
    <div class="toc-item"><span><strong>16.</strong> Phased Implementation Roadmap</span></div>
    <div class="toc-item"><span><strong>07.</strong> Automated Paper Generation</span></div>
    <div class="toc-item"><span><strong>17.</strong> Testing Strategy & Checklist</span></div>
    <div class="toc-item"><span><strong>08.</strong> NTA-Inspired Exam Interface</span></div>
    <div class="toc-item"><span><strong>18.</strong> Recommended Project Structure</span></div>
    <div class="toc-item"><span><strong>09.</strong> Anti-Cheating & Browser Bounds</span></div>
    <div class="toc-item"><span><strong>19.</strong> Migration & Integration Steps</span></div>
    <div class="toc-item"><span><strong>10.</strong> Evaluation Formulas & Examples</span></div>
    <div class="toc-item"><span><strong>20.</strong> Prioritized Implementation Tasks</span></div>
  </div>
  <div style="margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 8pt; color: #64748b;">
    <strong>Design Paradigm:</strong> Zero regression on existing MongoDB users, enrolments, and CP-IDs. Transitioning from unstructured PDF test parsing to an ACID-compliant, bilingual, automated JEE testing and business analytics platform.
  </div>
</div>

<!-- ========================================================================= -->
<!-- SECTION 1: EXECUTIVE SUMMARY -->
<!-- ========================================================================= -->
<h1><span class="section-number">01</span> Executive Summary</h1>

<p>Campus Point currently powers college cutoffs, counselling predictors, and mentorship workflows using a Node.js/Express and MongoDB backend (<code>Ankit-Edureach3</code>). The existing test module relies on parsing static test and answer-key PDFs directly into MongoDB collections (<code>Test.js</code> and <code>TestAttempt.js</code>). While adequate for initial prototypes, this design cannot support dynamic paper generation from a verified question bank, complex JEE Advanced partial-marking matrices, millisecond-accurate timing telemetry, or high-performance enterprise analytics.</p>

<p>This masterplan designs a production-grade <strong>Dual-Database Architecture</strong>:</p>
<ul>
  <li><strong>MongoDB (Existing Platform Backbone):</strong> Continues to serve as the system of record for student authentication (<code>User.js</code> with <code>tokenVersion</code>), Razorpay purchases, mentorship enrolments (<code>Enrollment.js</code> generating <code>CP-YYYY-XXXXX</code>), mentor identity (<code>Mentor.js</code>), and daily study logs.</li>
  <li><strong>PostgreSQL 16+ (Dedicated Assessment Engine):</strong> Introduces an ACID-compliant relational data store for academic taxonomies (Subjects, Chapters, Topics), question bank versioning, bilingual translations (Hindi/English with LaTeX equations), test blueprints, student exam attempts, question visit events, and evaluation metrics.</li>
  <li><strong>Redis & BullMQ (Real-Time Buffer & Worker Queue):</strong> Manages server-authoritative timers, transient high-frequency autosave ingestion, and asynchronous background grading/email dispatch.</li>
  <li><strong>Microsoft Power BI (Executive & Academic BI):</strong> Directly queries a dedicated PostgreSQL Read Replica modeled in an optimized Star Schema (Fact and Dimension views), delivering actionable insights without degrading transactional exam performance.</li>
</ul>

<div class="callout callout-info avoid-break">
  <strong>Guiding Architectural Principle</strong>
  Zero disruption to existing users, authentication flows, or CP-ID sequences. MongoDB remains unaffected for core platform services, while the examination system operates with strict transactional integrity and analytical depth.
</div>

<!-- ========================================================================= -->
<!-- SECTION 2: RECOMMENDED TECHNOLOGY STACK -->
<!-- ========================================================================= -->
<h1><span class="section-number">02</span> Recommended Technology Stack with Technical Rationale</h1>

<p>A rigorous evaluation was conducted between PostgreSQL 16 and MySQL 8.0 for the dedicated examination database. PostgreSQL is recommended decisively for the following technical reasons:</p>

<table>
  <thead>
    <tr>
      <th style="width: 20%;">Criteria</th>
      <th style="width: 40%;">PostgreSQL 16+ (Recommended)</th>
      <th style="width: 40%;">MySQL 8.0</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Complex JEE Marking</strong></td>
      <td><strong>Superior:</strong> Native <code>JSONB</code> with expression indexing allows storing variable section rules, partial marking maps, and bilingual option arrays with direct indexing.</td>
      <td>Basic JSON support without comparable indexing power; requires rigid schemas or slower unindexed queries.</td>
    </tr>
    <tr>
      <td><strong>Cohort Analytics</strong></td>
      <td><strong>Built-in:</strong> Advanced window functions (<code>DENSE_RANK()</code>, <code>PERCENT_RANK()</code>, <code>CUME_DIST()</code>) compute batch percentiles natively in SQL.</td>
      <td>Window functions available but historically slower on large datasets; lacks specialized percentile aggregates.</td>
    </tr>
    <tr>
      <td><strong>High-Volume Partitioning</strong></td>
      <td>Declarative table partitioning by range or hash on <code>student_responses</code> and <code>timing_events</code> prevents B-Tree index bloat.</td>
      <td>Partitioning is restrictive with foreign keys and requires rigid primary key compositions.</td>
    </tr>
    <tr>
      <td><strong>Locking & Concurrency</strong></td>
      <td>Supports <code>SELECT ... FOR UPDATE SKIP LOCKED</code>, allowing lock-free background queue consumption and zero race conditions during paper generation.</td>
      <td>Supports skip-locked but exhibits more frequent metadata lock contention during high concurrency.</td>
    </tr>
  </tbody>
</table>

<div class="grid-2 avoid-break">
  <div class="card">
    <div class="card-header">⚡ In-Memory Cache: Redis 7.0+</div>
    <p style="font-size: 8pt; margin: 0;">Enforces server-authoritative countdowns (independent of student device clocks), buffers rapid autosave beacons to prevent database write bottlenecks, and manages distributed locks to prevent double submissions.</p>
  </div>
  <div class="card">
    <div class="card-header">📐 Equation Rendering: KaTeX</div>
    <p style="font-size: 8pt; margin: 0;">Renders complex mathematical and scientific equations up to 100x faster than MathJax, with zero layout shift on mobile viewports and seamless offline rehydration.</p>
  </div>
</div>

<!-- ========================================================================= -->
<!-- SECTION 3: SYSTEM ARCHITECTURE DIAGRAM -->
<!-- ========================================================================= -->
<h1><span class="section-number">03</span> System Architecture Overview</h1>

<div class="arch-diagram avoid-break">
  <div class="arch-tier">
    <div class="arch-tier-title">1. Presentation Tier (Responsive Web & Mobile CBT)</div>
    <div class="arch-boxes">
      <div class="arch-box highlight">Student CBT (NTA Mode)</div>
      <div class="arch-box highlight">Mentor Test Builder</div>
      <div class="arch-box highlight">Admin Control Console</div>
      <div class="arch-box highlight">Parent Report View</div>
      <div class="arch-box highlight">Power BI Dashboards</div>
    </div>
  </div>

  <div class="arch-tier">
    <div class="arch-tier-title">2. API Gateway & Security Firewall</div>
    <div class="arch-boxes">
      <div class="arch-box">Nginx / Cloudflare (SSL, Rate Limiting)</div>
      <div class="arch-box">Auth & CP-ID Middleware (JWT Guard)</div>
      <div class="arch-box">Integrity Monitor (Focus Loss Trap)</div>
    </div>
  </div>

  <div class="arch-tier">
    <div class="arch-tier-title">3. Application Services & Asynchronous Workers (Node.js)</div>
    <div class="arch-boxes">
      <div class="arch-box">Test Generator Solver</div>
      <div class="arch-box">Exam Session Manager</div>
      <div class="arch-box">Evaluation Worker (BullMQ)</div>
      <div class="arch-box">Email Dispatcher (BullMQ)</div>
    </div>
  </div>

  <div class="arch-tier">
    <div class="arch-tier-title">4. Dual Storage & Analytics Tier</div>
    <div class="arch-boxes">
      <div class="arch-box mongo">MongoDB (Users, Enrolments, Mentors)</div>
      <div class="arch-box highlight">Redis (Timers, Autosave Buffer)</div>
      <div class="arch-box sql">PostgreSQL Primary (OLTP Exam Engine)</div>
      <div class="arch-box sql">PostgreSQL Replica (Star Schema BI)</div>
    </div>
  </div>
</div>

<!-- ========================================================================= -->
<!-- SECTION 4: END-TO-END WORKFLOW -->
<!-- ========================================================================= -->
<h1><span class="section-number">04</span> End-to-End Operational Workflow</h1>

<p>The system automates the lifecycle of an examination across mentors, students, parents, and administrative leadership:</p>

<div class="grid-2 avoid-break">
  <div class="card">
    <div class="card-header">Step 1: Test Blueprint & Generation</div>
    <p style="font-size: 8pt; margin: 0;">Mentors configure exam pattern (JEE Main or Advanced), duration, chapter weightages, and difficulty ratios (e.g. 30% Easy, 50% Medium, 20% Hard). The stratified solver generates an immutable paper snapshot from the verified question bank.</p>
  </div>
  <div class="card">
    <div class="card-header">Step 2: Publishing & Batch Assignment</div>
    <p style="font-size: 8pt; margin: 0;">The mentor reviews the paper blueprint. Upon approval, the paper is assigned to targeted batches (e.g. <code>mentor-jee-2027</code>). Scheduled start and cutoff times are published to student dashboards.</p>
  </div>
  <div class="card">
    <div class="card-header">Step 3: Secure CBT Exam Attempt</div>
    <p style="font-size: 8pt; margin: 0;">Students log in with CP-ID. The server issues a cryptographic exam token and sets an authoritative countdown. Every answer switch and timestamp is buffered in Redis and mirrored in the browser's IndexedDB.</p>
  </div>
  <div class="card">
    <div class="card-header">Step 4: Automated Grading & Diagnostics</div>
    <p style="font-size: 8pt; margin: 0;">Upon submission or timer expiry, BullMQ workers grade answers against the immutable paper key. The engine calculates positive marks, negative marks, net scores, chapter accuracy, and flags weak topics.</p>
  </div>
</div>

<div class="card avoid-break" style="margin-top: 10px;">
  <div class="card-header">Step 5: Automated Multichannel Delivery & BI Ingestion</div>
  <p style="font-size: 8pt; margin: 0;">1. Results are saved in PostgreSQL.<br>2. Summary scores are mirrored to the student's MongoDB study log.<br>3. Transactional emails with secure links are dispatched to student and parent inboxes.<br>4. Replicated data feeds Power BI Star Schema views for mentor, batch, and organizational reporting.</p>
</div>

<!-- ========================================================================= -->
<!-- SECTION 5: MONGODB VS SQL RESPONSIBILITY MATRIX -->
<!-- ========================================================================= -->
<div class="page-break"></div>
<h1><span class="section-number">05</span> MongoDB versus SQL Responsibility Matrix</h1>

<table>
  <thead>
    <tr>
      <th style="width: 22%;">Domain Entity</th>
      <th style="width: 32%;">MongoDB Responsibility</th>
      <th style="width: 32%;">PostgreSQL Responsibility</th>
      <th style="width: 14%;">Sync Mechanism</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Identity & Authentication</strong></td>
      <td><strong>Primary Owner:</strong> <code>User.js</code> stores names, emails, phone numbers, password hashes, and <code>tokenVersion</code>.</td>
      <td>Read-only external reference: <code>student_cp_id VARCHAR(32)</code>. Zero authentication logic in SQL.</td>
      <td>JWT claims pass <code>cpId</code> into SQL queries.</td>
    </tr>
    <tr>
      <td><strong>Enrolments & Batches</strong></td>
      <td><strong>Primary Owner:</strong> <code>Enrollment.js</code> assigns CP-IDs (<code>CP-2026-00042</code>), handles Razorpay payments, and manages plans.</td>
      <td>Maintains <code>students_sync</code> table mirroring active student CP-IDs, batch IDs, and parent emails.</td>
      <td>Post-save hook on MongoDB <code>Enrollment</code> executes upsert in SQL.</td>
    </tr>
    <tr>
      <td><strong>Question Bank</strong></td>
      <td>Deprecated legacy PDF parser. Unstructured questions migrated to SQL.</td>
      <td><strong>Primary Owner:</strong> Subjects, chapters, topics, bilingual LaTeX statements, options, assets, verification.</td>
      <td>One-time migration script.</td>
    </tr>
    <tr>
      <td><strong>Test Configuration</strong></td>
      <td>None.</td>
      <td><strong>Primary Owner:</strong> Blueprints, difficulty quotas, section marking rules, immutable paper snapshots.</td>
      <td>Native SQL.</td>
    </tr>
    <tr>
      <td><strong>Sessions & Timing</strong></td>
      <td>None.</td>
      <td><strong>Primary Owner:</strong> Attempt lifecycles, millisecond-level timing events, focus-loss logs.</td>
      <td>Redis write-behind buffer.</td>
    </tr>
    <tr>
      <td><strong>Results & Scorecards</strong></td>
      <td>Cached summary scorecard in student study log for mentor review.</td>
      <td><strong>Primary Owner:</strong> Detailed question-level responses, partial marks, accuracy, weak-topic flags.</td>
      <td>Async evaluation worker writes to SQL & updates Mongo.</td>
    </tr>
    <tr>
      <td><strong>Power BI Analytics</strong></td>
      <td>None. (Direct BI queries would degrade core web apps).</td>
      <td><strong>Primary Owner:</strong> Star Schema Views (<code>Fact*</code>, <code>Dim*</code>) hosted on PostgreSQL Read Replica.</td>
      <td>On-Premises Data Gateway.</td>
    </tr>
  </tbody>
</table>

<!-- ========================================================================= -->
<!-- SECTION 6: SQL DATABASE SCHEMA & ER DIAGRAM -->
<!-- ========================================================================= -->
<h1><span class="section-number">06</span> SQL Database Schema & ER Design</h1>

<p>The schema enforces strict referential integrity, supports immutable versioning, and partitions high-frequency response tables.</p>

<pre><span class="comment">-- Canonical DDL Highlights: schema.sql</span>
<span class="keyword">CREATE TYPE</span> exam_category_enum <span class="keyword">AS ENUM</span> (<span class="string">'jee_main'</span>, <span class="string">'jee_advanced'</span>, <span class="string">'both'</span>);
<span class="keyword">CREATE TYPE</span> question_type_enum <span class="keyword">AS ENUM</span> (<span class="string">'single_mcq'</span>, <span class="string">'multiple_mcq'</span>, <span class="string">'numerical'</span>);

<span class="keyword">CREATE TABLE</span> questions (
    question_id <span class="type">UUID PRIMARY KEY DEFAULT</span> gen_random_uuid(),
    exam_category exam_category_enum <span class="keyword">NOT NULL DEFAULT</span> <span class="string">'both'</span>,
    subject_id <span class="type">SMALLINT REFERENCES</span> subjects(subject_id),
    chapter_id <span class="type">INT REFERENCES</span> chapters(chapter_id),
    topic_id <span class="type">INT REFERENCES</span> topics(topic_id),
    question_type question_type_enum <span class="keyword">NOT NULL</span>,
    difficulty <span class="type">VARCHAR(16) NOT NULL</span>, <span class="comment">-- 'easy', 'medium', 'hard'</span>
    numerical_correct_value <span class="type">NUMERIC(12, 4)</span>,
    numerical_tolerance <span class="type">NUMERIC(8, 4) DEFAULT</span> 0.0000,
    partial_marking_rules <span class="type">JSONB DEFAULT NULL</span>,
    verification_status <span class="type">VARCHAR(16) DEFAULT</span> <span class="string">'verified'</span>,
    current_version <span class="type">INT NOT NULL DEFAULT</span> 1
);

<span class="keyword">CREATE TABLE</span> question_translations (
    translation_id <span class="type">SERIAL PRIMARY KEY</span>,
    question_id <span class="type">UUID REFERENCES</span> questions(question_id) <span class="keyword">ON DELETE CASCADE</span>,
    language_code <span class="type">VARCHAR(5) NOT NULL</span>, <span class="comment">-- 'en', 'hi'</span>
    statement_latex <span class="type">TEXT NOT NULL</span>,
    solution_latex <span class="type">TEXT</span>,
    <span class="keyword">UNIQUE</span>(question_id, language_code)
);

<span class="keyword">CREATE TABLE</span> exam_attempts (
    attempt_id <span class="type">UUID PRIMARY KEY DEFAULT</span> gen_random_uuid(),
    paper_id <span class="type">UUID REFERENCES</span> test_papers(paper_id),
    student_cp_id <span class="type">VARCHAR(32) NOT NULL REFERENCES</span> students_sync(student_cp_id),
    status <span class="type">VARCHAR(24) DEFAULT</span> <span class="string">'in_progress'</span>,
    started_at <span class="type">TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP</span>,
    server_deadline <span class="type">TIMESTAMPTZ NOT NULL</span>,
    focus_loss_count <span class="type">SMALLINT DEFAULT</span> 0,
    <span class="keyword">UNIQUE</span>(paper_id, student_cp_id)
);

<span class="keyword">CREATE TABLE</span> student_responses (
    response_id <span class="type">BIGSERIAL</span>,
    attempt_id <span class="type">UUID REFERENCES</span> exam_attempts(attempt_id) <span class="keyword">ON DELETE CASCADE</span>,
    paper_question_id <span class="type">INT NOT NULL</span>,
    selected_option_keys <span class="type">CHAR(1)[]</span>,
    numerical_response <span class="type">NUMERIC(12, 4)</span>,
    status <span class="type">VARCHAR(24) DEFAULT</span> <span class="string">'unanswered'</span>,
    time_spent_seconds <span class="type">INT DEFAULT</span> 0,
    <span class="keyword">PRIMARY KEY</span> (response_id, attempt_id)
) <span class="keyword">PARTITION BY HASH</span> (attempt_id);

<span class="keyword">CREATE TABLE</span> student_responses_p0 <span class="keyword">PARTITION OF</span> student_responses <span class="keyword">FOR VALUES WITH</span> (<span class="keyword">MODULUS</span> 4, <span class="keyword">REMAINDER</span> 0);
<span class="keyword">CREATE TABLE</span> student_responses_p1 <span class="keyword">PARTITION OF</span> student_responses <span class="keyword">FOR VALUES WITH</span> (<span class="keyword">MODULUS</span> 4, <span class="keyword">REMAINDER</span> 1);
<span class="keyword">CREATE TABLE</span> student_responses_p2 <span class="keyword">PARTITION OF</span> student_responses <span class="keyword">FOR VALUES WITH</span> (<span class="keyword">MODULUS</span> 4, <span class="keyword">REMAINDER</span> 2);
<span class="keyword">CREATE TABLE</span> student_responses_p3 <span class="keyword">PARTITION OF</span> student_responses <span class="keyword">FOR VALUES WITH</span> (<span class="keyword">MODULUS</span> 4, <span class="keyword">REMAINDER</span> 3);</pre>

<!-- ========================================================================= -->
<!-- SECTION 7: AUTOMATED PAPER GENERATION ALGORITHM -->
<!-- ========================================================================= -->
<div class="page-break"></div>
<h1><span class="section-number">07</span> Automated Paper Generation Algorithm</h1>

<p>The paper generator implements a <strong>Multi-Constraint Stratified Sampling Solver</strong>. It guarantees exact question counts, enforces target difficulty ratios, and minimizes repeating recently exposed questions to the same student cohort.</p>

<pre><span class="comment"># Python Pseudocode: Stratified Paper Generator</span>
<span class="keyword">def</span> <span class="func">generate_balanced_paper</span>(blueprint_id, target_batch_id):
    blueprint = db.get_blueprint(blueprint_id)
    rules = db.get_rules(blueprint_id)
    
    <span class="comment"># 1. Target difficulty counts</span>
    target_easy = round(blueprint.total_q * (blueprint.pct_easy / 100))
    target_med  = round(blueprint.total_q * (blueprint.pct_med / 100))
    target_hard = blueprint.total_q - target_easy - target_med
    quota = {<span class="string">"easy"</span>: target_easy, <span class="string">"medium"</span>: target_med, <span class="string">"hard"</span>: target_hard}

    <span class="comment"># 2. Exclude questions seen by this batch in the past 60 days</span>
    exposed_ids = db.get_recently_attempted_qids(target_batch_id, days=60)
    selected_questions = []

    <span class="keyword">for</span> rule <span class="keyword">in</span> rules:
        candidates = db.query_verified_questions(
            subject=rule.subject_id, chapter=rule.chapter_id,
            category=blueprint.category, types=rule.allowed_types
        )
        
        <span class="keyword">if</span> len(candidates) &lt; rule.required_count:
            <span class="keyword">raise</span> InsufficientQuestionsException(f<span class="string">"Shortage in Chapter {rule.chapter_id}"</span>)

        <span class="comment"># Ranking function: Prioritize unexposed + deficit difficulty matching</span>
        <span class="keyword">def</span> <span class="func">score</span>(q):
            unexposed_bonus = 100 <span class="keyword">if</span> q.id <span class="keyword">not in</span> exposed_ids <span class="keyword">else</span> 0
            difficulty_deficit = quota[q.difficulty] * 10
            <span class="keyword">return</span> unexposed_bonus + difficulty_deficit + random.random()

        candidates.sort(key=score, reverse=True)
        chosen = candidates[:rule.required_count]
        
        <span class="keyword">for</span> q <span class="keyword">in</span> chosen:
            quota[q.difficulty] -= 1
            selected_questions.append(q)

    <span class="keyword">with</span> db.transaction():
        paper_id = db.create_immutable_paper_snapshot(blueprint, selected_questions)
    <span class="keyword">return</span> paper_id</pre>

<!-- ========================================================================= -->
<!-- SECTION 8: NTA-INSPIRED EXAM INTERFACE -->
<!-- ========================================================================= -->
<h1><span class="section-number">08</span> NTA-Inspired Examination Interface</h1>

<p>The CBT interface recreates the authentic testing ergonomics of official computer-based examinations, providing clear focus, rapid navigation, and accessible visual indicators.</p>

<div class="card avoid-break">
  <div class="card-header">NTA Standard 5-State Question Palette</div>
  <table style="margin: 4px 0 0 0;">
    <thead>
      <tr>
        <th style="width: 25%;">Palette State</th>
        <th style="width: 20%;">Visual Indicator</th>
        <th style="width: 55%;">Behavioral Definition</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Not Visited</strong></td>
        <td><span class="nta-badge nta-silver">01</span> Silver Gray</td>
        <td>Question has not been opened or viewed yet during this attempt.</td>
      </tr>
      <tr>
        <td><strong>Not Answered</strong></td>
        <td><span class="nta-badge nta-red">02</span> Bold Red</td>
        <td>Question was viewed, but student navigated away without choosing an option.</td>
      </tr>
      <tr>
        <td><strong>Answered</strong></td>
        <td><span class="nta-badge nta-green">03</span> Forest Green</td>
        <td>Question has a saved response; counted towards evaluation.</td>
      </tr>
      <tr>
        <td><strong>Marked for Review</strong></td>
        <td><span class="nta-badge nta-purple">04</span> Violet Circle</td>
        <td>Student flagged question for later reconsideration; no answer selected.</td>
      </tr>
      <tr>
        <td><strong>Ans & Marked Review</strong></td>
        <td><span class="nta-badge nta-purple-green">05</span> Violet + Green</td>
        <td>Question answered AND flagged for review. <em>Evaluated in final scoring.</em></td>
      </tr>
    </tbody>
  </table>
</div>

<div class="callout callout-success avoid-break">
  <strong>Zero-Data-Loss Autosave Guarantee</strong>
  Every answer selection is written simultaneously to React local state, persisted in the browser's <code>IndexedDB</code>, and flushed via <code>fetch(..., { keepalive: true })</code> to Redis. If a student's browser closes unexpectedly or the network disconnects, reopening the page rehydrates their exact state within 500ms.
</div>

<!-- ========================================================================= -->
<!-- SECTION 9: EXAM INTEGRITY & ANTI-CHEATING DESIGN -->
<!-- ========================================================================= -->
<h1><span class="section-number">09</span> Exam Integrity & Anti-Cheating Architecture</h1>

<p>Campus Point implements a realistic, best-effort browser integrity policy that acknowledges web platform limitations without making false claims of absolute lockdown.</p>

<div class="grid-3 avoid-break">
  <div class="card">
    <div class="card-header" style="color: #0284c7;">1st Focus Loss</div>
    <p style="font-size: 8pt; margin: 0;"><strong>Mild Warning:</strong> The exam freezes, enters full-screen overlay, and alerts the student: <em>"Warning 1/2: Navigation away from the test window is logged."</em> Student must click to acknowledge.</p>
  </div>
  <div class="card">
    <div class="card-header" style="color: #d97706;">2nd Focus Loss</div>
    <p style="font-size: 8pt; margin: 0;"><strong>Severe Warning:</strong> Amber alert: <em>"Final Warning 2/2: The next focus loss event will terminate your exam immediately."</em></p>
  </div>
  <div class="card">
    <div class="card-header" style="color: #dc2626;">3rd Focus Loss</div>
    <p style="font-size: 8pt; margin: 0;"><strong>Auto-Submission:</strong> Exam locks immediately. Status set to <code>terminated_malpractice</code>. All previously saved responses are graded as-is.</p>
  </div>
</div>

<div class="callout callout-warning avoid-break">
  <strong>Honest Technical Limitation Disclaimer</strong>
  Standard web browsers cannot prevent a student from using an adjacent phone or secondary machine. If ironclad lockdown is required, a dedicated Safe Exam Browser (SEB) with OS-level virtualization controls must be introduced in a future phase.
</div>

<!-- ========================================================================= -->
<!-- SECTION 10: EVALUATION FORMULAS & WORKED EXAMPLES -->
<!-- ========================================================================= -->
<div class="page-break"></div>
<h1><span class="section-number">10</span> Automatic Evaluation Formulas & Worked Examples</h1>

<p>The evaluation engine enforces strict separation between positive marks, negative marks, and net scores across standard JEE Main and variable JEE Advanced schemes:</p>

<div class="card avoid-break">
  <div class="card-header">Core Evaluation Equations</div>
  <p style="font-size: 8.5pt; margin: 0 0 6px 0;">
    $$\text{Positive Marks} = \sum \text{MarksEarned}, \quad \text{Negative Marks} = \sum |\text{Penalties}|, \quad \text{Net Score} = \text{Positive} - \text{Negative}$$
    $$\text{Accuracy \%} = \left(\frac{\text{Correct Answers Count}}{\text{Total Questions Attempted}}\right) \times 100, \quad \text{Percentage Score} = \left(\frac{\text{Net Score}}{\text{Max Marks}}\right) \times 100$$
  </p>
</div>

<h3>Numerical Verification Case Study: JEE Main Full Practice Paper</h3>
<table>
  <thead>
    <tr>
      <th>Subject</th>
      <th>Total Qs</th>
      <th>Attempted</th>
      <th>Correct</th>
      <th>Incorrect</th>
      <th>Unattempted</th>
      <th>Positive</th>
      <th>Negative</th>
      <th>Net Score</th>
      <th>Accuracy</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Physics</strong></td>
      <td>25</td>
      <td>20</td>
      <td>16</td>
      <td>4</td>
      <td>5</td>
      <td>+64.00</td>
      <td>4.00</td>
      <td><strong>+60.00</strong></td>
      <td>80.0%</td>
    </tr>
    <tr>
      <td><strong>Chemistry</strong></td>
      <td>25</td>
      <td>22</td>
      <td>19</td>
      <td>3</td>
      <td>3</td>
      <td>+76.00</td>
      <td>3.00</td>
      <td><strong>+73.00</strong></td>
      <td>86.4%</td>
    </tr>
    <tr>
      <td><strong>Mathematics</strong></td>
      <td>25</td>
      <td>18</td>
      <td>13</td>
      <td>5</td>
      <td>7</td>
      <td>+52.00</td>
      <td>5.00</td>
      <td><strong>+47.00</strong></td>
      <td>72.2%</td>
    </tr>
    <tr style="background-color: #f1f5f9; font-weight: 700;">
      <td>Overall Total</td>
      <td>75</td>
      <td>60</td>
      <td>48</td>
      <td>12</td>
      <td>15</td>
      <td>+192.00</td>
      <td>12.00</td>
      <td>+180.00</td>
      <td>80.0%</td>
    </tr>
  </tbody>
</table>

<!-- ========================================================================= -->
<!-- SECTION 11: STUDENT REPORT DESIGN (DEEP BLUE) -->
<!-- ========================================================================= -->
<h1><span class="section-number">11</span> Student Report Design (Deep-Blue Theme)</h1>

<p>Modeled after the reference screenshots in <code>src/components/mentor/StudentReport.jsx</code>, the report pairs an authoritative deep-blue banner with white diagnostic cards.</p>

<div class="scorecard-header avoid-break">
  <div class="scorecard-title">
    <span>CAMPUS POINT JEE MAIN FULL TEST 04</span>
    <span>CANDIDATE: CP-2026-00042</span>
  </div>
  <div class="score-stats">
    <div class="stat-box">
      <div class="stat-val">180 / 300</div>
      <div class="stat-label">Net Score</div>
    </div>
    <div class="stat-box">
      <div class="stat-val">80.0%</div>
      <div class="stat-label">Accuracy</div>
    </div>
    <div class="stat-box">
      <div class="stat-val">94.2 %tile</div>
      <div class="stat-label">Batch Percentile</div>
    </div>
    <div class="stat-box">
      <div class="stat-val">#08 / 142</div>
      <div class="stat-label">Batch Rank</div>
    </div>
    <div class="stat-box">
      <div class="stat-val">60 / 75</div>
      <div class="stat-label">Questions Attempted</div>
    </div>
  </div>
</div>

<div class="grid-2 avoid-break">
  <div class="card">
    <div class="card-header">Time Efficiency Quadrant</div>
    <ul style="font-size: 8pt; margin: 0; padding-left: 14px;">
      <li><strong>Fast & Correct (Mastered):</strong> 38 Qs (Avg 1.2 min/Q)</li>
      <li><strong>Slow & Correct (Needs Speed):</strong> 10 Qs (Avg 3.8 min/Q)</li>
      <li><strong>Fast & Wrong (Careless Guess):</strong> 7 Qs (Avg 0.9 min/Q) ⚠️</li>
      <li><strong>Slow & Wrong (Concept Gap):</strong> 5 Qs (Avg 4.1 min/Q) ⚠️</li>
    </ul>
  </div>
  <div class="card">
    <div class="card-header">Priority Revision Areas (Diagnostic Flags)</div>
    <ul style="font-size: 8pt; margin: 0; padding-left: 14px;">
      <li><strong>Rotation Dynamics:</strong> 3 Wrong | -15 Marks Lost | Acc: 25%</li>
      <li><strong>Definite Integration:</strong> 2 Wrong | -10 Marks Lost | Acc: 33%</li>
      <li><strong>P-Block Elements:</strong> 2 Wrong | -10 Marks Lost | Acc: 0%</li>
    </ul>
  </div>
</div>

<!-- ========================================================================= -->
<!-- SECTION 12: MULTI-PERSONA DASHBOARDS -->
<!-- ========================================================================= -->
<h1><span class="section-number">12</span> Multi-Persona Dashboards</h1>

<div class="grid-2 avoid-break">
  <div class="card">
    <div class="card-header">Mentor Dashboard</div>
    <p style="font-size: 8pt; margin: 0;">Provides one-click paper blueprint generation, real-time batch attempt tracking, unattempted student alerts, topic-lag heatmaps, and direct task assignment to <code>MentorTask.js</code>.</p>
  </div>
  <div class="card">
    <div class="card-header">Student Dashboard</div>
    <p style="font-size: 8pt; margin: 0;">Displays active/scheduled exams, past performance trend lines, review room with bilingual KaTeX solutions, and personalized revision priority queues.</p>
  </div>
  <div class="card">
    <div class="card-header">Parent Dashboard</div>
    <p style="font-size: 8pt; margin: 0;">Presents jargon-free weekly progress, punctuality scores, net score trends, and clear mentor action items accessible via tokenized magic links.</p>
  </div>
  <div class="card">
    <div class="card-header">Admin Console</div>
    <p style="font-size: 8pt; margin: 0;">Monitors question bank coverage by chapter, mentor test creation velocity, outlier analysis on ambiguous questions, and overall platform uptime.</p>
  </div>
</div>

<!-- ========================================================================= -->
<!-- SECTION 13: REST API SPECIFICATION -->
<!-- ========================================================================= -->
<div class="page-break"></div>
<h1><span class="section-number">13</span> REST API Specification</h1>

<table>
  <thead>
    <tr>
      <th style="width: 10%;">Method</th>
      <th style="width: 32%;">Endpoint</th>
      <th style="width: 18%;">Authorized Roles</th>
      <th style="width: 40%;">Description & Idempotency</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/v2/exam/blueprints</code></td>
      <td>Mentor, Admin</td>
      <td>Create blueprint with chapter weightages and difficulty quotas.</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/v2/exam/blueprints/:id/generate</code></td>
      <td>Mentor, Admin</td>
      <td>Execute stratified solver; return immutable draft paper.</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/v2/exam/papers/:id/publish</code></td>
      <td>Mentor, Admin</td>
      <td>Publish paper and bind to student batch plans.</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/v2/exam/attempts/start</code></td>
      <td>Student</td>
      <td>Initialize exam session, lock authoritative server deadline.</td>
    </tr>
    <tr>
      <td><code>GET</code></td>
      <td><code>/api/v2/exam/attempts/:id/paper</code></td>
      <td>Student</td>
      <td>Fetch questions without answer keys; bilingual LaTeX payloads.</td>
    </tr>
    <tr>
      <td><code>PUT</code></td>
      <td><code>/api/v2/exam/attempts/:id/autosave</code></td>
      <td>Student</td>
      <td>Idempotent batch update of answers and timing telemetry.</td>
    </tr>
    <tr>
      <td><code>POST</code></td>
      <td><code>/api/v2/exam/attempts/:id/submit</code></td>
      <td>Student</td>
      <td>Final submission lock; enqueues BullMQ evaluation worker.</td>
    </tr>
    <tr>
      <td><code>GET</code></td>
      <td><code>/api/v2/exam/results/:attemptId</code></td>
      <td>Student, Mentor</td>
      <td>Retrieve evaluated scorecard, topic breakdown, and solutions.</td>
    </tr>
    <tr>
      <td><code>GET</code></td>
      <td><code>/api/v2/exam/reports/parent</code></td>
      <td>Public (Tokenized)</td>
      <td>Secure, token-authorized parent performance scorecard.</td>
    </tr>
  </tbody>
</table>

<!-- ========================================================================= -->
<!-- SECTION 14: POWER BI ARCHITECTURE & STAR SCHEMA -->
<!-- ========================================================================= -->
<h1><span class="section-number">14</span> Microsoft Power BI Architecture & Star Schema</h1>

<p>Power BI connects to a dedicated PostgreSQL Read Replica via an On-Premises Data Gateway to prevent analytical aggregation queries from impacting active exam autosaves.</p>

<div class="card avoid-break">
  <div class="card-header">Star Schema Architecture</div>
  <p style="font-size: 8pt; margin: 0 0 8px 0;">
    • <strong>Fact Tables:</strong> <code>bi_fact_test_attempts</code> (Grain: 1 row/student attempt), <code>bi_fact_question_responses</code> (Grain: 1 row/question response).<br>
    • <strong>Dimension Tables:</strong> <code>DimStudent</code>, <code>DimBatch</code>, <code>DimMentor</code>, <code>DimTest</code>, <code>DimDate</code>, <code>DimSubject</code>, <code>DimChapter</code>, <code>DimTopic</code>, <code>DimDifficulty</code>.
  </p>
</div>

<pre><span class="comment">-- Essential Power BI DAX Measures</span>
<span class="func">AverageNetScore</span> = <span class="keyword">AVERAGE</span>(bi_fact_test_attempts[net_score])

<span class="func">CohortAccuracyRate</span> = 
<span class="keyword">DIVIDE</span>(
    <span class="keyword">SUM</span>(bi_fact_test_attempts[correct_count]),
    <span class="keyword">SUM</span>(bi_fact_test_attempts[attempted_questions]),
    0
) * 100

<span class="func">QuestionDiscriminationIndex</span> = 
<span class="keyword">VAR</span> Top27Threshold = <span class="keyword">PERCENTILE.INC</span>(bi_fact_test_attempts[net_score], 0.73)
<span class="keyword">VAR</span> Bottom27Threshold = <span class="keyword">PERCENTILE.INC</span>(bi_fact_test_attempts[net_score], 0.27)
<span class="keyword">VAR</span> TopPassRate = <span class="keyword">CALCULATE</span>(<span class="keyword">AVERAGE</span>(bi_fact_question_responses[is_correct]), bi_fact_test_attempts[net_score] &gt;= Top27Threshold)
<span class="keyword">VAR</span> BottomPassRate = <span class="keyword">CALCULATE</span>(<span class="keyword">AVERAGE</span>(bi_fact_question_responses[is_correct]), bi_fact_test_attempts[net_score] &lt;= Bottom27Threshold)
<span class="keyword">RETURN</span> TopPassRate - BottomPassRate</pre>

<!-- ========================================================================= -->
<!-- SECTION 15: SECURITY, RELIABILITY & SCALE -->
<!-- ========================================================================= -->
<h1><span class="section-number">15</span> Security, Reliability & Scalability Plan</h1>

<ul>
  <li><strong>Server-Authoritative Clock:</strong> Client timers are visual mirrors. Deadlines are verified in SQL and cached in Redis. Submissions past deadline are rejected or automatically forced.</li>
  <li><strong>Double-Submission Prevention:</strong> Submissions acquire a Redis distributed lock (<code>redlock:submit:{attemptId}</code>) with an atomic SQL status transition (<code>status = 'in_progress' → 'submitted'</code>).</li>
  <li><strong>Database Protection via Redis Streams:</strong> Autosave requests are acknowledged instantly via Redis streams and flushed asynchronously to PostgreSQL in micro-batches (500 records/flush), supporting up to 10,000 concurrent students.</li>
  <li><strong>Disaster Recovery:</strong> Point-in-time recovery (PITR) with continuous WAL archiving to Cloudflare R2 / AWS S3 every 15 minutes.</li>
</ul>

<!-- ========================================================================= -->
<!-- SECTION 16: PHASED IMPLEMENTATION ROADMAP -->
<!-- ========================================================================= -->
<div class="page-break"></div>
<h1><span class="section-number">16</span> Phased Implementation Roadmap</h1>

<table>
  <thead>
    <tr>
      <th style="width: 12%;">Phase</th>
      <th style="width: 38%;">Target Deliverables</th>
      <th style="width: 15%;">Priority</th>
      <th style="width: 35%;">Key Risk & Mitigation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Phase 1</strong></td>
      <td>PostgreSQL 16 setup, DDL schema execution, MongoDB CP-ID sync bridge.</td>
      <td><span class="badge badge-p0">P0 Required</span></td>
      <td><em>Risk:</em> Data drift between databases.<br><em>Mitigation:</em> Nightly reconciliation cron.</td>
    </tr>
    <tr>
      <td><strong>Phase 2</strong></td>
      <td>Question bank schema, bilingual LaTeX editor, KaTeX pipeline.</td>
      <td><span class="badge badge-p0">P0 Required</span></td>
      <td><em>Risk:</em> LaTeX parsing errors on mobile.<br><em>Mitigation:</em> Strict KaTeX client validation.</td>
    </tr>
    <tr>
      <td><strong>Phase 3</strong></td>
      <td>Mentor Blueprint Builder, Stratified Paper Generation Solver.</td>
      <td><span class="badge badge-p1">P1 Standard</span></td>
      <td><em>Risk:</em> Question deficit in niche topics.<br><em>Mitigation:</em> Fallback constraint relaxation.</td>
    </tr>
    <tr>
      <td><strong>Phase 4</strong></td>
      <td>NTA-mode CBT interface, IndexedDB offline persistence, Focus-loss traps.</td>
      <td><span class="badge badge-p0">P0 Required</span></td>
      <td><em>Risk:</em> Network disconnection during exam.<br><em>Mitigation:</em> Local storage auto-rehydration.</td>
    </tr>
    <tr>
      <td><strong>Phase 5</strong></td>
      <td>Evaluation Engine (JEE Main + Advanced partial marks), Result persistence.</td>
      <td><span class="badge badge-p0">P0 Required</span></td>
      <td><em>Risk:</em> Edge-case partial marking bugs.<br><em>Mitigation:</em> Comprehensive unit test suite.</td>
    </tr>
    <tr>
      <td><strong>Phase 6</strong></td>
      <td>Deep-blue student scorecard, Parent magic link portal, BullMQ emails.</td>
      <td><span class="badge badge-p1">P1 Standard</span></td>
      <td><em>Risk:</em> Mail provider rate limits.<br><em>Mitigation:</em> Rate-limited BullMQ worker queue.</td>
    </tr>
    <tr>
      <td><strong>Phase 7</strong></td>
      <td>Power BI Star Schema Views, Data Gateway, Executive Dashboards.</td>
      <td><span class="badge badge-p2">P2 Analytics</span></td>
      <td><em>Risk:</em> OLAP queries locking OLTP tables.<br><em>Mitigation:</em> Route BI to Read Replica only.</td>
    </tr>
    <tr>
      <td><strong>Phase 8</strong></td>
      <td>K6 load testing (5,000 concurrent attempts), Production cutover.</td>
      <td><span class="badge badge-p0">P0 Required</span></td>
      <td><em>Risk:</em> CPU spike during simultaneous submits.<br><em>Mitigation:</em> PgBouncer connection pooling.</td>
    </tr>
  </tbody>
</table>

<!-- ========================================================================= -->
<!-- SECTION 17: TESTING STRATEGY & PRODUCTION CHECKLIST -->
<!-- ========================================================================= -->
<h1><span class="section-number">17</span> Testing Strategy & Production-Readiness Checklist</h1>

<div class="grid-2 avoid-break">
  <div class="card">
    <div class="card-header">Targeted Automated Test Suites</div>
    <ul style="font-size: 8pt; margin: 0; padding-left: 14px;">
      <li><strong>Paper Generation Accuracy:</strong> Verifies exact difficulty distributions and topic weights across 500 test generations.</li>
      <li><strong>Partial Marking Verification:</strong> Unit tests covering all multi-correct permutations (+4, +3, +2, +1, -2, 0).</li>
      <li><strong>Autosave Reconnection:</strong> Simulates browser kill and tests IndexedDB rehydration under active countdowns.</li>
      <li><strong>Load Testing:</strong> K6 simulation of 5,000 students submitting answers every 15 seconds ($p95 < 120\text{ms}$).</li>
    </ul>
  </div>
  <div class="card">
    <div class="card-header">Production Launch Go/No-Go Checklist</div>
    <ul style="font-size: 8pt; margin: 0; padding-left: 14px;">
      <li>[ ] PostgreSQL 16 connection pooling configured via PgBouncer.</li>
      <li>[ ] MongoDB Enrollment post-save hook successfully syncs CP-IDs.</li>
      <li>[ ] KaTeX equations render with zero layout shift on mobile devices.</li>
      <li>[ ] Server-authoritative countdown forcibly submits expired tests.</li>
      <li>[ ] Focus loss traps trigger warnings at count 1 and 2, auto-submit at 3.</li>
      <li>[ ] Power BI Gateway queries routed strictly to PostgreSQL read replica.</li>
    </ul>
  </div>
</div>

<!-- ========================================================================= -->
<!-- SECTION 18 & 19: PROJECT STRUCTURE & MIGRATION -->
<!-- ========================================================================= -->
<div class="page-break"></div>
<h1><span class="section-number">18 & 19</span> Project Structure & Initial Migration Steps</h1>

<div class="grid-2 avoid-break">
  <div>
    <h2>18. Recommended Project Structure</h2>
    <pre style="font-size: 7.2pt;"><span class="comment">Ankit-Edureach3/</span>
├── server/
│   ├── index.js             <span class="comment"># Server bootstrap</span>
│   ├── db.js                <span class="comment"># Existing MongoDB client</span>
│   ├── sql/
│   │   ├── db.js            <span class="comment"># PostgreSQL pg pool</span>
│   │   └── schema.sql       <span class="comment"># Canonical DDL</span>
│   ├── routes/exam/         <span class="comment"># Exam REST API</span>
│   │   ├── blueprints.js
│   │   ├── attempts.js
│   │   └── results.js
│   ├── services/exam/
│   │   ├── generator.js     <span class="comment"># Paper solver</span>
│   │   └── evaluator.js     <span class="comment"># Grading engine</span>
│   └── workers/
│       └── evalWorker.js    <span class="comment"># BullMQ consumer</span>
└── src/
    └── components/exam/     <span class="comment"># React NTA Interface</span>
        ├── ExamHeader.jsx
        ├── QuestionPalette.jsx
        └── QuestionViewer.jsx</pre>
  </div>
  <div>
    <h2>19. Initial Migration Sequence</h2>
    <ol style="font-size: 8pt; padding-left: 14px;">
      <li><strong>Database Setup:</strong> Provision PostgreSQL 16 and apply <code>schema.sql</code>.</li>
      <li><strong>Sync Hook Deployment:</strong> In <code>server/models/Enrollment.js</code>, register a post-save hook to write active CP-IDs to <code>students_sync</code> in SQL.</li>
      <li><strong>Historical Backfill:</strong> Execute <code>scripts/backfill_students_to_sql.js</code> to populate existing student enrolments into PostgreSQL.</li>
      <li><strong>Taxonomy Seeding:</strong> Seed standard JEE Physics, Chemistry, and Mathematics chapters and topics into PostgreSQL.</li>
      <li><strong>Connection Pool Tuning:</strong> Configure <code>max: 50</code>, <code>idleTimeoutMillis: 30000</code> in <code>server/sql/db.js</code>.</li>
    </ol>
  </div>
</div>

<!-- ========================================================================= -->
<!-- SECTION 20: PRIORITIZED IMPLEMENTATION TASKS -->
<!-- ========================================================================= -->
<h1><span class="section-number">20</span> Prioritized List of Immediate Tasks</h1>

<div class="card avoid-break">
  <table style="margin: 0;">
    <thead>
      <tr>
        <th style="width: 15%;">Timeline</th>
        <th style="width: 35%;">Action Items</th>
        <th style="width: 50%;">Success Criteria</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Week 1</strong></td>
        <td>Deploy PostgreSQL 16, execute <code>schema.sql</code>, configure <code>server/sql/db.js</code>, implement MongoDB-to-SQL sync bridge for CP-IDs.</td>
        <td>Enrolling a student in MongoDB instantly creates an associated row in PostgreSQL <code>students_sync</code>.</td>
      </tr>
      <tr>
        <td><strong>Week 2</strong></td>
        <td>Deploy bilingual question bank CRUD APIs, KaTeX math renderer, and implement <code>generator.js</code> paper generation solver.</td>
        <td>Mentors can create a test blueprint and preview a generated 75-question balanced paper in &lt;1.5 seconds.</td>
      </tr>
      <tr>
        <td><strong>Week 3</strong></td>
        <td>Build React NTA CBT exam interface with 5-state palette, IndexedDB local persistence, and server autosave routes.</td>
        <td>Simulated tab closures and network dropouts restore active student answers with zero data loss.</td>
      </tr>
      <tr>
        <td><strong>Week 4</strong></td>
        <td>Deploy evaluation engine, BullMQ email dispatcher, Deep-Blue student scorecard, and configure Power BI Star Schema views.</td>
        <td>Submitting an exam immediately evaluates scores, updates dashboards, sends parent emails, and updates Power BI views.</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- ========================================================================= -->
<!-- SEPARATION OF CONCERNS BLOCK -->
<!-- ========================================================================= -->
<div class="card avoid-break" style="margin-top: 14px; background: #f8fafc; border-left: 4px solid #1e3a8a;">
  <div class="card-header" style="color: #1e3a8a;">Separation of Concerns: Confirmation & Future Scope</div>
  <div style="font-size: 8pt;">
    <p><strong>Confirmed Core Requirements:</strong> Dual-database architecture (MongoDB + PostgreSQL), CP-ID preservation, JEE Main & Advanced support, bilingual Hindi/English, NTA 5-state palette, focus-loss tracking, deep-blue student reports, Power BI Star Schema.</p>
    <p><strong>Recommended Solutions:</strong> PostgreSQL 16+ over MySQL for native JSONB and window functions; Redis streams for autosave buffering; KaTeX for math rendering; Read Replica for Power BI gateway isolation.</p>
    <p><strong>Assumptions for Confirmation:</strong> PostgreSQL and Redis hosting platform (Managed RDS/Supabase vs Self-hosted VPS); Power BI deployment tier (Pro vs Premium); parent email capture rate.</p>
    <p style="margin-bottom: 0;"><strong>Future Enhancements:</strong> Safe Exam Browser (SEB) desktop integration for proctored examinations; automated question OCR ingestion from PDF archives.</p>
  </div>
</div>

</body>
</html>
`;

const htmlFilePath = path.resolve(__dirname, 'campus_point_masterplan.html');
const pdfFilePath = path.resolve(__dirname, '..', 'Campus_Point_JEE_Examination_Platform_Masterplan.pdf');

fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('HTML written to:', htmlFilePath);

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const command = `"${chromePath}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfFilePath}" "${htmlFilePath}"`;

console.log('Executing Chrome PDF generation...');
execSync(command);

if (fs.existsSync(pdfFilePath)) {
  const stats = fs.statSync(pdfFilePath);
  console.log('SUCCESS! PDF generated at:', pdfFilePath, 'Size:', stats.size, 'bytes');
} else {
  console.error('Failed to generate PDF.');
}
