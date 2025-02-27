import { express } from "@myorg/common";
import { registration } from "../controllers/auth.js";

const router = express.Router();


router.post('/registration', registration);

export default router