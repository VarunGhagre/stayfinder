import express from "express";
import cors from "cors";
import userRoutes from "./modules/user/user.route.js";
import roomRoutes from "./modules/room/room.route.js";
import wishlistRoutes from "./modules/wishlist/wishlist.route.js";
import bookingRoutes from "./modules/booking/booking.route.js";
import reviewRoutes from "./modules/review/review.route.js";
import dashboardRoutes from "./modules/dashboard/dashboard.route.js";
import adminRoutes from "./modules/admin/admin.route.js";
import notificationRoutes from "./modules/notification/notification.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

export default app;