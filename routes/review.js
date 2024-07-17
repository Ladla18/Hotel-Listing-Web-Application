const express = require("express"); 
const router = express.Router({mergeParams:true });
const wrapAsync = require("../utils/wrapAsync.js"); // Import a utility to wrap async functions and handle errors
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); 
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")



// Post Review
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReviews));
// delete review 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReviews))


module.exports = router;