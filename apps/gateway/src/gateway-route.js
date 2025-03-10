import express from "express";
import httpProxy from "express-http-proxy";
import dotenv from "dotenv";
const router = express.Router();
dotenv.config();
const authServiceProxy = httpProxy(process.env.AUTH_SERVICE_URL);
const postServiceProxy = httpProxy(process.env.POST_SERVICE_URL);

router.use("/user", (req, res, next) => authServiceProxy(req, res, next));
router.use("/post", (req, res, next) => postServiceProxy(req, res, next));

export default router;
