import User from "../user/user.model.js";
import Room from "../room/room.model.js";
import Booking from "../booking/booking.model.js";
import Review from "../review/review.model.js";

export const getAdminDashboard = async (req, res) => {

  const totalUsers = await User.countDocuments({ role: "user" });

  const totalOwners = await User.countDocuments({ role: "owner" });

  const totalRooms = await Room.countDocuments();

  const pendingRooms = await Room.countDocuments({ status: "pending" });

  const totalBookings = await Booking.countDocuments();

  const totalReviews = await Review.countDocuments();

  res.json({
    totalUsers,
    totalOwners,
    totalRooms,
    pendingRooms,
    totalBookings,
    totalReviews
  });

};