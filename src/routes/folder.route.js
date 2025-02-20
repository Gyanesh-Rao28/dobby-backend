import express from "express";
import {
  createFolder,
  getFolderContent,
  deleteFolder,
  updateFolder,
  getRootFolders,
  getFolderPath,
} from "../controllers/folder.controller.js";
import { authJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.use(authJWT);

router.post("/", createFolder);
router.put("/:folderId", updateFolder);
router.delete("/:folderId", deleteFolder);

router.get("/root", getRootFolders);
router.get("/:folderId", getFolderContent);
router.get("/:folderId/path", getFolderPath);

export default router;
