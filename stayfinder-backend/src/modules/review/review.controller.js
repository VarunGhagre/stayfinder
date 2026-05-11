import Review from "./review.model.js";
import Booking from "../booking/booking.model.js";
import Room from "../room/room.model.js";

export const addReview = async (req, res) => {
  try {

    // ✅ check booking exists
    const booking = await Booking.findOne({
      user: req.user._id,
      room: req.params.roomId,
      bookingStatus: "confirmed",
    });

    if (!booking) {
      return res.status(400).json({
        message:
          "You can review only booked rooms",
      });
    }

    // ✅ prevent duplicate review
    const alreadyReviewed =
      await Review.findOne({
        user: req.user._id,
        room: req.params.roomId,
      });

    if (alreadyReviewed) {
      return res.status(400).json({
        message:
          "You already reviewed this room",
      });
    }

    // ✅ create review
    const review = await Review.create({
      user: req.user._id,
      room: req.params.roomId,

      rating: req.body.rating,
      comment: req.body.comment,
    });

    // ✅ calculate average rating
    const reviews = await Review.find({
      room: req.params.roomId,
    });

    const avgRating =
      reviews.reduce(
        (acc, item) => acc + item.rating,
        0
      ) / reviews.length;

    // ✅ update room rating
    await Room.findByIdAndUpdate(
      req.params.roomId,
      {
        rating: avgRating.toFixed(1),
      }
    );

    res.status(201).json(review);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

export const getRoomReviews = async (
  req,
  res
) => {

  try {

    const reviews = await Review.find({
      room: req.params.roomId,
    }).populate("user", "name");

    res.json(reviews);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};