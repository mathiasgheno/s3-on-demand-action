import {DeleteBucketCommand} from "@aws-sdk/client-s3";
import { s3 } from "../createS3Instance/createS3Instance";

export type DeleteBucket = (Bucket: string) => Promise<void>

export const deleteBucket: DeleteBucket = async (Bucket) => {
  const deleteCommand = new DeleteBucketCommand({ Bucket });
  await s3.send(deleteCommand);
  console.info(`Bucket ${Bucket} deleted successfully`);
}
