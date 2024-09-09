import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; 

const AuditLog = sequelize.define('AuditLog', {
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  performedBy: {
    type: DataTypes.UUID, 
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
