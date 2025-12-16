import express from "express";
import validateIdMiddleware from "../middlewares/validateIdMiddleware.js";
import { deleteFile, getFiles, renameFile, uploadFile } from "../controllers/fileController.js";


const router = express.Router();

router.param("parentDirId", validateIdMiddleware);
router.param("id", validateIdMiddleware);

router.get("/:id", getFiles);

router.post("/:parentDirId?", uploadFile);

router.patch("/:id", renameFile);

router.delete("/:id", deleteFile);



export default router;
