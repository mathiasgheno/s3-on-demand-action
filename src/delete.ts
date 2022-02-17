import log from 'loglevel';
import {
  deleteAllFiles,
  generateBucketName,
  verifyIfBucketWasAlreadCreated,
} from './utils';
import { getWorkspace } from "./utils/getWorkspace/getWorkspace";
import {deleteBucket} from "./utils/deleteBucket/deleteBucket";

type DeleteAction = () => Promise<void>

export const deleteAction: DeleteAction = async () => {
  try {
    log.info('Executing main function.');
    log.info('Workspace: ', getWorkspace());
    const Bucket = generateBucketName();
    log.info(`Bucket name to delete: ${Bucket}`);
    const isBucketAlreadyCreated = await verifyIfBucketWasAlreadCreated(Bucket);
    if(isBucketAlreadyCreated) {
      log.info(`Bucket already created, updating files...`);
      await deleteAllFiles(Bucket);
      await deleteBucket(Bucket);
      return;
    }
    log.info(`There is no Bucket with name ${Bucket}. Nothing was done`);
  } catch (e) {
    log.error(`An error occurred while executing the main function of delete: ${e}`);
  }
}
