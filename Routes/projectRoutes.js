import express from "express";

import {
  isAdmin,
  isAdminorManager,
  requireSignIn,
} from "../Middleware/authMiddleware.js";
import { createProjectController, getProjectsController, getProjectByIdController } from "../Controllers/projectController.js";

//router object
const router = express.Router();

router.post("/",requireSignIn,isAdmin,createProjectController);
router.get("/", requireSignIn, getProjectsController);
router.get("/:id", requireSignIn, getProjectByIdController);




export default router;
