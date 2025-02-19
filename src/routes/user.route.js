// src/routes/user.route.js

import express from "express";

import {
  registerUser,
  loginUser,
  searchUsers,
  getAllUsers
} from "../controllers/user.controller.js";
import { authJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route
router.post("/", registerUser);
router.get("/", loginUser);
router.get("/search", authJWT, searchUsers);
router.get("/allUsers", getAllUsers);


export default router;