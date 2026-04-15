import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  console.log("USER DATA:", user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <div className="text-center mt-10 text-yellow-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black px-4 py-10">
      <div className="max-w-2xl mx-auto bg-[#111] border border-yellow-400 rounded-xl p-6 shadow-lg">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">My Profile</h1>

        {/* User Info */}
        <div className="space-y-4 text-sm">
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Name</span>
            <span className="text-yellow-400 font-medium">{user.name}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Email</span>
            <span className="text-yellow-400">{user.email}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Role</span>
            <span className="text-yellow-400 capitalize">{user.role}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">User ID</span>
            <span className="text-yellow-400 text-xs">{user._id}</span>
          </div>
        </div>

        {/* Action Button */}
        <button className="mt-6 bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-300 transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
