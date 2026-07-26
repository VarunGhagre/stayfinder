import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, MapPin, CalendarDays, Users } from "lucide-react";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: "",
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isOwner = userInfo?.role === "owner";

  return (
    <Layout>
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
        style={{
           backgroundImage:
            "linear-gradient(rgba(10,10,10,.72),rgba(10,10,10,.88)),url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1800&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0E0E0F]/40 to-[#0E0E0F]" />

        <div className="relative z-10 w-full max-w-6xl text-center">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#C9973A]/40 bg-white/5 backdrop-blur-md text-[#E8C97A] text-sm">
            ✨ Premium Hotels • Resorts • Villas • PG
          </span>

          <h1
            className="mt-8 text-5xl md:text-7xl font-bold leading-tight text-white"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Discover Your
            <br />
            <span className="text-[#C9973A]">Perfect Stay</span>
          </h1>

          <p className="mt-6 text-gray-300 max-w-2xl mx-auto text-lg">
            Luxury hotels, resorts, villas and premium PGs at the best prices.
          </p>

          <div className="mt-12 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-3 shadow-2xl">
            <div className="grid md:grid-cols-5 gap-2">

              <div className="bg-[#18181B] rounded-2xl p-4 text-left">
                <label className="text-[#C9973A] text-xs flex items-center gap-1"><MapPin size={14}/> Destination</label>
                <input
                  value={searchData.location}
                  onChange={(e)=>setSearchData({...searchData,location:e.target.value})}
                  placeholder="Where are you going?"
                  className="w-full mt-2 bg-transparent outline-none text-white"
                />
              </div>

              <div className="bg-[#18181B] rounded-2xl p-4 text-left">
                <label className="text-[#C9973A] text-xs flex items-center gap-1"><CalendarDays size={14}/> Check In</label>
                <input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e)=>setSearchData({...searchData,checkIn:e.target.value})}
                  className="w-full mt-2 bg-transparent text-white outline-none"
                />
              </div>

              <div className="bg-[#18181B] rounded-2xl p-4 text-left">
                <label className="text-[#C9973A] text-xs flex items-center gap-1"><CalendarDays size={14}/> Check Out</label>
                <input
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e)=>setSearchData({...searchData,checkOut:e.target.value})}
                  className="w-full mt-2 bg-transparent text-white outline-none"
                />
              </div>

              <div className="bg-[#18181B] rounded-2xl p-4 text-left">
                <label className="text-[#C9973A] text-xs flex items-center gap-1"><Users size={14}/> Guests</label>
                <input
                  type="number"
                  value={searchData.guests}
                  onChange={(e)=>setSearchData({...searchData,guests:e.target.value})}
                  placeholder="1"
                  className="w-full mt-2 bg-transparent text-white outline-none"
                />
              </div>

              <button
                onClick={()=>navigate("/rooms",{state:searchData})}
                className="rounded-2xl bg-[#C9973A] hover:bg-[#E8C97A] text-black font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Search size={18}/>
                Search
              </button>

            </div>
          </div>

          {isOwner && (
            <div className="mt-8">
              <button
                onClick={()=>navigate("/owner-bookings")}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C9973A] to-[#E8C97A] text-black font-semibold inline-flex items-center gap-2 hover:scale-105 transition"
              >
                Owner Dashboard <ArrowRight size={18}/>
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-16">
            {[
              ["4M+","Happy Guests"],
              ["20K+","Luxury Rooms"],
              ["190+","Cities"],
              ["24/7","Support"]
            ].map(([n,t])=>(
              <div key={t} className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6 hover:-translate-y-1 transition">
                <h2 className="text-3xl text-[#C9973A] font-bold">{n}</h2>
                <p className="text-gray-300 mt-2">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Home;
