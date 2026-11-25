//Here we are going to define our Schema for our Server-Side Schema -Validations 
//we are using "joi" npm package for that 

const Joi=require('joi');
const Review = require('./Models/review');

module.exports.listingSchema=Joi.object({  //this will be our Schema
    listing:Joi.object({  //in thatt schema it should contain object named "listing" and that should be requred
        title:Joi.string().required(),  //inside tht "listing" object these are the keys that should be present and should be required
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0), //the price should be min "0"(Zero)
        image:Joi.string().allow("",null)  //image will be string but it is allow to be an empty string or to have a null value
    }).required()
});


module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
});