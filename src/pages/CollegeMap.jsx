import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Layers, ArrowRight } from "lucide-react";
import { COLLEGES } from "../data/colleges.js";
import { fmtINR } from "../utils/format.js";
import Seo from "../components/Seo.jsx";
import BackButton from "../components/BackButton.jsx";

const TYPE_COLOR = { IIT: "#F47E20", NIT: "#0ea5a4", IIIT: "#d97706", Private: "#15803d" };
const TYPES = ["All", "IIT", "NIT", "IIIT"];

export default function CollegeMap() {
  const nav = useNavigate();
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const [filter, setFilter] = useState("All");

  const counts = useMemo(() => {
    const c = { All: COLLEGES.length, IIT: 0, NIT: 0, IIIT: 0, Private: 0 };
    COLLEGES.forEach((x) => { c[x.type] = (c[x.type] || 0) + 1; });
    return c;
  }, []);
  const list = useMemo(() => COLLEGES.filter((c) => filter === "All" || c.type === filter), [filter]);

  // init map once
  useEffect(() => {
    const L = window.L;
    if (!L || !mapEl.current || mapRef.current) return;
    const map = L.map(mapEl.current, { scrollWheelZoom: true, zoomControl: true }).setView([22.8, 80], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors', maxZoom: 18,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 200);
    return () => { map.remove(); mapRef.current = null; layerRef.current = null; };
  }, []);

  // (re)draw markers when filter changes
  useEffect(() => {
    const L = window.L;
    if (!L || !mapRef.current || !layerRef.current) return;
    layerRef.current.clearLayers();
    const pts = [];
    list.forEach((c) => {
      if (!c.coords) return;
      const { lat, lng } = c.coords;
      pts.push([lat, lng]);
      const marker = L.circleMarker([lat, lng], {
        radius: 7, weight: 2, color: "#fff", fillColor: TYPE_COLOR[c.type] || "#F47E20", fillOpacity: 1,
      });
      marker.bindTooltip(`<strong>${c.short}</strong> · ${c.location}<br/>Avg ${fmtINR(c.placements.avg)}`, { direction: "top", offset: [0, -6] });
      marker.on("click", () => nav(`/colleges/${c.slug}`));
      marker.addTo(layerRef.current);
    });
    if (pts.length) mapRef.current.fitBounds(pts, { padding: [40, 40], maxZoom: 6 });
  }, [list, nav]);

  return (
    <div className="page">
      <Seo
        title="College Map — Explore IITs, NITs & IIITs Across India"
        description="Interactive map of every IIT, NIT and IIIT in India — explore colleges by location, type and rank, then open full cutoffs, placements and reviews on CollegeParichay."
        path="/map"
      />
      <section style={{ background: "linear-gradient(135deg,#ffffff,#ffffff)", color: "var(--ink)", padding: "44px 0" }}>
        <div className="container">
          <BackButton style={{ marginBottom: 16 }} />
          <span className="eyebrow" style={{ color: "var(--coral)" }}>Interactive Map</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.5rem)", margin: "8px 0 4px" }}>Colleges on the map</h1>
          <p style={{ color: "var(--muted)" }}>All {COLLEGES.length} engineering colleges — IITs, NITs &amp; IIITs pinned across India.</p>
        </div>
      </section>

      <div className="container section">
        {/* Filters + legend */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {TYPES.map((t) => (
              <button key={t} className={`tab ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>
                {t} ({counts[t] ?? 0})
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 12.5, color: "var(--muted)", flexWrap: "wrap" }}>
            {Object.entries(TYPE_COLOR).filter(([k]) => k !== "Private").map(([k, col]) => (
              <span key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: col, border: "2px solid #fff", boxShadow: "0 0 0 1px var(--line)" }} /> {k}
              </span>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div ref={mapEl} style={{ height: 480, width: "100%", background: "var(--sky)" }} />
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <MapPin size={13} /> Click any pin to open that college. Scroll to zoom, drag to pan.
        </p>

        {/* List */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "26px 0 14px" }}>
          <Layers size={18} color="var(--coral)" />
          <h2 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.2rem" }}>{filter === "All" ? "All colleges" : `${filter}s`}</h2>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{list.length} shown</span>
        </div>
        <div className="grid-4" style={{ gap: 14, paddingBottom: 40 }}>
          {list.map((c) => (
            <button key={c.slug} onClick={() => nav(`/colleges/${c.slug}`)} className="card" style={{ textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="badge" style={{ background: `${TYPE_COLOR[c.type]}1a`, color: TYPE_COLOR[c.type] }}>{c.type}</span>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>#{c.nirf}</span>
              </div>
              <strong style={{ color: "var(--navy)", fontFamily: "Sora" }}>{c.short}</strong>
              <span style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}><MapPin size={11} /> {c.location}</span>
              <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 700 }}>{fmtINR(c.placements.avg)} avg</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
