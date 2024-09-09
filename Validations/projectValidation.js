import Joi from "joi";

// Define a UUID pattern for validation
const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

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
    Joi.string().pattern(uuidPattern).messages({
      "string.base": `"assignedTo" should contain valid UUID strings`,
      "string.pattern.base": `"assignedTo" should be a valid UUID`,
    })
  ).optional().messages({
    "array.base": `"assignedTo" should be an array`,
  })
});

export default ProjectSchema;
