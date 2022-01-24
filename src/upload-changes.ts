import {
  deleteAllFiles,
  uploadAllFiles,
  generateBucketName,
  createStaticBucket,
  verifyIfBucketWasAlreadCreated,
} from './utils';

export async function uploadChanges(project: string, branchName: string): Promise<void> {
  const bucketName = generateBucketName(project, branchName);
  const isBucketAlreadyCreated = await verifyIfBucketWasAlreadCreated(bucketName);
  if(isBucketAlreadyCreated) {
    await deleteAllFiles(bucketName);
    await uploadAllFiles(bucketName);
    return;
  }
  await createStaticBucket(bucketName);
  await uploadAllFiles(bucketName);
}
