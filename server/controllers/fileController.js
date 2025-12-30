import { createWriteStream } from "fs";
import { rm } from "fs/promises";
import path from "path";
import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import { renameFileSchema } from "../validators/authSchema.js";
import z from "zod";
import { sanitizeObject } from "../utils/sanitize.js";
import { rootPath } from "../app.js";


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
    try {

        const parentDirData = await Directory.findOne({ _id: parentDirId, userId: req.user._id })


        // Check if parent directory exists
        if (!parentDirData) {
            return res.status(404).json({ error: "Parent directory not found!" });
        }


        const filename = req.headers.filename || 'untitled'
        const extension = path.extname(filename);

        const insertedFile = await File.insertOne({
            extension,
            name: filename,
            parentDirId: parentDirData._id,
            userId: req.user._id
        })


        const fileId = insertedFile.id

        const fullFileName = `${fileId}${extension}`;
        // console.log(fullFileName);

        // console.log(import.meta.dirname);
        // console.log(process.cwd());
        const writeStream = createWriteStream(`${rootPath}/storage/${fullFileName}`);
        req.pipe(writeStream);

        req.on("end", async () => {
            return res.status(201).json({ message: "File Uploaded successfully" });
        });

        req.on('error', async () => {
            await File.deleteOne({ _id: insertedFile.insertedId })
            return res.status(201).json({ message: "Could not Upload file successfully" });
        })

    } catch (err) {
        console.log("Errrrorrrrrrrrr");
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
    const file = await File.findOne({ _id: id, userId: req.user._id }).select('extension')

    if (!file) {
        return res.status(404).json({ error: "File not found !" })
    }

    try {
        const fullfilename = `${rootPath}/storage/${id}${file.extension}`
        await rm(fullfilename, { recursive: true });

        // await File.deleteOne({ _id: file._id })
        await file.deleteOne()

        return res.status(200).json({ message: "File Deleted Successfully" });
    } catch (err) {
        next(err)
    }
}