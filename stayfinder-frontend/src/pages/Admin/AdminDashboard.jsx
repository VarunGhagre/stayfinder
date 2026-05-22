import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const cards = [
    { title: "Users", path: "/admin/users" },
    { title: "Rooms", path: "/admin/rooms" },
    { title: "Bookings", path: "/admin/bookings" },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0F] text-white p-10">
      <h1 className="text-3xl mb-10 text-[#C9973A]">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            className="bg-[#1E1E21] p-6 rounded-xl cursor-pointer hover:scale-105 transition"
          >
            <h2 className="text-xl">{card.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
