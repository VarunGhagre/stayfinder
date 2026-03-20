import express from "express";
import { getOwnerDashboard } from "./dashboard.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import { authorizeRoles } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/owner",
  protect,
  authorizeRoles("owner"),
  getOwnerDashboard
);

export default router;