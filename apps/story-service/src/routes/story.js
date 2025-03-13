import { isUser, express, cloudinaryUpload } from "@myorg/common";
import { createStory, deleteStory } from "../controllers/story.js";

const router = express.Router();

router.post("/create", isUser, cloudinaryUpload.single("media"), createStory);

router.delete("/:storyId", isUser, deleteStory);

export default router;
