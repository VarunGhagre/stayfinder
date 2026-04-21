import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function AddRoom() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    city: "",
    description: "",
    totalBeds: "",
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // fields append
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      // images append
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      await api.post("/rooms/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Room Added Successfully ✅");
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div
      className="min-h-screen px-6 py-12 text-white"
      style={{
        background:
          "linear-gradient(180deg, #0E0E0F 0%, #121214 50%, #0E0E0F 100%)",
      }}
    >
      <div className="max-w-xl mx-auto bg-[#1E1E21] p-6 rounded-2xl border border-[rgba(201,151,58,0.2)] shadow-xl">

        <h1 className="text-2xl text-[#C9973A] mb-6">
          Add New Room
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="title"
            placeholder="Room Title"
            onChange={handleChange}
            className="w-full bg-[#26262A] p-3 rounded outline-none"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            className="w-full bg-[#26262A] p-3 rounded outline-none"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
            className="w-full bg-[#26262A] p-3 rounded outline-none"
          />

          <input
            type="number"
            name="totalBeds"
            placeholder="Total Beds"
            onChange={handleChange}
            className="w-full bg-[#26262A] p-3 rounded outline-none"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full bg-[#26262A] p-3 rounded outline-none"
          />

          {/* IMAGE UPLOAD */}
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full text-sm text-gray-400"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold transition"
            style={{
              background: "#C9973A",
              color: "#0E0E0F",
            }}
          >
            Add Room
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddRoom;