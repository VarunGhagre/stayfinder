import Booking from "./booking.model.js";
import Room from "../room/room.model.js";
import Notification from "../notification/notification.model.js";
console.log("CREATE BOOKING API HIT");

export const createBooking = async (req, res) => {
  try {
    // 🔴 duplicate booking check
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      room: req.params.roomId,
      bookingStatus: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "You already booked this room",
      });
    }

    // 🟢 atomic bed update
    const room = await Room.findOneAndUpdate(
      {
        _id: req.params.roomId,
        availableBeds: { $gt: 0 },
      },
      {
        $inc: { availableBeds: -1 },
      },
      { new: true }
    );

    if (!room) {
      return res.status(400).json({ message: "Room full" });
    }

    // 🟢 create booking
    const booking = await Booking.create({
      user: req.user._id,
      room: room._id,
      amount: room.tokenAmount,
      paymentStatus: "pending",
      bookingStatus: "pending",
    });

    res.status(201).json({
      message: "Booking request created",
      booking,
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

export const userPayment = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!booking.user) {
      return res.status(400).json({ message: "Booking user missing" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ correct logic
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ message: "Already paid" });
    }

    booking.paymentStatus = "paid";   // 🔥 ye missing tha
    booking.paymentMethod = req.body.method || "UPI";

    await booking.save();

    res.json({ message: "Payment successful" });

  } catch (error) {
    console.error("PAYMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};