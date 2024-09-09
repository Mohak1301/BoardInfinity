import Joi from "joi";

// Validation schema for updating user details
export const updateUserSchema = Joi.object({
  username: Joi.string().optional(),
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  role: Joi.string().optional(),
});
