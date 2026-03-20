import Review from "./review.model.js";

export const addReview = async (req, res) => {

  try {

    const review = await Review.create({
      user: req.user._id,
      room: req.params.roomId,
      rating: req.body.rating,
      comment: req.body.comment
    });

    res.status(201).json(review);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};