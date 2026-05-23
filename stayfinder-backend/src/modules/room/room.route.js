import express from "express";
import {
  addRoom,
  getRooms,
  approveRoom,
  getPendingRooms,
  getRoomById,
  updateRoom,
  deleteRoom
} from "./room.controller.js";

import { protect } from "../../middleware/authMiddleware.js";
import { authorizeRoles } from "../../middleware/roleMiddleware.js";
import { upload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/add",
  protect,
  authorizeRoles("owner"),
  upload.array("images", 5),
  addRoom
);

router.get("/", getRooms);

router.get("/pending", protect, authorizeRoles("admin"), getPendingRooms);

router.put("/approve/:id", protect, authorizeRoles("admin"), approveRoom);

router.put(
  "/update/:id",
  upload.array("images", 5),
  updateRoom
);

router.get("/:id", getRoomById);

router.delete("/:id", protect, deleteRoom);

export default router;