import express from "express";
import { addReview } from "./review.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:roomId", protect, addReview);

export default router;