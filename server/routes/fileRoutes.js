import express from "express";
import validateIdMiddleware from "../middlewares/validateIdMiddleware.js";
import {
  deleteFile,
  getFiles,
  renameFile,
  uploadCancel,
  uploadComplete,
  uploadInitiate,
} from "../controllers/fileController.js";
import checkAuth from "../middlewares/auth.js";
import { limiter } from "../utils/RateLimiter.js";
import mainThrottle from "../utils/throttler.js";

const router = express.Router();

router.param("parentDirId", validateIdMiddleware);
router.param("id", validateIdMiddleware);

router.post("/upload/initiate", uploadInitiate);
router.post("/upload/complete", uploadComplete);
router.post("/upload/cancle", uploadCancel);

router.get(
  "/:id",
  checkAuth,
  limiter.getFiles,
  mainThrottle.getFiles,
  getFiles
);

// router.post("/:parentDirId?", checkAuth, limiter.uploadFiles, uploadFile);

router.patch("/:id", checkAuth, limiter.renameFiles, renameFile);

router.delete("/:id", checkAuth, limiter.general, deleteFile);

export default router;
