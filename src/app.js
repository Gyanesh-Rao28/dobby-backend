
import express from 'express'
import cors from 'cors'
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

app.use(express.json())

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));


import userRoute from "./routes/user.route.js";
import folderRoute from "./routes/folder.route.js";
import imageRoute from "./routes/image.route.js"


app.use('/api/v1/test', (req, res) => {
    res.send({
        testingAPI: "working"
    })
})


app.use("/api/v1/users", userRoute);
app.use("/api/v1/folders", folderRoute);
app.use("/api/v1/images", imageRoute);

export { app } 