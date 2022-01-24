import { S3Client, DeleteObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";

import { CONFIGS } from "../../configs/configs";

const S3 = new S3Client({ region: CONFIGS.region });

export async function deleteAllFiles(Bucket: string) {
  try {
    const allFiles = await S3.send(
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
      await S3
        .send(deleteCommand)
        .catch(e => {
          const message = `An error has occurred while trying to delete ${Key} in ${Bucket}: ${e}`;
          console.error(message);
        })
    }
  } catch (e) {
    const message = `An error has occurred in createStaticBucket: ${e}`;
    throw new Error(message);
  }
}

deleteAllFiles('mathiasgheno-vanilla-modal-on-demand-test').then(console.log);
