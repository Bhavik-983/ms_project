import express from 'express';
import httpProxy from 'express-http-proxy';
import dotenv from "dotenv"
const router = express.Router();
dotenv.config()
const authServiceProxy = httpProxy(process.env.AUTH_SERVICE_URL);
const userServiceProxy = httpProxy(process.env.USER_SERVICE_URL);

router.use('/auth', (req, res, next) => authServiceProxy(req, res, next));
router.use('/user', (req, res, next) => userServiceProxy(req, res, next));

export default router;
