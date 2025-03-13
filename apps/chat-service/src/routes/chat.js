import { cloudinaryUpload, express, isUser } from "@myorg/common";
import {
  getChatHistory,
  markAsRead,
  sendMessage,
  unreadCount,
} from "../controllers/chat.js";
const router = express.Router();

router.post(
  "/send/message/:receiverId",
  isUser,
  cloudinaryUpload.single("media"),
  sendMessage
);

router.get("/history/:receiverId", isUser, getChatHistory);

router.patch("/unread/:senderId", isUser, markAsRead);

router.get("/unread/:senderId", isUser, unreadCount);

export default router;
