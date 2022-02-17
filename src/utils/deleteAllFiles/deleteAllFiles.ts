import log from 'loglevel';
import {
  DeleteObjectCommand,
  ListObjectsCommand
} from "@aws-sdk/client-s3";
import { s3 } from "../createS3Instance/createS3Instance";

export async function deleteAllFiles(Bucket: string) {
  try {
    const allFiles = await s3.send(
      new ListObjectsCommand({ Bucket }),
    );

    if(!allFiles.Contents || allFiles.Contents.length === 0) {
      return;
    }

    for await (const { Key } of allFiles.Contents) {
      const deleteCommand = new DeleteObjectCommand({
        Bucket,
        Key,
      })
      await s3
        .send(deleteCommand)
        .catch(e => {
          const message = `An error has occurred while trying to delete ${Key} in ${Bucket}: ${e}`;
          log.error(message);
        })
    }
  } catch (e) {
    const message = `An error has occurred in createStaticBucket: ${e}`;
    throw new Error(message);
  }
}
