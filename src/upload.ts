import {
  deleteAllFiles,
  uploadAllFiles,
  generateBucketName,
  createStaticBucket,
  verifyIfBucketWasAlreadCreated,
} from './utils';
import github from '@actions/github';

type Main = () => Promise<void>

export const main: Main = async () => {
  try {
    console.info('Executing main function.');
    console.info('Workspace: ', process.env.GITHUB_WORKSPACE || 'local');
    console.info('Proccess Path:', process.cwd());
    const Bucket = generateBucketName();
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

main().then(console.log)
