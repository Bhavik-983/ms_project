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
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

export const CommentModel = mongoose.model("comment", commentSchema);
