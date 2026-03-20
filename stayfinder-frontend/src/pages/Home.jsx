import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";


function Home() {
  const navigate = useNavigate();
  return (
    <Layout>
      {/* Hero Section */}
      <div className="h-[70vh] flex flex-col items-center justify-center px-4 bg-gradient-to-r from-red-50 to-orange-50">
        <button
  onClick={() => navigate("/rooms")}
  className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg"
>
  Explore Rooms
</button>
        <h1 className="text-3xl md:text-5xl font-bold text-center">
          Find Your Perfect PG
        </h1>

        <p className="text-gray-500 mt-3 text-sm md:text-lg text-center">
          Comfortable • Affordable • Verified
        </p>

        {/* Search */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-2 p-3 w-full md:w-[600px]">
          <input
            placeholder="City"
            className="w-full md:flex-1 px-3 py-2 outline-none"
          />

          <input
            placeholder="Budget"
            className="w-full md:w-32 px-3 py-2 outline-none"
          />

          <button className="bg-red-500 text-white px-6 py-2 rounded-full w-full md:w-auto">
            Search
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
