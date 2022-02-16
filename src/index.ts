import { deleteAction } from "./delete";
import { uploadAction } from "./upload";
import core from '@actions/core';

export const main = async () => {
  try {
    console.info(`The action is executing the delete function`);
    if(process.env.ACTION === 'delete') {
      await deleteAction();
      return;
    }
    console.info(`The action is executing the upload function`);
    await uploadAction();
  } catch (error) {
    core.setFailed(`Error: ${error}`);
  }
}

main();
