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

  // sendgrid
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SG_MAIL: process.env.SG_MAIL,
  
  RABBITMQ_URL: process.env.RABBITMQ_URL,
  MEDIA_ROOT: process.env.MEDIA_ROOT,
  CRON_JOB: process.env.CRON_JOB,
  
  //google auth
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
  GOOGLE_CONSENT_URI:`https://accounts.google.com/o/oauth2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`,
  TOKEN_RESPONSE_URI:`https://oauth2.googleapis.com/token`,
  USER_INFO_URI:`https://www.googleapis.com/oauth2/v3/userinfo`,


  //github auth
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,
  GITHUB_AUTH_URI:`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=user:email`,
  GITHUB_TOKEN_RESPONSE_URI:`https://github.com/login/oauth/access_token`,
  GITHUB_USER_INFO_URI:`https://api.github.com/user`,
  GITHUB_USER_EMAIL:`https://api.github.com/user/emails`,
  

  //facebook auth
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
  FACEBOOK_REDIRECT_URI: process.env.FACEBOOK_REDIRECT_URI,
  FACEBOOK_AUTH_URI:`https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&scope=email,public_profile`,
  FACEBOOK_TOKEN_RESPONSE_URI:`https://graph.facebook.com/v18.0/oauth/access_token`,
  FACEBOOK_USER_INFO_URI:`https://graph.facebook.com/v19.0/me?fields=id,name,email,picture`

};


export { cloudinary };
