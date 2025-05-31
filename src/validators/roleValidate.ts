import Joi from "joi";

export const createRoleSchema = Joi.object({
  name: Joi.string().trim().required(),
});
