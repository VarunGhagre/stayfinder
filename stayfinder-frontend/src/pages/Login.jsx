import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/users/login", form);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="main">

      {/* FORM */}
      <form onSubmit={handleLogin} className="card">

        <h2>LOGIN</h2>

        <label>Email address</label>
        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <div className="row">
          <span>Forgot password?</span>
        </div>

        <button>SIGN IN</button>

        {/* 🔥 Register Link */}
        <p className="registerText">
          Don’t have an account?{" "}
          <Link to="/register" className="registerLink">
            Register
          </Link>
        </p>

      </form>

      {/* CSS */}
      <style>{`
        .main {
          width: 100%;
          min-height: 100vh;
          background: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
          color: white;
        }

      

        /* CARD */
        .card {
          width: 100%;
          max-width: 420px;
          padding: 35px;
          border-radius: 25px;

          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(25px);

          border: 1.5px solid rgba(255, 215, 0, 0.4);
          box-shadow:
            0 0 30px rgba(255, 215, 0, 0.15),
            inset 0 0 20px rgba(255, 215, 0, 0.1);

          z-index: 2;
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #e7c47b;
          letter-spacing: 2px;
        }

        label {
          font-size: 13px;
          color: #aaa;
        }

        input {
          width: 100%;
          padding: 12px;
          margin: 6px 0 15px;
          border-radius: 10px;
          border: none;
          outline: none;
          background: rgba(255,255,255,0.08);
          color: white;
        }

        .row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 20px;
          color: #bbb;
        }

        button {
          width: 100%;
          padding: 12px;
          border-radius: 25px;
          border: none;
          background: linear-gradient(135deg, #e7c47b, #a66a2f);
          color: black;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }

        button:hover {
          transform: scale(1.05);
        }

        .registerText {
          text-align: center;
          margin-top: 15px;
          font-size: 13px;
          color: #aaa;
        }

        .registerLink {
          color: #e7c47b;
          text-decoration: none;
        }

        .registerLink:hover {
          text-decoration: underline;
        }

        /* MOBILE */
        @media (max-width: 600px) {
          .card {
            width: 90%;
            padding: 25px;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;