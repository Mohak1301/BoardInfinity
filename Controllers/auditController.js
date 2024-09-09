import AuditLog from "../Models/auditlogModel.js";
import { Project, User, ProjectUser } from "../Models/associations.js";

/**
 * Retrieves a list of audit logs for the application.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
export const getAuditLogsController = async (req, res) => {
  try {
    // Check if the user has admin privileges
    if (req.user.roleId !== "Admin") {
      return res.status(403).send({
        success: false,
        message: "Access Denied: Only Admins can view audit logs",
      });
    }

    // Retrieve audit logs with user details
    const auditLogs = await AuditLog.findAll({
      include: [
        {
          model: User,
          as: "performer",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["performedAt", "DESC"]],
    });

    console.log(auditLogs); // For debugging purposes

    // Send the audit logs as a response
    res.status(200).send({
      success: true,
      message: "Audit logs retrieved successfully",
      auditLogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while retrieving audit logs",
      error,
    });
  }
};
