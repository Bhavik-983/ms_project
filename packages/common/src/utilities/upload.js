import config, { cloudinary } from "../config/index.js";

export const imageUploader = async (path, uid) => {
  return await cloudinary.uploader.upload(path, {
    folder: `${config.MEDIA_ROOT}/${uid}`, // Optional folder in Cloudinary
  });
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
