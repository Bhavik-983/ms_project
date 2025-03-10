import fs from "fs";
import { sendBadRequest } from "../../utilities/response/index.js";
import { errorHelper } from "../../helper/errorHelper.js";
import { cloudinary } from "../../config/index.js";

export const validateSchema = (schemas) => async (req, res, next) => {
  try {
    const errors = [];

    if (schemas.body) {
      const { error } = schemas.body.validate(req.body, {
        abortEarly: false,
        convert: true,
        stripUnknown: true,
      });
      if (error) errors.push(...error.details.map((detail) => detail.message));
    }

    if (schemas.query) {
      const { error } = schemas.query.validate(req.query, {
        abortEarly: false,
        convert: true,
      });
      if (error) errors.push(...error.details.map((detail) => detail.message));
    }

    if (schemas.params) {
      const { error } = schemas.params.validate(req.params, {
        abortEarly: false,
        convert: true,
      });
      if (error) errors.push(...error.details.map((detail) => detail.message));
    }

    if (schemas.files && req.files) {
      const { error } = schemas.files.validate(req.files, {
        abortEarly: false,
      });
      if (error) errors.push(...error.details.map((detail) => detail.message));
    }

    if (errors.length > 0) {
      await cleanupUploadedFiles(req);
      return sendBadRequest(res, errors[0], errors);
    }

    next();
  } catch (e) {
    await cleanupUploadedFiles(req);
    return sendBadRequest(res, errorHelper(e, "VALIDATE_SCHEMA"));
  }
};

const cleanupUploadedFiles = async (req) => {
  if (req.files) {
    for (const key of Object.keys(req.files)) {
      await deleteFiles(req.files[key]);
    }
  }
  if (req.file) {
    await deleteFile(req.file.path);
  }
};

export const deleteFiles = async (files) => {
  return Promise.all(
    files.map((file) => fs.promises.unlink(file.path).catch(() => {}))
  );
};

export const deleteFile = async (path) => {
  return fs.promises.unlink(path).catch(() => {});
};

export const deleteFromCloudinary = async (path, res) => {
  try {
    if (path.endsWith("/")) {
      // Folder deletion logic
      const { resources } = await cloudinary.api.resources({
        type: "upload",
        prefix: path, // Folder path like "folderName/" or "folderName/subfolderName/"
        max_results: 500,
      });

      if (resources.length === 0) {
        console.log(`No files found in folder: ${path}`);
        return true; // Nothing to delete
      }

      // Delete all files in the folder
      const deletePromises = resources.map((file) =>
        cloudinary.uploader.destroy(file.public_id)
      );
      await Promise.all(deletePromises);

      console.log(`All files deleted from folder: ${path}`);
      return true;
    } else {
      // Single file deletion logic
      const result = await cloudinary.uploader.destroy(path);

      if (result.result === "ok") {
        return true; // File deleted successfully
      } else {
        return sendBadRequest(res, `File not found: ${path}`);
      }
    }
  } catch (error) {
    return sendBadRequest(res, errorHelper(error, "DELETE_FROM_CLOUDINARY"));
  }
};
