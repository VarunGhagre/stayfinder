import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Wishlist from "../pages/Wishlist";
import Profile from "../pages/Profile";
import AddRoom from "../pages/AddRoom";
import MyBookings from "../pages/MyBookings";
import PaymentPage from "../pages/PaymentPage";
import OwnerBookings from "../pages/OwnerBookings";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import Users from "../pages/Admin/Users";
import Rooms from "../pages/Admin/Rooms";

import RoomListing from "../pages/RoomListing";
import RoomDetails from "../pages/RoomDetails";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/rooms" element={<RoomListing />} />
      <Route path="/rooms/:id" element={<RoomDetails />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/add-room" element={<AddRoom />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/payment/:id" element={<PaymentPage />} />
      <Route path="/owner-bookings" element={<OwnerBookings />} />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/rooms" element={<Rooms />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default AppRoutes;
