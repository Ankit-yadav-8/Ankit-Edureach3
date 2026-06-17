/* BranchVsCollegePage — standalone page for the Branch vs College assessment. */
import { useEffect } from "react";
import Seo from "../components/Seo.jsx";
import BranchVsCollege from "../components/home/BranchVsCollege.jsx";

export default function BranchVsCollegePage() {
  useEffect(() => { document.title = "Branch vs College — should the institute or the branch win? · College Parichay"; }, []);
  return (
    <>
      <Seo path="/branch-vs-college" />
      <BranchVsCollege asPage />
    </>
  );
}
