import Joi from "joi";

// Validation schema for signup
export const signupSchema = Joi.object({
  username: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  role: Joi.string().required(),
});

// Validation schema for login

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
