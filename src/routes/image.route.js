// src/routes/image.route.js
import express from "express";
import {
  uploadImage,
  getImage,
  deleteImage,
  updateImage,
  searchImages,
} from "../controllers/image.controller.js";
import { authJWT } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authJWT);

router.get("/search", searchImages);
// Route for uploading image - using multer middleware
router.post("/", upload.single("image"), uploadImage);
router.get("/:imageId", getImage);
router.delete("/:imageId", deleteImage);
router.put("/:imageId", updateImage);


export default router;
