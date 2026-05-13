import express from "express";
import { addReview } from "./review.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import { getRoomReviews } from "./review.controller.js";

const router = express.Router();

router.post("/:roomId", protect, addReview);

router.get("/:roomId", getRoomReviews);

export default router;