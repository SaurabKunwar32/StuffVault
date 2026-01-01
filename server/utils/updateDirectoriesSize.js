import Directory from "../models/directoryModel.js";

export default async function updateDirectoriesSize(parentId, dataSize) {
    while (parentId) {
        let dir = await Directory.findById(parentId)
        dir.size += dataSize;
        await dir.save();
        parentId = dir.parentDirId;
    }
}


// Alternative Approach with minimum DB calls

// export const updateParentDirectorySize = async (parentDirectoryId, deltaSize) => {
//   const parents = [];

//   while (parentDirectoryId) {
//     const parentDirectory = await Directory.findById(
//       parentDirectoryId,
//       "parentDirId"
//     );
//     if (!parentDirectory) break;
//     parents.push(parentDirectory._id);
//     parentDirectoryId = parentDirectory.parentDirId;
//   }

//   if (parents.length > 0) {
//     await Directory.updateMany(
//       { _id: { $in: parents } },
//       { $inc: { size: deltaSize } }
//     );
//   }
// };