import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Adjust the import according to your project structure
import User from './userModel.js'; // Import the User model

const Project = sequelize.define('Project', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assignedTo: {
    type: DataTypes.ARRAY(DataTypes.INTEGER), // Array of user IDs
    defaultValue: [],
  },
  deletedAt: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
  paranoid: true, // Enables soft deletes by using `deletedAt` column
});

// Define associations
Project.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Project.belongsToMany(User, { through: 'ProjectAssignments', as: 'assignees', foreignKey: 'projectId' });

export default Project;
