import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import { CONFIGS } from "../../configs/configs";

const s3 = new S3Client({ region: CONFIGS.region });

export async function verifyIfBucketWasAlreadCreated(bucketName: string): Promise<boolean> {
  try {
    const { Buckets } = await s3.send(
      new ListBucketsCommand({}),
    )
    if(!Buckets || Buckets.length === 0) {
      return false;
    }
    return Buckets.some(Bucket => Bucket.Name === bucketName);
  } catch (e) {
    throw new Error(`An erros has occurred in verifyIfBucketWasAlreadCreated: ${e}`);
  }
}
