import { useEffect, useRef, useState } from "react";
import {
  MapContainer, TileLayer, Marker, Popup, useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── Fix default marker icons ──────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Custom gold pin marker ────────────────────────────────────
const goldIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      position:relative;
      display:flex;
      flex-direction:column;
      align-items:center;
    ">
      <!-- Pin body -->
      <div style="
        width:38px; height:38px; border-radius:50% 50% 50% 0;
        background:linear-gradient(135deg,#8A6520,#C9973A);
        transform:rotate(-45deg);
        border:3px solid #0E0E0F;
        box-shadow:0 4px 18px rgba(201,151,58,0.5), 0 0 0 3px rgba(201,151,58,0.15);
        display:flex; align-items:center; justify-content:center;
      ">
        <div style="
          transform:rotate(45deg);
          font-size:16px; line-height:1;
          margin-top:2px; margin-left:2px;
        ">🏠</div>
      </div>
      <!-- Pulse ring -->
      <div style="
        position:absolute; top:-4px; left:-4px;
        width:46px; height:46px; border-radius:50% 50% 50% 0;
        border:2px solid rgba(201,151,58,0.35);
        transform:rotate(-45deg);
        animation:mapPing 2s cubic-bezier(0,0,.2,1) infinite;
      "></div>
    </div>
  `,
  iconSize:   [46, 46],
  iconAnchor: [23, 44],
  popupAnchor:[0, -46],
});

// ── Dark tile layer URLs ──────────────────────────────────────
const TILES = {
  dark: {
    url:   "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attr:  '&copy; <a href="https://carto.com/">CARTO</a>',
    label: "Dark",
  },
  street: {
    url:   "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attr:  '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    label: "Street",
  },
  satellite: {
    url:   "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attr:  "Tiles &copy; Esri",
    label: "Satellite",
  },
};

// ── Fly-to helper component ───────────────────────────────────
function FlyTo({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 14, { duration: 1.2 });
  }, [lat, lng, map]);
  return null;
}

// ── CSS ───────────────────────────────────────────────────────
const CSS = `
  @keyframes mapPing {
    0%   { transform:rotate(-45deg) scale(1);   opacity:0.8; }
    75%  { transform:rotate(-45deg) scale(1.6); opacity:0;   }
    100% { transform:rotate(-45deg) scale(1);   opacity:0;   }
  }
  @keyframes mapFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

  /* Override Leaflet dark styles */
  .leaflet-container {
    background: #0E0E0F !important;
    font-family: inherit;
  }
  .leaflet-popup-content-wrapper {
    background: #161618 !important;
    border: 1px solid rgba(201,151,58,0.3) !important;
    border-radius: 14px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
    color: #F2EDE6 !important;
    padding: 0 !important;
  }
  .leaflet-popup-content {
    margin: 0 !important;
    line-height: 1.5 !important;
  }
  .leaflet-popup-tip-container { display:none !important; }
  .leaflet-popup-close-button {
    color: #A09480 !important;
    font-size: 16px !important;
    top: 8px !important; right:10px !important;
    transition: color .2s;
  }
  .leaflet-popup-close-button:hover { color:#C9973A !important; }

  .leaflet-control-zoom {
    border: 1px solid rgba(201,151,58,0.2) !important;
    border-radius: 10px !important;
    overflow: hidden;
  }
  .leaflet-control-zoom-in,
  .leaflet-control-zoom-out {
    background: #161618 !important;
    color: #C9973A !important;
    border-bottom: 1px solid rgba(201,151,58,0.15) !important;
    width: 32px !important; height: 32px !important;
    line-height: 32px !important;
    font-size: 16px !important;
    transition: background .2s;
  }
  .leaflet-control-zoom-in:hover,
  .leaflet-control-zoom-out:hover {
    background: rgba(201,151,58,0.12) !important;
  }
  .leaflet-control-attribution {
    background: rgba(14,14,15,0.85) !important;
    color: #5C5448 !important;
    font-size: 9px !important;
    backdrop-filter: blur(4px);
  }
  .leaflet-control-attribution a { color:#8A6520 !important; }
`;

// ═════════════════════════════════════════════════════════════
export default function RoomMap({
  lat   = 23.2599,
  lng   = 77.4126,
  title = "Property Location",
  price,
  city,
}) {
  const [tileKey,  setTileKey]  = useState("dark");
  const [copied,   setCopied]   = useState(false);
  const [expanded, setExpanded] = useState(false);
  const cssRef = useRef(false);

  // Inject CSS once
  useEffect(() => {
    if (cssRef.current) return;
    cssRef.current = true;
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
  }, []);

  const tile = TILES[tileKey];

  const copyCoords = () => {
    navigator.clipboard.writeText(`${lat}, ${lng}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openGMaps = () =>
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");

  const mapH = expanded ? 520 : 380;

  return (
    <div style={{ marginTop:36, animation:"mapFadeUp 0.5s ease both" }}>

      {/* ── SECTION HEADER ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:14 }}>
        <div>
          <h3 style={{ fontFamily:"Georgia,serif", fontSize:18, color:"#F2EDE6", fontWeight:400, marginBottom:3 }}>
            Location
          </h3>
          {city && (
            <p style={{ fontSize:12, color:"#5C5448", display:"flex", alignItems:"center", gap:4 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C9973A" strokeWidth="2.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              {city}
            </p>
          )}
        </div>

        {/* Controls */}
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>

          {/* Tile switcher */}
          <div style={{ display:"flex", background:"#1E1E21", border:"1px solid rgba(201,151,58,0.2)", borderRadius:10, overflow:"hidden" }}>
            {Object.entries(TILES).map(([key, t]) => (
              <button key={key} onClick={() => setTileKey(key)}
                style={{
                  padding:"6px 11px", border:"none", cursor:"pointer",
                  fontSize:11, fontWeight:500, transition:"all .2s",
                  background: tileKey===key ? "rgba(201,151,58,0.15)" : "transparent",
                  color:       tileKey===key ? "#C9973A" : "#5C5448",
                  borderRight: key !== "satellite" ? "1px solid rgba(201,151,58,0.1)" : "none",
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Copy coords */}
          <button onClick={copyCoords}
            title="Copy coordinates"
            style={{ width:34, height:34, borderRadius:9, background:"#1E1E21", border:"1px solid rgba(201,151,58,0.2)", color: copied?"#22C55E":"#5C5448", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" }}>
            {copied
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            }
          </button>

          {/* Open Google Maps */}
          <button onClick={openGMaps}
            title="Open in Google Maps"
            style={{ width:34, height:34, borderRadius:9, background:"#1E1E21", border:"1px solid rgba(201,151,58,0.2)", color:"#5C5448", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" }}
            onMouseEnter={e => e.currentTarget.style.color="#C9973A"}
            onMouseLeave={e => e.currentTarget.style.color="#5C5448"}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </button>

          {/* Expand */}
          <button onClick={() => setExpanded(p => !p)}
            title={expanded ? "Collapse" : "Expand"}
            style={{ width:34, height:34, borderRadius:9, background:"#1E1E21", border:"1px solid rgba(201,151,58,0.2)", color:"#5C5448", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" }}
            onMouseEnter={e => e.currentTarget.style.color="#C9973A"}
            onMouseLeave={e => e.currentTarget.style.color="#5C5448"}>
            {expanded
              ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/></svg>
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
            }
          </button>
        </div>
      </div>

      {/* ── MAP CONTAINER ── */}
      <div style={{
        borderRadius:18, overflow:"hidden",
        border:"1px solid rgba(201,151,58,0.18)",
        boxShadow:"0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,151,58,0.06)",
        height:mapH,
        transition:"height 0.4s cubic-bezier(.22,1,.36,1)",
        position:"relative",
      }}>
        <MapContainer
          center={[lat, lng]}
          zoom={14}
          style={{ height:"100%", width:"100%" }}
          zoomControl={true}
          scrollWheelZoom={false}
        >
          <TileLayer url={tile.url} attribution={tile.attr}/>
          <FlyTo lat={lat} lng={lng}/>

          <Marker position={[lat, lng]} icon={goldIcon}>
            <Popup minWidth={220} closeButton={true}>
              <div style={{ padding:"14px 16px 12px" }}>

                {/* Room thumb if available */}
                <div style={{ marginBottom:10 }}>
                  <p style={{ fontSize:10, color:"#C9973A", fontWeight:600, letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:4 }}>
                    📍 Property Location
                  </p>
                  <p style={{ fontSize:14, color:"#F2EDE6", fontWeight:500, fontFamily:"Georgia,serif", lineHeight:1.3 }}>
                    {title}
                  </p>
                  {city && (
                    <p style={{ fontSize:11, color:"#5C5448", marginTop:3 }}>{city}</p>
                  )}
                </div>

                {price && (
                  <div style={{ background:"rgba(201,151,58,0.08)", border:"1px solid rgba(201,151,58,0.2)", borderRadius:8, padding:"6px 10px", marginBottom:10, display:"flex", alignItems:"baseline", gap:4 }}>
                    <span style={{ fontFamily:"Georgia,serif", fontSize:16, color:"#C9973A" }}>
                      ₹{Number(price).toLocaleString("en-IN")}
                    </span>
                    <span style={{ fontSize:11, color:"#5C5448" }}>/month</span>
                  </div>
                )}

                {/* Coords */}
                <p style={{ fontSize:10, color:"#5C5448", marginBottom:8 }}>
                  {lat.toFixed(4)}, {lng.toFixed(4)}
                </p>

                {/* Google Maps link */}
                <button onClick={openGMaps}
                  style={{ width:"100%", padding:"8px", background:"rgba(201,151,58,0.1)", border:"1px solid rgba(201,151,58,0.25)", borderRadius:8, color:"#C9973A", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5, transition:"all .2s" }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(201,151,58,0.18)"}
                  onMouseLeave={e => e.currentTarget.style.background="rgba(201,151,58,0.1)"}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Open in Google Maps
                </button>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* ── COORDS CHIP (bottom left overlay) ── */}
        <div style={{
          position:"absolute", bottom:12, left:12, zIndex:999,
          background:"rgba(14,14,15,0.85)", backdropFilter:"blur(8px)",
          border:"1px solid rgba(201,151,58,0.2)", borderRadius:9,
          padding:"5px 11px", fontSize:10, color:"#5C5448",
          pointerEvents:"none",
        }}>
          {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
        </div>
      </div>

      {/* ── BOTTOM INFO ROW ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginTop:12, padding:"0 2px" }}>
        <p style={{ fontSize:11, color:"#5C5448", display:"flex", alignItems:"center", gap:5 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C9973A" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Scroll to zoom · Click marker for details
        </p>
        <button onClick={openGMaps}
          style={{ fontSize:11, color:"#C9973A", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4, padding:0, transition:"opacity .2s" }}
          onMouseEnter={e => e.currentTarget.style.opacity="0.75"}
          onMouseLeave={e => e.currentTarget.style.opacity="1"}>
          Get directions →
        </button>
      </div>
    </div>
  );
}