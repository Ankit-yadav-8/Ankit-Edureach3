# College Parichay — NEET Blog Cluster (10 posts)

A topical-authority cluster for the NEET / medical-admissions vertical. Every post is written in a humanized counselor voice, interlinks with its siblings, and drives to two conversion targets: the **College Predictor** (`/neet-college-predictor`) and the **NEET Counseling** desk (`/neet-counseling`).

## The 10 posts

| # | Slug | Focus keyword | Angle / viral hook |
|---|------|---------------|--------------------|
| 1 | `neet-marks-vs-college` | neet marks vs college | The #1 searched money question, score-band by score-band |
| 2 | `neet-counseling-process` | neet counseling process | The confusing maze, explained plainly (AIQ vs state) |
| 3 | `govt-vs-private-medical-college` | government vs private medical college | The real cost trade-off nobody explains |
| 4 | `drop-year-for-neet` | drop a year for neet | Honest decision framework, high emotional pull |
| 5 | `neet-category-cutoffs` | neet category wise cutoff | Defuses the most misunderstood/heated topic |
| 6 | `low-neet-score-options` | low neet score options | Emotional, shareable, hope-driven (12 paths) |
| 7 | `neet-counseling-mistakes` | neet counseling mistakes | Fear-of-loss hook: "lost their seat" |
| 8 | `first-year-mbbs` | first year of mbbs | Storytelling (cadaver lab), aspirational, shareable |
| 9 | `cheapest-mbbs-colleges` | cheapest government medical colleges india | Budget anxiety, high-intent |
| 10 | `neet-rank-predictor-guide` | neet rank predictor | Tool-explainer that funnels straight to the predictor |

## Internal linking map

Every post links to 2–4 siblings so link equity flows across the cluster and readers move through the funnel:

- **1 (marks vs college)** → 10, 5, 3, 4, 7, 2, 6
- **2 (counseling process)** → 3, 9, 5, 7
- **3 (govt vs private)** → 4, 6, 2, 7
- **4 (drop year)** → 6, 10, 2 (+ predictor)
- **5 (category cutoffs)** → 2, 7 (+ predictor)
- **6 (low score)** → 3, 4 (+ predictor)
- **7 (mistakes)** → 2, 5, 6 (+ predictor/counseling)
- **8 (first-year MBBS)** → 2, 7, 3 (+ predictor)
- **9 (budget MBBS)** → 3, 2, 5, 7, 6, 4, 10
- **10 (predictor)** → 1, 5, 2, 7, 3, 8

Posts 1 and 10 act as the two "hub" pages (highest internal links); the rest are spokes.

## CTA targets (update these to your real URLs)

- Predictor: `/neet-college-predictor`
- Counseling: `/neet-counseling`

If your live routes differ, do a find-and-replace across all 10 files before publishing. Sibling links use the slugs in the table above (e.g. `/neet-marks-vs-college`) — adjust the path prefix (e.g. `/blog/...`) to match your routing.

## Publishing notes

- Each file has YAML frontmatter (title, meta_description, slug, focus_keyword, secondary_keywords, category, author, read_time) ready for most CMS/SSG setups.
- **SSR/SSG reminder:** these posts only earn SEO value if they're server-rendered or statically generated. On the current CSR/SPA setup, Googlebot won't index the body content — the whole cluster's ranking potential depends on getting these onto SSR/SSG.
- All specific numbers (cutoffs, fees) are deliberately given as *indicative bands* with a verification note, to stay accurate across years and protect credibility. Add current-year official figures where you want more specificity — but keep the "verify official data" caveat.
- Suggested cadence: publish 2–3/week over ~4 weeks, hubs (1 and 10) first so spokes can link to live pages.
