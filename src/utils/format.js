/* Formatting helpers (Indian numbering, lakh/crore for money). */
export const fmtRank = (n) =>
  n == null ? "—" : Number(n).toLocaleString("en-IN");

export function fmtINR(n) {
  if (n == null) return "—";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2).replace(/\.00$/, "")} L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export const fmtINRShort = (n) =>
  n == null ? "—" : n >= 10000000 ? `${(n / 10000000).toFixed(1)}Cr`
    : n >= 100000 ? `${(n / 100000).toFixed(1)}L` : `${(n / 1000).toFixed(0)}K`;
