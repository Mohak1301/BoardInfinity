import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define(
  'User',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Validate that the value is a valid email
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true, // Validate that the phone is numeric
      },
    },
    address: {
      type: DataTypes.JSON, // JSON type allows for structured data
      allowNull: false,
    },
    roleId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    tableName: 'users', // Explicit table name for consistency
  }
);

export default User;
