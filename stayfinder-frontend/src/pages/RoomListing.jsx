import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import RoomCard from "../components/RoomCard";
import { useLocation } from "react-router-dom";

function RoomListing() {
  const categories = ["All", "PG", "Hostel", "Flat", "Villa", "Apartment"];
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [beds, setBeds] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const location = useLocation();
  console.log("Selected Category 👉", selectedCategory);
  const searchData = location.state || {};

  useEffect(() => {
    api
      .get("/rooms")
      .then((res) => {
        const allRooms = res.data.rooms;

        // 🔥 Filtering logic
        const filteredRooms = allRooms.filter((room) => {
          // Location filter
          if (
            searchData.location &&
            !room.city
              ?.toLowerCase()
              .includes(searchData.location.toLowerCase())
          ) {
            return false;
          }

          // Guests filter (beds check)
          if (
            searchData.guests &&
            room.availableBeds < Number(searchData.guests)
          ) {
            return false;
          }

          if (
            maxPrice !== "" &&
            Number(maxPrice) > 0 &&
            room.price > Number(maxPrice)
          )
            return false;

          if (beds !== "" && room.availableBeds < Number(beds)) return false;

          if (selectedCategory !== "All" && room.category !== selectedCategory)
            return false;

          return true;
        });

        setRooms(filteredRooms);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [searchData, maxPrice, beds, selectedCategory]);

  return (
    <Layout>
      <div className="p-4 md:p-8">
        
        <h1 className="text-2xl font-semibold mb-6 hover:text-yellow-600">Available Rooms</h1>
        {/* FILTER BUTTON */}
        <button
          onClick={() => setShowFilters(true)}
          className="mb-4 px-4 py-1 border-1 text-white rounded-lg hover:text-yellow-500 cursor-pointer"
        >
          Filters
        </button>

        {/* OVERLAY */}
        {showFilters && (
          <div
            onClick={() => setShowFilters(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}

        {/* SLIDE PANEL */}
        <div
          className={`fixed top-0 left-0 h-full w-[280px] bg-[#0E0E0F] z-50 p-5 border-r border-[rgba(201,151,58,0.2)]
  transform transition-transform duration-300 ease-in-out
  ${showFilters ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={() => setShowFilters(false)}
            className="mb-4 text-[#C9973A]"
          >
            ✕ Close
          </button>

          {/* Price */}
          <div className="mb-6">
            <p className="text-sm mb-2">Max Price</p>
            <input
              type="range"
              min="1000"
              max="50000"
              step="500"
              value={maxPrice || 50000}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full"
            />
            <p className="text-xs mt-1">₹{maxPrice || 50000}</p>
          </div>

          {/* Beds */}
          <div className="mb-6">
            <p className="text-sm mb-2">Beds</p>
            <input
              type="number"
              placeholder="Min beds"
              onChange={(e) => setBeds(e.target.value)}
              className="w-full bg-[#1E1E21] p-2 rounded-lg"
            />
          </div>
        </div>


        <div className="flex gap-3 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition
        ${
          selectedCategory === cat
            ? "bg-[#C9973A] text-black"
            : "bg-[#1E1E21] text-[#F2EDE6] hover:bg-[#26262A]"
        }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center mt-10 text-gray-500">Loading rooms...</p>
        )}

        {/* Empty */}
        {!loading && rooms.length === 0 && (
          <p className="text-center mt-10 text-gray-500">No rooms found</p>
        )}

        {/* Rooms */}
        {!loading && rooms.length > 0 && (
          <div
            className="grid gap-6
                          grid-cols-1
                          sm:grid-cols-2
                          lg:grid-cols-3
                          xl:grid-cols-4"
          >
            {rooms.map((room, index) => (
              <RoomCard key={room._id} room={room} index={index} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default RoomListing;
