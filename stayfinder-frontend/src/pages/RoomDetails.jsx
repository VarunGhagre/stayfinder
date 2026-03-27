import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Star, MapPin, BedDouble,
  Share2, Heart, Upload, X, Grid, Maximize2,
  Home, Building2, Utensils, MapPinned, Wifi,
  Car, Wind, ShieldCheck, Zap, UtensilsCrossed,
} from "lucide-react";
import api from "../api/axios";

// ── Design tokens ─────────────────────────────────────────────
const G = {
  gold:"#C9973A", gold2:"#E8C97A", golddim:"#8A6520",
  bg:"#0E0E0F",   bg2:"#161618",   bg3:"#1E1E21",  bg4:"#26262A",
  b1:"rgba(201,151,58,0.15)", b2:"rgba(201,151,58,0.3)", b3:"rgba(201,151,58,0.5)",
  t1:"#F2EDE6",   t2:"#A09480",    t3:"#5C5448",   rose:"#E8526A",
};

// ── Category tabs config ──────────────────────────────────────
const TABS = [
  { id:"all",       label:"All Photos", Icon:Grid      },
  { id:"room",      label:"Room",       Icon:Home      },
  { id:"building",  label:"Building",   Icon:Building2 },
  { id:"amenities", label:"Amenities",  Icon:Utensils  },
  { id:"location",  label:"Location",   Icon:MapPinned },
];

// ── Amenity icon map ──────────────────────────────────────────
const AMENITY_ICONS = {
  WiFi:     <Wifi size={15}/>,
  Meals:    <UtensilsCrossed size={15}/>,
  Parking:  <Car size={15}/>,
  AC:       <Wind size={15}/>,
  Security: <ShieldCheck size={15}/>,
  Power:    <Zap size={15}/>,
};

// ── Global CSS ────────────────────────────────────────────────
const CSS = `
  @keyframes fadeUp  {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
  @keyframes scaleIn {from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}
  @keyframes shimmer {0%{background-position:-600px 0}100%{background-position:600px 0}}
  @keyframes pulse   {0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes spin    {to{transform:rotate(360deg)}}
  @keyframes slideTab{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
  @keyframes imgSwap {from{opacity:0;transform:scale(1.03)}to{opacity:1;transform:scale(1)}}

  .fade-up  {animation:fadeUp  0.55s cubic-bezier(.22,1,.36,1) both}
  .fade-in  {animation:fadeIn  0.35s ease both}
  .scale-in {animation:scaleIn 0.4s  cubic-bezier(.22,1,.36,1) both}
  .slide-tab{animation:slideTab 0.3s ease both}
  .img-swap {animation:imgSwap 0.3s ease both}

  .skeleton{background:linear-gradient(90deg,#1E1E21 25%,#26262A 50%,#1E1E21 75%);background-size:600px 100%;animation:shimmer 1.4s infinite linear;border-radius:8px;}

  /* Gallery cell */
  .gcell{position:relative;overflow:hidden;cursor:pointer;}
  .gcell img{width:100%;height:100%;object-fit:cover;transition:transform 0.45s ease;}
  .gcell:hover img{transform:scale(1.06);}
  .gcell::after{content:'';position:absolute;inset:0;background:rgba(14,14,15,0);transition:background 0.3s;}
  .gcell:hover::after{background:rgba(14,14,15,0.2);}
  .gcell .zoom-icon{position:absolute;bottom:9px;right:9px;opacity:0;transform:scale(0.85);transition:all 0.25s;z-index:2;}
  .gcell:hover .zoom-icon{opacity:1;transform:scale(1);}

  /* Sub-image cell — has its own mini slider */
  .sub-cell{position:relative;overflow:hidden;cursor:pointer;border-radius:0;}
  .sub-cell img{width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease;}
  .sub-cell:hover img{transform:scale(1.05);}
  .sub-arrow{
    position:absolute;top:50%;transform:translateY(-50%);
    width:22px;height:22px;border-radius:50%;
    background:rgba(14,14,15,0.78);border:1px solid rgba(201,151,58,0.3);
    color:#C9973A;cursor:pointer;display:flex;align-items:center;justify-content:center;
    opacity:0;transition:opacity 0.2s;z-index:5;backdrop-filter:blur(4px);
  }
  .sub-cell:hover .sub-arrow{opacity:1;}

  /* Category tab */
  .gtab{display:flex;align-items:center;gap:5px;padding:7px 14px;border-radius:20px;border:1px solid rgba(201,151,58,0.15);font-size:12px;color:#5C5448;cursor:pointer;transition:all 0.2s;white-space:nowrap;background:transparent;}
  .gtab:hover{border-color:rgba(201,151,58,0.3);color:#A09480;}
  .gtab.on{border-color:#C9973A;color:#C9973A;background:rgba(201,151,58,0.1);}

  /* Upload */
  .upload-zone{border:2px dashed rgba(201,151,58,0.3);border-radius:14px;padding:18px;text-align:center;transition:all 0.2s;cursor:pointer;}
  .upload-zone.drag{border-color:#C9973A;background:rgba(201,151,58,0.06);}
  .upload-zone:hover{border-color:rgba(201,151,58,0.5);}

  /* Buttons */
  .gold-btn{background:#C9973A;color:#0E0E0F;border:none;border-radius:12px;font-weight:600;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 18px rgba(201,151,58,0.25);}
  .gold-btn:hover{background:#E8C97A;transform:translateY(-2px);box-shadow:0 6px 26px rgba(201,151,58,0.38);}
  .gold-btn:active{transform:scale(0.97);}
  .gold-btn:disabled{opacity:0.45;cursor:not-allowed;transform:none;}
  .ghost-btn{background:transparent;border:1px solid rgba(201,151,58,0.3);border-radius:10px;color:#A09480;cursor:pointer;transition:all 0.2s;}
  .ghost-btn:hover{border-color:rgba(201,151,58,0.5);color:#C9973A;background:rgba(201,151,58,0.06);}

  .amenity-chip{display:flex;align-items:center;gap:8px;padding:10px 14px;background:#1E1E21;border:1px solid rgba(201,151,58,0.15);border-radius:12px;font-size:13px;color:#A09480;animation:fadeUp 0.5s ease both;transition:border-color 0.2s,color 0.2s;}
  .amenity-chip:hover{border-color:rgba(201,151,58,0.3);color:#F2EDE6;}

  /* Lightbox */
  .lb-overlay{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.22s ease;}
  .lb-img{max-width:90vw;max-height:85vh;border-radius:14px;animation:imgSwap 0.25s ease both;}
  .lb-btn{position:absolute;width:42px;height:42px;border-radius:50%;background:rgba(22,22,24,0.85);border:1px solid rgba(201,151,58,0.3);color:#C9973A;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);transition:all 0.2s;}
  .lb-btn:hover{border-color:#C9973A;background:rgba(201,151,58,0.15);}
  .lb-thumb{width:56px;height:42px;object-fit:cover;border-radius:6px;cursor:pointer;opacity:0.5;border:2px solid transparent;transition:all 0.2s;flex-shrink:0;}
  .lb-thumb.on{opacity:1;border-color:#C9973A;}
  .lb-thumb:hover{opacity:0.85;}

  /* Toast */
  .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(10px);background:#1E1E21;border:1px solid rgba(201,151,58,0.3);color:#F2EDE6;padding:10px 22px;border-radius:12px;font-size:13px;z-index:9999;opacity:0;pointer-events:none;transition:all 0.3s;white-space:nowrap;}
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}

  @media(max-width:768px){.det-grid{display:block!important;}.widget-sticky{position:static!important;}}
`;

// ── Sub-image cell with its own independent slider ────────────
// KEY FIX: Each sub-cell manages its OWN index, completely
// independent from the main image. Clicking arrows on a sub-cell
// NEVER touches the main image state.
function SubCell({ images, onOpen }) {
  const [idx, setIdx] = useState(0);

  // Guard: if images is empty return placeholder
  if (!images || images.length === 0) {
    return (
      <div style={{ height: "100%", background: G.bg4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
        🏠
      </div>
    );
  }

  const prev = (e) => {
    e.stopPropagation();
    setIdx((p) => (p === 0 ? images.length - 1 : p - 1));
  };
  const next = (e) => {
    e.stopPropagation();
    setIdx((p) => (p === images.length - 1 ? 0 : p + 1));
  };

  return (
    <div className="sub-cell" style={{ height: "100%" }} onClick={() => onOpen(idx)}>
      {/* Image with swap animation key */}
      <img key={idx} className="img-swap" src={images[idx]} alt="" />

      {/* Arrows — only show if multiple images */}
      {images.length > 1 && (
        <>
          <button className="sub-arrow" style={{ left: 6 }} onClick={prev}>
            <ChevronLeft size={12} />
          </button>
          <button className="sub-arrow" style={{ right: 6 }} onClick={next}>
            <ChevronRight size={12} />
          </button>
          {/* Dot indicators */}
          <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 3, zIndex: 3 }}>
            {images.map((_, i) => (
              <div key={i} onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                style={{ width: i === idx ? 14 : 5, height: 5, borderRadius: 3, background: i === idx ? G.gold : "rgba(255,255,255,0.5)", transition: "all 0.2s", cursor: "pointer" }} />
            ))}
          </div>
        </>
      )}

      {/* Image count badge */}
      {images.length > 1 && (
        <div style={{ position: "absolute", top: 7, left: 7, background: "rgba(14,14,15,0.78)", border: `1px solid ${G.b2}`, borderRadius: 6, padding: "2px 7px", fontSize: 10, color: G.t2, backdropFilter: "blur(4px)", zIndex: 3 }}>
          {idx + 1}/{images.length}
        </div>
      )}

      {/* Zoom icon */}
      <div className="zoom-icon">
        <div style={{ background: "rgba(14,14,15,0.75)", borderRadius: 6, padding: "3px 7px", fontSize: 10, color: G.t1, backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: 3 }}>
          <Maximize2 size={9} /> View
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ background: G.bg, minHeight: "100vh", padding: "32px 24px" }}>
      <style>{CSS}</style>
      <div className="skeleton" style={{ width: 110, height: 13, marginBottom: 22 }} />
      <div className="skeleton" style={{ width: "55%", height: 30, marginBottom: 10 }} />
      <div className="skeleton" style={{ width: "35%", height: 16, marginBottom: 24 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 4, height: 300, borderRadius: 18, overflow: "hidden", marginBottom: 20 }}>
        <div className="skeleton" style={{ borderRadius: 0, height: "100%" }} />
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 4 }}>
          <div className="skeleton" style={{ borderRadius: 0 }} />
          <div className="skeleton" style={{ borderRadius: 0 }} />
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
export default function RoomDetails() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [room,      setRoom]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [lightbox,  setLightbox]  = useState(null);  // { imgs:[], idx:0 }
  const [liked,     setLiked]     = useState(false);
  const [files,     setFiles]     = useState([]);
  const [uploadCat, setUploadCat] = useState("room");
  const [uploading, setUploading] = useState(false);
  const [previews,  setPreviews]  = useState([]);
  const [drag,      setDrag]      = useState(false);
  const [toast,     setToast]     = useState("");
  const [showAll,   setShowAll]   = useState(false);

  // ── Main hero image has its OWN independent index ──────────
  const [mainIdx, setMainIdx] = useState(0);

  const fileRef  = useRef(null);
  const toastRef = useRef(null);

  useEffect(() => {
    api.get(`/rooms/${id}`)
      .then((res) => { setRoom(res.data.room || res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!files.length) { setPreviews([]); return; }
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [files]);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(""), 2600);
  };

  // Keyboard lightbox nav
  useEffect(() => {
    const onKey = (e) => {
      if (!lightbox) return;
      if (e.key === "ArrowLeft")
        setLightbox((l) => ({ ...l, idx: l.idx === 0 ? l.imgs.length - 1 : l.idx - 1 }));
      if (e.key === "ArrowRight")
        setLightbox((l) => ({ ...l, idx: l.idx === l.imgs.length - 1 ? 0 : l.idx + 1 }));
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const handleUpdate = async () => {
    if (!files.length) { showToast("Please select images first"); return; }
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("images", f));
    fd.append("category", uploadCat);
    try {
      const res = await api.put(`/rooms/update/${room._id}`, fd);
      setRoom((prev) => ({
      ...res.data.room,
      imagesByCategory: {
      ...prev.imagesByCategory,
    ...res.data.room.imagesByCategory
  }
}));
      setFiles([]); setPreviews([]);
      showToast("✓ Images updated successfully!");
    } catch {
      showToast("Upload failed — please try again");
    } finally { setUploading(false); }
  };

  if (loading) return <Skeleton />;
  if (!room) return (
    <div style={{ background: G.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{CSS}</style>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 52, marginBottom: 12 }}>🏠</p>
        <p style={{ fontFamily: "Georgia,serif", fontSize: 22, color: G.t1, marginBottom: 16 }}>Room not found</p>
        <button className="gold-btn" style={{ padding: "12px 28px", fontSize: 14 }}
          onClick={() => navigate("/rooms")}>Browse Rooms</button>
      </div>
    </div>
  );

  // ── Image map — supports both flat & category-wise formats ──
  // Format A (new): room.imagesByCategory = { room:[..], building:[..], amenities:[..], location:[..] }
  // Format B (old): room.images = ["url1", "url2", ...]  → all go to "room"
  const byCategory = room.imagesByCategory ?? {
    room:      room.images         ?? [],
    building:  room.buildingImages ?? [],
    amenities: room.amenityImages  ?? [],
    location:  room.locationImages ?? [],
  };

  // ── Deduplicate: make sure no URL appears in multiple categories ──
  const seen = new Set();
  const dedupedByCategory = {};
  for (const cat of ["room", "building", "amenities", "location"]) {
    dedupedByCategory[cat] = (byCategory[cat] ?? []).filter((url) => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
  }

  const allImgs = [
    ...dedupedByCategory.room,
    ...dedupedByCategory.building,
    ...dedupedByCategory.amenities,
    ...dedupedByCategory.location,
  ];

  // Main hero uses only room images (or allImgs if room is empty)
  const mainImgs   = dedupedByCategory.room.length ? dedupedByCategory.room : allImgs;

  // Sub-cells: building[0..1] and amenities[0..1] shown in hero
  const subImages = [
    dedupedByCategory.building,
    dedupedByCategory.amenities,
    dedupedByCategory.location,
    // fallback: slice other room images if sub categories empty
    ...( dedupedByCategory.building.length === 0 ? [dedupedByCategory.room.slice(1)] : [] ),
  ].filter((arr) => arr && arr.length > 0).slice(0, 4);

  // Fill sub-cells to always show 4 (using allImgs slices if needed)
  while (subImages.length < 4 && allImgs.length > 1) {
    const start = subImages.length + 1;
    const slice = allImgs.slice(start, start + 1);
    if (!slice.length) break;
    subImages.push(slice);
  }

  const tabImgs     = activeTab === "all" ? allImgs : (dedupedByCategory[activeTab] ?? []);
  const displayImgs = showAll ? tabImgs : tabImgs.slice(0, 9);
  const hasMore     = tabImgs.length > 9 && !showAll;

  const counts = {
    all:       allImgs.length,
    room:      dedupedByCategory.room.length,
    building:  dedupedByCategory.building.length,
    amenities: dedupedByCategory.amenities.length,
    location:  dedupedByCategory.location.length,
  };

  const amenities = room.amenities?.length
    ? room.amenities : ["WiFi", "Meals", "AC", "Parking", "Security"];

  const months  = 5;
  const deposit = (room.price ?? 0) * 2;
  const total   = (room.price ?? 0) * months + deposit;

  return (
    <div style={{ background: G.bg, minHeight: "100vh", color: G.t1 }}>
      <style>{CSS}</style>

      {/* ── STICKY TOP BAR ── */}
      <div className="fade-in" style={{ padding: "12px 24px", borderBottom: `1px solid ${G.b1}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(14,14,15,0.92)", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 50 }}>
        <button className="ghost-btn" style={{ padding: "7px 14px", fontSize: 13, display: "flex", alignItems: "center", gap: 5 }} onClick={() => navigate(-1)}>
          <ChevronLeft size={14} /> Back
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ghost-btn" style={{ padding: "7px 13px", fontSize: 13, display: "flex", alignItems: "center", gap: 5 }} onClick={() => showToast("Link copied!")}>
            <Share2 size={13} /> Share
          </button>
          <button onClick={() => setLiked(!liked)} style={{ padding: "7px 13px", fontSize: 13, display: "flex", alignItems: "center", gap: 5, borderRadius: 10, cursor: "pointer", transition: "all 0.2s", border: `1px solid ${liked ? G.rose : G.b2}`, background: liked ? "rgba(232,82,106,0.1)" : "transparent", color: liked ? G.rose : G.t2 }}>
            <Heart size={13} fill={liked ? G.rose : "none"} /> {liked ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 20px 80px" }}>

        {/* ── TITLE ── */}
        <div className="fade-up" style={{ animationDelay: "0.05s", marginBottom: 18 }}>
          {room.badge && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(201,151,58,0.1)", border: `1px solid ${G.b2}`, borderRadius: 7, padding: "2px 9px", fontSize: 10, fontWeight: 600, color: G.gold, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: G.gold, animation: "pulse 2s infinite" }} />
              {room.badge}
            </div>
          )}
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(20px,3.5vw,34px)", fontWeight: 400, color: G.t1, lineHeight: 1.2, marginBottom: 8 }}>
            {room.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: 13, color: G.t3 }}>
            <span style={{ color: G.gold, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              <Star size={12} fill={G.gold} /> {room.rating ?? "4.8"}
            </span>
            <span>·</span><span>{room.reviews?.length ?? 0} reviews</span>
            <span>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={12} style={{ color: G.gold }} /> {room.city ?? "Location not available"}
            </span>
            {room.availableBeds !== undefined && (
              <><span>·</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <BedDouble size={12} style={{ color: G.gold }} /> {room.availableBeds} beds
              </span></>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            HERO GRID
            - Main (left):   mainImgs — has its OWN mainIdx
            - Sub (right):   each sub-cell is a <SubCell>
                             with its OWN independent idx state
        ════════════════════════════════════════════════════ */}
        <div className="fade-up" style={{ animationDelay: "0.1s", marginBottom: 14 }}>
          {allImgs.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: allImgs.length >= 2 ? "1.55fr 1fr" : "1fr",
              gridTemplateRows: "220px 220px",
              gap: 4,
              borderRadius: 20,
              overflow: "hidden",
              maxHeight: 444,
            }}>

              {/* ── MAIN IMAGE (left, tall) ── */}
              <div className="gcell" style={{ gridRow: "span 2", position: "relative" }}>
                {/* Image with swap animation */}
                <img
                  key={mainIdx}
                  className="img-swap"
                  src={mainImgs[mainIdx]}
                  alt="main"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onClick={() => setLightbox({ imgs: mainImgs, idx: mainIdx })}
                />

                {/* Prev / Next for main image only */}
                {mainImgs.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setMainIdx((p) => (p === 0 ? mainImgs.length - 1 : p - 1)); }}
                      style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, borderRadius: "50%", background: "rgba(14,14,15,0.75)", border: `1px solid ${G.b2}`, color: G.gold, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)", zIndex: 4 }}>
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setMainIdx((p) => (p === mainImgs.length - 1 ? 0 : p + 1)); }}
                      style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, borderRadius: "50%", background: "rgba(14,14,15,0.75)", border: `1px solid ${G.b2}`, color: G.gold, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)", zIndex: 4 }}>
                      <ChevronRight size={16} />
                    </button>
                    {/* Dot strip for main */}
                    <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4, zIndex: 4 }}>
                      {mainImgs.map((_, i) => (
                        <div key={i} onClick={(e) => { e.stopPropagation(); setMainIdx(i); }}
                          style={{ width: i === mainIdx ? 18 : 6, height: 6, borderRadius: 3, background: i === mainIdx ? G.gold : "rgba(255,255,255,0.45)", cursor: "pointer", transition: "all 0.2s" }} />
                      ))}
                    </div>
                  </>
                )}

                {/* Category label */}
                <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(14,14,15,0.78)", border: `1px solid ${G.b2}`, borderRadius: 7, padding: "3px 9px", fontSize: 10, color: G.gold, backdropFilter: "blur(4px)", zIndex: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <Home size={10} /> Room · {mainIdx + 1}/{mainImgs.length}
                </div>
              </div>

              {/* ── SUB IMAGES (right, 4 cells) ── */}
              {/* Each SubCell is fully independent — arrows and dots
                  change only THAT cell's image, never the main */}
              {subImages.slice(0, 4).map((imgs, i) => {
                const catLabels = ["Building", "Amenities", "Location", "Room"];
                const catIcons  = [Building2, Utensils, MapPinned, Home];
                const CatIcon   = catIcons[i] ?? Home;
                return (
                  <div key={i} style={{ position: "relative", overflow: "hidden" }}>
                    <SubCell
                      images={imgs}
                      onOpen={(idx) => setLightbox({ imgs, idx })}
                    />
                    {/* Category label */}
                    <div style={{ position: "absolute", top: 7, left: 7, background: "rgba(14,14,15,0.75)", border: `1px solid ${G.b1}`, borderRadius: 6, padding: "2px 7px", fontSize: 9, color: G.t2, backdropFilter: "blur(4px)", zIndex: 4, display: "flex", alignItems: "center", gap: 3, pointerEvents: "none" }}>
                      <CatIcon size={9} /> {catLabels[i]}
                    </div>
                    {/* "Show all" on last sub-cell */}
                    {i === 3 && allImgs.length > 5 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setLightbox({ imgs: allImgs, idx: 0 }); }}
                        style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(14,14,15,0.82)", border: `1px solid ${G.b2}`, color: G.t1, padding: "4px 10px", borderRadius: 7, fontSize: 11, cursor: "pointer", backdropFilter: "blur(6px)", zIndex: 5, display: "flex", alignItems: "center", gap: 4 }}>
                        <Grid size={10} /> +{allImgs.length - 5}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ height: 280, borderRadius: 20, background: G.bg3, border: `1px solid ${G.b1}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>🏠</div>
          )}
        </div>

        {/* ── CATEGORY TABS + GRID ── */}
        <div className="fade-up" style={{ animationDelay: "0.16s", marginBottom: 32 }}>
          {/* Tab pills */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4, marginBottom: 14 }}>
            {TABS.filter((t) => t.id === "all" || (counts[t.id] ?? 0) > 0).map((t) => (
              <button key={t.id} className={`gtab${activeTab === t.id ? " on" : ""}`}
                onClick={() => { setActiveTab(t.id); setShowAll(false); }}>
                <t.Icon size={12} /> {t.label}
                <span style={{ fontSize: 11, opacity: 0.65 }}>({counts[t.id] ?? 0})</span>
              </button>
            ))}
          </div>
          <p style={{ fontSize: 11, color: G.t3, marginBottom: 10 }}>
            {activeTab === "all"
              ? `${allImgs.length} photos across all categories`
              : `${tabImgs.length} ${TABS.find((t) => t.id === activeTab)?.label} photos`}
          </p>

          {tabImgs.length > 0 ? (
            <>
              <div className="slide-tab" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4, borderRadius: 16, overflow: "hidden" }}>
                {displayImgs.map((img, i) => {
                  const isBig = i === 0 || i === 6;
                  return (
                    <div key={`${activeTab}-${i}`} className="gcell"
                      style={{ gridColumn: isBig && displayImgs.length > 2 ? "span 2" : "span 1", height: isBig ? 210 : 150 }}
                      onClick={() => setLightbox({ imgs: tabImgs, idx: i })}>
                      <img src={img} alt="" />
                      <div className="zoom-icon">
                        <div style={{ background: "rgba(14,14,15,0.75)", borderRadius: 6, padding: "3px 7px", fontSize: 10, color: G.t1, backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: 3 }}>
                          <Maximize2 size={9} /> View
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {(hasMore || showAll) && (
                <div style={{ textAlign: "center", marginTop: 12 }}>
                  <button className="ghost-btn" style={{ padding: "9px 22px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}
                    onClick={() => setShowAll(!showAll)}>
                    {showAll ? "Show less" : `Show all ${tabImgs.length} photos`}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: "28px 0", textAlign: "center", color: G.t3, fontSize: 13 }}>No photos in this category yet</div>
          )}
        </div>

        {/* ── 2-COL LAYOUT ── */}
        <div className="det-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32 }}>

          {/* LEFT */}
          <div>
            {/* Quick facts */}
            <div className="fade-up" style={{ animationDelay: "0.2s", display: "flex", flexWrap: "wrap", gap: 7, paddingBottom: 22, borderBottom: `1px solid ${G.b1}`, marginBottom: 22 }}>
              {[
                { e: "🏠", l: room.type || "Entire room" },
                { e: "🛏️", l: `${room.availableBeds ?? 1} beds` },
                { e: "👤", l: `Max ${room.maxOccupants ?? 2} tenants` },
                { e: "🔑", l: "Self check-in" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", background: G.bg3, border: `1px solid ${G.b1}`, borderRadius: 9, fontSize: 12, color: G.t2 }}>
                  <span style={{ fontSize: 13 }}>{f.e}</span>{f.l}
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="fade-up" style={{ animationDelay: "0.24s", paddingBottom: 22, borderBottom: `1px solid ${G.b1}`, marginBottom: 22 }}>
              <h3 style={{ fontFamily: "Georgia,serif", fontSize: 17, color: G.t1, marginBottom: 9 }}>About this room</h3>
              <p style={{ fontSize: 13, color: G.t2, lineHeight: 1.8 }}>
                {room.description || "A fully furnished, air-conditioned room perfect for working professionals and students. Includes all meals, WiFi, and daily housekeeping in a safe, secure building."}
              </p>
            </div>

            {/* Amenities */}
            <div className="fade-up" style={{ animationDelay: "0.28s", paddingBottom: 22, borderBottom: `1px solid ${G.b1}`, marginBottom: 22 }}>
              <h3 style={{ fontFamily: "Georgia,serif", fontSize: 17, color: G.t1, marginBottom: 12 }}>What's included</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 7 }}>
                {amenities.map((a, i) => (
                  <div key={i} className="amenity-chip" style={{ animationDelay: `${0.3 + i * 0.05}s` }}>
                    <span style={{ color: G.gold }}>{AMENITY_ICONS[a] ?? <span style={{ fontSize: 13 }}>✓</span>}</span>
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Upload section */}
            <div className="fade-up" style={{ animationDelay: "0.34s" }}>
              <h3 style={{ fontFamily: "Georgia,serif", fontSize: 17, color: G.t1, marginBottom: 12 }}>Update photos</h3>

              {/* Category selector for upload */}
              <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                {TABS.filter((t) => t.id !== "all").map((t) => (
                  <button key={t.id} onClick={() => setUploadCat(t.id)}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: `1px solid ${uploadCat === t.id ? G.gold : G.b1}`, background: uploadCat === t.id ? "rgba(201,151,58,0.1)" : "transparent", color: uploadCat === t.id ? G.gold : G.t3, fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}>
                    <t.Icon size={11} /> {t.label}
                  </button>
                ))}
              </div>

              <div className={`upload-zone${drag ? " drag" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); setFiles(e.dataTransfer.files); }}
                onClick={() => fileRef.current?.click()}>
                <Upload size={20} style={{ color: drag ? G.gold : G.t3, margin: "0 auto 7px" }} />
                <p style={{ fontSize: 12, color: drag ? G.gold : G.t2, marginBottom: 3 }}>
                  {drag ? "Drop images here" : "Drag & drop or click to browse"}
                </p>
                <p style={{ fontSize: 11, color: G.t3 }}>
                  Adding to: <span style={{ color: G.gold, fontWeight: 500 }}>
                    {TABS.find((t) => t.id === uploadCat)?.label}
                  </span>
                </p>
                <input ref={fileRef} type="file" multiple accept="image/*"
                  style={{ display: "none" }} onChange={(e) => setFiles(e.target.files)} />
              </div>

              {previews.length > 0 && (
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 10 }}>
                  {previews.map((url, i) => (
                    <div key={i} style={{ position: "relative", width: 68, height: 68 }}>
                      <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 9, border: `1px solid ${G.b2}` }} />
                      <button onClick={() => {
                        const dt = new DataTransfer();
                        Array.from(files).filter((_, fi) => fi !== i).forEach((f) => dt.items.add(f));
                        setFiles(dt.files);
                      }} style={{ position: "absolute", top: -5, right: -5, width: 17, height: 17, borderRadius: "50%", background: G.rose, border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X size={9} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button className="gold-btn" onClick={handleUpdate}
                disabled={uploading || !files.length}
                style={{ marginTop: 12, padding: "11px 22px", fontSize: 13, display: "flex", alignItems: "center", gap: 7 }}>
                {uploading ? (
                  <><div style={{ width: 13, height: 13, border: `2px solid ${G.bg}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Uploading...</>
                ) : (
                  <><Upload size={13} /> Update {TABS.find((t) => t.id === uploadCat)?.label}{files.length ? ` (${files.length})` : ""}</>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT — Booking widget */}
          <div>
            <div className="widget-sticky scale-in" style={{ animationDelay: "0.18s", position: "sticky", top: 80, background: G.bg2, border: `1px solid ${G.b2}`, borderRadius: 18, padding: 20, boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}>
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontFamily: "Georgia,serif", fontSize: 28, color: G.gold }}>
                  ₹{room.price?.toLocaleString("en-IN")}
                </span>
                <span style={{ fontSize: 12, color: G.t3 }}> / month</span>
              </div>

              <div style={{ border: `1px solid ${G.b1}`, borderRadius: 11, overflow: "hidden", marginBottom: 11 }}>
                {[
                  { l: "Move-in date",   v: "Select a date" },
                  { l: "Beds available", v: `${room.availableBeds ?? "—"} beds` },
                  { l: "For",            v: room.gender ?? "Any" },
                ].map((r, i, arr) => (
                  <div key={i} style={{ padding: "9px 13px", borderBottom: i < arr.length - 1 ? `1px solid ${G.b1}` : "none" }}>
                    <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "1px", color: G.gold, marginBottom: 2 }}>{r.l}</div>
                    <div style={{ fontSize: 12, color: G.t2 }}>{r.v}</div>
                  </div>
                ))}
              </div>

              <button className="gold-btn" style={{ width: "100%", padding: 14, fontSize: 13, marginBottom: 5 }}>
                Book This Room
              </button>
              <p style={{ textAlign: "center", fontSize: 11, color: G.t3, marginBottom: 14 }}>No advance payment required</p>

              <div style={{ borderTop: `1px solid ${G.b1}`, paddingTop: 12 }}>
                {[
                  { l: `₹${room.price?.toLocaleString("en-IN")} × ${months} mo`, v: `₹${((room.price ?? 0) * months).toLocaleString("en-IN")}` },
                  { l: "Security deposit", v: `₹${deposit.toLocaleString("en-IN")}` },
                  { l: "Maintenance", v: "Included" },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: G.t3, padding: "3px 0" }}>
                    <span style={{ textDecoration: "underline", textDecorationColor: G.b1 }}>{row.l}</span>
                    <span style={{ color: G.t2 }}>{row.v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Georgia,serif", fontSize: 14, color: G.gold, borderTop: `1px solid ${G.b1}`, marginTop: 8, paddingTop: 9 }}>
                  <span>Total move-in</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {room.owner && (
                <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 9, background: G.bg3, border: `1px solid ${G.b1}`, borderRadius: 11, padding: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${G.golddim},${G.gold})`, display: "flex", alignItems: "center", justifyContent: "center", color: G.bg, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                    {room.owner.name?.[0] ?? "O"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: G.t1 }}>{room.owner.name}</div>
                    <div style={{ fontSize: 10, color: G.t3 }}>Verified Owner</div>
                  </div>
                  <button className="ghost-btn" style={{ padding: "5px 11px", fontSize: 11 }}>Contact</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div className="lb-overlay" onClick={() => setLightbox(null)}>
          <button className="lb-btn" style={{ top: 16, right: 16 }} onClick={() => setLightbox(null)}><X size={15} /></button>
          <button className="lb-btn" style={{ left: 16, top: "50%", transform: "translateY(-50%)" }}
            onClick={(e) => { e.stopPropagation(); setLightbox((l) => ({ ...l, idx: l.idx === 0 ? l.imgs.length - 1 : l.idx - 1 })); }}>
            <ChevronLeft size={20} />
          </button>
          <img className="lb-img" src={lightbox.imgs[lightbox.idx]} alt="" onClick={(e) => e.stopPropagation()} />
          <button className="lb-btn" style={{ right: 16, top: "50%", transform: "translateY(-50%)" }}
            onClick={(e) => { e.stopPropagation(); setLightbox((l) => ({ ...l, idx: l.idx === l.imgs.length - 1 ? 0 : l.idx + 1 })); }}>
            <ChevronRight size={20} />
          </button>
          <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", background: "rgba(14,14,15,0.75)", border: `1px solid ${G.b2}`, borderRadius: 8, padding: "4px 12px", fontSize: 12, color: G.t2, backdropFilter: "blur(6px)" }}>
            {lightbox.idx + 1} / {lightbox.imgs.length}
          </div>
          {lightbox.imgs.length > 1 && (
            <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, maxWidth: "80vw", overflowX: "auto", scrollbarWidth: "none", padding: "6px 10px", background: "rgba(14,14,15,0.65)", borderRadius: 12, backdropFilter: "blur(8px)" }}
              onClick={(e) => e.stopPropagation()}>
              {lightbox.imgs.map((img, i) => (
                <img key={i} className={`lb-thumb${i === lightbox.idx ? " on" : ""}`}
                  src={img} alt="" onClick={() => setLightbox((l) => ({ ...l, idx: i }))} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}