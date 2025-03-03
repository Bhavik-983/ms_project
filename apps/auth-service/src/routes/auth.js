import {
  changePasswordSchema,
  express,
  forgotPasswordSchema,
  loginSchema,
  setPasswordSchema,
  signupSchema,
  tokenSchema,
  validateSchema,
  verifyTokenSchema,
} from "@myorg/common";
import {
  changePassword,
  forgotPassword,
  generateNewAccessAndRefreshToken,
  login,
  registration,
  setPassword,
  verifyToken,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/registration", validateSchema(signupSchema), registration);

router.post("/login", validateSchema(loginSchema), login);

router.post(
  "/generate/new/token",
  validateSchema(tokenSchema),
  generateNewAccessAndRefreshToken
);

router.post("/set/password", validateSchema(setPasswordSchema), setPassword);

router.post(
  "/change/password",
  validateSchema(changePasswordSchema),
  changePassword
);

router.post("/send/link", validateSchema(forgotPasswordSchema), forgotPassword);

router.post(
  "/verify/token/:token",
  validateSchema({ param: verifyTokenSchema }),
  verifyToken
);

export default router;
