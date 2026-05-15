import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Calendar, Users, CreditCard, Clock,
  Trash2, Trash, X, CheckCircle, AlertTriangle,
  TrendingUp, Home, Tag,
} from "lucide-react";
import api from "../api/axios";

const G = {
  gold:"#C9973A", gold2:"#E8C97A", golddim:"#8A6520",
  bg:"#0E0E0F", bg2:"#161618", bg3:"#1E1E21", bg4:"#26262A",
  b1:"rgba(201,151,58,0.12)", b2:"rgba(201,151,58,0.25)", b3:"rgba(201,151,58,0.45)",
  t1:"#F2EDE6", t2:"#A09480", t3:"#5C5448",
  green:"#22C55E", rose:"#E8526A", amber:"#F59E0B",
};

const BOOKING_CFG = {
  pending:   { color:G.amber, bg:"rgba(245,158,11,0.1)",  border:"rgba(245,158,11,0.3)",  label:"Pending",   pulse:true  },
  confirmed: { color:G.green, bg:"rgba(34,197,94,0.1)",   border:"rgba(34,197,94,0.3)",   label:"Confirmed", pulse:false },
  cancelled: { color:G.rose,  bg:"rgba(232,82,106,0.1)",  border:"rgba(232,82,106,0.3)",  label:"Cancelled", pulse:false },
};
const PAYMENT_CFG = {
  paid:    { color:G.green, bg:"rgba(34,197,94,0.1)",  border:"rgba(34,197,94,0.3)",  label:"Paid"   },
  pending: { color:G.amber, bg:"rgba(245,158,11,0.1)", border:"rgba(245,158,11,0.3)", label:"Unpaid" },
  failed:  { color:G.rose,  bg:"rgba(232,82,106,0.1)", border:"rgba(232,82,106,0.3)", label:"Failed" },
};

const CSS = `
  @keyframes mbUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes mbIn    { from{opacity:0} to{opacity:1} }
  @keyframes mbSh    { 0%{background-position:-500px 0} 100%{background-position:500px 0} }
  @keyframes mbPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.45;transform:scale(1.18)} }
  @keyframes mbSc    { from{opacity:0;transform:scale(0.93)} to{opacity:1;transform:scale(1)} }

  .mb-card{background:#161618;border:1px solid rgba(201,151,58,0.1);border-radius:18px;overflow:hidden;transition:border-color .25s,box-shadow .25s,transform .25s;}
  .mb-card:hover{border-color:rgba(201,151,58,0.25);box-shadow:0 14px 40px rgba(0,0,0,0.45);transform:translateY(-3px);}

  .mb-stat{background:#161618;border:1px solid rgba(201,151,58,0.1);border-radius:14px;padding:16px 18px;transition:border-color .2s,transform .2s;animation:mbUp .5s cubic-bezier(.22,1,.36,1) both;}
  .mb-stat:hover{border-color:rgba(201,151,58,0.28);transform:translateY(-2px);}

  .mb-btn{display:inline-flex;align-items:center;gap:5px;padding:8px 14px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid transparent;transition:all .2s;white-space:nowrap;font-family:inherit;}
  .mb-btn:active{transform:scale(0.96);}
  .mb-btn-pay{background:rgba(34,197,94,0.12);border-color:rgba(34,197,94,0.3);color:#22C55E;}
  .mb-btn-pay:hover{background:rgba(34,197,94,0.2);border-color:rgba(34,197,94,0.5);box-shadow:0 4px 16px rgba(34,197,94,0.2);}
  .mb-btn-cancel{background:rgba(245,158,11,0.1);border-color:rgba(245,158,11,0.3);color:#F59E0B;}
  .mb-btn-cancel:hover{background:rgba(245,158,11,0.18);border-color:rgba(245,158,11,0.5);}
  .mb-btn-delete{background:rgba(232,82,106,0.1);border-color:rgba(232,82,106,0.25);color:#E8526A;}
  .mb-btn-delete:hover{background:rgba(232,82,106,0.18);border-color:rgba(232,82,106,0.45);box-shadow:0 4px 14px rgba(232,82,106,0.2);}
  .mb-btn-clear{background:transparent;border:1px solid rgba(232,82,106,0.3);color:#E8526A;padding:8px 16px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .2s;font-family:inherit;}
  .mb-btn-clear:hover{background:rgba(232,82,106,0.1);border-color:rgba(232,82,106,0.5);}

  .mb-skel{background:linear-gradient(90deg,#1E1E21 25%,#26262A 50%,#1E1E21 75%);background-size:500px 100%;animation:mbSh 1.4s infinite linear;border-radius:8px;}

  .mb-overlay{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,0.72);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;animation:mbIn .2s ease;}
  .mb-modal{background:#161618;border:1px solid rgba(201,151,58,0.25);border-radius:20px;padding:28px;width:100%;max-width:360px;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,0.6);animation:mbSc .25s cubic-bezier(.22,1,.36,1);}

  .mb-tab{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid rgba(201,151,58,0.12);color:#5C5448;background:transparent;transition:all .18s;white-space:nowrap;font-family:inherit;}
  .mb-tab:hover{color:#C9973A;background:rgba(201,151,58,0.06);}
  .mb-tab.on{background:rgba(201,151,58,0.1);border-color:#C9973A;color:#C9973A;}

  .mb-chip{display:flex;align-items:center;gap:8px;padding:9px 12px;background:#1E1E21;border:1px solid rgba(201,151,58,0.1);border-radius:10px;}

  .mb-alert{display:flex;align-items:center;gap:7px;border-radius:10px;padding:9px 13px;margin-bottom:12px;font-size:12px;}

  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-thumb{background:rgba(201,151,58,0.25);border-radius:3px;}
`;

// ── StatusBadge ───────────────────────────────────────────────
function Badge({ status, cfg }) {
  const c = cfg[status?.toLowerCase()] ?? cfg.pending;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius:8, background:c.bg, border:`1px solid ${c.border}`, fontSize:11, fontWeight:600, color:c.color }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:c.color, animation:c.pulse?"mbPulse 2s infinite":"none" }}/>
      {c.label}
    </span>
  );
}

// ── Confirm modal ─────────────────────────────────────────────
function Modal({ open, title, message, confirmLabel, danger, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="mb-overlay" onClick={onCancel}>
      <div className="mb-modal" onClick={e => e.stopPropagation()}>
        <div style={{ width:48, height:48, borderRadius:"50%", margin:"0 auto 16px", background:danger?"rgba(232,82,106,0.12)":"rgba(245,158,11,0.1)", border:`1px solid ${danger?"rgba(232,82,106,0.3)":"rgba(245,158,11,0.3)"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <AlertTriangle size={22} style={{ color:danger?G.rose:G.amber }}/>
        </div>
        <h3 style={{ fontFamily:"Georgia,serif", fontSize:18, color:G.t1, marginBottom:8, fontWeight:400 }}>{title}</h3>
        <p style={{ fontSize:13, color:G.t3, lineHeight:1.7, marginBottom:22 }}>{message}</p>
        <div style={{ display:"flex", gap:10 }}>
          <button className="mb-btn" onClick={onCancel}
            style={{ flex:1, justifyContent:"center", background:G.bg3, borderColor:G.b1, color:G.t2 }}>Cancel</button>
          <button className="mb-btn" onClick={onConfirm}
            style={{ flex:1, justifyContent:"center", background:danger?"rgba(232,82,106,0.15)":"rgba(245,158,11,0.12)", borderColor:danger?"rgba(232,82,106,0.4)":"rgba(245,158,11,0.35)", color:danger?G.rose:G.amber }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function Skel() {
  return (
    <div className="mb-card" style={{ padding:20, pointerEvents:"none" }}>
      <div style={{ display:"flex", gap:14, marginBottom:16 }}>
        <div className="mb-skel" style={{ width:60, height:60, borderRadius:12, flexShrink:0 }}/>
        <div style={{ flex:1 }}>
          <div className="mb-skel" style={{ height:14, width:"58%", marginBottom:8 }}/>
          <div className="mb-skel" style={{ height:11, width:"36%" }}/>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:14 }}>
        {[0,1,2,3].map(i => <div key={i} className="mb-skel" style={{ height:54, borderRadius:10 }}/>)}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        {[80,70,60].map((w,i) => <div key={i} className="mb-skel" style={{ height:34, width:w, borderRadius:10 }}/>)}
      </div>
    </div>
  );
}

const fmt = d => d ? new Date(d).toLocaleDateString("en-IN",{ day:"numeric", month:"short", year:"numeric" }) : "—";

// ══════════════════════════════════════════════════════════════
export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const [modal,    setModal]    = useState(null);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const fetch_ = async () => {
    setLoading(true);
    try { const { data } = await api.get("/bookings/my"); setBookings(data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch_(); }, []);

  const doCancel = async (id) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings(p => p.map(b => b._id===id ? {...b, bookingStatus:"cancelled"} : b));
    } catch (e) { alert(e.response?.data?.message || "Cancel failed"); }
    setModal(null);
  };

  const doDelete = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(p => p.filter(b => b._id !== id));
    } catch (e) { alert(e.response?.data?.message || "Delete failed"); }
    setModal(null);
  };

  const doClear = async () => {
    try {
      await api.delete("/bookings/clear");
      setBookings([]);
    } catch (e) { alert(e.response?.data?.message || "Failed to clear"); }
    setModal(null);
  };

  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter(b => b.bookingStatus === "confirmed").length,
    pending:   bookings.filter(b => b.bookingStatus === "pending").length,
    spent:     bookings.filter(b => b.paymentStatus === "paid").reduce((s,b) => s+(b.amount||0), 0),
  };

  const STATS = [
    { label:"Total Trips",  value:stats.total,    icon:<Home size={17}/>,        color:G.gold,  bg:"rgba(201,151,58,0.1)" },
    { label:"Confirmed",    value:stats.confirmed, icon:<CheckCircle size={17}/>, color:G.green, bg:"rgba(34,197,94,0.1)"  },
    { label:"Pending",      value:stats.pending,   icon:<Clock size={17}/>,       color:G.amber, bg:"rgba(245,158,11,0.1)" },
    { label:"Total Spent",  value:`₹${stats.spent.toLocaleString("en-IN")}`,
                                                   icon:<TrendingUp size={17}/>,  color:G.gold,  bg:"rgba(201,151,58,0.1)" },
  ];

  const TABS = [
    { id:"all",       label:"All",       count:bookings.length },
    { id:"pending",   label:"Pending",   count:stats.pending   },
    { id:"confirmed", label:"Confirmed", count:stats.confirmed },
    { id:"cancelled", label:"Cancelled", count:bookings.filter(b=>b.bookingStatus==="cancelled").length },
  ];

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.bookingStatus === filter);

  return (
    <>
      <div style={{ background:G.bg, minHeight:"100vh", padding:"28px 20px" }}>
        <div style={{ maxWidth:880, margin:"0 auto" }}>

          {/* Header */}
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:24 }}>
            <div>
              <h1 style={{ fontFamily:"Georgia,serif", fontSize:"clamp(22px,4vw,30px)", fontWeight:400, color:G.t1, marginBottom:4 }}>My Bookings</h1>
              <p style={{ fontSize:13, color:G.t3 }}>Track and manage all your stay bookings</p>
            </div>
            {bookings.length > 0 && (
              <button className="mb-btn-clear" onClick={() => setModal({ type:"clearAll" })}>
                <Trash size={13}/> Clear All
              </button>
            )}
          </div>

          {/* Stats */}
          {!loading && bookings.length > 0 && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(165px,1fr))", gap:12, marginBottom:24 }}>
              {STATS.map((s,i) => (
                <div key={i} className="mb-stat" style={{ animationDelay:`${i*0.07}s` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:10 }}>
                    <div style={{ width:34, height:34, borderRadius:9, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", color:s.color, flexShrink:0 }}>{s.icon}</div>
                    <span style={{ fontSize:11, color:G.t3, fontWeight:500 }}>{s.label}</span>
                  </div>
                  <div style={{ fontFamily:"Georgia,serif", fontSize:22, color:s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          {!loading && bookings.length > 0 && (
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
              {TABS.map(t => (
                <button key={t.id} className={`mb-tab${filter===t.id?" on":""}`} onClick={() => setFilter(t.id)}>
                  {t.label}
                  <span style={{ marginLeft:5, padding:"1px 6px", borderRadius:6, fontSize:10, background:filter===t.id?"rgba(201,151,58,0.15)":"rgba(255,255,255,0.05)", color:filter===t.id?G.gold:G.t3 }}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[0,1,2,3].map(i => <Skel key={i}/>)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"70px 20px", animation:"mbUp 0.5s ease both" }}>
              <p style={{ fontSize:52, marginBottom:14 }}>✈️</p>
              <h3 style={{ fontFamily:"Georgia,serif", fontSize:22, color:G.t1, marginBottom:8, fontWeight:400 }}>
                {filter !== "all" ? `No ${filter} bookings` : "No bookings yet"}
              </h3>
              <p style={{ fontSize:13, color:G.t3, marginBottom:24, lineHeight:1.7 }}>
                {filter !== "all" ? "Try switching to a different tab" : "Start exploring rooms and book your first stay!"}
              </p>
              {filter === "all" && (
                <button onClick={() => navigate("/rooms")}
                  style={{ padding:"12px 28px", background:G.gold, color:G.bg, border:"none", borderRadius:12, fontSize:13, fontWeight:600, cursor:"pointer", boxShadow:"0 4px 18px rgba(201,151,58,0.3)" }}>
                  Explore Rooms
                </button>
              )}
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {filtered.map((b, i) => (
                <div key={b._id} className="mb-card"
                  style={{ animation:"mbUp 0.5s cubic-bezier(.22,1,.36,1) both", animationDelay:`${i*0.065}s` }}>

                  {/* Card header */}
                  <div style={{ padding:"16px 18px", borderBottom:`1px solid ${G.b1}`, display:"flex", gap:13, alignItems:"flex-start" }}>
                    <div style={{ width:58, height:58, borderRadius:12, flexShrink:0, overflow:"hidden", background:`linear-gradient(135deg,${G.golddim},${G.gold})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {b.room?.images?.[0]
                        ? <img src={b.room.images[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                        : <Home size={22} style={{ color:G.bg }}/>}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <h2 style={{ fontFamily:"Georgia,serif", fontSize:16, color:G.t1, fontWeight:400, marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {b.room?.title || "Room not available"}
                      </h2>
                      {b.room?.city && (
                        <p style={{ fontSize:12, color:G.t3, display:"flex", alignItems:"center", gap:4 }}>
                          <MapPin size={10} style={{ color:G.gold }}/> {b.room.city}
                        </p>
                      )}
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:5, alignItems:"flex-end", flexShrink:0 }}>
                      <Badge status={b.bookingStatus} cfg={BOOKING_CFG}/>
                      <Badge status={b.paymentStatus} cfg={PAYMENT_CFG}/>
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding:"14px 18px" }}>

                    {/* Info chips */}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(128px,1fr))", gap:8, marginBottom:14 }}>
                      {b.amount && (
                        <div className="mb-chip">
                          <TrendingUp size={11} style={{ color:G.gold, flexShrink:0 }}/>
                          <div>
                            <div style={{ fontSize:9, color:G.t3, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:1 }}>Amount</div>
                            <div style={{ fontSize:13, color:G.gold, fontFamily:"Georgia,serif" }}>₹{b.amount.toLocaleString("en-IN")}</div>
                          </div>
                        </div>
                      )}
                      {b.checkIn && (
                        <div className="mb-chip">
                          <Calendar size={11} style={{ color:G.gold, flexShrink:0 }}/>
                          <div>
                            <div style={{ fontSize:9, color:G.t3, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:1 }}>Check-in</div>
                            <div style={{ fontSize:12, color:G.t1 }}>{fmt(b.checkIn)}</div>
                          </div>
                        </div>
                      )}
                      {b.checkOut && (
                        <div className="mb-chip">
                          <Calendar size={11} style={{ color:G.gold, flexShrink:0 }}/>
                          <div>
                            <div style={{ fontSize:9, color:G.t3, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:1 }}>Check-out</div>
                            <div style={{ fontSize:12, color:G.t1 }}>{fmt(b.checkOut)}</div>
                          </div>
                        </div>
                      )}
                      {b.totalDays && (
                        <div className="mb-chip">
                          <Clock size={11} style={{ color:G.gold, flexShrink:0 }}/>
                          <div>
                            <div style={{ fontSize:9, color:G.t3, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:1 }}>Duration</div>
                            <div style={{ fontSize:12, color:G.t1 }}>{b.totalDays} days</div>
                          </div>
                        </div>
                      )}
                      {b.guests && (
                        <div className="mb-chip">
                          <Users size={11} style={{ color:G.gold, flexShrink:0 }}/>
                          <div>
                            <div style={{ fontSize:9, color:G.t3, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:1 }}>Guests</div>
                            <div style={{ fontSize:12, color:G.t1 }}>{b.guests} guest{b.guests>1?"s":""}</div>
                          </div>
                        </div>
                      )}
                      {b.discount > 0 && (
                        <div className="mb-chip" style={{ borderColor:"rgba(34,197,94,0.2)" }}>
                          <Tag size={11} style={{ color:G.green, flexShrink:0 }}/>
                          <div>
                            <div style={{ fontSize:9, color:G.t3, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:1 }}>Discount</div>
                            <div style={{ fontSize:12, color:G.green }}>−₹{b.discount.toLocaleString("en-IN")}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status alerts */}
                    {b.paymentStatus === "pending" && (
                      <div className="mb-alert" style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.2)", color:G.amber }}>
                        <CreditCard size={13}/> Complete payment to confirm your booking
                      </div>
                    )}
                    {b.bookingStatus === "pending" && b.paymentStatus === "paid" && (
                      <div className="mb-alert" style={{ background:"rgba(201,151,58,0.06)", border:`1px solid ${G.b1}`, color:G.gold }}>
                        <Clock size={13}/> Waiting for owner approval
                      </div>
                    )}
                    {b.bookingStatus === "confirmed" && (
                      <div className="mb-alert" style={{ background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.2)", color:G.green }}>
                        <CheckCircle size={13}/> Booking confirmed — enjoy your stay!
                      </div>
                    )}
                    {b.bookingStatus === "cancelled" && (
                      <div className="mb-alert" style={{ background:"rgba(232,82,106,0.06)", border:"1px solid rgba(232,82,106,0.2)", color:G.rose }}>
                        <X size={13}/> This booking has been cancelled
                      </div>
                    )}

                    {/* Buttons */}
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      {b.paymentStatus === "pending" && (
                        <button className="mb-btn mb-btn-pay" onClick={() => navigate(`/payment/${b._id}`)}>
                          <CreditCard size={12}/> Pay Now
                        </button>
                      )}
                      {b.bookingStatus === "pending" && (
                        <button className="mb-btn mb-btn-cancel" onClick={() => setModal({ type:"cancel", id:b._id })}>
                          <X size={12}/> Cancel
                        </button>
                      )}
                      <button className="mb-btn mb-btn-delete" onClick={() => setModal({ type:"delete", id:b._id })}>
                        <Trash2 size={12}/> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal open={modal?.type==="cancel"}   title="Cancel Booking"    message="Are you sure you want to cancel this booking? This may not be reversible."  confirmLabel="Yes, Cancel" danger={false} onConfirm={() => doCancel(modal.id)} onCancel={() => setModal(null)}/>
      <Modal open={modal?.type==="delete"}   title="Delete Booking"    message="This will permanently remove this booking from your history. Cannot be undone." confirmLabel="Delete"     danger={true}  onConfirm={() => doDelete(modal.id)} onCancel={() => setModal(null)}/>
      <Modal open={modal?.type==="clearAll"} title="Clear All Bookings" message={`This will permanently delete all ${bookings.length} bookings. Cannot be undone.`}  confirmLabel="Clear All"  danger={true}  onConfirm={doClear}               onCancel={() => setModal(null)}/>
    </>
  );
}.
