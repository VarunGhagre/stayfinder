import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
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
    <div className="flex justify-center items-center min-h-screen bg-[#0E0E0F] text-white">
      <form onSubmit={handleSubmit} className="bg-[#1E1E21] p-6 rounded-xl w-80 space-y-4">

        <h2 className="text-center text-xl">Register</h2>

        <input placeholder="Name" className="w-full p-2 border bg-transparent"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input placeholder="Email" className="w-full p-2 border bg-transparent"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <input type="password" placeholder="Password"
          className="w-full p-2 border bg-transparent"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />

        {/* 🔥 ROLE SELECT */}
        <select
          className="w-full p-2 border bg-transparent"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user" className="text-black">User (Book Rooms)</option>
          <option value="owner" className="text-black">Owner (Add Rooms)</option>
          <option value="owner" className="text-black">Admin</option>
        </select>

        <button className="w-full bg-[#C9973A] py-2 text-black">
          Register
        </button>

      </form>
    </div>
  );
}

export default Register;