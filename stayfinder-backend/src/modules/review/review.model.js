import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  },

  rating: {
    type: Number,
    min: 1,
    max: 5
  },

  comment: {
    type: String
  }

}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);