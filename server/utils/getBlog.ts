import fse from 'fs-extra';

export const getBlogs = async (path: string) => {
  const data = await fse.readJSON(path);
  return data;
}
