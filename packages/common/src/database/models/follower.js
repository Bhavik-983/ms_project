import mongoose from "mongoose";

const followerSchema = await mongoose.Schema(
  {
    fk_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to your User model
    },
    fk_followers_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to your User model
    },
    fk_following_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to your User model
    },
    status: {
      type: String,
      enum: ["REQUESTED", "ACCEPTED"],
    },
  },
  { timestamps: true }
);

export const FollowerModel = mongoose.model("follower", followerSchema);
