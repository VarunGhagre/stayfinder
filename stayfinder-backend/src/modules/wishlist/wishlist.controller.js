import Wishlist from "./wishlist.model.js";

import Room from "../room/room.model.js";

export const addToWishlist = async (req, res) => {
  try {

    // 1️⃣ Only users allowed
    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Only users can use wishlist",
      });
    }

    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 2️⃣ Owner cannot wishlist own room
    if (room.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot wishlist your own room",
      });
    }

    const existing = await Wishlist.findOne({
      user: req.user._id,
      room: req.params.roomId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Already in wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      user: req.user._id,
      room: req.params.roomId,
    });

    res.status(201).json(wishlist);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user._id })
      .populate("room");

    res.json(wishlist);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      user: req.user._id,
      room: req.params.roomId,
    });

    res.json({ message: "Removed from wishlist" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};