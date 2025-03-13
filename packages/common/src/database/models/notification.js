import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["LIKE", "COMMENT", "FOLLOW","COMMENT_REPLAY"] },
    fk_sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    fk_receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    fk_post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
    message: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model(
  "notification",
  notificationSchema
);
