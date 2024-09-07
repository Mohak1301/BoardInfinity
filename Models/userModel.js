import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: {},
      required: true,
    },
   
    roleId: {
      type: String,
      
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
