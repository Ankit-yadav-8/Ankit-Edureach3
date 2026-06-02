/* ============================================================
   Charts.jsx — production-grade recharts wrappers
   ------------------------------------------------------------
   Components: CenterDonut · DonutLegend · PieWithLegend
               Bars · Trend · Gauge
   All props-compatible with the previous version.
   ============================================================ */
import { useState, useCallback, useMemo } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend,
  RadialBarChart, RadialBar,
} from "recharts";

// ─── Palette ──────────────────────────────────────────────────
export const PALETTE = [
  "#FF6B35", // coral-orange
  "#00C9A7", // emerald
  "#7B5EA7", // violet
  "#FF3B5C", // rose-red
  "#FFB703", // gold
  "#3A86FF", // electric blue
  "#06D6A0", // mint
  "#FF6B9D", // hot-pink
];

// ─── Color math ───────────────────────────────────────────────
/** Convert any 6-char hex to HSL, darken 14 %, saturate 8 %. */
function hoverColor(hex) {
  const c = hex.replace("#", "");
  let r = parseInt(c.slice(0, 2), 16) / 255;
  let g = parseInt(c.slice(2, 4), 16) / 255;
  let b = parseInt(c.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  l = Math.max(0.05, l - 0.14);
  s = Math.min(1, s * 1.08);

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r2, g2, b2;
  if (s === 0) { r2 = g2 = b2 = l; }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r2 = hue2rgb(p, q, h + 1 / 3);
    g2 = hue2rgb(p, q, h);
    b2 = hue2rgb(p, q, h - 1 / 3);
  }
  const x = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${x(r2)}${x(g2)}${x(b2)}`;
}

/** Hex → rgba helper */
const rgba = (hex, a) => {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

// ─── Shared tooltip styles ────────────────────────────────────
const TT_STYLE = {
  background: "#ffffff",
  border: "1px solid #f0f2f8",
  borderRadius: 14,
  fontSize: 13,
  padding: "10px 14px",
  boxShadow: "0 8px 32px rgba(13,27,62,0.10), 0 1px 4px rgba(13,27,62,0.06)",
};
const TT_LABEL = {
  color: "#9ca3af",
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  marginBottom: 5,
};
const TT_ITEM = { color: "#111827", fontWeight: 700, fontSize: 14 };

// ─── PieTooltip ───────────────────────────────────────────────
function PieTooltip({ active, payload, fmt, colors }) {
  if (!active || !payload?.length) return null;
  const item  = payload[0];
  const idx   = item.payload?.index ?? 0;
  const color = colors
    ? colors[idx % colors.length]
    : item.payload?.fill || PALETTE[idx % PALETTE.length];
  const value = fmt ? fmt(item.value) : item.value;

  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${rgba(color, 0.2)}`,
      borderRadius: 12,
      padding: "9px 14px",
      boxShadow: `0 8px 28px ${rgba(color, 0.18)}, 0 1px 4px rgba(0,0,0,0.05)`,
      display: "flex",
      alignItems: "center",
      gap: 9,
      minWidth: 130,
    }}>
      <span style={{
        width: 10, height: 10, borderRadius: "50%",
        background: color, flexShrink: 0,
        boxShadow: `0 0 8px ${rgba(color, 0.55)}`,
      }} />
      <span style={{ flex: 1, fontSize: 12.5, color: "#6b7280", fontWeight: 500 }}>
        {item.name}
      </span>
      <strong style={{ fontSize: 14, color: "#111827", marginLeft: 4 }}>
        {value}
      </strong>
    </div>
  );
}

// ─── Custom axis tick ─────────────────────────────────────────
function XTick({ x, y, payload, fmt, angle }) {
  return (
    <text
      x={x} y={y + 10}
      textAnchor={angle ? "end" : "middle"}
      transform={angle ? `rotate(${angle}, ${x}, ${y})` : undefined}
      style={{ fontSize: 11.5, fill: "#9ca3af", fontWeight: 500 }}
    >
      {fmt ? fmt(payload.value) : payload.value}
    </text>
  );
}

// ─── Empty state ──────────────────────────────────────────────
function ChartEmpty({ height }) {
  return (
    <div style={{
      height, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      color: "#d1d5db", gap: 8,
    }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M7 16l3-4 3 3 3-5" />
      </svg>
      <span style={{ fontSize: 12, fontWeight: 500, color: "#d1d5db" }}>No data</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CenterDonut
   props: data [{name, value}], centerLabel, centerSub,
          height, colors, fmt
══════════════════════════════════════════════════════════════ */
export function CenterDonut({
  data, centerLabel, centerSub,
  height = 200, colors = PALETTE, fmt,
}) {
  const [activeIdx, setActiveIdx] = useState(null);
  const onEnter = useCallback((_, i) => setActiveIdx(i), []);
  const onLeave = useCallback(() => setActiveIdx(null), []);

  const indexed = useMemo(() => data.map((d, i) => ({ ...d, index: i })), [data]);

  if (!data?.length) return <ChartEmpty height={height} />;

  const activeColor = activeIdx !== null ? colors[activeIdx % colors.length] : null;
  const activeValue = activeIdx !== null && data[activeIdx]
    ? (fmt ? fmt(data[activeIdx].value) : data[activeIdx].value)
    : centerLabel;
  const activeName = activeIdx !== null && data[activeIdx]
    ? data[activeIdx].name
    : (centerSub ?? "");

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={indexed}
            dataKey="value"
            nameKey="name"
            innerRadius="60%"
            outerRadius="90%"
            paddingAngle={2.5}
            stroke="none"
            onMouseLeave={onLeave}
            isAnimationActive
            animationDuration={600}
            animationEasing="ease-out"
          >
            {indexed.map((_, i) => {
              const base     = colors[i % colors.length];
              const isActive = activeIdx === i;
              return (
                <Cell
                  key={i}
                  fill={isActive ? hoverColor(base) : base}
                  opacity={activeIdx !== null && !isActive ? 0.55 : 1}
                  style={{ cursor: "pointer", transition: "opacity 0.2s, fill 0.2s" }}
                  onMouseEnter={(e) => onEnter(e, i)}
                />
              );
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Centre label */}
      <div style={{
        position: "absolute", inset: 0, display: "grid",
        placeItems: "center", pointerEvents: "none", textAlign: "center",
      }}>
        <div>
          <div style={{
            fontFamily: "Sora, sans-serif", fontWeight: 800,
            fontSize: height < 160 ? 20 : 26,
            color: activeColor ?? "var(--navy, #0d1b3e)",
            lineHeight: 1, transition: "color 0.2s",
          }}>
            {activeValue}
          </div>
          {activeName && (
            <div style={{
              fontSize: 11.5, marginTop: 4, fontWeight: 500,
              color: activeColor ? rgba(activeColor, 0.75) : "var(--muted, #9ca3af)",
              transition: "color 0.2s",
            }}>
              {activeName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DonutLegend
══════════════════════════════════════════════════════════════ */
export function DonutLegend({
  data, colors = PALETTE, fmt = (v) => v,
  activeIdx = null, onEnter, onLeave,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 12 }}>
      {data.map((d, i) => {
        const base     = colors[i % colors.length];
        const isActive = activeIdx === i;
        const pct      = data.reduce((s, x) => s + x.value, 0);
        const share    = pct > 0 ? Math.round((d.value / pct) * 100) : 0;

        return (
          <div
            key={d.name}
            onMouseEnter={() => onEnter?.(null, i)}
            onMouseLeave={() => onLeave?.()}
            style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              padding: "5px 10px",
              borderRadius: 10,
              background: isActive ? rgba(base, 0.09) : "transparent",
              borderLeft: `3px solid ${isActive ? base : "transparent"}`,
              cursor: "pointer",
              transition: "all 0.18s ease",
              opacity: activeIdx !== null && !isActive ? 0.55 : 1,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0, flex: 1 }}>
              <span style={{
                width: 11, height: 11, borderRadius: 3,
                background: isActive ? hoverColor(base) : base,
                flexShrink: 0,
                boxShadow: isActive ? `0 0 7px ${rgba(base, 0.55)}` : "none",
                transition: "all 0.18s",
              }} />
              <span style={{
                fontSize: 12.5, color: isActive ? "var(--navy, #0d1b3e)" : "#6b7280",
                fontWeight: isActive ? 600 : 400,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {d.name}
              </span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span style={{
                fontSize: 10.5, color: "#d1d5db", fontWeight: 600,
                background: "#f9fafb", borderRadius: 20,
                padding: "1px 6px",
              }}>
                {share}%
              </span>
              <strong style={{
                fontSize: 13, minWidth: 48, textAlign: "right",
                color: isActive ? base : "#111827",
                transition: "color 0.18s",
              }}>
                {fmt(d.value)}
              </strong>
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PieWithLegend
══════════════════════════════════════════════════════════════ */
export function PieWithLegend({ data, height = 220, colors = PALETTE, fmt }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const onEnter = useCallback((_, i) => setActiveIdx(i), []);
  const onLeave = useCallback(() => setActiveIdx(null), []);
  const indexed = useMemo(() => data.map((d, i) => ({ ...d, index: i })), [data]);

  if (!data?.length) return <ChartEmpty height={height + 60} />;

  return (
    <div>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={indexed}
              dataKey="value"
              nameKey="name"
              innerRadius="48%"
              outerRadius="86%"
              paddingAngle={2}
              stroke="none"
              onMouseLeave={onLeave}
              animationDuration={600}
              animationEasing="ease-out"
            >
              {indexed.map((_, i) => {
                const base     = colors[i % colors.length];
                const isActive = activeIdx === i;
                return (
                  <Cell
                    key={i}
                    fill={isActive ? hoverColor(base) : base}
                    opacity={activeIdx !== null && !isActive ? 0.5 : 1}
                    style={{ cursor: "pointer", transition: "opacity 0.2s, fill 0.2s" }}
                    onMouseEnter={(e) => onEnter(e, i)}
                  />
                );
              })}
            </Pie>
            <Tooltip
              content={<PieTooltip fmt={fmt} colors={colors} />}
              wrapperStyle={{ pointerEvents: "none", zIndex: 100 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <DonutLegend
        data={data}
        colors={colors}
        fmt={fmt ?? ((v) => v)}
        activeIdx={activeIdx}
        onEnter={onEnter}
        onLeave={onLeave}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Bars
   props: data, bars [{key, label, color?}],
          height, fmt, angle
══════════════════════════════════════════════════════════════ */
export function Bars({ data, bars, height = 280, fmt, angle = 0 }) {
  if (!data?.length || !bars?.length) return <ChartEmpty height={height} />;

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          barCategoryGap="32%"
          margin={{ top: 6, right: 6, left: 0, bottom: angle ? 32 : 4 }}
        >
          <defs>
            {bars.map((b, i) => {
              const base = b.color || PALETTE[i % PALETTE.length];
              return (
                <linearGradient key={b.key} id={`bar-grad-${b.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={base}           stopOpacity={1}   />
                  <stop offset="100%" stopColor={hoverColor(base)} stopOpacity={0.75} />
                </linearGradient>
              );
            })}
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f2f8"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={<XTick angle={angle} />}
            axisLine={false}
            tickLine={false}
            height={angle ? 52 : 28}
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 500 }}
            tickFormatter={fmt}
            axisLine={false}
            tickLine={false}
            width={fmt ? 54 : 36}
          />
          <Tooltip
            contentStyle={TT_STYLE}
            labelStyle={TT_LABEL}
            itemStyle={TT_ITEM}
            formatter={fmt ? (v) => [fmt(v)] : undefined}
            cursor={{ fill: "rgba(58,134,255,0.05)", radius: 8 }}
          />
          {bars.length > 1 && (
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11.5, paddingTop: 10, color: "#6b7280" }}
            />
          )}
          {bars.map((b, i) => {
            const base = b.color || PALETTE[i % PALETTE.length];
            return (
              <Bar
                key={b.key}
                dataKey={b.key}
                name={b.label}
                fill={`url(#bar-grad-${b.key})`}
                radius={[7, 7, 2, 2]}
                maxBarSize={44}
                activeBar={{
                  fill: hoverColor(base),
                  filter: `drop-shadow(0 3px 8px ${rgba(base, 0.45)})`,
                  radius: [7, 7, 2, 2],
                }}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Trend
   props: data [{year, ...keys}], lines [{key, label, color?}],
          height, fmt
══════════════════════════════════════════════════════════════ */
export function Trend({ data, lines, height = 280, fmt }) {
  if (!data?.length || !lines?.length) return <ChartEmpty height={height} />;

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
        >
          <defs>
            {lines.map((l, i) => {
              const base = l.color || PALETTE[i % PALETTE.length];
              return (
                <linearGradient key={l.key} id={`area-grad-${l.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={base} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={base} stopOpacity={0}    />
                </linearGradient>
              );
            })}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f8" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11.5, fill: "#9ca3af", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 500 }}
            tickFormatter={fmt}
            axisLine={false}
            tickLine={false}
            width={fmt ? 52 : 40}
          />
          <Tooltip
            contentStyle={TT_STYLE}
            labelStyle={TT_LABEL}
            itemStyle={TT_ITEM}
            formatter={fmt ? (v) => [fmt(v)] : undefined}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11.5, paddingTop: 10, color: "#6b7280" }}
          />
          {lines.map((l, i) => {
            const base = l.color || PALETTE[i % PALETTE.length];
            return (
              <Line
                key={l.key}
                type="monotone"
                dataKey={l.key}
                name={l.label}
                stroke={base}
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "#fff", stroke: base, strokeWidth: 2 }}
                activeDot={{
                  r: 7,
                  fill: hoverColor(base),
                  stroke: "#fff",
                  strokeWidth: 2.5,
                  filter: `drop-shadow(0 0 7px ${rgba(base, 0.65)})`,
                }}
                animationDuration={700}
                animationEasing="ease-out"
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Gauge — radial single-value indicator
   props: value (0–100), label, color, height
══════════════════════════════════════════════════════════════ */
export function Gauge({ value, label, color = "#FF6B35", height = 200 }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  const data    = [{ name: label, value: clamped, fill: color }];

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <ResponsiveContainer>
        <RadialBarChart
          innerRadius="68%"
          outerRadius="100%"
          data={data}
          startAngle={210}
          endAngle={-30}
        >
          <defs>
            <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor={color}            />
              <stop offset="100%" stopColor={hoverColor(color)} />
            </linearGradient>
          </defs>
          <RadialBar
            background={{ fill: "#f3f4f9" }}
            dataKey="value"
            cornerRadius={16}
            fill="url(#gauge-grad)"
            isAnimationActive
            animationDuration={700}
            animationEasing="ease-out"
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div style={{
        position: "absolute", inset: 0,
        display: "grid", placeItems: "center", pointerEvents: "none",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "Sora, sans-serif", fontWeight: 800,
            fontSize: 30, color: "var(--navy, #0d1b3e)", lineHeight: 1,
          }}>
            {clamped}
          </div>
          <div style={{ fontSize: 11.5, color: "var(--muted, #9ca3af)", marginTop: 5, fontWeight: 500 }}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}