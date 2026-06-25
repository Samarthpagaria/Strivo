import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Uploading video to Cloudinary...");

cloudinary.uploader.upload_large(
  "../frontend/src/assets/video.mp4",
  { resource_type: "auto" },
  (error, result) => {
    if (error) {
      console.error("Error:", error);
    } else {
      console.log("URL:", result.url);
      console.log("SECURE_URL:", result.secure_url);
    }
  }
);
