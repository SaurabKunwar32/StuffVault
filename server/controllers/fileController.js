import { createWriteStream, write } from "fs";
import { rm } from "fs/promises";
import path from "path";
import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import { renameFileSchema } from "../validators/authSchema.js";
import z from "zod";
import { sanitizeObject } from "../utils/sanitize.js";
import { rootPath } from "../app.js";
import updateDirectoriesSize from "../utils/updateDirectoriesSize.js";
import User from "../models/userModel.js";
import { createGetSignedUrl, createUploadSignedUrl } from "../config/s3.js";

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

  return res.sendFile(filePath, (err) => {
    if (!res.headersSent) {
      return res.status(404).json({ error: "File not found!" });
    }
  });
};

// export const uploadFile = async (req, res, next) => {
//   const parentDirId = req.params.parentDirId || req.user.rootdirId;
//   const MAX_FILE_LIMIT = 100 * 1024 ** 2; //10MB
//   try {
//     const parentDirData = await Directory.findOne({
//       _id: parentDirId,
//       userId: req.user._id,
//     });

//     // Check if parent directory exists
//     if (!parentDirData) {
//       return res.status(404).json({ error: "Parent directory not found!" });
//     }

//     const filename = req.headers.filename || "untitled";
//     const fileSize = req.headers.filesize;

//     const user = await User.findById(req.user._id).lean();
//     const rootDir = await Directory.findById(req.user.rootdirId).lean();

//     const remainingSpace = user.maxStorageInBytes - rootDir.size;

//     // File size limit
//     if (fileSize > MAX_FILE_LIMIT) {
//       res.destroy();
//       return res.status(400).json({ error: "File size exceeds 100MB limit." });
//       // res.header("Connection", "close");
//       // return res.end();
//     }

//     // STORAGE LIMIT CHECK

//     if (fileSize > remainingSpace) {
//       console.log("File too large");
//       return res.destroy();
//     }

//     const extension = path.extname(filename);

//     const insertedFile = await File.insertOne({
//       extension,
//       name: filename,
//       size: fileSize,
//       parentDirId: parentDirData._id,
//       userId: req.user._id,
//     });

//     const fileId = insertedFile.id;

//     const fullFileName = `${fileId}${extension}`;
//     const filePath = `${rootPath}/storage/${fullFileName}`;

//     const writeStream = createWriteStream(filePath);
//     // req.pipe(writeStream);

//     let totalFileSize = 0;
//     let aborted = false;
//     let fileUploadCompleted = false;

//     req.on("data", async (chunk) => {
//       if (aborted) return;
//       totalFileSize += chunk.length;
//       if (totalFileSize > fileSize) {
//         // console.log("object");
//         aborted = true;
//         writeStream.close();
//         await insertedFile.deleteOne();
//         await rm(filePath);
//         return req.destroy();
//       }
//       const canWrite = writeStream.write(chunk); //backpressure  occur
//       if (!canWrite) {
//         req.pause();
//       }
//     });

//     // backpressure is handled here
//     writeStream.on("drain", () => {
//       if (!aborted) {
//         req.resume(); // resume when buffer is free
//       }
//     });

//     req.on("end", async () => {
//       fileUploadCompleted = true;
//       await updateDirectoriesSize(parentDirId, totalFileSize);
//       return res.status(201).json({ message: "File Uploaded successfully" });
//     });

//     req.on("close", async () => {
//       if (!fileUploadCompleted) {
//         try {
//           writeStream.close();
//           await insertedFile.deleteOne();
//           console.log("file cleaned that was cancled in uploading !!");
//           await rm(filePath);
//           return res
//             .status(201)
//             .json({ message: "Could not Upload file successfully" });
//         } catch (err) {
//           console.error("Error cleaning up aborted upload:", err);
//         }
//       }
//     });

//     req.on("error", async () => {
//       await File.deleteOne({ _id: insertedFile.insertedId });
//       return res
//         .status(201)
//         .json({ message: "Could not Upload file successfully" });
//     });
//   } catch (err) {
//     console.log("Errrrorrrrrrrrr");
//     // console.dir(err.errInfo.details, { depth: null });
//     next(err);
//   }
// };

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
    // await rm(fullfilename, { recursive: true });
    return res.status(200).json({ message: "File Deleted Successfully" });
  } catch (err) {
    next(err);
  }
};

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
      return res.status(400).json({ error: "File size exceeds 100MB limit." });
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
