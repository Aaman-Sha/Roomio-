//Here we are Restructuring the Routes for our "Listing" Model
//At first our server is crashing because it needs some of the 
const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/WrapAsync");
const ExpressError=require("../utils/ExpressError.js");
// const {listingSchema,reviewSchema}=require("../Schema.js");
const Listing=require('../Models/Listing.js');
// const passport = require("passport");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");

//Requiring Controller for listing
const listingController=require("../controllers/listings.js");  //it is being stored as an object

//Requiring Multer npm package that is used to collect files from our user through Forms
const multer=require('multer');

const {storage}=require("../cloudConfig.js");
// const upload=multer({dest:'upload/'}); //upload/ is a folder where it will store all the files that are going to be collected 
const upload=multer({storage});  //Now instead of storing the files and imgs to local memory it will store it to the Cloudinary storage

//By using the Controller method we can make or code compact

//Using Router.route to increase the compactness of our source code by group routes of same route under a single router.route
router.route("/")
    .get(wrapAsync(listingController.index))  //Index Routing
    .post(isLoggedIn ,validateListing, upload.single('listing[image]'), wrapAsync(listingController.createListing));  //Create Route
    // .post(upload.single('listing[image]'),(req,res)=>{  //temporary post route to check if the backend is understanding the file that are being passed to it
    //     res.send(req.file);
    // });
    //So now our backend can understand the file that is being send to it 

//Create & New Route
router.get("/new", isLoggedIn , listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))  //Show Route
    .put(isLoggedIn,isOwner, upload.single('listing[image]'), validateListing,wrapAsync(listingController.updateListing))  //Update Route
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));  //Delete Route

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))

module.exports=router;