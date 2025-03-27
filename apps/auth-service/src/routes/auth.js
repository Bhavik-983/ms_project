import {
  changePasswordSchema,
  express,
  followListSchema,
  forgotPasswordSchema,
  isUser,
  loginSchema,
  signupSchema,
  tokenSchema,
  upload,
  userIdSchema,
  validateSchema,
  verifyTokenSchema,
} from "@myorg/common";
import {
  acceptOrRejectFollowers,
  changePassword,
  followUser,
  forgotPassword,
  generateNewAccessAndRefreshToken,
  redirectGoogleAuthConsent,
  googleAuth,
  login,
  registration,
  setPassword,
  unFollowUser,
  updateProfile,
  userFollowList,
  verifyToken,
  redirectGithubAuthConsent,
  githubAuth,
  redirectFacebookAuthConsent,
  facebookAuth,
} from "../controllers/auth.js";

const router = express.Router();

router.get("/auth", redirectGoogleAuthConsent);
router.get("/google/redirect", googleAuth);

router.get("/github/auth", redirectGithubAuthConsent);
router.get("/github/redirect", githubAuth);

router.get("/facebook/auth", redirectFacebookAuthConsent);
router.get("/facebook/redirect", facebookAuth);


router.post(
  "/registration",
  validateSchema({ body: signupSchema }),
  registration
)

router.post("/login", validateSchema({ body: loginSchema }), login);

router.post(
  "/generate/new/token",
  validateSchema({ body: tokenSchema }),
  generateNewAccessAndRefreshToken
);

router.post("/set/password", upload.single("image"), setPassword);

router.post(
  "/change/password",
  validateSchema({ body: changePasswordSchema }),
  changePassword
);

router.post(
  "/send/link",
  validateSchema({ body: forgotPasswordSchema }),
  forgotPassword
);

router.post(
  "/verify/token/:token",
  validateSchema({ param: verifyTokenSchema }),
  verifyToken
);

router.put("/profile", isUser, upload.single("image"), updateProfile);

router.post(
  "/follow/:userId",
  validateSchema({ param: userIdSchema }),
  isUser,
  followUser
);

router.delete(
  "/unfollow/:userId",
  validateSchema({ param: userIdSchema }),
  isUser,
  unFollowUser
);

router.put(
  "/follow/request/:userId",
  // validateSchema({ param: userIdSchema, body: requestSchema }),
  isUser,
  acceptOrRejectFollowers
);

router.get(
  "/follow/list",
  validateSchema(followListSchema),
  isUser,
  userFollowList
);

export default router;
