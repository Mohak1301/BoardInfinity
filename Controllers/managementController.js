import userModel from "../Models/userModel.js";

export const getUsersController = async (req, res) => {
  try {
    const users = await userModel
      .find({ isDeleted: false })
      .populate("name")
      .populate("email")
      .populate("phone")
      .populate("address");
    res.status(200).send({
      success: true,
      counTotal: users.length,
      message: "All Users ",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while Getting users",
      error,
    });
  }
};

export const getUsersByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById({ id, isDeleted: false });
    res.status(200).send({
      success: true,
      message: "User Found ",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "No User Found",
      error,
    });
  }
};

export const updateUsersController = async (req, res) => {
  try {
    // Parse request parameters
    const userId = req.params.id;
    const updateUser = req.body;

    // Find the course by ID
    const user = await userModel.findById({ userId, isDeleted: false });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found." });
    }

    // Update course details in the database
    const updatedUser = await userModel.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });

    // Return success message along with the updated course
    return res.status(200).send({
      success: true,
      message: "User details updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error updating user details.",
      error,
    });
  }
};

export const softDeleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User soft deleted successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while soft deleting user",
      error,
    });
  }
};

export const permanentDeleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
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
      error,
    });
  }
};

export const restoreUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found or already active",
      });
    }

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
      error,
    });
  }
};





// Controller to assign a role to a user
export const assignRoleController = async (req, res) => {
  try {
    const { id } = req.params; // User ID from the URL parameter
    const { roleId } = req.body; // Role ID to assign from the request body

    // Validate role input
    if (!roleId || !['Admin', 'Manager', 'Employee'].includes(roleId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid role provided. Choose between 'Admin', 'Manager', or 'Employee'.",
      });
    }

    // Find the user by ID and update their roleId
    const user = await userModel.findByIdAndUpdate(
      id,
      { roleId },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Role assigned successfully.',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error while assigning role to the user.',
      error,
    });
  }
};

