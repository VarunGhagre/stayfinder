import Room from "../room/room.model.js";
import Booking from "../booking/booking.model.js";
import Review from "../review/review.model.js";

export const getOwnerDashboard = async (req, res) => {

  const ownerId = req.user._id;

  const rooms = await Room.find({ owner: ownerId });

  const totalRooms = rooms.length;

  const roomIds = rooms.map(room => room._id);

  const totalBookings = await Booking.countDocuments({
    room: { $in: roomIds }
  });

  const reviews = await Review.find({
    room: { $in: roomIds }
  });

  const avgRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) /
    (reviews.length || 1);

  const availableBeds = rooms.reduce(
  (acc, room) => acc + (room.availableBeds || 0),
  0
);

  res.json({
    totalRooms,
    totalBookings,
    availableBeds,
    averageRating: avgRating.toFixed(1)
  });

};