import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    fk_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to your User model
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    tags: [
      {
        type: String, // Example: ["tech", "news", "funny"]
        trim: true,
      },
    ],
    fk_likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // Track which users liked the post
      },
    ],
    comments: [
      {
        fk_user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        text: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt fields

export const PostModel = mongoose.model("post", postSchema);
