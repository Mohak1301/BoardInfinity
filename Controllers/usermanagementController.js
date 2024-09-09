import User from "../Models/userModel.js"; // Import Sequelize User model
import { updateUserSchema } from "../Validations/updateuserValidation.js";

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const getUsersController = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { isDeleted: false },
      attributes: ["id", "username", "name", "email", "phone", "address"],
    });

    res.status(200).send({
      success: true,
      countTotal: users.length,
      message: "All Users",
      users,
    });
  } catch (error) {
    console.log("Error while getting users:", error);
    res.status(400).send({
      success: false,
      message: "Error while getting users",
      error: error.message,
    });
  }
};

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const getUsersByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { id, isDeleted: false },
      attributes: ["id", "username", "name", "email", "phone", "address"],
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User Found",
      user,
    });
  } catch (error) {
    console.log("Error while getting user by ID:", error);
    res.status(500).send({
      success: false,
      message: "Error while getting user",
      error: error.message,
    });
  }
};

/**
 * Update user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const updateUsersController = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateUser = req.body;

    const { error } = updateUserSchema.validate(updateUser);
    if (error) {
      return res.status(400).send({
        success: false,
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    const user = await User.findOne({
      where: { id: userId, isDeleted: false },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    await user.update(updateUser);

    return res.status(200).send({
      success: true,
      message: "User details updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    return res.status(500).send({
      success: false,
      message: "Error updating user details.",
      error: error.message,
    });
  }
};

/**
 * Soft delete user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const softDeleteUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const updatedUser = await user.update({ isDeleted: true });

    res.status(200).send({
      success: true,
      message: "User soft deleted successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while soft deleting user",
      error: error.message,
    });
  }
};

/**
 * Permanently delete user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const permanentDeleteUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await User.destroy({
      where: { id },
    });

    if (result === 0) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User permanently deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while permanently deleting user",
      error: error.message,
    });
  }
};

/**
 * Restore soft-deleted user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const restoreUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await User.update(
      { isDeleted: false },
      { where: { id }, returning: true }
    );

    if (updated === 0) {
      return res.status(404).send({
        success: false,
        message: "User not found or already active",
      });
    }

    const user = await User.findByPk(id);

    res.status(200).send({
      success: true,
      message: "User restored successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while restoring user",
      error: error.message,
    });
  }
};

/**
 * Assign role to user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const assignRoleController = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body;

    if (!roleId || !["Admin", "Manager", "Employee"].includes(roleId)) {
      return res.status(400).send({
        success: false,
        message:
          "Invalid role provided. Choose between 'Admin', 'Manager', or 'Employee'.",
      });
    }

    const [updatedRows] = await User.update(
      { roleId },
      {
        where: { id },
        returning: true,
        plain: true,
      }
    );

    if (updatedRows === 0) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    const updatedUser = await User.findByPk(id);

    res.status(200).send({
      success: true,
      message: "Role assigned successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while assigning role to the user.",
      error: error.message,
    });
  }
};

/**
 * Revoke role from user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const revokeRoleController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    await User.update({ roleId: "Employee" }, { where: { id } });

    const updatedUser = await User.findByPk(id);

    res.status(200).send({
      success: true,
      message: "Role revoked successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while revoking role from the user.",
      error: error.message,
    });
  }
};
