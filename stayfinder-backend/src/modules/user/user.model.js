import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["user", "owner", "admin"],
    default: "user",
  },

   mobile: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    enum: ["India", "USA", "UK", "Canada", "Australia"], // 👈 options
    required: true,
  },
  
});

export default mongoose.model("User", userSchema);