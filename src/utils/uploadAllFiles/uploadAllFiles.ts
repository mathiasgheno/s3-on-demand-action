import log from 'loglevel';
import { readFile } from 'fs';
import { promisify } from 'util';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../createS3Instance/createS3Instance';
import { generateContentTypeOfKeyFile } from "../generateContentTypeOfKeyFile/generateContentTypeOfKeyFile";
import { getBucketUrl } from '../getBucketUrl/getBucketUrl';
import { listAllFiles } from '../listAllFiles/listAllFiles';
import { generateKeyOfFile } from '../generateKeyOfFile/generateKeyOfFile';

export type UploadAllFiles = (Bcuket: string, path?: string) => Promise<void>;

export const uploadAllFiles: UploadAllFiles = async (
  Bucket,
  path = process.env.SOURCE_DIR || 'www'
) => {
  const readFile$ = promisify(readFile);
  const files = await listAllFiles(path);

  log.info('All files send to upload', files.map(file => file));

  const errorUploadFileCallback = (file: string) => (erro: unknown) => {
    const message = `An error has ocurred while trying to upload file ${file} at Bucket ${Bucket}`;
    log.error(message, erro);
    return Promise.reject(erro);
  }

  try {
    for await (const file of files) {
      log.info(`Reading content of ${file}`);
      const Body = await readFile$(file, {});
      log.info(`Content of ${file} was loaded`);
      const ContentType = generateContentTypeOfKeyFile(file);
      log.info(`Making upload of file ${file} with ContentType: ${ContentType}`);
      const Key = generateKeyOfFile(file, path);
      await s3.send(
        new PutObjectCommand({
          Bucket,
          Key,
          Body,
          ContentType,
        })
      )
        .catch(errorUploadFileCallback(file));
      log.info(`File ${file} was successfully uploaded`);
    }
    log.info(`You can check your website content at: ${getBucketUrl(Bucket)}`)
  } catch (e) {
    const message = `An error has occurred in uploadAllFiles: ${e}`;
    throw new Error(message);
  }
}

// uploadAllFiles('mathiasgheno-vanilla-modal-on-demand-tes-5').then(log.info);
