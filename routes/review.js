const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware");

// CREATE REVIEW
router.post("/", isLoggedIn, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const review = new Review(req.body.review);

  review.author = req.user._id;
  listing.reviews.push(review);

  await review.save();
  await listing.save();

  req.flash("success", "Review added!");
  res.redirect(`/listings/${listing._id}`);
});

// DELETE REVIEW (only author can delete)
router.delete("/:reviewId", isLoggedIn, async (req, res) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You cannot delete this review!");
    return res.redirect(`/listings/${id}`);
  }

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
});

module.exports = router;
