import multer from "multer";
import logger from "../utilities/logger.js";
import { v4 as uuidv4 } from "uuid";

// const deckDownloadStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/file");
//   },
//   filename: function (req, file, cb) {
//     logger.log({ level: "debug", message: req.body });
//     cb(null, uuidv4() + "." + file.originalname.split(".").pop());
//   },
// });
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
});
