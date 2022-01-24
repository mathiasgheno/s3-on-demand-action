import { readdir, readFile } from 'fs';
import { promisify } from 'util';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CONFIGS } from '../../configs/configs';

const s3 = new S3Client({region: CONFIGS.region})

export async function uploadAllFiles(Bucket: string, path = 'www'): Promise<void> {
  const readdir$ = promisify(readdir);
  const readFile$ = promisify(readFile);
  const files = await readdir$('www', { encoding: 'utf8', withFileTypes: false });

  console.log(files);

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
