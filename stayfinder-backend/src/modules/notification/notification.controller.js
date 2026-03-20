import Notification from "./notification.model.js";

export const getNotifications = async (req, res) => {

  const notifications = await Notification.find({
    user: req.user._id
  }).sort({ createdAt: -1 });

   console.log("Notifications Found:", notifications.length); 

  res.json(notifications);

};

export const markAsRead = async (req, res) => {

  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  notification.isRead = true;

  await notification.save();

  res.json({ message: "Notification marked as read" });

};

export const getUnreadCount = async (req, res) => {

  const count = await Notification.countDocuments({
    user: req.user._id,
    isRead: false
  });

  res.json({ unread: count });

};