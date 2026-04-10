import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    const res = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    localStorage.setItem("userInfo", JSON.stringify(data));
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0E0E0F] text-white">
      <form onSubmit={handleSubmit} className="bg-[#1E1E21] p-6 rounded-xl w-80 space-y-4">

        <h2 className="text-xl text-center">Register</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 bg-transparent border"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 bg-transparent border"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-transparent border"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="w-full p-2 bg-transparent border"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>

        <button className="w-full bg-[#C9973A] py-2 text-black">
          Register
        </button>

      </form>
    </div>
  );
}

export default Register;