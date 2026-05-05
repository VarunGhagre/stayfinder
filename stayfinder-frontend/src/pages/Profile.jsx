import { useEffect, useState } from "react";
import api from "../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    country: "",
  });

  // 🔹 Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/users/profile");
        setUser(data);

        setForm({
          name: data.name || "",
          mobile: data.mobile || "",
          country: data.country || "",
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 Update Profile
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const { data } = await api.put("/users/profile", form);

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));

      setEditMode(false);
      alert("Profile updated ✅");

    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E0E0F]">
        <p className="text-[#C9973A] animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-[#0E0E0F] text-white">
      <div className="max-w-2xl mx-auto bg-[#1E1E21] border border-[#C9973A33] rounded-2xl p-8 shadow-xl">

        {/* Heading */}
        <h1 className="text-3xl text-[#C9973A] text-center mb-6">
          My Profile
        </h1>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8A6520] to-[#C9973A] flex items-center justify-center text-2xl font-bold text-black">
            {user.name?.[0]?.toUpperCase()}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4 text-sm">

          {/* Name */}
          <div className="flex justify-between items-center border-b border-[#C9973A22] pb-2">
            <span className="text-[#A09480]">Name</span>

            {editMode ? (
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="bg-transparent border px-2 rounded text-white"
              />
            ) : (
              <span>{user.name}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex justify-between border-b border-[#C9973A22] pb-2">
            <span className="text-[#A09480]">Email</span>
            <span>{user.email}</span>
          </div>

          {/* Mobile */}
          <div className="flex justify-between items-center border-b border-[#C9973A22] pb-2">
            <span className="text-[#A09480]">Mobile</span>

            {editMode ? (
              <input
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
                className="bg-transparent border px-2 rounded text-white"
              />
            ) : (
              <span>{user.mobile || "N/A"}</span>
            )}
          </div>

          {/* Country */}
          <div className="flex justify-between items-center border-b border-[#C9973A22] pb-2">
            <span className="text-[#A09480]">Country</span>

            {editMode ? (
              <select
                value={form.country}
                onChange={(e) =>
                  setForm({ ...form, country: e.target.value })
                }
                className="bg-[#1E1E21] border px-2 rounded text-white"
              >
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
              </select>
            ) : (
              <span>{user.country || "N/A"}</span>
            )}
          </div>

          {/* Role */}
          <div className="flex justify-between border-b border-[#C9973A22] pb-2">
            <span className="text-[#A09480]">Role</span>
            <span className="text-[#C9973A] capitalize">
              {user.role}
            </span>
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="w-full py-2 rounded bg-[#C9973A] text-black font-semibold hover:scale-105 transition"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full py-2 rounded bg-green-500 font-semibold"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="w-full py-2 rounded bg-gray-500"
              >
                Cancel
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
};

export default Profile;