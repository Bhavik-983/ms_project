export {default as db} from './database/index.js';
export * from './helper/accessTokenHelper.js';
export * from './helper/errorHelper.js';
export * from './helper/refreshTokenHelper.js';
export * from './config/index.js';
export * from './utilities/constant.js';
export { default as logger } from './utilities/logger.js';
export { default as messages }from './utilities/messages.js';
export * from './utilities/sleep.js';
export { sendBadRequest, sendSuccess } from './utilities/response/index.js';
export * from './utilities/serverUtils/shutDown.js';
export * from './utilities/serverUtils/healthCheck.js';

// Import and re-export third-party packages
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

export {
  cookieParser,
  mongoose,
  cors,
  helmet,
  morgan,
  express,
  compression,
};