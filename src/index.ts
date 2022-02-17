import log from 'loglevel';
import { deleteAction } from "./delete";
import { uploadAction } from "./upload";
import core from '@actions/core';

export const main = async () => {
  log.setLevel(process.env.LOG_LEVEL as any || 'info');
  try {
    log.info(`The action is executing the delete function`);
    if(process.env.ACTION === 'delete') {
      await deleteAction();
      return;
    }
    log.info(`The action is executing the upload function`);
    await uploadAction();
  } catch (error) {
    core.setFailed(`Error: ${error}`);
  }
}

main();
