import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  BedDouble,
  Share2,
  Heart,
  Upload,
  X,
  Grid,
  Maximize2,
  Home,
  Building2,
  Utensils,
  MapPinned,
  Wifi,
  Car,
  Wind,
  ShieldCheck,
  Zap,
  UtensilsCrossed,
} from "lucide-react";
import api from "../api/axios";
import RoomMap from "../components/RoomMap";

const G = {
  gold: "#C9973A",
  gold2: "#E8C97A",
  golddim: "#8A6520",
  bg: "#0E0E0F",
  bg2: "#161618",
  bg3: "#1E1E21",
  bg4: "#26262A",
  b1: "rgba(201,151,58,0.15)",
  b2: "rgba(201,151,58,0.3)",
  b3: "rgba(201,151,58,0.5)",
  t1: "#F2EDE6",
  t2: "#A09480",
  t3: "#5C5448",
  rose: "#E8526A",
};

const UPLOAD_CATS = [
  { id: "room", label: "Room", Icon: Home },
  { id: "building", label: "Building", Icon: Building2 },
  { id: "amenities", label: "Amenities", Icon: Utensils },
  { id: "location", label: "Location", Icon: MapPinned },
];

const AMENITY_ICONS = {
  WiFi: <Wifi size={15} />,
  Meals: <UtensilsCrossed size={15} />,
  Parking: <Car size={15} />,
  AC: <Wind size={15} />,
  Security: <ShieldCheck size={15} />,
  Power: <Zap size={15} />,
};

const CSS = `
  @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes scaleIn { from{opacity:0;transform:scale(0.93)} to{opacity:1;transform:scale(1)} }
  @keyframes shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes imgIn   { from{opacity:0;transform:scale(1.04)} to{opacity:1;transform:scale(1)} }

  .fade-up  { animation: fadeUp  0.5s cubic-bezier(.22,1,.36,1) both }
  .scale-in { animation: scaleIn 0.4s cubic-bezier(.22,1,.36,1) both }
  .img-in   { animation: imgIn   0.3s ease both }

  .skeleton {
    background: linear-gradient(90deg,#1E1E21 25%,#26262A 50%,#1E1E21 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 8px;
  }

  .gold-btn {
    background:#C9973A; color:#0E0E0F; border:none;
    border-radius:12px; font-weight:600; cursor:pointer;
    transition:all 0.2s; box-shadow:0 4px 18px rgba(201,151,58,0.25);
  }
  .gold-btn:hover { background:#E8C97A; transform:translateY(-2px); }
  .gold-btn:active { transform:scale(0.97); }
  .gold-btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; }

  .ghost-btn {
    background:transparent; border:1px solid rgba(201,151,58,0.3);
    border-radius:10px; color:#A09480; cursor:pointer; transition:all 0.2s;
  }
  .ghost-btn:hover { border-color:rgba(201,151,58,0.5); color:#C9973A; background:rgba(201,151,58,0.06); }

  .cell-wrap { position:relative; overflow:hidden; cursor:pointer; }
  .cell-wrap img { width:100%; height:100%; object-fit:cover; transition:transform 0.45s ease; display:block; }
  .cell-wrap:hover img { transform:scale(1.06); }
  .cell-arrow {
    position:absolute; top:50%; transform:translateY(-50%);
    width:26px; height:26px; border-radius:50%;
    background:rgba(14,14,15,0.8); border:1px solid rgba(201,151,58,0.4);
    color:#C9973A; cursor:pointer; display:flex; align-items:center;
    justify-content:center; backdrop-filter:blur(4px);
    opacity:0; transition:opacity 0.2s; z-index:5;
  }
  .cell-wrap:hover .cell-arrow { opacity:1; }

  .tab-btn {
    display:flex; align-items:center; gap:5px;
    padding:6px 13px; border-radius:18px;
    border:1px solid rgba(201,151,58,0.15);
    font-size:12px; color:#5C5448;
    cursor:pointer; transition:all 0.2s; white-space:nowrap; background:transparent;
  }
  .tab-btn:hover { border-color:rgba(201,151,58,0.3); color:#A09480; }
  .tab-btn.on { border-color:#C9973A; color:#C9973A; background:rgba(201,151,58,0.1); }

  .upload-zone {
    border:2px dashed rgba(201,151,58,0.3); border-radius:14px;
    padding:18px; text-align:center; transition:all 0.2s; cursor:pointer;
  }
  .upload-zone:hover, .upload-zone.drag { border-color:#C9973A; background:rgba(201,151,58,0.05); }

  .amenity-pill {
    display:flex; align-items:center; gap:8px;
    padding:9px 13px; background:#1E1E21;
    border:1px solid rgba(201,151,58,0.15); border-radius:11px;
    font-size:13px; color:#A09480; transition:all 0.2s;
  }
  .amenity-pill:hover { border-color:rgba(201,151,58,0.3); color:#F2EDE6; }

  .lb { position:fixed; inset:0; z-index:1000; background:rgba(0,0,0,0.95); display:flex; align-items:center; justify-content:center; animation:fadeIn 0.2s ease; }
  .lb-img { max-width:90vw; max-height:85vh; border-radius:12px; animation:imgIn 0.25s ease; }
  .lb-btn { position:absolute; width:42px; height:42px; border-radius:50%; background:rgba(22,22,24,0.85); border:1px solid rgba(201,151,58,0.3); color:#C9973A; cursor:pointer; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(6px); transition:all 0.2s; }
  .lb-btn:hover { border-color:#C9973A; background:rgba(201,151,58,0.15); }
  .lb-thumb { width:54px; height:40px; object-fit:cover; border-radius:6px; cursor:pointer; opacity:0.5; border:2px solid transparent; transition:all 0.2s; flex-shrink:0; }
  .lb-thumb.on { opacity:1; border-color:#C9973A; }

  .toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(10px); background:#1E1E21; border:1px solid rgba(201,151,58,0.3); color:#F2EDE6; padding:10px 22px; border-radius:12px; font-size:13px; z-index:9999; opacity:0; pointer-events:none; transition:all 0.3s; white-space:nowrap; }
  .toast.show { opacity:1; transform:translateX(-50%) translateY(0); }

  @media(max-width:768px) { .two-col{display:block!important;} .sticky-widget{position:static!important;} }
`;

// ─────────────────────────────────────────────────────────────
// IndependentCell — HAS ITS OWN idx state.
// Completely isolated. Changing this cell NEVER affects
// any other cell or the main image.
// ─────────────────────────────────────────────────────────────
function IndependentCell({
  imgs,
  catLabel,
  CatIcon,
  onOpenLightbox,
  showAllBtn,
  totalAllImgs,
  onShowAll,
}) {
  // THIS is the key fix: each cell has its own private idx
  const [idx, setIdx] = useState(0);

  // Reset to 0 if the imgs array changes
  useEffect(() => {
    setIdx(0);
  }, [imgs.length, imgs[0]]);

  if (!imgs || imgs.length === 0) {
    return (
      <div
        style={{
          height: "100%",
          background: G.bg4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 22 }}>📷</span>
        <span style={{ fontSize: 10, color: G.t3 }}>No {catLabel} photos</span>
      </div>
    );
  }

  const prev = (e) => {
    e.stopPropagation();
    setIdx((p) => (p === 0 ? imgs.length - 1 : p - 1));
  };
  const next = (e) => {
    e.stopPropagation();
    setIdx((p) => (p === imgs.length - 1 ? 0 : p + 1));
  };

  return (
    <div
      className="cell-wrap"
      style={{ height: "100%" }}
      onClick={() => onOpenLightbox(imgs, idx)}
    >
      {/* key=idx triggers img-in animation on each change */}
      <img
        key={`${catLabel}-${idx}`}
        className="img-in"
        src={imgs[idx]}
        alt={catLabel}
      />

      {/* Independent prev/next — only changes THIS cell's idx */}
      {imgs.length > 1 && (
        <>
          <button className="cell-arrow" style={{ left: 6 }} onClick={prev}>
            <ChevronLeft size={12} />
          </button>
          <button className="cell-arrow" style={{ right: 6 }} onClick={next}>
            <ChevronRight size={12} />
          </button>
        </>
      )}

      {/* Category label */}
      <div
        style={{
          position: "absolute",
          top: 6,
          left: 6,
          background: "rgba(14,14,15,0.8)",
          border: `1px solid ${G.b1}`,
          borderRadius: 5,
          padding: "2px 7px",
          fontSize: 9,
          color: G.t2,
          backdropFilter: "blur(4px)",
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          gap: 3,
          pointerEvents: "none",
        }}
      >
        {CatIcon && <CatIcon size={9} />} {catLabel}
      </div>

      {/* Count */}
      {imgs.length > 1 && (
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            background: "rgba(14,14,15,0.8)",
            border: `1px solid ${G.b1}`,
            borderRadius: 5,
            padding: "2px 6px",
            fontSize: 9,
            color: G.gold,
            backdropFilter: "blur(4px)",
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          {idx + 1}/{imgs.length}
        </div>
      )}

      {/* Dots — only when few images */}
      {imgs.length > 1 && imgs.length <= 6 && (
        <div
          style={{
            position: "absolute",
            bottom: 7,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 3,
            zIndex: 4,
          }}
        >
          {imgs.map((_, i) => (
            <div
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setIdx(i);
              }}
              style={{
                width: i === idx ? 14 : 5,
                height: 5,
                borderRadius: 3,
                background: i === idx ? G.gold : "rgba(255,255,255,0.45)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
      )}

      {/* Show all button on last cell */}
      {showAllBtn && totalAllImgs > 5 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShowAll();
          }}
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            background: "rgba(14,14,15,0.85)",
            border: `1px solid ${G.b2}`,
            color: G.t1,
            padding: "3px 9px",
            borderRadius: 7,
            fontSize: 10,
            cursor: "pointer",
            backdropFilter: "blur(6px)",
            zIndex: 6,
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Grid size={10} /> +{totalAllImgs - 5}
        </button>
      )}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ background: G.bg, minHeight: "100vh", padding: "32px 20px" }}>
      <style>{CSS}</style>
      <div
        className="skeleton"
        style={{ width: 100, height: 13, marginBottom: 20 }}
      />
      <div
        className="skeleton"
        style={{ width: "55%", height: 28, marginBottom: 8 }}
      />
      <div
        className="skeleton"
        style={{ width: "35%", height: 15, marginBottom: 22 }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: 4,
          height: 440,
          borderRadius: 18,
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <div className="skeleton" style={{ borderRadius: 0, height: "100%" }} />
        <div
          style={{
            display: "grid",
            gridTemplateRows: "1fr 1fr 1fr 1fr",
            gap: 4,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ borderRadius: 0 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showAllGrid, setShowAllGrid] = useState(false);
  const [mainIdx, setMainIdx] = useState(0); // ONLY for left main image

  const [files, setFiles] = useState([]);
  const [uploadCat, setUploadCat] = useState("room");
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [drag, setDrag] = useState(false);
  const [toast, setToast] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const [reviews, setReviews] = useState([]);
const [rating, setRating] = useState(5);
const [comment, setComment] = useState("");

const [showMap, setShowMap] = useState(false);

  const fileRef = useRef(null);
  const toastRef = useRef(null);

  useEffect(() => {
    api
      .get(`/rooms/${id}`)
      .then((res) => {
        setRoom(res.data.room || res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!files.length) {
      setPreviews([]);
      return;
    }
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [files]);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(""), 2600);
  };

  useEffect(() => {
    const fn = (e) => {
      if (!lightbox) return;
      if (e.key === "ArrowLeft")
        setLightbox((l) => ({
          ...l,
          idx: l.idx === 0 ? l.imgs.length - 1 : l.idx - 1,
        }));
      if (e.key === "ArrowRight")
        setLightbox((l) => ({
          ...l,
          idx: l.idx === l.imgs.length - 1 ? 0 : l.idx + 1,
        }));
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [lightbox]);

  useEffect(() => {

  const fetchRoom = async () => {
    try {

      const { data } = await api.get(
        `/rooms/${id}`
      );

      setRoom(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  // 🔥 FETCH REVIEWS
  const fetchReviews = async () => {
    try {

      const { data } = await api.get(
        `/reviews/${id}`
      );

      setReviews(data);

    } catch (error) {

      console.log(error);

    }
  };

  fetchRoom();

  fetchReviews();

}, [id]);

  const handleUpdate = async () => {
    if (!files.length) {
      showToast("Please select images first");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("images", f));
    fd.append("category", uploadCat);
    try {
      const res = await api.put(`/rooms/update/${room._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRoom(res.data.room || res.data);
      setFiles([]);
      setPreviews([]);
      showToast(
        `✓ ${UPLOAD_CATS.find((c) => c.id === uploadCat)?.label} photos updated!`,
      );
    } catch (err) {
      console.error(err);
      showToast("Upload failed — please try again");
    } finally {
      setUploading(false);
    }
  };

  const handleBooking = async () => {
    try {
      await api.post(`/bookings/${room._id}`, {
        checkIn,
        checkOut,
        guests,
        totalAmount: total,
        totalDays,
        discount,
      });

      if (!checkIn || !checkOut) {
        return showToast("Select check-in & check-out dates");
      }

      showToast("📩 Booking request sent!");

      setTimeout(() => {
        navigate("/my-bookings");
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message;

      if (msg === "You already booked this room") {
        showToast("⚠️ You already booked this room");
      } else if (msg === "Room is already full") {
        showToast("🚫 Room is already full");
      } else {
        showToast("❌ Booking failed");
      }
    }
  };

  const handleReview = async () => {
  try {

    await api.post(`/reviews/${id}`, {
      rating,
      comment,
    });

    alert("Review added ⭐");

    setComment("");

    fetchReviews();

  } catch (err) {

    alert(
      err.response?.data?.message
    );
  }
};

  if (loading) return <Skeleton />;

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const isOwner = userInfo && room?.owner && userInfo._id === room.owner._id;

  if (!room)
    return (
      <div
        style={{
          background: G.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <style>{CSS}</style>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>🏠</p>
          <p
            style={{
              fontFamily: "Georgia,serif",
              fontSize: 22,
              color: G.t1,
              marginBottom: 14,
            }}
          >
            Room not found
          </p>
          <button
            className="gold-btn"
            style={{ padding: "11px 26px", fontSize: 14 }}
            onClick={() => navigate("/rooms")}
          >
            Browse Rooms
          </button>
        </div>
      </div>
    );

  // ── IMAGE ARRAYS — each category is SEPARATE ──────────────
  // Backend should send ONE of these two formats:
  //
  // FORMAT A (recommended — category-wise):
  //   room.imagesByCategory = {
  //     room:      ["url1.jpg", "url2.jpg"],
  //     building:  ["bld1.jpg"],
  //     amenities: ["gym.jpg", "kitchen.jpg"],
  //     location:  ["map.jpg"],
  //   }
  //
  // FORMAT B (old flat format — backward compatible):
  //   room.images = ["url1.jpg", "url2.jpg"]   ← all treated as "room"
  //   room.buildingImages  = [...]
  //   room.amenityImages   = [...]
  //   room.locationImages  = [...]

  const roomImgs = room.imagesByCategory?.room ?? room.images ?? [];
  const buildingImgs =
    room.imagesByCategory?.building ?? room.buildingImages ?? [];
  const amenityImgs =
    room.imagesByCategory?.amenities ?? room.amenityImages ?? [];
  const locationImgs =
    room.imagesByCategory?.location ?? room.locationImages ?? [];

  // Combined for "All" tab
  const allImgs = [
    ...roomImgs,
    ...buildingImgs,
    ...amenityImgs,
    ...locationImgs,
  ];

  const counts = {
    all: allImgs.length,
    room: roomImgs.length,
    building: buildingImgs.length,
    amenities: amenityImgs.length,
    location: locationImgs.length,
  };

  const tabMap = {
    all: allImgs,
    room: roomImgs,
    building: buildingImgs,
    amenities: amenityImgs,
    location: locationImgs,
  };
  const tabImgs = tabMap[activeTab] ?? [];
  const displayImgs = showAllGrid ? tabImgs : tabImgs.slice(0, 9);

  // Sub-cells for hero grid right column
  // ✅ ONLY building / amenities / location — NO room images here
  // Room images sirf left main cell mein dikhte hain (mainIdx se)
  const subCells = [
    { imgs: buildingImgs, label: "Building", Icon: Building2 },
    { imgs: amenityImgs, label: "Amenities", Icon: Utensils },
    { imgs: locationImgs, label: "Location", Icon: MapPinned },
  ];

  const amenities = room.amenities?.length
    ? room.amenities
    : ["WiFi", "Meals", "AC", "Parking", "Security"];

  // PRICE CALCULATION
  const oneDay = 1000 * 60 * 60 * 24;

  const startDate = checkIn ? new Date(checkIn) : null;
  const endDate = checkOut ? new Date(checkOut) : null;

  const totalDays =
    startDate && endDate ? Math.ceil((endDate - startDate) / oneDay) : 0;

  let basePrice = 0;

  if (room?.priceType === "day") {
    basePrice = totalDays * room.price;
  }

  if (room?.priceType === "night") {
    basePrice = totalDays * room.price;
  }

  if (room?.priceType === "week") {
    basePrice = Math.ceil(totalDays / 7) * room.price;
  }

  if (room?.priceType === "month") {
    basePrice = Math.ceil(totalDays / 30) * room.price;
  }

  let discount = 0;

  // ✅ only monthly rooms get discount
  if (room?.priceType === "month") {
    if (totalDays >= 30) {
      discount = basePrice * 0.15;
    } else if (totalDays >= 7) {
      discount = basePrice * 0.1;
    }
  }

  const finalPrice = basePrice - discount;

  const serviceFee = 499;

  const total = finalPrice + serviceFee;

  return (
    <div style={{ background: G.bg, minHeight: "100vh", color: G.t1 }}>
      <style>{CSS}</style>

      {/* Sticky bar */}
      <div
        style={{
          padding: "11px 22px",
          borderBottom: `1px solid ${G.b1}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(14,14,15,0.92)",
          backdropFilter: "blur(16px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <button
          className="ghost-btn"
          style={{
            padding: "7px 13px",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={14} /> Back
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="ghost-btn"
            style={{
              padding: "7px 12px",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
            onClick={() => showToast("Link copied!")}
          >
            <Share2 size={13} /> Share
          </button>
          <button
            onClick={() => setLiked(!liked)}
            style={{
              padding: "7px 12px",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 5,
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.2s",
              border: `1px solid ${liked ? G.rose : G.b2}`,
              background: liked ? "rgba(232,82,106,0.1)" : "transparent",
              color: liked ? G.rose : G.t2,
            }}
          >
            <Heart size={13} fill={liked ? G.rose : "none"} />{" "}
            {liked ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      <div
        style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 18px 80px" }}
      >
        {/* Title */}
        <div
          className="fade-up"
          style={{ animationDelay: "0.04s", marginBottom: 16 }}
        >
          {room.badge && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(201,151,58,0.1)",
                border: `1px solid ${G.b2}`,
                borderRadius: 7,
                padding: "2px 9px",
                fontSize: 10,
                fontWeight: 600,
                color: G.gold,
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: G.gold,
                  animation: "pulse 2s infinite",
                }}
              />
              {room.badge}
            </div>
          )}
          <h1
            style={{
              fontFamily: "Georgia,serif",
              fontSize: "clamp(20px,3.5vw,34px)",
              fontWeight: 400,
              color: G.t1,
              lineHeight: 1.2,
              marginBottom: 7,
            }}
          >
            {room.title}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              fontSize: 13,
              color: G.t3,
            }}
          >
            <span
              style={{
                color: G.gold,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Star size={12} fill={G.gold} /> {room.rating ?? "4.8"}
            </span>
            <span>·</span>
            <span>{reviews?.length || 0} reviews</span>
            <span>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={12} style={{ color: G.gold }} />{" "}
              {room.city ?? "Location not available"}
            </span>
            {room.availableBeds !== undefined && (
              <>
                <span>·</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <BedDouble size={12} style={{ color: G.gold }} />{" "}
                  {room.availableBeds} beds
                </span>
              </>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            HERO GRID
            Left col (span 4 rows) = Main room image — mainIdx
            Right col (4 rows)     = 4 IndependentCells
            Each IndependentCell has its OWN private idx state.
            Arrows in right col NEVER touch mainIdx.
        ═══════════════════════════════════════════════════ */}
        <div
          className="fade-up"
          style={{ animationDelay: "0.09s", marginBottom: 12 }}
        >
          {allImgs.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "repeat(3, 147px)",
                gap: 4,
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              {/* LEFT: Main image slider — uses mainIdx, ONLY roomImgs */}
              <div
                className="cell-wrap"
                style={{ gridRow: "span 3", position: "relative" }}
              >
                {roomImgs.length > 0 ? (
                  <>
                    <img
                      key={`main-${mainIdx}`}
                      className="img-in"
                      src={roomImgs[mainIdx]}
                      alt="room"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onClick={() =>
                        setLightbox({ imgs: roomImgs, idx: mainIdx })
                      }
                    />
                    {roomImgs.length > 1 && (
                      <>
                        <button
                          style={{
                            position: "absolute",
                            left: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "rgba(14,14,15,0.78)",
                            border: `1px solid ${G.b2}`,
                            color: G.gold,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backdropFilter: "blur(6px)",
                            zIndex: 5,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setMainIdx((p) =>
                              p === 0 ? roomImgs.length - 1 : p - 1,
                            );
                          }}
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          style={{
                            position: "absolute",
                            right: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "rgba(14,14,15,0.78)",
                            border: `1px solid ${G.b2}`,
                            color: G.gold,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backdropFilter: "blur(6px)",
                            zIndex: 5,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setMainIdx((p) =>
                              p === roomImgs.length - 1 ? 0 : p + 1,
                            );
                          }}
                        >
                          <ChevronRight size={16} />
                        </button>
                        <div
                          style={{
                            position: "absolute",
                            bottom: 12,
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            gap: 4,
                            zIndex: 5,
                          }}
                        >
                          {roomImgs.map((_, i) => (
                            <div
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation();
                                setMainIdx(i);
                              }}
                              style={{
                                width: i === mainIdx ? 18 : 6,
                                height: 6,
                                borderRadius: 3,
                                background:
                                  i === mainIdx
                                    ? G.gold
                                    : "rgba(255,255,255,0.4)",
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        background: "rgba(14,14,15,0.78)",
                        border: `1px solid ${G.b1}`,
                        borderRadius: 6,
                        padding: "3px 9px",
                        fontSize: 10,
                        color: G.gold,
                        backdropFilter: "blur(4px)",
                        zIndex: 5,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        pointerEvents: "none",
                      }}
                    >
                      <Home size={10} /> Room · {mainIdx + 1}/{roomImgs.length}
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: G.bg3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 48,
                    }}
                  >
                    🏠
                  </div>
                )}
              </div>

              {/* RIGHT: 4 IndependentCells — each manages its own idx */}
              {/* {subCells.map((cell, i) => (
                <div key={i} style={{ position:"relative", overflow:"hidden" }}>
                  <IndependentCell
                    imgs={cell.imgs}
                    catLabel={cell.label}
                    CatIcon={cell.Icon}
                    onOpenLightbox={(imgs, idx) => setLightbox({ imgs, idx })}
                    showAllBtn={i === 2}
                    totalAllImgs={allImgs.length}
                    onShowAll={() => setLightbox({ imgs:allImgs, idx:0 })}
                  />
                </div>
              ))} */}
            </div>
          ) : (
            <div
              style={{
                height: 280,
                borderRadius: 20,
                background: G.bg3,
                border: `1px solid ${G.b1}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
              }}
            >
              🏠
            </div>
          )}
        </div>

        {/* Category tabs + full grid */}
        <div
          className="fade-up"
          style={{ animationDelay: "0.15s", marginBottom: 28 }}
        >
          <div
            style={{
              display: "flex",
              gap: 6,
              overflowX: "auto",
              scrollbarWidth: "none",
              paddingBottom: 4,
              marginBottom: 12,
            }}
          >
            {[
              { id: "all", label: "All Photos", Icon: Grid },
              { id: "room", label: "Room", Icon: Home },
              { id: "building", label: "Building", Icon: Building2 },
              { id: "amenities", label: "Amenities", Icon: Utensils },
              { id: "location", label: "Location", Icon: MapPinned },
            ]
              .filter((t) => t.id === "all" || counts[t.id] > 0)
              .map((t) => (
                <button
                  key={t.id}
                  className={`tab-btn${activeTab === t.id ? " on" : ""}`}
                  onClick={() => {
                    setActiveTab(t.id);
                    setShowAllGrid(false);
                  }}
                >
                  <t.Icon size={11} /> {t.label} ({counts[t.id] ?? 0})
                </button>
              ))}
          </div>

          {tabImgs.length > 0 ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5,1fr)",
                  gap: 4,
                  borderRadius: 14,
                  overflow: "hidden",
                }}
              >
                {displayImgs.map((img, i) => (
                  <div
                    key={`${activeTab}-${i}`}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                      height: i === 0 || i === 6 ? 200 : 200,
                      gridColumn:
                        (i === 0 || i === 6) && displayImgs.length > 2
                          ? "span 2"
                          : "span 1",
                    }}
                    onClick={() => setLightbox({ imgs: tabImgs, idx: i })}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  </div>
                ))}
              </div>
              {tabImgs.length > 9 && (
                <div style={{ textAlign: "center", marginTop: 10 }}>
                  <button
                    className="ghost-btn"
                    style={{
                      padding: "8px 20px",
                      fontSize: 12,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                    onClick={() => setShowAllGrid(!showAllGrid)}
                  >
                    {showAllGrid
                      ? "Show less"
                      : `Show all ${tabImgs.length} photos`}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                padding: "24px 0",
                textAlign: "center",
                color: G.t3,
                fontSize: 13,
              }}
            >
              No photos in this category
            </div>
          )}
        </div>

        {/* 2-col layout */}
        <div
          className="two-col"
          style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 30 }}
        >
          {/* LEFT */}
          <div>
            {/* Quick facts */}
            <div
              className="fade-up"
              style={{
                animationDelay: "0.18s",
                display: "flex",
                flexWrap: "wrap",
                gap: 7,
                paddingBottom: 20,
                borderBottom: `1px solid ${G.b1}`,
                marginBottom: 20,
              }}
            >
              {[
                { e: "🏠", l: room.type || "Entire room" },
                { e: "🛏️", l: `${room.availableBeds ?? 1} beds` },
                { e: "👤", l: `Max ${room.maxOccupants ?? 2} tenants` },
                { e: "🔑", l: "Self check-in" },
              ].map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 12px",
                    background: G.bg3,
                    border: `1px solid ${G.b1}`,
                    borderRadius: 9,
                    fontSize: 12,
                    color: G.t2,
                  }}
                >
                  <span style={{ fontSize: 13 }}>{f.e}</span> {f.l}
                </div>
              ))}
            </div>

            {/* Description */}
            <div
              className="fade-up"
              style={{
                animationDelay: "0.22s",
                paddingBottom: 20,
                borderBottom: `1px solid ${G.b1}`,
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: 17,
                  color: G.t1,
                  marginBottom: 8,
                }}
              >
                About this room
              </h3>
              <p style={{ fontSize: 13, color: G.t2, lineHeight: 1.8 }}>
                {room.description ||
                  "A fully furnished, air-conditioned room perfect for working professionals and students. Includes all meals, WiFi, and daily housekeeping in a safe, secure building."}
              </p>
            </div>

            {/* Amenities */}
            <div
              className="fade-up"
              style={{
                animationDelay: "0.26s",
                paddingBottom: 20,
                borderBottom: `1px solid ${G.b1}`,
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: 17,
                  color: G.t1,
                  marginBottom: 11,
                }}
              >
                What's included
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(128px,1fr))",
                  gap: 7,
                }}
              >
                {amenities.map((a, i) => (
                  <div
                    key={i}
                    className="amenity-pill"
                    style={{ animationDelay: `${0.28 + i * 0.05}s` }}
                  >
                    <span style={{ color: G.gold }}>
                      {AMENITY_ICONS[a] ?? (
                        <span style={{ fontSize: 13 }}>✓</span>
                      )}
                    </span>
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Upload */}
            {isOwner && (
              <div className="fade-up" style={{ animationDelay: "0.32s" }}>
                <h3
                  style={{
                    fontFamily: "Georgia,serif",
                    fontSize: 17,
                    color: G.t1,
                    marginBottom: 11,
                  }}
                >
                  Update photos
                </h3>

                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginBottom: 11,
                    flexWrap: "wrap",
                  }}
                >
                  {UPLOAD_CATS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setUploadCat(c.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "6px 12px",
                        borderRadius: 8,
                        border: `1px solid ${uploadCat === c.id ? G.gold : G.b1}`,
                        background:
                          uploadCat === c.id
                            ? "rgba(201,151,58,0.1)"
                            : "transparent",
                        color: uploadCat === c.id ? G.gold : G.t3,
                        fontSize: 12,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <c.Icon size={11} /> {c.label}
                      <span style={{ fontSize: 10, opacity: 0.6 }}>
                        ({counts[c.id] ?? 0})
                      </span>
                    </button>
                  ))}
                </div>

                <div
                  className={`upload-zone${drag ? " drag" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDrag(true);
                  }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDrag(false);
                    setFiles(e.dataTransfer.files);
                  }}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload
                    size={20}
                    style={{
                      color: drag ? G.gold : G.t3,
                      margin: "0 auto 7px",
                    }}
                  />
                  <p
                    style={{
                      fontSize: 12,
                      color: drag ? G.gold : G.t2,
                      marginBottom: 3,
                    }}
                  >
                    {drag ? "Drop here" : "Drag & drop or click to select"}
                  </p>
                  <p style={{ fontSize: 11, color: G.t3 }}>
                    Adding to:{" "}
                    <span style={{ color: G.gold, fontWeight: 600 }}>
                      {UPLOAD_CATS.find((c) => c.id === uploadCat)?.label}
                    </span>{" "}
                    category
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setFiles(e.target.files)}
                  />
                </div>

                {previews.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 7,
                      flexWrap: "wrap",
                      marginTop: 10,
                    }}
                  >
                    {previews.map((url, i) => (
                      <div
                        key={i}
                        style={{ position: "relative", width: 66, height: 66 }}
                      >
                        <img
                          src={url}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 9,
                            border: `1px solid ${G.b2}`,
                          }}
                        />
                        <button
                          onClick={() => {
                            const dt = new DataTransfer();
                            Array.from(files)
                              .filter((_, fi) => fi !== i)
                              .forEach((f) => dt.items.add(f));
                            setFiles(dt.files);
                          }}
                          style={{
                            position: "absolute",
                            top: -5,
                            right: -5,
                            width: 17,
                            height: 17,
                            borderRadius: "50%",
                            background: G.rose,
                            border: "none",
                            color: "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <X size={9} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  className="gold-btn"
                  onClick={handleUpdate}
                  disabled={uploading || !files.length}
                  style={{
                    marginTop: 11,
                    padding: "11px 22px",
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  {uploading ? (
                    <>
                      <div
                        style={{
                          width: 13,
                          height: 13,
                          border: `2px solid ${G.bg}`,
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                        }}
                      />{" "}
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={13} /> Save{" "}
                      {UPLOAD_CATS.find((c) => c.id === uploadCat)?.label}{" "}
                      Photos{files.length ? ` (${files.length})` : ""}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT - Booking widget */}
          {/* RIGHT - Airbnb Booking Widget */}
          <div>
            <div
              className="sticky-widget scale-in"
              style={{
                animationDelay: "0.16s",
                position: "sticky",
                top: 80,
                background: G.bg2,
                border: `1px solid ${G.b2}`,
                borderRadius: 24,
                padding: 22,
                boxShadow: "0 10px 50px rgba(0,0,0,0.45)",
              }}
            >
              {/* PRICE */}
              <div style={{ marginBottom: 18 }}>
                <span
                  style={{
                    fontFamily: "Georgia,serif",
                    fontSize: 30,
                    color: G.gold,
                  }}
                >
                  ₹{room.price?.toLocaleString("en-IN")}
                </span>

                <span style={{ color: G.t3, fontSize: 13 }}>
                  {" "}
                  / {room.priceType}
                </span>
              </div>

              {/* CHECK-IN / OUT */}
              <div
                style={{
                  border: `1px solid ${G.b1}`,
                  borderRadius: 16,
                  overflow: "hidden",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                  }}
                >
                  <div
                    style={{
                      borderRight: `1px solid ${G.b1}`,
                      padding: 12,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        color: G.gold,
                        marginBottom: 4,
                      }}
                    >
                      CHECK-IN
                    </p>

                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      style={{
                        width: "90%",
                        background: "transparent",
                        border: "none",
                        color: G.t1,
                        outline: "none",
                        fontSize: 13,
                      }}
                    />
                  </div>

                  <div style={{ padding: 12 }}>
                    <p
                      style={{
                        fontSize: 10,
                        color: G.gold,
                        marginBottom: 4,
                      }}
                    >
                      CHECK-OUT
                    </p>

                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      style={{
                        width: "90%",
                        background: "transparent",
                        border: "none",
                        color: G.t1,
                        outline: "none",
                        fontSize: 13,
                      }}
                    />
                  </div>
                </div>

                {/* GUESTS */}
                <div
                  style={{
                    borderTop: `1px solid ${G.b1}`,
                    padding: 12,
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      color: G.gold,
                      marginBottom: 4,
                    }}
                  >
                    GUESTS
                  </p>

                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      color: G.t1,
                      outline: "none",
                      fontSize: 13,
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((g) => (
                      <option key={g} value={g} style={{ color: "black" }}>
                        {g} Guest
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* BOOK BUTTON */}
              <button
                className="gold-btn"
                style={{
                  width: "100%",
                  padding: 14,
                  fontSize: 14,
                  borderRadius: 14,
                  marginBottom: 12,
                }}
                onClick={handleBooking}
              >
                Reserve
              </button>

              <p
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  color: G.t3,
                  marginBottom: 16,
                }}
              >
                Final amount shown below
              </p>

              {/* PRICE DETAILS */}
              {totalDays > 0 && (
                <>
                  <div
                    style={{
                      borderTop: `1px solid ${G.b1}`,
                      paddingTop: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                        color: G.t2,
                        fontSize: 13,
                      }}
                    >
                      <span>
                        ₹{room.price} × {totalDays} days
                      </span>

                      <span>₹{basePrice.toLocaleString("en-IN")}</span>
                    </div>

                    {/* DISCOUNT */}
                    {discount > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                          color: "#4ade80",
                          fontSize: 13,
                        }}
                      >
                        <span>Long stay discount</span>

                        <span>-₹{discount.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {/* SERVICE */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                        color: G.t2,
                        fontSize: 13,
                      }}
                    >
                      <span>Service fee</span>

                      <span>₹{serviceFee}</span>
                    </div>

                    {/* FINAL */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderTop: `1px solid ${G.b1}`,
                        paddingTop: 12,
                        marginTop: 12,
                        fontSize: 16,
                        fontWeight: 600,
                        color: G.gold,
                      }}
                    >
                      <span>Total</span>

                      <span>₹{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lb" onClick={() => setLightbox(null)}>
          <button
            className="lb-btn"
            style={{ top: 15, right: 15 }}
            onClick={() => setLightbox(null)}
          >
            <X size={15} />
          </button>
          <button
            className="lb-btn"
            style={{ left: 15, top: "50%", transform: "translateY(-50%)" }}
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((l) => ({
                ...l,
                idx: l.idx === 0 ? l.imgs.length - 1 : l.idx - 1,
              }));
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <img
            key={lightbox.idx}
            className="lb-img"
            src={lightbox.imgs[lightbox.idx]}
            alt=""
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lb-btn"
            style={{ right: 15, top: "50%", transform: "translateY(-50%)" }}
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((l) => ({
                ...l,
                idx: l.idx === l.imgs.length - 1 ? 0 : l.idx + 1,
              }));
            }}
          >
            <ChevronRight size={20} />
          </button>
          <div
            style={{
              position: "absolute",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(14,14,15,0.75)",
              border: `1px solid ${G.b2}`,
              borderRadius: 8,
              padding: "4px 12px",
              fontSize: 12,
              color: G.t2,
            }}
          >
            {lightbox.idx + 1} / {lightbox.imgs.length}
          </div>
          {lightbox.imgs.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: 14,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 5,
                maxWidth: "80vw",
                overflowX: "auto",
                scrollbarWidth: "none",
                padding: "6px 10px",
                background: "rgba(14,14,15,0.65)",
                borderRadius: 12,
                backdropFilter: "blur(8px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.imgs.map((img, i) => (
                <img
                  key={i}
                  className={`lb-thumb${i === lightbox.idx ? " on" : ""}`}
                  src={img}
                  alt=""
                  onClick={() => setLightbox((l) => ({ ...l, idx: i }))}
                />
              ))}
            </div>
          )}
        </div>
      )}


<button
  onClick={() => setShowMap(true)}
  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all duration-300 hover:scale-105"
  style={{
    background: "#1E1E21",
    border: "1px solid rgba(201,151,58,0.2)",
  }}
>
  <MapPin size={18} color="#C9973A" />

  View on Map
</button>

{/* =========================
    AIRBNB STYLE REVIEWS
========================= */}
<div
  style={{
    marginTop: "70px",
  }}
>

  {/* HEADER */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "35px",
    }}
  >
    <span
      style={{
        fontSize: "28px",
      }}
    >
      ⭐
    </span>

    <h2
      style={{
        fontSize: "32px",
        color: "white",
        fontWeight: "700",
      }}
    >
      Reviews
    </h2>

    <span
      style={{
        color: "#C9973A",
        fontWeight: "600",
      }}
    >
      ({reviews.length})
    </span>
  </div>

  {/* REVIEW FORM */}
  <div
    style={{
      background: "#1E1E21",
      border:
        "1px solid rgba(255,255,255,0.08)",
      borderRadius: "24px",
      padding: "28px",
      marginBottom: "40px",
      boxShadow:
        "0 10px 40px rgba(0,0,0,0.25)",
    }}
  >

    {/* TITLE */}
    <h3
      style={{
        color: "white",
        fontSize: "22px",
        marginBottom: "20px",
      }}
    >
      Share your experience
    </h3>

    {/* STAR SELECT */}
    <div
      style={{
        display: "flex",
        gap: "12px",
        marginBottom: "22px",
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => (

        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "34px",
            transition: "0.2s",
            color:
              rating >= star
                ? "#FFD700"
                : "#444",
          }}
        >
          ★
        </button>

      ))}
    </div>

    {/* TEXTAREA */}
    <textarea
      value={comment}
      onChange={(e) =>
        setComment(e.target.value)
      }
      placeholder="What did you like or dislike?"
      style={{
        width: "100%",
        minHeight: "140px",
        background: "#26262A",
        border:
          "1px solid rgba(255,255,255,0.08)",
        borderRadius: "18px",
        padding: "18px",
        color: "white",
        outline: "none",
        resize: "none",
        fontSize: "15px",
        lineHeight: "1.6",
      }}
    />

    {/* BUTTON */}
    <button
      onClick={handleReview}
      style={{
        marginTop: "20px",
        background:
          "linear-gradient(135deg,#C9973A,#E5B94E)",
        color: "#111",
        border: "none",
        padding: "14px 28px",
        borderRadius: "14px",
        fontWeight: "700",
        cursor: "pointer",
        fontSize: "15px",
      }}
    >
      Submit Review
    </button>
  </div>

  {/* REVIEW LIST */}
  <div
    style={{
      display: "grid",
      gap: "22px",
    }}
  >

    {reviews.length === 0 ? (

      <div
        style={{
          background: "#1E1E21",
          padding: "30px",
          borderRadius: "20px",
          color: "#999",
          textAlign: "center",
        }}
      >
        No reviews yet
      </div>

    ) : (

      reviews.map((r) => (

        <div
          key={r._id}
          style={{
            background: "#1E1E21",
            border:
              "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "24px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >

          {/* TOP */}
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "18px",
            }}
          >

            {/* USER */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >

              {/* AVATAR */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,#C9973A,#E5B94E)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  color: "#111",
                  fontSize: "18px",
                }}
              >
                {r.user?.name?.[0]}
              </div>

              {/* NAME */}
              <div>
                <h4
                  style={{
                    color: "white",
                    fontSize: "17px",
                    marginBottom: "4px",
                  }}
                >
                  {r.user?.name}
                </h4>

                <p
                  style={{
                    color: "#888",
                    fontSize: "13px",
                  }}
                >
                  {new Date(
                    r.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* RATING */}
            <div
              style={{
                background:
                  "rgba(255,215,0,0.12)",
                color: "#FFD700",
                padding: "8px 14px",
                borderRadius: "999px",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              ⭐ {r.rating}.0
            </div>
          </div>

          {/* COMMENT */}
          <p
            style={{
              color: "#DDD",
              lineHeight: "1.8",
              fontSize: "15px",
            }}
          >
            {r.comment}
          </p>
        </div>

      ))
    )}
  </div>
</div>


{/* MAP MODAL */}
{showMap && (

  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    }}
  >

    {/* BOX */}
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        background: "#111",
        borderRadius: "24px",
        overflow: "hidden",
        position: "relative",
      }}
    >

      {/* CLOSE */}
      <button
        onClick={() => setShowMap(false)}
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          zIndex: 1000,
          background: "#fff",
          border: "none",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          cursor: "pointer",
        }}
      >
        <X size={20} />
      </button>

      {/* MAP */}
      <RoomMap
        lat={room.latitude}
        lng={room.longitude}
        title={room.title}
      />

    </div>
  </div>
)}


      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>

    
  );
}
