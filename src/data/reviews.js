/* Seed/demo reviews shown before any user adds their own.
   User-added reviews are stored in localStorage per college. */
export const SEED_REVIEWS = {
  _default: [
    { name: "Aarav S.", rating: 5, year: "2024", text: "Incredible peer group and placements. Academics are tough but the exposure is unmatched.", tags: ["Placements", "Academics"] },
    { name: "Priya M.", rating: 4, year: "2023", text: "Great campus life and clubs. Hostels could be better but overall a wonderful experience.", tags: ["Campus Life", "Hostel"] },
    { name: "Rohan K.", rating: 4, year: "2024", text: "Strong core branches and supportive professors. Fest season is the best part of the year.", tags: ["Faculty", "Fests"] },
  ],
};

export function defaultReviews() {
  return SEED_REVIEWS._default;
}
