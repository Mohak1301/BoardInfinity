import User from "../Models/userModel.js"; // Ensure the path to the User model is correct
import JWT from "jsonwebtoken";
import { hashPassword, comparePassword } from "../Helper/authHelper.js"; // Confirm the path to helper functions
import {loginSchema,signupSchema} from "../Validations/authvalidation.js"

/**
 * Controller for admin user registration.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const signupAdminController = async (req, res) => {
  try {
    // Validate request body against the signup schema
    await signupSchema.validateAsync(req.body);

    const { username, name, email, password, phone, address, role } = req.body;

    // Ensure only admins can register new users
    if (role !== "Admin") {
      return res.status(403).send({
        success: false,
        message: "Access denied. Only admins can register new users.",
      });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Email is already registered. Please login.",
      });
    }

    // Hash the user's password before saving
    const hashedPassword = await hashPassword(password);

    // Create a new user in the database
    const user = await User.create({
      username,
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      roleId: role,
    });

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    // Handle validation errors
    if (error.isJoi) {
      return res.status(400).send({
        success: false,
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    console.error("Error during user registration:", error);
    res.status(500).send({
      success: false,
      message: "Error during registration",
      error: error.message,
    });
  }
};

/**
 * Controller for user login.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const loginController = async (req, res) => {
  try {
    // Validate request body against the login schema
    await loginSchema.validateAsync(req.body);

    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // Verify the user's password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate a JWT token for the user
    const token = JWT.sign({ id: user.id }, process.env.JWT_SECRETKEY, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.roleId,
      },
      token,
    });
  } catch (error) {
    // Handle validation errors
    if (error.isJoi) {
      console.log("Validation error:", error.details);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    console.log("Error during login:", error);
    res.status(500).send({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
};

/**
 * Controller for user registration (non-admin roles).
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const registerController = async (req, res) => {
  try {
    // Validate request body against the signup schema
    await signupSchema.validateAsync(req.body);

    const { username, name, email, password, phone, address, role } = req.body;

    // Check if the role is valid
    if (role !== "Manager" && role !== "Employee") {
      return res.status(400).send({
        success: false,
        message: "Invalid role specified",
      });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Email is already registered. Please login.",
      });
    }

    // Hash the user's password before saving
    const hashedPassword = await hashPassword(password);

    // Create a new user in the database
    const user = await User.create({
      username,
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      roleId: role,
    });

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).send({
      success: false,
      message: "Error during registration",
      error: error.message,
    });
  }
};
