import log from 'loglevel';
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
    log.info('Executing main function.');
    log.info('Workspace: ', getWorkspace());
    const Bucket = generateBucketName();
    log.info(`Bucket name created: ${Bucket}`);
    const isBucketAlreadyCreated = await verifyIfBucketWasAlreadCreated(Bucket);
    if(isBucketAlreadyCreated) {
      log.info(`Bucket already created, updating files...`);
      await deleteAllFiles(Bucket);
      await uploadAllFiles(Bucket);
      return;
    }
    log.info(`Bucket is not present, creating new Bucket...`);
    await createStaticBucket(Bucket);
    await uploadAllFiles(Bucket);
  } catch (e) {
    log.error(`An error occurred while executing the main function of upload: ${e}`);
  }
}
