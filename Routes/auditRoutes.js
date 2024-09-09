import express from "express";

import { isAdmin, requireSignIn } from "../Middleware/authMiddleware.js";
import { getAuditLogsController } from "../Controllers/auditController.js";
// import { isColString } from "sequelize/lib/utils";


//router object
const router = express.Router();


router.get('/',requireSignIn,isAdmin,getAuditLogsController);



export default router;
