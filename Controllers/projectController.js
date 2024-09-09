
import  ProjectSchema  from "../Validations/projectValidation.js";
import { Project, User, ProjectUser } from '../Models/associations.js'; 
import { Op } from 'sequelize';

// Create Project Controller
export const createProjectController = async (req, res) => {
  try {
    // Validate request body
    await ProjectSchema.validateAsync(req.body);

    const { name, description, assignedTo } = req.body;

    // Check if a project with the same name already exists
    const existingProject = await Project.findOne({ where: { name } });
    if (existingProject) {
      return res.status(400).send({ message: "A project with this name already exists" });
    }

    // Ensure all assignedTo user IDs exist in the database
    const usersExist = await User.findAll({ where: { id: assignedTo } });
    if (usersExist.length !== assignedTo.length) {
      return res.status(400).send({ message: "One or more assigned users do not exist" });
    }

    // Create a new project
    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id, // Use the user ID from the middleware
      assignedTo, // Array of User IDs
    });

    res.status(201).send({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).send({
        success: false,
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating project",
      error,
    });
  }
};



export const getProjectsController = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: {
        isDeleted: false, // Ensure only non-deleted projects are retrieved
      },
      include: [
        {
          model: User,
          as: 'creator', // Assuming 'createdBy' is aliased as 'creator'
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'assignedUsers', // Assuming 'assignedTo' is aliased as 'assignedUsers'
          attributes: ['id', 'name', 'email'],
          through: {
            attributes: [], // Don't include attributes from the join table
          },
        },
      ],
    });

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

    // Find the project by ID and include associated users
    const project = await Project.findOne({
      where: {
        id,
        isDeleted: false, // Ensure the project is not soft-deleted
      },
      include: [
        {
          model: User,
          as: 'creator', // Assuming 'createdBy' is aliased as 'creator'
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'assignedUsers', // Assuming 'assignedTo' is aliased as 'assignedUsers'
          attributes: ['id', 'name', 'email'],
          through: {
            attributes: [], // Don't include attributes from the join table
          },
        },
      ],
    });

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

    // Find the project by ID
    const project = await Project.findByPk(id);

    // If project is not found
    if (!project) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    // Update the project
    await project.update({
      name,
      description,
    });

    // Update the project assignments (note: assignedTo should be an array of UUIDs)
    if (assignedTo) {
      // Assuming assignedTo is an array of UUIDs
      await project.setAssignedUsers(assignedTo); // Adjust based on your associations
    }

    // Return the updated project details
    res.status(200).send({
      success: true,
      message: "Project updated successfully",
      project,
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



export const softDeleteProjectController = async (req, res) => {
  try {
    const { id } = req.params; // Extract project ID from request parameters

    // Find the project by ID
    const project = await Project.findByPk(id);

    // If project is not found
    if (!project) {
      return res.status(404).send({
        success: false,
        message: "Project not found",
      });
    }

    // Soft delete the project by setting the isDeleted flag to true
    await project.update({
      isDeleted: true,
      deletedAt: new Date(),
    });

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




// // Permanent Delete Project Controller
export const permanentDeleteProjectController = async (req, res) => {
  try {
    const { id } = req.params; // Extract project ID from request parameters

    // Permanently delete the project by its ID
    const deletedCount = await Project.destroy({
      where: {
        id: id,
        isDeleted: true // Ensure the project is marked as deleted before attempting permanent deletion
      }
    });

    // If no rows were affected, the project was not found
    if (deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Project not found or not marked as deleted",
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

    // Find the project by ID to check if it exists and is soft-deleted
    const project = await Project.findOne({
      where: { 
        id,
        deletedAt: {
          [Op.not]: null // This checks if the project is soft-deleted
        }
      }
    });

    // If the project is not found or not soft-deleted
    if (!project) {
      return res.status(404).send({
        success: false,
        message: "Project not found or not soft-deleted",
      });
    }

    // Restore the project by setting `deletedAt` to null and `isDeleted` to false
    const restoredProject = await Project.update(
      { isDeleted: false, deletedAt: null },
      { 
        where: { id },
        returning: true, // This will return the updated project
        plain: true // Ensures a single object is returned
      }
    );

    // Return a success response with the updated project details
    res.status(200).send({
      success: true,
      message: "Project restored successfully",
      project: restoredProject[1] // `restoredProject[1]` contains the updated project details
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