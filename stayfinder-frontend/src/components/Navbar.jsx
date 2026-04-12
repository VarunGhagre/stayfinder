import { Heart, Bell, Menu, X, Globe, Home, Info, Layers, Phone, LogOut, Settings, BookOpen, PlusSquare, ShieldCheck } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../api/axios";

const G = {
  gold:"#C9973A", gold2:"#E8C97A", golddim:"#8A6520",
  bg:"#0E0E0F", bg2:"#161618", bg3:"#1E1E21", bg4:"#26262A",
  b1:"rgba(201,151,58,0.12)", b2:"rgba(201,151,58,0.25)", b3:"rgba(201,151,58,0.5)",
  t1:"#F2EDE6", t2:"#A09480", t3:"#5C5448", rose:"#E8526A",
};

const NAV_LINKS = [
  { label:"Home",     to:"/",         Icon:Home    },
  { label:"About",    to:"/about",    Icon:Info    },
  { label:"Services", to:"/services", Icon:Layers  },
  { label:"Contact",  to:"/contact",  Icon:Phone   },
];

const CSS = `
  @keyframes dropIn   { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes slideUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes badgePop { 0%{transform:scale(0)} 70%{transform:scale(1.25)} 100%{transform:scale(1)} }
  @keyframes heartBeat{ 0%{transform:scale(1)} 30%{transform:scale(1.35)} 60%{transform:scale(0.9)} 100%{transform:scale(1)} }

  .nav-drop   { animation: dropIn  0.22s cubic-bezier(.22,1,.36,1) both; }
  .mob-menu   { animation: slideUp 0.28s cubic-bezier(.22,1,.36,1) both; }
  .badge-pop  { animation: badgePop 0.4s cubic-bezier(.22,1,.36,1) both; }
  .heart-beat { animation: heartBeat 0.5s ease; }

  /* Nav link underline */
  .nl { position:relative; font-size:14px; font-weight:600; text-decoration:none; padding-bottom:3px; transition:color 0.2s; }
  .nl::after { content:''; position:absolute; left:0; bottom:0; width:0; height:2px; background:#C9973A; transition:width 0.3s cubic-bezier(.22,1,.36,1); border-radius:2px; }
  .nl:hover::after, .nl-active::after { width:100%; }

  /* Icon button */
  .ib { width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:all 0.2s; cursor:pointer; border:none; background:transparent; color:#5C5448; position:relative; flex-shrink:0; }
  .ib:hover { background:rgba(201,151,58,0.1); color:#A09480; }
  .ib.active-ib { background:rgba(201,151,58,0.12); color:#C9973A; }

  /* Profile pill */
  .prof-pill { display:flex; align-items:center; gap:8px; padding:5px 5px 5px 12px; border-radius:24px; border:1px solid rgba(201,151,58,0.25); background:#1E1E21; cursor:pointer; transition:all 0.2s; }
  .prof-pill:hover { border-color:rgba(201,151,58,0.5); box-shadow:0 0 18px rgba(201,151,58,0.1); }

  /* Dropdown item */
  .di { width:100%; display:flex; align-items:center; gap:10px; padding:9px 14px; font-size:13px; color:#A09480; background:transparent; border:none; cursor:pointer; transition:all 0.18s; text-align:left; border-radius:8px; }
  .di:hover { background:rgba(201,151,58,0.07); color:#C9973A; }
  .di.red { color:#E8526A; }
  .di.red:hover { background:rgba(232,82,106,0.08); color:#E8526A; }

  /* Notification items */
  .ni { padding:10px 12px; border-radius:10px; cursor:pointer; transition:all 0.18s; margin-bottom:5px; }
  .ni.unread { background:#26262A; border:1px solid rgba(201,151,58,0.22); }
  .ni.read   { background:#1E1E21; border:1px solid transparent; }
  .ni:hover  { border-color:rgba(201,151,58,0.4) !important; }

  /* Lang/currency buttons */
  .lcb { padding:5px 12px; border-radius:20px; font-size:12px; border:1px solid rgba(201,151,58,0.25); cursor:pointer; transition:all 0.2s; background:transparent; color:#A09480; }
  .lcb.on { background:#C9973A; color:#0E0E0F; border-color:#C9973A; font-weight:600; }
  .lcb:not(.on):hover { border-color:rgba(201,151,58,0.5); color:#C9973A; }

  /* Mobile link */
  .ml { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:10px; font-size:14px; font-weight:500; color:#A09480; text-decoration:none; transition:all 0.2s; }
  .ml:hover, .ml-active { background:rgba(201,151,58,0.08); color:#C9973A; }

  /* Tooltip */
  .tip { position:relative; }
  .tip:hover .tiptext { opacity:1; transform:translateX(-50%) translateY(-2px); }
  .tiptext { position:absolute; top:calc(100% + 8px); left:50%; transform:translateX(-50%) translateY(2px); background:#1E1E21; border:1px solid rgba(201,151,58,0.2); color:#A09480; font-size:11px; padding:4px 10px; border-radius:7px; white-space:nowrap; opacity:0; pointer-events:none; transition:all 0.2s; z-index:200; }

  /* Scrollbar */
  .ns::-webkit-scrollbar { width:3px; }
  .ns::-webkit-scrollbar-thumb { background:rgba(201,151,58,0.3); border-radius:3px; }

  /* Dropdown triangle */
  .tri { position:absolute; top:-6px; right:16px; width:12px; height:12px; background:#161618; border:1px solid rgba(201,151,58,0.2); border-right:none; border-bottom:none; transform:rotate(45deg); }

  /* Responsive */
  @media(max-width:1023px) { .desk-nav { display:none !important; } }
  @media(min-width:1024px) { .mob-btn  { display:none !important; } }
  @media(max-width:767px)  { .desk-globe, .desk-profile { display:none !important; } }
`;

export default function Navbar() {
  const navigate = useNavigate();

  const [weather,       setWeather]       = useState(null);
  const [scrolled,      setScrolled]      = useState(false);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [globeOpen,     setGlobeOpen]     = useState(false);
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread,        setUnread]        = useState(0);
  const [heartAnim,     setHeartAnim]     = useState(false);
  const [settings,      setSettings]      = useState({ language:"English", currency:"INR ₹" });

  const profileRef = useRef(null);
  const globeRef   = useRef(null);
  const notifRef   = useRef(null);

  const userInfo = (() => { try { return JSON.parse(localStorage.getItem("userInfo")); } catch { return null; } })();
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // Outside click
  const useOutside = (ref, set) => useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) set(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);
  useOutside(profileRef, setProfileOpen);
  useOutside(globeRef,   setGlobeOpen);
  useOutside(notifRef,   setNotifOpen);

  // Scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Weather
  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=Bhopal&units=metric&appid=${API_KEY}`)
      .then(r => r.json())
      .then(d => setWeather({ temp: Math.round(d.main.temp), icon: d.weather[0].icon, desc: d.weather[0].main }))
      .catch(() => {});
  }, []);

  // Notifications
  useEffect(() => {
    const load = async () => {
      try {
        const [nr, ur] = await Promise.all([api.get("/notifications"), api.get("/notifications/unread")]);
        setNotifications(nr.data);
        setUnread(ur.data.unread);
      } catch {}
    };
    load();
  }, []);

  const markRead = async n => {
    if (n.isRead) return;
    try {
      await api.put(`/notifications/${n._id}`);
      setUnread(p => Math.max(p - 1, 0));
      setNotifications(p => p.map(x => x._id === n._id ? { ...x, isRead: true } : x));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await Promise.all(notifications.filter(n => !n.isRead).map(n => api.put(`/notifications/${n._id}`)));
      setNotifications(p => p.map(n => ({ ...n, isRead: true })));
      setUnread(0);
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  };

  const handleHeart = () => {
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 500);
    navigate("/wishlist");
  };

  // Role-based menu
  const roleItems = !userInfo ? [] :
    userInfo.role === "owner" ? [
      { label:"Add Room",  Icon:PlusSquare, path:"/add-room"  },
      { label:"My Rooms",  Icon:Home,       path:"/my-rooms"  },
    ] : userInfo.role === "admin" ? [
      { label:"Admin Panel", Icon:ShieldCheck, path:"/admin" },
    ] : [
      { label:"My Bookings", Icon:BookOpen, path:"/bookings" },
      { label:"My Profile",  Icon:Settings, path:"/profile"  },
    ];

  // Shared dropdown container style
  const dropBox = (width) => ({
  position:"absolute",
  right:0,
  top:"100%",
  marginTop:"12px",   // 🔥 FIX
  width,
  background:G.bg2,
  border:"1px solid rgba(201,151,58,0.2)",
  borderRadius:18,
  boxShadow:"0 16px 50px rgba(0,0,0,0.65)",
  zIndex:999,
});

  return (
    <>
      <style>{CSS}</style>
      <nav style={{
        position:"sticky", top:0, zIndex:100,
        background: scrolled ? "rgba(14,14,15,0.96)" : G.bg,
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom:`1px solid ${scrolled ? "rgba(201,151,58,0.22)" : G.b1}`,
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.5)" : "none",
        transition:"all 0.3s",
      }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 20px", height:68, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>

          {/* ── LOGO ── */}
          <div onClick={() => navigate("/")} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", flexShrink:0 }}>
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <path d="M14 2C14 2 5 11 5 17C5 21.97 9.03 26 14 26C18.97 26 23 21.97 23 17C23 11 14 2Z" fill="#C9973A"/>
              <circle cx="14" cy="17" r="4.5" fill="#0E0E0F"/>
              <circle cx="14" cy="17" r="2" fill="#C9973A"/>
            </svg>
            <span style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:600, color:G.gold, letterSpacing:0.5 }}>
              StayFinder
            </span>
          </div>

          {/* ── DESKTOP NAV LINKS ── */}
          <div className="desk-nav" style={{ display:"flex", alignItems:"center", gap:32, flex:1, justifyContent:"center" }}>
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink key={label} to={to}
                className={({ isActive }) => `nl${isActive ? " nl-active" : ""}`}
                style={({ isActive }) => ({ color: isActive ? G.gold : G.t2 })}>
                {label}
              </NavLink>
            ))}
          </div>

          {/* ── RIGHT ── */}
          <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>

            {/* Weather */}
            {weather && (
              <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(201,151,58,0.08)", border:"1px solid rgba(201,151,58,0.2)", color:G.gold, padding:"5px 12px", borderRadius:20, fontSize:13, fontWeight:500, flexShrink:0 }}>
                <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt="" style={{ width:20, height:20 }}/>
                <span>{weather.temp}°C</span>
              </div>
            )}

            {/* Globe */}
            <div style={{ position:"relative" }} ref={globeRef} className="desk-globe">
              <button className={`ib tip${globeOpen?" active-ib":""}`} onClick={() => setGlobeOpen(!globeOpen)}>
                <Globe size={17}/>
                <span className="tiptext">Language & Currency</span>
              </button>

              {globeOpen && (
                <div className="nav-drop" style={{ ...dropBox(240), padding:18 }}>
                  <div className="tri"/>
                  <p style={{ fontSize:10, color:G.t3, letterSpacing:"1px", textTransform:"uppercase", marginBottom:10 }}>Language</p>
                  <div style={{ display:"flex", gap:6, marginBottom:18 }}>
                    {["English","Hindi"].map(l => (
                      <button key={l} className={`lcb${settings.language===l?" on":""}`}
                        onClick={() => setSettings(s => ({...s, language:l}))}>
                        {l}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize:10, color:G.t3, letterSpacing:"1px", textTransform:"uppercase", marginBottom:10 }}>Currency</p>
                  <div style={{ display:"flex", gap:6 }}>
                    {["INR ₹","USD $"].map(c => (
                      <button key={c} className={`lcb${settings.currency===c?" on":""}`}
                        onClick={() => setSettings(s => ({...s, currency:c}))}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Heart */}
            <button className={`ib tip${heartAnim?" heart-beat":""}`} onClick={handleHeart}
              style={{ color: heartAnim ? G.rose : G.t3 }}>
              <Heart size={17} fill={heartAnim ? G.rose : "none"}/>
              <span className="tiptext">Wishlist</span>
            </button>

            {/* Bell */}
            <div style={{ position:"relative" }} ref={notifRef}>
              <button className={`ib tip${notifOpen?" active-ib":""}`} onClick={() => setNotifOpen(!notifOpen)}>
                <Bell size={17}/>
                <span className="tiptext">Notifications</span>
                {unread > 0 && (
                  <span className="badge-pop" style={{
                    position:"absolute", top:3, right:3,
                    minWidth:16, height:16, borderRadius:8,
                    background:G.rose, color:"white",
                    fontSize:9, fontWeight:700,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    padding:"0 3px", border:`2px solid ${G.bg}`,
                  }}>
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="nav-drop" style={{ ...dropBox(320), overflow:"hidden" }}>
                  <div className="tri"/>

                  {/* Header */}
                  <div style={{ padding:"14px 16px 10px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${G.b1}` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontFamily:"Georgia,serif", fontSize:15, color:G.t1 }}>Notifications</span>
                      {unread > 0 && (
                        <span style={{ background:G.rose, color:"white", fontSize:10, fontWeight:700, padding:"1px 7px", borderRadius:10 }}>
                          {unread} new
                        </span>
                      )}
                    </div>
                    {unread > 0 && (
                      <button onClick={markAllRead}
                        style={{ fontSize:11, color:G.gold, background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}>
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Items */}
                  <div className="ns" style={{ maxHeight:300, overflowY:"auto", padding:"8px 10px" }}>
                    {notifications.length === 0 ? (
                      <div style={{ textAlign:"center", padding:"28px 0" }}>
                        <p style={{ fontSize:26, marginBottom:8 }}>🔔</p>
                        <p style={{ fontSize:13, color:G.t3 }}>No notifications yet</p>
                      </div>
                    ) : notifications.map(n => (
                      <div key={n._id} className={`ni ${n.isRead?"read":"unread"}`} onClick={() => markRead(n)}>
                        <div style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                          {!n.isRead && (
                            <div style={{ width:7, height:7, borderRadius:"50%", background:G.gold, marginTop:4, flexShrink:0, animation:"pulse 2s infinite" }}/>
                          )}
                          <div style={{ flex:1 }}>
                            <p style={{ fontSize:13, color:n.isRead?G.t2:G.t1, lineHeight:1.5 }}>{n.message}</p>
                            <p style={{ fontSize:11, color:G.t3, marginTop:4 }}>
                              {new Date(n.createdAt).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div style={{ position:"relative" }} ref={profileRef} className="desk-profile">
              <button className="prof-pill" onClick={() => setProfileOpen(!profileOpen)}>
                <Menu size={14} style={{ color:G.t2 }}/>
                <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${G.golddim},${G.gold})`, display:"flex", alignItems:"center", justifyContent:"center", color:G.bg, fontWeight:700, fontSize:12 }}>
                  {userInfo?.name?.[0]?.toUpperCase() || "G"}
                </div>
              </button>

              {profileOpen && (
                <div className="nav-drop" style={{ ...dropBox(228), paddingTop:6, paddingBottom:6 }}>
                  <div className="tri" style={{ right:20 }}/>

                  {/* User info */}
                  <div style={{ padding:"10px 14px 12px", borderBottom:`1px solid ${G.b1}`, marginBottom:4 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:38, height:38, borderRadius:"50%", background:`linear-gradient(135deg,${G.golddim},${G.gold})`, display:"flex", alignItems:"center", justifyContent:"center", color:G.bg, fontWeight:700, fontSize:14, flexShrink:0 }}>
                        {userInfo?.name?.[0]?.toUpperCase() || "G"}
                      </div>
                      <div>
                        <p style={{ fontSize:13, fontWeight:600, color:G.t1 }}>{userInfo?.name || "Guest"}</p>
                        <p style={{ fontSize:11, color:G.t3, marginTop:1 }}>{userInfo?.email || "Not logged in"}</p>
                        {userInfo?.role && (
                          <span style={{ fontSize:9, color:G.gold, background:"rgba(201,151,58,0.12)", border:"1px solid rgba(201,151,58,0.3)", borderRadius:5, padding:"1px 7px", display:"inline-block", marginTop:3, textTransform:"uppercase", letterSpacing:"0.8px", fontWeight:600 }}>
                            {userInfo.role}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding:"0 6px" }}>
                    {!userInfo ? (
                      <>
                        <button className="di" onClick={() => { navigate("/login"); setProfileOpen(false); }}><LogOut size={14}/> Login</button>
                        <button className="di" onClick={() => { navigate("/register"); setProfileOpen(false); }}><Settings size={14}/> Register</button>
                      </>
                    ) : (
                      <>
                        {roleItems.map(({ label, Icon, path }) => (
                          <button key={label} className="di" onClick={() => { navigate(path); setProfileOpen(false); }}>
                            <Icon size={14}/> {label}
                          </button>
                        ))}
                        <div style={{ height:1, background:G.b1, margin:"4px 0" }}/>
                        <button className="di red" onClick={handleLogout}><LogOut size={14}/> Logout</button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button className="mob-btn ib" onClick={() => setMenuOpen(!menuOpen)}
              style={{ border:`1px solid ${G.b2}`, background:G.bg3, color:G.t2, borderRadius:"50%" }}>
              {menuOpen ? <X size={16}/> : <Menu size={16}/>}
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        {menuOpen && (
          <div className="mob-menu" style={{ background:G.bg, borderTop:`1px solid ${G.b1}`, padding:"12px 16px 20px" }}>

            {/* Profile card */}
            <div style={{ display:"flex", alignItems:"center", gap:12, background:G.bg3, border:`1px solid ${G.b2}`, borderRadius:14, padding:"12px 14px", marginBottom:12 }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${G.golddim},${G.gold})`, display:"flex", alignItems:"center", justifyContent:"center", color:G.bg, fontWeight:700, fontSize:15, flexShrink:0 }}>
                {userInfo?.name?.[0]?.toUpperCase() || "G"}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, fontWeight:600, color:G.t1 }}>{userInfo?.name || "Guest"}</p>
                <p style={{ fontSize:11, color:G.t3 }}>{userInfo?.email || "Not logged in"}</p>
              </div>
              {userInfo?.role && (
                <span style={{ fontSize:9, color:G.gold, background:"rgba(201,151,58,0.12)", border:`1px solid ${G.b2}`, borderRadius:5, padding:"2px 8px", textTransform:"uppercase", letterSpacing:"0.8px", fontWeight:600 }}>
                  {userInfo.role}
                </span>
              )}
            </div>

            {/* Weather */}
            {weather && (
              <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(201,151,58,0.08)", border:"1px solid rgba(201,151,58,0.18)", borderRadius:10, padding:"8px 14px", marginBottom:12 }}>
                <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt="" style={{ width:24, height:24 }}/>
                <span style={{ fontSize:14, color:G.gold, fontWeight:500 }}>{weather.temp}°C</span>
                <span style={{ fontSize:12, color:G.t3 }}>Bhopal · {weather.desc}</span>
              </div>
            )}

            {/* Nav links */}
            <div style={{ display:"flex", flexDirection:"column", gap:3, marginBottom:8 }}>
              {NAV_LINKS.map(({ label, to, Icon }) => (
                <NavLink key={label} to={to} onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => `ml${isActive?" ml-active":""}`}>
                  <Icon size={15}/> {label}
                </NavLink>
              ))}
            </div>

            <div style={{ height:1, background:G.b1, margin:"8px 0" }}/>

            {/* Role items */}
            {userInfo && roleItems.map(({ label, Icon, path }) => (
              <NavLink key={label} to={path} onClick={() => setMenuOpen(false)} className="ml">
                <Icon size={15}/> {label}
              </NavLink>
            ))}

            {!userInfo && (
              <>
                <NavLink to="/login"    onClick={() => setMenuOpen(false)} className="ml"><LogOut size={15}/> Login</NavLink>
                <NavLink to="/register" onClick={() => setMenuOpen(false)} className="ml"><Settings size={15}/> Register</NavLink>
              </>
            )}

            {/* Language + Currency mobile */}
            <div style={{ height:1, background:G.b1, margin:"8px 0" }}/>
            <div style={{ display:"flex", gap:8, alignItems:"center", padding:"6px 4px", flexWrap:"wrap" }}>
              <span style={{ fontSize:11, color:G.t3 }}>Language:</span>
              {["English","Hindi"].map(l => (
                <button key={l} className={`lcb${settings.language===l?" on":""}`}
                  onClick={() => setSettings(s => ({...s, language:l}))}>
                  {l}
                </button>
              ))}
              <span style={{ fontSize:11, color:G.t3, marginLeft:8 }}>Currency:</span>
              {["INR ₹","USD $"].map(c => (
                <button key={c} className={`lcb${settings.currency===c?" on":""}`}
                  onClick={() => setSettings(s => ({...s, currency:c}))}>
                  {c}
                </button>
              ))}
            </div>

            {userInfo && (
              <>
                <div style={{ height:1, background:G.b1, margin:"8px 0" }}/>
                <button className="ml" style={{ width:"100%", border:"none", color:G.rose, cursor:"pointer", background:"transparent" }} onClick={handleLogout}>
                  <LogOut size={15}/> Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
}