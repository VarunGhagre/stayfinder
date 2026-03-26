import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Star, MapPin, BedDouble,
  Share2, Heart, Upload, Check, Wifi, UtensilsCrossed,
  Car, Wind, ShieldCheck, Zap, X,
} from "lucide-react";
import api from "../api/axios";

// ── Amenity icon map ─────────────────────────────────────────
const AMENITY_ICONS = {
  WiFi:     <Wifi     size={15} />,
  Meals:    <UtensilsCrossed size={15} />,
  Parking:  <Car      size={15} />,
  AC:       <Wind     size={15} />,
  Security: <ShieldCheck size={15} />,
  Power:    <Zap      size={15} />,
};

// ── Gold colour tokens ────────────────────────────────────────
const G = {
  gold:  "#C9973A",
  gold2: "#E8C97A",
  bg:    "#0E0E0F",
  bg2:   "#161618",
  bg3:   "#1E1E21",
  bg4:   "#26262A",
  b1:    "rgba(201,151,58,0.15)",
  b2:    "rgba(201,151,58,0.3)",
  b3:    "rgba(201,151,58,0.5)",
  t1:    "#F2EDE6",
  t2:    "#A09480",
  t3:    "#5C5448",
  rose:  "#E8526A",
};

// ── Inline keyframes injected once ───────────────────────────
const CSS = `
  @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes scaleIn  { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
  @keyframes shimmer  { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes spin     { to{transform:rotate(360deg)} }

  .fade-up  { animation: fadeUp  0.55s cubic-bezier(.22,1,.36,1) both }
  .fade-in  { animation: fadeIn  0.4s ease both }
  .scale-in { animation: scaleIn 0.4s cubic-bezier(.22,1,.36,1) both }

  .skeleton {
    background: linear-gradient(90deg, #1E1E21 25%, #26262A 50%, #1E1E21 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 8px;
  }

  .img-thumb { transition: transform 0.4s ease, opacity 0.3s ease; cursor:pointer; }
  .img-thumb:hover { transform: scale(1.04); opacity:0.85; }

  .gold-btn {
    background: ${G.gold}; color: ${G.bg};
    border: none; border-radius: 14px;
    font-weight: 600; cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(201,151,58,0.25);
  }
  .gold-btn:hover {
    background: ${G.gold2};
    transform: translateY(-2px);
    box-shadow: 0 6px 28px rgba(201,151,58,0.4);
  }
  .gold-btn:active { transform: scale(0.97); }

  .ghost-btn {
    background: transparent; color: ${G.t2};
    border: 1px solid ${G.b2}; border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .ghost-btn:hover { border-color: ${G.b3}; color: ${G.gold}; background: rgba(201,151,58,0.06); }

  .amenity-chip {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 14px;
    background: ${G.bg3}; border: 1px solid ${G.b1};
    border-radius: 12px; font-size: 13px; color: ${G.t2};
    transition: border-color 0.2s, color 0.2s;
    animation: fadeUp 0.5s ease both;
  }
  .amenity-chip:hover { border-color: ${G.b2}; color: ${G.t1}; }

  .lightbox-overlay {
    position: fixed; inset: 0; z-index: 999;
    background: rgba(0,0,0,0.92);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.25s ease;
  }
  .lightbox-img {
    max-width: 90vw; max-height: 85vh;
    border-radius: 16px;
    animation: scaleIn 0.3s cubic-bezier(.22,1,.36,1);
  }

  .upload-zone {
    border: 2px dashed ${G.b2}; border-radius: 14px;
    padding: 20px; text-align: center;
    transition: all 0.2s; cursor: pointer;
  }
  .upload-zone.drag { border-color: ${G.gold}; background: rgba(201,151,58,0.06); }
  .upload-zone:hover { border-color: ${G.b3}; }

  .toast {
    position: fixed; bottom: 28px; left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: ${G.bg3}; border: 1px solid ${G.b2};
    color: ${G.t1}; padding: 10px 22px; border-radius: 12px;
    font-size: 13px; z-index: 9999;
    opacity: 0; pointer-events: none;
    transition: all 0.3s;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

  @media (max-width: 768px) {
    .det-grid { display: block !important; }
    .widget-sticky { position: static !important; }
  }
`;

// ── Skeleton loader ───────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ background: G.bg, minHeight: "100vh", padding: "32px 24px" }}>
      <style>{CSS}</style>
      <div className="skeleton" style={{ width: 120, height: 14, marginBottom: 24 }} />
      <div className="skeleton" style={{ width: "60%", height: 32, marginBottom: 12 }} />
      <div className="skeleton" style={{ width: "40%", height: 18, marginBottom: 28 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, height: 320, borderRadius: 16, overflow: "hidden", marginBottom: 32 }}>
        <div className="skeleton" style={{ borderRadius: 0, height: "100%" }} />
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 4 }}>
          <div className="skeleton" style={{ borderRadius: 0 }} />
          <div className="skeleton" style={{ borderRadius: 0 }} />
        </div>
      </div>
      {[80, 60, 90, 70].map((w, i) => (
        <div key={i} className="skeleton" style={{ width: `${w}%`, height: 14, marginBottom: 10 }} />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function RoomDetails() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [room,      setRoom]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [files,     setFiles]     = useState([]);
  const [uploading, setUploading] = useState(false);
  const [liked,     setLiked]     = useState(false);
  const [lightbox,  setLightbox]  = useState(null); // index | null
  const [drag,      setDrag]      = useState(false);
  const [toast,     setToast]     = useState("");
  const [previews,  setPreviews]  = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");

  const fileRef   = useRef(null);
  const toastRef  = useRef(null);

  // Fetch room
  useEffect(() => {
    api.get(`/rooms/${id}`)
      .then((res) => { setRoom(res.data.room || res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  // File previews
  useEffect(() => {
    if (!files.length) { setPreviews([]); return; }
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [files]);

  // Toast helper
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(""), 2600);
  };

  // Lightbox nav
  const imgs = room?.images || [];
  const prevLight = (e) => { e.stopPropagation(); setLightbox((l) => (l === 0 ? imgs.length - 1 : l - 1)); };
  const nextLight = (e) => { e.stopPropagation(); setLightbox((l) => (l === imgs.length - 1 ? 0 : l + 1)); };

  // Keyboard nav for lightbox
  useEffect(() => {
    const onKey = (e) => {
      if (lightbox === null) return;
      if (e.key === "ArrowLeft")  setLightbox((l) => (l === 0 ? imgs.length - 1 : l - 1));
      if (e.key === "ArrowRight") setLightbox((l) => (l === imgs.length - 1 ? 0 : l + 1));
      if (e.key === "Escape")     setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, imgs.length]);

  // Update images
  const handleUpdate = async () => {
    if (!files.length) { showToast("Please select images first"); return; }
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("images", f));
    try {
      const res = await api.put(`/rooms/update/${room._id}`, formData);
      setRoom(res.data.room);
      setFiles([]); setPreviews([]);
      showToast("✓ Images updated successfully!");
    } catch {
      showToast("Upload failed — please try again");
    } finally {
      setUploading(false);
    }
  };

  // Drag handlers
  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    setFiles(e.dataTransfer.files);
  };

  if (loading) return <Skeleton />;

  if (!room) return (
    <div style={{ background: G.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{CSS}</style>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 52, marginBottom: 12 }}>🏠</p>
        <p style={{ fontFamily: "Georgia,serif", fontSize: 22, color: G.t1, marginBottom: 6 }}>Room not found</p>
        <p style={{ fontSize: 14, color: G.t3, marginBottom: 20 }}>This listing may have been removed.</p>
        <button className="gold-btn" style={{ padding: "12px 28px", fontSize: 14 }} onClick={() => navigate("/rooms")}>
          Browse Rooms
        </button>
      </div>
    </div>
  );

  // Price calc (5 months)
  const months  = 5;
  const deposit = room.price * 2;
  const maint   = 0;
  const total   = room.price * months + deposit;

  const amenities = room.amenities?.length
    ? room.amenities
    : ["WiFi", "Meals", "AC", "Parking", "Security"];

  return (
    <div style={{ background: G.bg, minHeight: "100vh", color: G.t1 }}>
      <style>{CSS}</style>

      {/* ── BACK BAR ── */}
      <div className="fade-in" style={{ padding: "14px 24px", borderBottom: `1px solid ${G.b1}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: `rgba(14,14,15,0.9)`, backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 50 }}>
        <button className="ghost-btn" style={{ padding: "8px 16px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
          onClick={() => navigate(-1)}>
          <ChevronLeft size={15} /> Back
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ghost-btn" style={{ padding: "8px 14px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
            onClick={() => showToast("Link copied!")}>
            <Share2 size={14} /> Share
          </button>
          <button onClick={() => setLiked(!liked)} style={{ padding: "8px 14px", fontSize: 13, display: "flex", alignItems: "center", gap: 6, borderRadius: 12, border: `1px solid ${liked ? G.rose : G.b2}`, background: liked ? "rgba(232,82,106,0.1)" : "transparent", color: liked ? G.rose : G.t2, cursor: "pointer", transition: "all 0.2s" }}>
            <Heart size={14} fill={liked ? G.rose : "none"} /> {liked ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* ── CONTENT WRAPPER ── */}
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* ── TITLE + META ── */}
        <div className="fade-up" style={{ animationDelay: "0.05s", marginBottom: 20 }}>
          {room.badge && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,151,58,0.1)", border: `1px solid ${G.b2}`, borderRadius: 8, padding: "3px 10px", fontSize: 10, fontWeight: 600, color: G.gold, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: G.gold, animation: "pulse 2s infinite" }} />
              {room.badge}
            </div>
          )}
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(22px,4vw,36px)", fontWeight: 400, color: G.t1, lineHeight: 1.2, marginBottom: 10 }}>
            {room.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", fontSize: 13, color: G.t3 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: G.gold, fontWeight: 600 }}>
              <Star size={13} fill={G.gold} /> {room.rating ?? "4.8"}
            </span>
            <span>·</span>
            <span>{room.reviews?.length ?? 0} reviews</span>
            <span>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={12} style={{ color: G.gold }} /> {room.city || "Location not available"}
            </span>
            {room.availableBeds !== undefined && (
              <>
                <span>·</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <BedDouble size={12} style={{ color: G.gold }} /> {room.availableBeds} beds available
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── IMAGE GALLERY ── */}
        <div className="fade-up" style={{ animationDelay: "0.12s", marginBottom: 36 }}>
          {imgs.length > 0 ? (
            <>
              {/* Main grid */}
              <div style={{ display: "grid", gridTemplateColumns: imgs.length >= 3 ? "1.6fr 1fr" : "1fr", gridTemplateRows: "240px", gap: 4, borderRadius: 20, overflow: "hidden" }}>
                {/* Big image */}
                <div className="img-thumb" style={{ position: "relative" }} onClick={() => setLightbox(0)}>
                  <img src={imgs[activeImg] || imgs[0]} alt="main" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {imgs.length > 1 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setActiveImg((p) => (p === 0 ? imgs.length - 1 : p - 1)); }}
                        style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 30, height: 30, borderRadius: "50%", background: "rgba(14,14,15,0.75)", border: `1px solid ${G.b2}`, color: G.gold, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" }}>
                        <ChevronLeft size={15} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setActiveImg((p) => (p === imgs.length - 1 ? 0 : p + 1)); }}
                        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 30, height: 30, borderRadius: "50%", background: "rgba(14,14,15,0.75)", border: `1px solid ${G.b2}`, color: G.gold, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" }}>
                        <ChevronRight size={15} />
                      </button>
                    </>
                  )}
                  {/* Show all badge */}
                  {imgs.length > 3 && (
                    <button onClick={() => setLightbox(0)} style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(14,14,15,0.82)", border: `1px solid ${G.b2}`, color: G.t1, padding: "5px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer", backdropFilter: "blur(6px)" }}>
                      +{imgs.length - 3} photos
                    </button>
                  )}
                </div>
                {/* Side thumbnails */}
                {imgs.length >= 3 && (
                  <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 4 }}>
                    {imgs.slice(1, 3).map((img, i) => (
                      <div key={i} className="img-thumb" onClick={() => { setActiveImg(i + 1); setLightbox(i + 1); }}>
                        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Dot indicators */}
              {imgs.length > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 10 }}>
                  {imgs.map((_, i) => (
                    <div key={i} onClick={() => setActiveImg(i)} style={{ width: i === activeImg ? 18 : 7, height: 7, borderRadius: 4, background: i === activeImg ? G.gold : G.bg4, cursor: "pointer", transition: "all 0.2s" }} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ height: 260, borderRadius: 20, background: G.bg3, border: `1px solid ${G.b1}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>🏠</div>
          )}
        </div>

        {/* ── MAIN 2-COL LAYOUT ── */}
        <div className="det-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32 }}>

          {/* ── LEFT ── */}
          <div>

            {/* Quick facts */}
            <div className="fade-up" style={{ animationDelay: "0.18s", display: "flex", flexWrap: "wrap", gap: 8, paddingBottom: 24, borderBottom: `1px solid ${G.b1}`, marginBottom: 24 }}>
              {[
                { e: "🏠", l: room.type || "Entire room" },
                { e: "🛏️", l: `${room.availableBeds ?? 1} beds` },
                { e: "👤", l: `Max ${room.maxOccupants ?? 2} tenants` },
                { e: "🔑", l: "Self check-in" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: G.bg3, border: `1px solid ${G.b1}`, borderRadius: 10, fontSize: 13, color: G.t2 }}>
                  <span style={{ fontSize: 14 }}>{f.e}</span> {f.l}
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="fade-up" style={{ animationDelay: "0.22s", paddingBottom: 24, borderBottom: `1px solid ${G.b1}`, marginBottom: 24 }}>
              <h3 style={{ fontFamily: "Georgia,serif", fontSize: 18, color: G.t1, marginBottom: 10 }}>About this room</h3>
              <p style={{ fontSize: 14, color: G.t2, lineHeight: 1.8 }}>
                {room.description || "A fully furnished, well-maintained PG room with modern amenities. Perfect for working professionals and students seeking comfort, safety, and convenience in the heart of the city."}
              </p>
            </div>

            {/* Amenities */}
            <div className="fade-up" style={{ animationDelay: "0.26s", paddingBottom: 24, borderBottom: `1px solid ${G.b1}`, marginBottom: 24 }}>
              <h3 style={{ fontFamily: "Georgia,serif", fontSize: 18, color: G.t1, marginBottom: 14 }}>What's included</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 8 }}>
                {amenities.map((a, i) => (
                  <div key={i} className="amenity-chip" style={{ animationDelay: `${0.28 + i * 0.06}s` }}>
                    <span style={{ color: G.gold }}>{AMENITY_ICONS[a] ?? <span style={{ fontSize: 14 }}>✓</span>}</span>
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* ── IMAGE UPDATE SECTION ── */}
            <div className="fade-up" style={{ animationDelay: "0.35s" }}>
              <h3 style={{ fontFamily: "Georgia,serif", fontSize: 18, color: G.t1, marginBottom: 14 }}>Update photos</h3>

              {/* Drop zone */}
              <div
                className={`upload-zone${drag ? " drag" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
              >
                <Upload size={22} style={{ color: drag ? G.gold : G.t3, margin: "0 auto 8px" }} />
                <p style={{ fontSize: 13, color: drag ? G.gold : G.t2, marginBottom: 4 }}>
                  {drag ? "Drop images here" : "Drag & drop images, or click to browse"}
                </p>
                <p style={{ fontSize: 11, color: G.t3 }}>JPG, PNG — max 5 MB each</p>
                <input ref={fileRef} type="file" multiple accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => setFiles(e.target.files)} />
              </div>

              {/* Preview thumbnails */}
              {previews.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                  {previews.map((url, i) => (
                    <div key={i} style={{ position: "relative", width: 72, height: 72 }}>
                      <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10, border: `1px solid ${G.b2}` }} />
                      <button onClick={() => {
                        const dt = new DataTransfer();
                        Array.from(files).filter((_, fi) => fi !== i).forEach((f) => dt.items.add(f));
                        setFiles(dt.files);
                      }} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: G.rose, border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              <button
                className="gold-btn"
                onClick={handleUpdate}
                disabled={uploading || !files.length}
                style={{ marginTop: 14, padding: "12px 24px", fontSize: 13, display: "flex", alignItems: "center", gap: 8, opacity: files.length ? 1 : 0.5, cursor: files.length ? "pointer" : "not-allowed" }}
              >
                {uploading ? (
                  <>
                    <div style={{ width: 14, height: 14, border: `2px solid ${G.bg}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                    Uploading...
                  </>
                ) : (
                  <><Upload size={14} /> Update Images {files.length ? `(${files.length})` : ""}</>
                )}
              </button>
            </div>
          </div>

          {/* ── RIGHT — BOOKING WIDGET ── */}
          <div>
            <div className="widget-sticky scale-in" style={{ animationDelay: "0.2s", position: "sticky", top: 84, background: G.bg2, border: `1px solid ${G.b2}`, borderRadius: 20, padding: 22, boxShadow: `0 8px 40px rgba(0,0,0,0.4)` }}>

              {/* Price */}
              <div style={{ marginBottom: 18 }}>
                <span style={{ fontFamily: "Georgia,serif", fontSize: 30, fontWeight: 400, color: G.gold }}>
                  ₹{room.price?.toLocaleString("en-IN")}
                </span>
                <span style={{ fontSize: 13, color: G.t3 }}> / month</span>
              </div>

              {/* Date & beds */}
              <div style={{ border: `1px solid ${G.b1}`, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
                {[
                  { label: "Move-in date", value: "Select a date" },
                  { label: "Beds available", value: `${room.availableBeds ?? "—"} beds` },
                  { label: "For",           value: room.gender ?? "Any" },
                ].map((r, i, arr) => (
                  <div key={i} style={{ padding: "10px 14px", borderBottom: i < arr.length - 1 ? `1px solid ${G.b1}` : "none" }}>
                    <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "1px", color: G.gold, marginBottom: 3 }}>{r.label}</div>
                    <div style={{ fontSize: 13, color: G.t2 }}>{r.value}</div>
                  </div>
                ))}
              </div>

              {/* Book button */}
              <button className="gold-btn" style={{ width: "100%", padding: 15, fontSize: 14, marginBottom: 6 }}>
                Book This Room
              </button>
              <p style={{ textAlign: "center", fontSize: 11, color: G.t3, marginBottom: 16 }}>
                No advance payment required
              </p>

              {/* Price breakdown */}
              <div style={{ borderTop: `1px solid ${G.b1}`, paddingTop: 14 }}>
                {[
                  { l: `₹${room.price?.toLocaleString("en-IN")} × ${months} months`, v: `₹${(room.price * months)?.toLocaleString("en-IN")}` },
                  { l: "Security deposit (2 mo)", v: `₹${deposit?.toLocaleString("en-IN")}` },
                  { l: "Maintenance",             v: "Included" },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: G.t3, padding: "4px 0" }}>
                    <span style={{ textDecoration: "underline", textDecorationColor: G.b1 }}>{row.l}</span>
                    <span style={{ color: G.t2 }}>{row.v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Georgia,serif", fontSize: 15, color: G.gold, borderTop: `1px solid ${G.b1}`, marginTop: 8, paddingTop: 10 }}>
                  <span>Total move-in cost</span>
                  <span>₹{total?.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Owner contact */}
              {room.owner && (
                <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, background: G.bg3, border: `1px solid ${G.b1}`, borderRadius: 12, padding: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${G.golddim ?? "#8A6520"},${G.gold})`, display: "flex", alignItems: "center", justifyContent: "center", color: G.bg, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                    {room.owner.name?.[0] ?? "O"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: G.t1 }}>{room.owner.name}</div>
                    <div style={{ fontSize: 11, color: G.t3 }}>Verified Owner</div>
                  </div>
                  <button className="ghost-btn" style={{ padding: "6px 12px", fontSize: 12 }}>
                    Contact
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox !== null && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 20, right: 20, width: 36, height: 36, borderRadius: "50%", background: "rgba(14,14,15,0.8)", border: `1px solid ${G.b2}`, color: G.t2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} />
          </button>
          <button onClick={prevLight} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", width: 42, height: 42, borderRadius: "50%", background: "rgba(14,14,15,0.8)", border: `1px solid ${G.b2}`, color: G.gold, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={20} />
          </button>
          <img className="lightbox-img" src={imgs[lightbox]} alt="" onClick={(e) => e.stopPropagation()} />
          <button onClick={nextLight} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", width: 42, height: 42, borderRadius: "50%", background: "rgba(14,14,15,0.8)", border: `1px solid ${G.b2}`, color: G.gold, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronRight size={20} />
          </button>
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", fontSize: 13, color: G.t2 }}>
            {lightbox + 1} / {imgs.length}
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}