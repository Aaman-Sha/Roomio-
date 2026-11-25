const User=require("../Models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res)=>{  //By using the wrapAsync we can habdle the error but 
    //we want to add a feature that if some error occurs then it should display the error and then redirect user to signup page again 
    try{
        let {username,email,password}= req.body;
        const newUser=new User({email,username});
        let registeredUser= await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{   //This will automatically logins the newly signedUp user to our Website
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Roomio!");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm=async(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to Roomio!");
    res.redirect(res.locals.redirectUrl);  //this will redirect user where he was before he was redirected to login page
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are Successfully Logged Out!");
        res.redirect("/listings");
    });
}