// src/controllers/image.controller.js
import Image from "../models/image.model.js";
import Folder from "../models/folder.model.js";
import { uploadFile, deleteFile } from "../utils/fileUpload.js";

export const uploadImage = async (req, res) => {
  try {
    const { name, folderId } = req.body;
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // Validate folder exists and user has access
    const folder = await Folder.findOne({
      _id: folderId,
      userId,
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found or access denied",
      });
    }

    // Upload file to cloud storage
    let fileUrl;
    
    try {
      fileUrl = await uploadFile(req.file);
    } catch (uploadError) {
      return res.status(500).json({
        success: false,
        message: `File upload failed: ${uploadError.message}`,
      });
    }

    // Create image document
    const image = await Image.create({
      name: name || req.file.originalname,
      folderId,
      userId,
      url: fileUrl,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    return res.status(201).json({
      success: true,
      image,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error uploading image",
    });
  }
};

export const getImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const userId = req.user._id;

    const image = await Image.findOne({
      _id: imageId,
      userId,
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    return res.status(200).json({
      success: true,
      image,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error retrieving image",
    });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const userId = req.user._id;

    const image = await Image.findOne({
      _id: imageId,
      userId,
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Delete file from cloud storage
    try {
      await deleteFile(image.url);
    } catch (deleteError) {
      console.error("File deletion error:", deleteError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete image document
    await image.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Image deletion error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error deleting image",
    });
  }
};

export const updateImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { name } = req.body;
    const userId = req.user._id;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required for update",
      });
    }

    const image = await Image.findOneAndUpdate(
      { _id: imageId, userId },
      { name },
      { new: true }
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    return res.status(200).json({
      success: true,
      image,
      message: "Image updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error updating image",
    });
  }
};

export const searchImages = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user._id;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Search for images by name containing the query string
    const images = await Image.find({
      userId,
      name: { $regex: query, $options: "i" },
    });

    return res.status(200).json({
      success: true,
      count: images.length,
      images,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error searching images",
    });
  }
};
