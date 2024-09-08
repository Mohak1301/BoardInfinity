import JWT from "jsonwebtoken";
import userModel from "../Models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    // Verify the token from the Authorization header
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ message: "Unauthorized: No token provided" });
    }
    const decode = JWT.verify(token, process.env.JWT_SECRETKEY);

    // Find the user by ID from the decoded token
    const user = await userModel.findById(decode._id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Attach the user's ID and roleId to the request object
    req.user = {
      _id: user._id,
      roleId: user.roleId, // Assuming roleId is defined in the user model
    };

    console.log(req.user); // Log the user details for debugging

    next();
  } catch (error) {
    // console.log(error);
    res.status(401).send({
      success: false,
      message: "Unauthorized: Invalid token",
      error,
    });
  }
};


export const isAdmin = async (req, res, next) => {
  console.log(req.user._id)

  try {
    const user = await userModel.findById(req.user._id).populate("roleId");
    console.log(user)
    console.log("hello")
    if (user.roleId === "Admin") {
      next();
    } else {
      res.status(403).send({ message: "Access Denied, Admin Only" });
    }
  } catch (error) {
    res.status(403).send({ message: "Access Denied, Admin Only" });
  }
};

export const isAdminorManager = async (req, res, next) => {


  try {
    const user = await userModel.findById(req.user._id).populate("roleId");
   
    if (user.roleId === "Admin" || user.roleId==="Manager") {
      next();
    } else {
      res.status(403).send({ message: "Access Denied, Admin or Manager Only" });
    }
  } catch (error) {
    res.status(403).send({ message: "Access Denied, Admin or Manager Only" });
  }
};