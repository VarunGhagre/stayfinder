import { useEffect, useState } from "react";
import api from "../api/axios";

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await api.get("/bookings/owner");
    setBookings(res.data.filter(b => b.room !== null));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleConfirm = async (id) => {
    try {
      await api.put(`/bookings/${id}/confirm`);
      alert("Booking confirmed ✅");
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Owner Dashboard</h1>

      {bookings.map((b) => (
        <div key={b._id} style={styles.card}>
          <h3>{b.room.title}</h3>
          <p>User: {b.user?.name}</p>

          <p>Status: {b.bookingStatus}</p>
          <p>Payment: {b.paymentStatus}</p>

          {/* 🔥 APPROVAL BUTTON */}
          {b.bookingStatus === "pending" && b.paymentStatus === "paid" && (
            <button style={styles.confirmBtn} onClick={() => handleConfirm(b._id)}>
              Approve Booking ✅
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    background: "#0f172a",
    minHeight: "100vh",
    padding: "30px",
    color: "white",
  },
  card: {
    background: "#1e293b",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "10px",
  },
  confirmBtn: {
    marginTop: "10px",
    background: "#22c55e",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
};