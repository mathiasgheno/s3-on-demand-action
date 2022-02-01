import {
  deleteAllFiles,
  uploadAllFiles,
  generateBucketName,
  createStaticBucket,
  verifyIfBucketWasAlreadCreated,
} from './utils';

type Main = (project: string, branchName: string) => Promise<void>

export const main: Main = async (project, branch) => {
  try {
    console.info('Executing main function.');
    const Bucket = generateBucketName(project, branch);
    console.info(`Bucket name created: ${Bucket}`);
    const isBucketAlreadyCreated = await verifyIfBucketWasAlreadCreated(Bucket);
    if(isBucketAlreadyCreated) {
      console.info(`Bucket already created, updating files...`);
      await deleteAllFiles(Bucket);
      await uploadAllFiles(Bucket);
      return;
    }
    console.info(`Bucket is not present, creating new Bucket...`);
    await createStaticBucket(Bucket);
    await uploadAllFiles(Bucket);
  } catch (e) {
    console.error(`An error occurred while executing the main function: ${e}`);
  }
}

main('vanilla-modal-on-demand', 'test-6').then(console.log)
