import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    mobile: "",
    country: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/users/register", form);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E0E0F] relative overflow-hidden text-white px-4">
      {/* Glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-[#C9973A]/20 rounded-full blur-3xl bottom-[-100px] right-[-100px]" />

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl space-y-5 animate-fadeIn"
      >
        <h2 className="text-xl md:text-2xl font-semibold text-center">
          Create Account
        </h2>

        {/* Inputs */}
        {[
          { placeholder: "Full Name", key: "name" },
          { placeholder: "Email", key: "email" },
          { placeholder: "Password", key: "password", type: "password" },
          { placeholder: "Mobile Number", key: "mobile" },
        ].map((field) => (
          <div className="inputBox" key={field.key}>
            <input
              type={field.type || "text"}
              required
              onChange={(e) =>
                setForm({ ...form, [field.key]: e.target.value })
              }
            />
            <span>{field.placeholder}</span>
          </div>
        ))}

        {/* Country */}
        <select
          className="inputSelect"
          required
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        >
          <option value="India" className="text-black">
            India
          </option>

          <option value="USA" className="text-black">
            USA
          </option>

          <option value="UK" className="text-black">
            UK
          </option>

          <option value="Canada" className="text-black">
            Canada
          </option>

          <option value="Australia" className="text-black">
            Australia
          </option>
        </select>

        {/* Role */}
        <select
          className="inputSelect"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user" className="text-black">
            User
          </option>

          <option value="owner" className="text-black">
            Owner
          </option>
        </select>

        {/* Button */}
        <button className="btn">Register</button>

        {/* 🔥 Login Link */}
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-[#C9973A] hover:underline">
            Login
          </Link>
        </p>
      </form>

      {/* CSS */}
      <style>{`
        .inputBox {
          position: relative;
        }

        .inputBox input {
          width: 100%;
          padding: 12px;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent;
          border-radius: 10px;
          outline: none;
          color: white;
        }

        .inputBox span {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: gray;
          pointer-events: none;
          transition: 0.3s;
        }

        .inputBox input:focus + span,
        .inputBox input:valid + span {
          top: -8px;
          font-size: 12px;
          color: #C9973A;
          background: #0E0E0F;
          padding: 0 5px;
        }

        .inputSelect {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          outline: none;
        }

        .btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: linear-gradient(135deg, #C9973A, #E8C97A);
          color: black;
          font-weight: 600;
          transition: 0.3s;
        }

        .btn:hover {
          transform: scale(1.05);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }
      `}</style>
    </div>
  );
}

export default Register;
