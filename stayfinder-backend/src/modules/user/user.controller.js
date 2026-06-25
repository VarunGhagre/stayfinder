import User from "./user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      role,
      mobile,
      country,

      // Owner Fields
      propertyName,
      propertyType,
      businessAddress,
      licenseNumber,
      ownerIdNumber,

    } = req.body;

    // Mobile + Country Validation
    if (!mobile || !country) {
      return res.status(400).json({
        message: "Mobile number and country are required",
      });
    }

    // Owner Validation
    if (role === "owner") {

      if (
        !propertyName ||
        !propertyType ||
        !businessAddress ||
        !licenseNumber ||
        !ownerIdNumber
      ) {
        return res.status(400).json({
          message: "All owner details are required",
        });
      }

    }

    // Check User Exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      mobile,
      country,

      // Owner Data
      propertyName,
      propertyType,
      businessAddress,
      licenseNumber,
      ownerIdNumber,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
      country: user.country,

      propertyName: user.propertyName,
      propertyType: user.propertyType,

      token: generateToken(
        user._id,
        user.role
      ),
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // send response
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ update fields
    user.name = req.body.name || user.name;
    user.mobile = req.body.mobile || user.mobile;
    user.country = req.body.country || user.country;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      mobile: updatedUser.mobile,
      country: updatedUser.country,
    });

  } catch (error) {
     console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};