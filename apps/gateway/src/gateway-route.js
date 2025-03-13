import express from "express";
import httpProxy from "express-http-proxy";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

// router.use(bodyParser.json({ limit: "50mb" }));
// router.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const authServiceProxy = httpProxy(process.env.AUTH_SERVICE_URL);
const postServiceProxy = httpProxy(process.env.POST_SERVICE_URL);
const storyServiceProxy = httpProxy(process.env.STORY_SERVICE_URL, {
  limit: "50mb",
});
const chatServiceProxy = httpProxy(process.env.CHAT_SERVICE_URL);

router.use("/user", (req, res, next) => authServiceProxy(req, res, next));
router.use("/post", (req, res, next) => postServiceProxy(req, res, next));
router.use("/notification", (req, res, next) =>
  notificationServiceProxy(req, res, next)
);
router.use("/story", (req, res, next) => storyServiceProxy(req, res, next));
router.use("/chat", (req, res, next) => chatServiceProxy(req, res, next));

export default router;
