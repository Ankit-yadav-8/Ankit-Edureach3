/* clTheme — Campusloom-inspired palette + shared style tokens.
   Warm cream surfaces, coral-red accent, green = high / amber = medium.
   Imported by the new home sections and branch pages so every surface
   stays visually consistent. */

export const CL = {
  cream:    "#FFFFFF",   // page / section background (white)
  cream2:   "#F8FAFC",   // inset card / soft fill (Slate 50)
  cream3:   "#E2E8F0",   // borders on cream (Slate 200)
  card:     "#FFFFFF",
  ink:      "#0F172A",   // headings (Slate 900)
  ink2:     "#334155",   // (Slate 700)
  body:     "#475569",   // body copy (Slate 600)
  muted:    "#94A3B8",   // (Slate 400)
  coral:    "#4F46E5",   // primary accent (Indigo 500)
  coralDk:  "#4338CA",   // (Indigo 600)
  coralSoft:"#E0E7FF",   // (Indigo 100)
  green:    "#059669",   // (Emerald 600)
  greenSoft:"#D1FAE5",   // (Emerald 100)
  amber:    "#D97706",   // (Amber 600)
  amberSoft:"#FEF3C7",   // (Amber 100)
  violet:   "#7C3AED",   // (Violet 600)
  blue:     "#2563EB",   // (Blue 600)
  line:     "rgba(15,23,42,.08)",
  shadow:   "0 6px 28px rgba(15,23,42,.07)",
  shadowLg: "0 18px 50px rgba(15,23,42,.10)",
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
