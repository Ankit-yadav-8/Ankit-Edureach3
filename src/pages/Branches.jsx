/* Branches — standalone Branch Explorer page. Reuses the home BranchCatalog
   section under a page header with a back control. */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Seo from "../components/Seo.jsx";
import BranchCatalog from "../components/home/BranchCatalog.jsx";

export default function Branches() {
  const nav = useNavigate();
  useEffect(() => { document.title = "Branch Explorer — 220+ engineering branches · College Parichay"; }, []);

  const goHome = () => nav("/");

  return (
    <div style={{ background: "var(--page-bg)", paddingTop: 110, minHeight: "100vh" }}>
      <Seo path="/branches" />
      <div className="container" style={{ marginBottom: 8 }}>
        <button onClick={goHome} aria-label="Back to home" className="cp-back-btn">
          <ArrowLeft size={16} /> Back
        </button>
      </div>
      <BranchCatalog />
    </div>
  );
}
