import log from 'loglevel';
import { ListBucketsCommand } from '@aws-sdk/client-s3';
import { s3 } from '../createS3Instance/createS3Instance';

export type VerifyIfBucketWasAlreadCreated = (Bucket: string) => Promise<boolean>;

export const verifyIfBucketWasAlreadCreated: VerifyIfBucketWasAlreadCreated = async (Bucket) => {
  try {
    const { Buckets } = await s3.send(
      new ListBucketsCommand({}),
    )
    log.info(`All Buckets: ${Buckets?.map(({Name}) => Name)}`);
    if(!Buckets || Buckets.length === 0) {
      return false;
    }
    return Buckets.some(({ Name }) => Name === Bucket);
  } catch (e) {
    throw new Error(`An erros has occurred in verifyIfBucketWasAlreadCreated: ${e}`);
  }
}
