import Room from "./room.model.js";

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

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // ✅ new uploaded images
    let newImages = room.images;

    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => file.path);
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      {
        ...req.body,
        images: newImages,
      },
      { new: true }
    );

    res.json({ message: "Room updated", room: updatedRoom });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};