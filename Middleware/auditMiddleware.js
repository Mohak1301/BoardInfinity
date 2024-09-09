// auditLogMiddleware.js
import AuditLog from '../Models/auditlogModel.js';
import { v4 as uuidv4 } from 'uuid';

const auditLogMiddleware = async (req, res, next) => {
  // Generate a unique ID for the log entry
  const logId = uuidv4();

  // Capture details about the request
  const logEntry = {
    action: `${req.method} ${req.originalUrl}`,
    performedBy: req.user ? req.user._id : null, // Use the user ID from the middleware
    performedAt: new Date(),
    targetResource: req.body ? JSON.stringify(req.body) : 'No body', // Capture request body if available
  };

  try {
    // Save log entry to the database
    await AuditLog.create(logEntry);
  } catch (error) {
    console.error('Failed to log audit entry:', error);
  }

  // Proceed with the request
  next();
};

export default auditLogMiddleware;
