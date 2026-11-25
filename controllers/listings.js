const Listing=require("../Models/Listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    let allListings=await Listing.find();
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{   //now passing the function as a middleware in our new route
    // console.log(req.user);  //this will show all the informations related to the user if user logins
    //this req.user will triggers if the user is logged in or not if not then it doesn't allow user to create listings
    // if(!req.isAuthenticated()){  //if user is not logged in then don't allow user to create a listing  //we are shifting this as a middleware in middleware.js 
    //     req.flash("error","You must be logged in to create Listing!");
    //     return res.redirect("/login");
    // }
    res.render("listings/new.ejs");    //have to write this before our Show route because node is taking new as id instead of a route
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate(
        {  //Populating author for each review from review array in the listing
            path:"reviews",
            populate:{
                path:"author"
            }
        }
    ).populate("owner");
    // console.log(listing);
    if(!listing){
        req.flash("error","Listing you requested for does not exists");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing=async(req,res,next)=>{
    let response=await geocodingClient
    .forwardGeocode({
    query: req.body.listing.location,
    limit: 1
    })
    .send();

    // console.log(response.body.features[0].geometry); //through this we are able to access the coordinates for our required location
    // res.send("Done!");

    let url=req.file.path;
    let filename=req.file.filename;
    let newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename}; //adding url and filename to the image 

    newListing.geometry=response.body.features[0].geometry;  //this will add the coordinates that are accuqired from the response

    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing is Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exists");
        return res.redirect("/listings");
    }

    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing=async(req,res)=>{
    if(!req.body.listing){  //if this is empty then it will throw an error
            throw new ExpressError(400,"Send Valid Data for Listing")  //this is what it will throw
        } 
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing is Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}