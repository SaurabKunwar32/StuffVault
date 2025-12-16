import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import checkAuth from "./middlewares/auth.js";
import { connectDB } from "./config/db.js";


await connectDB();

const app = express();
const port = process.env.PORT || 3000;
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(express.json());
// Enabling CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/directory", checkAuth, directoryRoutes);
app.use("/file", checkAuth, fileRoutes);
app.use("/", userRoutes);
app.use("/auth", authRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({ error: "Something went wrong" });
  // res.json(err)
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
