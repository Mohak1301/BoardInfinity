import User from "../Models/userModel.js"; // Update import path if necessary
import JWT from "jsonwebtoken";
import { hashPassword ,comparePassword} from "../Helper/authHelper.js"; // Make sure this path is correct
import { signupSchema,loginSchema} from "../Validations/authValidation.js";


export const signupAdminController = async (req, res) => {
  try {
    // Validate request body
    await signupSchema.validateAsync(req.body); // Throws an error if validation fails

    const { username, name, email, password, phone, address, role } = req.body;

    // Check if the role is "admin"
    if (role !== "Admin") {
      return res.status(403).send({
        success: false,
        message: "Access denied. Only admins can register new users.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Already registered. Please login.",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password); // Assuming hashPassword is a utility function you've defined

    // Save new user to the database
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
    // Handle validation errors separately
    if (error.isJoi) {
      return res.status(400).send({
        success: false,
        message: "Validation error",
        details: error.details.map((detail) => detail.message), // Provide specific validation errors
      });
    }

    console.error("Error in registration:", error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};




export const loginController = async (req, res) => {
  try {
    // Validate request body using Joi
    await loginSchema.validateAsync(req.body); // Throws an error if validation fails

    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ where: { email } }); // Ensure you're importing the correct User model
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // Compare passwords
    const match = await comparePassword(password, user.password); // Assuming comparePassword is a utility function
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Token generation
    const token = JWT.sign({ id: user.id }, process.env.JWT_SECRETKEY, {
      expiresIn: "7d",
    });
    
    res.status(200).send({
      success: true,
      message: "Login successfully",
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
    if (error.isJoi) {
      // Log the validation error
      console.log("Validation error:", error.details);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.details.map((detail) => detail.message), // Provide specific validation errors
      });
    }

    console.log("Error in login:", error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error: error.message, // Simplify the error message
    });
  }
};


export const registerController = async (req, res) => {
  try {
    await signupSchema.validateAsync(req.body); // Throws an error if validation fails
    const { username, name, email, password, phone, address, role } = req.body;

  
    // Check user existence
    const existingUser = await User.findOne({ where: { email } });
    if (role !== "Manager" && role !== "Employee") {
      return res.status(400).send({ message: "Invalid role" });
    }
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered. Please login.",
      });
    }

    // Register user
    const hashedPassword = await hashPassword(password);

    // Save new user
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
      user,
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};