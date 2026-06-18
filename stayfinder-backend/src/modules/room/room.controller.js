import Room from "./room.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Booking from "../booking/booking.model.js";
import Review from "../review/review.model.js";

const uploadToCloudinary = async (filePath, folder = "stayfinder/rooms") => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "image",
  });
  // Delete temp file from server after upload
  fs.unlink(filePath, () => {});
  return result.secure_url;
};

export const addRoom = async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => file.path) : [];
    
    const room = await Room.create({
      ...req.body,
      images,
      totalBeds: req.body.totalBeds,
      availableBeds: req.body.totalBeds,
      owner: req.user._id
    });

    res.status(201).json({
      message: "Room added successfully",
      room
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, keyword, city, maxPrice } = req.query;

    let filter = {};

    if (city) {
      filter.city = city;
    }

    if (maxPrice) {
      filter.price = { $lte: Number(maxPrice) };
    }

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { city: { $regex: keyword, $options: "i" } }
      ];
    }

    // pagination
    const skip = (page - 1) * limit;

    let query = Room.find(filter);

    // sorting
    if (sort) {
      query = query.sort(sort);
    }

    const rooms = await query
      .skip(skip)
      .limit(Number(limit))
      .populate("owner", "name email");

    const totalRooms = await Room.countDocuments(filter);

    res.json({
      totalRooms,
      currentPage: Number(page),
      totalPages: Math.ceil(totalRooms / limit),
      rooms,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const approveRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.status = "approved";
    await room.save();

    res.json({ message: "Room approved successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: "pending" });

    res.json(rooms);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
 
    // Find room
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
 
    // ── STEP 1: Get category from request ───────────────────
    // Frontend sends: formData.append("category", "PG")
    // Valid values: "room" | "building" | "amenities" | "location"
    const category = req.body.category || "room";
 
    const validCategories = ["room", "building", "amenities", "location"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: `Invalid category. Must be one of: ${validCategories.join(", ")}`,
      });
    }
 
    // ── STEP 2: Process new uploaded images ─────────────────
    let newImageUrls = [];
 
    if (req.files && req.files.length > 0) {
      // Upload each file to Cloudinary
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.path, `stayfinder/rooms/${category}`)
      );
      newImageUrls = await Promise.all(uploadPromises);
    }
 
    // ── STEP 3: Get existing imagesByCategory ───────────────
    // Support both old format (room.images) and new format (room.imagesByCategory)
    const existing = room.imagesByCategory || {
      room:      room.images || [],
      building:  room.buildingImages  || [],
      amenities: room.amenityImages   || [],
      location:  room.locationImages  || [],
    };
 
    // ── STEP 4: APPEND new images to the correct category ───
    // ✅ This NEVER deletes old images — only adds new ones
    const updatedCategory = [
      ...existing[category],   // keep ALL old images
      ...newImageUrls,          // add new ones at the end
    ];
 
    const updatedImagesByCategory = {
      ...existing,
      [category]: updatedCategory,
    };
 
    // ── STEP 5: Build update object ─────────────────────────
    // Remove fields that should not be directly updated
    const { category: _, images: __, ...otherFields } = req.body;
 
    const updateData = {
      ...otherFields,                           // title, price, description etc.
      imagesByCategory: updatedImagesByCategory, // updated category images
      images: updatedImagesByCategory.room,      // backward compat: keep room.images in sync
    };
 
    // ── STEP 6: Save to DB ──────────────────────────────────
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
 
    res.status(200).json({
      message: `${category} images updated successfully`,
      room: updatedRoom,
      // Return counts for debugging
      imageCounts: {
        room:      updatedRoom.imagesByCategory?.room?.length      || 0,
        building:  updatedRoom.imagesByCategory?.building?.length  || 0,
        amenities: updatedRoom.imagesByCategory?.amenities?.length || 0,
        location:  updatedRoom.imagesByCategory?.location?.length  || 0,
      },
    });
 
  } catch (error) {
    console.error("updateRoom error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteRoom = async (
  req,
  res
) => {

  try {

    const room = await Room.findById(
      req.params.id
    );

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    // ✅ owner check
    if (
      room.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // ✅ delete related bookings
    await Booking.deleteMany({
      room: room._id,
    });

    // ✅ delete related reviews
    await Review.deleteMany({
      room: room._id,
    });

    // ✅ delete room
    await room.deleteOne();

    res.json({
      message: "Room deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};