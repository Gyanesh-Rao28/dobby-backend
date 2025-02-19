// src/utils/fileUpload.js
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

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
        { folder: "app-uploads" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );

      // Convert buffer to stream
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

// Delete file from Cloudinary
export const deleteFile = async (fileUrl) => {
  try {
    // Extract public ID from Cloudinary URL
    const publicId = fileUrl.split("/").slice(-1)[0].split(".")[0];

    await cloudinary.uploader.destroy(`app-uploads/${publicId}`);
    return true;
  } catch (error) {
    throw new Error(`Error deleting file: ${error.message}`);
  }
};
