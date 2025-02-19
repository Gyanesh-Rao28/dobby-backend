import express from "express";
import {
  createFolder,
  getFolderContent,
  deleteFolder,
  updateFolder,
  getRootFolders,
} from "../controllers/folder.controller.js";
import { authJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authJWT);

router.post("/", createFolder);
router.put("/:folderId", updateFolder);
router.delete("/:folderId", deleteFolder);

router.get("/root", getRootFolders);
router.get("/:folderId", getFolderContent);

export default router;
