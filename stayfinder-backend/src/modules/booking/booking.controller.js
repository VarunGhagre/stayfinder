import Booking from "./booking.model.js";
import Room from "../room/room.model.js";
import Notification from "../notification/notification.model.js";
console.log("CREATE BOOKING API HIT");

export const createBooking = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.availableBeds <= 0) {
      return res.status(400).json({ message: "Room full" });
    }

    // ❌ beds yaha decrease nahi karna

    const booking = await Booking.create({
      user: req.user._id,
      room: room._id,
      amount: room.tokenAmount,
      paymentStatus: "pending",
      bookingStatus: "pending",   // 👈 IMPORTANT
    });

    res.status(201).json({
  message: "Booking request created",
  booking
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({
    user: req.user._id,
  }).populate("room");

  res.json(bookings);
};

export const getOwnerBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate({
      path: "room",
      match: { owner: req.user._id },
    })
    .populate("user");

  res.json(bookings);
};

export const confirmBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  const room = await Room.findById(booking.room);

  if (room.availableBeds <= 0) {
    return res.status(400).json({ message: "No beds available" });
  }

  // ✅ yaha decrease karo
  room.availableBeds -= 1;
  await Room.findByIdAndUpdate(room._id, {
    $inc: { availableBeds: -1 }
  });

  booking.bookingStatus = "confirmed";
  await booking.save();

  res.json({ message: "Booking confirmed" });
};

export const assignRoomNumber = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  booking.roomNumber = req.body.roomNumber;
  booking.bookingStatus = "confirmed";

  await booking.save();

  res.json({ message: "Room assigned successfully" });
};


export const confirmPayment = async (req, res) => {

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  booking.paymentStatus = "paid";
  booking.paymentMethod = req.body.method;

  await booking.save();

  res.json({ message: "Payment confirmed" });

};

export const cancelBooking = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.bookingStatus = "cancelled";
    await booking.save();

    await Room.findByIdAndUpdate(
      booking.room,
      { $inc: { availableBeds: 1 } }
    );

    res.json({ message: "Booking cancelled successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};