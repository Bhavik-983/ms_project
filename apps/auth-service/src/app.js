
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
import { googleAuth } from "./controllers/auth.js";

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

app.get("/auth/google", async (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${config.CLIENT_ID}&redirect_uri=${config.REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;
  res.redirect(authUrl);
  await googleAuth();
});
app.use("/", routes);
// app.get("/signup/redirect", async (req, res) => {
//   const { code } = req.query;
//   if (!code)
//     return res.status(400).json({ error: "Authorization code is missing" });

//   try {
//     const tokenResponse = await axios.post(
//       "https://oauth2.googleapis.com/token",
//       {
//         code,
//         client_id: config.CLIENT_ID,
//         client_secret: config.CLIENT_SECRET,
//         redirect_uri: config.REDIRECT_URI,
//         grant_type: "authorization_code",
//       }
//     );
//     const { access_token, id_token } = tokenResponse.data;

//     // Step 3: Fetch user details from Google
//     const userInfoResponse = await axios.get(
//       "https://www.googleapis.com/oauth2/v3/userinfo",
//       {
//         headers: { Authorization: `Bearer ${access_token}` },
//       }
//     );

//     const user = userInfoResponse.data;
//     console.log(user);
//     return res.status(200).json({ message: "USER REGISTRATION SUCCESSFULLy" });
//     // Send user data to frontend (In real-world, store in DB & generate JWT session)
//     // res.redirect(
//     //   `${process.env.FRONTEND_URL}/dashboard?token=${id_token}&name=${user.name}&email=${user.email}&picture=${user.picture}`
//     // );
//   } catch (error) {
//     console.error("OAuth Error:", error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to authenticate" });
//   }
// });

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
