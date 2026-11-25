const Listing=require("../Models/Listing.js");
const Review=require("../Models/review.js");

module.exports.createReview=async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id; //Saving the author of this review which is posted

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","New Review is Created!");
    console.log("New Review Saved");
    // res.send("New Review Saved");
    res.redirect(`/listings/${listing.id}`);
}

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); //this will remove the specific review from the reviews array which is inside the Listing
    await Review.findByIdAndDelete(reviewId); //This will remove the review from the Review only

    req.flash("success","Review is Deleted");

    res.redirect(`/${id}`);
}