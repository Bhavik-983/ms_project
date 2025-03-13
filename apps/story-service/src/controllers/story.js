import {
  config,
  deleteFromCloudinary,
  errorHelper,
  messages,
  sendBadRequest,
  sendSuccess,
  StoryModel,
} from "@myorg/common";

export const createStory = async (req, res) => {
  try {
    // Check if file exists in request
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const story = new StoryModel({
      fk_user_id: req.user.id,
      media_url: req.file.path, // Cloudinary URL is directly in req.file.path
      media_type: req.file.resource_type === "video" ? "video" : "image",
    });

    await story.save();
    return sendSuccess(res, messages.storyCreated);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "CREATE_STORY"));
  }
};

export const getStories = async (req, res) => {
  try {
    // Check if file exists in request
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const story = await StoryModel.find({
      fk_user_id: req.user.id,
    });
    return sendSuccess(res, story, messages.storyGetSuccess);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "GET_STORIES"));
  }
};

export const updateStory = async (req, res) => {
  try {
    const story = await StoryModel.findOne({
      _id: req.params.storyId,
      fk_user_id: req.user.id,
    });
    if (!story) return sendBadRequest(res, messages.storyNotFound);
    if (req.file) {
      const publicId = story.media_url.split("/").pop().split(".")[0]; // Extract public ID
      deleteFromCloudinary(
        `${config.MEDIA_ROOT}/stories/${req.user._id
          .toString()
          .slice(-5)}/${publicId}`
      );
      story.media_url = req.file.path; // Cloudinary URL is directly in req.file.path
      story.media_type = req.file.resource_type === "video" ? "video" : "image";
    }
    await story.save();
    return sendSuccess(res, story, messages.storyUpdated);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "UPDATE_STORY"));
  }
};

export const deleteStory = async (req, res) => {
  try {
    // Check if file exists in request
    const story = await StoryModel.findOne({
      _id: req.params.storyId,
    });
    const publicId = story.media_url.split("/").pop().split(".")[0]; // Extract public ID
    await deleteFromCloudinary(
      `${config.MEDIA_ROOT}/stories/${req.user._id
        .toString()
        .slice(-5)}/${publicId}`
    );
    await story.remove();
    return sendSuccess(res, messages.storyDeleted);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "DELETE_STORY"));
  }
};
