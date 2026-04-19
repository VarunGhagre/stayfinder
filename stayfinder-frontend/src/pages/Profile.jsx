import { useEffect, useState } from "react";
import api from "../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/users/profile");
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E0E0F]">
        <p className="text-[#C9973A] animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-12 text-white"
      style={{
        background:
          "linear-gradient(180deg, #0E0E0F 0%, #121214 50%, #0E0E0F 100%)",
      }}
    >
      {/* Container */}
      <div className="max-w-2xl mx-auto bg-[#1E1E21] border border-[rgba(201,151,58,0.2)] rounded-2xl p-8 shadow-xl">

        {/* Heading */}
        <h1 className="text-3xl font-semibold text-[#C9973A] mb-8 text-center">
          My Profile
        </h1>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{
              background: "linear-gradient(135deg,#8A6520,#C9973A)",
              color: "#0E0E0F",
            }}
          >
            {user.name?.[0]?.toUpperCase()}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4 text-sm">

          <div className="flex justify-between border-b border-[rgba(201,151,58,0.1)] pb-2">
            <span className="text-[#A09480]">Name</span>
            <span className="text-[#F2EDE6] font-medium">{user.name}</span>
          </div>

          <div className="flex justify-between border-b border-[rgba(201,151,58,0.1)] pb-2">
            <span className="text-[#A09480]">Email</span>
            <span className="text-[#F2EDE6]">{user.email}</span>
          </div>

          <div className="flex justify-between border-b border-[rgba(201,151,58,0.1)] pb-2">
            <span className="text-[#A09480]">Role</span>
            <span className="text-[#C9973A] capitalize font-semibold">
              {user.role}
            </span>
          </div>

          <div className="flex justify-between border-b border-[rgba(201,151,58,0.1)] pb-2">
            <span className="text-[#A09480]">User ID</span>
            <span className="text-[#5C5448] text-xs">{user._id}</span>
          </div>

        </div>

        {/* Button */}
        <button
          className="mt-8 w-full py-2 rounded-lg font-semibold transition"
          style={{
            background: "#C9973A",
            color: "#0E0E0F",
          }}
        >
          Edit Profile
        </button>

      </div>
    </div>
  );
};

export default Profile;