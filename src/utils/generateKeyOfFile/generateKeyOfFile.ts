import { getWorkspace } from "../getWorkspace/getWorkspace";

export const generateKeyOfFile = (file: string, path: string) => {
  return file
    .replace(getWorkspace(), '')
    .replace(`${path}/`, '')
    .replace('/', '');
}
