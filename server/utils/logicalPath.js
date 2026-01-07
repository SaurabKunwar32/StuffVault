// export default function buildLogicalPath(parentDir, file) {
//   return (
//     "/" +
//     parentDir.path.map(d => d.name).join("/") +
//     `/${file.name}${file.extension}`
//   );
// }


// export const generatePath = (pathArray = []) => {

//   // console.log(pathArray.slice(1));
//   const nestedDirectory = pathArray.length >= 2 ? pathArray.slice(1) : [];
//   let path = "StuffVault";
//   nestedDirectory.forEach((dir) => {
//     path += `/${dir.name}`;
//   });
//   console.log(path);
//   return path;
// };

export const buildLogicalPath = (pathArray = []) => {
  // console.log({ pathArray });
  // console.log({ file });
  let path = "StuffVault";

  pathArray.forEach((dir) => {
    path += ` / ${dir.name}`;
  });

  // if (file) {
  //   path += `/${file.name}${file.extension}`;
  // }
  // console.log({ file });
  // console.log(path);
  return path;
};

export const generateBreadCrumb = (pathArray = []) => {
  return pathArray.map((dir) => {
    const bdata = { _id: dir._id, name: dir.name }
    // console.log(bdata);
    return bdata;
  });
};
