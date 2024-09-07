import express from "express";
import {
 
  registerController,


} from "../Controllers/authController.js";
import { getUsersController ,getUsersByIdController, updateUsersController, softDeleteUserController} from "../Controllers/managementController.js";
import { isAdmin, isAdminorManager, requireSignIn } from "../Middleware/authMiddleware.js";

//router object
const router = express.Router();

//routing
router.post("/", requireSignIn,isAdmin,registerController);
router.get("/",requireSignIn,isAdminorManager,getUsersController);
router.get("/:id",requireSignIn,getUsersByIdController)
router.put("/:id",requireSignIn,isAdmin,updateUsersController)

// Soft Delete User
router.delete("/:id", requireSignIn, isAdmin, softDeleteUserController);





export default router;
