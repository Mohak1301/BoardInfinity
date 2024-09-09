import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Initializes a Sequelize instance for connecting to a PostgreSQL database.
 *
 * @returns {Sequelize} An instance of Sequelize for interacting with the database.
 */
const initializeSequelize = () => {
  // Create a Sequelize instance with the configured database details
  const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      dialect: "postgres",
      logging: false, // Set to true to see SQL queries for debugging
    }
  );

  return sequelize;
};

// Export the Sequelize instance for use in other parts of the application
export default initializeSequelize();
