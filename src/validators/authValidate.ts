import Joi from "joi";

export const signupSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
