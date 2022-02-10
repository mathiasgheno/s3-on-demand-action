import {
  DeleteBucketCommand,
  PutBucketPolicyCommand,
  PutBucketPolicyCommandOutput,
} from "@aws-sdk/client-s3";
import { gereratePolicy } from "../generatePolicy/generatePolicy";
import { s3 } from "../createS3Instance/createS3Instance";

export type ConfigurePublicAccess = (Bucket: string) => Promise<PutBucketPolicyCommandOutput>

export const configurePublicAccess: ConfigurePublicAccess = (Bucket) => {
  const deleteBucketCallback = async (erro: any) => {
    const deleteCommand = new DeleteBucketCommand({ Bucket });
    await s3.send(deleteCommand);
    console.info(`Bucket ${Bucket} deleted successfully`);
    return Promise.reject(erro);
  }

  const errorCallback = (erro: any) => {
    const message = `
      An erro has ocorred trying to put policies in bucket ${Bucket}.
      Bucket will be deleted.
    `;
    console.error(message);
    throw new Error(erro);
  }

  return s3.send(
    new PutBucketPolicyCommand({
      Bucket,
      Policy: gereratePolicy(Bucket),
    })
  )
    .catch(errorCallback)
    .catch(deleteBucketCallback)
}
