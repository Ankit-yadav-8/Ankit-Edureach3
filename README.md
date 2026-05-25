# EduReach — JEE & College Discovery Portal (React + Vite)

A complete rebuild of the single-file EduReach site into a modular **React + Vite** project, with every component, page, data file and utility in its own file for easy editing in VS Code.

> **Important — please read the "Data: what's real vs illustrative" section below before publishing.** The app's *engineering* (every link, predictor, chart, tab and search) is fully functional. The *numbers* (cutoffs, packages, dates) are realistic **sample data** you should replace with official figures.

---

## 1. Quick start

You need **Node.js 18+** installed. Then, in this folder:

```bash
npm install      # install all libraries (needs internet, one time)
npm run dev      # start dev server at http://localhost:5173
```

Other commands:

```bash
npm run build    # production build into /dist
npm run preview  # preview the production build locally
```

That's it — open the URL it prints and the site is live with hot-reload.

---

## 2. Libraries used

| Library | Why |
|---|---|
| **react** + **react-dom** | UI framework |
| **react-router-dom** | client-side routing (all the pages & detail links) |
| **vite** + **@vitejs/plugin-react** | dev server & build tool (very fast) |
| **framer-motion** | scroll/hover reveal animations & smooth transitions |
| **lucide-react** | clean, consistent icon set |
| **recharts** | all charts — donuts, bars, trend lines, gauges |

No other runtime dependencies. Google Fonts (Sora + DM Sans) load from a `<link>` in `index.html`.

---

## 3. Folder structure

```
edureach/
├─ index.html               # Vite entry, fonts, GA placeholder
├─ package.json             # scripts + dependencies
├─ vite.config.js
├─ public/
│  └─ favicon.svg
└─ src/
   ├─ main.jsx              # React root + <BrowserRouter>
   ├─ App.jsx               # routes, navbar, footer, search overlay, scroll mgmt
   ├─ styles/
   │  └─ index.css          # full design system (colors, buttons, cards, tables…)
   ├─ data/                 # ← EDIT THESE to change content/numbers
   │  ├─ colleges.js        # 17 colleges: cutoffs, fees, placements, coords…
   │  ├─ exams.js           # 8 exams + pills: pattern, dates, cutoff trends, papers
   │  ├─ news.js            # news articles (cards + full body)
   │  └─ counselling.js     # deadline radar + private universities
   ├─ utils/
   │  ├─ rankPredictor.js   # marks → rank/percentile model
   │  ├─ collegePredictor.js# rank → eligible colleges
   │  ├─ cutoffEngine.js    # expands base cutoff → 6 JoSAA + 2 CSAB rounds
   │  ├─ searchIndex.js     # global search across everything
   │  ├─ useCountUp.js      # animated number hook (the stats counters)
   │  └─ format.js          # ₹ Cr/L formatting, rank formatting
   ├─ components/
   │  ├─ Navbar.jsx  Footer.jsx  SearchOverlay.jsx
   │  ├─ ParticleBackground.jsx  Reveal.jsx  ScrollUtils.jsx
   │  ├─ Charts.jsx         # reusable recharts wrappers
   │  ├─ home/              # the 7 homepage sections
   │  └─ predictor/         # rank tool, college tool, analysis sections
   └─ pages/                # one file per route
      ├─ Home.jsx  JeeMain.jsx  JeeAdvanced.jsx
      ├─ Colleges.jsx  CollegeDetail.jsx
      ├─ Exams.jsx  ExamDetail.jsx
      ├─ NewsDetail.jsx  PrivateDetail.jsx
      ├─ About.jsx  SearchResults.jsx  NotFound.jsx
```

---

## 4. What was fixed / added (vs the original single file)

- **Every link works.** Result/exam/paper links, news cards → full articles, "View Details" on colleges & private universities → detail pages, Top-Colleges tag buttons jump to the right tab.
- **Google-style global search** — click the search icon or press **Ctrl/Cmd + K**, or use the hero search bar. Searches colleges, exams, private unis, news and tools.
- **Rank Predictor** — marks → rank, percentile, category rank, with a gauge and a direct "see my colleges" handoff.
- **College Predictor (much more efficient)** — enter your rank and **click any predicted college row** to expand **all 6 JoSAA + 2 CSAB round cutoffs**, a round-by-round chart, average package and a link to full details. Filters by category, branch and home state.
- **College detail page** — tabs for Overview / Cutoff / Fees / Courses / Placements / Campus Life (with a live Google Map), branch + category selectors on cutoffs, fee pie chart, branch-wise placement bars.
- **Better charts everywhere** (recharts) and subject-wise difficulty analysis per shift — no empty space.
- **Animations** — particle hero background, scroll-reveal, hover lifts, scroll-progress bar, back-to-top.
- **Expanded palette** (navy / coral / gold / orange / teal / violet) and two-font system (Sora + DM Sans).

---

## 5. Data: what's real vs illustrative ⚠️

**Real & working:** the entire application — routing, predictors' logic, search, charts, tabs, filters, all links and external URLs to official portals (NTA, JoSAA, CSAB, college sites).

**Illustrative (replace before publishing):**
- **Cutoff ranks** in `src/data/colleges.js` (`baseCutoff`) are realistic *sample* numbers. Rounds are **modelled** from each branch's base opening/closing rank in `src/utils/cutoffEngine.js`. The round structure is now accurate: **IITs show 6 JoSAA rounds only** (IITs have no CSAB), while **NITs / IIITs / GFTIs show 6 JoSAA + 2 CSAB special rounds**.
- **Placement packages**, **fees**, **NIRF ranks**, **exam dates**, and **news** are sample/illustrative.

There is **no public live API** from JoSAA or CSAB that streams official cutoffs, so this data must be entered manually (their portals publish PDFs/HTML tables, not an API).

### Smart search (no API key needed)
The global search (`src/utils/searchIndex.js`) is a powerful **on-device** engine — it indexes every college, private university, exam and news item with deep keywords (packages, placements, branches, recruiters, location) and understands natural-language queries like *"top IITs with package above 20 lakh"* or *"CSE colleges in Tamil Nadu"*, with a Gemini-style answer summary. It runs entirely in the browser (instant, offline, free). A locally-run site can't safely call a remote LLM with an API key from the browser; if you want a true remote AI later, call your model inside `answerFor()` and keep this as the retrieval layer.

### How to add MORE colleges
Add new entries to the `COLLEGES` array in `src/data/colleges.js` (same shape: slug, name, type, nirf, location, state, coords, fees, placements, baseCutoff). They automatically appear everywhere — listings, predictor, search and detail pages.

### How to put in real data
1. **Cutoffs:** download official opening/closing ranks from **josaa.nic.in** and **csab.nic.in**. Easiest path: edit `baseCutoff` per college/branch/category in `src/data/colleges.js`. To show *true* per-round numbers instead of the model, replace the `expandRounds()` logic in `src/utils/cutoffEngine.js` so it reads a real `rounds` array you add to each college.
2. **Placements/fees:** update each college's `placements` and `fees` objects from official placement reports.
3. **Exam dates/papers:** update `src/data/exams.js` (`dates`, `papers` URLs) from the official exam portals.
4. **News:** edit `src/data/news.js`.
5. The data disclaimers shown in the UI (info banners, footnotes, About → Terms) can be removed once your data is official.

---

## 6. Things to personalize

- **Developer/social links & contact** — in `src/components/Footer.jsx` (marked as placeholders) and `src/pages/About.jsx` (`support@edureachportal.in`, phone). Replace with your real handles.
- **Google Analytics** — paste your GA tag where the placeholder comment is in `index.html`.
- **Brand color** — change the CSS variables at the top of `src/styles/index.css`.

---

Built with care. Everything is modular — open any file in `src/`, edit, and the dev server reloads instantly.
