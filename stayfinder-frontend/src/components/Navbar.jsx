import {
  Search,
  MapPin,
  Heart,
  Bell,
  ChevronDown,
  Menu,
  X,
  Globe,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

function Navbar() {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Scrolled shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close profile dropdown on outside click
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
      <div className="flex items-center justify-between px-4 md:px-8 h-[68px]">

        {/* ── LOGO ── */}
        <div className="flex items-center gap-2.5 cursor-pointer flex-shrink-0">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 2C14 2 5 11 5 17C5 21.97 9.03 26 14 26C18.97 26 23 21.97 23 17C23 11 14 2Z"
              fill="#C9973A"
            />
            <circle cx="14" cy="17" r="4.5" fill="#0E0E0F" />
            <circle cx="14" cy="17" r="2" fill="#C9973A" />
          </svg>
          <h1
            className="text-[#C9973A] text-xl font-semibold tracking-wide hidden sm:block"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Stay<span className="italic">Finder</span>
          </h1>
        </div>

        {/* ── SEARCH PILL (Desktop) ── */}
        <div
          className={`hidden lg:flex items-center border rounded-full overflow-hidden transition-all duration-300 ${
            searchFocus
              ? "border-[rgba(201,151,58,0.6)] shadow-[0_0_24px_rgba(201,151,58,0.12)] bg-[#1E1E21]"
              : "border-[rgba(201,151,58,0.25)] bg-[#1E1E21] hover:border-[rgba(201,151,58,0.45)] hover:shadow-[0_0_20px_rgba(201,151,58,0.08)]"
          }`}
        >
          {/* Search input */}
          <div className="flex items-center gap-2 px-5 py-2.5 border-r border-[rgba(201,151,58,0.15)]">
            <Search size={14} className="text-[#C9973A] flex-shrink-0" />
            <input
              placeholder="Search destination..."
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              className="bg-transparent outline-none text-sm w-40 text-[#F2EDE6] placeholder-[#5C5448]"
            />
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-r border-[rgba(201,151,58,0.15)] text-sm text-[#A09480] hover:text-[#C9973A] transition-colors cursor-pointer">
            <MapPin size={13} className="text-[#C9973A]" />
            <span>Bhopal</span>
            <ChevronDown size={13} />
          </div>

          {/* Any week */}
          <div className="px-4 py-2.5 text-sm text-[#5C5448] hover:text-[#A09480] transition-colors cursor-pointer">
            Any week
          </div>

          {/* Search button */}
          <button className="m-2 w-9 h-9 rounded-full bg-[#C9973A] hover:bg-[#E8C97A] flex items-center justify-center transition-all duration-200 hover:scale-105 flex-shrink-0">
            <Search size={14} className="text-[#0E0E0F]" />
          </button>
        </div>

        {/* ── RIGHT SECTION ── */}
        <div className="flex items-center gap-2 md:gap-2.5">

          {/* Weather pill */}
          <div className="hidden md:flex items-center gap-1.5 bg-[rgba(201,151,58,0.1)] border border-[rgba(201,151,58,0.25)] text-[#C9973A] px-3 py-1.5 rounded-full text-sm font-medium hover:bg-[rgba(201,151,58,0.16)] transition-all cursor-pointer">
            <span>🌤</span>
            <span>32°C</span>
            <span className="text-[#8A6520] text-xs hidden xl:inline">Bhopal</span>
          </div>

          {/* Become a Host */}
          <button className="hidden xl:block text-sm text-[#A09480] hover:text-[#C9973A] px-3 py-2 rounded-full hover:bg-[rgba(201,151,58,0.06)] transition-all font-medium whitespace-nowrap">
            Become a Host
          </button>

          {/* Globe */}
          <button className="hidden md:flex w-9 h-9 items-center justify-center rounded-full hover:bg-[rgba(201,151,58,0.08)] transition-all text-[#5C5448] hover:text-[#A09480]">
            <Globe size={17} />
          </button>

          {/* Heart */}
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[rgba(201,151,58,0.08)] transition-all text-[#5C5448] hover:text-[#E8526A]">
            <Heart size={17} />
          </button>

          {/* Bell with notification dot */}
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[rgba(201,151,58,0.08)] transition-all text-[#5C5448] hover:text-[#C9973A]">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E8526A] rounded-full border-2 border-[#0E0E0F]" />
          </button>

          {/* Profile menu (Desktop) */}
          <div className="relative hidden md:block" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`flex items-center gap-2.5 border rounded-full px-3 py-1.5 transition-all duration-200 bg-[#1E1E21] ${
                profileOpen
                  ? "border-[rgba(201,151,58,0.5)] shadow-[0_0_20px_rgba(201,151,58,0.1)]"
                  : "border-[rgba(201,151,58,0.25)] hover:border-[rgba(201,151,58,0.45)] hover:shadow-[0_0_16px_rgba(201,151,58,0.08)]"
              }`}
            >
              <Menu size={15} className="text-[#A09480]" />
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8A6520] to-[#C9973A] flex items-center justify-center text-[#0E0E0F] text-xs font-bold">
                AK
              </div>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#161618] border border-[rgba(201,151,58,0.2)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] py-2 z-50">
                {/* User info */}
                <div className="px-4 py-3 border-b border-[rgba(201,151,58,0.1)]">
                  <p className="font-semibold text-sm text-[#F2EDE6]">Arjun Kumar</p>
                  <p className="text-xs text-[#5C5448] mt-0.5">arjun@email.com</p>
                </div>

                {[
                  { label: "My Profile",     icon: "👤" },
                  { label: "My Trips",       icon: "✈️" },
                  { label: "Wishlist",       icon: "❤️" },
                  { label: "Host Dashboard", icon: "🏠" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#A09480] hover:bg-[rgba(201,151,58,0.06)] hover:text-[#C9973A] transition-all text-left"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                ))}

                <div className="border-t border-[rgba(201,151,58,0.1)] my-1" />

                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#E8526A] hover:bg-[rgba(232,82,106,0.06)] transition-all text-left">
                  <span>🚪</span> Log out
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-[rgba(201,151,58,0.25)] bg-[#1E1E21] text-[#A09480] hover:border-[rgba(201,151,58,0.5)] transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* ── MOBILE DROPDOWN ── */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-5 pt-2 flex flex-col gap-3 border-t border-[rgba(201,151,58,0.12)] bg-[#0E0E0F]">

          {/* Search */}
          <div className="flex items-center gap-2.5 bg-[#1E1E21] border border-[rgba(201,151,58,0.25)] px-4 py-3 rounded-2xl">
            <Search size={15} className="text-[#C9973A] flex-shrink-0" />
            <input
              placeholder="Search destination..."
              className="bg-transparent outline-none text-sm flex-1 text-[#F2EDE6] placeholder-[#5C5448]"
            />
          </div>

          {/* Location + Weather row */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-[#A09480] bg-[#1E1E21] border border-[rgba(201,151,58,0.15)] px-3 py-2.5 rounded-xl flex-1">
              <MapPin size={13} className="text-[#C9973A]" />
              <span>Bhopal</span>
              <ChevronDown size={13} className="ml-auto" />
            </div>
            <div className="flex items-center gap-1.5 bg-[rgba(201,151,58,0.1)] border border-[rgba(201,151,58,0.25)] text-[#C9973A] px-3 py-2.5 rounded-xl text-sm font-medium">
              🌤 <span>32°C</span>
            </div>
          </div>

          {/* Profile card */}
          <div className="flex items-center gap-3 bg-[#1E1E21] border border-[rgba(201,151,58,0.2)] px-4 py-3 rounded-2xl cursor-pointer hover:border-[rgba(201,151,58,0.4)] transition-all">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8A6520] to-[#C9973A] flex items-center justify-center text-[#0E0E0F] text-sm font-bold flex-shrink-0">
              AK
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F2EDE6]">Arjun Kumar</p>
              <p className="text-xs text-[#5C5448]">View profile →</p>
            </div>
            <ChevronDown size={14} className="ml-auto text-[#5C5448]" />
          </div>

          {/* Menu links */}
          <div className="flex flex-col gap-0.5">
            {[
              { label: "My Trips",       icon: "✈️" },
              { label: "Wishlist",       icon: "❤️" },
              { label: "Notifications",  icon: "🔔" },
              { label: "Become a Host",  icon: "🏠" },
            ].map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#A09480] hover:text-[#C9973A] hover:bg-[rgba(201,151,58,0.06)] rounded-xl transition-all text-left"
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-[rgba(201,151,58,0.1)] pt-1">
            <button className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#E8526A] hover:bg-[rgba(232,82,106,0.06)] rounded-xl transition-all w-full text-left">
              🚪 Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;