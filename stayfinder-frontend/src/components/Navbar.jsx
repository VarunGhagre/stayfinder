import { Heart, Bell, ChevronDown, Menu, X, Globe } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [weather, setWeather] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const [globeOpen, setGlobeOpen] = useState(false);
  const globeRef = useRef(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const notifRef = useRef(null);

  const [settings, setSettings] = useState({
    language: "English",
    currency: "INR",
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get("/notifications");
        setNotifications(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchUnread = async () => {
      try {
        const { data } = await api.get("/notifications/unread");
        setUnread(data.unread);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotifications();
    fetchUnread();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (globeRef.current && !globeRef.current.contains(e.target)) {
        setGlobeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Bhopal&units=metric&appid=d5e67e27576bb28672f70dcbbf3fddd5`,
        );
        const data = await res.json();

        setWeather({
          temp: Math.round(data.main.temp),
          icon: data.weather[0].icon,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-[#0E0E0F]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-[rgba(201,151,58,0.2)]"
          : "bg-[#0E0E0F] border-[rgba(201,151,58,0.12)]"
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-8 h-[70px]">
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer">
          <h1 className="text-[#C9973A] text-xl font-semibold">StayFinder</h1>
        </div>

        {/* 🔥 NAV LINKS (DESKTOP) */}
        <div className="hidden lg:flex items-center gap-10 text-[15px] font-semibold">
          {["Home", "About", "Services", "Contact"].map((item) => (
            <NavLink
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `relative font-semibold text-[15px] transition-all duration-300 group ${
                  isActive ? "text-[#C9973A]" : "text-[#A09480]"
                } hover:text-[#C9973A]`
              }
            >
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#C9973A] transition-all duration-300 group-hover:w-full"></span>
            </NavLink>
          ))}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2">
          {/* Weather */}
          {/* <div className="hidden md:flex items-center gap-1.5 bg-[rgba(201,151,58,0.1)] border border-[rgba(201,151,58,0.25)] text-[#C9973A] px-3 py-1.5 rounded-full text-sm font-medium hover:scale-105 transition-all cursor-pointer"> */}
          {weather ? (
            <div className="flex items-center gap-1.5 bg-[rgba(201,151,58,0.1)] border border-[rgba(201,151,58,0.25)] text-[#C9973A] px-3 py-1.5 rounded-full text-sm">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                alt="weather"
                className="w-5 h-5"
              />

              <span>{weather.temp}°C</span>
            </div>
          ) : (
            <div className="text-sm text-[#C9973A]">Loading...</div>
          )}
          {/* </div> */}

          {/* Globe */}
          <div className="relative hidden md:block" ref={globeRef}>
            <button
              onClick={() => setGlobeOpen(!globeOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[rgba(201,151,58,0.08)] text-[#5C5448] hover:text-[#A09480] transition"
            >
              <Globe size={17} />
            </button>

            {/* DROPDOWN */}
            {globeOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#161618] border border-[rgba(201,151,58,0.2)] rounded-2xl shadow-xl p-4 space-y-4">
                {/* LANGUAGE */}
                <div>
                  <p className="text-xs text-[#A09480] mb-2">Language</p>
                  <div className="flex gap-2">
                    {["English", "Hindi"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() =>
                          setSettings({ ...settings, language: lang })
                        }
                        className={`px-3 py-1 text-sm rounded-full border transition ${
                          settings.language === lang
                            ? "bg-[#C9973A] text-black"
                            : "border-[rgba(201,151,58,0.3)] text-[#A09480] hover:text-[#C9973A]"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CURRENCY */}
                <div>
                  <p className="text-xs text-[#A09480] mb-2">Currency</p>
                  <div className="flex gap-2">
                    {["INR ₹", "USD $"].map((cur) => (
                      <button
                        key={cur}
                        onClick={() =>
                          setSettings({ ...settings, currency: cur })
                        }
                        className={`px-3 py-1 text-sm rounded-full border transition ${
                          settings.currency === cur
                            ? "bg-[#C9973A] text-black"
                            : "border-[rgba(201,151,58,0.3)] text-[#A09480] hover:text-[#C9973A]"
                        }`}
                      >
                        {cur}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Heart */}
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[rgba(201,151,58,0.08)] transition-all text-[#5C5448] hover:text-[#E8526A]">
            <Heart
              size={17}
              onClick={() => navigate("/wishlist")}
              className="cursor-pointer hover:text-[#E8526A] transition"
            />
          </button>

          {/* Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[rgba(201,151,58,0.08)] text-[#5C5448] hover:text-[#C9973A]"
            >
              <Bell size={17} />

              {/* 🔴 UNREAD BADGE */}
              {unread > 0 && (
                <span className="absolute top-1 right-1 text-[10px] bg-red-500 text-white px-1 rounded-full">
                  {unread}
                </span>
              )}
            </button>

            {/* 🔥 DROPDOWN */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#161618] border border-[rgba(201,151,58,0.2)] rounded-2xl shadow-xl p-4">
                <h3 className="text-sm text-[#C9973A] mb-3">Notifications</h3>

                {notifications.length === 0 ? (
                  <p className="text-gray-400 text-sm">No notifications</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={async () => {
                          try {
                            await api.put(`/notifications/${n._id}`);

                            // update UI instantly
                            setUnread((prev) => Math.max(prev - 1, 0));
                            setNotifications((prev) =>
                              prev.map((item) =>
                                item._id === n._id
                                  ? { ...item, isRead: true }
                                  : item,
                              ),
                            );
                          } catch (err) {
                            console.log(err);
                          }
                        }}
                        className={`p-3 rounded-lg cursor-pointer transition ${
                          n.isRead
                            ? "bg-[#1E1E21]"
                            : "bg-[#26262A] border border-[#C9973A]"
                        }`}
                      >
                        <p className="text-sm text-white">{n.message}</p>

                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="relative hidden md:block" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 border rounded-full px-3 py-1.5 bg-[#1E1E21] border-[rgba(201,151,58,0.25)] hover:border-[rgba(201,151,58,0.5)]"
            >
              <Menu size={15} />
              <div className="w-7 h-7 rounded-full bg-[#C9973A] flex items-center justify-center text-black text-xs font-bold">
                {userInfo?.name?.[0] || "G"}
              </div>
            </button>

            {/* Dropdown */}
            {/* DROPDOWN */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#161618] border border-[rgba(201,151,58,0.2)] rounded-2xl shadow-xl py-2 z-50">
                {/* USER INFO */}
                <div className="px-4 py-3 border-b border-[rgba(201,151,58,0.1)]">
                  <p className="text-sm text-white font-semibold">
                    {userInfo?.name || "Guest"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {userInfo?.email || "Not logged in"}
                  </p>
                </div>

                {/* NOT LOGGED IN */}
                {!userInfo ? (
                  <>
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full text-left px-4 py-2 text-sm text-[#A09480] hover:text-[#C9973A] hover:bg-[rgba(201,151,58,0.06)] transition"
                    >
                      Login
                    </button>

                    <button
                      onClick={() => navigate("/register")}
                      className="w-full text-left px-4 py-2 text-sm text-[#A09480] hover:text-[#C9973A] hover:bg-[rgba(201,151,58,0.06)] transition"
                    >
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    {/* OWNER */}
                    {userInfo.role === "owner" && (
                      <button
                        onClick={() => navigate("/add-room")}
                        className="w-full text-left px-4 py-2 text-sm text-[#A09480] hover:text-[#C9973A] hover:bg-[rgba(201,151,58,0.06)] transition"
                      >
                        Add Room
                      </button>
                    )}

                    {/* USER */}
                    {userInfo.role === "user" && (
                      <button
                        onClick={() => navigate("/bookings")}
                        className="w-full text-left px-4 py-2 text-sm text-[#A09480] hover:text-[#C9973A] hover:bg-[rgba(201,151,58,0.06)] transition"
                      >
                        My Bookings
                      </button>
                    )}

                    {/* ADMIN */}
                    {userInfo.role === "admin" && (
                      <button
                        onClick={() => navigate("/admin")}
                        className="w-full text-left px-4 py-2 text-sm text-[#A09480] hover:text-[#C9973A] hover:bg-[rgba(201,151,58,0.06)] transition"
                      >
                        Admin Panel
                      </button>
                    )}

                    <div className="border-t my-1 border-[rgba(201,151,58,0.1)]"></div>

                    {/* LOGOUT */}
                    <button
                      onClick={() => {
                        localStorage.removeItem("userInfo");
                        window.location.reload(); // 🔥 IMPORTANT FIX
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-[rgba(201,151,58,0.25)] bg-[#1E1E21]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* 📱 MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-5 pt-3 flex flex-col gap-2 border-t bg-[#0E0E0F]">
          {/* MOBILE PROFILE (NEW - NO UI CHANGE) */}
          <div className="flex items-center gap-3 bg-[#1E1E21] border border-[rgba(201,151,58,0.2)] px-4 py-3 rounded-2xl mb-2">
            <div className="w-9 h-9 rounded-full bg-[#C9973A] flex items-center justify-center text-black text-sm font-bold">
              AK
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Arjun Kumar</p>
              <p className="text-xs text-[#5C5448]">View profile</p>
            </div>
          </div>

          {["Home", "About", "Services", "Contact"].map((item) => (
            <NavLink
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `relative font-semibold text-[15px] transition-all duration-300 group ${
                  isActive ? "text-[#C9973A]" : "text-[#A09480]"
                } hover:text-[#C9973A]`
              }
            >
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#C9973A] transition-all duration-300 group-hover:w-full"></span>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
