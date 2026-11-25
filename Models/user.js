const  mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose').default;  //default will give the function property it is holding

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
});

// console.log(typeof userSchema.plugin);
// console.log(Object.keys(passportLocalMongoose)); //had to check for the type of thing its is passing
// console.log(typeof passportLocalMongoose.default)

userSchema.plugin(passportLocalMongoose);
//Here Passport-Local Mongoose will add a username,hash and salt field to store the username and the hashed passwordand the salt value
//That why we have used it as a plugin

const User=mongoose.model("User",userSchema);

module.exports=User;