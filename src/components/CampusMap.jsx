/* CampusMap.jsx — Premium interactive map using MapTiler + Leaflet
   ================================================================
   Renders a beautiful satellite/street map for the Campus Life tab.
   Uses the Leaflet library (already loaded in index.html) with
   MapTiler tile layers for high-quality imagery.
*/

import { useEffect, useRef, useState } from "react";
import { Layers, Satellite, Map as MapIconLucide } from "lucide-react";

const MAPTILER_KEY = "bEvuOgolTl0DT3RIUhyV";

// MapTiler tile URLs
const TILE_LAYERS = {
  satellite: {
    url: `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${MAPTILER_KEY}`,
    label: "Satellite",
    icon: "🛰️",
    attribution:
      '&copy; <a href="https://www.maptiler.com/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
  },
  streets: {
    url: `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
    label: "Streets",
    icon: "🗺️",
    attribution:
      '&copy; <a href="https://www.maptiler.com/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
  },
  topo: {
    url: `https://api.maptiler.com/maps/topo-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
    label: "Terrain",
    icon: "⛰️",
    attribution:
      '&copy; <a href="https://www.maptiler.com/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
  },
};

export default function CampusMap({ college }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState("satellite");
  const [showLayerPicker, setShowLayerPicker] = useState(false);

  const lat = college?.coords?.lat;
  const lng = college?.coords?.lng;

  useEffect(() => {
    if (!lat || !lng || !window.L) return;

    // Don't re-create if already initialized
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const L = window.L;

    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      scrollWheelZoom: true,
      attributionControl: true,
    });

    // Add zoom controls to bottom-right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Add initial tile layer
    const layer = TILE_LAYERS[activeLayer];
    tileLayerRef.current = L.tileLayer(layer.url, {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 3,
      maxZoom: 20,
      crossOrigin: true,
      attribution: layer.attribution,
    }).addTo(map);

    // Custom marker icon with college accent color
    const accent = college.accent || "#FF693D";
    const markerIcon = L.divIcon({
      className: "campus-map-marker",
      html: `
        <div style="
          width: 40px; height: 40px;
          background: ${accent};
          border: 3px solid #fff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 20px rgba(0,0,0,.35), 0 0 0 4px ${accent}33;
          display: grid; place-items: center;
        ">
          <span style="
            transform: rotate(45deg);
            color: #fff;
            font-size: 16px;
            font-weight: 800;
          ">📍</span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -42],
    });

    // Add marker
    const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);

    // Popup content
    marker.bindPopup(
      `<div style="
        font-family: 'Sora', 'DM Sans', sans-serif;
        min-width: 200px;
        padding: 4px 0;
      ">
        <div style="
          font-weight: 700;
          font-size: 14px;
          color: #1c1c28;
          margin-bottom: 4px;
          line-height: 1.3;
        ">${college.name}</div>
        <div style="
          font-size: 12px;
          color: #666;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 8px;
        ">
          📍 ${college.location || "India"}
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <span style="
            background: ${accent}18;
            color: ${accent};
            font-size: 11px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 6px;
            border: 1px solid ${accent}30;
          ">${college.type}</span>
          <span style="
            background: #0ea5a418;
            color: #0ea5a4;
            font-size: 11px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 6px;
            border: 1px solid #0ea5a430;
          ">NIRF #${college.nirf}</span>
        </div>
        <a href="https://www.google.com/maps/search/${encodeURIComponent(college.name + " " + (college.location || ""))}"
           target="_blank" rel="noreferrer"
           style="
             display: inline-flex;
             align-items: center;
             gap: 4px;
             margin-top: 8px;
             font-size: 12px;
             font-weight: 600;
             color: ${accent};
             text-decoration: none;
           ">
          Open in Google Maps ↗
        </a>
      </div>`,
      { maxWidth: 280, closeButton: true }
    );

    mapInstanceRef.current = map;

    // Force resize after container mount
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng]); // eslint-disable-line react-hooks/exhaustive-deps

  // Switch tile layers when activeLayer changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;
    const layer = TILE_LAYERS[activeLayer];

    map.removeLayer(tileLayerRef.current);
    tileLayerRef.current = L.tileLayer(layer.url, {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 3,
      maxZoom: 20,
      crossOrigin: true,
      attribution: layer.attribution,
    }).addTo(map);
  }, [activeLayer]);

  if (!lat || !lng) return null;

  return (
    <div style={{ position: "relative" }}>
      {/* Map container */}
      <div
        ref={mapRef}
        id="campus-map-container"
        style={{
          width: "100%",
          height: 380,
          borderRadius: 14,
          overflow: "hidden",
        }}
      />

      {/* Layer toggle button */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setShowLayerPicker(!showLayerPicker)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            background: "rgba(255,255,255,.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(0,0,0,.1)",
            borderRadius: 10,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            color: "#1c1c28",
            boxShadow: "0 2px 12px rgba(0,0,0,.15)",
            transition: "all .2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,.95)";
            e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,.15)";
          }}
        >
          <Layers size={15} />
          {TILE_LAYERS[activeLayer].icon} {TILE_LAYERS[activeLayer].label}
        </button>

        {/* Layer picker dropdown */}
        {showLayerPicker && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              background: "rgba(255,255,255,.97)",
              backdropFilter: "blur(16px)",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,.18)",
              overflow: "hidden",
              minWidth: 160,
              animation: "campusMapFadeIn .15s ease-out",
            }}
          >
            {Object.entries(TILE_LAYERS).map(([key, layer]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveLayer(key);
                  setShowLayerPicker(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "10px 14px",
                  border: "none",
                  background: activeLayer === key ? "rgba(255, 105, 61, .08)" : "transparent",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: activeLayer === key ? 700 : 500,
                  color: activeLayer === key ? "#FF693D" : "#1c1c28",
                  textAlign: "left",
                  transition: "background .15s",
                  borderLeft: activeLayer === key ? "3px solid #FF693D" : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (activeLayer !== key) e.currentTarget.style.background = "rgba(0,0,0,.04)";
                }}
                onMouseLeave={(e) => {
                  if (activeLayer !== key) e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ fontSize: 16 }}>{layer.icon}</span>
                {layer.label}
                {activeLayer === key && (
                  <span style={{ marginLeft: "auto", fontSize: 14 }}>✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Coordinates badge */}
      <div
        style={{
          position: "absolute",
          bottom: 38,
          left: 12,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "5px 10px",
          background: "rgba(0,0,0,.65)",
          backdropFilter: "blur(8px)",
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 500,
          color: "rgba(255,255,255,.9)",
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: ".3px",
        }}
      >
        📌 {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes campusMapFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        #campus-map-container .leaflet-control-zoom a {
          background: rgba(255,255,255,.95) !important;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0,0,0,.08) !important;
          color: #1c1c28 !important;
          width: 34px !important;
          height: 34px !important;
          line-height: 34px !important;
          font-size: 16px !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,.12) !important;
          transition: all .15s !important;
        }
        #campus-map-container .leaflet-control-zoom a:hover {
          background: #fff !important;
          box-shadow: 0 4px 16px rgba(0,0,0,.18) !important;
        }
        #campus-map-container .leaflet-control-zoom {
          border: none !important;
          box-shadow: none !important;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        #campus-map-container .leaflet-popup-content-wrapper {
          border-radius: 14px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,.18) !important;
          border: 1px solid rgba(0,0,0,.06);
          padding: 4px;
        }
        #campus-map-container .leaflet-popup-tip {
          box-shadow: 0 4px 12px rgba(0,0,0,.1) !important;
        }
        .campus-map-marker {
          background: none !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
