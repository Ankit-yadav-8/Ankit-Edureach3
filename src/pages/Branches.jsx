/* Branches — standalone Branch Explorer page. Reuses the home BranchCatalog
   section under a page header with a back control. */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Seo from "../components/Seo.jsx";
import BranchCatalog from "../components/home/BranchCatalog.jsx";
import { CL } from "../components/home/clTheme.js";

export default function Branches() {
  const nav = useNavigate();
  useEffect(() => { document.title = "Branch Explorer — 220+ engineering branches · College Parichay"; }, []);

  const goHome = () => nav("/");

  return (
    <div style={{ background: CL.cream2, paddingTop: 110, minHeight: "100vh" }}>
      <Seo path="/branches" />
      <div className="container" style={{ marginBottom: 8 }}>
        <button
          onClick={goHome}
          aria-label="Back to home"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, color: CL.ink,
            fontSize: 13.5, fontWeight: 700, fontFamily: CL.display,
            background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 50,
            padding: "10px 20px", boxShadow: CL.shadow, cursor: "pointer",
            transition: "background .18s, border-color .18s, transform .18s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = CL.coralSoft; e.currentTarget.style.borderColor = CL.coral + "55"; e.currentTarget.style.transform = "translateX(-2px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = CL.card; e.currentTarget.style.borderColor = CL.line; e.currentTarget.style.transform = ""; }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>
      <BranchCatalog />
    </div>
  );
}
