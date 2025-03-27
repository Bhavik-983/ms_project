
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
  config,
  axios,
} from "@myorg/common";
import { fileURLToPath } from "url";
import routes from "./routes/auth.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(rateLimiter);
app.use(compression());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Set to the exact frontend origin
    credentials: true, // Allow credentials
  })
);
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  morgan("combined", {
    stream: logger.stream,
    skip: (req, res) => {
      // Skip to log health endpoint
      return req.url === "/health";
    },
  })
);

app.use("/", routes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

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
