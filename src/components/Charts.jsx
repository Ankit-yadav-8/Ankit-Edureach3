/* ============================================================
   Charts.jsx — reusable recharts wrappers used across the site.
   Donut, mini-donut with center label, grouped bars, trend lines.
   Hover → segment shifts to a vivid HSL-darkened shade (no grey).
   Tooltip → clean white card, never dark navy block.
   ============================================================ */
import { useState, useCallback } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, RadialBarChart, RadialBar,
} from "recharts";

/* ── Vivid, high-contrast palette — no muddy/grey tones ── */
const PALETTE = [
  "#FF6B35", // vivid orange
  "#00C9A7", // emerald teal
  "#7B5EA7", // rich violet
  "#FF3B5C", // bright rose-red
  "#FFB703", // golden yellow
  "#3A86FF", // electric blue
  "#06D6A0", // mint green
  "#FF6B9D", // hot pink
];

/* ── White card tooltip — used for Bar & Line charts ── */
const tooltipStyle = {
  background: "#ffffff",
  border: "none",
  borderRadius: 12,
  fontSize: 13,
  padding: "10px 14px",
  boxShadow: "0 4px 24px rgba(13,27,62,0.13), 0 1px 4px rgba(13,27,62,0.07)",
};
const tooltipLabelStyle = {
  color: "#6b7280",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  marginBottom: 4,
};
const tooltipItemStyle = {
  color: "#1c1c28",
  fontWeight: 700,
  fontSize: 14,
};

/* ── Custom tooltip for Pie/Donut — shows coloured dot ── */
function PieTooltip({ active, payload, fmt, colors }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  const idx   = item.payload?.index ?? 0;
  const color = colors
    ? colors[idx % colors.length]
    : item.payload?.fill || PALETTE[idx % PALETTE.length];
  const value = fmt ? fmt(item.value) : item.value;

  return (
    <div style={{
      background: "#fff",
      border: "none",
      borderRadius: 12,
      padding: "10px 14px",
      boxShadow: "0 4px 24px rgba(13,27,62,0.13), 0 1px 4px rgba(13,27,62,0.07)",
      display: "flex",
      alignItems: "center",
      gap: 8,
      minWidth: 120,
    }}>
      <span style={{
        width: 10, height: 10, borderRadius: "50%",
        background: color, flexShrink: 0,
        boxShadow: `0 0 6px ${color}88`,
      }} />
      <span style={{ flex: 1, fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
        {item.name}
      </span>
      <strong style={{ fontSize: 14, color: "#1c1c28", marginLeft: 4 }}>
        {value}
      </strong>
    </div>
  );
}

/* ── Hover colour: shift HSL lightness -15%, saturation +10% ──
   Keeps the hue fully vibrant — no grey, no near-black.          */
function hoverColor(hex) {
  const c = hex.replace("#", "");
  let r = parseInt(c.slice(0, 2), 16) / 255;
  let g = parseInt(c.slice(2, 4), 16) / 255;
  let b = parseInt(c.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  let l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  l = Math.max(0.05, l - 0.15);
  s = Math.min(1, s * 1.1);

  let r2, g2, b2;
  if (s === 0) {
    r2 = g2 = b2 = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r2 = hue2rgb(p, q, h + 1 / 3);
    g2 = hue2rgb(p, q, h);
    b2 = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
}

/* ══════════════════════════════════════════════════════════════
   CenterDonut
══════════════════════════════════════════════════════════════ */
export function CenterDonut({ data, centerLabel, centerSub, height = 200, colors = PALETTE, fmt }) {
  const [activeIdx, setActiveIdx] = useState(null);

  const onEnter = useCallback((_, index) => setActiveIdx(index), []);
  const onLeave = useCallback(() => setActiveIdx(null), []);

  /* inject index into each datum so PieTooltip can read it */
  const indexed = data.map((d, i) => ({ ...d, index: i }));

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={indexed}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="92%"
            paddingAngle={3}
            stroke="none"
            onMouseLeave={onLeave}
          >
            {indexed.map((_, i) => {
              const base = colors[i % colors.length];
              const isActive = activeIdx === i;
              return (
                <Cell
                  key={i}
                  fill={isActive ? hoverColor(base) : base}
                  style={{
                    cursor: "pointer",
                    transition: "fill 0.2s ease",
                    filter: isActive ? `drop-shadow(0 0 8px ${base}99)` : "none",
                  }}
                  onMouseEnter={(e) => onEnter(e, i)}
                />
              );
            })}
          </Pie>
          {/* No floating Tooltip — it always overlaps the center text.
              Instead the center label itself updates on hover. */}
        </PieChart>
      </ResponsiveContainer>

      {/* Centre label — animates on segment hover, never overlaps ring */}
      <div
        style={{
          position: "absolute", inset: 0, display: "grid",
          placeItems: "center", pointerEvents: "none", textAlign: "center",
        }}
      >
        <div style={{ transition: "all 0.2s ease" }}>
          <div style={{
            fontFamily: "Sora", fontWeight: 800,
            fontSize: 26,
            color: activeIdx !== null
              ? colors[activeIdx % colors.length]
              : "var(--navy)",
            lineHeight: 1,
            transition: "color 0.2s ease",
          }}>
            {activeIdx !== null && data[activeIdx]
              ? (fmt ? fmt(data[activeIdx].value) : data[activeIdx].value)
              : centerLabel}
          </div>
          <div style={{
            fontSize: 12,
            color: activeIdx !== null
              ? colors[activeIdx % colors.length] + "bb"
              : "var(--muted)",
            marginTop: 4,
            fontWeight: activeIdx !== null ? 600 : 400,
            transition: "color 0.2s ease",
          }}>
            {activeIdx !== null && data[activeIdx]
              ? data[activeIdx].name
              : (centerSub || "")}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DonutLegend
══════════════════════════════════════════════════════════════ */
export function DonutLegend({ data, colors = PALETTE, fmt = (v) => v, activeIdx = null, onEnter, onLeave }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
      {data.map((d, i) => {
        const base = colors[i % colors.length];
        const isActive = activeIdx === i;
        return (
          <div
            key={d.name}
            onMouseEnter={() => onEnter?.(null, i)}
            onMouseLeave={() => onLeave?.()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 13,
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: 8,
              background: isActive ? `${base}18` : "transparent",
              borderLeft: isActive ? `3px solid ${base}` : "3px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 12, height: 12, borderRadius: 4,
                  background: isActive ? hoverColor(base) : base,
                  boxShadow: isActive ? `0 0 6px ${base}88` : "none",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              />
              <span style={{ color: isActive ? "var(--navy)" : "var(--gray)", fontWeight: isActive ? 600 : 400 }}>
                {d.name}
              </span>
            </span>
            <strong style={{ color: isActive ? base : "var(--navy)", transition: "color 0.2s" }}>
              {fmt(d.value)}
            </strong>
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

  const onEnter = useCallback((_, index) => setActiveIdx(index), []);
  const onLeave = useCallback(() => setActiveIdx(null), []);

  const indexed = data.map((d, i) => ({ ...d, index: i }));

  return (
    <div>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={indexed}
              dataKey="value"
              nameKey="name"
              innerRadius="50%"
              outerRadius="88%"
              paddingAngle={2}
              stroke="none"
              onMouseLeave={onLeave}
            >
              {indexed.map((_, i) => {
                const base = colors[i % colors.length];
                const isActive = activeIdx === i;
                return (
                  <Cell
                    key={i}
                    fill={isActive ? hoverColor(base) : base}
                    style={{
                      cursor: "pointer",
                      transition: "fill 0.2s ease",
                      filter: isActive ? `drop-shadow(0 0 10px ${base}bb)` : "none",
                    }}
                    onMouseEnter={(e) => onEnter(e, i)}
                  />
                );
              })}
            </Pie>
            <Tooltip
              content={<PieTooltip fmt={fmt} colors={colors} />}
              /* Pin tooltip to top-centre — never overlaps segments or center */
              position={{ x: "auto", y: 4 }}
              wrapperStyle={{ pointerEvents: "none", zIndex: 100 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <DonutLegend
        data={data}
        colors={colors}
        fmt={fmt || ((v) => v)}
        activeIdx={activeIdx}
        onEnter={onEnter}
        onLeave={onLeave}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Bars
══════════════════════════════════════════════════════════════ */
export function Bars({ data, bars, height = 280, fmt, angle = 0 }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: angle ? 28 : 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e8edf5" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            angle={angle}
            textAnchor={angle ? "end" : "middle"}
            height={angle ? 50 : 30}
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickFormatter={fmt}
            width={fmt ? 56 : 36}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={tooltipLabelStyle}
            itemStyle={tooltipItemStyle}
            formatter={fmt ? (v) => fmt(v) : undefined}
            cursor={{ fill: "rgba(58,134,255,0.06)", radius: 6 }}
          />
          {bars.length > 1 && (
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          )}
          {bars.map((b, i) => {
            const base = b.color || PALETTE[i % PALETTE.length];
            return (
              <Bar
                key={b.key}
                dataKey={b.key}
                name={b.label}
                fill={base}
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
                activeBar={{
                  fill: hoverColor(base),
                  filter: `drop-shadow(0 0 8px ${base}88)`,
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
══════════════════════════════════════════════════════════════ */
export function Trend({ data, lines, height = 280, fmt }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8edf5" />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#6b7280" }} />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b7280" }}
            tickFormatter={fmt}
            width={fmt ? 52 : 40}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={tooltipLabelStyle}
            itemStyle={tooltipItemStyle}
            formatter={fmt ? (v) => fmt(v) : undefined}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
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
                dot={{ r: 3, fill: base, strokeWidth: 0 }}
                activeDot={{
                  r: 7,
                  fill: hoverColor(base),
                  stroke: "#fff",
                  strokeWidth: 2.5,
                  filter: `drop-shadow(0 0 6px ${base}aa)`,
                }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Gauge — radial single value
══════════════════════════════════════════════════════════════ */
export function Gauge({ value, label, color = "#FF6B35", height = 200 }) {
  const data = [{ name: label, value, fill: color }];
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
          <RadialBar
            background={{ fill: "#eef2fb" }}
            dataKey="value"
            cornerRadius={20}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div
        style={{
          position: "absolute", inset: 0, display: "grid",
          placeItems: "center", pointerEvents: "none",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "Sora", fontWeight: 800, fontSize: 30,
            color: "var(--navy)",
          }}>
            {value}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>{label}</div>
        </div>
      </div>
    </div>
  );
}

export { PALETTE };