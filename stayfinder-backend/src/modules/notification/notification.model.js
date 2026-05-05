import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  message: String,

  isRead: {
    type: Boolean,
    default: false
  },

    createdAt: {
    type: Date,
    default: Date.now,
    expires: 60, // 🔥 24 hours
  },

}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);