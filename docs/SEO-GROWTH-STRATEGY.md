# CollegeParichay — SEO & Digital Growth Strategy

> Domain: **https://collegeparichay.in** · Brand: **CollegeParichay** (alt: "College Parichay")
> Positioning: *An IIT Roorkee alumni startup — free JEE/JoSAA/CSAB counselling, rank prediction & college discovery.*
> White-hat only. Last updated: 2026-06-14.

---

## 0. The #1 problem to fix first: brand-entity confusion

Searching "college parichay" today mixes you with: college **"Parichay" orientation fests**, the Hindi word *parichay*, and a stale **`.com`** listing on LinkedIn. Google can't see one clean entity. Everything below feeds Google a single, consistent identity. **Do these 3 off-site fixes before anything else — they are higher impact than any on-page tweak:**

1. **LinkedIn company page** → Website = `collegeparichay.in`; About = the positioning line above (remove "New Generation college review website"); logo = the CP mark (not Innovatech).
2. **Google Search Console** → submit sitemap, URL-Inspect the homepage + each feature page → **Request Indexing**.
3. **Vercel dashboard** → set apex `collegeparichay.in` as the **Primary** domain (so `www` 301-redirects to apex). Today apex 307-redirects to www, splitting the entity. Do NOT add the redirect in `vercel.json` (it caused an outage before).

**Consistency rule (NAP):** every profile must use the *exact* same name "College Parichay", URL `collegeparichay.in`, logo, and one-line description. Inconsistency is the single biggest reason Google won't build your knowledge panel.

---

## 1. Website SEO

### 6–12 month roadmap
| Phase | Window | Focus |
|---|---|---|
| 1 — Foundation | Month 1 | Fix brand entity (section 0), Search Console, consistent NAP, real stats numbers, replace placeholder college data with official figures |
| 2 — Content engine | Months 2–4 | Publish 2 blogs/week (counselling + college pages), per-page meta below, internal linking |
| 3 — Authority | Months 4–8 | Backlinks (section 9), YouTube + LinkedIn cadence, get covered as "IIT startup" |
| 4 — Dominate | Months 8–12 | Scale winning content, target featured snippets, knowledge panel claim |

### Keyword targets (high-intent, winnable for a new site)
Go after **long-tail counselling keywords** first — big sites under-serve these and they convert:
- "josaa choice filling order for [branch]", "csab special round cutoff 2026", "jee main rank from percentile [score]"
- "iit [name] [branch] average package 2025", "nit vs iiit for cse", "home state quota nit benefit"
- "jee advanced marks vs rank 2026", "josaa 2026 schedule", "how many rounds in josaa"
- Brand: "collegeparichay", "college parichay jee", "college parichay rank predictor"

Avoid head terms ("jee college predictor") early — owned by Careers360/Collegedunia. Win the specific questions, then climb.

### Per-page on-page SEO
Pattern: **Title ≤ 60 chars, Meta ≤ 155 chars, one H1, descriptive H2s, FAQ block with FAQPage schema.** Current `Seo.jsx` already handles this per route — fill gaps for any new page.

| Page | H1 | Title tag |
|---|---|---|
| Home | Know Your Rank. Find Your College. | CollegeParichay — JEE Rank Predictor & IIT NIT IIIT Reviews \| IIT Roorkee Alumni |
| About | About CollegeParichay — Built by IIT Roorkee Alumni | About CollegeParichay — An IIT Roorkee Startup |
| Contact | Contact CollegeParichay | Contact CollegeParichay — Counselling Help & Support |
| College Predictor (`/jee-main`,`/jee-advanced`) | JEE Main/Advanced Rank Predictor | JEE Main Rank Predictor — Percentile to Rank & College Predictor |
| JoSAA Guide (`/josaa-2026`) | JoSAA 2026 Counselling Guide | JoSAA 2026 Counselling — Schedule, Choice Filling & Cutoffs |
| CSAB Guide (new) | CSAB 2026 Special Round Guide | CSAB 2026 — Special Round Process, Dates & Vacant Seats |
| College Reviews (`/colleges`,`/colleges/:slug`) | [College] — Cutoffs, Reviews & Placements | IIT Bombay — Cutoffs, Placements & Student Reviews 2026 |
| Branch Comparison (`/compare`) | Compare Branches & Colleges | CSE vs ECE vs Mech — Branch Comparison by Placements |
| Cut-off Analysis (`/cutoffs`) | JoSAA Cutoffs 2018–2025 | JoSAA Cutoffs 2018–2025 — IIT NIT IIIT Opening & Closing Ranks |
| Mentorship (`/mentorship`) | 1-on-1 JEE & NEET Mentorship | JEE & NEET Mentorship by IITians — 1-on-1 Guidance |
| Blogs | CollegeParichay Blog | JEE & JoSAA Counselling Blog — Tips by IIT Roorkee Alumni |
| Testimonials | What Students Say | CollegeParichay Reviews — Real Student Testimonials |
| FAQ | Frequently Asked Questions | CollegeParichay FAQ — JEE Rank, JoSAA & Counselling |
| Privacy / Terms | Privacy Policy / Terms | (robots: index, follow — keep thin but present) |

> **Fix the stat inconsistency:** the site shows "2.4L+ students", "50K+ students", and the prompt says "3,200+". Pick ONE true number and use it everywhere. Inflated/contradictory stats hurt trust and risk a review-snippet penalty.

---

## 2. Google visibility & branding (show all profiles for "CollegeParichay")

Google shows your official profiles under a brand search when it can link them to one entity. The mechanism:

- **`sameAs` in Organization schema** (already in `index.html`) lists LinkedIn, Instagram, YouTube — **add Facebook, X, WhatsApp/Telegram once created.** This is the strongest on-site signal.
- **Each profile links back** to `collegeparichay.in` and uses the identical name/logo.
- **Knowledge panel**: build the entity (consistent NAP + a few authoritative mentions), then at search time use **"Claim this knowledge panel"** to verify ownership and control links.
- **Google Business Profile**: create one for "College Parichay" (category: Educational consultant) with website + logo — this often surfaces the brand box on the right.

Checklist for "every profile appears": Website ✓, LinkedIn, YouTube, Instagram, Facebook, X, GitHub (optional, dev brand), GBP — each created, named identically, linking to site, and added to `sameAs`.

---

## 3. Social media SEO

Universal: **username `collegeparichay` everywhere**; bio = positioning line + `collegeparichay.in`; same logo; pinned post linking to the rank predictor.

| Platform | Handle | Bio / description | Cadence |
|---|---|---|---|
| LinkedIn | /company/college-parichay | "Free JEE/JoSAA counselling & rank prediction. An IIT Roorkee startup." | 3–5/week |
| YouTube | @CollegeParichay | Keyword-rich channel desc (section 4) | 1–2/week |
| Instagram | @collegeparichay | "JEE rank → dream college. Built by IITians 🎓 collegeparichay.in" | 4–7/week (Reels) |
| Facebook | /collegeparichay | Same as LinkedIn | 3/week |
| X (Twitter) | @CollegeParichay | Same + result-day live updates | daily in season |
| WhatsApp Channel | College Parichay | Counselling alerts & deadlines | as needed |
| Telegram | @collegeparichay | Cutoff PDFs, choice-list discussions | as needed |

**Cross-linking:** every bio links to the site; site footer links to every profile (done); pin a "follow us" post; put the WhatsApp/Telegram link on the homepage and in blog CTAs.

**Hashtags (IG/X):** #JEE2026 #JoSAA #CSAB #JEEMains #JEEAdvanced #IIT #NIT #IIIT #CollegePredictor #EngineeringAdmission #CollegeParichay

---

## 4. YouTube growth

**Channel setup:** name "College Parichay", handle `@CollegeParichay`, banner with "Free JEE Rank Predictor & Counselling — IIT Roorkee Alumni", link to site + socials, channel keywords: `JEE counselling, JoSAA, CSAB, college predictor, IIT NIT admission, JEE rank predictor`.

**Channel description (paste-ready):**
> College Parichay is a free JEE rank prediction & college-counselling platform built by IIT Roorkee alumni. We make JoSAA & CSAB simple — rank from marks, college shortlists, real cutoffs, branch comparisons & 1-on-1 mentorship. Website: https://collegeparichay.in

**Playlists:** JoSAA 2026 Masterclass · CSAB Special Round · College Reviews (IIT/NIT/IIIT) · Branch Comparisons · Rank Predictor How-To · Topper Interviews.

**Title/thumbnail:** number + benefit + year ("JoSAA 2026 Choice Filling: Exact Order for CSE | Step-by-Step"); thumbnail = bold 3–4 words + face + brand color #F47B20.

**50 video ideas:**
1. JEE Main percentile to rank — exact 2026 method
2. JoSAA 2026 choice filling: the correct order
3. CSAB special round explained in 10 min
4. NIT home-state quota: how much it really helps
5. IIT vs NIT vs IIIT for CSE — honest take
6. How to use the CollegeParichay rank predictor
7. JEE Advanced marks vs rank 2026
8. Which IITs can I get at rank 5000?
9. Best branches in NITs by placement
10. JoSAA mock seat allocation — how to read it
11. Float / Slide / Freeze explained
12. Common mistakes in JoSAA choice filling
13. CSE not getting? Best alternative branches
14. IIT Roorkee campus & branch review
15. NIT Trichy vs NIT Warangal
16. IIIT Hyderabad — is it worth it over NITs?
17. GFTIs explained — should you fill them?
18. Category cutoffs (OBC/SC/ST/EWS) — how reading differs
19. Female supernumerary seats explained
20. Document verification checklist for JoSAA
21. JoSAA business rules that confuse everyone
22. How seat upgrade works across rounds
23. Spot round vs special round
24. Branch change after 1st year — reality at IITs/NITs
25. Placement truth: average vs median package
26. Lowest-rank IIT branches you can still target
27. Dual degree vs B.Tech — which to pick
28. Best ECE colleges under rank 10000
29. Mechanical engineering scope in 2026
30. State quota colleges vs JoSAA — what to prioritise
31. JEE drop year — worth it or not?
32. How cutoffs move round-by-round (data)
33. JoSAA vs CSAB vs state counselling timeline
34. Hostel & fees comparison: top 10 NITs
35. Best IIITs for placements
36. Reading the official JoSAA opening/closing ranks
37. What rank for IIT Bombay CSE?
38. NIT cutoffs for home vs other state
39. How to make a safe/ambitious/realistic choice list
40. CSAB vacant seat strategy
41. Last-rank admission stories
42. JEE 2027 prep timeline (class 11)
43. NEET counselling basics (for the NEET audience)
44. Topper interview: how they filled choices
45. Live JoSAA round result reaction
46. Myth-busting: "private > NIT" claims
47. Scholarships at IITs/NITs
48. Girl students: branches & quota strategy
49. Foreign vs Indian undergrad for engineers
50. Full CollegeParichay platform walkthrough

---

## 5. LinkedIn growth

- **Company page:** complete every field, post 3–5×/week, enable the "Free counselling" CTA, add the site as Website.
- **Founder profiles** (Ankit Yadav, Ankit Kumar): headline "Co-founder, College Parichay | IIT Roorkee | Helping JEE aspirants pick the right college"; feature the site; post personally — founder posts out-reach company posts 5–10×.
- **Weekly calendar:** Mon data insight · Wed how-to/carousel · Fri student win/testimonial · Sun founder story. In season: live result-day posts.
- **Viral formats:** "rank → college" carousels, cutoff data charts, "I'm an IITian, here's what I'd do with rank X" hooks, myth-busting.
- **Keywords:** JEE counselling, JoSAA, CSAB, college predictor, IIT admission, engineering admission guidance.

---

## 6. Technical SEO — current state & gaps

| Item | Status |
|---|---|
| XML sitemap (`/sitemap.xml`, auto-generated) | ✅ |
| robots.txt (allows AI crawlers, points to sitemap) | ✅ |
| Canonical tags per route (`Seo.jsx`) | ✅ |
| Organization/WebSite/FAQ/sitelinks schema | ✅ |
| Favicons (all sizes from SVG master, 48px for Google) | ✅ (fixed) |
| Per-page meta on all feature pages incl. `/cutoffs` | ✅ (fixed) |
| **www vs apex canonical** | ⚠️ FIX in Vercel (section 0) |
| Mobile / Core Web Vitals | Audit with PageSpeed Insights; SPA — watch LCP & JS bundle |
| Internal linking | Add contextual links from blogs → predictor/college pages |
| SSR/prerender for SPA | Consider prerendering key routes (or Vercel prerender) so crawlers get full HTML faster |

**Indexing strategy:** Search Console → submit sitemap → Request Indexing on top 10 URLs → monitor Coverage weekly → fix any "Discovered/Crawled – not indexed".

---

## 7. Content marketing

**Pillar → cluster model.** Pillars: (A) JoSAA Counselling, (B) CSAB, (C) College Reviews, (D) Branch/Career, (E) Rank Prediction. Each pillar = one deep guide linking to 8–12 cluster posts.

**Seasonal:** Jan–Apr prep & exam · May result/percentile · **Jun–Aug counselling (peak — publish daily)** · Sep–Dec evergreen reviews & next-year prep.

**40 starter blog topics** (extend to 100 by templating per college/branch/category):
JoSAA choice-filling order · CSAB special round guide · percentile-to-rank explainer · home-state quota guide · float/slide/freeze · category cutoff reading · IIT [X] review (×23) · NIT [X] review (×31) · CSE vs ECE vs Mech · average vs median package · GFTI guide · document checklist · seat-upgrade mechanics · safe/ambitious list building · drop-year analysis · branch-change reality · female supernumerary seats · dual degree vs B.Tech · lowest-rank IIT branches · scholarships at IITs/NITs · state vs JoSAA priority · hostel/fees comparisons · spot round · NEET counselling basics · topper choice-list breakdowns.
> Per-college and per-branch templating turns ~10 templates into 100+ pages quickly — but use **real data**, not placeholders.

---

## 8. Competitor analysis

| Competitor | Strength | Your opening to win |
|---|---|---|
| Careers360 | Huge domain authority, all exams | Too generic; you win deep JoSAA/CSAB how-tos & authentic IITian voice |
| CollegeDekho | Lead-gen, ads | Salesy; you win trust with free, honest, no-spam guidance |
| Shiksha | Reviews + Q&A | Cluttered; you win clean UX + accurate predictor |
| Collegedunia | Cutoff data SEO | You win with founder-led video + community (WhatsApp/Telegram) |

**Edge:** "Built by IIT Roorkee alumni" authenticity + free + a real predictor tool + community. Lean into long-tail counselling questions they neglect.

---

## 9. Backlinks (white-hat)

- **IIT Roorkee ecosystem** (highest value): incubator/e-cell/alumni features → a link from `iitr.ac.in` cements "IIT Roorkee startup".
- **Startup directories:** Startup India/DPIIT, Crunchbase, Wellfound, Product Hunt.
- **Guest posts / PR:** YourStory, Inc42, ED Times, college fest blogs ("IITian-built startup" angle).
- **Resource links:** student forums, Quora/Reddit (genuine answers linking the predictor), coaching-institute resource pages, school counsellor pages.
- **Student ambassador program:** campus reps share the tool → natural social + forum links.
- **HARO-style:** respond to journalist queries on education/admissions.

---

## 10. 6-month action plan

**Month 1 — Foundation**
- Wk1: LinkedIn fix, Search Console sitemap + Request Indexing, Vercel apex-primary, fix stats numbers.
- Wk2: Create/standardise all social profiles (handle, bio, logo, backlink); add Facebook/X/WhatsApp/Telegram to `sameAs`.
- Wk3: GBP + Crunchbase + Startup India; founder LinkedIn optimisation.
- Wk4: Publish 4 cornerstone guides (JoSAA, CSAB, percentile→rank, choice-list). KPI: all profiles indexed; homepage favicon updated.

**Months 2–3 — Content engine**
- 2 blogs/week + 1–2 YouTube/week + daily IG reels; internal-link every post to the predictor; start backlink outreach (10 sites/week). KPI: 30+ indexed pages, first page-1 long-tail ranking, 1k+ organic/mo.

**Month 4 — Authority**
- Pitch 5 PR/guest posts; launch ambassador program; double down on top-performing content. KPI: 5 referring domains, knowledge-panel signals forming.

**Months 5–6 — Counselling-season blitz**
- Daily counselling content (blog + video + live posts) through May–Aug; result-day live updates; claim knowledge panel. KPI: page-1 for several "[college] cutoff/review" + "josaa/csab" long-tails; 10k+ organic/mo; brand SERP shows site + ≥3 socials.

**KPIs to track monthly:** indexed pages, organic clicks/impressions (Search Console), keyword rankings, referring domains, brand-search SERP completeness (site + socials + panel), YouTube subs/watch-time, conversion to predictor usage.

---

### What's already done (code side, June 2026)
Schema disambiguation (official domain + socials + "not an orientation event"); `/cutoffs` per-page SEO; footer social order LinkedIn→Instagram→YouTube; favicon set regenerated from one SVG master + 48px for Google; "An IIT Roorkee startup" line on the homepage hero.

### What only you can do (off-site — highest impact)
LinkedIn About/Website/logo · Search Console Request Indexing · Vercel apex-primary · create + standardise all social profiles · build backlinks/PR.
