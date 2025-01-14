const express = require("express");
const router = express.Router({mergeParams: true});
const wrapasync = require("../utils/wrapasync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isAuthor,isLogged} = require("../middleware.js");
const ReviewController=require("../controllers/reviews.js")




router.post("/" , validateReview,isLogged , wrapasync(ReviewController.new));

router.delete("/:reviewId",isLogged,isAuthor, wrapasync(ReviewController.delete));

module.exports = router;
