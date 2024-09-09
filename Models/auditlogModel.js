import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Your Sequelize instance

const AuditLog = sequelize.define('AuditLog', {
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  performedBy: {
    type: DataTypes.UUID, // Match the type with the User model's id
    allowNull: false,
  },
  performedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  targetResource: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'audit_logs',
});

export default AuditLog;
