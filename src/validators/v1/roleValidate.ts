import Joi from "joi";

export const createRoleSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
});
