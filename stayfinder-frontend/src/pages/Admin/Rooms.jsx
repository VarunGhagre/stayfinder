import { useEffect, useState } from "react";
import api from "../../api/axios";

function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await api.get("/admin/rooms");
      setRooms(data);
    };
    fetchRooms();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/rooms/${id}`, { status });

    setRooms((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo || userInfo.role !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl mb-6">Rooms Approval</h1>

      {rooms.map((r) => (
        <div key={r._id} className="bg-[#1E1E21] p-4 mb-3 rounded-lg">
          <p>{r.title}</p>
          <p className="text-sm text-gray-400">{r.status}</p>

          <div className="mt-2 flex gap-3">
            <button
              onClick={() => updateStatus(r._id, "approved")}
              className="text-green-400"
            >
              Approve
            </button>

            <button
              onClick={() => updateStatus(r._id, "rejected")}
              className="text-red-400"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Rooms;
