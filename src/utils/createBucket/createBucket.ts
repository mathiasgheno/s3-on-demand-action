import {
  CreateBucketCommand,
  CreateBucketCommandOutput,
} from "@aws-sdk/client-s3";
import { s3 } from "../createS3Instance/createS3Instance";

export type CreateBucket = (Bucket: string) => Promise<CreateBucketCommandOutput>

export const createBucket: CreateBucket = (Bucket) => {
  return s3.send(
    new CreateBucketCommand({
      Bucket,
    }),
  );
}

// createBucket('mathiasgheno-vanilla-modal-on-demand-tes-5').then(console.log);
