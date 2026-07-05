/* Tools — dedicated, indexable landing page for the "Smart Tools" hub
   that also appears on the home page. Gives the section its own URL
   (/tools), canonical, SEO meta and an ItemList schema so search
   engines can index and surface it independently. */
import ToolsGrid from "../components/home/ToolsGrid.jsx";
import Seo, { SITE_URL } from "../components/Seo.jsx";
import BackButton from "../components/BackButton.jsx";

/* Real tools + their in-app destinations — used for the ItemList schema. */
const TOOL_LINKS = [
  ["Events & Fest Marketplace", "/campus-fests"],
  ["JEE Rank Predictor", "/jee-main#rank"],
  ["College Predictor", "/jee-advanced#college"],
  ["Official Cutoff Analysis", "/cutoffs"],
  ["Branch Insights Hub", "/branches"],
  ["Trade-off Analyzer", "/branch-vs-college"],
  ["Campus Map Explorer", "/map"],
  ["Choice List Planner", "/planner"],
];

export default function Tools() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "College Parichay Smart Tools for JEE 2026",
    description:
      "Every College Parichay tool for JEE 2026 — rank & college predictor, cutoff analysis, branch insights, trade-off analyzer, campus map and choice-list planner.",
    itemListElement: TOOL_LINKS.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      url: SITE_URL + path,
    })),
  };

  return (
    <div className="page">
      <div className="container"><BackButton style={{ margin: "0 0 2px" }} /></div>
      <Seo
        title="Smart Tools for JEE 2026 — Rank & College Predictor, Cutoffs, Planner"
        description="Every College Parichay tool in one place — free JEE rank predictor, JoSAA college predictor, official cutoff analysis, branch insights, trade-off analyzer, campus map and choice-list planner. Built for JEE 2026."
        path="/tools"
        keywords={[
          "JEE 2026 tools", "JEE rank predictor", "JoSAA college predictor",
          "cutoff analysis", "choice list planner", "branch selector",
        ]}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Smart Tools", path: "/tools" }]}
        jsonLd={jsonLd}
      />
      <ToolsGrid />
    </div>
  );
}
