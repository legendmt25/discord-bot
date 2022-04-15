import fs from 'fs';
import path from 'path';

const loadFilesR = (str: string) => {
  if (!fs.lstatSync(str).isDirectory()) {
    return [import(str)];
  }

  let files: Promise<any>[] = [];
  for (const file of fs.readdirSync(str)) {
    const temp = loadFilesR(path.join(str, file));
    files = [...files, ...temp];
  }
  return files;
};

export const files = loadFilesR(path.join(__dirname, 'commands'));
