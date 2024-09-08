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

//router object
const router = express.Router();

router.post("/", requireSignIn, isAdmin, createProjectController);
router.get("/", requireSignIn, getProjectsController);
router.get("/:id", requireSignIn, getProjectByIdController);
router.put("/:id", requireSignIn, isAdmin, updateProjectController);
router.delete("/:id", requireSignIn, isAdmin, softDeleteProjectController);
router.delete("/permanent/:id", requireSignIn, isAdmin, permanentDeleteProjectController);
router.patch("/restore/:id",requireSignIn,isAdmin,restoreProjectController)


export default router;
