import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  fk_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  media_url: { type: String, required: true }, // Image/Video URL
  media_type: { type: String, enum: ["image", "video"], required: true },
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }], // Users who viewed the story
  createdAt: { type: Date, default: Date.now, expires: "24h" }, // Auto-delete after 24h
});

export const StoryModel = mongoose.model("story", storySchema);
