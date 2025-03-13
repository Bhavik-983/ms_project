import multer from "multer";
import logger from "../utilities/logger.js";
import { v4 as uuidv4 } from "uuid";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/index.js";
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

// const cloudinaryStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: (req) =>
//       `instaclone/stories/${req.user._id.toString().slice(-5)}`,
//     resource_type: "auto",
//   },
// });

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req) => `instaclone/chat/${req.user._id.toString().slice(-5)}`,
    resource_type: "auto",
  },
});

export const cloudinaryUpload = multer({ storage: cloudinaryStorage });
