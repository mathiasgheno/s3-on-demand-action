import {
  PutBucketWebsiteCommand,
  PutBucketWebsiteCommandOutput,
} from "@aws-sdk/client-s3";
import { s3 } from "../createS3Instance/createS3Instance";

export type ConfigureStaticContent = (Bucket: string) => Promise<PutBucketWebsiteCommandOutput>;

export const configureStaticContent: ConfigureStaticContent = (Bucket) => {
  return s3.send(
    new PutBucketWebsiteCommand({
      Bucket,
      WebsiteConfiguration: {
        IndexDocument: {
          Suffix: 'index.html',
        },
      }
    })
  )
}
