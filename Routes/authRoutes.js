import express from "express";
import {
  loginController,
  registerController,
  signupAdminController,
  

} from "../Controllers/authController.js";
import { isAdmin, requireSignIn } from "../Middleware/authMiddleware.js";
// import { isColString } from "sequelize/lib/utils";


//router object
const router = express.Router();


//routing
//REGISTER || METHOD POST
router.post("/signup", signupAdminController);
router.post("/login",loginController);
router.post("/register",requireSignIn,isAdmin,registerController);




export default router;
