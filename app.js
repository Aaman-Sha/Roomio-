if(process.env.NODE_ENV!='production'){  
    require('dotenv').config()  //required the dotenv npm package to our server
    // or import 'dotenv/config' // for esm
}

const express=require('express');
const port=8080;
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require("ejs-mate");
// const wrapAsync=require("./utils/WrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema}=require("./Schema.js");
const session=require("express-session");
const MongoStore=require('connect-mongo').default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./Models/user.js");

const app=express();

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);  //here we are using the ejs-mate
app.use(express.static(path.join(__dirname,"public")));

// const Listing=require('./Models/Listing.js');
// const Review=require('./Models/review.js');

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


const dbUrl=process.env.ATLASDB_URL;

main()
.then(res=>{
    console.log("Server is connected to DB");
})
.catch(err => {
    console.log(err);
});

async function main() {
  await mongoose.connect(dbUrl);
}

// console.log(MongoStore);
// console.log(typeof MongoStore.create);

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{  //it is recommended to use encryption when handling sensitive data
        secret:process.env.SECRET,
    },
    touchAfter:24*3600, //updating or refreshing the website after a particular interval when no interaction is done with website when the user is loggedIn
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});

//Sessions and Cookies
const sessionOptions={
    store:store, //it itself knows which store we are working with
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,  //this expiry duration is for a single(1) week
        maxAge:1000*60*60*24*7,
        httpOnly:true, //This is a default setting that we have done, Thi is done for SECURITY purpose 
        //to prevent crossScripting attacks
    }
};


// app.get("/",(req,res)=>{
//     res.send("Hi i am root!");
// });
app.use(session(sessionOptions)); //using Session
app.use(flash());  //Always use the flash and all before the routes

//We should always write our passport sessions under the web session because it should be under the web-session
app.use(passport.initialize()); //To use passport session we first have to initialize it 
app.use(passport.session());  //and then use it 
passport.use(new LocalStrategy(User.authenticate()));  //Use static method of model in LocalStrategy

passport.serializeUser(User.serializeUser()); //Used to serialize users into the sessions
passport.deserializeUser(User.deserializeUser());  //Used to deserialize users into the sessions
//Using passport makes the authentication process more easy because by using it we don't have to write the logic for authentication by scratch

app.use((req,res,next)=>{
    //We use these res.locals because we can not use the reqs in our ejs
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

//writing a route to add a DemoUser to check if it is working properly or not
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"ComputerScience-Student"  //You might have noticed that we haven't define the username or password but we are passing it 
//         //Because the passport is defining them for us
//     })
//     let registeredUser= await User.register(fakeUser,"helloworld");  //This is used to save and it is also storing the value in a variable
//     res.send(registeredUser);
// });

app.use("/",userRouter); //This is a router for Signup and login


//All logic will start from here

//ROUTINGS

//Checking if the server is working properly or not
// app.get("/",(req,res)=>{
//     res.send("Working");
// });

//Trying to insert a single data
// app.get("/testlistings",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new Villa",
//         description:"By the Beach",
//         price:1299,
//         location:"Chalanguate,Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("Sample data was saved");
//     res.send("Successful testing");
// });

// const validateListing=()=>{  //Defining the Schema Validation here and then using it as a middleware
//     let {error}=listingSchema.validate(req.body); //this will extract the error from the Schema Validation 
//         if(error){ 
//             let errMsg=error.details.map((el)=>el.message).join(",");  //Extracting error messages for each element and joining then by "," 
//             throw new ExpressError(400,errMsg); //and then displaying them
//         }
// }

// const validateReview=(req,res,next)=>{  //Defining the Schema Validation here and then using it as a middleware
//     let {error}=reviewSchema.validate(req.body); //this will extract the error from the Schema Validation 
//         if(error){ 
//             let errMsg=error.details.map((el)=>el.message).join(",");  //Extracting error messages for each element and joining then by "," 
//             throw new ExpressError(400,errMsg); //and then displaying them
//         }
//         next();
// }


//THE BELOW ROUTES ARE FOR THE "Listing" SO SINCE WE ARE RESTRUCTURING THE ROUTE 
//wE ARE COMMENTING THESE OUT

//Using the Express-Router
app.use("/listings",listingRouter); //This will compare each requests and if a request matches to one of the route it will be activated or the control is send to there 

// //Index Routing
// app.get("/listings",wrapAsync(async(req,res)=>{
//     let allListings=await Listing.find();
//     res.render("listings/index.ejs",{allListings});
// }));

// //Create & New Route
// app.get("/listings/new",(req,res)=>{
//     res.render("listings/new.ejs");    //have to write this before our Show route because node is taking new as id instead of a route
// });

// //Show Route
// app.get("/listings/:id",wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     const listing= await Listing.findById(id).populate("reviews");
//     // console.log(listing);
//     res.render("listings/show.ejs",{listing});
// }));

// //Create Route
// app.post("/listings", validateListing, wrapAsync(async(req,res,next)=>{
//     // try{  //here we are using the wrapAsync instead of try-catch block
//         // let listing=req.body.listing;  //there is another to create an instance and save it
//         // console.log(listing);
//         // if(!req.body.listing){  //if this is empty then it will throw an error
//         //     throw new ExpressError(400,"Send Valid Data for Listing")  //this is what it will throw
//         // }  //why 400, it is because the error appeared due to the user's fault
//         // // let newListing=new Listing(req.body.listing);
//         // //checking each fields manually 
//         // if(!newListing.title){  
//         //     throw new ExpressError(400,"Title is Missings!")  
//         // }
//         // if(!newListing.description){  
//         //     throw new ExpressError(400,"Description is Missings!")  
//         // }
//         // if(!newListing.location){  
//         //     throw new ExpressError(400,"Location is Missing")  
//         // }
//         // if(!newListing.country){  
//         //     throw new ExpressError(400,"Country is Missings!")  
//         // }
//         // if(!newListing.price){  
//         //     throw new ExpressError(400,"Price is Missings!")  
//         // }
//         //This is much bulkier and also it takes so much efforts
//         //So for this we use "joi" that is an npm package that is used to validate the Schema
//         //using the Schema that we have defined using "Joi"

//         // let result=listingSchema.validate(req.body); //this will check if the req.body is passing all the Validations or not
//         // console.log(result);
//         // if(result.error){  //this make error handling more efficient as well as it also reduces the redundancy of writing the same code for multiple times
//         //     throw new ExpressError(400,result.error);
//         // }
//         //Another way is to define this Schema Validation process in a variable which will hold this function 
//         //and then pass this variable to the Routes as a middleware
//         let newListing=new Listing(req.body.listing);
//         await newListing.save();
//         res.redirect("/listings");
//     // }catch(err){
//     //     next(err);
//     // }
// }));

// //Edit Route
// app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     const listing= await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing})
// }));

// //Update Route
// app.put("/listings/:id",wrapAsync(async(req,res)=>{
//     if(!req.body.listing){  //if this is empty then it will throw an error
//             throw new ExpressError(400,"Send Valid Data for Listing")  //this is what it will throw
//         } 
//     let {id}=req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect(`/listings/${id}`);
// }));

// //Delete Route
// app.delete("/listings/:id",wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// }));

//Review Route

//Using the Express-Router
app.use("/listings/:id/reviews",reviewRouter); //This will compare each requests and if a request matches to one of the route it will be activated or the control is send to there 

// //POST Route
// app.post("/listings/:id/reviews", validateReview,wrapAsync(async(req,res)=>{
//     let listing= await Listing.findById(req.params.id);
//     let newReview= new Review(req.body.review);

//     listing.review.push(newReview);

//     await newReview.save();
//     await listing.save();

//     console.log("New Review Saved");
//     // res.send("New Review Saved");
//     res.redirect(`/listings/${listing.id}`);
// }));

// //DELETE Review Route
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//     let {id,reviewId}=req.params;

//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); //this will remove the specific review from the reviews array which is inside the Listing
//     await Review.findByIdAndDelete(reviewId); //This will remove the review from the Review only

//     res.redirect(`/listings/${id}`);
// }));


app.all("/{*splat}",(req,res,next)=>{ //this will be triggered when searched route doesn't matched with any Route that we have defined in our server
    next(new ExpressError(404,"Page Not Found!"));  //this will throw this error when specified route doesn't matched with any Route that we have defined in our server
});//Don't use "*" for all the route because in Express version 5 that will throw an error so instead use "/{*splat}""

//Creating an Error Handling Middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Someting Went Wrong!"}=err;
    res.status(statusCode).render("Error.ejs",{message});
    // res.status(statusCode).send(message);
    // res.send("Someting Went Wrong!");
});

app.listen(port,()=>{
    console.log(`Server is listening to port ${port}`);
});

