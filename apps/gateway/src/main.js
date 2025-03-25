import express from "express";
import dotenv from "dotenv";
import routes from "./gateway-route.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// app.use(cors({
//   origin: 'http://localhost:5173', // Set to the exact frontend origin
//   credentials: true, // Allow credentials
// }));

app.use("/", routes);
app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
