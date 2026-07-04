import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search, MapPin, ChevronDown, RotateCcw, SlidersHorizontal,
  Loader2, Crosshair, ArrowRight, GitBranch, Layers, Award, X,
} from "lucide-react";
import { COLLEGE_BY_SLUG, CATEGORIES, STATES } from "../../data/colleges.js";
import { useCollegePredictor } from "../../hooks/useCollegePredictor.js";
import {
  FLEX_FLAGS, BRANCH_BUCKETS, CODE_TO_BUCKET,
  degreeOf, DEGREE_OPTIONS, collegeLogo,
} from "../../data/collegeFlexibility.js";
import { fmtRank, fmtINR } from "../../utils/format.js";

const TYPE_SETS = {
  "/jee-main":     ["NIT", "IIIT", "GFTI"],
  "/jee-advanced": ["IIT"],
};

const TYPE_PILLS = ["IIT", "NIT", "IIIT", "GFTI"];

// Staggered fade-up for the empty-state placeholder (icon → heading → text)
const CF_EMPTY_WRAP = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } } };
const CF_EMPTY_ITEM = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

/* Tier → "probability" bucket used by chance filter */
const TIER_TO_PROB = { Safe: "high", Moderate: "medium", Ambitious: "low" };
const PROB_META = {
  high:   { label: "High",   color: "#0e9c90", bg: "rgba(46,196,182,.14)" },
  medium: { label: "Medium", color: "#d9641a", bg: "rgba(249,115,22,.14)" },
  low:    { label: "Low",    color: "#dc2626", bg: "rgba(239,68,68,.12)" },
};

/* Circular institute mark — the college's own site icon (its logo), with a
   coral monogram fallback. Card avatar with a coral monogram. */
function InstituteLogo({ slug, name, size = 44 }) {
  const [err, setErr] = useState(false);
  const initials = name.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 3).map((w) => w[0]).join("").toUpperCase();
  // Official IIT emblem when we have one; otherwise the institute's own site
  // logo (favicon) for NITs / IIITs / GFTIs.
  const src = collegeLogo(COLLEGE_BY_SLUG[slug]);
  if (src && !err) {
    return (
      <img
        src={src}
        alt="" width={size} height={size} loading="lazy" onError={() => setErr(true)}
        className="cf-logo"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span className="cf-logo cf-logo-fallback" style={{ width: size, height: size, fontSize: size * 0.3 }}>
      {initials}
    </span>
  );
}

/* Custom click-to-open dropdown — no native <select> arrow. Click the field,
   the options drop in; click an option to pick it. Closes on outside click. */
function SelectMenu({ value, onChange, options, placeholder, ariaLabel }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const current = options.find((o) => o.value === value);
  return (
    <div className="cf-dd" ref={ref}>
      <button
        type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={ariaLabel}
        className={`cf-ddbtn ${open ? "open" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={current ? "" : "cf-dd-ph"}>{current ? current.label : placeholder}</span>
      </button>
      {open && (
        <div className="cf-ddmenu" role="listbox">
          {options.map((o) => (
            <button
              type="button" key={o.value} role="option" aria-selected={o.value === value}
              className={`cf-ddopt ${o.value === value ? "sel" : ""}`}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FlexChip({ icon: Icon, label, color }) {
  return (
    <span className="cf-flexchip" style={{ color, borderColor: `${color}33`, background: `${color}12` }}>
      <Icon size={11} /> {label}
    </span>
  );
}

/* Expandable list of every eligible branch for one college */
function BranchList({ rows }) {
  return (
    <div className="cf-branchlist">
      {rows.map((r) => {
        const prob = TIER_TO_PROB[r.tier] || "low";
        const m = PROB_META[prob];
        return (
          <div key={r.branchCode + r.opening} className="cf-branchrow">
            <div className="cf-branchrow-name">
              <span className="cf-branchrow-dot" style={{ background: m.color }} />
              <span>{r.branch}</span>
            </div>
            <div className="cf-branchrow-meta">
              <span title="Opening rank" className="cf-rk cf-rk-open">{fmtRank(r.opening)}</span>
              <span className="cf-rk-sep">→</span>
              <span title="Closing rank" className="cf-rk cf-rk-close">{fmtRank(r.closing)}</span>
              <span className="cf-chance" style={{ color: m.color, background: m.bg }}>{m.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CollegeCard({ group, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const c = group;
  const flex = c.flex;
  return (
    <div className={`cf-card ${open ? "cf-card-open" : ""}`}>
      <div className="cf-card-main">
        <InstituteLogo slug={c.slug} name={c.college} />
        <div className="cf-card-body">
          <div className="cf-card-titlerow">
            <Link to={`/colleges/${c.slug}`} className="cf-card-name">{c.college}</Link>
            <span className="cf-typebadge">{c.type}</span>
            {c.nirf && <span className="cf-nirf">NIRF #{c.nirf}</span>}
          </div>
          <div className="cf-card-sub">
            <span className="cf-card-loc"><MapPin size={12} /> {c.state}</span>
            <span className="cf-card-chancecount" style={{ color: PROB_META[c.topProb].color }}>
              ● {c.branchCount} {c.topProb === "high" ? "high" : c.topProb === "medium" ? "medium" : "reach"}-chance branch{c.branchCount !== 1 ? "es" : ""}
            </span>
          </div>
          {(flex.branchChange || flex.dualDegree || flex.minorDegree) && (
            <div className="cf-flexrow">
              {flex.branchChange && <FlexChip icon={GitBranch} label="Branch change" color="#0e9c90" />}
              {flex.dualDegree   && <FlexChip icon={Layers}    label="Dual degree"   color="#6366f1" />}
              {flex.minorDegree  && <FlexChip icon={Award}     label="Minor degree"  color="#d9641a" />}
            </div>
          )}
        </div>
        <div className="cf-card-actions">
          <Link to={`/colleges/${c.slug}`} className="cf-detailbtn">Details</Link>
          <button className="cf-viewbtn" onClick={() => setOpen((o) => !o)}>
            {open ? "Hide" : "View"} Branches
            <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "none", transition: ".2s" }} />
          </button>
        </div>
      </div>
      {open && <BranchList rows={c.rows} />}
    </div>
  );
}

export default function CollegeFinderTool({ basePath = "/jee-main" }) {
  const allowedTypes = TYPE_SETS[basePath] || ["IIT", "NIT", "IIIT", "GFTI"];

  const [form, setForm] = useState({ rank: "", category: "OPEN", homeState: "", branch: "" });
  const [types, setTypes]         = useState(new Set(allowedTypes));
  const [degree, setDegree]       = useState("");
  const [buckets, setBuckets]     = useState(new Set());
  const [flex, setFlex]           = useState({ branchChange: false, dualDegree: false, minorDegree: false, openElectives: false });
  const [probs, setProbs]         = useState(new Set());   // empty = all
  const [query, setQuery]         = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { predict, reset, results, loading, error } = useCollegePredictor();
  const ranOnce = useRef(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function handleRun() {
    if (!form.rank || Number(form.rank) <= 0) return;
    ranOnce.current = true;
    predict({
      rank: Number(form.rank),
      category: form.category,
      rankType: form.category === "OPEN" ? "crl" : "category",
      types: allowedTypes,
    }, false);
  }

  function toggleSet(setter, value) {
    setter((prev) => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  }

  function resetFilters() {
    setTypes(new Set(allowedTypes));
    setDegree("");
    setBuckets(new Set());
    setFlex({ branchChange: false, dualDegree: false, minorDegree: false, openElectives: false });
    setProbs(new Set());
    setQuery("");
    setForm((f) => ({ ...f, homeState: "", branch: "" }));
  }

  /* Build college groups from flat branch rows, applying every filter */
  const groups = useMemo(() => {
    if (!results?.length) return [];
    const activeFlex = Object.entries(flex).filter(([, on]) => on).map(([k]) => k);
    const byCollege = new Map();

    for (const r of results) {
      if (!types.has(r.type)) continue;
      if (form.homeState && r.state !== form.homeState) continue;
      if (form.branch && CODE_TO_BUCKET[r.branchCode] !== form.branch) continue;
      if (degree && degreeOf(r.fullProgramName) !== degree) continue;
      if (buckets.size && !buckets.has(CODE_TO_BUCKET[r.branchCode])) continue;
      const prob = TIER_TO_PROB[r.tier] || "low";
      if (probs.size && !probs.has(prob)) continue;

      // flexibility flags are college-level
      const passesFlex = activeFlex.every((f) => FLEX_FLAGS[f]?.has(r.slug));
      if (!passesFlex) continue;

      if (query) {
        const q = query.toLowerCase();
        if (!r.college.toLowerCase().includes(q) &&
            !r.branch.toLowerCase().includes(q) &&
            !r.state.toLowerCase().includes(q)) continue;
      }

      if (!byCollege.has(r.slug)) {
        byCollege.set(r.slug, {
          slug: r.slug, college: r.college, type: r.type, nirf: r.nirf,
          state: r.state, rows: [],
          flex: {
            branchChange: FLEX_FLAGS.branchChange.has(r.slug),
            dualDegree:   FLEX_FLAGS.dualDegree.has(r.slug),
            minorDegree:  FLEX_FLAGS.minorDegree.has(r.slug),
          },
        });
      }
      byCollege.get(r.slug).rows.push(r);
    }

    const out = [...byCollege.values()].map((g) => {
      // de-dup branches by code, keep best (lowest closing)
      const seen = new Map();
      for (const row of g.rows) {
        const prev = seen.get(row.branchCode);
        if (!prev || row.closing < prev.closing) seen.set(row.branchCode, row);
      }
      const rows = [...seen.values()].sort((a, b) => a.closing - b.closing);
      const counts = { high: 0, medium: 0, low: 0 };
      rows.forEach((row) => { counts[TIER_TO_PROB[row.tier] || "low"]++; });
      const topProb = counts.high ? "high" : counts.medium ? "medium" : "low";
      return { ...g, rows, branchCount: rows.length, counts, topProb };
    });

    out.sort((a, b) => (a.nirf || 999) - (b.nirf || 999));
    return out;
  }, [results, types, degree, buckets, flex, probs, query, form.homeState, form.branch]);

  const totalBranches = groups.reduce((s, g) => s + g.branchCount, 0);

  return (
    <div className="cf-root">
      <style>{CF_STYLES}</style>

      {/* ── Rank entry bar ── */}
      <div className="cf-rankbar">
        <div className="cf-rankbar-fields">
          <div className="cf-field">
            <label>Your rank ({form.category === "OPEN" ? "CRL" : `${form.category} category`})</label>
            <input
              className="cf-input" type="number" min="1" placeholder="e.g. 1200"
              value={form.rank}
              onChange={(e) => set("rank", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRun()}
            />
          </div>
          <div className="cf-field cf-field-cat">
            <label>Category</label>
            <SelectMenu
              ariaLabel="Category"
              value={form.category}
              onChange={(v) => set("category", v)}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </div>
          <div className="cf-field cf-field-cat">
            <label>Home State</label>
            <SelectMenu
              ariaLabel="Home State"
              value={form.homeState}
              onChange={(v) => set("homeState", v)}
              options={[{ value: "", label: "All States" }, ...STATES.map((s) => ({ value: s, label: s }))]}
            />
          </div>
          <div className="cf-field cf-field-cat">
            <label>Branch</label>
            <SelectMenu
              ariaLabel="Branch"
              value={form.branch}
              onChange={(v) => set("branch", v)}
              options={[{ value: "", label: "All Branches" }, ...BRANCH_BUCKETS.map((b) => ({ value: b.id, label: b.label }))]}
            />
          </div>
          <button className="cf-runbtn" onClick={handleRun} disabled={loading || !form.rank}>
            {loading
              ? <><Loader2 size={16} className="cf-spin" /> Finding…</>
              : <><Crosshair size={16} /> Find Colleges</>}
          </button>
        </div>
        {results && (
          <button className="cf-mobile-filter" onClick={() => setShowFilters(true)}>
            <SlidersHorizontal size={15} /> Filters
          </button>
        )}
      </div>

      {error && <div className="cf-error">⚠️ {error} — please try again.</div>}

      {/* ── Empty state ── */}
      {!results && !loading && !error && (
        <motion.div
          className="cf-empty"
          variants={CF_EMPTY_WRAP} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div className="cf-empty-icon" variants={CF_EMPTY_ITEM}>
            <motion.span
              style={{ display: "grid", placeItems: "center" }}
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }}
            >
              <Crosshair size={26} />
            </motion.span>
          </motion.div>
          <motion.h4 variants={CF_EMPTY_ITEM}>Find your perfect institute</motion.h4>
          <motion.p variants={CF_EMPTY_ITEM}>Enter your rank above to see every {allowedTypes.join(" / ")} you can get, with branch-change, dual-degree and minor-program flexibility — filter it all from the sidebar.</motion.p>
        </motion.div>
      )}

      {loading && (
        <div className="cf-loading">
          <div className="cf-loading-ring" />
          <p>Scanning college-branch combinations against JoSAA 2025 cutoffs…</p>
        </div>
      )}

      {/* ── Two-column layout ── */}
      {results && !loading && (
        <div className="cf-layout">
          {/* ===== Sidebar ===== */}
          <aside className={`cf-sidebar ${showFilters ? "cf-sidebar-open" : ""}`}>
            <div className="cf-sidebar-head">
              <span>Filters</span>
              <button className="cf-sidebar-close" onClick={() => setShowFilters(false)}><X size={18} /></button>
            </div>

            <div className="cf-filter-group">
              <div className="cf-filter-label">College Type</div>
              <div className="cf-typepills">
                {TYPE_PILLS.filter((t) => allowedTypes.includes(t)).map((t) => (
                  <button
                    key={t}
                    className={`cf-typepill ${types.has(t) ? "active" : ""}`}
                    onClick={() => toggleSet(setTypes, t)}
                  >{t}</button>
                ))}
              </div>
            </div>

            <div className="cf-filter-group">
              <div className="cf-filter-label">Degree</div>
              <div className="cf-selectwrap">
                <select className="cf-select cf-select-full" value={degree} onChange={(e) => setDegree(e.target.value)}>
                  {DEGREE_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
                <ChevronDown size={15} className="cf-selectchev" />
              </div>
            </div>

            <div className="cf-filter-group">
              <div className="cf-filter-label">Branch Bucket</div>
              <div className="cf-checks">
                {BRANCH_BUCKETS.map((b) => (
                  <label key={b.id} className="cf-check">
                    <input
                      type="checkbox"
                      checked={buckets.has(b.id)}
                      onChange={() => toggleSet(setBuckets, b.id)}
                    />
                    <span>{b.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="cf-filter-group">
              <div className="cf-filter-label">Flexibility</div>
              {[
                ["branchChange",  "Branch change allowed"],
                ["dualDegree",    "Dual degree offered"],
                ["minorDegree",   "Minor degree offered"],
                ["openElectives", "Open electives"],
              ].map(([key, lbl]) => (
                <div key={key} className="cf-toggle-row">
                  <span>{lbl}</span>
                  <button
                    className={`cf-toggle ${flex[key] ? "on" : ""}`}
                    onClick={() => setFlex((f) => ({ ...f, [key]: !f[key] }))}
                    aria-pressed={flex[key]}
                  >
                    <span className="cf-toggle-knob" />
                  </button>
                </div>
              ))}
            </div>

            <button className="cf-reset" onClick={resetFilters}>
              <RotateCcw size={14} /> Reset Filters
            </button>
          </aside>
          {showFilters && <div className="cf-backdrop" onClick={() => setShowFilters(false)} />}

          {/* ===== Results column ===== */}
          <div className="cf-results">
            <div className="cf-results-top">
              <div className="cf-count">
                <strong>{groups.length}</strong> college{groups.length !== 1 ? "s" : ""}
                <span> · {totalBranches} branch{totalBranches !== 1 ? "es" : ""}</span>
              </div>
              <div className="cf-probrow">
                <span className="cf-probrow-label">Chance:</span>
                {["high", "medium", "low"].map((p) => (
                  <button
                    key={p}
                    className={`cf-probpill ${probs.has(p) ? "active" : ""}`}
                    style={probs.has(p) ? { background: PROB_META[p].color, borderColor: PROB_META[p].color, color: "#fff" } : { color: PROB_META[p].color }}
                    onClick={() => toggleSet(setProbs, p)}
                  >{PROB_META[p].label}</button>
                ))}
              </div>
            </div>

            <div className="cf-searchbar">
              <Search size={16} />
              <input
                placeholder="Search by college, branch or state…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && <button onClick={() => setQuery("")}><X size={14} /></button>}
            </div>

            {groups.length === 0 ? (
              <div className="cf-noresults">
                No colleges match these filters. Try clearing a few from the sidebar.
              </div>
            ) : (
              <div className="cf-scrollwrap">
                <div className="cf-cardlist">
                  {groups.map((g, i) => (
                    <div className="cf-cardanim" style={{ animationDelay: `${Math.min(i, 12) * 0.04}s` }} key={g.slug}>
                      <CollegeCard group={g} defaultOpen={i === 0} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="cf-note">
              Cutoffs are based on official JoSAA 2025 data and are indicative for 2026.
              Branch-change / dual / minor flexibility is indicative — confirm on the institute brochure
              and josaa.nic.in before locking choices.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const CF_STYLES = `
.cf-root { --cf-coral:#FF693D; --cf-line:#ece7e1; --cf-bg:#faf7f3; font-family:inherit; }
.cf-spin { animation: cf-spin .8s linear infinite; }
@keyframes cf-spin { to { transform: rotate(360deg); } }

/* rank bar — full-width grid: rank · category · home state · branch · button */
.cf-rankbar { display:flex; flex-direction:column; align-items:stretch; gap:12px;
  background:#fff; border:1px solid var(--cf-line); border-radius:16px; padding:18px 20px; margin-bottom:18px; }
.cf-rankbar-fields { display:grid; grid-template-columns:1.3fr 1fr 1.1fr 1.5fr auto; gap:14px; align-items:end; width:100%; }
.cf-field { display:flex; flex-direction:column; gap:6px; min-width:0; }
.cf-field label { font-size:11px; font-weight:700; letter-spacing:.03em; text-transform:uppercase; color:#8a8178; }
.cf-field-cat { min-width:0; }
.cf-input, .cf-select { border:1px solid var(--cf-line); border-radius:10px; padding:10px 12px; font-size:14px;
  background:#fff; color:#1a1a2e; outline:none; transition:border .15s, box-shadow .15s; }
.cf-input { width:100%; box-sizing:border-box; }
.cf-input:focus, .cf-select:focus { border-color:var(--cf-coral); box-shadow:0 0 0 3px rgba(255, 105, 61,.12); }
.cf-runbtn { display:inline-flex; align-items:center; justify-content:center; gap:7px; background:var(--cf-coral); color:#fff; border:none;
  border-radius:10px; padding:11px 22px; font-size:14px; font-weight:700; cursor:pointer; white-space:nowrap; height:42px;
  box-shadow:0 4px 14px rgba(255, 105, 61,.28); transition:opacity .15s, transform .1s; }
.cf-runbtn:hover:not(:disabled) { transform:translateY(-1px); }
.cf-runbtn:disabled { opacity:.55; cursor:not-allowed; box-shadow:none; }
.cf-mobile-filter { display:none; }

/* custom click-to-open dropdown (replaces native <select> in the rank bar) */
.cf-dd { position:relative; width:100%; }
.cf-ddbtn { display:flex; align-items:center; justify-content:space-between; gap:8px; width:100%; box-sizing:border-box;
  border:1px solid var(--cf-line); border-radius:10px; padding:10px 12px; font-size:14px; background:#fff;
  color:#1a1a2e; cursor:pointer; text-align:left; transition:border .15s, box-shadow .15s; }
.cf-ddbtn:hover { border-color:#d8cfc4; }
.cf-ddbtn.open { border-color:var(--cf-coral); box-shadow:0 0 0 3px rgba(255, 105, 61,.12); }
.cf-ddbtn > span { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.cf-dd-ph { color:#9a9189; }
.cf-ddmenu { position:absolute; top:calc(100% + 6px); left:0; right:0; z-index:40; background:#fff;
  border:1px solid var(--cf-line); border-radius:12px; box-shadow:0 14px 36px rgba(0,0,0,.14);
  padding:6px; max-height:288px; overflow-y:auto; animation:cfDD .14s ease;
  scrollbar-width:thin; scrollbar-color:rgba(255, 105, 61,.45) transparent; }
@keyframes cfDD { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }
.cf-ddmenu::-webkit-scrollbar { width:8px; }
.cf-ddmenu::-webkit-scrollbar-thumb { background:rgba(255, 105, 61,.4); border-radius:50px; border:2px solid #fff; }
.cf-ddopt { display:block; width:100%; text-align:left; border:none; background:none; cursor:pointer;
  padding:9px 12px; border-radius:8px; font-size:13.5px; color:#3a3a4a; transition:background .12s; }
.cf-ddopt:hover { background:#faf7f3; }
.cf-ddopt.sel { background:rgba(255, 105, 61,.1); color:var(--cf-coral); font-weight:700; }

.cf-error { background:#fff0f0; border:1px solid #fca5a5; color:#dc2626; border-radius:12px; padding:12px 16px; font-size:13px; }

/* empty / loading */
.cf-empty { text-align:center; background:#fff; border:1px solid var(--cf-line); border-radius:16px; padding:46px 24px; }
.cf-empty-icon { width:58px; height:58px; border-radius:50%; background:rgba(255, 105, 61,.1); color:var(--cf-coral);
  display:grid; place-items:center; margin:0 auto 16px; }
.cf-empty h4 { font-family:Sora,sans-serif; font-weight:800; font-size:19px; margin-bottom:8px; color:#1a1a2e; }
.cf-empty p { color:#6b6258; font-size:14px; max-width:520px; margin:0 auto; line-height:1.6; }
.cf-loading { text-align:center; background:#fff; border:1px solid var(--cf-line); border-radius:16px; padding:48px 24px; }
.cf-loading-ring { width:46px; height:46px; border-radius:50%; border:4px solid #f3f0ec; border-top-color:var(--cf-coral);
  animation:cf-spin .8s linear infinite; margin:0 auto 16px; }
.cf-loading p { color:#6b6258; font-size:14px; }

/* layout */
.cf-layout { display:grid; grid-template-columns:248px 1fr; gap:22px; align-items:start; }

/* sidebar */
.cf-sidebar { background:#fff; border:1px solid var(--cf-line); border-radius:16px; padding:18px 16px;
  position:sticky; top:84px; }
.cf-sidebar-head { display:none; }
.cf-filter-group { padding-bottom:16px; margin-bottom:16px; border-bottom:1px solid var(--cf-line); }
.cf-filter-group:last-of-type { border-bottom:none; }
.cf-filter-label { font-size:11px; font-weight:800; letter-spacing:.06em; text-transform:uppercase; color:#9a9189; margin-bottom:11px; }
.cf-typepills { display:flex; flex-wrap:wrap; gap:8px; }
.cf-typepill { border:1.5px solid var(--cf-line); background:#fff; color:#8a8178; border-radius:50px;
  padding:7px 16px; font-size:13px; font-weight:700; cursor:pointer; transition:all .15s; }
.cf-typepill.active { background:var(--cf-coral); border-color:var(--cf-coral); color:#fff; box-shadow:0 3px 10px rgba(255, 105, 61,.25); }
.cf-selectwrap { position:relative; }
.cf-select-full { width:100%; appearance:none; padding-right:32px; }
.cf-selectchev { position:absolute; right:11px; top:50%; transform:translateY(-50%); color:#9a9189; pointer-events:none; }
.cf-checks { display:flex; flex-direction:column; gap:10px; }
.cf-check { display:flex; align-items:center; gap:9px; font-size:13.5px; color:#3a3a4a; cursor:pointer; }
.cf-check input { width:16px; height:16px; accent-color:var(--cf-coral); cursor:pointer; }
.cf-toggle-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:13px; font-size:13.5px; color:#3a3a4a; }
.cf-toggle-row:last-child { margin-bottom:0; }
.cf-toggle { width:38px; height:21px; border-radius:50px; border:none; background:#dcd6cf; position:relative;
  cursor:pointer; transition:background .18s; flex-shrink:0; }
.cf-toggle.on { background:var(--cf-coral); }
.cf-toggle-knob { position:absolute; top:2px; left:2px; width:17px; height:17px; border-radius:50%; background:#fff;
  transition:transform .18s; box-shadow:0 1px 3px rgba(0,0,0,.2); }
.cf-toggle.on .cf-toggle-knob { transform:translateX(17px); }
.cf-reset { width:100%; display:inline-flex; align-items:center; justify-content:center; gap:7px;
  border:1px solid var(--cf-line); background:#faf7f3; color:#6b6258; border-radius:10px; padding:10px;
  font-size:13px; font-weight:700; cursor:pointer; transition:all .15s; }
.cf-reset:hover { border-color:var(--cf-coral); color:var(--cf-coral); }

/* results */
.cf-results-top { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:12px; }
.cf-count { font-size:14px; color:#6b6258; }
.cf-count strong { font-family:Sora,sans-serif; font-size:17px; color:#1a1a2e; }
.cf-count span { color:#9a9189; }
.cf-probrow { display:flex; align-items:center; gap:7px; }
.cf-probrow-label { font-size:12px; color:#9a9189; font-weight:600; }
.cf-probpill { border:1.5px solid currentColor; background:#fff; border-radius:50px; padding:5px 14px;
  font-size:12.5px; font-weight:700; cursor:pointer; transition:all .15s; }
.cf-searchbar { display:flex; align-items:center; gap:9px; background:#fff; border:1px solid var(--cf-line);
  border-radius:12px; padding:0 14px; margin-bottom:16px; color:#9a9189; }
.cf-searchbar input { flex:1; border:none; outline:none; padding:12px 0; font-size:14px; background:transparent; color:#1a1a2e; }
.cf-searchbar button { border:none; background:none; cursor:pointer; color:#9a9189; display:grid; place-items:center; }

.cf-card { background:#fff; border:1px solid var(--cf-line); border-radius:14px; overflow:hidden;
  transition:box-shadow .18s, border-color .18s; }
.cf-card:hover { box-shadow:0 8px 26px rgba(0,0,0,.07); border-color:#e0d8cf; }
.cf-card-open { border-color:var(--cf-coral); }
.cf-card-main { display:flex; align-items:center; gap:14px; padding:15px 18px; }
.cf-logo { border-radius:12px; background:#fff; border:1px solid var(--cf-line); object-fit:contain; padding:4px; flex-shrink:0; }
.cf-logo-fallback { display:grid; place-items:center; background:rgba(255, 105, 61,.1); color:#E0421F; font-weight:800;
  font-family:Sora,sans-serif; padding:0; }
.cf-card-body { flex:1; min-width:0; }
.cf-card-titlerow { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.cf-card-name { font-family:Sora,sans-serif; font-weight:700; font-size:15.5px; color:#1a1a2e; text-decoration:none; }
.cf-card-name:hover { color:var(--cf-coral); }
.cf-typebadge { font-size:10.5px; font-weight:800; letter-spacing:.03em; color:#0e9c90; background:rgba(46,196,182,.14);
  padding:3px 8px; border-radius:6px; }
.cf-nirf { font-size:11px; color:#9a9189; font-weight:600; }
.cf-card-sub { display:flex; align-items:center; gap:14px; margin-top:5px; flex-wrap:wrap; }
.cf-card-loc { display:flex; align-items:center; gap:4px; font-size:12.5px; color:#8a8178; }
.cf-card-chancecount { font-size:12.5px; font-weight:700; }
.cf-flexrow { display:flex; gap:6px; margin-top:9px; flex-wrap:wrap; }
.cf-flexchip { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:700;
  border:1px solid; border-radius:50px; padding:3px 9px; }
.cf-card-actions { display:flex; flex-direction:row; gap:9px; align-items:center; flex-shrink:0; }
.cf-viewbtn { display:inline-flex; align-items:center; gap:6px; background:var(--cf-coral); color:#fff; border:none;
  border-radius:10px; padding:10px 16px; font-size:13px; font-weight:700; cursor:pointer; white-space:nowrap;
  box-shadow:0 3px 10px rgba(255, 105, 61,.25); transition:transform .1s; }
.cf-viewbtn:hover { transform:translateY(-1px); }
.cf-detailbtn { display:inline-flex; align-items:center; font-size:13px; color:#6b6258; text-decoration:none; font-weight:700;
  padding:9px 15px; border:1.5px solid var(--cf-line); border-radius:10px; white-space:nowrap; transition:all .15s; background:#fff; }
.cf-detailbtn:hover { color:var(--cf-coral); border-color:var(--cf-coral); }

/* scrollable results — keeps the (sticky) filter rail in view beside a long list */
.cf-scrollwrap { position:relative; }
.cf-scrollwrap::after { content:""; position:absolute; left:0; right:8px; bottom:0; height:34px; pointer-events:none;
  background:linear-gradient(to top, var(--cf-bg), transparent); border-radius:0 0 14px 14px; }
.cf-cardlist { display:flex; flex-direction:column; gap:12px; max-height:74vh; overflow-y:auto; padding:2px 8px 30px 2px;
  scroll-behavior:smooth; scrollbar-width:thin; scrollbar-color:rgba(255, 105, 61,.45) transparent; }
.cf-cardlist::-webkit-scrollbar { width:9px; }
.cf-cardlist::-webkit-scrollbar-track { background:transparent; }
.cf-cardlist::-webkit-scrollbar-thumb { background:rgba(255, 105, 61,.4); border-radius:50px; border:2px solid var(--cf-bg); }
.cf-cardlist::-webkit-scrollbar-thumb:hover { background:rgba(255, 105, 61,.65); }
.cf-cardanim { animation:cfIn .42s cubic-bezier(.4,0,.2,1) both; }
@keyframes cfIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }

.cf-branchlist { border-top:1px dashed var(--cf-line); padding:6px 18px 14px; }
.cf-branchrow { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:9px 0;
  border-bottom:1px solid #f4f0ea; }
.cf-branchrow:last-child { border-bottom:none; }
.cf-branchrow-name { display:flex; align-items:center; gap:9px; font-size:13.5px; color:#1a1a2e; font-weight:600; min-width:0; }
.cf-branchrow-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.cf-branchrow-meta { display:flex; align-items:center; gap:8px; flex-shrink:0; }
.cf-rk { font-family:'Space Grotesk',Sora,sans-serif; font-weight:700; font-size:12.5px; }
.cf-rk-open { color:#0e9c90; }
.cf-rk-close { color:var(--cf-coral); }
.cf-rk-sep { color:#c9c2b9; font-size:12px; }
.cf-chance { font-size:11px; font-weight:800; padding:2px 9px; border-radius:50px; margin-left:6px; }

.cf-noresults { background:#fff; border:1px dashed var(--cf-line); border-radius:14px; padding:40px 20px;
  text-align:center; color:#8a8178; font-size:14px; }
.cf-note { font-size:11.5px; color:#9a9189; margin-top:16px; line-height:1.6; }

@media (max-width:860px){
  .cf-layout { grid-template-columns:1fr; }
  .cf-rankbar-fields { grid-template-columns:1fr 1fr; }
  .cf-rankbar-fields .cf-field:first-child, .cf-runbtn { grid-column:1 / -1; }
  .cf-mobile-filter { display:inline-flex; align-items:center; gap:6px; background:#fff; border:1px solid var(--cf-line);
    border-radius:10px; padding:10px 16px; font-size:13px; font-weight:700; color:#3a3a4a; cursor:pointer; }
  .cf-sidebar { position:fixed; top:0; left:0; bottom:0; width:300px; max-width:86vw; z-index:60; border-radius:0;
    transform:translateX(-105%); transition:transform .25s; overflow-y:auto; padding-top:0; }
  .cf-sidebar-open { transform:translateX(0); }
  .cf-sidebar-head { display:flex; justify-content:space-between; align-items:center; padding:16px;
    border-bottom:1px solid var(--cf-line); font-family:Sora,sans-serif; font-weight:800; position:sticky; top:0; background:#fff; }
  .cf-sidebar-close { border:none; background:none; cursor:pointer; color:#6b6258; }
  .cf-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.4); z-index:55; }
  .cf-card-main { flex-wrap:wrap; }
  .cf-card-actions { flex-direction:row; width:100%; justify-content:flex-end; }
}
@media (min-width:861px){
  .cf-sidebar-close { display:none; }
}
@media (max-width:520px){
  .cf-rankbar-fields { grid-template-columns:1fr; }
}
`;
