/* blog.js — College Parichay blog posts. Each post has display metadata for the
   card grid plus a `body` rendered on /blog/:slug. Legacy posts use simple
   { h?, p } blocks; the NEET cluster (generated in neetBlogs.js) uses rich
   { type, ... } blocks. Both are rendered by BlogPost.jsx. */

import { NEET_BLOG_POSTS } from "./neetBlogs.js";

const LEGACY_POSTS = [
  {
    slug: "fill-josaa-choices-without-losing-dream-branch",
    iconName: "ListChecks", accent: "coral", category: "Counselling", badge: "GUIDE", read: "8 min read",
    title: "Fill JoSAA choices without losing your dream branch",
    snippet: "The exact order — Safe, Moderate and Reach — to lock the branch you want without gambling away a seat you deserved.",
    tag: "JoSAA 2026",
    body: [
      { p: "Most students lose a good seat not because of their rank, but because of the order in which they fill their JoSAA choices. The locking algorithm always gives you the highest-preference option you're eligible for — so the order is everything." },
      { h: "Sort by genuine preference, not by safety", p: "List every college-branch combination strictly in the order you'd actually be happy with. Put your dream branch at a top college first, even if it feels out of reach — there is no penalty for an ambitious top choice." },
      { h: "Build the Safe → Moderate → Reach mix", p: "Aim for roughly 30% Reach (closing rank slightly better than yours), 40% Moderate (around your rank) and 30% Safe (clearly within your rank). This guarantees an allotment while still chasing upgrades." },
      { h: "Never leave a gap you'd regret", p: "If you'd take Mechanical at a top NIT over CSE at a new IIIT, that ordering must be reflected in your list. Re-read it once as if you've already been allotted each option — would you be satisfied? If not, reorder." },
    ],
  },
  {
    slug: "branch-vs-college-framework",
    iconName: "GitCompareArrows", accent: "green", category: "Strategy", badge: "FRAMEWORK", read: "6 min read",
    title: "Branch vs College: the framework that actually works",
    snippet: "When the institute and the subject collide on your list, here's how to decide which one should win — backed by outcomes, not opinions.",
    tag: "Decision",
    body: [
      { p: "\"Top college or dream branch?\" is the most stressful question in counselling. The honest answer is: it depends on you — but the decision can be made systematically." },
      { h: "When the college should win", p: "If you're still exploring, value brand and peer group, or want flexibility for higher studies and off-campus roles, the institute's tag and network usually pay off more than a specific branch." },
      { h: "When the branch should win", p: "If you already know the domain you love, care about specific in-demand skills, and are self-driven enough to thrive anywhere, a strong branch at a slightly lesser college often beats a weak branch at a top one." },
      { h: "Use the assessment", p: "Our Branch vs College tool asks six quick questions and shows a live verdict. Treat it as a tie-breaker, not gospel — but it's a great way to surface what you actually weigh most." },
    ],
  },
  {
    slug: "jee-main-percentile-to-rank",
    iconName: "Gauge", accent: "blue", category: "Exams", badge: "EXPLAINER", read: "7 min read",
    title: "JEE Main percentile → rank: how normalisation really works",
    snippet: "Why two students with the same marks in different shifts get different ranks — and what it means for your college predictions.",
    tag: "JEE Main",
    body: [
      { p: "JEE Main runs across multiple shifts and days, and no two papers are identical in difficulty. NTA uses percentile normalisation so that your score reflects how you did relative to your session, not the raw difficulty of your paper." },
      { h: "Percentile, not percentage", p: "Your NTA percentile is the share of candidates in your session who scored at or below you. A 99 percentile means you're in the top 1% — independent of the exact marks." },
      { h: "Percentile → CRL rank", p: "Ranks are computed by merging all sessions on the percentile scale. Because lakhs sit the exam, even a 0.1 percentile drop can move your rank by thousands near the top." },
      { h: "What it means for predictions", p: "Always predict colleges from your expected rank, not raw marks, and keep a ±5% buffer — normalisation and the candidate pool both shift slightly every year." },
    ],
  },
  {
    slug: "ai-proof-engineering-branches",
    iconName: "Brain", accent: "violet", category: "Careers", badge: "INSIGHT", read: "9 min read",
    title: "AI-proof engineering branches for the next decade",
    snippet: "Which branches automation actually threatens, which ones it supercharges, and how to read the AI-risk score before you choose.",
    tag: "Future of work",
    body: [
      { p: "AI is changing engineering work, but \"AI will take all the jobs\" is lazy thinking. The realistic question is which parts of a role get automated and which become more valuable." },
      { h: "What AI automates", p: "Routine, well-defined and high-volume tasks — boilerplate code, standard report generation, repetitive testing. Roles that are mostly this are the most exposed." },
      { h: "What AI amplifies", p: "Judgement, system design, hardware, research, and anything physical or safety-critical. Core branches (mechanical, electrical, civil) and deep-tech (AI/ML, VLSI, robotics) tend to be augmented, not replaced." },
      { h: "Read the AI-risk score", p: "On every branch page we show an indicative AI-replaceability score. Use it as one input — a higher score just means you should lean into the human-judgement parts of that field." },
    ],
  },
  {
    slug: "nit-vs-iiit-vs-gfti",
    iconName: "Building2", accent: "amber", category: "Colleges", badge: "COMPARE", read: "6 min read",
    title: "NIT vs IIIT vs GFTI — which fits your rank?",
    snippet: "A clear-eyed comparison of placements, fees, brand and branch flexibility so you spend your rank where it pays off most.",
    tag: "Colleges",
    body: [
      { p: "After the IITs, JoSAA opens up NITs, IIITs and GFTIs. They're very different beasts, and the right pick depends on your rank, branch priority and budget." },
      { h: "NITs", p: "Strong all-round brand, large alumni networks and balanced placements across core and software. Home-state quota can dramatically improve your options at your state's NIT." },
      { h: "IIITs", p: "Sharply focused on CS/ECE and computing. Top IIITs (Hyderabad, Bangalore) rival IITs for software placements; newer IIITs vary widely — check the specific institute's record." },
      { h: "GFTIs", p: "Government-funded technical institutes offer good value and specific strengths (e.g. niche programs), often at lower closing ranks — a smart way to get a strong branch if brand isn't your top priority." },
    ],
  },
  {
    slug: "float-slide-freeze-explained",
    iconName: "ShieldCheck", accent: "coral", category: "Counselling", badge: "GUIDE", read: "5 min read",
    title: "Float, Slide & Freeze: JoSAA seat acceptance decoded",
    snippet: "The single decision after every round that students misunderstand the most — and the safe default for each situation.",
    tag: "JoSAA",
    body: [
      { p: "After each JoSAA round you must accept your allotted seat with one of three options. Picking wrong can either freeze you out of an upgrade or risk a seat you wanted to keep." },
      { h: "Freeze", p: "You're happy and want no further changes. Your seat is locked and you won't be considered for upgrades in later rounds. Choose this only when you'd be glad to study here." },
      { h: "Float", p: "Accept the current seat but stay in the running for any higher-preference option across all programs. Safest default if you'd take several upgrades." },
      { h: "Slide", p: "Like Float, but you'll only be upgraded within the same institute. Use it when you love the college but want a better branch there." },
    ],
  },
  {
    slug: "read-a-placement-report",
    iconName: "TrendingUp", accent: "green", category: "Careers", badge: "INSIDER", read: "7 min read",
    title: "Read a placement report like an insider",
    snippet: "Median vs average, dispersion, mass recruiters vs dream offers — the numbers that actually tell you what a branch is worth.",
    tag: "Placements",
    body: [
      { p: "Glossy \"highest package\" headlines tell you almost nothing. A handful of metrics, read together, reveal what a branch's placements are really like." },
      { h: "Median over average", p: "One ₹1.5 crore international offer drags the average up for everyone. The median package is what a typical student actually gets — always ask for it." },
      { h: "Placement percentage & dispersion", p: "What share of the batch was placed, and how spread out are the offers? A high placement rate with a tight band beats a flashy average with many unplaced students." },
      { h: "Mass vs dream recruiters", p: "Mass recruiters set the floor; dream/core companies set the ceiling. A healthy branch has both — steady volume plus a real shot at top roles." },
    ],
  },
  {
    slug: "shortlist-20-colleges-in-30-minutes",
    iconName: "Layers", accent: "blue", category: "Strategy", badge: "PLAYBOOK", read: "6 min read",
    title: "Shortlist 20 colleges in 30 minutes",
    snippet: "A rank-aware shortlisting method that turns 800+ colleges into a tight, personalised choice list you can actually act on.",
    tag: "Shortlist",
    body: [
      { p: "Staring at 800+ colleges is paralysing. A simple funnel turns it into a focused, ordered list in half an hour." },
      { h: "Filter hard first", p: "Start with the College Predictor: enter your rank and category, then filter by the 2–3 branches you'd accept. This alone cuts the list by 90%." },
      { h: "Bucket into three tiers", p: "Drop each survivor into Reach, Moderate or Safe based on its closing rank vs yours. Keep roughly 6–8 in each bucket." },
      { h: "Order and save", p: "Within each tier, order by genuine preference, then export. You now have a ready-to-fill JoSAA list you can refine after each round." },
    ],
  },
  {
    slug: "csab-special-rounds",
    iconName: "BookOpen", accent: "amber", category: "Exams", badge: "RESOURCE", read: "10 min read",
    title: "CSAB special rounds — your second shot at an NIT",
    snippet: "Who should register, how vacancies open up, and the rank movements that make CSAB worth the wait after JoSAA.",
    tag: "CSAB 2026",
    body: [
      { p: "When JoSAA ends, seats left vacant in NITs, IIITs and GFTIs are filled through CSAB special rounds. For many students it's a genuine second chance at a better seat." },
      { h: "Who should register", p: "Anyone without a seat, or with a seat they'd happily upgrade. Registration is separate from JoSAA — don't assume you're automatically in." },
      { h: "How vacancies appear", p: "As allotted students don't report or withdraw, fresh vacancies open round by round. Closing ranks can relax meaningfully compared to JoSAA's final round." },
      { h: "Weigh the risk", p: "Float in CSAB and you may have to give up your JoSAA seat to participate — read the current year's business rules carefully before committing." },
    ],
  },
];

/* NEET cluster first (freshest / highest-intent), then the legacy JEE posts. */
export const BLOG_POSTS = [...NEET_BLOG_POSTS, ...LEGACY_POSTS];

export const getBlogPost = (slug) => BLOG_POSTS.find((p) => p.slug === slug);
