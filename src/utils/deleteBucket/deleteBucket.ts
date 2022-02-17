import log from 'loglevel';
import { DeleteBucketCommand } from "@aws-sdk/client-s3";
import { s3 } from "../createS3Instance/createS3Instance";

export type DeleteBucket = (Bucket: string) => Promise<void>

export const deleteBucket: DeleteBucket = async (Bucket) => {
  log.info('Executing deleteBucket');
  const deleteCommand = new DeleteBucketCommand({ Bucket });
  await s3.send(deleteCommand);
  log.info(`Bucket ${Bucket} deleted successfully`);
}
