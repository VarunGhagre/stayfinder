import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
  },

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
    enum: [
      "India",
      "USA",
      "UK",
      "Canada",
      "Australia",
    ],
    required: true,
  },

  // ======================
  // OWNER DETAILS
  // ======================

  propertyName: {
    type: String,
  },

  propertyType: {
    type: String,
    enum: [
      "Hotel",
      "Resort",
      "PG",
      "Hostel",
      "Apartment",
    ],
  },

  businessAddress: {
    type: String,
  },

  licenseNumber: {
    type: String,
  },

  ownerIdNumber: {
    type: String,
  },

  ownerStatus: {
  type: String,
  enum: [
    "pending",
    "approved",
    "rejected"
  ],
  default: "pending"
},

isEmailVerified: {
  type: Boolean,
  default: false
},

isMobileVerified: {
  type: Boolean,
  default: false
},

});

export default mongoose.model(
  "User",
  userSchema
);