import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/my");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 🔹 Payment
  const handlePayment = async (id) => {
    try {
      await api.put(`/bookings/${id}/payment-confirm`, {
        method: "UPI",
      });
      alert("Payment successful 💳");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  // 🔹 Cancel booking
  const handleCancel = async (id) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      alert("Booking cancelled ❌");
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Status UI helper
  const getStatusColor = (status) => {
    if (status === "pending") return "orange";
    if (status === "confirmed") return "green";
    if (status === "cancelled") return "red";
    return "gray";
  };

  if (loading) return <h2 style={{ padding: 20 }}>Loading...</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        bookings.map((b) => (
          <div
            key={b._id}
            style={{
              border: "1px solid #ccc",
              padding: 15,
              marginBottom: 15,
              borderRadius: 10,
            }}
          >
            {/* Room Info */}
            <h2>{b.room?.title}</h2>
            <p>City: {b.room?.city}</p>
            <p>Price: ₹{b.room?.price}</p>

            {/* Status */}
            <p>
              Status:{" "}
              <span style={{ color: getStatusColor(b.bookingStatus) }}>
                {b.bookingStatus}
              </span>
            </p>

            <p>
              Payment:{" "}
              <span style={{ color: b.paymentStatus === "paid" ? "green" : "red" }}>
                {b.paymentStatus}
              </span>
            </p>

            {/* Buttons */}
            <div style={{ marginTop: 10 }}>
              {b.paymentStatus === "pending" && (
                <button
                  onClick={() => handlePayment(b._id)}
                  style={{
                    marginRight: 10,
                    padding: "8px 15px",
                    background: "green",
                    color: "white",
                    border: "none",
                    borderRadius: 5,
                  }}
                >
                  Pay Now 💳
                </button>
              )}

              {b.bookingStatus === "pending" && (
                <button
                  onClick={() => handleCancel(b._id)}
                  style={{
                    padding: "8px 15px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: 5,
                  }}
                >
                  Cancel ❌
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}