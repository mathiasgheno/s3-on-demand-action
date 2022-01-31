import { readdir, readFile } from 'fs';
import { promisify } from 'util';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../createS3Instance/createS3Instance';
import { generateContentTypeOfKeyFile } from "../generateContentTypeOfKeyFile/generateContentTypeOfKeyFile";
import { getBucketUrl } from '../getBucketUrl/getBucketUrl';
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
      const ContentType = generateContentTypeOfKeyFile(Key);
      console.info(`Making upload of file ${filePath} with ContentType: ${ContentType}`);
      await s3.send(
        new PutObjectCommand({
          Bucket,
          Key,
          Body,
          ContentType,
        })
      )
        .catch(errorUploadFileCallback(Key));
      console.info(`File ${filePath} was successfully uploaded`);
    }
    console.info(`You can check your website content at: ${getBucketUrl(Bucket)}`)
  } catch (e) {
    const message = `An error has occurred in uploadAllFiles: ${e}`;
    throw new Error(message);
  }
}

// uploadAllFiles('mathiasgheno-vanilla-modal-on-demand-tes-5').then(console.log);
