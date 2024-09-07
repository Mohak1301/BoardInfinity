import express from "express";
import {
 
  registerController,


} from "../Controllers/authController.js";
import { getusersController ,getUsersByIdController} from "../Controllers/managementController.js";
import { isAdmin, isAdminorManager, requireSignIn } from "../Middleware/authMiddleware.js";

//router object
const router = express.Router();

//routing
router.post("/", requireSignIn,isAdmin,registerController);
router.get("/",requireSignIn,isAdminorManager,getusersController);
router.get("/:id",requireSignIn,getUsersByIdController)



export default router;
