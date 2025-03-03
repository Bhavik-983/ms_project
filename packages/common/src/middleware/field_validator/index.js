import fs from "fs";
import { sendBadRequest } from "../../utilities/response/index.js";
import { errorHelper } from "../../helper/errorHelper.js";

export const validateSchema = (schemas) => async (req, res, next) => {
  try {
    const errors = [];

    // Validate request body
    if (schemas.body) {
      const { error } = schemas.body.validate(req.body, { abortEarly: false });
      if (error) errors.push(...error.details.map((detail) => detail.message));
    }

    // Validate query params
    if (schemas.query) {
      const { error } = schemas.query.validate(req.query, {
        abortEarly: false,
      });
      if (error) errors.push(...error.details.map((detail) => detail.message));
    }

    // Validate URL params
    if (schemas.params) {
      const { error } = schemas.params.validate(req.params, {
        abortEarly: false,
      });
      if (error) errors.push(...error.details.map((detail) => detail.message));
    }

    if (errors.length > 0) {
      // If files exist (e.g., from multer), clean up
      if (req.files) {
        const keys = Object.keys(req.files);
        for (const key of keys) {
          await deleteFiles(req.files[key]);
        }
      }

      // Send combined error response
      return sendBadRequest(res, errors[0], errors);
    }

    next();
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "VALIDATE_SCHEMA"));
  }
};

export const deleteFiles = async (medias) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      for (const mediaDelete of medias) {
        await fs.unlinkSync(mediaDelete.path);
      }
      return resolve(true);
    } catch (e) {
      return reject(e);
    }
  });
};

export const deleteFile = async (url) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      await fs.unlinkSync(url);
      return resolve(true);
    } catch (e) {
      return reject(e);
    }
  });
};
