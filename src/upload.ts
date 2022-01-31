import {
  deleteAllFiles,
  uploadAllFiles,
  generateBucketName,
  createStaticBucket,
  verifyIfBucketWasAlreadCreated,
} from './utils';

type Main = (project: string, branchName: string) => Promise<void>

export const main: Main = async (project, branch) => {
  const Bucket = generateBucketName(project, branch);
  const isBucketAlreadyCreated = await verifyIfBucketWasAlreadCreated(Bucket);
  if(isBucketAlreadyCreated) {
    await deleteAllFiles(Bucket);
    await uploadAllFiles(Bucket);
    return;
  }
  await createStaticBucket(Bucket);
  await uploadAllFiles(Bucket);
}

// main('vanilla-modal-on-demand', 'test-6').then(console.log)
