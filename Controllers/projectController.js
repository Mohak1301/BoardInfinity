import projectModel from "../Models/projectModel.js"; // Import your Project model here
import userModel from "../Models/userModel.js"; // Import your User model here

// Create Project Controller
export const createProjectController = async (req, res) => {
  try {
    const { name, description, assignedTo } = req.body;

    // Validations
    if (!name)
      return res.status(400).send({ message: "Project name is required" });
    if (!description)
      return res
        .status(400)
        .send({ message: "Project description is required" });
    if (!assignedTo || !Array.isArray(assignedTo) || assignedTo.length === 0) {
      return res
        .status(400)
        .send({ message: "AssignedTo must be an array of user IDs" });
    }

    // Check if a project with the same name already exists
    const existingProject = await projectModel.findOne({ name });
    if (existingProject) {
      return res
        .status(400)
        .send({ message: "A project with this name already exists" });
    }

    // Ensure all assignedTo user IDs exist in the database
    const usersExist = await userModel.find({ _id: { $in: assignedTo } });
    if (usersExist.length !== assignedTo.length) {
      return res
        .status(400)
        .send({ message: "One or more assigned users do not exist" });
    }

    // Create a new project
    const project = new projectModel({
      name,
      description,
      createdBy: req.user._id, // Use the user ID from the middleware
      assignedTo,
    });

    // Save the project to the database
    await project.save();

    res.status(201).send({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating project",
      error,
    });
  }
};

export const getProjectsController = async (req, res) => {
  try {
    const userRole = req.user.roleId; // Assuming roleId stores roles like "Admin", "Manager", "Employee"
    console.log("Role",userRole)
    
    const userId = req.user._id; // User ID from the authenticated user middleware

    let projects;

    // Retrieve projects based on user role
    if (userRole === "Admin") {
      // Admin: Retrieve all projects
      projects = await projectModel.find();
    } else if (userRole === "Manager") {
      // Manager: Retrieve projects created by them or assigned to them
      projects = await projectModel.find({
        $or: [{ createdBy: userId }, { assignedTo: userId }],
      });
    } else if (userRole === "Employee") {
      // Employee: Retrieve only projects assigned to them
      projects = await projectModel.find({ assignedTo: userId });
    } else {
      // If the role is unknown, return an error
      return res.status(403).send({
        success: false,
        message: "Access Denied: Invalid Role",
      });
    }

    // Send response with the list of projects
    res.status(200).send({
      success: true,
      message: "Projects retrieved successfully",
      projects,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while retrieving projects",
      error,
    });
  }
};
