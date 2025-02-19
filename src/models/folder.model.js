// src/models/folder.model.js
import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Folder name is required"],
      trim: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    path: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
      },
    ],
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);



// Create a unique compound index for folder names under the same parent
folderSchema.index({ userId: 1, parentId: 1 });

const Folder = mongoose.model("Folder", folderSchema);
export default Folder;
