const ExpressError = require("./utils/ExpressError.js"); // Import a custom error class for handling errors
const { listingSchema,reviewSchema} = require("./schema.js"); 
const Listing = require("./models/listing.js")
const Review = require("./models/review.js")


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error","Please Login To Continue")
        res.redirect("/login")
    }
    next();
}

module.exports.saveRedirecUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body); // Validate request body against listingSchema
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(","); // Create error message from validation errors
        throw new ExpressError(400, errMsg); // Throw custom ExpressError with status 400 and error message
    } else {
        next(); // If no error, proceed to the next middleware or route handler
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body); // Validate request body against listingSchema
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(","); // Create error message from validation errors
        throw new ExpressError(400, errMsg); // Throw custom ExpressError with status 400 and error message
    } else {
        next(); // If no error, proceed to the next middleware or route handler
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review  = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review")
        return res.redirect(`/listings/${id}`);
    }
    next();
}