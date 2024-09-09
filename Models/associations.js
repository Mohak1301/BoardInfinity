import User from './userModel.js';
import Project from './projectModel.js';
import ProjectUser from './projectuserModel.js';
import AuditLog from './auditlogModel.js';

// Define relationships
Project.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasMany(Project, { foreignKey: 'createdBy', as: 'createdProjects' });

Project.belongsToMany(User, {
  through: ProjectUser,
  as: 'assignedUsers', // Alias for many-to-many relationship
  foreignKey: 'projectId',
});

User.belongsToMany(Project, {
  through: ProjectUser,
  as: 'userProjects', // Alias for many-to-many relationship
  foreignKey: 'userId',
});

AuditLog.belongsTo(User, { foreignKey: 'performedBy', as: 'performer' });
User.hasMany(AuditLog, { foreignKey: 'performedBy', as: 'auditLogs' });

export { User, Project, ProjectUser, AuditLog };
