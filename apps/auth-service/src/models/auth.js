import { mongoose } from "@myorg/common";

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
    profile_image: { type: String }, // Add this,
    isNewUser: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("user", userSchema);
