import Joi from "joi";

export const createCommunitySchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
});