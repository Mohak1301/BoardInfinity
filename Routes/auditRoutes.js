import express from "express";
import { isAdmin, requireSignIn } from "../Middleware/authMiddleware.js";
import { getAuditLogsController } from "../Controllers/auditController.js";

// Create a new Express router instance
const router = express.Router();

// Route to get audit logs
// Requires user to be signed in and have admin privileges || METHOD GET
router.get('/', requireSignIn, isAdmin, getAuditLogsController);

export default router;
