import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize Sequelize instance with PostgreSQL connection details
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  dialect: "postgres",
  logging: false, // Set to true to see SQL queries for debugging
});

export default sequelize;
