import Joi from "joi";
import messages from "../utilities/messages.js";

export const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty.",
  }),
}).unknown(true);

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required.",
  }),
}).unknown(true);

export const tokenSchema = Joi.object({
  refresh_token: Joi.string().required().messages({
    "any.required": "Refresh token is required.",
  }),
});

export const setPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "any.required": "Refresh token is required.",
  }),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be 8-20 characters long and include uppercase, lowercase, number, and special character.",
      "any.required": "Password is required.",
    }),
}).unknown(true);

export const changePasswordSchema = Joi.object({
  password: Joi.string().required().messages({
    "any.required": "Old password is required.",
  }),
  new_password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/)
    .required()
    .messages({
      "string.pattern.base":
        "New password must be 8-20 characters long and include uppercase, lowercase, number, and special character.",
      "any.required": "New password is required.",
    }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
  }),
});

export const verifyTokenSchema = Joi.object({
  token: Joi.string().required().messages({
    "any.required": "Token is required.",
  }),
});
