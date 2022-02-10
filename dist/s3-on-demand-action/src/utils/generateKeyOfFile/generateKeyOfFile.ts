
export const generateKeyOfFile = (file: string, path: string) => {
  return file
    .replace(process.cwd(), '')
    .replace(`${path}/`, '')
    .replace('/', '');
}

// console.log(generateKeyOfFile('/home/mathias/WebstormProjects/s3-on-demand-action/www/index.html', 'www'));
