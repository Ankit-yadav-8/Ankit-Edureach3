/* Reviews — dedicated, shareable/indexable page for the "Campus Reviews"
   section (hostel & mess reviews) that also appears on the home page.
   Gives it its own URL (/reviews) so the review hub can be linked and
   indexed independently. */
import CollegeReviews from "../components/home/CollegeReviews.jsx";
import Seo from "../components/Seo.jsx";
import BackButton from "../components/BackButton.jsx";

export default function Reviews() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "College Hostel & Mess Reviews",
    description:
      "Honest, student-written reviews of hostel and mess life across IITs, NITs, IIITs and other colleges. Read reviews or share your own.",
  };

  return (
    <div className="page">
      <div className="container"><BackButton style={{ margin: "0 0 2px" }} /></div>
      <Seo
        title="Give & Read College Reviews — Hostel & Mess Ratings"
        description="Know and give honest college reviews — read and write student-written hostel & mess reviews for IITs, NITs, IIITs and more. Ratings, quick tags and real comments about campus life on College Parichay."
        path="/reviews"
        keywords={[
          "college reviews", "hostel reviews", "mess reviews",
          "IIT hostel review", "NIT campus life", "student reviews",
        ]}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Campus Reviews", path: "/reviews" }]}
        jsonLd={jsonLd}
      />
      <CollegeReviews />
    </div>
  );
}
