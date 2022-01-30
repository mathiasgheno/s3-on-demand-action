import { readdir, readFile } from 'fs';
import { promisify } from 'util';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../createS3Instance/createS3Instance';

export type UploadAllFiles = (Bcuket: string, path?: string) => Promise<void>;

export const uploadAllFiles: UploadAllFiles = async (Bucket, path = 'www') => {
  const readdir$ = promisify(readdir);
  const readFile$ = promisify(readFile);
  const files = await readdir$('www', { encoding: 'utf8', withFileTypes: false });

  console.log('All files send to upload', files.map(file => file));

  const errorUploadFileCallback = (file: string) => (erro: unknown) => {
    const message = `An error has ocurred while trying to upload file ${file} at Bucket ${Bucket}`;
    console.error(message, erro);
    return Promise.reject(erro);
  }

  try {
    for await (const Key of files) {
      const filePath = `${path}/${Key}`;
      console.info(`Reading content of ${filePath}`);
      const Body = await readFile$(filePath, {});
      console.info(`Content of ${filePath} was loaded`);
      await s3.send(
        new PutObjectCommand({
          Bucket,
          Key,
          Body,
        })
      )
        .catch(errorUploadFileCallback(Key));
      console.info(`File ${filePath} was successfully uploaded`);
    }
  } catch (e) {
    const message = `An error has occurred in uploadAllFiles: ${e}`;
    throw new Error(message);
  }
}

uploadAllFiles('mathiasgheno-vanilla-modal-on-demand-test-4').then(console.log);
