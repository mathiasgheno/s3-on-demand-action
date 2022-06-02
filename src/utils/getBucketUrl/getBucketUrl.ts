import { CONFIGS } from "../../configs/configs";

export type GetBucketUrl = (Bucket: string) => string;

export const getBucketUrl: GetBucketUrl = (Bucket) => {
  return `http://${Bucket}.s3-website.${CONFIGS.region}.amazonaws.com/`;
}

export const getBuckeDomain: GetBucketUrl = (Bucket) => {
  return `${Bucket}.s3-website.${CONFIGS.region}.amazonaws.com`;
}
