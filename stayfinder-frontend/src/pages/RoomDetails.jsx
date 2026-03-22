import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";

function RoomDetails() {
  const { id } = useParams();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/rooms/${id}`)
      .then(res => {
        setRoom(res.data.room);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!room) {
    return <p className="text-center mt-10">Room not found</p>;
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4">
          {room.title}
        </h1>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(room.images || []).map((img, index) => (
            <img
              key={index}
              src={img}
              alt="room"
              className="rounded-lg h-64 w-full object-cover"
            />
          ))}
        </div>

        {/* Info */}
        <div className="mt-6 space-y-3">

          <p className="text-gray-600">
            📍 {room.city || room.location || "Location not available"}
          </p>

          <p className="text-2xl font-bold text-red-500">
            ₹{room.price} / month
          </p>

          {room.availableBeds !== undefined && (
            <p>
              🛏 {room.availableBeds} beds available
            </p>
          )}

          <p className="text-gray-700">
            {room.description || "No description available"}
          </p>

          {/* Button */}
          <button className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition">
            Book Now
          </button>

        </div>
      </div>
    </Layout>
  );
}

export default RoomDetails;