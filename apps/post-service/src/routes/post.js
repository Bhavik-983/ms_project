import {
  commentSchema,
  express,
  fileSchema,
  isUser,
  postCreateSchema,
  postIdSchema,
  postImageSchema,
  upload,
  validateSchema,
} from "@myorg/common";
import {
  commentOnPost,
  commentReply,
  createPost,
  deleteFileOfPost,
  deletePostById,
  getPostById,
  likeInPost,
  listOfPublicPosts,
  updatePostById,
} from "../controllers/post.js";
const router = express.Router();

router.post(
  "/create",
  isUser,
  upload.fields([{ name: "image" }]),
  validateSchema({ body: postCreateSchema, files: fileSchema }),
  createPost
);

router.get("/list", isUser, listOfPublicPosts);

router.get(
  "/:postId",
  validateSchema({ params: postIdSchema }),
  isUser,
  getPostById
);

router.put(
  "/:postId",
  validateSchema({ params: postIdSchema }),
  isUser,
  upload.fields([{ name: "image" }]),
  updatePostById
);

router.post(
  "/like/:postId",
  validateSchema({ params: postIdSchema }),
  isUser,
  likeInPost
);

router.post(
  "/comment/:postId",
  validateSchema({ params: postIdSchema, body: commentSchema }),
  isUser,
  commentOnPost
);

router.post("/replay/:commentId", isUser, commentReply);

router.delete(
  "/:postId",
  validateSchema({ params: postIdSchema }),
  isUser,
  deletePostById
);

router.patch(
  "/:postId",
  validateSchema({ body: postImageSchema }),
  isUser,
  deleteFileOfPost
);

export default router;
