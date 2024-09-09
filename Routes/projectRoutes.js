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

// router object
const router = express.Router();

router.post("/", requireSignIn, isAdmin, auditLogMiddleware,createProjectController);
router.get("/", requireSignIn, auditLogMiddleware,getProjectsController);
router.get("/:id", requireSignIn, auditLogMiddleware,getProjectByIdController);
router.put("/:id", requireSignIn, isAdmin, auditLogMiddleware,updateProjectController);
router.delete("/:id", requireSignIn, isAdmin, auditLogMiddleware,softDeleteProjectController);
router.delete("/permanent/:id", requireSignIn, isAdmin, auditLogMiddleware,permanentDeleteProjectController);
router.patch("/restore/:id",requireSignIn,isAdmin,auditLogMiddleware,restoreProjectController)


export default router;
