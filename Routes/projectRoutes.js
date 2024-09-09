import express from "express";
import {
  isAdmin,
  isAdminorManager,
  requireSignIn,
} from "../Middleware/authMiddleware.js";
import {
  createProjectController,
  getProjectsController,
  getProjectByIdController,
  updateProjectController,
  softDeleteProjectController,
  permanentDeleteProjectController,
  restoreProjectController,
} from "../Controllers/projectController.js";
import auditLogMiddleware from "../Middleware/auditMiddleware.js";

// Create a new Express router instance
const router = express.Router();

// Route to create a project || Requires sign-in, admin privileges, and audit logging || METHOD POST
router.post("/", requireSignIn, isAdmin, auditLogMiddleware, createProjectController);

// Route to get all projects || Requires sign-in and audit logging || METHOD GET
router.get("/", requireSignIn, auditLogMiddleware, getProjectsController);

// Route to get a project by ID || Requires sign-in and audit logging || METHOD GET
router.get("/:id", requireSignIn, auditLogMiddleware, getProjectByIdController);

// Route to update a project || Requires sign-in, admin privileges, and audit logging || METHOD PUT
router.put("/:id", requireSignIn, isAdmin, auditLogMiddleware, updateProjectController);

// Route to soft delete a project || Requires sign-in, admin privileges, and audit logging || METHOD DELETE
router.delete("/:id", requireSignIn, isAdmin, auditLogMiddleware, softDeleteProjectController);

// Route to permanently delete a project || Requires sign-in, admin privileges, and audit logging || METHOD DELETE
router.delete("/permanent/:id", requireSignIn, isAdmin, auditLogMiddleware, permanentDeleteProjectController);

// Route to restore a soft-deleted project || Requires sign-in, admin privileges, and audit logging || METHOD PATCH
router.patch("/restore/:id", requireSignIn, isAdmin, auditLogMiddleware, restoreProjectController);

export default router;
