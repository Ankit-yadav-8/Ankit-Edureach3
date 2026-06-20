/* ============================================================
   josaaRounds.js — shared JoSAA 2026 counselling data
   Used by the JoSAA Round 1 Result page and the global
   "Live Counselling Updates" popup so the Freeze / Float /
   Slide explanations and quick-links stay in one place.
   ============================================================ */
import {
  Lock, TrendingUp, Repeat, Trophy, Award, CalendarDays, Medal,
  FileText, Sparkles, GitCompare, ExternalLink,
} from "lucide-react";

/* Route of the dedicated Round 1 seat-allotment result page. */
export const ROUND1_PATH = "/josaa-round-1-result-2026";

/* ── Freeze / Float / Slide — the three seat-acceptance actions ──────────────
   After every JoSAA round you must pick exactly one of these for your
   allotted seat. Choosing the right one each round is the single most
   important decision in the whole counselling process. */
export const FFS_OPTIONS = [
  {
    key: "freeze",
    label: "Freeze",
    icon: Lock,
    color: "#15a06e",
    tagline: "Accept & stop here",
    fn: "You accept the seat allotted in this round as final and exit the counselling process.",
    happens:
      "Your current seat is locked and confirmed. You are NOT considered for any upgrade in later rounds — what you have is what you keep.",
    best:
      "Choose Freeze when you are fully happy with both the institute and the branch, and don't want to risk it for an upgrade.",
    warn: "Once frozen, there is no going back to a higher choice — so be sure.",
  },
  {
    key: "float",
    label: "Float",
    icon: TrendingUp,
    color: "#FF693D",
    tagline: "Keep it, aim higher",
    fn: "You accept the current seat but stay in the running for ANY higher choice in your locked list.",
    happens:
      "Your present seat is held as a safety net. In later rounds you can be upgraded to any higher-preference option — a better branch OR a better institute.",
    best:
      "Choose Float when you'd happily move up to a better branch or a better college if it opens, and want to stay protected meanwhile.",
    warn: "If you get upgraded, the old seat is released automatically — you can't decline the upgrade.",
  },
  {
    key: "slide",
    label: "Slide",
    icon: Repeat,
    color: "#6366f1",
    tagline: "Same college, better branch",
    fn: "You accept the current seat but stay in the running only for a better branch within the SAME institute.",
    happens:
      "You hold your seat and may be upgraded to a higher-preference branch in the same college — but you will never be moved to a different institute.",
    best:
      "Choose Slide when you love the college and only want to climb to a better branch inside it.",
    warn: "Slide will never change your institute — only the branch can improve.",
  },
];

/* ── Quick links surfaced in the popup and the result page ───────────────────
   `external: true` opens in a new tab; everything else is an in-app route. */
export const QUICK_LINKS = [
  { label: "JoSAA 2026 Round 1 Seat Result", to: ROUND1_PATH, icon: Trophy, tag: "Allotment is OUT — view now", hot: true },
  { label: "JoSAA 2026 Counselling Plan", to: "/josaa-2026", icon: Award, tag: "Expert choice-filling · ₹299" },
  { label: "Counselling Planner & Round Dates", to: "/planner", icon: CalendarDays, tag: "Every JoSAA & CSAB date" },
  { label: "JEE Advanced 2026 Result & Rank List", to: "/jee-advanced-result-2026", icon: Medal, tag: "Toppers, cutoffs & stats" },
  { label: "Official Opening / Closing Cutoffs", to: "/cutoffs", icon: FileText, tag: "Real round-wise rank data" },
  { label: "Colleges For You", to: "/for-you", icon: Sparkles, tag: "Personalised for your rank" },
  { label: "Compare Colleges Side by Side", to: "/compare", icon: GitCompare, tag: "Branch, fees, placements" },
  { label: "JoSAA Official Portal", to: "https://josaa.nic.in", icon: ExternalLink, tag: "josaa.nic.in", external: true },
];
