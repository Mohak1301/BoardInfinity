import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import authRoutes from "./Routes/authRoutes.js"; // Adjust path if necessary
import managementRoutes from "./Routes/usermanagementRoutes.js";
import projectRoutes from "./Routes/projectRoutes.js";
import auditRoutes from "./Routes/auditRoutes.js";
import cors from "cors";

// Configure environment variables
dotenv.config();

const app = express();



// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/auth", authRoutes);
app.use("/users", managementRoutes);
app.use("/project", projectRoutes);
app.use("/audit-logs",auditRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});


// Database connection and synchronization
(async () => {
  try {
    // Test the connection to the database
    await sequelize.authenticate();
    console.log("Connection to the database has been established successfully.".green);

    // Sync all models with the database
    await sequelize.sync({ force: false }); // Set force: true only if you want to drop tables on every restart

    console.log("All models were synchronized successfully.".green);
  } catch (error) {
    console.error("Unable to connect to the database:".red, error);
  }
})();

app.use('/',(req,res)=>{
  res.send("<h1>Welcome to the API</h1>")
})
// Server setup
const PORT = process.env.PORT || 5300; // Use environment variable for PORT if provided
app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`.bgGreen.white);
});
