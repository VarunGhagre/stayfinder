import {
  Search,
  MapPin,
  Heart,
  Bell,
  ChevronDown,
  Menu,
} from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">

      <div className="flex items-center justify-between px-4 md:px-8 py-3">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-red-500 text-white p-2 rounded-xl">🏠</div>
          <h1 className="text-lg md:text-xl font-semibold">
            Stay<span className="text-red-500">Finder</span>
          </h1>
        </div>

        {/* Search (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full shadow-inner w-[420px]">

          <div className="flex items-center gap-2 flex-1">
            <Search size={16} className="text-gray-500" />
            <input
              placeholder="Search"
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          <div className="h-5 w-[1px] bg-gray-300" />

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin size={14} />
            <span>Bhopal</span>
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-4">

          {/* Weather */}
          <div className="hidden md:flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
            🌤 32°C
          </div>

          {/* Icons */}
          <Heart className="cursor-pointer hover:text-red-500 transition" />
          <Bell className="cursor-pointer hover:text-blue-500 transition" />

          {/* Profile */}
          <div className="hidden md:flex items-center gap-2 border px-3 py-1 rounded-full cursor-pointer hover:shadow">
            <div className="bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded-full text-sm">
              AK
            </div>
            <span className="text-sm">Arjun</span>
            <ChevronDown size={14} />
          </div>

          {/* Mobile Menu Button */}
          <Menu
            className="md:hidden cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3">

          {/* Search */}
          <div className="flex items-center gap-2 border px-3 py-2 rounded-full">
            <Search size={16} />
            <input
              placeholder="Search..."
              className="outline-none w-full"
            />
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={14} />
            Bhopal
          </div>

          {/* Weather */}
          <div className="text-sm">🌤 32°C</div>

          {/* Profile */}
          <div className="flex items-center gap-2 border px-3 py-2 rounded-full">
            <div className="bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded-full text-sm">
              AK
            </div>
            <span>Arjun</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;