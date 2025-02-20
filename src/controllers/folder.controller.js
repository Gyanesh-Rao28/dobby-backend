// src/controllers/folder.controller.js
import Folder from "../models/folder.model.js";
import Image from "../models/image.model.js";

export const createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const userId = req.user._id;

    // Check if parent folder exists if parentId is provided
    if (parentId) {
      const parentFolder = await Folder.findOne({
        _id: parentId,
        userId,
      });

      if (!parentFolder) {
        return res.status(404).json({
          success: false,
          message: "Parent folder not found",
        });
      }

      // Get parent's path and add parent's id to create new path
      const path = [...parentFolder.path, parentFolder._id];

      const folder = await Folder.create({
        name,
        parentId,
        userId,
        path,
        isRoot: false,
      });

      return res.status(201).json({
        success: true,
        folder,
        message: "Folder created successfully",
      });
    }

    // Create root folder if no parentId
    const folder = await Folder.create({
      name,
      userId,
      path: [],
      isRoot: true,
    });

    return res.status(201).json({
      success: true,
      folder,
      message: "Root folder created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error creating folder",
    });
  }
};

export const getFolderContent = async (req, res) => {
  try {
    const { folderId } = req.params;
    const userId = req.user._id;

    // Get current folder
    const currentFolder = await Folder.findOne({
      _id: folderId,
      userId,
    });

    if (!currentFolder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    // Get subfolders
    const subfolders = await Folder.find({
      parentId: folderId,
      userId,
    });

    // Get images in current folder
    const images = await Image.find({
      folderId,
      userId,
    });

    return res.status(200).json({
      success: true,
      data: {
        currentFolder,
        subfolders,
        images,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error getting folder content",
    });
  }
};

export const getRootFolders = async (req, res) => {
  try {
    const userId = req.user._id;

    const rootFolders = await Folder.find({
      userId,
      isRoot: true,
    });

    return res.status(200).json({
      success: true,
      folders: rootFolders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error getting root folders",
    });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const userId = req.user._id;

    const folder = await Folder.findOne({
      _id: folderId,
      userId,
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    // Delete all subfolders
    await Folder.deleteMany({
      path: folder._id,
      userId,
    });

    // Delete all images in this folder
    await Image.deleteMany({
      folderId,
      userId,
    });

    // Delete the folder itself
    await folder.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Folder and its contents deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error deleting folder",
    });
  }
};

export const updateFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { name } = req.body;
    const userId = req.user._id;

    const folder = await Folder.findOneAndUpdate(
      { _id: folderId, userId },
      { name },
      { new: true }
    );

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    return res.status(200).json({
      success: true,
      folder,
      message: "Folder updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error updating folder",
    });
  }
};

export const getFolderPath = async (req, res) => {
  try {
    const { folderId } = req.params;
    const userId = req.user._id;

    // Get the requested folder
    const folder = await Folder.findOne({
      _id: folderId,
      userId,
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    // Start with the current folder's path array
    let pathIds = [...folder.path];
    if (!pathIds.includes(folder._id)) {
      pathIds.push(folder._id);
    }

    // Find all folders in the path
    const pathFolders = await Folder.find({
      _id: { $in: pathIds },
      userId,
    }).select("_id name");

    // Sort folders according to path order
    const path = pathIds
      .map((id) =>
        pathFolders.find((folder) => folder._id.toString() === id.toString())
      )
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      path,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error retrieving folder path",
    });
  }
};