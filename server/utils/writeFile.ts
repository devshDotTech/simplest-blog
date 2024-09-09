import fse from "fs-extra";

const writeFile = async (path: string, data: []) => {
  await fse.writeJSON(path, data, { spaces: 2 });
};

export default writeFile;
