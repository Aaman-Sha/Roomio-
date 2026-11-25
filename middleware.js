const Listing=require("./Models/Listing.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./Schema.js");
const Review = require("./Models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req.user);  //with the help of this we can say if the user is loggedIn or not
    if(!req.isAuthenticated()){  //if user is not logged in then don't allow user to create a listing
        req.session.redirectUrl=req.originalUrl;  //stroinhg Url inside the session
        req.flash("error","You must be logged in to create Listing!");
        return res.redirect("/login");
    }
    next();  //if the user is already logged in then pass it to next
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    else{
        res.locals.redirectUrl="/listings";
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are Not the Owner of this Listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are Not the Author of this Review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{  //Defining the Schema Validation here and then using it as a middleware
    let {error}=listingSchema.validate(req.body); //this will extract the error from the Schema Validation 
        if(error){ 
            let errMsg=error.details.map((el)=>el.message).join(",");  //Extracting error messages for each element and joining then by "," 
            throw new ExpressError(400,errMsg); //and then displaying them
        }
        next();
}

module.exports.validateReview=(req,res,next)=>{  //Defining the Schema Validation here and then using it as a middleware
    let {error}=reviewSchema.validate(req.body); //this will extract the error from the Schema Validation 
        if(error){ 
            let errMsg=error.details.map((el)=>el.message).join(",");  //Extracting error messages for each element and joining then by "," 
            throw new ExpressError(400,errMsg); //and then displaying them
        }
        next();
}

