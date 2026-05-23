import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Search,
  MapPin,
  BedDouble,
  Home,
  Building2,
  Utensils,
  Users,
  Wifi,
  Wind,
  Car,
  ShieldCheck,
  MoreVertical,
} from "lucide-react";
import api from "../api/axios";
import Layout from "../components/Layout";
import RoomCard, { RoomCardSkeleton } from "../components/RoomCard";
import { useNavigate } from "react-router-dom";

// ── Constants ─────────────────────────────────────────────────
const CATEGORIES = [
  { id: "All", emoji: "🏠", label: "All" },
  { id: "PG", emoji: "🛏️", label: "PG" },
  { id: "Hostel", emoji: "🏨", label: "Hostel" },
  { id: "Flat", emoji: "🏢", label: "Flat" },
  { id: "Villa", emoji: "🏰", label: "Villa" },
  { id: "Apartment", emoji: "🏗️", label: "Apartment" },
];

const AMENITY_OPTIONS = [
  { id: "WiFi", icon: <Wifi size={13} />, label: "WiFi" },
  { id: "AC", icon: <Wind size={13} />, label: "AC" },
  { id: "Meals", icon: <Utensils size={13} />, label: "Meals" },
  { id: "Parking", icon: <Car size={13} />, label: "Parking" },
  { id: "Security", icon: <ShieldCheck size={13} />, label: "Security" },
];

const GENDER_OPTIONS = ["Any", "Boys", "Girls"];

const SORT_OPTIONS = [
  { id: "default", label: "Default" },
  { id: "price_asc", label: "Price: Low → High" },
  { id: "price_desc", label: "Price: High → Low" },
  { id: "rating", label: "Top Rated" },
  { id: "beds", label: "Most Beds" },
];

// ── CSS ───────────────────────────────────────────────────────
const CSS = `
  @keyframes rlFadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rlSlideIn { from{transform:translateX(-100%)} to{transform:translateX(0)} }
  @keyframes rlFadeIn  { from{opacity:0} to{opacity:1} }

  .rl-cat {
    display:flex; flex-direction:column; align-items:center; gap:5px;
    padding:9px 18px; border-bottom:2px solid transparent;
    cursor:pointer; flex-shrink:0; opacity:0.45; transition:all 0.22s;
  }
  .rl-cat:hover { opacity:0.8; }
  .rl-cat.on { border-color:#C9973A; opacity:1; }
  .rl-cat.on .rl-cat-lbl { color:#C9973A; }
  .rl-cat-lbl { font-size:11px; font-weight:500; color:#A09480; white-space:nowrap; }

  .rl-filt-btn {
    display:flex; align-items:center; gap:6px;
    padding:8px 16px; border-radius:10px;
    background:#1E1E21; border:1px solid rgba(201,151,58,0.25);
    color:#A09480; font-size:12px; font-weight:500;
    cursor:pointer; transition:all 0.2s;
  }
  .rl-filt-btn:hover { border-color:rgba(201,151,58,0.5); color:#C9973A; }
  .rl-filt-btn.active { border-color:#C9973A; color:#C9973A; background:rgba(201,151,58,0.1); }

  .rl-sort {
    appearance:none; background:#1E1E21; border:1px solid rgba(201,151,58,0.25);
    color:#A09480; font-size:12px; padding:8px 32px 8px 12px;
    border-radius:10px; cursor:pointer; outline:none; transition:all 0.2s;
  }
  .rl-sort:hover { border-color:rgba(201,151,58,0.5); color:#C9973A; }

  .rl-drawer {
    position:fixed; top:0; left:0; height:100%; width:300px;
    background:#161618; border-right:1px solid rgba(201,151,58,0.2);
    z-index:60; display:flex; flex-direction:column;
    box-shadow:6px 0 40px rgba(0,0,0,0.6);
    animation:rlSlideIn 0.3s cubic-bezier(.22,1,.36,1);
  }

  .rl-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:55; backdrop-filter:blur(4px); animation:rlFadeIn 0.2s ease; }

  .rl-range {
    width:100%; height:3px; appearance:none;
    background:rgba(201,151,58,0.2); border-radius:2px; outline:none; cursor:pointer;
  }
  .rl-range::-webkit-slider-thumb {
    appearance:none; width:18px; height:18px; border-radius:50%;
    background:#C9973A; cursor:pointer;
    border:3px solid #161618; box-shadow:0 0 8px rgba(201,151,58,0.4);
  }

  .rl-amenity {
    display:flex; align-items:center; gap:7px;
    padding:8px 10px; border-radius:9px;
    background:#1E1E21; border:1px solid rgba(201,151,58,0.12);
    font-size:12px; color:#A09480; cursor:pointer; transition:all 0.18s;
  }
  .rl-amenity:hover { border-color:rgba(201,151,58,0.3); color:#C9973A; }
  .rl-amenity.on { border-color:#C9973A; background:rgba(201,151,58,0.1); color:#C9973A; }

  .rl-gender-btn {
    flex:1; padding:8px; border-radius:9px; font-size:12px;
    border:1px solid rgba(201,151,58,0.15); color:#5C5448;
    background:transparent; cursor:pointer; text-align:center; transition:all 0.18s;
  }
  .rl-gender-btn:hover { border-color:rgba(201,151,58,0.3); color:#A09480; }
  .rl-gender-btn.on { border-color:#C9973A; background:rgba(201,151,58,0.1); color:#C9973A; }

  .rl-apply {
    width:100%; padding:13px; background:#C9973A; color:#0E0E0F;
    border:none; border-radius:12px; font-size:13px; font-weight:600;
    cursor:pointer; transition:all 0.2s;
  }
  .rl-apply:hover { background:#E8C97A; transform:translateY(-1px); }

  .rl-clear {
    width:100%; padding:10px; background:transparent;
    border:1px solid rgba(201,151,58,0.2); color:#5C5448;
    border-radius:12px; font-size:12px; cursor:pointer; transition:all 0.2s; margin-top:8px;
  }
  .rl-clear:hover { color:#E8526A; border-color:rgba(232,82,106,0.3); }

  .rl-badge {
    display:inline-flex; align-items:center; justify-content:center;
    width:18px; height:18px; border-radius:50%;
    background:#C9973A; color:#0E0E0F; font-size:10px; font-weight:700;
  }

  .rl-section-lbl {
    font-size:10px; font-weight:500; color:#C9973A;
    letter-spacing:1.2px; text-transform:uppercase; margin-bottom:10px; display:block;
  }

  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-thumb { background:rgba(201,151,58,0.25); border-radius:3px; }
`;

// ── Inject CSS once ───────────────────────────────────────────
let _injected = false;
function inject() {
  if (_injected) return;
  _injected = true;
  const s = document.createElement("style");
  s.textContent = CSS;
  document.head.appendChild(s);
}

// ═════════════════════════════════════════════════════════════
export default function RoomListing() {
  inject();

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const searchData = location.state || {};

  // ── Filters state ─────────────────────────────────────────
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  // Filter values (inside drawer)
  const [maxPrice, setMaxPrice] = useState(50000);
  const [minBeds, setMinBeds] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [gender, setGender] = useState("Any");
  const [searchCity, setSearchCity] = useState(
    searchParams.get("city") || searchData.location || "",
  );
  const [menuOpen, setMenuOpen] = useState(null);

  // Applied filters (used for actual filtering)
  const [applied, setApplied] = useState({
    maxPrice: 50000,
    minBeds: 0,
    amenities: [],
    gender: "Any",
  });

  const drawerBodyRef = useRef(null);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleDeleteRoom = async (id) => {
    const confirmDelete = window.confirm("Delete this room permanently?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/rooms/${id}`);

      setRooms((prev) => prev.filter((room) => room._id !== id));

      alert("Room deleted successfully 🗑️");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete room");
    }
  };

  // ── Fetch rooms ───────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    api
      .get("/rooms?page=1&limit=50")
      .then(({ data }) => {
        setRooms(data.rooms || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ── Filter + sort logic ───────────────────────────────────
  const filtered = rooms
    .filter((r) => {
      if (
        searchCity &&
        !r.city?.toLowerCase().includes(searchCity.toLowerCase())
      )
        return false;
      if (category !== "All" && r.category !== category) return false;
      if (r.price > applied.maxPrice) return false;
      if (applied.minBeds > 0 && r.availableBeds < applied.minBeds)
        return false;
      if (applied.gender !== "Any" && r.gender && r.gender !== applied.gender)
        return false;
      if (
        applied.amenities.length > 0 &&
        !applied.amenities.every((a) => r.amenities?.includes(a))
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === "beds")
        return (b.availableBeds ?? 0) - (a.availableBeds ?? 0);
      return 0;
    });

  // Active filter count
  const activeCount = [
    applied.maxPrice < 50000,
    applied.minBeds > 0,
    applied.amenities.length > 0,
    applied.gender !== "Any",
    searchCity.trim() !== "",
  ].filter(Boolean).length;

  // Toggle amenity
  const toggleAmenity = (id) =>
    setAmenities((p) =>
      p.includes(id) ? p.filter((a) => a !== id) : [...p, id],
    );

  // Apply filters
  const applyFilters = () => {
    setApplied({ maxPrice, minBeds: Number(minBeds), amenities, gender });
    setShowFilter(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setMaxPrice(50000);
    setMinBeds(0);
    setAmenities([]);
    setGender("Any");
    setApplied({ maxPrice: 50000, minBeds: 0, amenities: [], gender: "Any" });
    setSearchCity("");
  };

  return (
    <Layout>
      <div style={{ background: "#0E0E0F", minHeight: "100vh" }}>
        {/* ── CATEGORY PILLS ── */}
        <div
          style={{
            borderBottom: "1px solid rgba(201,151,58,0.12)",
            background: "#0E0E0F",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 0,
              overflowX: "auto",
              scrollbarWidth: "none",
              padding: "0 20px",
            }}
          >
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`rl-cat${category === c.id ? " on" : ""}`}
                onClick={() => setCategory(c.id)}
              >
                <span style={{ fontSize: 18 }}>{c.emoji}</span>
                <span className="rl-cat-lbl">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── TOP BAR ── */}
        <div
          style={{
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            borderBottom: "1px solid rgba(201,151,58,0.08)",
          }}
        >
          {/* Left: search + filter btn */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {/* Inline city search */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "#1E1E21",
                border: "1px solid rgba(201,151,58,0.2)",
                borderRadius: 10,
                padding: "7px 13px",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "rgba(201,151,58,0.5)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(201,151,58,0.2)")
              }
            >
              <MapPin size={13} style={{ color: "#C9973A", flexShrink: 0 }} />
              <input
                placeholder="Filter by city..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 13,
                  color: "#F2EDE6",
                  width: 140,
                }}
              />
              {searchCity && (
                <button
                  onClick={() => setSearchCity("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#5C5448",
                    display: "flex",
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filters button */}
            <button
              className={`rl-filt-btn${activeCount > 0 ? " active" : ""}`}
              onClick={() => setShowFilter(true)}
            >
              <SlidersHorizontal size={13} />
              Filters
              {activeCount > 0 && (
                <span className="rl-badge">{activeCount}</span>
              )}
            </button>

            {/* Sort */}
            <div style={{ position: "relative" }}>
              <select
                className="rl-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#5C5448",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* Right: result count */}
          {/* <p style={{ fontSize:12, color:"#5C5448" }}>
            <strong style={{ color:"#A09480" }}>{filtered.length}</strong> rooms found
            {searchCity && <> in <strong style={{ color:"#C9973A" }}>{searchCity}</strong></>}
          </p> */}

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <p style={{ fontSize: 12, color: "#5C5448" }}>
              <strong style={{ color: "#A09480" }}>{filtered.length}</strong>{" "}
              rooms found
              {searchCity && (
                <>
                  {" "}
                  in <strong style={{ color: "#C9973A" }}>{searchCity}</strong>
                </>
              )}
            </p>

            {userInfo?.role === "owner" && (
              <button
                onClick={() => navigate("/add-room")}
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: "#C9973A",
                  color: "#0E0E0F",
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#E8C97A")}
                onMouseLeave={(e) => (e.target.style.background = "#C9973A")}
              >
                + Add Room
              </button>
            )}
          </div>
        </div>

        {/* ── GRID ── */}
        <div style={{ padding: "20px", maxWidth: 1400, margin: "0 auto" }}>
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                gap: 20,
              }}
            >
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <RoomCardSkeleton key={i} />
                ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                animation: "rlFadeUp 0.5s ease both",
              }}
            >
              <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
              <h3
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: 22,
                  color: "#F2EDE6",
                  marginBottom: 8,
                  fontWeight: 400,
                }}
              >
                No rooms found
              </h3>
              <p style={{ fontSize: 13, color: "#5C5448", marginBottom: 24 }}>
                Try adjusting your filters or search a different city
              </p>
              <button
                onClick={clearFilters}
                style={{
                  padding: "10px 24px",
                  background: "#C9973A",
                  color: "#0E0E0F",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                gap: 20,
              }}
            >
              {filtered.map((room, i) => (
                <div
                  key={room._id}
                  style={{
                    position: "relative",
                  }}
                >
                  <RoomCard room={room} index={i} />

                  {/* OWNER MENU */}
                  {userInfo?.role === "owner" &&
                    String(room.owner?._id || room.owner) ===
                      String(userInfo._id) && (
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          zIndex: 20,
                        }}
                      >
                        {/* 3 DOT BUTTON */}
                        <button
                          onClick={() =>
                            setMenuOpen(menuOpen === room._id ? null : room._id)
                          }
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            border: "none",
                            background: "rgba(0,0,0,0.65)",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            backdropFilter: "blur(6px)",
                          }}
                        >
                          <MoreVertical size={18} />
                        </button>

                        {/* DROPDOWN */}
                        {menuOpen === room._id && (
                          <div
                            style={{
                              position: "absolute",
                              top: "44px",
                              left: 0,
                              background: "#1E1E21",
                              border: "1px solid rgba(201,151,58,0.15)",
                              borderRadius: "14px",
                              overflow: "hidden",
                              minWidth: "140px",
                              boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
                              animation: "rlFadeUp 0.2s ease",
                            }}
                          >
                            {/* DELETE */}
                            <button
                              onClick={() => handleDeleteRoom(room._id)}
                              style={{
                                width: "100%",
                                padding: "12px 14px",
                                border: "none",
                                background: "transparent",
                                color: "#ff6b6b",
                                textAlign: "left",
                                cursor: "pointer",
                                fontSize: "13px",
                              }}
                            >
                              🗑 Delete Room
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── FILTER DRAWER OVERLAY ── */}
        {showFilter && (
          <>
            <div className="rl-overlay" onClick={() => setShowFilter(false)} />

            <div className="rl-drawer">
              {/* Drawer header */}
              <div
                style={{
                  padding: "18px 20px",
                  borderBottom: "1px solid rgba(201,151,58,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexShrink: 0,
                }}
              >
                <div>
                  <h2
                    style={{
                      fontFamily: "Georgia,serif",
                      fontSize: 18,
                      color: "#F2EDE6",
                      fontWeight: 400,
                      marginBottom: 2,
                    }}
                  >
                    Filters
                  </h2>
                  {activeCount > 0 && (
                    <p style={{ fontSize: 11, color: "#C9973A" }}>
                      {activeCount} active
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowFilter(false)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "rgba(201,151,58,0.08)",
                    border: "1px solid rgba(201,151,58,0.2)",
                    color: "#A09480",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Drawer body */}
              <div
                ref={drawerBodyRef}
                style={{ flex: 1, overflowY: "auto", padding: "20px" }}
              >
                {/* ── Max price ── */}
                <div style={{ marginBottom: 24 }}>
                  <span className="rl-section-lbl">Max price / month</span>
                  <div
                    style={{
                      background: "#1E1E21",
                      border: "1px solid rgba(201,151,58,0.15)",
                      borderRadius: 12,
                      padding: "14px 16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <span style={{ fontSize: 11, color: "#5C5448" }}>
                        ₹1,000
                      </span>
                      <span
                        style={{
                          fontFamily: "Georgia,serif",
                          fontSize: 18,
                          color: "#C9973A",
                        }}
                      >
                        ₹{Number(maxPrice).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <input
                      type="range"
                      className="rl-range"
                      min={1000}
                      max={50000}
                      step={500}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>

                {/* ── Min beds ── */}
                <div style={{ marginBottom: 24 }}>
                  <span className="rl-section-lbl">Minimum beds</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["Any", 1, 2, 3, "4+"].map((n) => (
                      <button
                        key={n}
                        className={`rl-gender-btn${(minBeds === 0 && n === "Any") || minBeds === n ? " on" : ""}`}
                        onClick={() =>
                          setMinBeds(
                            n === "Any" ? 0 : n === "4+" ? 4 : Number(n),
                          )
                        }
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Gender ── */}
                <div style={{ marginBottom: 24 }}>
                  <span className="rl-section-lbl">For</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {GENDER_OPTIONS.map((g) => (
                      <button
                        key={g}
                        className={`rl-gender-btn${gender === g ? " on" : ""}`}
                        onClick={() => setGender(g)}
                      >
                        {g === "Boys"
                          ? "👨 Boys"
                          : g === "Girls"
                            ? "👩 Girls"
                            : "👫 Any"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Amenities ── */}
                <div style={{ marginBottom: 24 }}>
                  <span className="rl-section-lbl">Amenities</span>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 6,
                    }}
                  >
                    {AMENITY_OPTIONS.map((a) => (
                      <button
                        key={a.id}
                        className={`rl-amenity${amenities.includes(a.id) ? " on" : ""}`}
                        onClick={() => toggleAmenity(a.id)}
                      >
                        <span
                          style={{
                            color: amenities.includes(a.id)
                              ? "#C9973A"
                              : "#5C5448",
                          }}
                        >
                          {a.icon}
                        </span>
                        {a.label}
                        {amenities.includes(a.id) && (
                          <span
                            style={{
                              marginLeft: "auto",
                              fontSize: 10,
                              color: "#C9973A",
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer footer */}
              <div
                style={{
                  padding: "16px 20px",
                  borderTop: "1px solid rgba(201,151,58,0.12)",
                  flexShrink: 0,
                }}
              >
                <button className="rl-apply" onClick={applyFilters}>
                  Show{" "}
                  {
                    rooms.filter((r) => {
                      if (
                        searchCity &&
                        !r.city
                          ?.toLowerCase()
                          .includes(searchCity.toLowerCase())
                      )
                        return false;
                      if (category !== "All" && r.category !== category)
                        return false;
                      if (r.price > maxPrice) return false;
                      if (
                        Number(minBeds) > 0 &&
                        r.availableBeds < Number(minBeds)
                      )
                        return false;
                      if (gender !== "Any" && r.gender && r.gender !== gender)
                        return false;
                      if (
                        amenities.length > 0 &&
                        !amenities.every((a) => r.amenities?.includes(a))
                      )
                        return false;
                      return true;
                    }).length
                  }{" "}
                  rooms
                </button>
                <button className="rl-clear" onClick={clearFilters}>
                  Clear all filters
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
