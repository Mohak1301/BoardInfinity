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
} from "../Controllers/usermanagementController.js";
import {
  isAdmin,
  isAdminorManager,
  requireSignIn,
} from "../Middleware/authMiddleware.js";
import auditLogMiddleware from "../Middleware/auditMiddleware.js";

// Create a new Express router instance
const router = express.Router();

// Route to get all users || Requires sign-in, admin or manager privileges, and audit logging || METHOD GET
router.get("/", requireSignIn, isAdminorManager, auditLogMiddleware, getUsersController);

// Route to get a user by ID || Requires sign-in and audit logging || METHOD GET
router.get("/:id", requireSignIn, auditLogMiddleware, getUsersByIdController);

// Route to update a user || Requires sign-in, admin privileges, and audit logging || METHOD PUT
router.put("/:id", requireSignIn, isAdmin, auditLogMiddleware, updateUsersController);

// Route to soft delete a user || Requires sign-in, admin privileges, and audit logging || METHOD DELETE
router.delete("/:id", requireSignIn, isAdmin, auditLogMiddleware, softDeleteUserController);

// Route to permanently delete a user || Requires sign-in, admin privileges, and audit logging || METHOD DELETE
router.delete("/permanent/:id", requireSignIn, isAdmin, auditLogMiddleware, permanentDeleteUserController);

// Route to restore a soft-deleted user || Requires sign-in, admin privileges, and audit logging || METHOD PATCH
router.patch("/restore/:id", requireSignIn, isAdmin, auditLogMiddleware, restoreUserController);

// Route to assign a role to a user || Requires sign-in, admin privileges, and audit logging || METHOD POST
router.post("/:id/assign-role", requireSignIn, isAdmin, auditLogMiddleware, assignRoleController);

// Route to revoke a role from a user || Requires sign-in, admin privileges, and audit logging || METHOD POST
router.post("/:id/revoke-role", requireSignIn, isAdmin, auditLogMiddleware, revokeRoleController);

export default router;
