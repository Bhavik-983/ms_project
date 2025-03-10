import Joi from "joi";
import messages from "../utilities/messages.js";
import mongoose from "mongoose";

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid postId format.");
  }
  return value;
}, "ObjectId Validation");

//auth_schema
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

// follower_schema
export const userIdSchema = Joi.object({
  userId: objectId.required().messages({
    "string.empty": "User id is required.",
  }),
}).unknown(true);

export const requestSchema = Joi.object({
  status: Joi.string().valid("ACCEPTED").required().messages({
    "string.empty": "Status is required.",
  }),
}).unknown(true);

export const followListSchema = Joi.object({
  status: Joi.string().valid("ACCEPTED","REJECT").required().messages({
    "string.empty": "Status is required.",
  }),
}).unknown(true);
//post_schema
export const postCreateSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required.",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Content is required.",
  }),
}).unknown(true);

export const fileSchema = Joi.object({
  image: Joi.array()
    .items(
      Joi.object({
        fieldname: Joi.string().valid("image").required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string()
          .valid("image/jpeg", "image/png", "image/jpg", "image/webp")
          .required(),
        size: Joi.number()
          .max(5 * 1024 * 1024)
          .required(), // 5MB max file size
      }).unknown(true) // Allow Multer's `destination`, `filename`, `path`
    )
    .min(1)
    .required(),
}).unknown(true);

export const postIdSchema = Joi.object({
  postId: objectId.required().messages({
    "string.empty": "Post id is required.",
  }),
}).unknown(true);

export const commentSchema = Joi.object({
  content: Joi.string().required().messages({
    "string.empty": "Comment content is required.",
  }),
}).unknown(true);

export const postImageSchema = Joi.object({
  public_id: Joi.string().required().messages({
    "string.empty": "Public id is required.",
  }),
}).unknown(true);

// Optional: Add file validation if needed
