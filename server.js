import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from  "./Routes/authRoutes.js";
import managementRoutes from"./Routes/managementRoutes.js"
import projectRoutes from './Routes/projectRoutes.js'
import cors from "cors";




//configure env
dotenv.config();

//databse config
connectDB();


const app = express();

app.use(cors());
app.use(express.json());


app.use("/auth", authRoutes);
app.use("/users", managementRoutes);
app.use("/project",projectRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server Running onmode on port ${PORT}`.bgGreen.white);
});
