//Here we are defining a wrapAsync function for our code
module.exports=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch((err)=>next(err));
    }
}