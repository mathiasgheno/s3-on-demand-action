import { promisify } from "util";
import { lstat, readdir } from "fs";
import { getWorkspace } from "../getWorkspace/getWorkspace";

export type ListAllFIles = (dir?: string, isRoot?: boolean) => Promise<string[]>

export const listAllFiles: ListAllFIles = async (dir = 'www', isRoot = true) => {
  let flattedFiles: string[] = [];
  const readdir$ = promisify(readdir);
  const lstat$ = promisify(lstat);
  const files = await readdir$(dir, { encoding: 'utf8', withFileTypes: false });
  for await (const file of files) {
    const projectPath = getWorkspace();
    const fullPath = isRoot ? `${projectPath}/${dir}/${file}` : `${dir}/${file}`;
    const fileStat = await lstat$(fullPath);
    if(fileStat.isFile()) {
      console.info(`Adding file ${fullPath} to list of files.`);
      flattedFiles.push(fullPath);
    } else {
      const folderPath = isRoot ? `${projectPath}/${dir}/${file}` : `${dir}/${file}`;
      console.log('folferPath',folderPath);
      console.info(`Reading files of folder ${folderPath}.`);
      const subfiles = await listAllFiles(folderPath, false);
      flattedFiles = [...flattedFiles, ...subfiles];
    }
  }
  return flattedFiles;
}
