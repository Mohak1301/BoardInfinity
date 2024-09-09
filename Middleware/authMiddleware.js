import JWT from "jsonwebtoken";
import User from "../Models/userModel.js"; // Import Sequelize User model

// Middleware to verify JWT and attach user details to req.user
export const requireSignIn = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization;
    // console.log(token)
    

    if (!token) {
      return res.status(401).send({ message: "Unauthorized: No token provided" });
    }

    // Verify the token using JWT_SECRETKEY
    const decode = JWT.verify(token, process.env.JWT_SECRETKEY);
    // console.log(decode.id)

    // Find the user by ID from the decoded token
    const user = await User.findByPk(decode.id); // Use Sequelize's `findByPk` method to find the user by primary key
    // console.log(user)
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Attach the user's ID and roleId to the request object for further use
    req.user = {
      _id: user.id, // Sequelize uses `id` as the default primary key field
      roleId: user.roleId, // Assuming roleId is a string like "Admin", "Manager", etc.
    };

    

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in requireSignIn middleware:", error);
    res.status(401).send({
      success: false,
      message: "Unauthorized: Invalid or expired token",
      error,
    });
  }
};

// Middleware to check if the user is Admin
export const isAdmin = (req, res, next) => {
  try {
    if (req.user.roleId === "Admin") {
      console.log("Admin access granted.");
      next(); // If user is Admin, proceed to the next middleware or route handler
    } else {
      res.status(403).send({ message: "Access Denied: Admins only" });
    }
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Middleware to check if the user is Admin or Manager
export const isAdminorManager = (req, res, next) => {
  try {
    if (req.user.roleId === "Admin" || req.user.roleId === "Manager") {
      console.log("Admin or Manager access granted.");
      next(); // If user is Admin or Manager, proceed to the next middleware or route handler
    } else {
      res.status(403).send({ message: "Access Denied: Admin or Manager only" });
    }
  } catch (error) {
    console.error("Error in isAdminorManager middleware:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
