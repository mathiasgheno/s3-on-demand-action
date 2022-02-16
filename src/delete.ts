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
    console.info('Executing main function.');
    console.info('Workspace: ', getWorkspace());
    const Bucket = generateBucketName();
    console.info(`Bucket name to delete: ${Bucket}`);
    const isBucketAlreadyCreated = await verifyIfBucketWasAlreadCreated(Bucket);
    if(isBucketAlreadyCreated) {
      console.info(`Bucket already created, updating files...`);
      await deleteAllFiles(Bucket);
      await deleteBucket(Bucket);
      return;
    }
    console.info(`There is no Bucket with name ${Bucket}. Nothing was done`);
  } catch (e) {
    console.error(`An error occurred while executing the main function of delete: ${e}`);
  }
}
