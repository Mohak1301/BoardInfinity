import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: String,
      required: true, // User ID of the project creator
    },
    assignedTo: {
      type: [String], // Array of User IDs assigned to the project
      default: [],
    },
    deletedAt: {
      type: Date, // For soft delete
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
