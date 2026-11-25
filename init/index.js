const mongoose=require('mongoose');
const initData=require("./data.js");
const Listing=require('../Models/Listing.js');

const MONGO_URL='mongodb://127.0.0.1:27017/roomio';

main()
.then(res=>{
    console.log("Server is connected to DB");
})
.catch(err => {
    console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);   // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB=async()=>{
    await Listing.deleteMany();
    initData.data=initData.data.map((obj)=>({   //adds a single owner to all the listings
        ...obj,
        owner:'6ade19ac785812ba4891b55c',
    }));
    await Listing.insertMany(initData.data); //the data which which we are accessing is a key from the imported object
    console.log("Data was Initialized");
};

initDB();