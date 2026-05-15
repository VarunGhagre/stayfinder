import { useEffect, useState } from "react";
import {
  CheckCircle, Trash2, Trash, Home, User,
  CreditCard, Clock, Calendar, TrendingUp,
  BedDouble, X, AlertTriangle,
} from "lucide-react";
import api from "../api/axios";

// ── Tokens ────────────────────────────────────────────────────
const G = {
  gold:"#C9973A", gold2:"#E8C97A", golddim:"#8A6520",
  bg:"#0E0E0F",   bg2:"#161618",   bg3:"#1E1E21",  bg4:"#26262A",
  b1:"rgba(201,151,58,0.12)", b2:"rgba(201,151,58,0.25)", b3:"rgba(201,151,58,0.45)",
  t1:"#F2EDE6",   t2:"#A09480",    t3:"#5C5448",
  green:"#22C55E", greenDim:"rgba(34,197,94,0.12)",
  rose:"#E8526A",  roseDim:"rgba(232,82,106,0.12)",
  amber:"#F59E0B", amberDim:"rgba(245,158,11,0.12)",
};

// ── CSS ───────────────────────────────────────────────────────
const CSS = `
  @keyframes obFadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes obFadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes obShimmer { 0%{background-position:-500px 0} 100%{background-position:500px 0} }
  @keyframes obPulse   { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes obScaleIn { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }

  .ob-card {
    background: #161618;
    border: 1px solid rgba(201,151,58,0.12);
    border-radius: 16px; overflow: hidden;
    transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
    animation: obFadeUp 0.5s cubic-bezier(.22,1,.36,1) both;
  }
  .ob-card:hover {
    border-color: rgba(201,151,58,0.28);
    box-shadow: 0 12px 36px rgba(0,0,0,0.4);
    transform: translateY(-3px);
  }

  .ob-stat {
    background: #161618;
    border: 1px solid rgba(201,151,58,0.12);
    border-radius: 14px; padding: 18px 20px;
    transition: border-color 0.2s, transform 0.2s;
    animation: obFadeUp 0.5s cubic-bezier(.22,1,.36,1) both;
  }
  .ob-stat:hover { border-color: rgba(201,151,58,0.3); transform: translateY(-2px); }

  .ob-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 10px; font-size: 12px;
    font-weight: 600; cursor: pointer; border: 1px solid transparent;
    transition: all 0.2s; white-space: nowrap;
  }
  .ob-btn:active { transform: scale(0.96); }

  .ob-btn-confirm {
    background: rgba(34,197,94,0.12);
    border-color: rgba(34,197,94,0.3);
    color: #22C55E;
  }
  .ob-btn-confirm:hover {
    background: rgba(34,197,94,0.2);
    border-color: rgba(34,197,94,0.5);
    box-shadow: 0 4px 16px rgba(34,197,94,0.2);
  }

  .ob-btn-delete {
    background: rgba(232,82,106,0.1);
    border-color: rgba(232,82,106,0.25);
    color: #E8526A;
  }
  .ob-btn-delete:hover {
    background: rgba(232,82,106,0.18);
    border-color: rgba(232,82,106,0.45);
    box-shadow: 0 4px 16px rgba(232,82,106,0.2);
  }

  .ob-btn-clear {
    background: transparent;
    border-color: rgba(232,82,106,0.3);
    color: #E8526A;
  }
  .ob-btn-clear:hover {
    background: rgba(232,82,106,0.1);
    border-color: rgba(232,82,106,0.5);
  }

  .ob-skeleton {
    background: linear-gradient(90deg, #1E1E21 25%, #26262A 50%, #1E1E21 75%);
    background-size: 500px 100%;
    animation: obShimmer 1.4s infinite linear;
    border-radius: 8px;
  }

  /* Modal */
  .ob-modal-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,0.7); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    animation: obFadeIn 0.2s ease;
  }
  .ob-modal {
    background: #161618;
    border: 1px solid rgba(201,151,58,0.25);
    border-radius: 20px; padding: 28px; width: 100%;
    max-width: 360px; text-align: center;
    box-shadow: 0 24px 64px rgba(0,0,0,0.6);
    animation: obScaleIn 0.25s cubic-bezier(.22,1,.36,1);
  }

  /* Filter tabs */
  .ob-tab {
    padding: 6px 14px; border-radius: 8px; font-size: 12px;
    font-weight: 500; cursor: pointer; border: 1px solid transparent;
    transition: all 0.18s; white-space: nowrap; background: transparent;
  }
  .ob-tab:hover { background: rgba(201,151,58,0.06); color: #C9973A; }
  .ob-tab.on { background: rgba(201,151,58,0.1); border-color: #C9973A; color: #C9973A; }
  .ob-tab:not(.on) { color: #5C5448; border-color: rgba(201,151,58,0.12); }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: rgba(201,151,58,0.25); border-radius: 3px; }
`;

// ── Status config ─────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { color:"#F59E0B", bg:"rgba(245,158,11,0.12)",  border:"rgba(245,158,11,0.3)",  label:"Pending"   },
  confirmed: { color:"#22C55E", bg:"rgba(34,197,94,0.12)",   border:"rgba(34,197,94,0.3)",   label:"Confirmed" },
  cancelled: { color:"#E8526A", bg:"rgba(232,82,106,0.12)",  border:"rgba(232,82,106,0.3)",  label:"Cancelled" },
  paid:      { color:"#22C55E", bg:"rgba(34,197,94,0.12)",   border:"rgba(34,197,94,0.3)",   label:"Paid"      },
  unpaid:    { color:"#F59E0B", bg:"rgba(245,158,11,0.12)",  border:"rgba(245,158,11,0.3)",  label:"Unpaid"    },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_CONFIG.pending;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:4,
      padding:"3px 10px", borderRadius:8,
      background:cfg.bg, border:`1px solid ${cfg.border}`,
      fontSize:11, fontWeight:600, color:cfg.color,
    }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:cfg.color,
        animation: status === "pending" ? "obPulse 2s infinite" : "none" }} />
      {cfg.label}
    </span>
  );
}

// ── Confirm modal ─────────────────────────────────────────────
function ConfirmModal({ open, title, message, confirmLabel, danger, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="ob-modal-overlay" onClick={onCancel}>
      <div className="ob-modal" onClick={e => e.stopPropagation()}>
        <div style={{
          width:48, height:48, borderRadius:"50%", margin:"0 auto 16px",
          background: danger ? "rgba(232,82,106,0.12)" : "rgba(201,151,58,0.1)",
          border: `1px solid ${danger ? "rgba(232,82,106,0.3)" : G.b2}`,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <AlertTriangle size={22} style={{ color: danger ? G.rose : G.gold }} />
        </div>
        <h3 style={{ fontFamily:"Georgia,serif", fontSize:18, color:G.t1, marginBottom:8 }}>{title}</h3>
        <p style={{ fontSize:13, color:G.t3, lineHeight:1.6, marginBottom:22 }}>{message}</p>
        <div style={{ display:"flex", gap:10 }}>
          <button className="ob-btn" onClick={onCancel}
            style={{ flex:1, justifyContent:"center", background:G.bg3, borderColor:G.b1, color:G.t2 }}>
            Cancel
          </button>
          <button className="ob-btn" onClick={onConfirm}
            style={{
              flex:1, justifyContent:"center",
              background: danger ? "rgba(232,82,106,0.15)" : "rgba(34,197,94,0.12)",
              borderColor: danger ? "rgba(232,82,106,0.4)" : "rgba(34,197,94,0.3)",
              color: danger ? G.rose : G.green,
            }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function BookingSkeleton() {
  return (
    <div className="ob-card" style={{ padding:20, pointerEvents:"none" }}>
      <div style={{ display:"flex", gap:14, marginBottom:16 }}>
        <div className="ob-skeleton" style={{ width:52, height:52, borderRadius:12, flexShrink:0 }} />
        <div style={{ flex:1 }}>
          <div className="ob-skeleton" style={{ height:14, width:"65%", marginBottom:8 }} />
          <div className="ob-skeleton" style={{ height:11, width:"40%" }} />
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
        {[0,1,2].map(i => <div key={i} className="ob-skeleton" style={{ height:52, borderRadius:10 }} />)}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <div className="ob-skeleton" style={{ height:34, flex:1, borderRadius:10 }} />
        <div className="ob-skeleton" style={{ height:34, width:80, borderRadius:10 }} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
export default function OwnerBookings() {
  const [bookings,   setBookings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState("all");    // all | pending | confirmed | cancelled
  const [modal,      setModal]      = useState(null);     // { type, id } | null

  // ── Inject CSS ────────────────────────────────────────────
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // ── Fetch ─────────────────────────────────────────────────
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bookings/owner");
      setBookings(data.filter(b => b.room !== null));
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  // ── Actions ───────────────────────────────────────────────
  const handleConfirm = async (id) => {
    try {
      await api.put(`/bookings/${id}/confirm`);
      setBookings(p => p.map(b => b._id === id ? { ...b, bookingStatus:"confirmed" } : b));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to confirm");
    }
    setModal(null);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bookings/owner/${id}`);
      setBookings(p => p.filter(b => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
    setModal(null);
  };

  const handleClearAll = async () => {
    try {
      await api.delete("/bookings/owner/clear/all");
      setBookings([]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to clear");
    }
    setModal(null);
  };

  // ── Filtered list ─────────────────────────────────────────
  const filtered = bookings.filter(b => {
    if (filter === "all")       return true;
    if (filter === "pending")   return b.bookingStatus === "pending";
    if (filter === "confirmed") return b.bookingStatus === "confirmed";
    if (filter === "cancelled") return b.bookingStatus === "cancelled";
    return true;
  });

  // ── Stats ─────────────────────────────────────────────────
  const stats = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.bookingStatus === "pending").length,
    confirmed: bookings.filter(b => b.bookingStatus === "confirmed").length,
    revenue:   bookings
      .filter(b => b.paymentStatus === "paid")
      .reduce((s, b) => s + (b.totalPrice || b.room?.price || 0), 0),
  };

  const STATS = [
    { label:"Total Bookings", value:stats.total,    icon:<Home size={18}/>,       color:G.gold,  bg:"rgba(201,151,58,0.1)"  },
    { label:"Pending",        value:stats.pending,  icon:<Clock size={18}/>,      color:G.amber, bg:"rgba(245,158,11,0.1)"  },
    { label:"Confirmed",      value:stats.confirmed,icon:<CheckCircle size={18}/>,color:G.green, bg:"rgba(34,197,94,0.1)"   },
    { label:"Revenue",        value:`₹${stats.revenue.toLocaleString("en-IN")}`,
                                                    icon:<TrendingUp size={18}/>, color:G.gold,  bg:"rgba(201,151,58,0.1)"  },
  ];

  const FILTER_TABS = [
    { id:"all",       label:"All",       count:bookings.length },
    { id:"pending",   label:"Pending",   count:stats.pending   },
    { id:"confirmed", label:"Confirmed", count:stats.confirmed },
    { id:"cancelled", label:"Cancelled", count:bookings.filter(b=>b.bookingStatus==="cancelled").length },
  ];

  return (
    <>
      <div style={{ background:G.bg, minHeight:"100vh", padding:"28px 20px" }}>

        {/* ── HEADER ── */}
        <div style={{ maxWidth:960, margin:"0 auto 24px", display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(22px,4vw,30px)", fontWeight:400, color:G.t1, marginBottom:4 }}>
              Bookings Dashboard
            </h1>
            <p style={{ fontSize:13, color:G.t3 }}>
              Manage and track all your property bookings
            </p>
          </div>
          {bookings.length > 0 && (
            <button className="ob-btn ob-btn-clear"
              onClick={() => setModal({ type:"clearAll" })}>
              <Trash size={13} /> Clear All
            </button>
          )}
        </div>

        <div style={{ maxWidth:960, margin:"0 auto" }}>

          {/* ── STATS ROW ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12, marginBottom:24 }}>
            {STATS.map((s, i) => (
              <div key={i} className="ob-stat" style={{ animationDelay:`${i*0.07}s` }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", color:s.color }}>
                    {s.icon}
                  </div>
                  <span style={{ fontSize:11, color:G.t3, fontWeight:500 }}>{s.label}</span>
                </div>
                <div style={{ fontFamily:"Georgia,serif", fontSize:24, color:s.color, fontWeight:400 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* ── FILTER TABS ── */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
            {FILTER_TABS.map(t => (
              <button key={t.id} className={`ob-tab${filter===t.id?" on":""}`}
                onClick={() => setFilter(t.id)}>
                {t.label}
                <span style={{ marginLeft:5, padding:"1px 6px", borderRadius:6, fontSize:10,
                  background: filter===t.id ? "rgba(201,151,58,0.15)" : "rgba(255,255,255,0.05)",
                  color: filter===t.id ? G.gold : G.t3 }}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* ── BOOKING CARDS ── */}
          {loading ? (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[0,1,2,3].map(i => <BookingSkeleton key={i}/>)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 20px", animation:"obFadeUp 0.5s ease both" }}>
              <p style={{ fontSize:48, marginBottom:12 }}>📋</p>
              <h3 style={{ fontFamily:"Georgia,serif", fontSize:20, color:G.t1, marginBottom:6, fontWeight:400 }}>
                No {filter !== "all" ? filter : ""} bookings
              </h3>
              <p style={{ fontSize:13, color:G.t3 }}>
                {filter !== "all" ? "Try switching to a different filter" : "Bookings will appear here once guests book your rooms"}
              </p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {filtered.map((b, i) => (
                <div key={b._id} className="ob-card" style={{ animationDelay:`${i*0.06}s` }}>

                  {/* Card header */}
                  <div style={{ padding:"16px 18px", borderBottom:`1px solid ${G.b1}`, display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      {/* Room icon */}
                      <div style={{ width:48, height:48, borderRadius:12, background:`linear-gradient(135deg,${G.golddim},${G.gold})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {b.room?.images?.[0]
                          ? <img src={b.room.images[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:12 }}/>
                          : <Home size={20} style={{ color:G.bg }}/>
                        }
                      </div>
                      <div>
                        <h3 style={{ fontFamily:"Georgia,serif", fontSize:15, color:G.t1, marginBottom:3, fontWeight:400 }}>
                          {b.room?.title || "Untitled Room"}
                        </h3>
                        <p style={{ fontSize:12, color:G.t3, display:"flex", alignItems:"center", gap:4 }}>
                          <User size={10} /> {b.user?.name || "Unknown user"}
                          {b.user?.email && <span style={{ color:G.t3, opacity:0.6 }}>· {b.user.email}</span>}
                        </p>
                      </div>
                    </div>
                    {/* Booking status badge */}
                    <StatusBadge status={b.bookingStatus} />
                  </div>

                  {/* Card body */}
                  <div style={{ padding:"14px 18px" }}>

                    {/* Info grid */}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:8, marginBottom:14 }}>
                      {[
                        { icon:<CreditCard size={12}/>, label:"Payment",  value:<StatusBadge status={b.paymentStatus}/> },
                        { icon:<BedDouble size={12}/>,  label:"Beds",     value: b.room?.availableBeds ? `${b.room.availableBeds} beds` : "—" },
                        { icon:<Calendar size={12}/>,   label:"Booked on", value: b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—" },
                        ...(b.room?.price ? [{ icon:<TrendingUp size={12}/>, label:"Price", value:`₹${b.room.price.toLocaleString("en-IN")}/mo` }] : []),
                      ].map((item, idx) => (
                        <div key={idx} style={{ background:G.bg3, border:`1px solid ${G.b1}`, borderRadius:10, padding:"10px 12px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:4, color:G.t3, fontSize:10, textTransform:"uppercase", letterSpacing:"0.6px" }}>
                            <span style={{ color:G.gold }}>{item.icon}</span>
                            {item.label}
                          </div>
                          <div style={{ fontSize:13, color:G.t1 }}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      {/* Approve button — only when pending + paid */}
                      {b.bookingStatus === "pending" && b.paymentStatus === "paid" && (
                        <button className="ob-btn ob-btn-confirm"
                          onClick={() => setModal({ type:"confirm", id:b._id })}>
                          <CheckCircle size={13}/> Approve Booking
                        </button>
                      )}

                      {/* Delete */}
                      <button className="ob-btn ob-btn-delete"
                        onClick={() => setModal({ type:"delete", id:b._id })}>
                        <Trash2 size={13}/> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── CONFIRM MODAL: Approve ── */}
      <ConfirmModal
        open={modal?.type === "confirm"}
        title="Approve Booking"
        message="Are you sure you want to approve this booking? The guest will be notified."
        confirmLabel="Yes, Approve"
        danger={false}
        onConfirm={() => handleConfirm(modal.id)}
        onCancel={() => setModal(null)}
      />

      {/* ── CONFIRM MODAL: Delete single ── */}
      <ConfirmModal
        open={modal?.type === "delete"}
        title="Delete Booking"
        message="This will permanently delete this booking. This action cannot be undone."
        confirmLabel="Delete"
        danger={true}
        onConfirm={() => handleDelete(modal.id)}
        onCancel={() => setModal(null)}
      />

      {/* ── CONFIRM MODAL: Clear all ── */}
      <ConfirmModal
        open={modal?.type === "clearAll"}
        title="Clear All Bookings"
        message={`This will permanently delete all ${bookings.length} bookings. This action cannot be undone.`}
        confirmLabel="Clear All"
        danger={true}
        onConfirm={handleClearAll}
        onCancel={() => setModal(null)}
      />
    </>
  );
}