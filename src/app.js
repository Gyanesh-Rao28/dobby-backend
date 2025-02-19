import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json());

// Import routes
import userRoute from "./routes/user.route.js";
import folderRoute from "./routes/folder.route.js";
import imageRoute from "./routes/image.route.js";

// Route for testing
app.use("/api/v1/test", (req, res) => {
  res.send({
    testingAPI: "working",
  });
});

// Use routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/folders", folderRoute);
app.use("/api/v1/images", imageRoute);

export { app };
