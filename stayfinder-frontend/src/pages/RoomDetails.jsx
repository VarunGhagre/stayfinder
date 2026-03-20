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
        setRoom(res.data);
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

      <div className="p-4 md:p-8">

        {/* Title */}
        <h1 className="text-2xl font-bold mb-4">
          {room.title}
        </h1>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {room.images?.map((img, index) => (
            <img
              key={index}
              src={img}
              className="rounded-lg h-60 w-full object-cover"
            />
          ))}
        </div>

        {/* Info */}
        <div className="mt-6">

          <p className="text-gray-600">
            📍 {room.city}
          </p>

          <p className="text-xl font-bold text-red-500 mt-2">
            ₹{room.price} / month
          </p>

          <p className="mt-2">
            🛏 {room.availableBeds} beds available
          </p>

          <p className="mt-4 text-gray-700">
            {room.description || "No description available"}
          </p>

          {/* Book Button */}
          <button className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
            Book Now
          </button>

        </div>

      </div>

    </Layout>
  );
}

export default RoomDetails;