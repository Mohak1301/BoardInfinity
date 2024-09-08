import projectModel from "../Models/projectModel.js"; // Import your Project model here
import userModel from "../Models/userModel.js"; // Import your User model here

// Create Project Controller
export const createProjectController = async (req, res) => {
  try {
    const { name, description, assignedTo } = req.body;

    // Validations
    if (!name) {
      return res.status(400).send({ message: "Project name is required" });
    }
    if (!description) {
      return res.status(400).send({ message: "Project description is required" });
    }
    if (!Array.isArray(assignedTo)) {
      return res.status(400).send({ message: "AssignedTo must be an array of user IDs" });
    }

    // Check if a project with the same name already exists
    const existingProject = await projectModel.findOne({ name });
    if (existingProject) {
      return res.status(400).send({ message: "A project with this name already exists" });
    }

    // Ensure all assignedTo user IDs exist in the database
    const usersExist = await userModel.find({ _id: { $in: assignedTo } });
    if (usersExist.length !== assignedTo.length) {
      return res.status(400).send({ message: "One or more assigned users do not exist" });
    }

    // Create a new project
    const project = new projectModel({
      name,
      description,
      createdBy: req.user._id, // Use the user ID from the middleware
      assignedTo, // Array of User IDs referencing the User model
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
    console.log("Role:", userRole);

    const userId = req.user._id; // User ID from the authenticated user middleware

    let projects;

    // Retrieve projects based on user role
    if (userRole === "Admin") {
      // Admin: Retrieve all projects
      projects = await projectModel.find().populate('createdBy', 'name email').populate('assignedTo', 'name email');
    } else if (userRole === "Manager") {
      // Manager: Retrieve projects created by them or assigned to them
      projects = await projectModel
        .find({
          $or: [{ createdBy: userId }, { assignedTo: userId }],
        })
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email');
    } else if (userRole === "Employee") {
      // Employee: Retrieve only projects assigned to them
      projects = await projectModel
        .find({ assignedTo: userId })
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email');
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



export const getProjectByIdController = async (req, res) => {
  try {
    const { id } = req.params; // Extract project ID from request parameters

    // Find the project by ID and ensure it is not deleted
    const project = await projectModel
      .findOne({ _id: id, isDeleted: false }) // Check for soft delete status
      .populate('createdBy', 'name email') // Populate createdBy field with user details
      .populate('assignedTo', 'name email'); // Populate assignedTo field with user details

    // If project is not found
    if (!project) {
      return res.status(404).send({
        success: false,
        message: 'Project not found',
      });
    }

    // Return the project details if found
    res.status(200).send({
      success: true,
      message: 'Project fetched successfully',
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error while fetching project',
      error,
    });
  }
};




export const updateProjectController = async (req, res) => {
  try {
    const { id } = req.params; // Extract project ID from request parameters
    const { name, description, assignedTo } = req.body; // Extract fields from request body

    // Validation
    if (!name && !description && !assignedTo) {
      return res.status(400).send({
        success: false,
        message: "At least one field (name, description, assignedTo) must be provided for update",
      });
    }

    // Ensure the user is an Admin (assuming isAdmin middleware sets this correctly)
    if (req.user.roleId !== "Admin") {
      return res.status(403).send({
        success: false,
        message: "Access Denied: Only Admins can update projects",
      });
    }

    // Find the project by ID and update it
    const updatedProject = await projectModel.findByIdAndUpdate(
      id,
      { 
        name,
        description,
        assignedTo,
        updatedAt: new Date() // Update the timestamp
      },
      { new: true } // Return the updated document
    );

    // If project is not found
    if (!updatedProject) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    // Return the updated project details
    res.status(200).send({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating project",
      error,
    });
  }
};





// Soft Delete Project Controller
export const softDeleteProjectController = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete the project by setting the isDeleted flag to true
    const project = await projectModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!project) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Project soft deleted successfully",
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while soft deleting project",
      error,
    });
  }
};




// Permanent Delete Project Controller
export const permanentDeleteProjectController = async (req, res) => {
  try {
    const { id } = req.params; // Extract project ID from request parameters

    // Permanently delete the project by its ID
    const project = await projectModel.findByIdAndDelete(id);

    // If the project is not found
    if (!project) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    // Return a success response
    res.status(200).send({
      success: true,
      message: "Project permanently deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while permanently deleting project",
      error,
    });
  }
};





// Restore Project Controller
export const restoreProjectController = async (req, res) => {
  try {
    const { id } = req.params; // Extract project ID from request parameters

    // Restore the project by setting `isDeleted` to false
    const project = await projectModel.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null }, // Also reset the `deletedAt` field to null
      { new: true } // Return the updated project document
    );

    // If project is not found or is already active
    if (!project) {
      return res.status(404).send({
        success: false,
        message: "Project not found or already active",
      });
    }

    // Return a success response
    res.status(200).send({
      success: true,
      message: "Project restored successfully",
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while restoring project",
      error,
    });
  }
};
