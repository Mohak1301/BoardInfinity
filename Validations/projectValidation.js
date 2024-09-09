import Joi from "joi";

const ProjectSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": `"name" should be a type of 'text'`,
    "string.empty": `"name" cannot be an empty field`,
    "string.min": `"name" should have a minimum length of {#limit}`,
    "string.max": `"name" should have a maximum length of {#limit}`,
    "any.required": `"name" is a required field`,
  }),
  description: Joi.string().max(500).optional().allow('').messages({
    "string.base": `"description" should be a type of 'text'`,
    "string.max": `"description" should have a maximum length of {#limit}`,
  }),
  assignedTo: Joi.array().items(
    Joi.number().integer().positive().messages({
      "number.base": `"assignedTo" should contain valid numbers`,
      "number.integer": `"assignedTo" should be an integer`,
      "number.positive": `"assignedTo" should be a positive number`,
    })
  ).optional().messages({
    "array.base": `"assignedTo" should be an array`,
  })
});

export default ProjectSchema;
