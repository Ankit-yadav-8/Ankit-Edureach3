/* Branches — standalone Branch Catalog page. Reuses the home BranchCatalog
   section under a page header. */
import { useEffect } from "react";
import Seo from "../components/Seo.jsx";
import BranchCatalog from "../components/home/BranchCatalog.jsx";
import { CL } from "../components/home/clTheme.js";

export default function Branches() {
  useEffect(() => { document.title = "Branch Catalog — 220+ engineering branches · College Parichay"; }, []);
  return (
    <div style={{ background: CL.cream2, paddingTop: 56 }}>
      <Seo path="/branches" />
      <BranchCatalog />
    </div>
  );
}
