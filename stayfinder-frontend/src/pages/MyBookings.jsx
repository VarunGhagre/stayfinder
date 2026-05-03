import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/my");
      setBookings(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 🔥 FIX 1: cancel me error handle karo
  const handleCancel = async (id) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      console.error("Cancel Error:", err);
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  const statusColor = (status) => {
    if (status === "pending") return "#facc15";
    if (status === "confirmed") return "#22c55e";
    return "#ef4444";
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Loading bookings...</h1>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Bookings</h1>

      {bookings.length === 0 ? (
        <p style={styles.empty}>No bookings yet</p>
      ) : (
        bookings.map((b, index) => (
          <div
            key={b._id}
            style={{
              ...styles.card,
              animation: `fadeInUp 0.5s ease forwards`,
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {/* LEFT */}
            <div>
              <h2 style={styles.roomTitle}>
                {b.room?.title || "Room not available"}
              </h2>

              <p style={styles.text}>{b.room?.city || "N/A"}</p>

              <p style={styles.price}>
                ₹{b.room?.price || 0}/month
              </p>
            </div>

            {/* RIGHT */}
            <div style={styles.right}>
              {/* Booking Status */}
              <span
                style={{
                  ...styles.badge,
                  background: statusColor(b.bookingStatus),
                }}
              >
                {b.bookingStatus}
              </span>

              {/* Payment Status */}
              <span
                style={{
                  ...styles.badge,
                  background:
                    b.paymentStatus === "paid" ? "#22c55e" : "#f87171",
                }}
              >
                {b.paymentStatus}
              </span>

              {/* 🔥 FIX 2: better UX messages */}
              {b.paymentStatus === "pending" && (
                <p style={styles.waiting}>Complete payment to proceed 💳</p>
              )}

              {b.bookingStatus === "pending" &&
                b.paymentStatus === "paid" && (
                  <p style={styles.waiting}>
                    Waiting for owner approval ⏳
                  </p>
                )}

              {b.bookingStatus === "confirmed" && (
                <p style={{ color: "#22c55e", fontSize: "12px" }}>
                  Booking Confirmed ✅
                </p>
              )}

              {/* BUTTONS */}
              <div style={styles.btnGroup}>
                {/* 🔥 FIX 3: disable Pay button if already paid */}
                {b.paymentStatus === "pending" && (
                  <button
                    style={styles.payBtn}
                    onClick={() => navigate(`/payment/${b._id}`)}
                  >
                    Pay Now
                  </button>
                )}

                {/* 🔥 FIX 4: cancel only when pending */}
                {b.bookingStatus === "pending" && (
                  <button
                    style={styles.cancelBtn}
                    onClick={() => handleCancel(b._id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {/* Animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
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

  title: {
    fontSize: "28px",
    marginBottom: "20px",
    fontWeight: "600",
  },

  empty: {
    color: "#94a3b8",
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.3s ease",
  },

  roomTitle: {
    fontSize: "18px",
    fontWeight: "600",
  },

  text: {
    color: "#94a3b8",
    marginTop: "5px",
  },

  price: {
    color: "#22c55e",
    marginTop: "5px",
    fontWeight: "500",
  },

  right: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
  },

  badge: {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    color: "black",
    fontWeight: "600",
  },

  waiting: {
    fontSize: "12px",
    color: "#facc15",
  },

  btnGroup: {
    display: "flex",
    gap: "8px",
    marginTop: "5px",
  },

  payBtn: {
    background: "#22c55e",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },

  cancelBtn: {
    background: "#ef4444",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
};