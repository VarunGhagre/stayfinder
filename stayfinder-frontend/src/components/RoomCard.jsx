import { Heart, Star, MapPin, BedDouble } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function RoomCard({ room, index = 0 }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const images = Array.isArray(room.images) ? room.images : [];

  const prevImg = (e) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const nextImg = (e) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
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

        {/* Prev / Next arrows — show on hover */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImg}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
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
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
              style={{
                background: "rgba(14,14,15,0.75)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(201,151,58,0.3)",
                color: "#C9973A",
              }}
            >
              ›
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: i === imgIndex ? "16px" : "6px",
                    height: "6px",
                    background:
                      i === imgIndex ? "#C9973A" : "rgba(255,255,255,0.4)",
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Badge (featured / superhost) */}
        {room.badge && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider"
            style={{
              background: "rgba(14,14,15,0.82)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(201,151,58,0.35)",
              color: "#C9973A",
            }}
          >
            {room.badge}
          </div>
        )}

        {/* Rating badge */}
        <div
          className="absolute top-3 right-12 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold"
          style={{
            background: "rgba(14,14,15,0.82)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(201,151,58,0.25)",
            color: "#C9973A",
          }}
        >
          <Star size={11} fill="#C9973A" className="text-[#C9973A]" />
          <span>{room.rating ?? "4.5"}</span>
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            background: liked ? "rgba(232,82,106,0.2)" : "rgba(14,14,15,0.72)",
            backdropFilter: "blur(8px)",
            border: liked
              ? "1px solid rgba(232,82,106,0.6)"
              : "1px solid rgba(201,151,58,0.25)",
          }}
        >
          <Heart
            size={15}
            fill={liked ? "#E8526A" : "none"}
            className={liked ? "text-[#E8526A]" : "text-[#A09480]"}
          />
        </button>
      </div>

      {/* ── CONTENT SECTION ── */}
      <div className="mt-0 px-1 pt-3 pb-1">
        {/* Title + Rating row */}
        <div className="flex items-start justify-between gap-2">
          <h2
            className="font-semibold text-[15px] leading-snug truncate"
            style={{ fontFamily: "Georgia, serif", color: "#4c4c4c" }}
          >
            {room.title}
          </h2>
          <div className="flex items-center gap-1 flex-shrink-0 text-sm">
            <Star size={12} fill="#C9973A" className="text-[#C9973A]" />
            <span className="text-[#C9973A] font-semibold text-xs">
              {room.rating ?? "4.5"}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 mt-1">
          <MapPin size={11} className="text-[#5C5448] flex-shrink-0" />
          <p className="text-[#5C5448] text-xs truncate">
            {room.city || room.location || "Location not available"}
          </p>
        </div>

        {/* Beds available */}
        {room.availableBeds !== undefined && (
          <div className="flex items-center gap-1 mt-1.5">
            <BedDouble size={11} className="text-[#5C5448]" />
            <p className="text-[#5C5448] text-xs">
              {room.availableBeds} beds available
            </p>
          </div>
        )}

        {/* Price */}
        <div className="mt-2.5 flex items-baseline gap-1">
          <span
            className="text-[17px] font-semibold"
            style={{ fontFamily: "Georgia, serif", color: "#C9973A" }}
          >
            ₹{room.price?.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-[#5C5448] font-normal">/month</span>
        </div>
      </div>

      {/* fadeUp keyframe (injected once) */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}

export default RoomCard;
