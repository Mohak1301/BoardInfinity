import express from "express";
import {
  signupController,
  loginController,
  registerController

} from "../Controllers/authController.js";
import { isAdmin, requireSignIn } from "../Middleware/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/register",requireSignIn,isAdmin,registerController);



export default router;
