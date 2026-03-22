import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Wallet, Sparkles, Shield, Star, ArrowRight } from "lucide-react";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();
 const [searchData, setSearchData] = useState({
  location: "",
  checkIn: "",
  checkOut: "",
  guests: "",
});

  return (
    <Layout>

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section
        className="text-center px-4 md:px-8 py-16"
        style={{ background: "#0E0E0F" }}
      >
        {/* Background radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(201,151,58,0.13), transparent)",
          }}
        />

        {/* Subtle dot-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-100"
          style={{
            backgroundImage:
              "radial-gradient(rgba(201,151,58,0.07) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

          <div className="inline-block px-4 py-1 border border-[rgba(201,151,58,0.3)] rounded-full text-xs text-[#C9973A] mb-6">
          ✦ 4M+ Curated Stays Worldwide
        </div>

        {/* Title */}
        <h1
          className="text-4xl md:text-6xl mb-4"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Find your perfect <br />
          <span className="text-[#C9973A] italic">sanctuary</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#A09480] max-w-md mx-auto mb-10">
          Discover extraordinary properties, from villas to hidden retreats.
        </p>

        {/* SEARCH BOX */}
        <div className="max-w-3xl mx-auto bg-[#1E1E21] border border-[rgba(201,151,58,0.3)] rounded-2xl flex flex-col md:flex-row overflow-hidden">

          <div className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r border-[rgba(201,151,58,0.15)]">
            <p className="text-xs text-[#C9973A]">Destination</p>
            <input
  type="text"
  placeholder="Search location"
  value={searchData.location}
  onChange={(e) =>
    setSearchData({ ...searchData, location: e.target.value })
  }
  className="bg-transparent outline-none text-sm text-[#F2EDE6] w-full"
/>
          </div>

          <div className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r border-[rgba(201,151,58,0.15)]">
            <p className="text-xs text-[#C9973A]">Check In</p>
            <input
  type="date"
  value={searchData.checkIn}
  onChange={(e) =>
    setSearchData({ ...searchData, checkIn: e.target.value })
  }
  className="bg-transparent text-sm text-[#F2EDE6]"
/>
          </div>

          <div className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r border-[rgba(201,151,58,0.15)]">
            <p className="text-xs text-[#C9973A]">Check Out</p>
          <input
  type="date"
  value={searchData.checkIn}
  onChange={(e) =>
    setSearchData({ ...searchData, checkIn: e.target.value })
  }
  className="bg-transparent text-sm text-[#F2EDE6]"
/>
          </div>

          <div className="flex-1 px-4 py-3">
            <p className="text-xs text-[#C9973A]">Guests</p>
           <input
  type="number"
  placeholder="Guests"
  value={searchData.guests}
  onChange={(e) =>
    setSearchData({ ...searchData, guests: e.target.value })
  }
  className="bg-transparent text-sm text-[#F2EDE6] w-full"
/>
          </div>

          {/* Button */}
          <button
  onClick={() => {
  navigate("/rooms", { state: searchData });
}}
  className="bg-[#C9973A] text-[#0E0E0F] px-6 py-3 hover:bg-[#E8C97A] transition"
>
  Search
</button>
        </div>

        {/* STATS */}
        <div className="flex justify-center gap-8 mt-12 flex-wrap">
          {[
            ["4M+", "Properties"],
            ["190+", "Countries"],
            ["98%", "Satisfaction"],
            ["24/7", "Support"],
          ].map(([num, label]) => (
            <div key={label}>
              <h2
                className="text-2xl text-[#C9973A]"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {num}
              </h2>
              <p className="text-xs text-[#5C5448]">{label}</p>
            </div>
            ))}
       
        </div>
      </section>

      {/* Pulse keyframe */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
      `}</style>

    </Layout>
  );
}

export default Home;