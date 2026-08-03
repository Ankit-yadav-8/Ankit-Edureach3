/* ============================================================
   Seo.jsx — per-page SEO for the client-rendered SPA.

   Because this is a Vite SPA (no server rendering), every route
   otherwise serves the homepage <title> / description from
   index.html. This component updates the document <head> per
   route so each page (especially each college) can rank for its
   own queries and show a correct title + description in Google,
   social shares, and AI answer engines.

   Usage:
     <Seo
       title="IIT Bombay — Cutoffs, Reviews & Placements"
       description="..."
       path="/colleges/iit-bombay"
       jsonLd={ {...schema.org object...} }   // optional
     />

   `title` is automatically suffixed with the brand. Pass
   `rawTitle` to use the title exactly as given.
   ============================================================ */

import { useEffect } from "react";

export const SITE_URL = "https://collegeparichay.in";
export const BRAND = "CollegeParichay";

const DEFAULT_TITLE =
  "CollegeParichay — JEE Rank Predictor & IIT NIT IIIT College Reviews | By IIT Roorkee Alumni";
const DEFAULT_DESC =
  "CollegeParichay is a student-built platform by IIT Roorkee alumni — get free JEE Main & Advanced rank predictions, compare IIT NIT IIIT cutoffs, read college reviews, shortlist colleges, and track JoSAA / CSAB counselling deadlines.";
const DEFAULT_IMAGE = `${SITE_URL}/cplogo.svg`;

/** Create or update a <meta> tag, returning a restore fn. */
function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Create or update <link rel>, returning the element. */
function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Turn [{name, path}] into a schema.org BreadcrumbList graph. */
function breadcrumbGraph(crumbs) {
  if (!crumbs || !crumbs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: SITE_URL + (c.path === "/" ? "/" : c.path.replace(/\/+$/, "")) } : {}),
    })),
  };
}

export default function Seo({
  title,
  rawTitle,
  description,
  path,
  image,
  type = "website",
  robots = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  jsonLd,
  keywords,
  breadcrumbs,
}) {
  const fullTitle = rawTitle || (title ? `${title} | ${BRAND}` : DEFAULT_TITLE);
  const desc = description || DEFAULT_DESC;
  const img = image || DEFAULT_IMAGE;
  const kw = Array.isArray(keywords) ? keywords.filter(Boolean).join(", ") : keywords || null;

  // canonical / og:url — strip query + hash, normalise trailing slash
  const cleanPath =
    path ||
    (typeof window !== "undefined" ? window.location.pathname : "/");
  const url = SITE_URL + (cleanPath === "/" ? "/" : cleanPath.replace(/\/+$/, ""));

  // Combine page graph(s) + breadcrumb graph into one array of JSON-LD blocks.
  const graphs = [
    ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []),
    breadcrumbGraph(breadcrumbs),
  ].filter(Boolean);

  // Serialise once so an inline object prop doesn't re-trigger the effect
  // on every parent re-render (only a real content change does).
  const graphsStr = graphs.length ? JSON.stringify(graphs) : null;

  useEffect(() => {
    document.title = fullTitle;

    setMeta("name", "description", desc);
    setMeta("name", "robots", robots);
    if (kw) setMeta("name", "keywords", kw);
    setLink("canonical", url);

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", type);
    setMeta("property", "og:image", img);
    setMeta("property", "og:site_name", BRAND);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", img);

    // Per-page JSON-LD — one <script> per graph, marked for cleanup on unmount.
    const scripts = [];
    if (graphsStr) {
      for (const g of JSON.parse(graphsStr)) {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.dataset.seoPage = "true";
        s.textContent = JSON.stringify(g);
        document.head.appendChild(s);
        scripts.push(s);
      }
    }

    return () => {
      // Restore site defaults so a page without <Seo> never shows
      // a stale title/description left over from the previous route.
      document.title = DEFAULT_TITLE;
      setMeta("name", "description", DEFAULT_DESC);
      setLink("canonical", `${SITE_URL}/`);
      scripts.forEach((s) => s.parentNode && s.parentNode.removeChild(s));
    };
  }, [fullTitle, desc, url, img, type, robots, kw, graphsStr]);

  return null;
}
