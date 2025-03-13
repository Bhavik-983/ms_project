import mongoose from "mongoose";

const commentSchema = await mongoose.Schema(
  {
    fk_post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
    fk_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    fk_parent_comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment", // Reference to your Comment model
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

export const CommentModel = mongoose.model("comment", commentSchema);
