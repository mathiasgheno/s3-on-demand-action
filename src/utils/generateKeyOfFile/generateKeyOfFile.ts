import { getWorkspace } from "../getWorkspace/getWorkspace";

export const generateKeyOfFile = (file: string, path: string) => {
  return file
    .replace(getWorkspace(), '')
    .replace(`${path}/`, '')
    .replace('/', '');
}

// console.log(generateKeyOfFile('/home/mathias/WebstormProjects/s3-on-demand-action/www/index.html', 'www'));
