import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RoomCard({ room }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/rooms/${room._id}`)}
      className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden group cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={room.images?.[0]}
          className="h-48 w-full object-cover group-hover:scale-110 transition duration-300"
        />

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow cursor-pointer hover:text-red-500">
          <Heart size={18} />
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded flex items-center gap-1 text-sm shadow">
          <Star size={14} className="text-yellow-500" />
          <span>4.5</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h2 className="font-semibold text-base">{room.title}</h2>

        <p className="text-gray-500 text-sm">{room.city}</p>

        <p className="mt-2 font-bold text-lg text-red-500">
          ₹{room.price}
          <span className="text-sm text-gray-500 font-normal"> /month</span>
        </p>

        <p className="text-sm mt-1">{room.availableBeds} beds available</p>
      </div>
    </div>
  );
}

export default RoomCard;
