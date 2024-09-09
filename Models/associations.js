import User from "./userModel.js";
import Project from "./projectModel.js";
import ProjectUser from "./projectuserModel.js";
import AuditLog from "./auditlogModel.js";

// Define one-to-many relationship between Project and User

// A project is created by a user

Project.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// A user can create multiple projects

User.hasMany(Project, { foreignKey: "createdBy", as: "createdProjects" });

// Define many-to-many relationship between Project and User

// A project can have multiple assigned users, and a user can be assigned to multiple projects

Project.belongsToMany(User, {
  through: ProjectUser, // Junction table for the many-to-many relationship
  as: "assignedUsers", // Alias for the relationship
  foreignKey: "projectId",
});


User.belongsToMany(Project, {
  through: ProjectUser, // Junction table for the many-to-many relationship
  as: "userProjects", // Alias for the relationship
  foreignKey: "userId",
});


// Define one-to-many relationship between AuditLog and User
// An audit log entry is performed by a user
AuditLog.belongsTo(User, { foreignKey: "performedBy", as: "performer" });
// A user can have multiple audit log entries
User.hasMany(AuditLog, { foreignKey: "performedBy", as: "auditLogs" });

export { User, Project, ProjectUser, AuditLog };
