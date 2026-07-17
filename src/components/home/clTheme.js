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
  muted:    "#6B6770",   // was #9A949F — 2.95:1 on white, below the 4.5:1 AA floor
  coral:    "#FF693D",   // primary accent — DECORATIVE ONLY (icons, fills, borders)
  /* Text-safe coral. #FF693D is only 2.86:1 on white, so it fails AA as text and
     as a button fill under white text. Use coralText for any coral *text* and
     for solid coral buttons; keep `coral` for non-text brand colour.
       #B93D12 on #FFFFFF = 5.62:1 · white on #B93D12 = 5.62:1 · on #FCE7E0 = 4.72:1 */
  coralText:"#B93D12",
  coralDk:  "#B93D12",   // was #E0421F (4.23:1 on white, 3.55:1 on coralSoft)
  coralSoft:"#FCE7E0",
  /* Same split as coral: the bright value is for fills/icons/chart marks, the
     *Text value is the AA-safe one for anything a user has to read.
       green  #0FAE6E = 2.88:1 on white -> greenText #087347 = 5.91:1
       amber  #E29A2E = 2.36:1 on white -> amberText #8F570B = 5.94:1
       blue   #3A86FF = 3.48:1 on white -> blueText  #175FD0 = 5.86:1
     violet #7B5EA7 already clears at 5.25:1, so it needs no variant. */
  green:    "#0FAE6E",
  greenText:"#087347",
  greenSoft:"#D8F3E6",
  amber:    "#E29A2E",
  amberText:"#8F570B",
  amberSoft:"#FBEBCF",
  violet:   "#7B5EA7",
  blue:     "#3A86FF",
  blueText: "#175FD0",
  line:     "rgba(33,29,46,.08)",
  shadow:   "0 6px 28px rgba(33,29,46,.07)",
  shadowLg: "0 18px 50px rgba(33,29,46,.10)",
  display:  "'Space Grotesk','Sora',sans-serif",
};

/* chance → tone (green high / amber medium / coral low).
   fg values are the AA-safe text variants — these render as small label text. */
export function chanceTone(level) {
  if (level === "high")   return { fg: CL.greenText, bg: CL.greenSoft, label: "HIGH CHANCE" };
  if (level === "medium") return { fg: CL.amberText, bg: CL.amberSoft, label: "MEDIUM CHANCE" };
  return { fg: CL.coralDk, bg: CL.coralSoft, label: "LOW CHANCE" };
}

/* shared eyebrow pill */
export const clEyebrow = {
  display: "inline-flex", alignItems: "center", gap: 7,
  fontSize: 11.5, fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase",
  color: CL.coralDk, background: CL.coralSoft, border: `1px solid ${CL.coral}33`,
  padding: "6px 14px", borderRadius: 50,
};
