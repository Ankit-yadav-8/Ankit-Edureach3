/* Campus photo pool from Unsplash (free to use under the Unsplash license).
   👉 Replace these with each college's REAL campus photos when available.
   Each URL is an images.unsplash.com photo with sizing params. */
const P = (id, caption) => ({
  url: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`,
  caption,
});

export const CAMPUS_PHOTOS = [
  P("1562774053-701939374585", "Campus & main building"),
  P("1541339907198-e08756dedf3f", "Academic block"),
  P("1498243691581-b145c3f54a5a", "Central library"),
  P("1607237138185-eedd9c632b0b", "Lecture hall"),
  P("1567168544646-208fa5d408fb", "Campus walkways"),
  P("1523050854058-8df90110c9f1", "Convocation"),
  P("1473445730015-841f29a9490b", "Students on campus"),
  P("1532649538693-f3a2ec1bf8bd", "Study spaces"),
  P("1574958269340-fa927503f3dd", "Labs & research"),
  P("1581092160562-40aa08e78837", "Innovation & labs"),
];

/* Stable per-college selection so each college shows a consistent set. */
export function photosForCollege(slug, n = 6) {
  let h = 0;
  for (let i = 0; i < (slug || "").length; i++) h = (h * 31 + slug.charCodeAt(i)) % 9973;
  const start = h % CAMPUS_PHOTOS.length;
  return Array.from({ length: n }, (_, i) => CAMPUS_PHOTOS[(start + i) % CAMPUS_PHOTOS.length]);
}
