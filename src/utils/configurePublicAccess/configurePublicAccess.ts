import log from 'loglevel';
import {
  PutBucketPolicyCommand,
  PutBucketPolicyCommandOutput,
} from "@aws-sdk/client-s3";
import { gereratePolicy } from "../generatePolicy/generatePolicy";
import { s3 } from "../createS3Instance/createS3Instance";
import { deleteBucket } from "../deleteBucket/deleteBucket";

export type ConfigurePublicAccess = (Bucket: string) => Promise<PutBucketPolicyCommandOutput>

export const configurePublicAccess: ConfigurePublicAccess = (Bucket) => {
  const deleteBucketCallback = async (erro: any) => {
    await deleteBucket(Bucket);
    return Promise.reject(erro);
  }

  const errorCallback = (erro: any) => {
    const message = `
      An erro has ocorred trying to put policies in bucket ${Bucket}.
      Bucket will be deleted.
    `;
    log.error(message);
    throw new Error(erro);
  }

  log.info('executing configurePublicAccess');

  return s3.send(
    new PutBucketPolicyCommand({
      Bucket,
      Policy: gereratePolicy(Bucket),
    })
  )
    .catch(errorCallback)
    .catch(deleteBucketCallback)
}
