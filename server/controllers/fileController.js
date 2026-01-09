import { createWriteStream, write } from "fs";
import { rm } from "fs/promises";
import path from "path";
import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import { renameFileSchema } from "../validators/authSchema.js";
import z from "zod";
import { sanitizeObject } from "../utils/sanitize.js";
import updateDirectoriesSize from "../utils/updateDirectoriesSize.js";
import User from "../models/userModel.js";
import {
  createGetSignedUrl,
  createUploadSignedUrl,
  deleteS3File,
  getS3FileMetaData,
} from "../config/s3.js";

export const getFiles = async (req, res) => {
  if (req.user.isDeleted) {
    return res.status(403).json({
      error:
        "Your account has been deleted. To recover, please contact the Admin.",
    });
  }

  const { id } = req.params;
  const fileData = await File.findOne({ _id: id, userId: req.user._id }).lean();
  // console.log(fileData);

  if (!fileData) {
    return res.status(404).json({ message: "File Not found !!" });
  }

  // const filePath = `${rootPath}/storage/${id}${fileData.extension}`;

  if (req.query.action === "download") {
    const fileUrl = await createGetSignedUrl({
      key: `${id}${fileData.extension}`,
      download: true,
      fileName: fileData.name,
    });

    return res.redirect(fileUrl);
  }

  const fileUrl = await createGetSignedUrl({
    key: `${id}${fileData.extension}`,
    fileName: fileData.name,
  });

  return res.redirect(fileUrl);
};

export const renameFile = async (req, res, next) => {
  const sanitizedData = sanitizeObject(req.body);

  const { success, error, data } = renameFileSchema.safeParse(sanitizedData);

  if (!success) {
    return res
      .status(400)
      .json({ errors: z.flattenError(error).fieldErrors.newFilename });
  }

  // return
  const { id } = req.params;
  const file = await File.findOne({ _id: id, userId: req.user._id });

  if (!file) {
    return res.status(404).json({ message: "File Not found !!" });
  }

  try {
    file.name = data.newFilename;
    await file.save();
    return res.status(200).json({ message: "File renamed successfully !!" });
  } catch (err) {
    err.status = 500;
    next(err);
  }
};

export const deleteFile = async (req, res, next) => {
  const { id } = req.params;
  const file = await File.findOne({ _id: id, userId: req.user._id });

  if (!file) {
    return res.status(404).json({ error: "File not found !" });
  }

  try {
    await file.deleteOne();
    await updateDirectoriesSize(file.parentDirId, -file.size);
    await deleteS3File(`${file.id}${file.extension}`);
    return res.status(200).json({ message: "File Deleted Successfully" });
  } catch (err) {
    next(err);
  }
};

// Paths to upload directly on th s3 bucket
export const uploadInitiate = async (req, res) => {
  // console.log(req.body);
  const parentDirId = req.body.parentDirId || req.user.rootdirId;
  const MAX_FILE_LIMIT = 100 * 1024 ** 2; //10MB
  try {
    const parentDirData = await Directory.findOne({
      _id: parentDirId,
      userId: req.user._id,
    });

    // Check if parent directory exists
    if (!parentDirData) {
      return res.status(404).json({ error: "Parent directory not found!" });
    }

    const filename = req.body.name || "untitled";
    const fileSize = req.body.size;

    const user = await User.findById(req.user._id).lean();
    const rootDir = await Directory.findById(req.user.rootdirId).lean();

    const remainingSpace = user.maxStorageInBytes - rootDir.size;

    // For file limit
    if (fileSize > MAX_FILE_LIMIT) {
      return res.status(413).json({
        error: "File size exceeds the 100 MB limit.",
      });
    }

    if (fileSize > remainingSpace) {
      return res.status(507).json({
        error: `Not enough storage !!`,
      });
    }

    const extension = path.extname(filename);

    const insertedFile = await File.insertOne({
      extension,
      name: filename,
      size: fileSize,
      parentDirId: parentDirData._id,
      userId: req.user._id,
      isuploding: true,
    });

    const uploadSignedUrl = await createUploadSignedUrl({
      key: `${insertedFile.id}${extension}`,
      contentType: req.body.contentType,
    });

    res.json({ uploadSignedUrl, filId: insertedFile.id });
  } catch (err) {
    console.log(err);
  }
};

export const uploadComplete = async (req, res, next) => {
  const { fileId } = req.body;
  const file = await File.findById(fileId);
  if (!file) {
    return res
      .status(404)
      .json({ error: "File is not found in our records !!" });
  }

  try {
    const fileData = await getS3FileMetaData(`${file.id}${file.extension}`);
    if (fileData.ContentLength !== file.size) {
      await file.deleteOne();
      return res.status(400).json({ error: "File size does not match !!" });
    }
    file.isuploding = false;
    await file.save();
    await updateDirectoriesSize(file.parentDirId, file.size);
    res.json({ message: "Upload completed !!" });
  } catch (err) {
    await file.deleteOne();
    return res
      .status(404)
      .json({ error: "File could not be uploaded properly !!" });
  }
};
