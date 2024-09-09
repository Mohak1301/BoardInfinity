import express from "express";
// import { registerController } from "../Controllers/authController.js";
import {
  getUsersController,
  getUsersByIdController,
  updateUsersController,
  softDeleteUserController,
  permanentDeleteUserController,
  restoreUserController,
  assignRoleController,
  revokeRoleController
} from "../Controllers/usermanagementController.js"
import {
  isAdmin,
  isAdminorManager,
  requireSignIn,
} from "../Middleware/authMiddleware.js";
import auditLogMiddleware from "../Middleware/auditMiddleware.js";


//router object
const router = express.Router();

// //routing
// router.post("/", requireSignIn, isAdmin, registerController);
router.get("/", requireSignIn, isAdminorManager,auditLogMiddleware,getUsersController);
router.get("/:id", requireSignIn,auditLogMiddleware, getUsersByIdController);
router.put("/:id", requireSignIn, isAdmin, auditLogMiddleware,updateUsersController);

// // Soft Delete User
router.delete("/:id", requireSignIn, isAdmin, auditLogMiddleware,softDeleteUserController);

// // Permanent Delete User
router.delete("/permanent/:id",requireSignIn,isAdmin,auditLogMiddleware,permanentDeleteUserController);


// // Restore User
router.patch("/restore/:id", requireSignIn, isAdmin, auditLogMiddleware,restoreUserController);

router.post("/:id/assign-role",requireSignIn,isAdmin,auditLogMiddleware,assignRoleController)

router.post("/:id/revoke-role", requireSignIn, isAdmin, auditLogMiddleware,revokeRoleController);



export default router;
