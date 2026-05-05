import express from "express";
import { registerUser, loginUser } from "./user.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import { updateUserProfile } from "./user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", protect, updateUserProfile);

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

export default router;