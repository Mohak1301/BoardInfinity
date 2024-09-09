import ProjectSchema from "../Validations/projectValidation.js";
import { Project, User } from "../Models/associations.js";
import { Op } from "sequelize";

// Create Project Controller
/**
 * Creates a new project.
 * Validates the request body, checks for existing projects and users, then creates and stores the project.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const createProjectController = async (req, res) => {
  try {
    await ProjectSchema.validateAsync(req.body); // Validate request body

    const { name, description, assignedTo } = req.body;

    // Check if a project with the same name already exists
    const existingProject = await Project.findOne({ where: { name } });
    if (existingProject) {
      return res
        .status(400)
        .send({ message: "A project with this name already exists" });
    }

    // Ensure all assigned user IDs exist in the database
    const usersExist = await User.findAll({ where: { id: assignedTo } });
    if (usersExist.length !== assignedTo.length) {
      return res
        .status(400)
        .send({ message: "One or more assigned users do not exist" });
    }

    // Create a new project
    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      assignedTo,
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

    res.status(500).send({
      success: false,
      message: "Error in creating project",
      error,
    });
  }
};

// Get all projects
/**
 * Retrieves all projects that are not soft-deleted.
 * Includes project creator and assigned user details.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const getProjectsController = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { isDeleted: false },
      include: [
        {
          model: User,
          as: "creator", // Include project creator details
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "assignedUsers", // Include assigned user details
          attributes: ["id", "name", "email"],
          through: { attributes: [] },
        },
      ],
    });

    res.status(200).send({
      success: true,
      message: "Projects retrieved successfully",
      projects,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while retrieving projects",
      error,
    });
  }
};

// Get project by ID
/**
 * Retrieves a project by its ID.
 * Includes details of the project creator and assigned users.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const getProjectByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      where: { id, isDeleted: false },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "assignedUsers",
          attributes: ["id", "name", "email"],
          through: { attributes: [] },
        },
      ],
    });

    if (!project) {
      return res
        .status(404)
        .send({ success: false, message: "Project not found" });
    }

    res.status(200).send({
      success: true,
      message: "Project fetched successfully",
      project,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while fetching project",
      error,
    });
  }
};

// Update project
/**
 * Updates an existing project by its ID.
 * Requires at least one field (name, description, or assignedTo) to be updated.
 * Ensures only Admins can update projects.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const updateProjectController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, assignedTo } = req.body;

    if (!name && !description && !assignedTo) {
      return res.status(400).send({
        success: false,
        message:
          "At least one field (name, description, assignedTo) must be provided for update",
      });
    }

    // Ensure the user is an Admin
    if (req.user.roleId !== "Admin") {
      return res.status(403).send({
        success: false,
        message: "Access Denied: Only Admins can update projects",
      });
    }

    const project = await Project.findByPk(id);
    if (!project) {
      return res
        .status(404)
        .send({ success: false, message: "Project not found" });
    }

    await project.update({ name, description });

    // Update project assignments if provided
    if (assignedTo) {
      await project.setAssignedUsers(assignedTo);
    }

    res.status(200).send({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while updating project",
      error,
    });
  }
};

// Soft delete project
/**
 * Soft deletes a project by setting `isDeleted` to true and recording the deletion date.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const softDeleteProjectController = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) {
      return res
        .status(404)
        .send({ success: false, message: "Project not found" });
    }

    await project.update({ isDeleted: true, deletedAt: new Date() });

    res.status(200).send({
      success: true,
      message: "Project soft deleted successfully",
      project,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while soft deleting project",
      error,
    });
  }
};

// Permanently delete project
/**
 * Permanently deletes a project that has been soft-deleted.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const permanentDeleteProjectController = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Project.destroy({
      where: { id, isDeleted: true },
    });

    if (deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Project not found or not marked as deleted",
      });
    }

    res.status(200).send({
      success: true,
      message: "Project permanently deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while permanently deleting project",
      error,
    });
  }
};

// Restore soft-deleted project
/**
 * Restores a soft-deleted project by setting `isDeleted` to false and clearing the deletion date.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const restoreProjectController = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      where: { id, deletedAt: { [Op.not]: null } },
    });

    if (!project) {
      return res.status(404).send({
        success: false,
        message: "Project not found or not soft-deleted",
      });
    }

    const restoredProject = await Project.update(
      { isDeleted: false, deletedAt: null },
      { where: { id }, returning: true, plain: true }
    );

    res.status(200).send({
      success: true,
      message: "Project restored successfully",
      project: restoredProject[1],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while restoring project",
      error,
    });
  }
};
