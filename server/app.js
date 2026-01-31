import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import checkAuth from "./middlewares/auth.js";
import { connectDB } from "./config/db.js";
import { stripeWebhook } from "./controllers/billingController.js";

await connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Using Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "same-site" },
    contentSecurityPolicy: {
      directives: {
        imgSrc: ["'self'", "data:", "http://localhost:5173"],
        frameAncestors: [
          "'self'",
          process.env.CLIENT_URL,
          " http://localhost:5173",
        ],
        reportUri: ["/csp-report"],
      },
    },
  }),
);

// Enabling CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.json());
export const rootPath = import.meta.dirname;

// Header Violation End-point
app.post(
  "/csp-report",
  express.json({ type: ["application/csp-report", "application/json"] }),
  (req, res) => {
    console.log("CSP Violation Report:", req.body);
    res.status(204).end();
  },
);

app.use("/directory", checkAuth, directoryRoutes);
app.use("/file", checkAuth, fileRoutes);
app.use("/auth", authRoutes);
app.use("/", userRoutes);
app.use("/billing", billingRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .json({ error: "Something went wrong from app.js" });
  // res.json(err)
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server started on port: ${port}`);
});
