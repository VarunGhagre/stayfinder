import express from "express";
import {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  confirmBooking,
  assignRoomNumber,
  confirmPayment,
  cancelBooking,
  userPayment,
  clearMyBookings,
  deleteBooking,
  deleteOwnerBooking,
  clearOwnerBookings
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

router.delete("/clear", protect, clearMyBookings);

router.delete("/:id", protect, deleteBooking);

router.delete("/owner/:id", protect, deleteOwnerBooking);

router.delete("/owner/clear/all", protect, clearOwnerBookings);

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