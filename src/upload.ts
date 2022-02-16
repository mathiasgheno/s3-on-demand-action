import {
  deleteAllFiles,
  uploadAllFiles,
  generateBucketName,
  createStaticBucket,
  verifyIfBucketWasAlreadCreated,
} from './utils';
import { getWorkspace } from "./utils/getWorkspace/getWorkspace";

type UploadAction = () => Promise<void>

export const uploadAction: UploadAction = async () => {
  try {
    console.info('Executing main function.');
    console.info('Workspace: ', getWorkspace());
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
    console.error(`An error occurred while executing the main function of upload: ${e}`);
  }
}
