import { useEffect, useState } from "react";
import api from "../../api/axios";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    await api.delete(`/admin/users/${id}`);
    setUsers(users.filter((u) => u._id !== id));
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo || userInfo.role !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl mb-6">Users</h1>

      {users.map((u) => (
        <div
          key={u._id}
          className="bg-[#1E1E21] p-4 mb-3 rounded-lg flex justify-between"
        >
          <span>
            {u.name} ({u.role})
          </span>

          <button onClick={() => deleteUser(u._id)} className="text-red-400">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Users;
