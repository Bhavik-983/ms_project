"use strict";

import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default {
  NETWORK: {
    ETH: {
      RPC_API: process.env.RPC_API,
    },
  },

  DATABASE: {
    MONGO: {
      URI: process.env.MONGO_URI,
    },
  },

  LOGGER: {
    LEVEL: process.env.LOG_LEVEL || "debug",
  },

  API_KEY: process.env.API_KEY,

  // admin id
  ADMIN_ID: process.env.ADMIN_ID,
  // admin password
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

  // jwt secret
  USER_SECRET: process.env.USER_SECRET,
  USER_REFRESH_SECRET: process.env.USER_REFRESH_SECRET,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SG_MAIL: process.env.SG_MAIL,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
  MEDIA_ROOT: process.env.MEDIA_ROOT,
  CRON_JOB: process.env.CRON_JOB,
};

export { cloudinary };
