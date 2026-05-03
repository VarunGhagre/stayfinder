import express from "express";
import {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  confirmBooking,
  assignRoomNumber,
  confirmPayment,
  cancelBooking,
  userPayment
} from "./booking.controller.js";

import { protect } from "../../middleware/authMiddleware.js";
import { authorizeRoles } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/:roomId", protect, createBooking);

router.get("/my", protect, getUserBookings);

router.get("/owner", protect, getOwnerBookings);

router.put("/:id/confirm", protect, confirmBooking);

router.put("/:id/assign-room", protect, assignRoomNumber);

router.put("/:id/pay", protect, userPayment);

router.put(
  "/:id/payment-confirm",
  protect,
  authorizeRoles("owner"),
  confirmPayment
);

router.put(
  "/:id/cancel",
  protect,
  cancelBooking
);

export default router;