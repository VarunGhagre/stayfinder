import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    amount: {
      type: Number,
      required: true,
    },

      // 📅 CHECK-IN
    checkIn: {
      type: Date,
    },

    // 📅 CHECK-OUT
    checkOut: {
      type: Date,
    },

    // 👥 GUESTS
    guests: {
      type: Number,
      default: 1,
    },

    // 🏷 TOTAL DAYS
    totalDays: {
      type: Number,
      default: 0,
    },

    // 🎁 DISCOUNT
    discount: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paymentMethod: {
    type: String,
    enum: ["UPI", "CASH", "CARD"],
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    roomNumber: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);