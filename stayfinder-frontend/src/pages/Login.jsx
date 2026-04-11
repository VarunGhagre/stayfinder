import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="flex justify-center items-center min-h-screen bg-[#0E0E0F] text-white">
      <form onSubmit={handleLogin} className="bg-[#1E1E21] p-6 rounded-xl w-80 space-y-4">

        <h2 className="text-center text-xl">Login</h2>

        <input placeholder="Email" className="w-full p-2 border bg-transparent"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <input type="password" placeholder="Password"
          className="w-full p-2 border bg-transparent"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button className="w-full bg-[#C9973A] py-2 text-black">
          Login
        </button>

      </form>
    </div>
  );
}

export default Login;