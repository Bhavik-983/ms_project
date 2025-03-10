import {
  cloudinary,
  CommentModel,
  deleteFromCloudinary,
  errorHelper,
  LikeModel,
  messages,
  PostModel,
  sendBadRequest,
  sendSuccess,
  sendToQueue,
} from "@myorg/common";

export const createPost = async (req, res) => {
  try {
    const data = req?.body;

    const newPost = await new PostModel({
      fk_user_id: req.user._id,
      title: data.title,
      description: data.description,
      tags: data.tags,
      visibility: data.visibility,
    }).save();

    const uploadedImages = [];
    if (req?.files) {
      if (req.files.image.length > 0) {
        for (const file of req.files.image) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: `myapp_images/post_images/${
              req.user._id.toString().slice(-5) +
              newPost._id.toString().slice(-5)
            }`,
          });
          uploadedImages.push({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    }
    newPost.images = uploadedImages;
    await newPost.save();
    return sendSuccess(res, messages.postCreated);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "CREATE_POST"));
  }
};

export const listOfPublicPosts = async (req, res, next) => {
  try {
    const posts = await PostModel.find({ visibility: "public" });
    return sendSuccess(res, posts, messages.listOfPublicPosts);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "LIST_OF_PUBLIC_POSTS"));
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await PostModel.findOne({ _id: req.params.postId });
    if (!post) return sendBadRequest(res, messages.postNotFound);
    return sendSuccess(res, post, messages.postGetSuccessfully);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "GET_POST_BY_ID"));
  }
};

export const updatePostById = async (req, res, next) => {
  try {
    const data = req.body;

    const post = await PostModel.findOne({
      _id: req.params.postId,
      fk_user_id: req.user._id,
    });
    if (!post) return sendBadRequest(res, messages.postNotFound);

    if (data.title) post.title = data.title;

    if (data.description) post.description = data.description;

    if (data.visibility) post.visibility = data.visibility;

    let uploadedImages = [];
    if (req?.files) {
      if (req.files.image.length > 0) {
        for (const file of req.files.image) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: `myapp_images/post_images/${
              req.user._id.toString().slice(-5) + post._id.toString().slice(-5)
            }`,
          });
          uploadedImages.push({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
      post.images = [...post.images, ...uploadedImages];
    }

    await post.save();
    return sendSuccess(res, post, messages.postUpdatedSuccessfully);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "UPDATE_POST"));
  }
};

export const likeInPost = async (req, res, next) => {
  try {
    const post = await PostModel.findOne({ _id: req.params.postId });
    if (!post) return sendBadRequest(res, messages.postNotFound);

    let like = await LikeModel.findOne({
      fk_post_id: post._id,
      fk_user_id: req.user._id,
    });

    if (!like) {
      await new LikeModel({
        fk_post_id: post._id,
        fk_user_id: req.user._id,
        is_like: true,
      }).save();
    } else {
      like.is_like = like.is_like ? false : true;
      await like.save();
    }
    sendToQueue("notification_queue", {
      type: "like",
      fk_sender_id: req.user._id,
      fk_receiver_id: post.fk_user_id,
      fk_post_id: post._id,
      message: "liked your post",
    });
    return sendSuccess(res, post, messages.likeInPostSuccessfully);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "LIKE_POST"));
  }
};

export const commentOnPost = async (req, res, next) => {
  try {
    const post = await PostModel.findOne({ _id: req.params.postId });
    if (!post) return sendBadRequest(res, messages.postNotFound);

    await new CommentModel({
      fk_post_id: req.params.postId,
      fk_user_id: req.user._id,
      text: req.body.content,
    }).save();
    return sendSuccess(res, post, messages.commentSuccess);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "COMMENT_ON_POST"));
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await CommentModel.findOne({
      fk_post_id: req.params.postId,
      fk_user_id: req.user._id,
    });
    return sendSuccess(res, comments, messages.commentsGetSuccessfully);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "GET_COMMENTS"));
  }
};

export const deleteComments = async (req, res) => {
  try {
    const comment = await CommentModel.findOne({
      fk_post_id: req.params.postId,
      fk_user_id: req.user._id,
    });
    await comment.remove();
    return sendSuccess(res, messages.commentDeleted);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "DELETE_COMMENTS"));
  }
};

export const deletePostById = async (req, res, next) => {
  try {
    const post = await PostModel.findOne({
      _id: req.params.postId,
      fk_user_id: req.user._id,
    });
    if (!post) return sendBadRequest(res, messages.postNotFound);

    await deleteFromCloudinary(
      `myapp_images/post_images/${
        req.user._id.toString().slice(-5) + post._id.toString().slice(-5)
      }/`
    );
    await post.remove();
    return sendSuccess(res, post, messages.postDeletedSuccess);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "DELETE_POST"));
  }
};

export const deleteFileOfPost = async (req, res, next) => {
  try {
    const post = await PostModel.findOne({
      _id: req.params.postId,
      fk_user_id: req.user._id,
    });
    if (!post) return sendBadRequest(res, messages.postNotFound);

    await deleteFromCloudinary(req.body.public_id);
    post.images = post.images.filter(
      (image) => image.public_id !== req.body.public_id
    );
    await post.save();
    return sendSuccess(res, post, messages.imageDeletedSuccess);
  } catch (e) {
    return sendBadRequest(res, errorHelper(e, "DELETE_IMAGE"));
  }
};
