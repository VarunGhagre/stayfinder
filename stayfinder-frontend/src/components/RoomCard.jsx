import { Heart, Star, MapPin, BedDouble, Wifi, UtensilsCrossed, Wind } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../api/axios";

// ── Amenity quick icons ───────────────────────────────────────
const AMENITY_ICONS = {
  WiFi:  <Wifi size={10} />,
  Meals: <UtensilsCrossed size={10} />,
  AC:    <Wind size={10} />,
};

// ── Inject CSS once globally ──────────────────────────────────
let _injected = false;
function injectCSS() {
  if (_injected) return;
  _injected = true;
  const s = document.createElement("style");
  s.textContent = `
    @keyframes rcFadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
    @keyframes rcImgSwap { from{opacity:0;transform:scale(1.04)} to{opacity:1;transform:scale(1)} }
    @keyframes rcHeartPop{ 0%{transform:scale(1)} 40%{transform:scale(1.4)} 70%{transform:scale(0.88)} 100%{transform:scale(1)} }
    @keyframes rcShimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }

    .rc-wrap {
      border-radius:18px; overflow:hidden; cursor:pointer;
      background:#1E1E21; border:1px solid rgba(201,151,58,0.1);
      transition:transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s, border-color 0.3s;
    }
    .rc-wrap:hover {
      transform:translateY(-7px);
      box-shadow:0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,151,58,0.22);
      border-color:rgba(201,151,58,0.22);
    }

    .rc-img-el { display:block; width:100%; height:100%; object-fit:cover; transition:transform 0.5s ease; }
    .rc-wrap:hover .rc-img-el { transform:scale(1.07); }
    .rc-img-anim { animation:rcImgSwap 0.28s ease both; }

    .rc-arr {
      position:absolute; top:50%; transform:translateY(-50%);
      width:28px; height:28px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      font-size:16px; font-weight:700;
      background:rgba(14,14,15,0.8); backdrop-filter:blur(8px);
      border:1px solid rgba(201,151,58,0.35); color:#C9973A;
      cursor:pointer; opacity:0; transition:opacity 0.2s, transform 0.2s;
    }
    .rc-wrap:hover .rc-arr { opacity:1; }
    .rc-arr:hover { background:rgba(201,151,58,0.15); transform:translateY(-50%) scale(1.1); }

    .rc-wish {
      position:absolute; top:10px; right:10px;
      width:32px; height:32px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; backdrop-filter:blur(8px);
      transition:transform 0.2s, background 0.2s, border-color 0.2s;
      border:none;
    }
    .rc-wish:hover { transform:scale(1.12); }
    .rc-wish.rc-liked { animation:rcHeartPop 0.4s ease; }

    .rc-dot { border-radius:50%; cursor:pointer; transition:all 0.25s; }
    .rc-dot:hover { background:rgba(255,255,255,0.75) !important; }

    .rc-chip {
      display:flex; align-items:center; gap:4px;
      padding:3px 8px; border-radius:6px; font-size:10px;
      background:rgba(201,151,58,0.07);
      border:1px solid rgba(201,151,58,0.13); color:#A09480;
    }

    .rc-skel {
      background:linear-gradient(90deg,#1E1E21 25%,#262628 50%,#1E1E21 75%);
      background-size:400px 100%; animation:rcShimmer 1.4s infinite linear;
    }
  `;
  document.head.appendChild(s);
}

// ── Skeleton export ───────────────────────────────────────────
export function RoomCardSkeleton() {
  injectCSS();
  return (
    <div className="rc-wrap" style={{ pointerEvents:"none" }}>
      <div className="rc-skel" style={{ aspectRatio:"4/3" }} />
      <div style={{ padding:"12px 14px 14px" }}>
        <div className="rc-skel" style={{ height:14, borderRadius:6, marginBottom:8, width:"72%" }} />
        <div className="rc-skel" style={{ height:11, borderRadius:6, marginBottom:6, width:"48%" }} />
        <div className="rc-skel" style={{ height:11, borderRadius:6, marginBottom:10, width:"38%" }} />
        <div className="rc-skel" style={{ height:16, borderRadius:6, width:"52%" }} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
export default function RoomCard({ room, index = 0 }) {
  injectCSS();

  const navigate  = useNavigate();
  const [liked,   setLiked]   = useState(false);
  const [imgIdx,  setImgIdx]  = useState(0);
  const [imgKey,  setImgKey]  = useState(0);
  const [busy,    setBusy]    = useState(false);
  const alive = useRef(true);

  const images = Array.isArray(room.images) ? room.images : [];

  // Check wishlist
  useEffect(() => {
    alive.current = true;
    api.get("/wishlist")
      .then(({ data }) => {
        if (alive.current)
          setLiked(data.some(w => w.room?._id === room._id));
      })
      .catch(() => {});
    return () => { alive.current = false; };
  }, [room._id]);

  // Image nav
  const go = (e, dir) => {
    e.stopPropagation();
    setImgIdx(p => dir === "p"
      ? (p === 0 ? images.length - 1 : p - 1)
      : (p === images.length - 1 ? 0 : p + 1));
    setImgKey(k => k + 1);
  };

  const dot = (e, i) => {
    e.stopPropagation();
    setImgIdx(i);
    setImgKey(k => k + 1);
  };

  // Wishlist toggle
  const toggleLike = async (e) => {
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      liked
        ? await api.delete(`/wishlist/${room._id}`)
        : await api.post(`/wishlist/${room._id}`);
      setLiked(p => !p);
    } catch (err) {
      alert(err.response?.data?.message || "Please login first");
    } finally { setBusy(false); }
  };

  // Derived values
  const rating    = room.rating ?? "4.5";
  const price     = room.price?.toLocaleString("en-IN");
  const amenities = (room.amenities || []).slice(0, 3);

  const badgeStyle = {
    position:"absolute", top:10, left:10,
    padding:"3px 9px", borderRadius:7, fontSize:10,
    fontWeight:600, letterSpacing:"0.5px",
    backdropFilter:"blur(8px)",
    ...(room.badge?.toLowerCase().includes("super")
      ? { background:"rgba(201,151,58,0.15)", border:"1px solid rgba(201,151,58,0.4)", color:"#C9973A" }
      : { background:"rgba(14,14,15,0.82)", border:"1px solid rgba(255,255,255,0.12)", color:"#F2EDE6" }),
  };

  return (
    <div
      className="rc-wrap"
      style={{ animation:"rcFadeUp 0.5s ease both", animationDelay:`${index * 65}ms` }}
      onClick={() => navigate(`/rooms/${room._id}`)}
    >

      {/* ── IMAGE ── */}
      <div style={{ position:"relative", aspectRatio:"4/3", overflow:"hidden", background:"#18181B" }}>

        {images.length > 0 ? (
          <img
            key={imgKey}
            className="rc-img-el rc-img-anim"
            src={images[imgIdx]}
            alt={room.title}
          />
        ) : (
          <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, background:"linear-gradient(135deg,#18181B,#222226)" }}>
            🏠
          </div>
        )}

        {/* Bottom gradient */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(10,10,12,0.65) 0%,transparent 50%)", pointerEvents:"none" }} />

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button className="rc-arr" style={{ left:8  }} onClick={e => go(e,"p")}>‹</button>
            <button className="rc-arr" style={{ right:8 }} onClick={e => go(e,"n")}>›</button>
          </>
        )}

        {/* Badge */}
        {room.badge && <div style={badgeStyle}>{room.badge}</div>}

        {/* Heart */}
        <button
          className={`rc-wish${liked ? " rc-liked" : ""}`}
          onClick={toggleLike}
          style={{
            background: liked ? "rgba(232,82,106,0.2)" : "rgba(14,14,15,0.75)",
            border:`1px solid ${liked ? "rgba(232,82,106,0.5)" : "rgba(255,255,255,0.1)"}`,
          }}>
          <Heart size={14} fill={liked ? "#E8526A" : "none"}
            style={{ color: liked ? "#E8526A" : "#A09480", transition:"color 0.2s" }} />
        </button>

        {/* Rating — bottom left */}
        <div style={{ position:"absolute", bottom:10, left:10, display:"flex", alignItems:"center", gap:3, padding:"3px 8px", borderRadius:7, background:"rgba(14,14,15,0.8)", border:"1px solid rgba(201,151,58,0.3)", backdropFilter:"blur(6px)", zIndex:2 }}>
          <Star size={10} fill="#C9973A" style={{ color:"#C9973A" }} />
          <span style={{ fontSize:11, fontWeight:600, color:"#C9973A" }}>{rating}</span>
        </div>

        {/* Dots — bottom center */}
        {images.length > 1 && (
          <div style={{ position:"absolute", bottom:12, left:"50%", transform:"translateX(-50%)", display:"flex", gap:4, zIndex:2 }}>
            {images.map((_, i) => (
              <div key={i} className="rc-dot" onClick={e => dot(e, i)}
                style={{ width:i===imgIdx?16:5, height:5, background:i===imgIdx?"#C9973A":"rgba(255,255,255,0.4)" }} />
            ))}
          </div>
        )}

        {/* Counter — bottom right */}
        {images.length > 1 && (
          <div style={{ position:"absolute", bottom:10, right:10, padding:"2px 7px", borderRadius:6, background:"rgba(14,14,15,0.72)", border:"1px solid rgba(255,255,255,0.08)", fontSize:9, color:"#A09480", backdropFilter:"blur(4px)", zIndex:2 }}>
            {imgIdx+1}/{images.length}
          </div>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding:"12px 14px 14px" }}>

        {/* Title + rating */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:5 }}>
          <h2 style={{ fontFamily:"Georgia,serif", fontSize:15, fontWeight:400, color:"#F2EDE6", lineHeight:1.35, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {room.title}
          </h2>
          <div style={{ display:"flex", alignItems:"center", gap:3, flexShrink:0, paddingTop:1 }}>
            <Star size={11} fill="#C9973A" style={{ color:"#C9973A" }} />
            <span style={{ fontSize:12, fontWeight:600, color:"#C9973A" }}>{rating}</span>
          </div>
        </div>

        {/* Location */}
        <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:4 }}>
          <MapPin size={11} style={{ color:"#C9973A", flexShrink:0 }} />
          <span style={{ fontSize:12, color:"#5C5448", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {room.city || room.location || "Location not set"}
          </span>
        </div>

        {/* Beds */}
        {room.availableBeds !== undefined && (
          <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:9 }}>
            <BedDouble size={11} style={{ color:"#5C5448", flexShrink:0 }} />
            <span style={{ fontSize:12, color:"#5C5448" }}>
              {room.availableBeds} {room.availableBeds === 1 ? "bed" : "beds"} available
            </span>
          </div>
        )}

        {/* Amenity chips */}
        {amenities.length > 0 && (
          <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
            {amenities.map((a, i) => (
              <div key={i} className="rc-chip">
                {AMENITY_ICONS[a] && (
                  <span style={{ color:"#C9973A" }}>{AMENITY_ICONS[a]}</span>
                )}
                {a}
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div style={{ height:1, background:"rgba(201,151,58,0.08)", margin:"0 0 10px" }} />

        {/* Price + type */}
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between" }}>
          <div>
            <span style={{ fontFamily:"Georgia,serif", fontSize:17, color:"#C9973A" }}>
              ₹{price}
            </span>
            <span style={{ fontSize:11, color:"#5C5448", marginLeft:3 }}>/month</span>
          </div>
          {room.type && (
            <span style={{ fontSize:10, color:"#5C5448", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:6, padding:"2px 8px" }}>
              {room.type}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}