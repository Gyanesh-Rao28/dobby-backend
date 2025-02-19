// src/models/image.model.js
import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Image name is required"],
      trim: true,
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);



const Image = mongoose.model("Image", imageSchema);
export default Image;
