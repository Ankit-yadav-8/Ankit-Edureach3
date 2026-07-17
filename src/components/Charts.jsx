/* ============================================================
   Charts.jsx — lazy façade over ChartsImpl.jsx (recharts)
   ------------------------------------------------------------
   Same exports, same props as before. The only change is WHEN
   recharts loads.

   Why this indirection exists:
   recharts is ~430KB and eight lazy routes import these charts.
   Because the module was shared by that many dynamic chunks, the
   bundler hoisted it into their common ancestor — the entry —
   so every page statically imported and preloaded all of recharts,
   including pages with no chart at all (/admin, /tools, /mentor).
   Manual chunking can't undo that: the edge is created by the
   static import, not by the chunk layout.

   Keeping the recharts import behind a dynamic import() is what
   actually breaks the edge. Charts.jsx is now cheap to import
   from anywhere, and recharts is fetched only when a chart really
   renders.

   Each placeholder reserves the chart's exact height so deferring
   the load costs no layout shift (CLS is 0 and must stay 0).
   ============================================================ */
import { lazy, Suspense } from "react";

const impl = () => import("./ChartsImpl.jsx");

/* One lazy component per named export. React.lazy resolves a module with a
   `default`, so each pick is mapped onto one. */
const lazyPick = (name) => lazy(() => impl().then((m) => ({ default: m[name] })));

const CenterDonutImpl   = lazyPick("CenterDonut");
const DonutLegendImpl   = lazyPick("DonutLegend");
const PieWithLegendImpl = lazyPick("PieWithLegend");
const BarsImpl          = lazyPick("Bars");
const TrendImpl         = lazyPick("Trend");
const GaugeImpl         = lazyPick("Gauge");

/* Holds the slot at full height while the chunk arrives. */
function Slot({ height }) {
  return (
    <div
      aria-hidden
      style={{
        height, width: "100%", borderRadius: 12,
        background: "linear-gradient(90deg, #f7f4f1 25%, #efeae5 37%, #f7f4f1 63%)",
        backgroundSize: "400% 100%",
        animation: "cp-chart-shimmer 1.4s ease-in-out infinite",
      }}
    />
  );
}

/* Defaults mirror ChartsImpl's own signatures — the placeholder must reserve
   the same space the chart will occupy, or deferring it would shift layout. */
export function CenterDonut(props) {
  return (
    <Suspense fallback={<Slot height={props.height ?? 200} />}>
      <CenterDonutImpl {...props} />
    </Suspense>
  );
}
export function DonutLegend(props) {
  // A text legend, not a chart — no meaningful height to reserve.
  return <Suspense fallback={null}><DonutLegendImpl {...props} /></Suspense>;
}
export function PieWithLegend(props) {
  return (
    <Suspense fallback={<Slot height={props.height ?? 220} />}>
      <PieWithLegendImpl {...props} />
    </Suspense>
  );
}
export function Bars(props) {
  return (
    <Suspense fallback={<Slot height={props.height ?? 280} />}>
      <BarsImpl {...props} />
    </Suspense>
  );
}
export function Trend(props) {
  return (
    <Suspense fallback={<Slot height={props.height ?? 280} />}>
      <TrendImpl {...props} />
    </Suspense>
  );
}
export function Gauge(props) {
  return (
    <Suspense fallback={<Slot height={props.height ?? 200} />}>
      <GaugeImpl {...props} />
    </Suspense>
  );
}
