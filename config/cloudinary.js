import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test connection
cloudinary.api.ping()
  .then(() => console.log("✅ Cloudinary Connected"))
  .catch((err) => console.error("❌ Cloudinary Error:", err.message));

export default cloudinary;