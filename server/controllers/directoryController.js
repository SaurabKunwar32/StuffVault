import { rm } from "fs/promises";
import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import { createDirectorySchema, renameDirectorySchema } from "../validators/authSchema.js";
import z from "zod";
import { sanitizeInput } from "../utils/sanitize.js";
import updateDirectoriesSize from "../utils/updateDirectoriesSize.js";
import { buildLogicalPath, generateBreadCrumb } from "../utils/logicalPath.js";


export const getDirectory = async (req, res, next) => {
    try {
        // 1️ Block deleted users
        if (req.user.isDeleted) {
            return res.status(403).json({
                error: "Your account has been deleted. To recover, please contact the Admin.",
            });
        }

        const userId = req.user._id;
        const dirId = req.params.id || req.user.rootdirId;

        //  Load directory (or root)
        const directoryData = await Directory.findOne({ _id: dirId, userId })
            .populate("path", "name")
            .lean()

        if (!directoryData) {
            return res.status(404).json({
                error: "Directory not found or you do not have access to it!",
            });
        }

        // Load files inside directory
        const files = (
            await File.find({
                parentDirId: directoryData._id,
            }).lean()
        ).map((file) => ({
            ...file,
            id: file._id,
            type: "file",
            path: buildLogicalPath([...directoryData.path, file]),
        }));

        // console.log(directoryData.path);
        // console.log({ files });

        // Load child directories of current directory
        const childDirs = await Directory.find({
            parentDirId: directoryData._id,
        }).lean();

        // console.log({ directoryData });
        // console.log({ childDirs });

        const directories = await Promise.all(
            childDirs.map(async (dir) => {
                // count no of files and dir in the children dir of current dir
                const [fileCount, directoryCount] = await Promise.all([
                    File.countDocuments({
                        parentDirId: dir._id,
                    }),
                    Directory.countDocuments({ parentDirId: dir._id }),
                ]);

                return {
                    ...dir,
                    id: dir._id,
                    // type: "directory",
                    path: buildLogicalPath([...directoryData.path, dir]),
                    fileCount,
                    directoryCount,
                };
            })
        );

        // 5️⃣ Final response
        return res.status(200).json({
            ...directoryData,
            files,
            directories,
            breadCrumb: generateBreadCrumb(directoryData.path)
        });


        //  return res.status(200).json({
        //     ...directorydata,
        //     files: files.map((fil) => ({ ...fil, id: fil._id })),
        //     directories: directories.map((dir) => ({ ...dir, id: dir._id })),
        // });
    } catch (err) {
        next(err);
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
        const parentDir = await Directory.findOne({ _id: parentDirId, userId: user._id }).lean();

        // console.log({ parentDirId });
        if (!parentDir)
            return res
                .status(404)
                .json({ message: "Parent Directory  does not exist !!" });

        const newDir = await Directory.insertOne({
            name: dirname,
            parentDirId,
            userId: user._id,
        });
        newDir.path = [...(parentDir.path || []), newDir._id];
        await newDir.save();

        // console.log({ newDir })

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
