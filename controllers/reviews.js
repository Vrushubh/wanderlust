const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.new=async (req,res)=>{
    let { listingId } = req.params;
    let listing = await Listing.findById(listingId);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    
    listing.review.push(newReview);

    await listing.save();
    await newReview.save();
    req.flash("success" , "New Review Added !");

    res.redirect(`/listings/${listingId}`);
};

module.exports.delete=async (req,res)=>{
    let {listingId , reviewId } = req.params;
    await Listing.findByIdAndUpdate(listingId,{$pull: {review : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review Deleted !");
    res.redirect(`/listings/${listingId}`); 
};