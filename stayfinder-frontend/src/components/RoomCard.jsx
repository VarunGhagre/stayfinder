import { Heart, Star, MapPin, BedDouble } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

function RoomCard({ room, index = 0 }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const images = Array.isArray(room.images) ? room.images : [];

  // 🔥 Check if already in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const { data } = await api.get("/wishlist");

        const exists = data.some(
          (item) => item.room._id === room._id
        );

        setLiked(exists);
      } catch (err) {
        // ignore if not logged in
      }
    };

    checkWishlist();
  }, [room._id]);

  const prevImg = (e) => {
    e.stopPropagation();
    setImgIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextImg = (e) => {
    e.stopPropagation();
    setImgIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // ❤️ Wishlist toggle (API connected)
  const handleLike = async (e) => {
    e.stopPropagation();

    try {
      if (liked) {
        await api.delete(`/wishlist/${room._id}`);
        setLiked(false);
      } else {
        await api.post(`/wishlist/${room._id}`);
        setLiked(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login required");
    }
  };

  return (
    <div
      onClick={() => navigate(`/rooms/${room._id}`)}
      className="group cursor-pointer rounded-2xl overflow-hidden"
      style={{
        animation: `fadeUp 0.5s ease both`,
        animationDelay: `${index * 70}ms`,
      }}
    >
      {/* ── IMAGE SECTION ── */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#1E1E21]">

        {/* Image */}
        {images.length > 0 ? (
          <img
            src={images[imgIndex]}
            alt={room.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ background: "linear-gradient(135deg,#1E1E21,#26262A)" }}
          >
            🏠
          </div>
        )}

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImg}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition"
              style={{
                background: "rgba(14,14,15,0.75)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(201,151,58,0.3)",
                color: "#C9973A",
              }}
            >
              ‹
            </button>

            <button
              onClick={nextImg}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition"
              style={{
                background: "rgba(14,14,15,0.75)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(201,151,58,0.3)",
                color: "#C9973A",
              }}
            >
              ›
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: i === imgIndex ? "16px" : "6px",
                    height: "6px",
                    background:
                      i === imgIndex
                        ? "#C9973A"
                        : "rgba(255,255,255,0.4)",
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Badge */}
        {room.badge && (
          <div className="absolute top-3 left-3 px-2.5 py-1 text-[10px] rounded-lg border text-[#C9973A]">
            {room.badge}
          </div>
        )}

        {/* Rating */}
        <div className="absolute top-3 right-12 flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-[#C9973A]">
          <Star size={11} fill="#C9973A" />
          <span>{room.rating ?? "4.5"}</span>
        </div>

        {/* ❤️ Wishlist */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition"
          style={{
            background: liked
              ? "rgba(232,82,106,0.2)"
              : "rgba(14,14,15,0.72)",
          }}
        >
          <Heart
            size={15}
            fill={liked ? "#E8526A" : "none"}
            className={liked ? "text-[#E8526A]" : "text-[#A09480]"}
          />
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div className="mt-0 px-1 pt-3 pb-1">

        <div className="flex justify-between">
          <h2 className="text-[15px] text-white truncate">
            {room.title}
          </h2>

          <div className="flex items-center gap-1 text-xs text-[#C9973A]">
            <Star size={12} fill="#C9973A" />
            {room.rating ?? "4.5"}
          </div>
        </div>

        <div className="flex items-center gap-1 mt-1 text-xs text-[#5C5448]">
          <MapPin size={11} />
          {room.city || room.location}
        </div>

        {room.availableBeds !== undefined && (
          <div className="flex items-center gap-1 mt-1 text-xs text-[#5C5448]">
            <BedDouble size={11} />
            {room.availableBeds} beds
          </div>
        )}

        <div className="mt-2 text-[#C9973A] font-semibold">
          ₹{room.price?.toLocaleString("en-IN")} /month
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default RoomCard;