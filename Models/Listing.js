const  mongoose=require('mongoose');
const Review = require('./review.js');

const Schema=mongoose.Schema;  //storing it in var to reduce rewriting of mongoose.Schema()

const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    
    // image:{
    //     type:String,
    //     default:"https://timesofindia.indiatimes.com/travel/destinations/worlds-most-beautiful-places-you-cant-miss/articleshow/111251599.cms",
    //     set: (v) => v === " " ? "https://timesofindia.indiatimes.com/travel/destinations/worlds-most-beautiful-places-you-cant-miss/articleshow/111251599.cms": v,  //setting a default image url is it is empty  
    // },
    image: {
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        },
        filename: {
            type: String,
            default: "listingimage"
        },
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{  //This will refer to id for user in 'User' Model
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({id:{$in: listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;