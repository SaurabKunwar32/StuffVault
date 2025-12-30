import express from "express";
import validateIdMiddleware from "../middlewares/validateIdMiddleware.js";
import { createDirectory, deleteDirectory, getDirectory, renameDirectory } from "../controllers/directoryController.js";
import { limiter } from "../utils/RateLimiter.js";
import checkAuth from "../middlewares/auth.js";
import mainThrottle from "../utils/throttler.js";


const router = express.Router();


router.param("parentDirId", validateIdMiddleware);
router.param("id", validateIdMiddleware);


router.get("/:id?", checkAuth, limiter.getDirectory,mainThrottle.getDirectory, getDirectory);


router.post("/:parentDirId?", checkAuth, limiter.general, createDirectory);


router.patch('/:id', checkAuth, limiter.renameDirectory, renameDirectory)



router.delete('/:id', checkAuth, limiter.general, deleteDirectory);


export default router;
