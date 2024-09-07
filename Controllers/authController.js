import userModel from "../Models/userModel.js"; // Ensure this import points to your updated User model file
// import roleModel from "../Models/roleModel.js"; // Ensure this import points to your Role model file
import {hashPassword,comparePassword} from "../Helper/authHelper.js"
import JWT from "jsonwebtoken";


export const signupController = async (req, res) => {
  try {
    const { username, name, email, password, phone, address, answer, role } = req.body;

    // Check if role is Admin and if there's already an Admin user
    if (role === "Admin") {
      const existingAdmin = await userModel.findOne({ roleId: "Admin" });
      

      if (existingAdmin) {
        return res.status(400).send({ error: "Only one admin can exist." });
      }
    }

    // Validations
    if (!username) return res.status(400).send({ error: "Username is Required" });
    if (!name) return res.status(400).send({ error: "Name is Required" });
    if (!email) return res.status(400).send({ message: "Email is Required" });
    if (!password) return res.status(400).send({ message: "Password is Required" });
    if (!phone) return res.status(400).send({ message: "Phone no is Required" });
    if (!address) return res.status(400).send({ message: "Address is Required" });
    

    // Check user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered. Please login.",
      });
    }

    // Register user
    const hashedPassword = await hashPassword(password); // Assuming hashPassword is a utility function you've defined

    // Get Role ID
  

    // Save
    const user = await new userModel({
      username,
      name,
      email,
      phone,
      address,
      password: hashedPassword,
   
      roleId: role,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};



export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    console.log(user)
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRETKEY, {
      expiresIn: "7d",
    });
    // console.log(token)
    
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        adddress: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

export const registerController = async (req, res) => {
  try {
    const { username, name, email, password, phone, address,  role } = req.body;

  
    

    // Validations
    if (!username) return res.status(400).send({ error: "Username is Required" });
    if (!name) return res.status(400).send({ error: "Name is Required" });
    if (!email) return res.status(400).send({ message: "Email is Required" });
    if (!password) return res.status(400).send({ message: "Password is Required" });
    if (!phone) return res.status(400).send({ message: "Phone no is Required" });
    if (!address) return res.status(400).send({ message: "Address is Required" });
    if (!role) return res.status(400).send({ message: "Role is Required"});

    

    // Check user
    const existingUser = await userModel.findOne({ email });
    if(role !=="Manager" && role!=="Employee") {
      return res.status(400).send({ message: "Invalid role" });
    }
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered. Please login.",
      });
    }

    // Register user
    const hashedPassword = await hashPassword(password); // Assuming hashPassword is a utility function you've defined

    // Get Role ID
  

    // Save
    const user = await new userModel({
      username,
      name,
      email,
      phone,
      address,
      password: hashedPassword,
   
      roleId: role,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};



