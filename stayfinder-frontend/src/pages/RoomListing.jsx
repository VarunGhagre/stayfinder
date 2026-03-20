import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import RoomCard from "../components/RoomCard";

function RoomListing() {

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // API Call
  useEffect(() => {
    api.get("/rooms")
      .then(res => {
        setRooms(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>

      <div className="p-4 md:p-8">

        <h1 className="text-2xl font-semibold mb-6">
          Available Rooms
        </h1>

        {/* 🔄 Loading State */}
        {loading && (
          <p className="text-center mt-10 text-gray-500">
            Loading rooms...
          </p>
        )}

        {/* ❌ Empty State */}
        {!loading && rooms.length === 0 && (
          <p className="text-center mt-10 text-gray-500">
            No rooms found
          </p>
        )}

        {/* ✅ Rooms Grid */}
        {!loading && rooms.length > 0 && (
          <div className="grid gap-6
                          grid-cols-1
                          sm:grid-cols-2
                          lg:grid-cols-3
                          xl:grid-cols-4">

            {rooms.map(room => (
              <RoomCard key={room._id} room={room} />
            ))}

          </div>
        )}

      </div>

    </Layout>
  );
}

export default RoomListing;