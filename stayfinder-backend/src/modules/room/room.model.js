import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    title: String,
    city: String,
    price: Number,
    tokenAmount: Number,
    roomType: String,
    facilities: [String],
    foodAvailable: Boolean,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    images: [
      {
        type: String,
      },
    ],

    totalBeds: {
      type: Number,
      required: true,
    },

    availableBeds: {
      type: Number,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    category: {
      type: String,
      enum: ["PG", "Hostel", "Flat", "Villa", "Apartment"],
      default: "PG",
    },

    // availableBeds: Number,
  },
  { timestamps: true },
);

export default mongoose.model("Room", roomSchema);
