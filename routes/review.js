const express=require("express");
const router=express.Router({mergeParams:true}); //this will enable the router file to access parameters that are being pass through url and are being stopped at the app.js
const wrapAsync=require("../utils/WrapAsync");
// const ExpressError=require("../utils/ExpressError.js");
// const {listingSchema,reviewSchema}=require("../Schema.js");
// const Review=require('../Models/review.js');
// const Listing=require('../Models/Listing.js');
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");

//Requiring Controller for review
const reviewController=require("../controllers/reviews.js");

//POST Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//DELETE Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;