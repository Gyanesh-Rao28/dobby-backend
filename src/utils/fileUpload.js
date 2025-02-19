import fs from "fs";
import path from "path";
import { promisify } from "util";

const unlinkAsync = promisify(fs.unlink);

// Function to upload file to local storage (in real-world, you'd use a cloud storage service)
export const uploadFile = async (file) => {
  try {
    // In production, you'd upload to cloud storage here
    // For now, we'll just return the local path
    return `/uploads/${file.filename}`;
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

// Function to delete file from storage
export const deleteFile = async (fileUrl) => {
  try {
    // Extract filename from URL
    const filename = path.basename(fileUrl);
    const filePath = `uploads/${filename}`;

    // Check if file exists
    if (fs.existsSync(filePath)) {
      await unlinkAsync(filePath);
    }
    return true;
  } catch (error) {
    throw new Error(`Error deleting file: ${error.message}`);
  }
};
