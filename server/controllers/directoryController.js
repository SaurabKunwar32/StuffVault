import { rm } from "fs/promises";
import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import { createDirectorySchema, renameDirectorySchema } from "../validators/authSchema.js";
import z from "zod";
import { sanitizeInput } from "../utils/sanitize.js";
import updateDirectoriesSize from "../utils/updateDirectoriesSize.js";

// const clean = purify.sanitize('<b>hello there</b>');

export const getDirectory = async (req, res, next) => {
    // console.log(req.user);
    if (req.user.isDeleted) {
        return res.status(403).json({
            error: "Your account has been deleted. To recover, please contact the Admin."
        });
    }

    // const db = req.db
    // const dirCollection = db.collection('directories')
    const user = req.user;
    const _id = req.params.id || user.rootdirId.toString();

    try {
        const directorydata = await Directory.findOne({ _id, userId: req.user._id }).lean();

        if (!directorydata) {
            return res
                .status(404)
                .json({ error: "Directory not found or you do not have access to it!" });
        }

        const files = await File.find({ parentDirId: directorydata._id }).lean();

        const directories = await Directory.find({ parentDirId: _id }).lean();

        // console.log(directorydata);
        // console.log(directories);
        // console.log(files);
        return res.status(200).json({
            ...directorydata,
            files: files.map((fil) => ({ ...fil, id: fil._id })),
            directories: directories.map((dir) => ({ ...dir, id: dir._id })),
        });
    } catch (err) {
        next(err)
    }
};

export const createDirectory = async (req, res, next) => {
    const user = req.user;

    if (!req.headers['x-csrf-check']) {
        return res.status(404).json({ error: "Some headers are missing !!" })
    }

    const { success, data, error } = createDirectorySchema.safeParse({
        params: req.params,
        headers: req.headers,
    })

    if (!success) {
        return res.status(400).json({ errors: z.flattenError(error).fieldErrors });
    }

    const { params, headers } = data;

    const parentDirId = params.parentDirId || user.rootdirId.toString();
    const dirname = sanitizeInput(headers.dirname) || "New Folder";

    try {
        const parentDir = await Directory.findOne({ _id: parentDirId }).lean();

        if (!parentDir)
            return res
                .status(404)
                .json({ message: "Parent Directory  does not exist !!" });

        await Directory.insertOne({
            name: dirname,
            parentDirId,
            userId: user._id,
        });

        return res.status(201).json({ message: "Directory created !!" });
    } catch (err) {
        if (err.code === 121) {
            return res
                .status(400)
                .json({ error: "Invalid input, please enter valid details !!" });
        } else {
            next(err);
        }
    }
};

export const renameDirectory = async (req, res, next) => {
    const user = req.user;
    const { success, data, error } = renameDirectorySchema.safeParse(req.body)


    if (!success) {
        return res.status(400).json({ errors: z.flattenError(error).fieldErrors });
    }
    // return
    const { id } = req.params;
    const { newDirName } = data;


    try {
        const dirData = await Directory.findOneAndUpdate(
            { _id: id, userId: user._id },
            { name: sanitizeInput(newDirName) }
        );
        // console.log(dirData);
        res.status(200).json({ message: "Directory renamed!! " });
    } catch (err) {
        next(err);
    }
};

export const deleteDirectory = async (req, res, next) => {
    const { id } = req.params;

    try {
        const directoryData = await Directory.findOne({
            _id: id,
            userId: req.user._id,
        })
            .lean();

        if (!directoryData) {
            return res.status(404).json({ message: "Directory not found !!" });
        }

        async function getDirectoryContents(id) {
            let files = await File.find({
                parentDirId: id,
            })
                .select("extension")
                .lean();
            let directories = await Directory.find({
                parentDirId: id,
            })
                .select("_id")
                .lean();

            for (const { _id } of directories) {
                const { files: childFiles, directories: childDirectories } =
                    await getDirectoryContents(_id);

                // Spread the existing  and new  files / javascript
                files = [...files, ...childFiles];
                directories = [...directories, ...childDirectories];
            }
            return { files, directories };
        }

        const { files, directories } = await getDirectoryContents(id);

        for (const { _id, extension } of files) {
            await rm(`./storage/${_id.toString()}${extension}`);
        }

        // makes the array of ids
        await File.deleteMany({
            _id: { $in: files.map(({ _id }) => _id) },
        });
        await Directory.deleteMany({
            _id: {
                $in: [...directories.map(({ _id }) => _id), id],
            },
        });

        await updateDirectoriesSize(directoryData.parentDirId, -directoryData.size)

    } catch (err) {
        next(err)
    }
    return res.json({ message: "files delted" });
};
