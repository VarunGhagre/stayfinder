import { Heart, Bell, ChevronDown, Menu, X, Globe } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

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
          <div className="hidden md:flex items-center gap-1.5 bg-[rgba(201,151,58,0.1)] border border-[rgba(201,151,58,0.25)] text-[#C9973A] px-3 py-1.5 rounded-full text-sm font-medium hover:scale-105 transition-all cursor-pointer">
            🌤 <span>32°C</span>
          </div>

          {/* Globe */}
          <button className="hidden md:flex w-9 h-9 items-center justify-center rounded-full hover:bg-[rgba(201,151,58,0.08)] transition-all text-[#5C5448] hover:text-[#A09480]">
            <Globe size={17} />
          </button>

          {/* Heart */}
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[rgba(201,151,58,0.08)] transition-all text-[#5C5448] hover:text-[#E8526A]">
            <Heart size={17} />
          </button>

          {/* Bell */}
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[rgba(201,151,58,0.08)] transition-all text-[#5C5448] hover:text-[#C9973A]">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E8526A] rounded-full border-2 border-[#0E0E0F]" />
          </button>

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
