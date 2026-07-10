/* clTheme — College Parichay palette + shared style tokens.
   Warm cream surfaces, coral-red accent, green = high / amber = medium.
   Imported by the new home sections and branch pages so every surface
   stays visually consistent. */

export const CL = {
  cream:    "var(--page-bg)",   // page / section background
  cream2:   "#F7F7F8",   // inset card / soft fill (barely-there neutral)
  cream3:   "#ECEAEF",   // borders on cream
  card:     "#FFFFFF",
  ink:      "#211D2E",   // headings
  ink2:     "#3B3743",
  body:     "#6B6770",   // body copy
  muted:    "#9A949F",
  coral:    "#FF693D",   // primary accent
  coralDk:  "#E0421F",
  coralSoft:"#FCE7E0",
  green:    "#0FAE6E",
  greenSoft:"#D8F3E6",
  amber:    "#E29A2E",
  amberSoft:"#FBEBCF",
  violet:   "#7B5EA7",
  blue:     "#3A86FF",
  line:     "rgba(33,29,46,.08)",
  shadow:   "0 6px 28px rgba(33,29,46,.07)",
  shadowLg: "0 18px 50px rgba(33,29,46,.10)",
  display:  "'Space Grotesk','Sora',sans-serif",
};

/* chance → tone (green high / amber medium / coral low) */
export function chanceTone(level) {
  if (level === "high")   return { fg: "#0a8f5b", bg: CL.greenSoft, label: "HIGH CHANCE" };
  if (level === "medium") return { fg: "#b9781a", bg: CL.amberSoft, label: "MEDIUM CHANCE" };
  return { fg: CL.coralDk, bg: CL.coralSoft, label: "LOW CHANCE" };
}

/* shared eyebrow pill */
export const clEyebrow = {
  display: "inline-flex", alignItems: "center", gap: 7,
  fontSize: 11.5, fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase",
  color: CL.coralDk, background: CL.coralSoft, border: `1px solid ${CL.coral}33`,
  padding: "6px 14px", borderRadius: 50,
};
