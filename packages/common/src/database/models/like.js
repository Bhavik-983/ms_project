import mongoose from "mongoose";

const likeSchema = await mongoose.Schema(
  {
    fk_post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post", // Reference to your Post model
    },
    fk_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to your User model
    },
    is_like: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const LikeModel = mongoose.model("like", likeSchema);
