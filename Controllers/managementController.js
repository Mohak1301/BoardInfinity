import User from "../Models/userModel.js"; // Import Sequelize User model
import { updateUserSchema } from "../Validations/updateuserValidation.js";

export const getUsersController = async (req, res) => {
  try {
    // Fetch users who are not deleted
    const users = await User.findAll({
      where: { isDeleted: false },
      attributes: ["id", "username", "name", "email", "phone", "address"], // Adjust attributes as needed
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
      error: error.message, // Provide concise error message
    });
  }
};



export const getUsersByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch user by ID who is not deleted
    const user = await User.findOne({
      where: { id, isDeleted: false },
      attributes: ["id", "username", "name", "email", "phone", "address"], // Adjust attributes as needed
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
      error: error.message, // Provide concise error message
    });
  }
};

export const updateUsersController = async (req, res) => {
  try {
    // Parse request parameters
    const userId = req.params.id;
    const updateUser = req.body;

    // Validate request body
    const { error } = updateUserSchema.validate(updateUser);
    if (error) {
      return res.status(400).send({
        success: false,
        message: "Validation error",
        details: error.details.map((detail) => detail.message), // Provide specific validation errors
      });
    }

    // Find the user by ID who is not deleted
    const user = await User.findOne({
      where: { id: userId, isDeleted: false },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    // Update user details in the database
    await user.update(updateUser); // Use Sequelize's `update` method for updating user

    // Return success message along with the updated user
    return res.status(200).send({
      success: true,
      message: "User details updated successfully.",
      user,
    });
  } catch (error) {
    // Handle errors
    console.error("Error updating user details:", error);
    return res.status(500).send({
      success: false,
      message: "Error updating user details.",
      error: error.message, // Provide concise error message
    });
  }
};

// export const softDeleteUserController = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await userModel.findByIdAndUpdate(
//       id,
//       { isDeleted: true },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).send({
//       success: true,
//       message: "User soft deleted successfully",
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error while soft deleting user",
//       error,
//     });
//   }
// };

// export const permanentDeleteUserController = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await userModel.findByIdAndDelete(id);

//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).send({
//       success: true,
//       message: "User permanently deleted successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error while permanently deleting user",
//       error,
//     });
//   }
// };

// export const restoreUserController = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await userModel.findByIdAndUpdate(
//       id,
//       { isDeleted: false },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "User not found or already active",
//       });
//     }

//     res.status(200).send({
//       success: true,
//       message: "User restored successfully",
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error while restoring user",
//       error,
//     });
//   }
// };





// // Controller to assign a role to a user
// export const assignRoleController = async (req, res) => {
//   try {
//     const { id } = req.params; // User ID from the URL parameter
//     const { roleId } = req.body; // Role ID to assign from the request body

//     // Validate role input
//     if (!roleId || !['Admin', 'Manager', 'Employee'].includes(roleId)) {
//       return res.status(400).send({
//         success: false,
//         message: "Invalid role provided. Choose between 'Admin', 'Manager', or 'Employee'.",
//       });
//     }

//     // Find the user by ID and update their roleId
//     const user = await userModel.findByIdAndUpdate(
//       id,
//       { roleId },
//       { new: true } // Return the updated document
//     );

//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: 'User not found.',
//       });
//     }

//     res.status(200).send({
//       success: true,
//       message: 'Role assigned successfully.',
//       user,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       success: false,
//       message: 'Error while assigning role to the user.',
//       error,
//     });
//   }
// };

