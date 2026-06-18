/* Branches — standalone Branch Catalog page. Reuses the home BranchCatalog
   section under a page header with a back control. */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Seo from "../components/Seo.jsx";
import BranchCatalog from "../components/home/BranchCatalog.jsx";
import { CL } from "../components/home/clTheme.js";

export default function Branches() {
  const nav = useNavigate();
  useEffect(() => { document.title = "Branch Catalog — 220+ engineering branches · College Parichay"; }, []);

  const goBack = () => { if (window.history.length > 1) nav(-1); else nav("/"); };

  return (
    <div style={{ background: CL.cream2, paddingTop: 92, minHeight: "100vh" }}>
      <Seo path="/branches" />
      <div className="container" style={{ marginBottom: 4 }}>
        <button onClick={goBack} style={{
          display: "inline-flex", alignItems: "center", gap: 8, color: CL.ink,
          fontSize: 13.5, fontWeight: 700, fontFamily: CL.display,
          background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 50,
          padding: "9px 18px", boxShadow: CL.shadow, cursor: "pointer",
        }}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>
      <BranchCatalog />
    </div>
  );
}
