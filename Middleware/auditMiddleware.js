import AuditLog from "../Models/auditlogModel.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Middleware that logs audit information for each request.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the chain.
 */
const auditLogMiddleware = async (req, res, next) => {
  // Generate a unique ID for the log entry
  const logId = uuidv4();

  // Capture details about the request
  const logEntry = {
    id: logId, // Include the log ID for easier reference
    action: `${req.method} ${req.originalUrl}`,
    performedBy: req.user?.id || null, // Use optional chaining to access `req.user.id` safely
    performedAt: new Date(),
    targetResource: req.body ? JSON.stringify(req.body) : "No body",
  };

  try {
    // Save log entry to the database
    await AuditLog.create(logEntry);
  } catch (error) {
    console.error("Failed to log audit entry:", error);
  }

  // Proceed with the request
  next();
};

export default auditLogMiddleware;
