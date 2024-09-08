import express from "express";

import {
  isAdmin,
  isAdminorManager,
  requireSignIn,
} from "../Middleware/authMiddleware.js";
import { createProjectController, getProjectsController } from "../Controllers/projectController.js";

//router object
const router = express.Router();

router.post("/",requireSignIn,isAdmin,createProjectController);
router.get("/", requireSignIn, getProjectsController);




export default router;
