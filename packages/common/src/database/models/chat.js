import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    fk_sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    fk_receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    message: { type: String },
    media_url: { type: String },
    media_type: {
      type: String,
      enum: ["image", "video", "file"],
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ChatModel = mongoose.model("chat", chatSchema);
