import express from "express";
import {
  loginController,
  registerController,
  signupAdminController,
} from "../Controllers/authController.js";
import { isAdmin, requireSignIn } from "../Middleware/authMiddleware.js";

// Create a new Express router instance
const router = express.Router();

// Route for admin signup || METHOD POST
router.post("/signup", signupAdminController);

// Route for user login || METHOD POST
router.post("/login", loginController);

// Route for registering a user || Requires user to be signed in and have admin privileges || METHOD POST
router.post("/register", requireSignIn, isAdmin, registerController);

export default router;
