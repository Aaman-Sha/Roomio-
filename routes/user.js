const express=require("express");
const router=express.Router();
// const User=require('../Models/user.js');
const WrapAsync = require("../utils/WrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controllers/users.js");

router.route("/signup")  //SignUp Routes
    .get(userController.renderSignupForm)  
    .post(WrapAsync(userController.signup));

router.route("/login")  //Login routes
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate(   //We have to use Passport middleware which authenticates our user
            'local',  //This is our Strategy
            {
                failureRedirect:"/login",  //if a failure in login is faced then redirect to this route
                failureFlash:true  //for the same reasons but it is used to flash a message to the user 
                //The failure can be happend due to wrong input or else 
            }
        ),
        userController.login  //this is a function that is defined in controller for user
    );

router.get("/logout",userController.logout);  //Logout Route

module.exports=router;