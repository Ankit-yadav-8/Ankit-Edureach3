/* ============================================================
   routes.mjs — single source of truth for every crawlable route
   on the site, derived from the data files. Shared by
   genSitemap.mjs (sitemaps) and prerender.mjs (static HTML).
   ============================================================ */

import { COLLEGES } from "../src/data/colleges.js";
import { NEET_COLLEGES } from "../src/data/neetColleges.js";
import { BRANCHES } from "../src/data/branches.js";
import { EXAMS } from "../src/data/exams.js";
import { NEWS } from "../src/data/news.js";
import { BLOG_POSTS } from "../src/data/blog.js";
import { PRIVATE_UNIS } from "../src/data/counselling.js";
import { TEAM } from "../src/data/team.js";

export const SITE = "https://collegeparichay.in";

// Static routes: [path, priority, changefreq]
export const STATIC_ROUTES = [
  ["/", "1.0", "daily"],
  ["/colleges", "0.9", "daily"],
  ["/jee-main", "0.9", "weekly"],
  ["/jee-advanced", "0.9", "weekly"],
  ["/jee-advanced-result-2026", "0.7", "weekly"],
  ["/for-you", "0.9", "weekly"],
  ["/compare", "0.7", "weekly"],
  ["/tools", "0.8", "weekly"],
  ["/reviews", "0.7", "weekly"],
  ["/cutoffs", "0.8", "weekly"],
  ["/exams", "0.8", "weekly"],
  ["/compare-exams", "0.6", "monthly"],
  ["/josaa-2026", "0.8", "daily"],
  ["/josaa-round-1-result-2026", "0.7", "weekly"],
  ["/planner", "0.6", "weekly"],
  ["/map", "0.6", "monthly"],
  ["/scholarships", "0.6", "monthly"],
  ["/jee-resources", "0.6", "weekly"],
  ["/ai", "0.6", "weekly"],
  ["/jee-strategy", "0.7", "weekly"],
  ["/class-11", "0.6", "weekly"],
  ["/class-12", "0.6", "weekly"],
  ["/branches", "0.8", "weekly"],
  ["/branch-vs-college", "0.7", "weekly"],
  ["/exam-buzz", "0.7", "daily"],
  ["/neet", "0.7", "weekly"],
  ["/neet-strategy", "0.7", "weekly"],
  ["/neet-colleges", "0.8", "weekly"],
  ["/blog", "0.7", "weekly"],
  ["/mentorship", "0.7", "weekly"],
  ["/mentorship/jee-2027", "0.7", "weekly"],
  ["/mentorship/jee-2028", "0.7", "weekly"],
  ["/mentorship/neet", "0.7", "weekly"],
  ["/private-universities", "0.7", "weekly"],
  ["/campus-fests", "0.6", "weekly"],
  ["/campus-notes", "0.6", "weekly"],
  ["/community", "0.5", "weekly"],
  ["/how-to-use", "0.4", "monthly"],
  ["/about", "0.5", "monthly"],
  ["/privacy", "0.3", "monthly"],
  ["/terms", "0.3", "monthly"],
];

const slugList = (arr, prefix, priority, changefreq) =>
  arr.filter((x) => x?.slug).map((x) => [`${prefix}/${x.slug}`, priority, changefreq]);

/* Grouped routes → drives per-type sitemaps. Each entry: { name, urls: [[path,priority,changefreq]] } */
export function routeGroups() {
  return [
    { name: "static",   urls: STATIC_ROUTES },
    { name: "colleges", urls: slugList(COLLEGES, "/colleges", "0.8", "weekly") },
    { name: "private",  urls: slugList(PRIVATE_UNIS, "/private", "0.7", "weekly") },
    { name: "neet",     urls: slugList(NEET_COLLEGES, "/neet-colleges", "0.7", "weekly") },
    { name: "branches", urls: slugList(BRANCHES, "/branches", "0.7", "weekly") },
    { name: "exams",    urls: slugList(EXAMS, "/exams", "0.7", "weekly") },
    { name: "news",     urls: slugList(NEWS, "/news", "0.6", "weekly") },
    { name: "blog",     urls: slugList(BLOG_POSTS, "/blog", "0.7", "weekly") },
    { name: "team",     urls: TEAM.filter((t) => t?.id).map((t) => [`/team/${t.id}`, "0.4", "monthly"]) },
  ];
}

/* Flat list of every path (no metadata) for the prerenderer. */
export function allPaths() {
  return routeGroups().flatMap((g) => g.urls.map(([p]) => p));
}
