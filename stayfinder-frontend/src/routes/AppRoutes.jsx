import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import RoomListing from "../pages/RoomListing";
import RoomDetails from "../pages/RoomDetails";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rooms" element={<RoomListing />} />
      <Route path="/rooms/:id" element={<RoomDetails />} />
    </Routes>
  );
}

export default AppRoutes;