import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [method, setMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    setTimeout(async () => {
      try {
        await api.put(`/bookings/${id}/pay`, { method });
        alert("Payment Successful 🎉");
        navigate("/my-bookings");
      } catch (err) {
        console.error(err.response?.data);
        alert("Payment failed ❌");
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Secure Payment</h1>

        <div style={styles.methods}>
          <button
            style={method === "UPI" ? styles.active : styles.btn}
            onClick={() => setMethod("UPI")}
          >
            UPI
          </button>

          <button
            style={method === "CARD" ? styles.active : styles.btn}
            onClick={() => setMethod("CARD")}
          >
            Card
          </button>
        </div>

        <p style={{ margin: "20px 0" }}>
          Selected: <b>{method}</b>
        </p>

        <button
          onClick={handlePayment}
          disabled={loading}
          style={styles.payBtn}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#0f172a",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  card: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "12px",
    width: "300px",
    textAlign: "center",
  },
  methods: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginTop: "20px",
  },
  btn: {
    padding: "10px",
    background: "#334155",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },
  active: {
    padding: "10px",
    background: "#22c55e",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },
  payBtn: {
    background: "#22c55e",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    width: "100%",
    color: "white",
    cursor: "pointer",
  },
};