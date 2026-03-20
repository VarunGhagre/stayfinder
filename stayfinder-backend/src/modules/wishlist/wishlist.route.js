import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "./wishlist.controller.js";

import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:roomId", protect, addToWishlist);

router.get("/", protect, getWishlist);

router.delete("/:roomId", protect, removeFromWishlist);

export default router;