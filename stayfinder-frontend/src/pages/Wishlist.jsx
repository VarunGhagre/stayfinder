import { useEffect, useState } from "react";
import api from "../api/axios";
import RoomCard from "../components/RoomCard";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await api.get("/wishlist");
        setWishlist(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div
      className="min-h-screen px-6 md:px-12 py-12 text-white"
      style={{
        background:
          "linear-gradient(180deg, #0E0E0F 0%, #121214 50%, #0E0E0F 100%)",
      }}
    >
      {/* HEADING */}
      <h1 className="text-3xl md:text-2xl font-semibold mb-10 text-center">
        Your Wishlist ❤️
      </h1>

      {/* CONTENT */}
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : wishlist.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-400 text-lg">
            No items in wishlist 😢
          </p>
          <p className="text-sm mt-2 text-gray-500">
            Start adding your favorite rooms ❤️
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {wishlist.map((item, index) => (
            <RoomCard
              key={item._id}
              room={item.room}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;