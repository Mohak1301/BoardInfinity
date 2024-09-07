import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from  "./Routes/authRoute.js";
import cors from "cors";




//configure env
dotenv.config();

//databse config
connectDB();


const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server Running onmode on port ${PORT}`.bgGreen.white);
});
