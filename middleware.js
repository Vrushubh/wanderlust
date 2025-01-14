const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema } = require("./schema.js");

module.exports.isLogged =(req,res,next)=> {
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error" , "You Must be LoggedIn");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if( !res.logi && !listing.owner._id.equals(res.locals.logi._id)){
        req.flash("error","You are Not Owner");
        res.redirect(`/listings/${id}`);
    }
    next();
}



module.exports.validateListing = (req,res,next) =>{
    let error = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); // Use destructuring to extract `error`
    if (error) {
        // Map error details to a readable error message
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(errMsg, 400); // Pass a human-readable message and status code
    } else {
        next(); // Proceed to the next middleware or route handler
    }
};

module.exports.isAuthor=async(req,res,next)=>{
    let {listingId,reviewId}=req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.logi._id)){
        req.flash("error","You are Not Owner of this Review");
        return res.redirect(`/listings/${listingId}`);
    }
    next();
}