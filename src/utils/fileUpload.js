// src/utils/fileUpload.js
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file to Cloudinary
export const uploadFile = async (file) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "app-uploads",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );

      // Stream the buffer to Cloudinary
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

// Delete file from Cloudinary
export const deleteFile = async (fileUrl) => {
  try {
    if (!fileUrl || !fileUrl.includes("cloudinary")) {
      return true; // Skip if not a Cloudinary URL
    }

    // Extract public ID from Cloudinary URL
    const urlParts = fileUrl.split("/");
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = `app-uploads/${publicIdWithExtension.split(".")[0]}`;

    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false; // Don't throw error on delete failure
  }
};
