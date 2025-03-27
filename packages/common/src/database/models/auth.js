import mongoose from "mongoose";

const userSchema = await mongoose.Schema(
  {
    name: { type: String },
    age: { type: Number },
    email: { type: String, unique: true },
    password: { type: String },
    refresh_token_id: { type: String, default: null }, // Add this
    access_token_id: { type: String, default: null }, // Add this,
    set_password_token: { type: String },
    set_password_token_exp_time: { type: Date }, // Add this,
    bio: { type: String, default: "" },
    website: { type: String, default: "" },
    image: {
      type: String,
    },
    profile_image: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    }, // Add this,
    account_type: {
      type: String,
      enum: ["PUBLIC", "PRIVATE"],
      default: "PUBLIC",
    },
    social_auth_id:{
      type:String
    },
    isNewUser: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("user", userSchema);
