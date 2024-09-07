import JWT from "jsonwebtoken";
import userModel from "../Models/userModel.js";
// import roleModel from "../Models/roleModel.js";

export const requireSignIn = (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRETKEY
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
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