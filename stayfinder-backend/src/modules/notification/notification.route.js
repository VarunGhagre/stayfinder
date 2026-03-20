import express from "express";
import { getNotifications } from "./notification.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import { markAsRead } from "./notification.controller.js";
import { getUnreadCount } from "./notification.controller.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);
router.get("/unread-count", protect, getUnreadCount);

export default router;