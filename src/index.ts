import { deleteAction } from "./delete";
import { uploadAction } from "./upload";
import core from '@actions/core';

export const main = async () => {
  try {
    if(process.env.ACTION === 'delete') {
      await deleteAction();
      return;
    }
    await uploadAction();
  } catch (error) {
    core.setFailed(`Error: ${error}`);
  }
}
