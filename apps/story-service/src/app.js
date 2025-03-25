import {
  createError,
  express,
  path,
  dirname,
  cookieParser,
  compression,
  cors,
  helmet,
  morgan,
  logger,
  bodyParser,
  StoryModel,
  config,
  cron,
} from "@myorg/common";
import { fileURLToPath } from "url";
import router from "./routes/story.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(rateLimiter);
app.use(compression());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", router);

app.use(
  morgan("combined", {
    stream: logger.stream,
    skip: (req, res) => {
      // Skip to log health endpoint
      return req.url === "/health";
    },
  })
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// cron.schedule(config.CRON_JOB, async () => {
//   // Runs every hour
//   try {
//     const expiredStories = await StoryModel.find({
//       createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
//     });

//     for (const story of expiredStories) {
//       const publicId = story.media_url.split("/").pop().split(".")[0]; // Extract public ID
//       await cloudinary.uploader.destroy(
//         `${config.MEDIA_ROOT}/stories/${story.fk_user_id
//           .toString()
//           .slice(-5)}/${publicId}`
//       );
//       await story.remove();
//     }

//     console.log(`${expiredStories.length} expired stories deleted.`);
//   } catch (error) {
//     console.error("Error deleting expired stories:", error);
//   }
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
