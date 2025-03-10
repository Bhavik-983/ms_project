import {
  deleteNotificationSchema,
  express,
  isUser,
  validateSchema,
} from "@myorg/common";
import {
  deleteNotification,
  getNotifications,
} from "../controllers/notification.js";
const router = express.Router();

router.get("/list", isUser, getNotifications);

router.delete(
  "/:notificationId",
  validateSchema({ params: deleteNotificationSchema }),
  isUser,
  deleteNotification
);

export default router;
