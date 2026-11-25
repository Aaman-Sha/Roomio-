const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
})

const storage = new CloudinaryStorage({  //Creating a storage where we are going to save our files and images
  cloudinary: cloudinary,
  params: {
    folder: 'roomio_DEV',
    allowedFormats: ["png","jpeg","jpg"] // supports promises as well
  },
});

module.exports={
    cloudinary,
    storage,
}