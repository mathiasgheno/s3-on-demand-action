import { createBucket } from "../createBucket/createBucket";
import { configurePublicAccess } from "../configurePublicAccess/configurePublicAccess";
import { configureStaticContent } from "../configureStaticBucket/configureStaticBucket";
import { getBucketUrl } from "../getBucketUrl/getBucketUrl";

export type CreateStaticBucket = (Bucket: string) => Promise<string>;

export const createStaticBucket: CreateStaticBucket = async (Bucket) => {
  try {
    await createBucket(Bucket);
    await configurePublicAccess(Bucket);
    await configureStaticContent(Bucket);
    return getBucketUrl(Bucket);
  } catch (erro) {
    const message = `An erro has ocorred in deleteBucketCallback while trying to create Bucket ${Bucket}: ${erro}`;
    throw new Error(message);
  }
}

createStaticBucket('mathiasgheno-vanilla-modal-on-demand-test-4').then(console.log);
