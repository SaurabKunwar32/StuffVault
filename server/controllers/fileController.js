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




export const getFiles = async (req, res) => {
    if (req.user.isDeleted) {
        return res.status(403).json({
            error: "Your account has been deleted. To recover, please contact the Admin."
        });
    }

    const { id } = req.params
    const fileData = await File.findOne({ _id: id, userId: req.user._id }).lean()

    if (!fileData) {
        return res.status(404).json({ message: "File Not found !!" })
    }


    const filePath = `${rootPath}/storage/${id}${fileData.extension}`

    if (req.query.action === "download") {
        // res.set("Content-Disposition", `attachment; filename=${fileData.name}`);
        return res.download(filePath, fileData.name)
    }

    return res.sendFile(filePath, (err) => {
        if (!res.headersSent) {
            return res.status(404).json({ error: "File not found!" });
        }
    });
}

export const uploadFile = async (req, res, next) => {
    const parentDirId = req.params.parentDirId || req.user.rootdirId
    const MAX_FILE_LIMIT = 100 * 1024 ** 2 //10MV
    try {
        const parentDirData = await Directory.findOne({ _id: parentDirId, userId: req.user._id })

        // Check if parent directory exists
        if (!parentDirData) {
            return res.status(404).json({ error: "Parent directory not found!" });
        }

        const user = await User.findById(req.user._id).lean();
        const rootDir = await Directory.findById(req.user.rootdirId).lean();

        // STORAGE CALCULATION
        const maxStorage = user.maxStorageInBytes;
        const storageUsed = rootDir?.size || 0;
        const availableStorage = maxStorage - storageUsed;


        const filename = req.headers.filename || 'untitled'
        const extension = path.extname(filename);
        const fileSize = req.headers.filesize;

        // File size limit
        if (fileSize > MAX_FILE_LIMIT) {
            res.destroy();
            return res.status(400).json({ error: "File size exceeds 100MB limit." });
            // res.header("Connection", "close");
            // return res.end();
        }

        // console.log(fileSize > availableStorage);
        // STORAGE LIMIT CHECK 
        if (fileSize > availableStorage) {
            req.destroy();
            return res.status(400).json({
                error: `Not enough storage. Available: ${availableStorage} bytes`,
            });
        }

        const insertedFile = await File.insertOne({
            extension,
            name: filename,
            size: fileSize,
            parentDirId: parentDirData._id,
            userId: req.user._id
        })

        const fileId = insertedFile.id

        const fullFileName = `${fileId}${extension}`;
        const filePath = `${rootPath}/storage/${fullFileName}`
        const writeStream = createWriteStream(filePath);
        // req.pipe(writeStream);

        let totalFileSize = 0;
        let aborted = false;

        req.on('data', async (chunk) => {
            if (aborted) return;
            totalFileSize += chunk.length;
            if (totalFileSize > fileSize) {
                // console.log("object");
                aborted = true;
                writeStream.close()
                await insertedFile.deleteOne();
                await rm(filePath);
                return req.destroy()
            }
            const canWrite = writeStream.write(chunk); //backpressure  occur
            if (!canWrite) {
                req.pause();
            }
        })

        // backpressure is handled here
        writeStream.on("drain", () => {
            if (!aborted) {
                req.resume(); // resume when buffer is free
            }
        });


        req.on("aborted", async () => {
            console.log("Client canceled the upload");
            // console.log({ filePath });
            writeStream.close();
            await insertedFile.deleteOne();
            await rm(filePath);
            return res.status(201).json({ message: "Could not Upload file successfully" });
        });

        req.on("end", async () => {
            await updateDirectoriesSize(parentDirId, totalFileSize)
            return res.status(201).json({ message: "File Uploaded successfully" });
        });

        req.on('error', async () => {
            await File.deleteOne({ _id: insertedFile.insertedId })
            return res.status(201).json({ message: "Could not Upload file successfully" });
        })

    } catch (err) {
        console.log("Errrrorrrrrrrrr");
        // console.dir(err.errInfo.details, { depth: null });
        next(err)
    }
}

export const renameFile = async (req, res, next) => {

    const sanitizedData = sanitizeObject(req.body)

    const { success, error, data } = renameFileSchema.safeParse(sanitizedData)

    if (!success) {
        return res.status(400).json({ errors: z.flattenError(error).fieldErrors.newFilename });
    }

    // return
    const { id } = req.params;
    const file = await File.findOne({ _id: id, userId: req.user._id })

    if (!file) {
        return res.status(404).json({ message: "File Not found !!" });
    }


    try {
        file.name = data.newFilename
        await file.save()
        return res.status(200).json({ message: "File renamed successfully !!" });
    } catch (err) {
        err.status = 500
        next(err)
    }
}

export const deleteFile = async (req, res, next) => {
    const { id } = req.params
    const file = await File.findOne({ _id: id, userId: req.user._id })

    if (!file) {
        return res.status(404).json({ error: "File not found !" })
    }

    try {
        const fullfilename = `${rootPath}/storage/${id}${file.extension}`
        await rm(fullfilename, { recursive: true });
        // await File.deleteOne({ _id: file._id })
        await file.deleteOne()
        await updateDirectoriesSize(file.parentDirId, -file.size)

        return res.status(200).json({ message: "File Deleted Successfully" });
    } catch (err) {
        next(err)
    }
}